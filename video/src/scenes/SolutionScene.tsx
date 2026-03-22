import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {PhoneRing} from '../components/PhoneRing';
import {ChatBubble} from '../components/ChatBubble';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 10, y: 40, size: 100, color: theme.colors.primary, opacity: 0.08, speed: 0.7},
  {x: 85, y: 20, size: 80, color: theme.colors.accent, opacity: 0.1, speed: 1.0},
  {x: 60, y: 75, size: 110, color: theme.colors.secondary, opacity: 0.06, speed: 0.9},
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoScale = spring({frame, fps, config: {damping: 12, stiffness: 100}});
  const phoneEnterFrame = 6 * FPS;
  const sophieBubbleFrame = 10 * FPS;
  const taglineFrame = 18 * FPS;
  const taglineOpacity = interpolate(frame, [taglineFrame, taglineFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [phoneEnterFrame - 10, phoneEnterFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const phoneOpacity = interpolate(
    frame,
    [sophieBubbleFrame - 10, sophieBubbleFrame],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const chatOpacity = interpolate(frame, [taglineFrame - 10, taglineFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          opacity: titleOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 200}} />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 52,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Lonesome No More
        </h1>
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 26,
            color: theme.colors.text,
            opacity: 0.7,
            margin: 0,
          }}
        >
          A companion who calls your loved one by name
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phoneOpacity,
        }}
      >
        <PhoneRing startFrame={phoneEnterFrame} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 200px',
          opacity: chatOpacity,
        }}
      >
        <ChatBubble
          speaker="sophie"
          text="Good morning, Maggie! Did Emma ever get the hang of that bicycle?"
          enterFrame={sophieBubbleFrame}
          avatarSrc={staticFile('sophie.jpg')}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: taglineOpacity,
          gap: 16,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 48,
            color: theme.colors.text,
            textAlign: 'center',
            margin: 0,
          }}
        >
          No apps. No tablets. No learning curve.
        </h2>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            color: theme.colors.secondary,
            margin: 0,
          }}
        >
          Just pick up the phone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

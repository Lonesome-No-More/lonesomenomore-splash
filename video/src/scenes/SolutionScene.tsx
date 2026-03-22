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
import {ConversationThread} from '../components/ConversationThread';
import {VoiceWaveform} from '../components/VoiceWaveform';
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

  // Phase 1: Logo + tagline (0-4s)
  const logoScale = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const logoOut = interpolate(frame, [3.5 * FPS, 4 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Phone ring + "Sophie is calling" (4-7s)
  const phoneIn = interpolate(frame, [3.5 * FPS, 4 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phoneOut = interpolate(frame, [6.5 * FPS, 7 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Conversation thread with waveform (7-15s)
  const chatIn = interpolate(frame, [6.5 * FPS, 7 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Logo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          opacity: logoOut,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 160}} />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 48,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Lonesome No More
        </h1>
        <div
          style={{
            width: 60,
            height: 3,
            backgroundColor: theme.colors.secondary,
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 22,
            color: theme.colors.text,
            opacity: 0.6,
            margin: 0,
          }}
        >
          A companion who's always just a phone call away
        </p>
      </div>

      {/* Phase 2: Phone ringing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.min(phoneIn, phoneOut),
        }}
      >
        <PhoneRing startFrame={4 * FPS} />
      </div>

      {/* Phase 3: Conversation with waveform */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          opacity: chatIn,
        }}
      >
        {/* Active call header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(95,122,97,0.06)',
            borderRadius: 12,
            padding: '10px 24px',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              boxShadow: '0 0 6px rgba(76,175,80,0.4)',
            }}
          />
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 15,
              color: theme.colors.primary,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Live Call
          </span>
          <VoiceWaveform
            startFrame={7.5 * FPS}
            durationFrames={8 * FPS}
            color={theme.colors.primary}
            barCount={20}
            width={120}
            height={24}
          />
        </div>

        <ConversationThread
          avatarSrc={staticFile('sophie.jpg')}
          messages={[
            {speaker: 'sophie', text: 'Good morning, Maggie! Did Emma ever learn to ride that bicycle?', delay: 7.5 * FPS},
            {speaker: 'maggie', text: 'She did! Rode all the way down the driveway yesterday!', delay: 10 * FPS},
            {speaker: 'sophie', text: 'Oh, that\'s wonderful! I bet you were so proud watching her.', delay: 12.5 * FPS},
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

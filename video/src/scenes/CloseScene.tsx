import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 67-75s (8s = 240 frames)
// Audio: narrator-close at 0s (4.8s) → ends 4.8s

const ORBS = [
  {x: 30, y: 40, size: 120, color: theme.colors.primary, opacity: 0.08, speed: 0.5},
  {x: 65, y: 25, size: 90, color: theme.colors.accent, opacity: 0.1, speed: 0.7},
  {x: 50, y: 70, size: 100, color: theme.colors.secondary, opacity: 0.06, speed: 0.8},
];

export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoProgress = spring({frame, fps, config: {damping: 14, stiffness: 80}});

  const contactOpacity = interpolate(frame, [3 * FPS, 3.5 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #fffefb 0%, ${theme.colors.bgWarm} 50%, #f0e8d8 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <FloatingOrbs orbs={ORBS} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          opacity: logoProgress,
          transform: `scale(${0.95 + logoProgress * 0.05})`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 140, marginBottom: 4}} />

        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 40,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Companionship for your loved ones.
        </h1>

        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 28,
            color: theme.colors.secondary,
            margin: 0,
          }}
        >
          Peace of mind for you.
        </p>

        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: theme.colors.accent,
            borderRadius: 1,
            margin: '4px 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: contactOpacity,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 17,
              color: theme.colors.text,
              opacity: 0.5,
              letterSpacing: 1,
            }}
          >
            Contact us for more information
          </div>
          <div
            style={{
              display: 'flex',
              gap: 40,
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: theme.colors.text,
            }}
          >
            <span style={{fontWeight: 600}}>(833) 817-4646</span>
            <span>lonesomenomore.com</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

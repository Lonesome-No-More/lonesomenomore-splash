import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {PhoneRing} from '../components/PhoneRing';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 0-5.5s (165 frames)
// Audio: narrator-open at 0s (2.5s)
// Visuals: narrator text 0-3s, then phone ring 3-5.5s

const ORBS = [
  {x: 30, y: 40, size: 140, color: theme.colors.primary, opacity: 0.06, speed: 0.4},
  {x: 70, y: 60, size: 100, color: theme.colors.secondary, opacity: 0.04, speed: 0.7},
];

export const OpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Narrator text
  const textOpacity = interpolate(frame, [0, 8, 2.5 * FPS, 3 * FPS], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textScale = spring({frame, fps, config: {damping: 20, stiffness: 100}});

  // Phone ring
  const phoneOpacity = interpolate(frame, [2.5 * FPS, 3 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Time card
  const timeOpacity = interpolate(frame, [3.5 * FPS, 4 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #3a5440 0%, ${theme.colors.bgDark} 60%, #1a2a1d 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingOrbs orbs={ORBS} />

      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Narrator text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          opacity: textOpacity,
          transform: `scale(${0.98 + textScale * 0.02})`,
        }}
      >
        <div
          style={{
            width: interpolate(frame, [0, 15], [0, 48], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            height: 2,
            backgroundColor: theme.colors.accent,
            borderRadius: 1,
          }}
        />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 52,
            color: theme.colors.textLight,
            textAlign: 'center',
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.4,
            padding: '0 200px',
          }}
        >
          What if your mom had someone
          <br />
          to talk to every day?
        </h1>
      </div>

      {/* Phone ring + time card */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          opacity: phoneOpacity,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: timeOpacity,
          }}
        >
          Tuesday morning • 9:15 AM
        </div>
        <PhoneRing startFrame={3 * FPS} label="Sophie is calling Maggie..." />
      </div>
    </AbsoluteFill>
  );
};

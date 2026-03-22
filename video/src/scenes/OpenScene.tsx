import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {ParticleField} from '../components/ParticleField';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 0-5s (150 frames)
// Audio: narrator-open at 0s (2.8s)

const ORBS = [
  {x: 30, y: 40, size: 160, color: theme.colors.primary, opacity: 0.06, speed: 0.4},
  {x: 70, y: 55, size: 120, color: theme.colors.secondary, opacity: 0.04, speed: 0.6},
  {x: 20, y: 70, size: 100, color: theme.colors.accent, opacity: 0.03, speed: 0.8},
];

export const OpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const textScale = spring({frame, fps, config: {damping: 20, stiffness: 100}});
  const textOpacity = interpolate(frame, [0, 8, 4 * FPS, 5 * FPS], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gradient shift
  const gradAngle = 135 + Math.sin(frame * 0.01) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, #1a2a1d 0%, #2C3E2F 30%, #3a5440 60%, #1a2a1d 100%)`,
      }}
    >
      <FloatingOrbs orbs={ORBS} />
      <ParticleField count={50} color="rgba(232,170,107,0.12)" speed={0.6} />

      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors.primary}15 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />

      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          opacity: textOpacity,
          transform: `scale(${0.98 + textScale * 0.02})`,
        }}
      >
        <div style={{
          width: interpolate(frame, [0, 15], [0, 48], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          height: 2, backgroundColor: theme.colors.accent, borderRadius: 1,
        }} />
        <h1 style={{
          fontFamily: theme.fonts.heading, fontSize: 52, color: theme.colors.textLight,
          textAlign: 'center', margin: 0, fontWeight: 400, lineHeight: 1.4, padding: '0 200px',
        }}>
          What if your mom had someone
          <br />to talk to every day?
        </h1>
      </div>
    </AbsoluteFill>
  );
};

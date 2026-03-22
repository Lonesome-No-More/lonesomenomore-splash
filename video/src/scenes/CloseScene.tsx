import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {ParticleField} from '../components/ParticleField';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 52-60s (8s = 240 frames)
// Audio: narrator-close at 0s (4.7s)

const ORBS = [
  {x: 30, y: 35, size: 130, color: theme.colors.primary, opacity: 0.07, speed: 0.4},
  {x: 65, y: 60, size: 100, color: theme.colors.accent, opacity: 0.08, speed: 0.6},
  {x: 50, y: 20, size: 90, color: theme.colors.secondary, opacity: 0.05, speed: 0.7},
];

export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoProgress = spring({frame, fps, config: {damping: 14, stiffness: 80}});
  const contactOpacity = interpolate(frame, [3 * FPS, 3.5 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const gradAngle = 135 + Math.sin(frame * 0.01) * 8;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, #fffefb 0%, ${theme.colors.bgWarm} 40%, #f0e8d8 70%, #ede4d4 100%)`,
      }}
    >
      <FloatingOrbs orbs={ORBS} />
      <ParticleField count={30} color={`${theme.colors.primary}0a`} speed={0.3} />

      {/* Accent glows */}
      <div style={{
        position: 'absolute', top: '30%', right: '20%',
        width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors.accent}10 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />

      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 20,
          opacity: logoProgress,
          transform: `scale(${0.95 + logoProgress * 0.05})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 140, marginBottom: 4}} />

        <h1 style={{
          fontFamily: theme.fonts.heading, fontSize: 40,
          color: theme.colors.primary, textAlign: 'center', margin: 0, fontWeight: 400,
        }}>
          Companionship for your loved ones.
        </h1>

        <p style={{
          fontFamily: theme.fonts.heading, fontSize: 28,
          color: theme.colors.secondary, margin: 0,
        }}>
          Peace of mind for you.
        </p>

        <div style={{
          width: 60, height: 2, backgroundColor: theme.colors.accent, borderRadius: 1, margin: '4px 0',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: contactOpacity,
        }}>
          <div style={{
            fontFamily: theme.fonts.body, fontSize: 17,
            color: theme.colors.text, opacity: 0.5, letterSpacing: 1,
          }}>
            Contact us for more information
          </div>
          <div style={{
            display: 'flex', gap: 40,
            fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.text,
          }}>
            <span style={{fontWeight: 600}}>(833) 817-4646</span>
            <span>lonesomenomore.com</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

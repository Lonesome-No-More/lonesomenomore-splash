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
import {GlassCard} from '../components/GlassCard';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 30, y: 40, size: 100, color: theme.colors.primary, opacity: 0.1, speed: 0.6},
  {x: 65, y: 25, size: 80, color: theme.colors.accent, opacity: 0.12, speed: 0.8},
  {x: 50, y: 70, size: 90, color: theme.colors.secondary, opacity: 0.08, speed: 1.0},
];

const HIGHLIGHTS = [
  'Talked about Emma\'s first bike ride',
  'Discussed the new mystery novel',
  'Played Chopin\'s Nocturne on the piano',
];

export const PeaceOfMindScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const summaryCardFrame = 0.5 * FPS;
  const summaryOpacity = interpolate(frame, [6 * FPS, 7 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaFrame = 7 * FPS;
  const ctaProgress = spring({
    frame: frame - ctaFrame,
    fps,
    config: {damping: 14, stiffness: 80},
  });
  const ctaOpacity = frame >= ctaFrame ? ctaProgress : 0;

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: summaryOpacity,
        }}
      >
        <GlassCard
          enterFrame={summaryCardFrame}
          width={600}
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(95,122,97,0.12)',
            padding: 40,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: theme.colors.primary,
              marginBottom: 8,
            }}
          >
            Weekly Summary
          </div>
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 28,
              color: theme.colors.text,
              margin: '0 0 20px',
            }}
          >
            Maggie had a wonderful week
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {HIGHLIGHTS.map((highlight, i) => {
              const itemOpacity = interpolate(
                frame,
                [summaryCardFrame + (i + 1) * 12, summaryCardFrame + (i + 1) * 12 + 10],
                [0, 1],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
              );
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: itemOpacity,
                    fontFamily: theme.fonts.body,
                    fontSize: 20,
                    color: theme.colors.text,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.accent,
                      flexShrink: 0,
                    }}
                  />
                  {highlight}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          opacity: ctaOpacity,
          transform: `scale(${0.9 + ctaProgress * 0.1})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 160, marginBottom: 8}} />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 44,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Companionship for your loved ones.
        </h1>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 32,
            color: theme.colors.secondary,
            margin: 0,
          }}
        >
          Peace of mind for you.
        </p>

        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: theme.colors.accent,
            borderRadius: 2,
            margin: '8px 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: 48,
            fontFamily: theme.fonts.body,
            fontSize: 24,
            color: theme.colors.text,
          }}
        >
          <span>(833) 817-4646</span>
          <span>lonesomenomore.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const STATS = [
  {text: '43% of seniors\nreport feeling lonely', from: 0.5 * FPS, to: 6.5 * FPS},
  {text: 'Over 8 million\nlive completely alone', from: 7 * FPS, to: 13 * FPS},
  {text: 'For their families...\nthere\'s the worry.', from: 13.5 * FPS, to: 20 * FPS},
];

const ORBS = [
  {x: 15, y: 25, size: 120, color: theme.colors.primary, opacity: 0.12, speed: 0.8},
  {x: 75, y: 65, size: 90, color: theme.colors.secondary, opacity: 0.08, speed: 1.1},
  {x: 45, y: 15, size: 100, color: theme.colors.accent, opacity: 0.06, speed: 0.6},
  {x: 80, y: 20, size: 70, color: theme.colors.primary, opacity: 0.1, speed: 1.3},
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bgDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingOrbs orbs={ORBS} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {STATS.map((stat, i) => {
        const fadeIn = interpolate(frame, [stat.from, stat.from + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(frame, [stat.to - 15, stat.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const translateY = interpolate(frame, [stat.from, stat.from + 12], [20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              opacity,
              transform: `translateY(${translateY}px)`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 56,
                color: theme.colors.textLight,
                lineHeight: 1.4,
                whiteSpace: 'pre-line',
              }}
            >
              {stat.text}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: theme.colors.bgDark,
          opacity: interpolate(frame, [22 * FPS, 24 * FPS], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};

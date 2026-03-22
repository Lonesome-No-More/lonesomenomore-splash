import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Rapid-fire stats, tight timing — 15s total
const STATS = [
  {text: '43% of seniors feel lonely', from: 0.3 * FPS, to: 3.5 * FPS},
  {text: '8 million live completely alone', from: 3.8 * FPS, to: 7 * FPS},
  {text: '1 in 4 go days without a conversation', from: 7.3 * FPS, to: 10.5 * FPS},
  {text: 'For their families — there\'s the worry.', from: 10.8 * FPS, to: 14 * FPS},
];

const ORBS = [
  {x: 15, y: 25, size: 120, color: theme.colors.primary, opacity: 0.12, speed: 0.8},
  {x: 75, y: 65, size: 90, color: theme.colors.secondary, opacity: 0.08, speed: 1.1},
  {x: 45, y: 15, size: 100, color: theme.colors.accent, opacity: 0.06, speed: 0.6},
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

      {/* Counter in corner showing growing number */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 80,
          fontFamily: theme.fonts.body,
          fontSize: 14,
          color: theme.colors.accent,
          opacity: 0.5,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {frame < 14 * FPS && 'The loneliness epidemic'}
      </div>

      {/* Progress bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          backgroundColor: theme.colors.secondary,
          opacity: 0.4,
          width: `${interpolate(frame, [0, 14 * FPS], [0, 100], {
            extrapolateRight: 'clamp',
          })}%`,
        }}
      />

      {STATS.map((stat, i) => {
        const fadeIn = interpolate(frame, [stat.from, stat.from + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(frame, [stat.to - 8, stat.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const translateY = interpolate(frame, [stat.from, stat.from + 8], [12, 0], {
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
              padding: '0 200px',
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: i === 3 ? 52 : 48,
                color: theme.colors.textLight,
                lineHeight: 1.3,
                fontStyle: i === 3 ? 'italic' : 'normal',
              }}
            >
              {stat.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

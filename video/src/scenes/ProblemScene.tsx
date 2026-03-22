import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene duration: 16.5s (495 frames)
// 4 audio clips, text appears WITH each clip:
//
//   0.0s  "Millions of seniors..."   (2.7s) → visual 0-3.2s
//   3.2s  "No visitors. No calls..." (3.0s) → visual 3.2-6.7s
//   6.7s  "And for their families..."(2.5s) → visual 6.7-9.7s
//   9.7s  "The guilt of not being..."(5.8s) → visual 9.7-15.5s

interface Beat {
  text: string;
  sub?: string;
  from: number;
  to: number;
}

const BEATS: Beat[] = [
  {
    text: 'Millions of seniors spend\ntheir days in silence.',
    from: 0 * FPS,
    to: 3.2 * FPS,
  },
  {
    text: 'No visitors. No calls.\nJust the quiet.',
    sub: '8 million seniors live completely alone',
    from: 3.2 * FPS,
    to: 6.7 * FPS,
  },
  {
    text: 'And for their families —\nthere\'s the worry.',
    from: 6.7 * FPS,
    to: 9.7 * FPS,
  },
  {
    text: 'The wish that someone —\nanyone — could just check in.',
    sub: '1 in 4 go days without a single conversation',
    from: 9.7 * FPS,
    to: 15.5 * FPS,
  },
];

const ORBS = [
  {x: 10, y: 20, size: 160, color: theme.colors.primary, opacity: 0.08, speed: 0.5},
  {x: 80, y: 70, size: 120, color: theme.colors.secondary, opacity: 0.06, speed: 0.8},
  {x: 50, y: 10, size: 100, color: '#4a6b4d', opacity: 0.04, speed: 0.3},
  {x: 30, y: 80, size: 80, color: theme.colors.accent, opacity: 0.05, speed: 1.0},
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, #3a5440 0%, ${theme.colors.bgDark} 60%, #1a2a1d 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingOrbs orbs={ORBS} />

      {/* Subtle dot grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative vertical line */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: '15%',
          bottom: '15%',
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}40, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: '20%',
          bottom: '20%',
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${theme.colors.secondary}30, transparent)`,
        }}
      />

      {/* Progress indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        {BEATS.map((_, i) => {
          const active = frame >= BEATS[i].from && frame < BEATS[i].to;
          const past = frame >= BEATS[i].to;
          return (
            <div
              key={i}
              style={{
                width: active ? 32 : 8,
                height: 4,
                borderRadius: 2,
                backgroundColor: active
                  ? theme.colors.accent
                  : past
                    ? theme.colors.primary
                    : 'rgba(255,255,255,0.15)',
                transition: 'width 0.3s',
              }}
            />
          );
        })}
      </div>

      {/* Main text beats — appear WITH audio */}
      {BEATS.map((beat, i) => {
        const fadeIn = interpolate(frame, [beat.from, beat.from + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(frame, [beat.to - 8, beat.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);

        const scaleProgress = spring({
          frame: Math.max(0, frame - beat.from),
          fps,
          config: {damping: 20, stiffness: 120},
        });
        const scale = 0.97 + scaleProgress * 0.03;

        // Subtitle fades in slightly after main text
        const subOpacity = beat.sub
          ? interpolate(frame, [beat.from + 15, beat.from + 25], [0, 0.5], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) * fadeOut
          : 0;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              opacity,
              transform: `scale(${scale})`,
              textAlign: 'center',
              padding: '0 200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Accent line above text */}
            <div
              style={{
                width: interpolate(frame, [beat.from, beat.from + 12], [0, 48], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                height: 2,
                backgroundColor: i === 2 ? theme.colors.secondary : theme.colors.accent,
                borderRadius: 1,
              }}
            />

            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: i === 2 || i === 3 ? 50 : 48,
                color: theme.colors.textLight,
                lineHeight: 1.35,
                whiteSpace: 'pre-line',
                fontWeight: i === 2 ? 400 : 300,
                letterSpacing: '-0.5px',
              }}
            >
              {beat.text}
            </div>

            {/* Stat subtitle */}
            {beat.sub && (
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  color: theme.colors.accent,
                  opacity: subOpacity,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {beat.sub}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

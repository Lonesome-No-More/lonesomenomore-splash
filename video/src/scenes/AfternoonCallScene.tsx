import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {CallScreen} from '../components/CallScreen';
import {GlassCard} from '../components/GlassCard';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 35-67s (32s = 960 frames)
// Audio cues (relative to scene start, subtract 35s):
//   1.0s  sophie-afternoon-1  (5.9s) → ends 6.9
//   7.1s  maggie-afternoon-1  (8.2s) → ends 15.3
//  15.5s  sophie-afternoon-2  (2.7s) → ends 18.2
//  18.4s  maggie-afternoon-2  (3.5s) → ends 21.9
//  22.1s  sophie-afternoon-3  (7.4s) → ends 29.5
//  29.5-32s: family dashboard

const ORBS = [
  {x: 40, y: 50, size: 100, color: theme.colors.primary, opacity: 0.08, speed: 0.5},
  {x: 70, y: 30, size: 80, color: theme.colors.accent, opacity: 0.1, speed: 0.7},
];

const HIGHLIGHTS = [
  {icon: '🚲', text: 'Talked about Emma\'s bike ride'},
  {icon: '📖', text: 'Finished her mystery novel'},
  {icon: '🥟', text: 'Made celebration dumplings'},
];

export const AfternoonCallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // "Later that day" card (0-1.5s)
  const laterOpacity = interpolate(frame, [0, 8, 1 * FPS, 1.5 * FPS], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Call screen (1-29.5s)
  const callIn = interpolate(frame, [0.8 * FPS, 1.2 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const callOut = interpolate(frame, [29 * FPS, 29.5 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Family dashboard (29.5-32s)
  const dashIn = interpolate(frame, [29 * FPS, 29.5 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* "Later that day" transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.colors.bgDark,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: laterOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 14,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Later that day
        </div>
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Tuesday 3:30 PM
        </div>
      </div>

      {/* Call screen */}
      <div style={{position: 'absolute', inset: 0, opacity: Math.min(callIn, callOut)}}>
        <CallScreen
          timeLabel="Tuesday 3:30 PM"
          callNumber="#13"
          lines={[
            {speaker: 'sophie', text: "So tell me, how's that mystery novel going? Last time you said the detective was completely lost.", startFrame: Math.round(1 * FPS), durationFrames: Math.round(5.9 * FPS)},
            {speaker: 'maggie', text: "Oh, I finished it! And I was right — the butler didn't do it. Forty years as a librarian, you learn to spot the clues.", startFrame: Math.round(7.1 * FPS), durationFrames: Math.round(8.2 * FPS)},
            {speaker: 'sophie', text: "I love that! Have you picked up a new one yet?", startFrame: Math.round(15.5 * FPS), durationFrames: Math.round(2.7 * FPS)},
            {speaker: 'maggie', text: "Not yet. I've been a little tired this week, to be honest.", startFrame: Math.round(18.4 * FPS), durationFrames: Math.round(3.5 * FPS)},
            {speaker: 'sophie', text: "I'm sorry to hear that. Have you been sleeping okay? Sometimes a good cup of Earl Grey and an early night works wonders.", startFrame: Math.round(22.1 * FPS), durationFrames: Math.round(7.4 * FPS)},
          ]}
        />
      </div>

      {/* Family dashboard */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: dashIn,
          background: `radial-gradient(ellipse at 40% 50%, #fffefb 0%, ${theme.colors.bgWarm} 50%, #f0e8d8 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          padding: '0 80px',
        }}
      >
        <FloatingOrbs orbs={ORBS} />

        {/* Summary card */}
        <GlassCard
          enterFrame={29.5 * FPS}
          width={480}
          style={{
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid rgba(95,122,97,0.1)',
            padding: 28,
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 12, textTransform: 'uppercase',
              letterSpacing: 2, color: theme.colors.primary, fontWeight: 600,
            }}>This Week</div>
            <div style={{fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text, opacity: 0.4}}>
              March 15–22
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 20, marginBottom: 18, padding: '10px 0',
            borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}>
            {[
              {label: 'Calls', value: '5'},
              {label: 'Minutes', value: '47'},
              {label: 'Mood', value: '😊'},
            ].map((stat, i) => {
              const sp = spring({frame: frame - (30 * FPS + i * 6), fps, config: {damping: 14, stiffness: 130}});
              const show = frame >= 30 * FPS + i * 6;
              return (
                <div key={i} style={{textAlign: 'center', flex: 1, opacity: show ? sp : 0}}>
                  <div style={{
                    fontFamily: theme.fonts.heading, fontSize: stat.label === 'Mood' ? 22 : 26,
                    color: theme.colors.primary, fontWeight: 700,
                  }}>{stat.value}</div>
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text,
                    opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1,
                  }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {HIGHLIGHTS.map((item, i) => {
              const showAt = 30.5 * FPS + i * 8;
              const show = frame >= showAt;
              const ip = spring({frame: frame - showAt, fps, config: {damping: 16, stiffness: 140}});
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: show ? ip : 0,
                  fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.text,
                }}>
                  <span style={{fontSize: 16}}>{item.icon}</span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Alert card */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <GlassCard enterFrame={30 * FPS} width={320} style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(95,122,97,0.08)', padding: 18,
          }}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 13,
              color: theme.colors.primary, fontWeight: 600, marginBottom: 6,
            }}>📬 Today's Highlight</div>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 14,
              color: theme.colors.text, lineHeight: 1.5, opacity: 0.8,
            }}>
              "Mom finished her mystery novel and was so proud she figured out the ending."
            </div>
          </GlassCard>

          <GlassCard enterFrame={30.5 * FPS} width={320} style={{
            background: 'rgba(212,115,94,0.06)',
            border: '1px solid rgba(212,115,94,0.12)', padding: 18,
          }}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 13,
              color: theme.colors.secondary, fontWeight: 600, marginBottom: 6,
            }}>🔔 Gentle Alert</div>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 14,
              color: theme.colors.text, lineHeight: 1.5, opacity: 0.8,
            }}>
              Maggie mentioned feeling tired this week. You may want to check in.
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

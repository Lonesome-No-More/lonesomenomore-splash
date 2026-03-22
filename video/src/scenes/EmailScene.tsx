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

// Scene: 45-52s (7s = 210 frames)
// No audio — visual only

const ORBS = [
  {x: 75, y: 40, size: 100, color: theme.colors.accent, opacity: 0.05, speed: 0.5},
  {x: 25, y: 65, size: 80, color: theme.colors.primary, opacity: 0.04, speed: 0.6},
];

const HIGHLIGHTS = [
  {icon: '🚲', text: 'Emma rode her bicycle without training wheels!'},
  {icon: '🥟', text: 'Made her famous dumplings to celebrate'},
  {icon: '📖', text: 'Finished her mystery novel'},
];

export const EmailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Email slides in
  const emailProgress = spring({frame, fps, config: {damping: 14, stiffness: 80}});

  const gradAngle = 140 + Math.sin(frame * 0.01) * 6;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, #f5f1ec 0%, ${theme.colors.bgWarm} 40%, #ede7df 100%)`,
      }}
    >
      <FloatingOrbs orbs={ORBS} />
      <ParticleField count={20} color={`${theme.colors.primary}0d`} speed={0.3} />

      {/* Label */}
      <div style={{
        position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)',
        fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text,
        opacity: interpolate(frame, [0, 10], [0, 0.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        letterSpacing: 2, textTransform: 'uppercase',
      }}>
        Sarah's inbox
      </div>

      {/* Email mockup */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: emailProgress,
          transform: `translateY(${(1 - emailProgress) * 20}px)`,
        }}
      >
        <div style={{
          width: 640, background: 'white', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}>
          {/* Email header bar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <Img src={staticFile('logo.png')} style={{width: 24, height: 24}} />
              <div>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 14, fontWeight: 600, color: theme.colors.text,
                }}>Lonesome No More</div>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text, opacity: 0.4,
                }}>weekly-summary@lonesomenomore.com</div>
              </div>
            </div>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.text, opacity: 0.3,
            }}>March 22, 2026</div>
          </div>

          {/* Email body */}
          <div style={{padding: '24px 28px'}}>
            {/* Subject */}
            <div style={{
              fontFamily: theme.fonts.heading, fontSize: 20, color: theme.colors.text,
              marginBottom: 4,
            }}>
              Maggie's Weekly Summary
            </div>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text, opacity: 0.4,
              marginBottom: 20,
            }}>
              March 15 – 22, 2026
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex', gap: 16, marginBottom: 20, padding: '14px 0',
              borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}>
              {[
                {label: 'Calls', value: '5'},
                {label: 'Total Time', value: '47 min'},
                {label: 'Overall Mood', value: '😊 Happy'},
              ].map((stat, i) => {
                const sp = spring({frame: frame - (0.8 * FPS + i * 6), fps, config: {damping: 14, stiffness: 130}});
                const show = frame >= 0.8 * FPS + i * 6;
                return (
                  <div key={i} style={{flex: 1, textAlign: 'center', opacity: show ? sp : 0}}>
                    <div style={{
                      fontFamily: theme.fonts.heading, fontSize: 20, color: theme.colors.primary, fontWeight: 700,
                    }}>{stat.value}</div>
                    <div style={{
                      fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text, opacity: 0.5,
                      textTransform: 'uppercase', letterSpacing: 1,
                    }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Highlights */}
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
              textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 10,
            }}>
              This Week's Highlights
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20}}>
              {HIGHLIGHTS.map((item, i) => {
                const sp = spring({frame: frame - (2 * FPS + i * 8), fps, config: {damping: 16, stiffness: 140}});
                const show = frame >= 2 * FPS + i * 8;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 10px', backgroundColor: 'rgba(95,122,97,0.03)', borderRadius: 8,
                    opacity: show ? sp : 0,
                    fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.text,
                  }}>
                    <span style={{fontSize: 16}}>{item.icon}</span>
                    {item.text}
                  </div>
                );
              })}
            </div>

            {/* Gentle alert */}
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(217,119,6,0.05)',
              borderRadius: 8, borderLeft: '3px solid #D97706',
              opacity: interpolate(frame, [4 * FPS, 4.5 * FPS], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              }),
            }}>
              <div style={{
                fontFamily: theme.fonts.body, fontSize: 12, color: '#92400E',
                fontWeight: 600, marginBottom: 4,
              }}>🔔 Gentle Alert</div>
              <div style={{
                fontFamily: theme.fonts.body, fontSize: 13, color: '#92400E', opacity: 0.8,
                lineHeight: 1.5,
              }}>
                Maggie mentioned feeling tired this week. You may want to check in when you get a chance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
  {icon: '🚲', text: 'Talked about Emma\'s bike ride'},
  {icon: '📖', text: 'Discussed the mystery novel'},
  {icon: '🥟', text: 'Shared her dumpling recipe'},
  {icon: '😊', text: 'Mood: Happy and engaged'},
];

export const PeaceOfMindScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: Dashboard mockup (0-6s)
  const dashOut = interpolate(frame, [5.5 * FPS, 6 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: CTA (6-12s)
  const ctaProgress = spring({
    frame: frame - 6 * FPS,
    fps,
    config: {damping: 14, stiffness: 100},
  });
  const ctaOpacity = frame >= 6 * FPS ? ctaProgress : 0;

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Family dashboard mockup */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 100px',
          opacity: dashOut,
        }}
      >
        {/* Summary card */}
        <GlassCard
          enterFrame={0.5 * FPS}
          width={500}
          style={{
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid rgba(95,122,97,0.1)',
            padding: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: theme.colors.primary,
                fontWeight: 600,
              }}
            >
              Weekly Summary
            </div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: theme.colors.text,
                opacity: 0.4,
              }}
            >
              March 15–22
            </div>
          </div>
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 24,
              color: theme.colors.text,
              margin: '0 0 16px',
            }}
          >
            Maggie had a wonderful week
          </h3>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginBottom: 20,
              padding: '12px 0',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {[
              {label: 'Calls', value: '5'},
              {label: 'Minutes', value: '47'},
              {label: 'Mood', value: '😊'},
            ].map((stat, i) => {
              const statProgress = spring({
                frame: frame - (1 * FPS + i * 8),
                fps,
                config: {damping: 14, stiffness: 130},
              });
              return (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    flex: 1,
                    opacity: frame >= 1 * FPS + i * 8 ? statProgress : 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.fonts.heading,
                      fontSize: stat.label === 'Mood' ? 24 : 28,
                      color: theme.colors.primary,
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.body,
                      fontSize: 12,
                      color: theme.colors.text,
                      opacity: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {HIGHLIGHTS.map((item, i) => {
              const itemProgress = spring({
                frame: frame - (2 * FPS + i * 10),
                fps,
                config: {damping: 16, stiffness: 140},
              });
              const show = frame >= 2 * FPS + i * 10;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    opacity: show ? itemProgress : 0,
                    transform: `translateX(${(1 - (show ? itemProgress : 0)) * -12}px)`,
                    fontFamily: theme.fonts.body,
                    fontSize: 16,
                    color: theme.colors.text,
                  }}
                >
                  <span style={{fontSize: 18}}>{item.icon}</span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Mini notification card */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <GlassCard
            enterFrame={2 * FPS}
            width={340}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(95,122,97,0.08)',
              padding: 20,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: theme.colors.primary,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              📬 Email Notification
            </div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 15,
                color: theme.colors.text,
                lineHeight: 1.5,
                opacity: 0.8,
              }}
            >
              "Mom shared a story about teaching Emma to ride — she was beaming the whole call."
            </div>
          </GlassCard>

          <GlassCard
            enterFrame={3 * FPS}
            width={340}
            style={{
              background: 'rgba(95,122,97,0.06)',
              border: '1px solid rgba(95,122,97,0.1)',
              padding: 20,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: theme.colors.secondary,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              🔔 Gentle Alert
            </div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 15,
                color: theme.colors.text,
                lineHeight: 1.5,
                opacity: 0.8,
              }}
            >
              Maggie mentioned feeling tired this week. You may want to check in.
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Phase 2: CTA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          opacity: ctaOpacity,
          transform: `scale(${0.95 + ctaProgress * 0.05})`,
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
            height: 3,
            backgroundColor: theme.colors.accent,
            borderRadius: 2,
            margin: '4px 0',
          }}
        />

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

        <div
          style={{
            marginTop: 8,
            padding: '10px 28px',
            backgroundColor: theme.colors.secondary,
            borderRadius: 24,
            fontFamily: theme.fonts.body,
            fontSize: 18,
            color: 'white',
            fontWeight: 600,
          }}
        >
          Try the free beta →
        </div>
      </div>
    </AbsoluteFill>
  );
};

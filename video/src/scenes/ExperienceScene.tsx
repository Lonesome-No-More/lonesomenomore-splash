import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {GlassCard} from '../components/GlassCard';
import {ConversationThread} from '../components/ConversationThread';
import {VoiceWaveform} from '../components/VoiceWaveform';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene duration: 21.5s (645 frames)
// Scene starts at global 34s
//
// Audio within this scene (relative to scene start):
//   0.0s  act3-narration-1 (10.8s) → ends 10.8s
//  11.1s  act3-sophie      ( 5.8s) → ends 16.9s  (global 45.1)
//  17.2s  act3-narration-2 ( 3.7s) → ends 20.9s  (global 51.2)
//
// Visual phases:
//   0-6s      Feature cards (during narration-1)
//   6-17s     Split screen: memory sidebar + conversation (sophie at 11.1s)
//  17-21.5s   "Your loved one is never alone" (narration-2 at 17.2s)

const ORBS = [
  {x: 20, y: 30, size: 90, color: theme.colors.accent, opacity: 0.12, speed: 0.9},
  {x: 70, y: 60, size: 110, color: theme.colors.secondary, opacity: 0.08, speed: 0.7},
  {x: 50, y: 80, size: 80, color: theme.colors.primary, opacity: 0.1, speed: 1.2},
];

const FEATURES = [
  {title: 'Truly Personalized', desc: 'Remembers their life story', icon: '💛', enterFrame: 0.5 * FPS},
  {title: 'Available 24/7', desc: 'Any phone, anytime', icon: '📞', enterFrame: 1.5 * FPS},
  {title: 'No Tech Required', desc: 'Just pick up the phone', icon: '✨', enterFrame: 2.5 * FPS},
];

const MEMORIES = [
  '4 grandchildren',
  'Loves mystery novels',
  'Famous dumpling recipe',
  'Retired librarian',
  'Favorite: Earl Grey tea',
];

export const ExperienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: Feature cards (0-6s)
  const cardsOpacity = interpolate(frame, [5.5 * FPS, 6 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 2: Split screen (6-17s)
  const splitIn = interpolate(frame, [5.5 * FPS, 6 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const splitOut = interpolate(frame, [16.5 * FPS, 17 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 3: Closing text (17-21.5s)
  const closingIn = interpolate(frame, [16.5 * FPS, 17 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgSoft}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Feature cards */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 28, padding: '0 100px', opacity: cardsOpacity,
        }}
      >
        {FEATURES.map((feature, i) => (
          <GlassCard
            key={i} enterFrame={feature.enterFrame} width={380}
            style={{
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(95,122,97,0.12)',
              textAlign: 'center', padding: 28,
            }}
          >
            <div style={{fontSize: 40, marginBottom: 10}}>{feature.icon}</div>
            <h3 style={{
              fontFamily: theme.fonts.heading, fontSize: 24,
              color: theme.colors.primary, margin: '0 0 6px',
            }}>
              {feature.title}
            </h3>
            <p style={{
              fontFamily: theme.fonts.body, fontSize: 17,
              color: theme.colors.text, opacity: 0.7, margin: 0,
            }}>
              {feature.desc}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Phase 2: Split screen */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'stretch',
          opacity: Math.min(splitIn, splitOut),
        }}
      >
        {/* Left: Memory sidebar */}
        <div
          style={{
            width: 380, background: 'rgba(95,122,97,0.04)',
            borderRight: '1px solid rgba(95,122,97,0.1)',
            padding: '60px 32px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}
        >
          <div style={{
            fontFamily: theme.fonts.body, fontSize: 12, textTransform: 'uppercase',
            letterSpacing: 2, color: theme.colors.primary, marginBottom: 8, fontWeight: 600,
          }}>
            Maggie's Profile
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: 'white', fontFamily: theme.fonts.body, fontWeight: 700,
            }}>M</div>
            <div>
              <div style={{fontFamily: theme.fonts.heading, fontSize: 20, color: theme.colors.text}}>
                Maggie, 82
              </div>
              <div style={{fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text, opacity: 0.5}}>
                Buffalo, NY
              </div>
            </div>
          </div>

          {MEMORIES.map((memory, i) => {
            const showAt = 6.5 * FPS + i * 12;
            const show = frame >= showAt;
            const itemProgress = spring({
              frame: frame - showAt, fps,
              config: {damping: 16, stiffness: 140},
            });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px',
                background: show ? 'rgba(255,255,255,0.7)' : 'transparent',
                borderRadius: 8,
                opacity: show ? itemProgress : 0,
                transform: `translateX(${(1 - (show ? itemProgress : 0)) * -20}px)`,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  backgroundColor: theme.colors.accent, flexShrink: 0,
                }} />
                <span style={{fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.text}}>
                  {memory}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Second conversation */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 60px',
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: '#4CAF50', boxShadow: '0 0 4px rgba(76,175,80,0.4)',
            }} />
            <span style={{
              fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.primary,
              fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
            }}>
              Conversation #47
            </span>
            <VoiceWaveform
              startFrame={7 * FPS} durationFrames={9 * FPS}
              color={theme.colors.primary} barCount={16} width={100} height={20}
            />
          </div>

          <ConversationThread
            avatarSrc={staticFile('sophie.jpg')}
            messages={[
              {speaker: 'sophie', text: 'You mentioned a new mystery novel last time — how\'s the detective doing?', delay: 7 * FPS},
              {speaker: 'maggie', text: 'Still one step behind! But I think I figured out the twist.', delay: 9.5 * FPS},
              {speaker: 'sophie', text: 'No spoilers! But I love that you\'re always ahead of the detective.', delay: 12 * FPS},
              {speaker: 'maggie', text: 'Ha! Well, 40 years as a librarian teaches you a thing or two.', delay: 14.5 * FPS},
            ]}
          />
        </div>
      </div>

      {/* Phase 3: Closing text */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: closingIn,
        }}
      >
        <h2 style={{
          fontFamily: theme.fonts.heading, fontSize: 44,
          color: theme.colors.primary, textAlign: 'center', margin: 0,
        }}>
          No apps. No tablets. No learning curve.
        </h2>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: 28,
          color: theme.colors.secondary, margin: '12px 0 0',
        }}>
          Your loved one is never alone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

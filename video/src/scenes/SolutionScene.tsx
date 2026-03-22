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
import {PhoneRing} from '../components/PhoneRing';
import {ConversationThread} from '../components/ConversationThread';
import {VoiceWaveform} from '../components/VoiceWaveform';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene duration: 17.5s (525 frames)
// Scene starts at global 16.5s
//
// Audio within this scene (relative to scene start):
//   0.0s  act2-narration-1 (8.8s) → ends 8.8s
//   9.1s  act2-sophie      (3.6s) → ends 12.7s  (global 25.6)
//  13.0s  act2-narration-2 (4.0s) → ends 17.0s  (global 29.5)
//
// Visual phases:
//   0-5s     Logo + tagline (during narration-1)
//   5-8s     Phone ringing (narration-1 continues)
//   8-13s    Conversation thread (sophie clip plays at 9.1s)
//  13-17.5s  "No apps" tagline (narration-2 plays at 13s)

const ORBS = [
  {x: 10, y: 40, size: 100, color: theme.colors.primary, opacity: 0.08, speed: 0.7},
  {x: 85, y: 20, size: 80, color: theme.colors.accent, opacity: 0.1, speed: 1.0},
  {x: 60, y: 75, size: 110, color: theme.colors.secondary, opacity: 0.06, speed: 0.9},
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: Logo (0-5s)
  const logoScale = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const logoOut = interpolate(frame, [4.5 * FPS, 5 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 2: Phone ring (5-8s)
  const phoneIn = interpolate(frame, [4.5 * FPS, 5 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const phoneOut = interpolate(frame, [7.5 * FPS, 8 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 3: Conversation (8-13s) — sophie audio at 9.1s
  const chatIn = interpolate(frame, [7.5 * FPS, 8 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const chatOut = interpolate(frame, [12.5 * FPS, 13 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase 4: Tagline (13-17.5s) — narration-2 at 13s
  const taglineIn = interpolate(frame, [12.5 * FPS, 13 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Logo */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16, opacity: logoOut,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 160}} />
        <h1 style={{
          fontFamily: theme.fonts.heading, fontSize: 48,
          color: theme.colors.primary, textAlign: 'center', margin: 0,
        }}>
          Lonesome No More
        </h1>
        <div style={{width: 60, height: 3, backgroundColor: theme.colors.secondary, borderRadius: 2}} />
        <p style={{
          fontFamily: theme.fonts.body, fontSize: 22,
          color: theme.colors.text, opacity: 0.6, margin: 0,
        }}>
          A companion who's always just a phone call away
        </p>
      </div>

      {/* Phase 2: Phone ringing */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: Math.min(phoneIn, phoneOut),
        }}
      >
        <PhoneRing startFrame={5 * FPS} />
      </div>

      {/* Phase 3: Conversation */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
          opacity: Math.min(chatIn, chatOut),
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(95,122,97,0.06)', borderRadius: 12, padding: '10px 24px',
          marginBottom: 8,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: '#4CAF50', boxShadow: '0 0 6px rgba(76,175,80,0.4)',
          }} />
          <span style={{
            fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.primary,
            fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
          }}>
            Live Call
          </span>
          <VoiceWaveform
            startFrame={8.5 * FPS} durationFrames={4 * FPS}
            color={theme.colors.primary} barCount={20} width={120} height={24}
          />
        </div>
        <ConversationThread
          avatarSrc={staticFile('sophie.jpg')}
          messages={[
            {speaker: 'sophie', text: 'Good morning, Maggie! Did Emma ever learn to ride that bicycle?', delay: 8.5 * FPS},
            {speaker: 'maggie', text: 'She did! Rode all the way down the driveway!', delay: 10 * FPS},
            {speaker: 'sophie', text: 'Oh, that\'s wonderful! I bet you were so proud.', delay: 11.5 * FPS},
          ]}
        />
      </div>

      {/* Phase 4: Tagline */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: taglineIn, gap: 16,
        }}
      >
        <h2 style={{
          fontFamily: theme.fonts.heading, fontSize: 48,
          color: theme.colors.text, textAlign: 'center', margin: 0,
        }}>
          No apps. No tablets. No learning curve.
        </h2>
        <p style={{
          fontFamily: theme.fonts.heading, fontSize: 36,
          color: theme.colors.secondary, margin: 0,
        }}>
          Just pick up the phone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

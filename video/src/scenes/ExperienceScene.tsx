import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, staticFile} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {GlassCard} from '../components/GlassCard';
import {ChatBubble} from '../components/ChatBubble';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 20, y: 30, size: 90, color: theme.colors.accent, opacity: 0.12, speed: 0.9},
  {x: 70, y: 60, size: 110, color: theme.colors.secondary, opacity: 0.08, speed: 0.7},
  {x: 50, y: 80, size: 80, color: theme.colors.primary, opacity: 0.1, speed: 1.2},
];

const FEATURES = [
  {
    title: 'Truly Personalized',
    description: 'Remembers their life story, interests, and family',
    icon: '💛',
    enterFrame: 1 * FPS,
  },
  {
    title: 'Available 24/7',
    description: 'Call anytime, on any phone, from anywhere',
    icon: '📞',
    enterFrame: 3 * FPS,
  },
  {
    title: 'Effortlessly Simple',
    description: 'No apps, no tablets — just a phone call',
    icon: '✨',
    enterFrame: 5 * FPS,
  },
];

export const ExperienceScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cardsOpacity = interpolate(frame, [10 * FPS, 11 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sophieBubbleFrame = 10 * FPS;
  const chatOpacity = interpolate(
    frame,
    [sophieBubbleFrame, sophieBubbleFrame + 10, 20 * FPS, 21 * FPS],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const closingFrame = 21 * FPS;
  const closingOpacity = interpolate(frame, [closingFrame, closingFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgSoft}}>
      <FloatingOrbs orbs={ORBS} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 120px',
          opacity: cardsOpacity,
        }}
      >
        {FEATURES.map((feature, i) => (
          <GlassCard
            key={i}
            enterFrame={feature.enterFrame}
            width={420}
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(95,122,97,0.15)',
              textAlign: 'center',
              padding: 32,
            }}
          >
            <div style={{fontSize: 48, marginBottom: 16}}>{feature.icon}</div>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 28,
                color: theme.colors.primary,
                margin: '0 0 8px',
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 20,
                color: theme.colors.text,
                opacity: 0.8,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {feature.description}
            </p>
          </GlassCard>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 200px',
          opacity: chatOpacity,
        }}
      >
        <ChatBubble
          speaker="sophie"
          text="You mentioned you were trying that new mystery novel. How's the detective — still one step behind?"
          enterFrame={sophieBubbleFrame}
          avatarSrc={staticFile('sophie.jpg')}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: closingOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 48,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Available twenty-four seven.
        </h2>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            color: theme.colors.secondary,
            margin: '16px 0 0',
          }}
        >
          Your loved one is never alone.
        </p>
      </div>
    </AbsoluteFill>
  );
};

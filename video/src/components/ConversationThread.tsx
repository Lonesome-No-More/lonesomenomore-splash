import React from 'react';
import {useCurrentFrame, spring, interpolate, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

interface Message {
  speaker: 'sophie' | 'maggie';
  text: string;
  delay: number; // frames after component mount
}

interface ConversationThreadProps {
  messages: Message[];
  avatarSrc?: string;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  messages,
  avatarSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        width: 700,
      }}
    >
      {messages.map((msg, i) => {
        const elapsed = frame - msg.delay;
        if (elapsed < 0) return null;

        const slideProgress = spring({
          frame: elapsed,
          fps,
          config: {damping: 16, stiffness: 150},
        });

        const isSophie = msg.speaker === 'sophie';
        const accentColor = isSophie ? theme.colors.primary : theme.colors.secondary;
        const speakerName = isSophie ? 'Sophie' : 'Maggie';

        // Fast text reveal
        const charCount = Math.floor(
          interpolate(elapsed, [6, 6 + msg.text.length * 0.6], [0, msg.text.length], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        );

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              opacity: slideProgress,
              transform: `translateX(${(1 - slideProgress) * (isSophie ? -30 : 30)}px)`,
              alignSelf: isSophie ? 'flex-start' : 'flex-end',
              flexDirection: isSophie ? 'row' : 'row-reverse',
            }}
          >
            {isSophie && avatarSrc ? (
              <img
                src={avatarSrc}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontFamily: theme.fonts.body,
                  fontWeight: 700,
                }}
              >
                {speakerName[0]}
              </div>
            )}

            <div
              style={{
                background: isSophie ? 'white' : 'rgba(95,122,97,0.08)',
                borderRadius: 14,
                padding: '10px 16px',
                boxShadow: isSophie ? '0 1px 6px rgba(0,0,0,0.05)' : 'none',
                borderLeft: isSophie ? `3px solid ${accentColor}` : 'none',
                borderRight: !isSophie ? `3px solid ${accentColor}` : 'none',
                fontFamily: theme.fonts.body,
                fontSize: 19,
                color: theme.colors.text,
                lineHeight: 1.45,
                maxWidth: 500,
              }}
            >
              {msg.text.slice(0, charCount)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

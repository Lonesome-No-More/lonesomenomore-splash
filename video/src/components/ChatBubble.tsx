import React from 'react';
import {useCurrentFrame, spring, interpolate, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

interface ChatBubbleProps {
  speaker: 'sophie' | 'maggie';
  text: string;
  enterFrame: number;
  avatarSrc?: string;
  typingDurationFrames?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  speaker,
  text,
  enterFrame,
  avatarSrc,
  typingDurationFrames = 12,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = frame - enterFrame;
  if (elapsed < 0) return null;

  const slideProgress = spring({
    frame: elapsed,
    fps,
    config: {damping: 14, stiffness: 120},
  });

  const translateX = (1 - slideProgress) * -60;
  const opacity = slideProgress;

  const isTyping = elapsed < typingDurationFrames;

  const textElapsed = elapsed - typingDurationFrames;
  const revealFrames = text.length * 1.2;
  const charCount = isTyping
    ? 0
    : Math.floor(
        interpolate(textElapsed, [0, revealFrames], [0, text.length], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      );

  const isSophie = speaker === 'sophie';
  const accentColor = isSophie ? theme.colors.primary : theme.colors.secondary;
  const speakerName = isSophie ? 'Sophie' : 'Maggie';

  const dotOpacity = (dotIndex: number) => {
    const cycle = (elapsed * 4 + dotIndex * 8) % 30;
    return interpolate(cycle, [0, 10, 20, 30], [0.3, 1, 0.3, 0.3]);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        transform: `translateX(${translateX}px)`,
        opacity,
        maxWidth: 800,
      }}
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            flexShrink: 0,
          }}
        />
      )}

      <div>
        <div
          style={{
            fontSize: 16,
            fontFamily: theme.fonts.body,
            fontWeight: 600,
            color: accentColor,
            marginBottom: 6,
          }}
        >
          {speakerName}
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            borderLeft: `3px solid ${accentColor}`,
            fontFamily: theme.fonts.body,
            fontSize: 22,
            color: theme.colors.text,
            lineHeight: 1.5,
            minHeight: 32,
          }}
        >
          {isTyping ? (
            <div style={{display: 'flex', gap: 6, padding: '4px 0'}}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    opacity: dotOpacity(i),
                  }}
                />
              ))}
            </div>
          ) : (
            text.slice(0, charCount)
          )}
        </div>
      </div>
    </div>
  );
};

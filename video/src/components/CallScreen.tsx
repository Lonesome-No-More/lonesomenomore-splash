import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {VoiceWaveform} from './VoiceWaveform';
import {theme} from '../styles/theme';

interface DialogueLine {
  speaker: 'sophie' | 'maggie';
  text: string;
  startFrame: number;
  durationFrames: number;
}

interface CallScreenProps {
  timeLabel: string;
  callNumber?: string;
  lines: DialogueLine[];
  showAvatar?: boolean;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  timeLabel,
  callNumber,
  lines,
  showAvatar = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Find the currently active line
  const activeLine = lines.find(
    (l) => frame >= l.startFrame && frame < l.startFrame + l.durationFrames
  );

  // Call timer (counts up from 0:00)
  const totalSeconds = Math.floor(frame / fps);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const timer = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Avatar pulse when speaking
  const isSophieSpeaking = activeLine?.speaker === 'sophie';
  const pulseScale = isSophieSpeaking
    ? 1 + Math.sin(frame * 0.2) * 0.02
    : 1;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `radial-gradient(ellipse at 50% 30%, #3d5a40 0%, ${theme.colors.bgDark} 70%, #1a2a1d 100%)`,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 60px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              boxShadow: '0 0 8px rgba(76,175,80,0.5)',
            }}
          />
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Active Call {callNumber && `• ${callNumber}`}
          </span>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {timeLabel}
          </span>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {timer}
          </span>
        </div>
      </div>

      {/* Center area — avatar + waveform */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* Sophie avatar with ring */}
        {showAvatar && (
          <div style={{position: 'relative', marginBottom: 8}}>
            {/* Outer ring */}
            <div
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: `2px solid ${isSophieSpeaking ? theme.colors.accent : 'rgba(255,255,255,0.1)'}`,
                opacity: isSophieSpeaking ? 0.6 : 0.3,
              }}
            />
            <Img
              src={staticFile('sophie.jpg')}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                transform: `scale(${pulseScale})`,
                boxShadow: isSophieSpeaking
                  ? `0 0 30px rgba(232,170,107,0.2)`
                  : '0 0 20px rgba(0,0,0,0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                border: '3px solid #2C3E2F',
              }}
            />
          </div>
        )}

        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 28,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 0.5,
          }}
        >
          Sophie
        </div>

        {/* Waveform */}
        {activeLine && (
          <VoiceWaveform
            startFrame={activeLine.startFrame}
            durationFrames={activeLine.durationFrames}
            color={activeLine.speaker === 'sophie' ? theme.colors.accent : theme.colors.secondary}
            barCount={32}
            width={280}
            height={36}
          />
        )}

        {/* Speaker label when Maggie is talking */}
        {activeLine && activeLine.speaker === 'maggie' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: 'white',
                fontFamily: theme.fonts.body,
                fontWeight: 700,
              }}
            >
              M
            </div>
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 14,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Maggie speaking
            </span>
          </div>
        )}
      </div>

      {/* Bottom subtitle area */}
      <div
        style={{
          padding: '0 120px 60px',
          minHeight: 120,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {activeLine && (() => {
          const elapsed = frame - activeLine.startFrame;
          const fadeIn = interpolate(elapsed, [0, 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fadeOut = interpolate(
            elapsed,
            [activeLine.durationFrames - 6, activeLine.durationFrames],
            [1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );

          // Typewriter reveal
          const charCount = Math.floor(
            interpolate(elapsed, [0, activeLine.text.length * 0.7], [0, activeLine.text.length], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          );

          const isSophie = activeLine.speaker === 'sophie';
          const accentColor = isSophie ? theme.colors.primary : theme.colors.secondary;

          return (
            <div
              style={{
                opacity: Math.min(fadeIn, fadeOut),
                textAlign: 'center',
                maxWidth: 900,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  color: accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  marginBottom: 8,
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                {isSophie ? 'Sophie' : 'Maggie'}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                "{activeLine.text.slice(0, charCount)}"
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

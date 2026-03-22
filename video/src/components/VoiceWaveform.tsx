import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface VoiceWaveformProps {
  startFrame: number;
  durationFrames: number;
  color: string;
  barCount?: number;
  width?: number;
  height?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  startFrame,
  durationFrames,
  color,
  barCount = 24,
  width = 200,
  height = 40,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0 || elapsed > durationFrames) return null;

  const overallOpacity = interpolate(
    elapsed,
    [0, 6, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width,
        height,
        opacity: overallOpacity,
      }}
    >
      {Array.from({length: barCount}).map((_, i) => {
        const barHeight =
          (Math.sin(elapsed * 0.3 + i * 0.8) * 0.4 +
            Math.sin(elapsed * 0.5 + i * 1.3) * 0.3 +
            0.3) *
          height;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: Math.max(3, barHeight),
              backgroundColor: color,
              borderRadius: 2,
              opacity: 0.8,
            }}
          />
        );
      })}
    </div>
  );
};

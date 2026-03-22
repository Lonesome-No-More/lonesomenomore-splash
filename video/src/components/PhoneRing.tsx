import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {theme} from '../styles/theme';

interface PhoneRingProps {
  startFrame: number;
  label?: string;
}

export const PhoneRing: React.FC<PhoneRingProps> = ({
  startFrame,
  label = 'Sophie is calling...',
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  const phoneScale = 1 + Math.sin(elapsed * 0.15) * 0.05;

  const rings = [0, 10, 20].map((delay) => {
    const ringElapsed = elapsed - delay;
    if (ringElapsed < 0) return null;

    const cycle = ringElapsed % 45;
    const scale = interpolate(cycle, [0, 45], [1, 3], {extrapolateRight: 'clamp'});
    const opacity = interpolate(cycle, [0, 30, 45], [0.6, 0.2, 0], {extrapolateRight: 'clamp'});

    return {scale, opacity};
  });

  const labelOpacity = interpolate(elapsed, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
      <div style={{position: 'relative', width: 120, height: 120}}>
        {rings.map((ring, i) =>
          ring ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${theme.colors.secondary}`,
                opacity: ring.opacity,
                transform: `scale(${ring.scale})`,
              }}
            />
          ) : null
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${phoneScale})`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill={theme.colors.secondary}>
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
      </div>
      <span
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 28,
          color: theme.colors.text,
          opacity: labelOpacity,
        }}
      >
        {label}
      </span>
    </div>
  );
};

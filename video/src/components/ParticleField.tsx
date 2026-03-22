import React from 'react';
import {useCurrentFrame} from 'remotion';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 40,
  color = 'rgba(255,255,255,0.15)',
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  // Deterministic particle positions from index
  const particles = Array.from({length: count}, (_, i) => {
    const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const seed2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
    const seed3 = Math.sin(i * 419.2 + 77.1) * 43758.5453;

    const baseX = (seed1 - Math.floor(seed1)) * 100;
    const baseY = (seed2 - Math.floor(seed2)) * 100;
    const size = 1 + (seed3 - Math.floor(seed3)) * 2;
    const drift = (seed1 - Math.floor(seed1)) * 2 - 1;

    const x = baseX + Math.sin(frame * 0.002 * speed + i * 0.7) * 8;
    const y = (baseY + frame * 0.015 * speed * (0.5 + drift * 0.5)) % 110 - 5;
    const opacity = 0.3 + Math.sin(frame * 0.03 + i * 1.1) * 0.3;

    return {x, y, size, opacity};
  });

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
}

interface FloatingOrbsProps {
  orbs: Orb[];
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({orbs}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {orbs.map((orb, i) => {
        const xOffset = Math.sin(frame * 0.005 * orb.speed + i * 1.5) * 40;
        const yOffset = Math.cos(frame * 0.003 * orb.speed + i * 2.1) * 30;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              backgroundColor: orb.color,
              opacity: orb.opacity,
              filter: `blur(${orb.size * 0.4}px)`,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

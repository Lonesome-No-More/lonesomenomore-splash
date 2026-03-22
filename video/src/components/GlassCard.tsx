import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

interface GlassCardProps {
  children: React.ReactNode;
  enterFrame: number;
  width?: number;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  enterFrame,
  width = 500,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: {damping: 12, stiffness: 100},
  });

  const translateY = (1 - progress) * 40;
  const opacity = progress;

  return (
    <div
      style={{
        width,
        padding: theme.spacing.lg,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: theme.radius.lg,
        transform: `translateY(${translateY}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

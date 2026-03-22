import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  durationFrames: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  durationFrames,
  style = {},
  showCursor = true,
}) => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [startFrame, startFrame + durationFrames], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const visibleText = text.slice(0, charCount);
  const isTyping = frame >= startFrame && frame <= startFrame + durationFrames;
  const isDone = frame > startFrame + durationFrames;

  const cursorVisible = isTyping || (isDone && Math.floor(frame / 15) % 2 === 0);

  return (
    <span style={style}>
      {visibleText}
      {showCursor && cursorVisible && (
        <span style={{opacity: 0.7}}>|</span>
      )}
    </span>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {OpenScene} from './scenes/OpenScene';
import {SignupScene} from './scenes/SignupScene';
import {CallScene} from './scenes/CallScene';
import {PortalScene} from './scenes/PortalScene';
import {EmailScene} from './scenes/EmailScene';
import {CloseScene} from './scenes/CloseScene';

const FPS = 30;
const TRANSITION = 10;
const HALF = TRANSITION / 2;

// ── 60s Platform Demo Timeline ─────────────────────────────────────
//
//  0-5s     Open: narrator hook
//  5-12s    Signup: form fills in, profile created
//  12-30s   Call: Sophie-Maggie (4 exchanges)
//  30-45s   Portal: conversation detail → dashboard
//  45-52s   Email: weekly summary in inbox
//  52-60s   Close: narrator + logo + contact
//
//  Audio cue points:
//    0.0  narrator-open      (2.8s)
//   12.0  sophie-call-1      (3.5s)
//   15.8  maggie-call-1      (5.7s)
//   21.8  sophie-call-2      (4.5s)
//   26.6  maggie-call-2      (3.2s)
//   52.0  narrator-close     (4.7s)

const SCENES = [
  {Component: OpenScene, from: 0, duration: 5 * FPS},
  {Component: SignupScene, from: 5 * FPS, duration: 7 * FPS},
  {Component: CallScene, from: 12 * FPS, duration: 18 * FPS},
  {Component: PortalScene, from: 30 * FPS, duration: 15 * FPS},
  {Component: EmailScene, from: 45 * FPS, duration: 7 * FPS},
  {Component: CloseScene, from: 52 * FPS, duration: 8 * FPS},
];

const AUDIO = [
  {file: 'narrator-open.mp3', at: 0},
  {file: 'sophie-call-1.mp3', at: 12.0},
  {file: 'maggie-call-1.mp3', at: 15.8},
  {file: 'sophie-call-2.mp3', at: 21.8},
  {file: 'maggie-call-2.mp3', at: 26.6},
  {file: 'narrator-close.mp3', at: 52.0},
];

const SceneWithTransition: React.FC<{
  children: React.ReactNode;
  isFirst: boolean;
  isLast: boolean;
  durationInFrames: number;
}> = ({children, isFirst, isLast, durationInFrames}) => {
  const frame = useCurrentFrame();

  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, HALF], [0, 1], {extrapolateRight: 'clamp'});

  const fadeOut = isLast
    ? 1
    : interpolate(
        frame,
        [durationInFrames - HALF, durationInFrames],
        [1, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );

  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      {children}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {SCENES.map(({Component, from, duration}, i) => {
        const adjustedFrom = i === 0 ? from : from - HALF;
        const adjustedDuration =
          duration + (i === 0 ? 0 : HALF) + (i === SCENES.length - 1 ? 0 : HALF);

        return (
          <Sequence key={i} from={adjustedFrom} durationInFrames={adjustedDuration}>
            <SceneWithTransition
              isFirst={i === 0}
              isLast={i === SCENES.length - 1}
              durationInFrames={adjustedDuration}
            >
              <Component />
            </SceneWithTransition>
          </Sequence>
        );
      })}

      {AUDIO.map(({file, at}) => (
        <Sequence key={file} from={Math.round(at * FPS)}>
          <Audio src={staticFile(`audio/${file}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

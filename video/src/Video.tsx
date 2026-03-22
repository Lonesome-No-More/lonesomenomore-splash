import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {OpenScene} from './scenes/OpenScene';
import {MorningCallScene} from './scenes/MorningCallScene';
import {AfternoonCallScene} from './scenes/AfternoonCallScene';
import {CloseScene} from './scenes/CloseScene';

const FPS = 30;
const TRANSITION = 10; // 0.33s
const HALF = TRANSITION / 2;

// ── Audio-driven timeline (demo format) ────────────────────────────
//
//  Scene 1 — Open (0-5.5s): narrator hook + phone ring
//  Scene 2 — Morning Call (5.5-35s): Sophie-Maggie conversation + family notification
//  Scene 3 — Afternoon Call (35-67s): second conversation + dashboard
//  Scene 4 — Close (67-75s): narrator + logo + contact
//
//  Audio cue points (global seconds):
//    0.0  narrator-open        (2.5s)
//    5.5  sophie-morning-1     (5.7s)
//   11.4  maggie-morning-1     (5.8s)
//   17.4  sophie-morning-2     (3.3s)
//   20.9  maggie-morning-2     (4.9s)
//   26.0  sophie-morning-3     (5.3s)
//   36.0  sophie-afternoon-1   (5.9s)
//   42.1  maggie-afternoon-1   (8.2s)
//   50.5  sophie-afternoon-2   (2.7s)
//   53.4  maggie-afternoon-2   (3.5s)
//   57.1  sophie-afternoon-3   (7.4s)
//   67.0  narrator-close       (4.8s)

const SCENES = [
  {Component: OpenScene, from: 0, duration: 5.5 * FPS},
  {Component: MorningCallScene, from: 5.5 * FPS, duration: 29.5 * FPS},
  {Component: AfternoonCallScene, from: 35 * FPS, duration: 32 * FPS},
  {Component: CloseScene, from: 67 * FPS, duration: 8 * FPS},
];

const AUDIO = [
  {file: 'narrator-open.mp3', at: 0},
  {file: 'sophie-morning-1.mp3', at: 5.5},
  {file: 'maggie-morning-1.mp3', at: 11.4},
  {file: 'sophie-morning-2.mp3', at: 17.4},
  {file: 'maggie-morning-2.mp3', at: 20.9},
  {file: 'sophie-morning-3.mp3', at: 26.0},
  {file: 'sophie-afternoon-1.mp3', at: 36.0},
  {file: 'maggie-afternoon-1.mp3', at: 42.1},
  {file: 'sophie-afternoon-2.mp3', at: 50.5},
  {file: 'maggie-afternoon-2.mp3', at: 53.4},
  {file: 'sophie-afternoon-3.mp3', at: 57.1},
  {file: 'narrator-close.mp3', at: 67.0},
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

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

// ── 62s Platform Demo — Audio-Aligned Timeline ────────────────────
//
//  Scenes:
//    Open:    0-5s       narrator hook
//    Signup:  5-12s      form + narration
//    Call:    12-31s     4 dialogue exchanges
//    Portal:  31-45.5s  conversation detail → dashboard
//    Email:   45.5-54s  weekly summary inbox
//    Close:   54-62s    narrator + logo
//
//  Audio (verified no overlaps):
//    0.0  narrator-open      (2.5s) → 2.5
//    5.0  narrator-signup    (5.1s) → 10.1
//   12.0  sophie-call-1      (3.5s) → 15.5
//   15.8  maggie-call-1      (5.7s) → 21.5
//   22.0  sophie-call-2      (4.7s) → 26.7
//   27.0  maggie-call-2      (3.3s) → 30.3
//   31.0  narrator-portal    (8.0s) → 39.0
//   39.5  narrator-dashboard (5.5s) → 45.0
//   45.5  narrator-email     (8.2s) → 53.7
//   54.0  narrator-close     (4.9s) → 58.9

const SCENES = [
  {Component: OpenScene, from: 0, duration: 5 * FPS},
  {Component: SignupScene, from: 5 * FPS, duration: 7 * FPS},
  {Component: CallScene, from: 12 * FPS, duration: 19 * FPS},
  {Component: PortalScene, from: 31 * FPS, duration: 14.5 * FPS},
  {Component: EmailScene, from: 45.5 * FPS, duration: 8.5 * FPS},
  {Component: CloseScene, from: 54 * FPS, duration: 8 * FPS},
];

const AUDIO = [
  {file: 'narrator-open.mp3', at: 0},
  {file: 'narrator-signup.mp3', at: 5.0},
  {file: 'sophie-call-1.mp3', at: 12.0},
  {file: 'maggie-call-1.mp3', at: 15.8},
  {file: 'sophie-call-2.mp3', at: 22.0},
  {file: 'maggie-call-2.mp3', at: 27.0},
  {file: 'narrator-portal.mp3', at: 31.0},
  {file: 'narrator-dashboard.mp3', at: 39.5},
  {file: 'narrator-email.mp3', at: 45.5},
  {file: 'narrator-close.mp3', at: 54.0},
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
          <Sequence key={i} from={adjustedFrom} durationInFrames={Math.round(adjustedDuration)}>
            <SceneWithTransition
              isFirst={i === 0}
              isLast={i === SCENES.length - 1}
              durationInFrames={Math.round(adjustedDuration)}
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

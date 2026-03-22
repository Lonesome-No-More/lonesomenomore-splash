import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {ExperienceScene} from './scenes/ExperienceScene';
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

const FPS = 30;
const TRANSITION = 12;
const HALF = TRANSITION / 2;

// ── Audio-driven timeline ──────────────────────────────────────────
// Act 1 now has 4 separate clips synced to visual beats:
//   0.0  act1-part1  (2.7s) → ends 2.7   "Millions of seniors..."
//   3.2  act1-part2  (3.0s) → ends 6.2   "No visitors. No calls..."
//   6.7  act1-part3  (2.5s) → ends 9.2   "And for their families..."
//   9.7  act1-part4  (5.8s) → ends 15.5  "The guilt of not being..."
//
//  16.5  act2-narration-1 (8.8s) → ends 25.3
//  25.6  act2-sophie      (3.6s) → ends 29.2
//  29.5  act2-narration-2 (4.0s) → ends 33.5
//  34.0  act3-narration-1 (10.8s) → ends 44.8
//  45.1  act3-sophie      (5.8s) → ends 50.9
//  51.2  act3-narration-2 (3.7s) → ends 54.9
//  55.5  act4-narration   (11.1s) → ends 66.6

const SCENES = [
  {Component: ProblemScene, from: 0, duration: 16.5 * FPS},
  {Component: SolutionScene, from: 16.5 * FPS, duration: 17.5 * FPS},
  {Component: ExperienceScene, from: 34 * FPS, duration: 21.5 * FPS},
  {Component: PeaceOfMindScene, from: 55.5 * FPS, duration: 14.5 * FPS},
];

const AUDIO = [
  {file: 'act1-part1.mp3', at: 0},
  {file: 'act1-part2.mp3', at: 3.2},
  {file: 'act1-part3.mp3', at: 6.7},
  {file: 'act1-part4.mp3', at: 9.7},
  {file: 'act2-narration-1.mp3', at: 16.5},
  {file: 'act2-sophie.mp3', at: 25.6},
  {file: 'act2-narration-2.mp3', at: 29.5},
  {file: 'act3-narration-1.mp3', at: 34.0},
  {file: 'act3-sophie.mp3', at: 45.1},
  {file: 'act3-narration-2.mp3', at: 51.2},
  {file: 'act4-narration.mp3', at: 55.5},
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

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {ExperienceScene} from './scenes/ExperienceScene';
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

const FPS = 30;
const TRANSITION = 12; // 0.4s cross-fade
const HALF = TRANSITION / 2;

// ── Audio-driven timeline ──────────────────────────────────────────
// Built from actual audio durations (manifest.json) with 0.3s gaps.
//
// Audio cue points (seconds):
//   0.0  act1-narration     (15.9s) → ends 15.9
//  16.5  act2-narration-1   ( 8.8s) → ends 25.3
//  25.6  act2-sophie        ( 3.6s) → ends 29.2
//  29.5  act2-narration-2   ( 4.0s) → ends 33.5
//  34.0  act3-narration-1   (10.8s) → ends 44.8
//  45.1  act3-sophie        ( 5.8s) → ends 50.9
//  51.2  act3-narration-2   ( 3.7s) → ends 54.9
//  55.5  act4-narration     (11.1s) → ends 66.6
//
// Scene boundaries:
//   Act 1:  0.0 – 16.5   (16.5s)
//   Act 2: 16.5 – 34.0   (17.5s)
//   Act 3: 34.0 – 55.5   (21.5s)
//   Act 4: 55.5 – 70.0   (14.5s)

const SCENES = [
  {Component: ProblemScene, from: 0, duration: 16.5 * FPS},
  {Component: SolutionScene, from: 16.5 * FPS, duration: 17.5 * FPS},
  {Component: ExperienceScene, from: 34 * FPS, duration: 21.5 * FPS},
  {Component: PeaceOfMindScene, from: 55.5 * FPS, duration: 14.5 * FPS},
];

// Audio cue points in seconds
const AUDIO = [
  {file: 'act1-narration.mp3', at: 0},
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

      {/* Audio — placed at exact cue points from manifest */}
      {AUDIO.map(({file, at}) => (
        <Sequence key={file} from={Math.round(at * FPS)}>
          <Audio src={staticFile(`audio/${file}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

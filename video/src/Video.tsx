import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {ExperienceScene} from './scenes/ExperienceScene';
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

const FPS = 30;
const TRANSITION = 12; // 0.4s cross-fade (was 1s)
const HALF = TRANSITION / 2;

// New 60s layout:
// Act 1: 0-15s (problem)
// Act 2: 15-32s (solution — logo, phone, conversation)
// Act 3: 32-50s (experience — features, memory panel, second convo)
// Act 4: 50-62s (peace of mind — dashboard, CTA)
const SCENES = [
  {Component: ProblemScene, from: 0, duration: 15 * FPS},
  {Component: SolutionScene, from: 15 * FPS, duration: 17 * FPS},
  {Component: ExperienceScene, from: 32 * FPS, duration: 18 * FPS},
  {Component: PeaceOfMindScene, from: 50 * FPS, duration: 12 * FPS},
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

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{opacity}}>
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

      {/* Audio layers — compressed timing */}
      <Sequence from={0}>
        <Audio src={staticFile('audio/act1-narration.mp3')} />
      </Sequence>
      <Sequence from={15 * FPS}>
        <Audio src={staticFile('audio/act2-narration-1.mp3')} />
      </Sequence>
      <Sequence from={22 * FPS}>
        <Audio src={staticFile('audio/act2-sophie.mp3')} />
      </Sequence>
      <Sequence from={26 * FPS}>
        <Audio src={staticFile('audio/act2-narration-2.mp3')} />
      </Sequence>
      <Sequence from={32 * FPS}>
        <Audio src={staticFile('audio/act3-narration-1.mp3')} />
      </Sequence>
      <Sequence from={40 * FPS}>
        <Audio src={staticFile('audio/act3-sophie.mp3')} />
      </Sequence>
      <Sequence from={44 * FPS}>
        <Audio src={staticFile('audio/act3-narration-2.mp3')} />
      </Sequence>
      <Sequence from={50 * FPS}>
        <Audio src={staticFile('audio/act4-narration.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};

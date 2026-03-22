import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {ExperienceScene} from './scenes/ExperienceScene';
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

const FPS = 30;
const TRANSITION = 30;
const HALF = TRANSITION / 2;

const SCENES = [
  {Component: ProblemScene, from: 0, duration: 25 * FPS},
  {Component: SolutionScene, from: 25 * FPS, duration: 30 * FPS},
  {Component: ExperienceScene, from: 55 * FPS, duration: 30 * FPS},
  {Component: PeaceOfMindScene, from: 85 * FPS, duration: 15 * FPS},
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

  const shiftIn = isFirst
    ? 0
    : interpolate(frame, [0, HALF], [10, 0], {extrapolateRight: 'clamp'});
  const shiftOut = isLast
    ? 0
    : interpolate(
        frame,
        [durationInFrames - HALF, durationInFrames],
        [0, -10],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${shiftIn + shiftOut}px)`,
      }}
    >
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

      {/* Audio layers */}
      <Sequence from={0} durationInFrames={25 * FPS}>
        <Audio src={staticFile('audio/act1-narration.mp3')} />
      </Sequence>
      <Sequence from={25 * FPS}>
        <Audio src={staticFile('audio/act2-narration-1.mp3')} />
      </Sequence>
      <Sequence from={40 * FPS}>
        <Audio src={staticFile('audio/act2-sophie.mp3')} />
      </Sequence>
      <Sequence from={46 * FPS}>
        <Audio src={staticFile('audio/act2-narration-2.mp3')} />
      </Sequence>
      <Sequence from={55 * FPS}>
        <Audio src={staticFile('audio/act3-narration-1.mp3')} />
      </Sequence>
      <Sequence from={68 * FPS}>
        <Audio src={staticFile('audio/act3-sophie.mp3')} />
      </Sequence>
      <Sequence from={76 * FPS}>
        <Audio src={staticFile('audio/act3-narration-2.mp3')} />
      </Sequence>
      <Sequence from={85 * FPS}>
        <Audio src={staticFile('audio/act4-narration.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};

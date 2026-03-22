import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {theme} from './styles/theme';

const FPS = 30;

const SCENES = {
  problem: {from: 0, duration: 25 * FPS},
  solution: {from: 25 * FPS, duration: 30 * FPS},
  experience: {from: 55 * FPS, duration: 30 * FPS},
  peaceOfMind: {from: 85 * FPS, duration: 15 * FPS},
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.textLight, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 1: The Problem
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.solution.from} durationInFrames={SCENES.solution.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.primary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 2: The Solution
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.experience.from} durationInFrames={SCENES.experience.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.secondary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 3: The Experience
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.peaceOfMind.from} durationInFrames={SCENES.peaceOfMind.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.primary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 4: Peace of Mind
          </h1>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

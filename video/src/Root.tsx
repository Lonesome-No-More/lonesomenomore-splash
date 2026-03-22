import {Composition} from 'remotion';
import {Video} from './Video';

const FPS = 30;
const DURATION_SECONDS = 100;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={FPS * DURATION_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

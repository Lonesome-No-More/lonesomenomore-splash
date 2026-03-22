import {Composition, registerRoot} from 'remotion';
import {Video} from './Video';

const FPS = 30;
const DURATION_SECONDS = 60;

const RemotionRoot: React.FC = () => {
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

registerRoot(RemotionRoot);

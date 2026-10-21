import {Composition} from 'remotion';
import {REEL_LENGTH, Reel} from './Reel';
import {FPS, H, W} from './theme';

export const RemotionRoot = () => (
  <Composition id="AgencyReel" component={Reel} durationInFrames={REEL_LENGTH} fps={FPS} width={W} height={H} />
);

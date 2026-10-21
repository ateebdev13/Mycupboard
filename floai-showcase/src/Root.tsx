import {Composition, Still} from 'remotion';
import {Showcase} from './Showcase';
import {DURATION, FPS} from './timeline';
import {Reference} from './Reference';

export const RemotionRoot = () => (
  <>
    <Composition id="FloAIShowcase" component={Showcase} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Still id="Reference" component={Reference} width={1920} height={1080} />
  </>
);

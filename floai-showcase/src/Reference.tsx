import {AbsoluteFill, Img, staticFile} from 'remotion';

// The source screenshot at 1080p height — handy for A/B comparisons in the Studio.
export const Reference = () => (
  <AbsoluteFill style={{background: '#8133f1', alignItems: 'center', justifyContent: 'center'}}>
    <Img src={staticFile('reference.png')} style={{height: 1080}} />
  </AbsoluteFill>
);

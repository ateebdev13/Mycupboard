import React from 'react';
import {Img} from 'remotion';
import {Box, Source} from '../sources';

/** Shows one region of a source image at a given display width. */
export const Crop: React.FC<{source: Source; box: Box; width: number; radius?: number; style?: React.CSSProperties}> = ({
  source,
  box,
  width,
  radius = 0,
  style,
}) => {
  const [x0, y0, x1, y1] = box;
  const s = width / (x1 - x0);
  return (
    <div style={{width, height: (y1 - y0) * s, overflow: 'hidden', position: 'relative', borderRadius: radius, ...style}}>
      <Img
        src={source.src}
        style={{
          position: 'absolute',
          left: -(x0 - source.ox) * s,
          top: -(y0 - source.oy) * s,
          width: source.w * s,
          height: source.h * s,
          maxWidth: 'none',
        }}
      />
    </div>
  );
};

/** Whole source scaled to a width, optionally scrolled up by `scroll` display px. */
export const Screen: React.FC<{source: Source; width: number; scroll?: number}> = ({source, width, scroll = 0}) => {
  const s = width / source.w;
  return (
    <Img
      src={source.src}
      style={{display: 'block', width, height: source.h * s, transform: `translateY(${-scroll}px)`, maxWidth: 'none'}}
    />
  );
};

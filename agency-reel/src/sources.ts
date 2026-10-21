import {staticFile} from 'remotion';

// Screens cut from the supplied presentation images. w/h are the crop sizes in
// the original images' pixels; the files on disk are 2× Lanczos upscales so
// close-ups hold up. ox/oy are the crop origins in the original image, which
// lets panel boxes be written in original-image coordinates.
export type Source = {src: string; w: number; h: number; ox: number; oy: number};

const s = (file: string, w: number, h: number, ox: number, oy: number): Source => ({
  src: staticFile(`work/${file}`),
  w,
  h,
  ox,
  oy,
});

export const SRC = {
  travelLeft: s('travel-left.jpg', 445, 963, 437, 150),
  travelRight: s('travel-right.jpg', 449, 974, 929, 152),
  turaDesktop: s('tura-desktop.jpg', 1206, 1247, 16, 21),
  turaMobile: s('tura-mobile.jpg', 533, 1247, 1239, 21),
  goat: s('goat.jpg', 1672, 1223, 60, 45),
  floai: s('floai.jpg', 1632, 1186, 78, 82),
};

/** Box [x0, y0, x1, y1] in original-image pixels. */
export type Box = [number, number, number, number];

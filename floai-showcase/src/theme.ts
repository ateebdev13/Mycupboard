import {Easing, interpolate} from 'remotion';

// Colours sampled from the FloAI reference screenshot.
export const C = {
  brand: '#8133f1',
  brandDeep: '#6200ee',
  logoInk: '#12202f',
  ink: '#1b1b1b',
  inkSoft: '#3a3a3a',
  muted: '#8a8a8f',
  faint: '#a3a3a8',
  border: '#ececef',
  window: '#ffffff',
  body: '#fafafa',
  card: '#ffffff',
  cardFoot: '#f8f8f8',
  pill: '#f3f4f5',
  pillInk: '#9a9ca0',
  activeFrom: '#6c4ae8',
  activeTo: '#ad62e6',
  positive: '#4caf7a',
  iconBox: '#f4f1f8',
  iconInk: '#694c92',
  green: '#4fd98d',
  red: '#e2507a',
  redSoft: '#f6d6df',
  blue: '#4d4ff0',
  male: '#8133f1',
  female: '#c082ea',
  alert: '#f73541',
  rowAlt: '#f4f5f7',
} as const;

export const FONT = 'Figtree, Inter, sans-serif';

// Premium easing curves.
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeOutSoft = Easing.bezier(0.33, 1, 0.68, 1);

/** 0→1 progress for a window of frames, clamped, with easing. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

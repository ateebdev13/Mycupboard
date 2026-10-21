import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const BEAT = 15; // 120 BPM
export const W = 1920;
export const H = 1080;

export const FONT = 'Figtree, Inter, sans-serif';

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const drift = Easing.bezier(0.25, 0.1, 0.25, 1);

export const prog = (frame: number, start: number, duration: number, easing: (t: number) => number = easeOut) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Brand colours lifted from each project's own presentation background.
export const PROJECT = {
  travel: {bg: '#d6f472', ink: '#0f2f3a', accent: '#0f2f3a'},
  tura: {bg: '#00385a', ink: '#ffffff', accent: '#e1ff8a'},
  goat: {bg: '#5e1913', ink: '#ffffff', accent: '#ff5a4a'},
  floai: {bg: '#8133f1', ink: '#ffffff', accent: '#ffffff'},
} as const;

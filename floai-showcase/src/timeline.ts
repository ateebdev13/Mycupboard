// All timings in frames @ 30 fps (450 frames = 15 s).
export const FPS = 30;
export const DURATION = 450;

export const T = {
  // 0–3 s: dashboard reveal
  windowIn: 0,
  headerIn: 18,
  titleIn: 30,
  // 3–6 s: metric cards
  cardsIn: 92,
  cardStagger: 13,
  // 6–10 s: performance trends
  linesIn: 196,
  areaIn: 214,
  hoverIn: 254,
  // 10–13 s: demographic donut
  donutIn: 312,
  // 13–15 s: final composition
  outroIn: 392,
} as const;

type Key = {f: number; x: number; y: number; z: number; ease?: 'inOut' | 'linear'};

// Camera keyframes in dashboard-window units (the window is 850 units wide,
// matching the reference screenshot's pixel grid). `z` = screen px per unit.
export const CAMERA: Key[] = [
  {f: 0, x: 425, y: 318, z: 1.42},
  {f: 84, x: 425, y: 214, z: 1.86},
  {f: 104, x: 424, y: 200, z: 2.3},
  {f: 176, x: 424, y: 199, z: 2.4, ease: 'linear'},
  {f: 198, x: 270.5, y: 362, z: 3.15},
  {f: 296, x: 271.5, y: 360, z: 3.3, ease: 'linear'},
  {f: 318, x: 649, y: 362, z: 3.5},
  {f: 390, x: 649, y: 361, z: 3.66, ease: 'linear'},
  {f: 424, x: 425, y: 290, z: 1.62},
  {f: 450, x: 425, y: 291, z: 1.6, ease: 'linear'},
];

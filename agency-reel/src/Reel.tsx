import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FloaiMobile, GoatMobile, TuraMobile} from './components/MobileLayouts';
import {SRC} from './sources';
import {FINALE_LENGTH, FinaleScene, INTRO_LENGTH, IntroScene} from './scenes/TypeScenes';
import {TRAVEL_LENGTH, TravelScene} from './scenes/TravelScene';
import {WEB_SCENE_LENGTH, WebScene, WebSceneConfig} from './scenes/WebScene';
import {FONT, H, PROJECT, W, easeInOut} from './theme';

const LEAD = 5; // half-length of each whip transition

const TURA: WebSceneConfig = {
  source: SRC.turaDesktop,
  url: 'Tura Executive',
  bg: PROJECT.tura.bg,
  glow: '#0b5c8a',
  labelColor: '#ffffff',
  index: '02',
  title: 'Tura Executive',
  kind: 'Website',
  closeups: [
    {from: [330, 280, 720], to: [345, 290, 640]},
    {from: [850, 470, 820], to: [880, 495, 730], rotate: -1.5},
    {from: [430, 800, 820], to: [800, 800, 820]},
  ],
  mobile: (scroll) => <TuraMobile scroll={scroll} />,
  mobileBg: '#ffffff',
  mobileScroll: 68,
};

const GOAT: WebSceneConfig = {
  source: SRC.goat,
  url: 'G.O.A.T. Leads',
  bg: '#2a0b08',
  glow: '#7f231d',
  labelColor: '#ffffff',
  index: '03',
  title: 'G.O.A.T. Leads',
  kind: 'SaaS Dashboard',
  closeups: [
    {from: [860, 458, 900], to: [1280, 458, 900], tilt: [10, 0]},
    {from: [822, 765, 820], to: [770, 745, 700]},
    {from: [1400, 765, 700], to: [1440, 750, 620], rotate: 1.5},
  ],
  mobile: (scroll) => <GoatMobile scroll={scroll} />,
  mobileBg: '#f6f6f6',
  mobileScroll: 300,
};

const FLOAI: WebSceneConfig = {
  source: SRC.floai,
  url: 'FloAI · Analytics',
  bg: '#5b17c9',
  glow: PROJECT.floai.bg,
  labelColor: '#ffffff',
  index: '04',
  title: 'FloAI',
  kind: 'Analytics Platform',
  closeups: [
    {from: [560, 458, 880], to: [1220, 458, 880], tilt: [10, 0]},
    {from: [600, 775, 860], to: [560, 760, 740]},
    {from: [1325, 770, 620], to: [1325, 770, 520], rotate: -2},
  ],
  mobile: (scroll) => <FloaiMobile scroll={scroll} />,
  mobileBg: '#fafafa',
  mobileScroll: 320,
};

type Dir = 'left' | 'up';
type Scene = {start: number; len: number; enter?: Dir; render: (t: number) => React.ReactNode};

export const SCENES: Scene[] = [
  {start: 0, len: INTRO_LENGTH, render: (t) => <IntroScene t={t} />},
  {start: 60, len: TRAVEL_LENGTH, enter: 'up', render: (t) => <TravelScene t={t} />},
  {start: 180, len: WEB_SCENE_LENGTH, enter: 'left', render: (t) => <WebScene t={t} c={TURA} />},
  {start: 330, len: WEB_SCENE_LENGTH, enter: 'up', render: (t) => <WebScene t={t} c={GOAT} />},
  {start: 480, len: WEB_SCENE_LENGTH, enter: 'left', render: (t) => <WebScene t={t} c={FLOAI} />},
  {start: 630, len: FINALE_LENGTH, enter: 'up', render: (t) => <FinaleScene t={t} />},
];

export const REEL_LENGTH = 780;

const offset = (dir: Dir | undefined, amount: number) =>
  dir === 'up' ? `translateY(${amount * H}px)` : `translateX(${amount * W}px)`;

/** Wraps a scene and applies a whip-pan on its way in and out. */
const SceneFrame: React.FC<{scene: Scene; next?: Scene; lead: number}> = ({scene, next, lead}) => {
  const f = useCurrentFrame();
  const t = f - lead;
  const k = (x: number) => interpolate(x, [-LEAD, LEAD], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const inP = scene.enter ? k(t) : 1;
  const outP = next ? k(t - scene.len) : 0;
  const transform = [scene.enter && inP < 1 ? offset(scene.enter, 1 - inP) : '', outP > 0 ? offset(next?.enter, -outP) : '']
    .join(' ')
    .trim();
  const blur = Math.sin(Math.PI * (scene.enter ? inP : 1)) * 18 + Math.sin(Math.PI * outP) * 18;
  return (
    <AbsoluteFill style={{transform: transform || undefined, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
      {scene.render(t)}
    </AbsoluteFill>
  );
};

const fontFace = `@font-face{font-family:'Figtree';font-weight:300 900;src:url(${staticFile('fonts/Figtree.woff2')}) format('woff2');}`;

export const Reel: React.FC = () => (
  <AbsoluteFill style={{background: '#0b0b0c', fontFamily: FONT}}>
    <style>{fontFace}</style>
    <Audio src={staticFile('audio/reel-beat.wav')} volume={0.9} />
    {SCENES.map((scene, i) => {
      const from = Math.max(0, scene.start - LEAD);
      const lead = scene.start - from;
      return (
        <Sequence key={i} from={from} durationInFrames={scene.len + lead + LEAD} layout="none">
          <SceneFrame scene={scene} next={SCENES[i + 1]} lead={lead} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

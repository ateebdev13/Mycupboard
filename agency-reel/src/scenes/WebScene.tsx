import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Screen} from '../components/Crop';
import {Browser, Phone} from '../components/Devices';
import {Cut, ImageShot, Label, Morph} from '../components/Kit';
import {Source} from '../sources';
import {H, W, drift, easeOut, mix, prog} from '../theme';

type Cam = [number, number, number];

export type WebSceneConfig = {
  source: Source;
  url: string;
  bg: string;
  glow: string;
  labelColor: string;
  index: string;
  title: string;
  kind: string;
  closeups: {from: Cam; to: Cam; rotate?: number; tilt?: [number, number]}[];
  mobile: (scroll: number) => React.ReactNode;
  mobileBg: string;
  mobileScroll: number;
};

export const WEB_SCENE_LENGTH = 150;

const Backdrop: React.FC<{bg: string; glow: string}> = ({bg, glow}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${glow}, ${bg} 70%)`}} />
);

export const WebScene: React.FC<{t: number; c: WebSceneConfig}> = ({t, c}) => {
  const browserW = 1500;
  const browserH = 860;
  const mobileScroll = (from: number, to: number) =>
    interpolate(t, [from, to], [0, c.mobileScroll], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: drift});

  return (
    <AbsoluteFill>
      <Backdrop bg={c.bg} glow={c.glow} />

      {/* 1 — hero: browser rises into frame */}
      <Cut t={t} from={-10} dur={40}>
        {(lt) => {
          const local = lt - 10;
          const e = prog(local, -2, 24, easeOut);
          const scroll = interpolate(local, [6, 30], [0, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: drift});
          return (
            <AbsoluteFill style={{perspective: 1800}}>
              <div
                style={{
                  position: 'absolute',
                  left: W - 1280 - 170,
                  top: 110,
                  transformOrigin: '50% 100%',
                  transform: `translateY(${(1 - e) * 620}px) rotateX(${(1 - e) * 32}deg) scale(${0.96 + 0.04 * e + local * 0.0008})`,
                }}
              >
                <Browser width={1280} height={760} url={c.url}>
                  <Screen source={c.source} width={1280} scroll={scroll} />
                </Browser>
              </div>
              <Label t={local} index={c.index} title={c.title} kind={c.kind} color={c.labelColor} />
            </AbsoluteFill>
          );
        }}
      </Cut>

      {/* 2–4 — fast close-ups, one per beat */}
      {c.closeups.map((shot, i) => (
        <Cut key={i} t={t} from={30 + i * 15} dur={15}>
          {(lt) => <ImageShot source={c.source} t={lt} dur={15} from={shot.from} to={shot.to} bg={c.bg} rotate={shot.rotate} tilt={shot.tilt} />}
        </Cut>
      ))}

      {/* 5 — responsive morph: desktop → mobile */}
      <Cut t={t} from={75} dur={45}>
        {(lt) => (
          <AbsoluteFill>
            <Backdrop bg={c.bg} glow={c.glow} />
            <Morph
              p={prog(lt, 2, 32, (x) => x)}
              from={{w: browserW, h: browserH}}
              phoneHeight={880}
              desktop={(innerW) => <Screen source={c.source} width={innerW} />}
              mobile={c.mobile(mobileScroll(110, 150) * 0.4)}
              mobileBg={c.mobileBg}
              labelColor={c.labelColor}
            />
          </AbsoluteFill>
        )}
      </Cut>

      {/* 6 — desktop + mobile side by side */}
      <Cut t={t} from={120} dur={40}>
        {(lt) => {
          const e = prog(lt, 0, 16, easeOut);
          const sc = mobileScroll(112, 152);
          return (
            <AbsoluteFill style={{perspective: 2000}}>
              <div
                style={{
                  position: 'absolute',
                  left: 150 - (1 - e) * 120,
                  top: 170,
                  transform: `rotateY(${mix(22, 16, e)}deg) scale(${0.98 + lt * 0.0007})`,
                  transformOrigin: '0% 50%',
                }}
              >
                <Browser width={1200} height={700} url={c.url}>
                  <Screen source={c.source} width={1200} scroll={sc * 0.5} />
                </Browser>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 1260 + (1 - e) * 160,
                  top: 95,
                  transform: `rotateY(${mix(-24, -14, e)}deg) translateY(${-lt * 0.8}px)`,
                }}
              >
                <Phone height={860} screenBg={c.mobileBg}>
                  {c.mobile(sc)}
                </Phone>
              </div>
            </AbsoluteFill>
          );
        }}
      </Cut>
    </AbsoluteFill>
  );
};

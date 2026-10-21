import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, easeInOut, easeOut, prog} from './theme';
import {CAMERA, DURATION} from './timeline';
import {ChannelTable} from './dashboard/ChannelTable';
import {DemographicDonut} from './dashboard/DemographicDonut';
import {Header, PageTitle} from './dashboard/Header';
import {MetricCards} from './dashboard/MetricCards';
import {PerformanceChart} from './dashboard/PerformanceChart';

const WINDOW_W = 850;
const WINDOW_H = 760;

const fontFace = `@font-face{font-family:'Figtree';font-weight:300 900;font-style:normal;src:url(${staticFile(
  'fonts/Figtree.woff2',
)}) format('woff2');}`;

/** Interpolates the camera; zoom is blended in log space so pushes feel linear to the eye. */
const useCamera = (frame: number) => {
  let i = CAMERA.findIndex((k) => k.f > frame);
  if (i === -1) i = CAMERA.length - 1;
  if (i === 0) i = 1;
  const a = CAMERA[i - 1];
  const b = CAMERA[i];
  const t = interpolate(frame, [a.f, b.f], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: b.ease === 'linear' ? (x) => x : easeInOut,
  });
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t),
  };
};

export const Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cam = useCamera(frame);

  // Window entrance: rises and un-tilts into place over the purple stage.
  const enter = prog(frame, 0, 52, easeOut);
  const tilt = (1 - enter) * 14;
  const lift = (1 - enter) * 120;

  const fadeIn = prog(frame, 0, 14);

  return (
    <AbsoluteFill style={{background: C.brand, fontFamily: FONT}}>
      <style>{fontFace}</style>
      <Audio
        src={staticFile('audio/ambient-pad.wav')}
        volume={(f) =>
          interpolate(f, [0, 20, DURATION - 40, DURATION], [0, 0.55, 0.55, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Gentle light falloff keeps the flat brand purple from feeling dead on large screens. */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(255,255,255,0.07), rgba(0,0,0,0) 70%)'}}
      />

      <AbsoluteFill style={{opacity: fadeIn}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: WINDOW_W,
            height: WINDOW_H,
            transformOrigin: '0 0',
            transform: `translate(${width / 2 - cam.x * cam.z}px, ${height / 2 - cam.y * cam.z}px) scale(${cam.z})`,
          }}
        >
          <div style={{perspective: 1400, perspectiveOrigin: '50% 0%', width: WINDOW_W, height: WINDOW_H}}>
            <div
              style={{
                position: 'relative',
                width: WINDOW_W,
                height: WINDOW_H,
                borderRadius: 7,
                overflow: 'hidden',
                background: C.body,
                opacity: enter,
                transformOrigin: '50% 0%',
                transform: `translateY(${lift}px) rotateX(${tilt}deg)`,
                boxShadow: '0 24px 60px rgba(40, 6, 110, 0.28), 0 4px 14px rgba(40, 6, 110, 0.12)',
              }}
            >
              <div style={{position: 'absolute', left: 0, top: 0, width: WINDOW_W, height: 52, background: C.window}} />
              <Header />
              <PageTitle />
              <MetricCards />
              <PerformanceChart />
              <DemographicDonut />
              <ChannelTable />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

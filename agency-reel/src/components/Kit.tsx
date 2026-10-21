import React from 'react';
import {AbsoluteFill, Img, interpolate} from 'remotion';
import {Source} from '../sources';
import {BROWSER_BAR, PHONE_H, PHONE_W} from './Devices';
import {FONT, H, W, drift, easeInOut, easeOut, mix, prog} from '../theme';

/** Plays a child only within [from, from+dur) of local time `t` (hard cuts). */
export const Cut: React.FC<{t: number; from: number; dur: number; children: (local: number) => React.ReactNode}> = ({
  t,
  from,
  dur,
  children,
}) => (t >= from && t < from + dur ? <>{children(t - from)}</> : null);

type Cam = [cx: number, cy: number, width: number];

/**
 * Full-frame close-up on a source: the camera moves from one framing to another
 * (centre + visible width, in original-image px), with an optional punch-in on the cut.
 */
export const ImageShot: React.FC<{
  source: Source;
  t: number;
  dur: number;
  from: Cam;
  to: Cam;
  bg: string;
  punch?: number;
  rotate?: number;
  tilt?: [number, number];
}> = ({source, t, dur, from, to, bg, punch = 0.06, rotate = 0, tilt}) => {
  const p = interpolate(t, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: drift});
  const cx = mix(from[0], to[0], p);
  const cy = mix(from[1], to[1], p);
  const w = Math.exp(mix(Math.log(from[2]), Math.log(to[2]), p));
  const s = W / w;
  const impact = 1 + punch * (1 - prog(t, 0, 8, easeOut));
  const tiltX = tilt ? tilt[0] * (1 - p * 0.5) : 0;
  const tiltY = tilt ? tilt[1] * (1 - p * 0.5) : 0;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', perspective: 2200}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${impact}) rotate(${rotate}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        <Img
          src={source.src}
          style={{
            position: 'absolute',
            left: W / 2 - (cx - source.ox) * s,
            top: H / 2 - (cy - source.oy) * s,
            width: source.w * s,
            height: source.h * s,
            maxWidth: 'none',
            borderRadius: 24 * s,
            boxShadow: '0 40px 120px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Project title card in the lower-left corner, revealed through a mask. */
export const Label: React.FC<{t: number; index: string; title: string; kind: string; color: string; at?: number}> = ({
  t,
  index,
  title,
  kind,
  color,
  at = 4,
}) => {
  const a = prog(t, at, 14);
  const b = prog(t, at + 4, 14);
  const line = prog(t, at, 18, easeInOut);
  return (
    <div style={{position: 'absolute', left: 90, bottom: 70, fontFamily: FONT, color, zIndex: 10}}>
      <div style={{overflow: 'hidden', height: 34}}>
        <div style={{fontSize: 22, fontWeight: 600, letterSpacing: 3, transform: `translateY(${(1 - a) * 100}%)`, opacity: 0.8}}>
          {index} — {kind.toUpperCase()}
        </div>
      </div>
      <div style={{width: 220 * line, height: 2, background: color, opacity: 0.5, margin: '6px 0 12px'}} />
      <div style={{overflow: 'hidden', height: 74}}>
        <div style={{fontSize: 60, fontWeight: 800, letterSpacing: -1.5, lineHeight: '72px', transform: `translateY(${(1 - b) * 105}%)`}}>
          {title}
        </div>
      </div>
    </div>
  );
};

/** Big kinetic word that slams in on a beat. */
export const Slam: React.FC<{t: number; children: React.ReactNode; size?: number; color?: string}> = ({
  t,
  children,
  size = 210,
  color = '#ffffff',
}) => {
  const p = prog(t, 0, 7, easeOut);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: -size * 0.045,
          color,
          transform: `scale(${1.28 - 0.28 * p})`,
          opacity: Math.min(1, (t + 1) / 2),
          filter: `blur(${(1 - p) * 8}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Responsive morph: a desktop browser window narrows into a phone while the
 * desktop layout hands over to the mobile layout. `p` is 0→1.
 */
export const Morph: React.FC<{
  p: number;
  desktop: (innerW: number) => React.ReactNode;
  mobile: React.ReactNode;
  mobileBg: string;
  from: {w: number; h: number};
  phoneHeight: number;
  labelColor: string;
  x?: number;
}> = ({p, desktop, mobile, mobileBg, from, phoneHeight, labelColor, x = W / 2}) => {
  const e = easeInOut(p);
  const s = phoneHeight / PHONE_H;
  const bezel = 13 * s * e;
  const toW = PHONE_W * s + 26 * s;
  const toH = phoneHeight + 26 * s;
  const w = mix(from.w, toW, e);
  const h = mix(from.h, toH, e);
  const bar = BROWSER_BAR * (1 - Math.min(1, e * 1.6));
  const innerW = w - bezel * 2;
  const innerH = h - bezel * 2 - bar;
  const swap = interpolate(e, [0.35, 0.62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fit = Math.min(innerH / PHONE_H, innerW / PHONE_W);
  const px = Math.round(mix(1440, 390, e));

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - w / 2,
          top: H / 2 - h / 2 - 30,
          width: w,
          height: h,
          borderRadius: mix(16, 62 * s, e),
          background: e > 0.02 ? 'linear-gradient(145deg, #3a3d44, #121316 40%, #2b2d33)' : '#fff',
          boxShadow: '0 50px 120px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.18)',
          padding: bezel,
          boxSizing: 'border-box',
        }}
      >
        <div style={{position: 'relative', width: innerW, height: h - bezel * 2, borderRadius: mix(16, 50 * s, e), overflow: 'hidden', background: '#f1f1f3'}}>
          <div style={{height: bar, background: '#f1f1f3', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 18, overflow: 'hidden'}}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, opacity: 1 - e}} />
            ))}
          </div>
          <div style={{position: 'absolute', left: 0, top: bar, width: innerW, height: innerH, overflow: 'hidden', background: mobileBg}}>
            <div style={{position: 'absolute', inset: 0, opacity: 1 - swap, transform: `scale(${1 - 0.08 * swap})`, transformOrigin: '50% 0'}}>
              {desktop(innerW)}
            </div>
            <div
              style={{
                position: 'absolute',
                left: (innerW - PHONE_W * fit) / 2,
                top: 0,
                width: PHONE_W,
                height: PHONE_H,
                transform: `scale(${fit * (1.06 - 0.06 * swap)})`,
                transformOrigin: '0 0',
                opacity: swap,
              }}
            >
              {mobile}
            </div>
          </div>
          {/* dynamic island arrives with the bezel */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 11 * s,
              width: 120 * s,
              height: 34 * s,
              marginLeft: -60 * s,
              borderRadius: 20 * s,
              background: '#050505',
              opacity: interpolate(e, [0.75, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: x - 200,
          width: 400,
          top: H / 2 + h / 2 - 30 + 26,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 2,
          color: labelColor,
          opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0.9]),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {px}PX {e > 0.5 ? '· MOBILE' : '· DESKTOP'}
      </div>
    </>
  );
};

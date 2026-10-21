import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, easeInOut, prog} from '../theme';
import {T} from '../timeline';
import {PieIcon} from './Icons';

const CX = 608.7;
const CY = 372;
const R = 57.2;
const W = 19;

// Segment boundaries (degrees clockwise from 12 o'clock) traced from the reference.
const START = 10;
const SEGMENTS: {from: number; to: number; color: string}[] = [
  {from: 295, to: 370, color: C.female},
  {from: 10, to: 77, color: C.male},
  {from: 77, to: 142, color: C.male},
  {from: 142, to: 230, color: C.male},
  {from: 230, to: 295, color: C.female},
];

const polar = (deg: number, r = R): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arc = (from: number, to: number) => {
  const [x0, y0] = polar(from);
  const [x1, y1] = polar(to);
  return `M${x0} ${y0} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export const DemographicDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = prog(frame, T.donutIn, 52, easeInOut);
  const spin = prog(frame, T.donutIn, 60, easeInOut);
  const center = prog(frame, T.donutIn + 18, 26);
  const label1 = prog(frame, T.donutIn + 40, 20);
  const label2 = prog(frame, T.donutIn + 46, 20);
  const legend = (i: number) => prog(frame, T.donutIn + 28 + i * 6, 20);

  const reach = START + sweep * 360; // current angular extent of the reveal
  const rotation = (1 - spin) * -110;

  const leader = (d: string, p: number) => (
    <path
      d={d}
      fill="none"
      stroke="#cfcfd4"
      strokeWidth={0.5}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  );

  return (
    <div style={{fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 501,
          top: 254,
          width: 296,
          height: 214,
          borderRadius: 9,
          background: C.card,
          border: '0.7px solid #ececef',
          boxSizing: 'border-box',
        }}
      />
      <div style={{position: 'absolute', left: 515, top: 266, fontSize: 12.8, fontWeight: 600, color: C.ink, letterSpacing: -0.1}}>
        Demographic Breakdown
      </div>

      <svg width={850} height={700} viewBox="0 0 850 700" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`rotate(${rotation} ${CX} ${CY})`}>
          {SEGMENTS.map((s, i) => {
            const to = Math.min(s.to, reach);
            if (to <= s.from + 0.01) return null;
            return (
              <g key={i}>
                <path d={arc(s.from, to)} fill="none" stroke="#ffffff" strokeWidth={W + 1.1} strokeLinecap="round" />
                <path d={arc(s.from, to)} fill="none" stroke={s.color} strokeWidth={W} strokeLinecap="round" />
              </g>
            );
          })}
        </g>
        {leader('M537 312 L558 312 L565.3 319.7', label1)}
        {leader('M665.3 404.7 L673.7 411.3 L697 411.3', label2)}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: CX - 40,
          top: CY - 15,
          width: 80,
          textAlign: 'center',
          fontSize: 8.6,
          lineHeight: '14.3px',
          fontWeight: 600,
          color: '#2f2f33',
          opacity: center,
          transform: `scale(${0.92 + 0.08 * center})`,
        }}
      >
        Gender
        <br />
        Split
      </div>

      <div style={{position: 'absolute', left: 535.5, top: 301, fontSize: 6.2, color: '#8d8d92', opacity: label1}}>29.75%</div>
      <div style={{position: 'absolute', left: 673, top: 420.5, fontSize: 6.2, color: '#8d8d92', opacity: label2}}>70.2%</div>

      {(
        [
          ['Male', C.male, 355.7],
          ['Female', C.female, 385.3],
        ] as const
      ).map(([label, color, y], i) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            left: 716,
            top: y - 5,
            height: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 5.5,
            fontSize: 7.8,
            color: '#55555a',
            opacity: legend(i),
            transform: `translateX(${(1 - legend(i)) * 5}px)`,
          }}
        >
          <PieIcon size={9.5} color={color} />
          {label}
        </div>
      ))}
    </div>
  );
};

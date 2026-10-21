import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, easeInOut, easeOut, mix, prog} from '../theme';
import {T} from '../timeline';

// Chart geometry traced from the reference screenshot (3× crop space),
// mapped into dashboard-window units.
const X = (px: number) => 52 + px / 3;
const Y = (py: number) => 248 + py / 3;
type Pt = [number, number];
const pts = (raw: Pt[]): Pt[] => raw.map(([x, y]) => [X(x), Y(y)]);

const GREEN = pts([[103, 342], [218, 315], [510, 445], [636, 405], [870, 247], [1168, 452], [1268, 360]]);
const RED = pts([[103, 375], [218, 418], [315, 322], [408, 337], [537, 238], [690, 368], [868, 294]]);
const RED_FADED = pts([[868, 294], [1040, 322], [1205, 293], [1268, 228]]);
const BLUE = pts([[103, 425], [300, 395], [878, 491], [1268, 425]]);

const GRID_LEFT = X(103);
const GRID_RIGHT = X(1265);
const BASE = Y(540);
const Y_TICKS: [string, number][] = [
  ['100k', 183],
  ['80k', 254],
  ['60k', 325],
  ['40k', 395],
  ['20k', 464],
  ['0', 540],
];
const X_TICKS: [string, number][] = [
  ['Jan1', 122],
  ['Jan8', 297],
  ['Jan15', 480],
  ['Jan22', 666],
  ['Jan29', 857],
  ['Feb12', 1046],
  ['Feb5', 1226],
];

const toPath = (p: Pt[]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
const length = (p: Pt[]) => p.slice(1).reduce((s, [x, y], i) => s + Math.hypot(x - p[i][0], y - p[i][1]), 0);
const yAt = (p: Pt[], x: number) => {
  for (let i = 1; i < p.length; i++) {
    if (x <= p[i][0]) {
      const t = (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
      return mix(p[i - 1][1], p[i][1], t);
    }
  }
  return p[p.length - 1][1];
};

const DrawnLine: React.FC<{points: Pt[]; color: string; p: number; width?: number}> = ({
  points,
  color,
  p,
  width = 0.75,
}) => {
  const L = length(points);
  return (
    <path
      d={toPath(points)}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={`${L} ${L * 2}`}
      strokeDashoffset={L * (1 - p)}
      opacity={p > 0.002 ? 1 : 0}
    />
  );
};

const Glow: React.FC<{x: number; y: number; color: string; p: number}> = ({x, y, color, p}) => (
  <g opacity={p} transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * p})`}>
    <circle r={4.2} fill="rgba(129, 51, 241, 0.16)" />
    <circle r={2.6} fill="rgba(129, 51, 241, 0.16)" />
    <circle r={1.35} fill={color} stroke="#ffffff" strokeWidth={0.35} />
  </g>
);

export const PerformanceChart: React.FC = () => {
  const frame = useCurrentFrame();

  const g = prog(frame, T.linesIn, 50, easeInOut);
  const r = prog(frame, T.linesIn + 7, 46, easeInOut);
  const rf = prog(frame, T.linesIn + 40, 22, easeInOut);
  const b = prog(frame, T.linesIn + 14, 46, easeInOut);
  const area = prog(frame, T.areaIn, 40);
  const dots = prog(frame, T.linesIn + 50, 18);

  // Hover scrubs from Jan15 to its resting position over Jan22.
  const hover = prog(frame, T.hoverIn, 12);
  const scrub = prog(frame, T.hoverIn + 4, 30, easeInOut);
  const tip = prog(frame, T.hoverIn + 8, 18, easeOut);
  const hx = X(mix(520, 636, scrub));
  const hy = yAt(GREEN, hx);

  const areaPath = `${toPath([...RED, ...RED_FADED.slice(1)])} L${GRID_RIGHT + 2} ${BASE} L${GRID_LEFT} ${BASE} Z`;

  return (
    <div style={{fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 254,
          width: 437,
          height: 214,
          borderRadius: 9,
          background: C.card,
          border: '0.7px solid #ececef',
          boxSizing: 'border-box',
        }}
      />
      <div style={{position: 'absolute', left: 65, top: 266, fontSize: 12.8, fontWeight: 600, color: C.ink, letterSpacing: -0.1}}>
        Performance Trends
      </div>

      {Y_TICKS.map(([label, py]) => (
        <div
          key={label}
          style={{position: 'absolute', left: 65, top: Y(py) - 4, fontSize: 6.2, lineHeight: '8px', color: C.faint}}
        >
          {label}
        </div>
      ))}
      {X_TICKS.map(([label, px]) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            left: X(px) - 20,
            width: 40,
            textAlign: 'center',
            top: Y(603) - 4,
            fontSize: 6.2,
            lineHeight: '8px',
            color: C.faint,
          }}
        >
          {label}
        </div>
      ))}

      <svg width={850} height={700} viewBox="0 0 850 700" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3b7c7" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#f3b7c7" stopOpacity={0} />
          </linearGradient>
          <clipPath id="areaReveal">
            <rect x={GRID_LEFT} y={280} width={(GRID_RIGHT - GRID_LEFT + 4) * area} height={200} />
          </clipPath>
          <filter id="tipShadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx={0} dy={1.2} stdDeviation={2} floodColor="#2a1060" floodOpacity={0.08} />
          </filter>
        </defs>

        {Y_TICKS.map(([label, py]) => (
          <line
            key={label}
            x1={GRID_LEFT}
            x2={GRID_RIGHT}
            y1={Y(py)}
            y2={Y(py)}
            stroke="#e6e6ea"
            strokeWidth={0.45}
            strokeDasharray="1.2 1.2"
          />
        ))}

        <path d={areaPath} fill="url(#redArea)" clipPath="url(#areaReveal)" />

        <DrawnLine points={RED_FADED} color={C.redSoft} p={rf} />
        <DrawnLine points={GREEN} color={C.green} p={g} />
        <DrawnLine points={BLUE} color={C.blue} p={b} />
        <DrawnLine points={RED} color={C.red} p={r} />

        <Glow x={RED[RED.length - 1][0]} y={RED[RED.length - 1][1]} color="#d8305b" p={dots} />
        <Glow x={X(1168)} y={Y(452)} color="#3ccf7a" p={prog(frame, T.linesIn + 56, 18)} />

        {/* Hover indicator */}
        <g opacity={hover}>
          <line x1={hx} x2={hx} y1={hy + 3.4} y2={BASE} stroke="#2b2b2b" strokeWidth={0.6} />
          <circle cx={hx} cy={hy} r={3.4} fill="#ffffff" stroke="#3a3a3a" strokeWidth={0.6} />
        </g>

        {/* Tooltip */}
        <g
          opacity={tip}
          transform={`translate(${hx - 40.3} ${Y(265) + (1 - tip) * 3})`}
          filter="url(#tipShadow)"
        >
          <rect width={77.7} height={44} rx={3.2} fill="#ffffff" stroke="#f0f0f3" strokeWidth={0.4} />
          {(
            [
              ['Impressions', '45k', '#3ccf7a'],
              ['Clicks', '6.7k', '#d8305b'],
              ['Conversions', '521', C.blue],
            ] as const
          ).map(([label, value, color], i) => (
            <g key={label} transform={`translate(0 ${9.3 + i * 11.8})`}>
              <circle cx={9.6} cy={0} r={1.85} fill={color} />
              <text x={15.6} y={1.9} fontSize={5.3} fill="#a8a8ae" fontFamily={FONT}>
                {label}
              </text>
              <text x={50.3} y={1.9} fontSize={5.3} fill={C.ink} fontWeight={600} fontFamily={FONT}>
                {value}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

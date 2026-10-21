import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, easeInOut, prog} from '../theme';
import {T} from '../timeline';
import {BarsIcon, CursorIcon, RefreshDollarIcon, TargetIcon, TrendUp} from './Icons';

type Metric = {
  label: string;
  value: number;
  format: (v: number) => string;
  change: string;
  Icon: typeof BarsIcon;
};

const METRICS: Metric[] = [
  {label: 'Impressions', value: 124.5, format: (v) => `${v.toFixed(1)}K`, change: '+12.3%', Icon: BarsIcon},
  {label: 'Click Rate', value: 3.2, format: (v) => `${v.toFixed(1)}%`, change: '+0.8%', Icon: CursorIcon},
  {label: 'CTR', value: 20, format: (v) => `${Math.round(v)}%`, change: '+23.1%', Icon: RefreshDollarIcon},
  {label: 'Conversions', value: 284, format: (v) => `${Math.round(v)}`, change: '+15.4%', Icon: TargetIcon},
];

const CARD_X = [52, 241, 430, 619];
const CARD_W = 177;
const CARD_Y = 152;
const CARD_H = 90;
const FOOT_H = 24;

export const MetricCards: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{fontFamily: FONT}}>
      {METRICS.map((m, i) => {
        const start = T.cardsIn + i * T.cardStagger;
        // Shells arrive with the dashboard; each card then lifts, counts up and settles.
        const pop = prog(frame, start, 30, easeInOut);
        const lift = Math.sin(Math.PI * pop);
        const value = prog(frame, start, 16);
        const count = prog(frame, start + 2, 38, easeInOut);
        const foot = prog(frame, start + 16, 20);
        const icon = prog(frame, start + 4, 22);
        return (
          <div
            key={m.label}
            style={{
              position: 'absolute',
              left: CARD_X[i],
              top: CARD_Y,
              width: CARD_W,
              height: CARD_H,
              borderRadius: 8,
              background: C.card,
              border: '0.7px solid #ececef',
              boxSizing: 'border-box',
              overflow: 'hidden',
              transform: `translateY(${-2.5 * lift}px) scale(${1 + 0.035 * lift})`,
              boxShadow: `0 ${8 * lift}px ${22 * lift}px rgba(60, 20, 120, ${0.1 * lift})`,
            }}
          >
            <div style={{position: 'absolute', left: 14, top: 11.5, fontSize: 7.8, color: C.inkSoft}}>{m.label}</div>
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 23.5,
                fontSize: 15.5,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: -0.1,
                fontVariantNumeric: 'tabular-nums',
                opacity: value,
                transform: `translateY(${(1 - value) * 4}px)`,
              }}
            >
              {m.format(m.value * count)}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                width: 20,
                height: 20,
                borderRadius: 5,
                border: '0.7px solid #ebe8f0',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `rgba(240, 234, 250, ${Math.sin(Math.PI * icon)})`,
                transform: `scale(${1 + 0.12 * Math.sin(Math.PI * icon)})`,
              }}
            >
              <m.Icon size={10.5} color={C.iconInk} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                height: FOOT_H,
                background: C.cardFoot,
                borderTop: '0.7px solid #f0f0f2',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                fontSize: 6.3,
                color: C.muted,
              }}
            >
              <span style={{marginLeft: 14}}>From Last Month</span>
              <span
                style={{
                  marginLeft: 'auto',
                  marginRight: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: C.positive,
                  fontWeight: 500,
                  opacity: foot,
                  transform: `translateX(${(1 - foot) * 4}px)`,
                }}
              >
                <TrendUp size={6.5} color={C.positive} />
                {m.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

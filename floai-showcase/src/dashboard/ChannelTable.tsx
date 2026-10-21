import React from 'react';
import {C, FONT} from '../theme';
import {SortIcon} from './Icons';

const COLS = [66, 219.5, 375, 529.5, 685.5];
const HEAD = ['Channel', 'Impressions', 'Clicks', 'CTR', 'Conversions'];
const ROWS = [
  ['Instagram', '52.3K', '1,892', '3.6%', '123'],
  ['Facebook', '38.7K', '1,445', '3.7%', '43'],
];

export const ChannelTable: React.FC = () => (
  <div style={{fontFamily: FONT}}>
    <div
      style={{
        position: 'absolute',
        left: 52,
        top: 480,
        width: 745,
        height: 260,
        borderRadius: 9,
        background: C.card,
        border: '0.7px solid #ececef',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 77, width: '100%', height: 0.7, background: '#efeff2'}} />
      <div style={{position: 'absolute', left: 0, top: 118, width: '100%', height: 40, background: C.rowAlt, borderTop: '0.7px solid #ececef'}} />
    </div>
    <div style={{position: 'absolute', left: 66, top: 494, fontSize: 12.8, fontWeight: 500, color: C.ink, letterSpacing: -0.1}}>
      Channel Performances
    </div>
    {HEAD.map((h, i) => (
      <div
        key={h}
        style={{
          position: 'absolute',
          left: COLS[i],
          top: 536,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          fontSize: 8,
          fontWeight: 600,
          color: '#262629',
          lineHeight: '10px',
        }}
      >
        {h}
        <SortIcon size={5.5} color="#c4c4c9" />
      </div>
    ))}
    {ROWS.map((row, r) =>
      row.map((cell, i) => (
        <div
          key={`${r}-${i}`}
          style={{position: 'absolute', left: COLS[i], top: 569 + r * 42, fontSize: 6.8, lineHeight: '9px', color: '#3d3d42'}}
        >
          {cell}
        </div>
      )),
    )}
  </div>
);

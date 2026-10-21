import React from 'react';

// Phone screen is designed at 390×844 (iPhone 14/15 logical size).
export const PHONE_W = 390;
export const PHONE_H = 844;

export const Phone: React.FC<{
  height: number; // on-screen height of the glass
  children: React.ReactNode;
  island?: boolean;
  screenBg?: string;
  style?: React.CSSProperties;
}> = ({height, children, island = true, screenBg = '#ffffff', style}) => {
  const s = height / PHONE_H;
  const bezel = 13 * s;
  return (
    <div
      style={{
        position: 'relative',
        width: PHONE_W * s + bezel * 2,
        height: PHONE_H * s + bezel * 2,
        borderRadius: 62 * s,
        background: 'linear-gradient(145deg, #3a3d44, #121316 40%, #2b2d33)',
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: `0 ${40 * s}px ${90 * s}px rgba(0,0,0,0.35), 0 ${8 * s}px ${20 * s}px rgba(0,0,0,0.2), inset 0 0 0 ${2 * s}px #55585f`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: PHONE_W * s,
          height: PHONE_H * s,
          borderRadius: 50 * s,
          overflow: 'hidden',
          background: screenBg,
        }}
      >
        <div style={{width: PHONE_W, height: PHONE_H, transform: `scale(${s})`, transformOrigin: '0 0', position: 'relative'}}>
          {children}
        </div>
        {island && (
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
            }}
          />
        )}
      </div>
    </div>
  );
};

export const BROWSER_BAR = 44;

export const Browser: React.FC<{
  width: number;
  height: number;
  url: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}> = ({width, height, url, children, style, dark}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 16,
      overflow: 'hidden',
      background: '#ffffff',
      boxShadow: '0 50px 120px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.18)',
      position: 'relative',
      ...style,
    }}
  >
    <div
      style={{
        height: BROWSER_BAR,
        background: dark ? '#1c1d21' : '#f1f1f3',
        borderBottom: `1px solid ${dark ? '#2b2c31' : '#e2e2e6'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        gap: 8,
      }}
    >
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
      ))}
      <div
        style={{
          margin: '0 auto',
          width: Math.min(460, width * 0.4),
          height: 26,
          borderRadius: 8,
          background: dark ? '#2a2b30' : '#ffffff',
          border: `1px solid ${dark ? '#34353b' : '#e4e4e8'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Figtree, sans-serif',
          fontSize: 13,
          color: dark ? '#9a9aa2' : '#8a8a92',
        }}
      >
        {url}
      </div>
      <div style={{width: 52}} />
    </div>
    <div style={{position: 'absolute', left: 0, top: BROWSER_BAR, width, height: height - BROWSER_BAR, overflow: 'hidden'}}>
      {children}
    </div>
  </div>
);

export const StatusBar: React.FC<{color?: string}> = ({color = '#111'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: PHONE_W,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      padding: '6px 30px 0 34px',
      boxSizing: 'border-box',
      fontFamily: 'Figtree, sans-serif',
      fontWeight: 600,
      fontSize: 16,
      color,
      zIndex: 2,
    }}
  >
    9:41
    <div style={{marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center'}}>
      <svg width="18" height="12" viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={color} />
        ))}
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4.2 7.3a5.6 5.6 0 0 1 7.6 0" />
        <circle cx="8" cy="10" r="1" fill={color} />
      </svg>
      <div style={{width: 25, height: 12, borderRadius: 3.5, border: `1.2px solid ${color}`, padding: 1.5, boxSizing: 'border-box', opacity: 0.9}}>
        <div style={{width: '100%', height: '100%', borderRadius: 1.5, background: color}} />
      </div>
    </div>
  </div>
);

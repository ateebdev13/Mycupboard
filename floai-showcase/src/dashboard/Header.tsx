import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, prog} from '../theme';
import {T} from '../timeline';
import {BellIcon, BoardIcon, ChevronDown, DocIcon, FilterIcon, HomeIcon, TagIcon} from './Icons';

const fadeUp = (p: number, dist = 6): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});

const NavPill: React.FC<{
  x: number;
  w: number;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  p: number;
}> = ({x, w, label, icon, active, p}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 14,
      width: w,
      height: 22,
      borderRadius: 11,
      background: active ? `linear-gradient(90deg, ${C.activeFrom}, ${C.activeTo})` : C.pill,
      border: active ? 'none' : '0.6px solid #eceef0',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4.5,
      color: active ? '#ffffff' : C.pillInk,
      fontSize: 7.4,
      fontWeight: 500,
      letterSpacing: -0.05,
      boxShadow: active ? '0 2px 6px rgba(120, 70, 230, 0.28)' : 'none',
      ...fadeUp(p, 4),
    }}
  >
    {icon}
    {label}
  </div>
);

const Divider: React.FC<{x: number; p: number}> = ({x, p}) => (
  <div style={{position: 'absolute', left: x, top: 19, width: 0.7, height: 12, background: '#e6e6e8', opacity: p}} />
);

export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const s = (i: number) => prog(frame, T.headerIn + i * 3, 22);
  const navIcon = (Icon: typeof HomeIcon, active = false) => (
    <Icon size={8.5} color={active ? '#ffffff' : '#b0b2b6'} />
  );

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 850, height: 52, fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 14,
          fontSize: 19.5,
          fontWeight: 800,
          letterSpacing: 0.4,
          color: C.logoInk,
          lineHeight: '22px',
          ...fadeUp(s(0), 5),
        }}
      >
        Flo<span style={{color: C.brandDeep}}>AI</span>
      </div>

      <NavPill x={202} w={68} label="Home" icon={navIcon(HomeIcon)} p={s(1)} />
      <Divider x={274} p={s(2)} />
      <NavPill x={287} w={67} label="Strategy" icon={navIcon(TagIcon)} p={s(2)} />
      <Divider x={367} p={s(3)} />
      <NavPill x={379} w={69} label="Analytics" icon={navIcon(BoardIcon, true)} active p={s(3)} />
      <Divider x={461} p={s(4)} />
      <NavPill x={474} w={102} label="Subscription Plans" icon={navIcon(DocIcon)} p={s(4)} />

      {/* Notifications */}
      <div
        style={{
          position: 'absolute',
          left: 651,
          top: 13,
          width: 24,
          height: 24,
          borderRadius: 12,
          border: '0.7px solid #ececee',
          background: '#ffffff',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...fadeUp(s(5), 4),
        }}
      >
        <BellIcon size={11} color="#2b2b2b" />
        <div
          style={{
            position: 'absolute',
            left: 13.2,
            top: 5.6,
            width: 4.2,
            height: 4.2,
            borderRadius: 3,
            background: C.alert,
            border: '0.8px solid #ffffff',
          }}
        />
      </div>
      <div style={{position: 'absolute', left: 688, top: 15, width: 0.7, height: 20, background: '#e6e6e8', opacity: s(5)}} />

      {/* Profile */}
      <div
        style={{
          position: 'absolute',
          left: 698.5,
          top: 8,
          width: 98.5,
          height: 35,
          borderRadius: 17.5,
          background: '#f8f8f9',
          border: '0.7px solid #ececee',
          boxSizing: 'border-box',
          ...fadeUp(s(6), 4),
        }}
      >
        <Img
          src={staticFile('avatar.png')}
          style={{position: 'absolute', left: 6.5, top: 3.5, width: 26, height: 26, borderRadius: 13, objectFit: 'cover'}}
        />
        <div style={{position: 'absolute', left: 41.5, top: 5.5, fontSize: 8.6, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap'}}>
          Floyd Miles
        </div>
        <div style={{position: 'absolute', left: 41.5, top: 19.5, fontSize: 5.8, color: C.faint, whiteSpace: 'nowrap'}}>
          View Profile
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 51.5, width: 850, height: 0.7, background: '#efeff1'}} />
    </div>
  );
};

export const PageTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const a = prog(frame, T.titleIn, 28);
  const b = prog(frame, T.titleIn + 6, 28);
  const c = prog(frame, T.titleIn + 10, 28);
  return (
    <div style={{fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 51,
          top: 74,
          fontSize: 27,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: -0.3,
          lineHeight: '34px',
          ...fadeUp(a, 8),
        }}
      >
        Analytics
      </div>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 117,
          fontSize: 10.4,
          color: '#6f6f74',
          lineHeight: '14px',
          ...fadeUp(b, 6),
        }}
      >
        Track your marketing performance and insights
      </div>
      <div
        style={{
          position: 'absolute',
          left: 692,
          top: 92,
          width: 106,
          height: 27,
          borderRadius: 7,
          background: '#ffffff',
          border: '0.7px solid #ebebee',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          fontSize: 7.4,
          color: C.inkSoft,
          ...fadeUp(c, 5),
        }}
      >
        <FilterIcon size={9} color="#2b2b2b" style={{marginLeft: 8}} />
        <span style={{marginLeft: 12}}>Last 30 days</span>
        <ChevronDown size={8} color="#9a9a9f" style={{marginLeft: 'auto', marginRight: 9}} />
      </div>
    </div>
  );
};

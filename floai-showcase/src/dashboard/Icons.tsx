import React from 'react';

type P = {size: number; color: string; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode; fill?: boolean; sw?: number}> = ({
  size,
  color,
  style,
  children,
  fill,
  sw = 1.8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? color : 'none'}
    stroke={fill ? 'none' : color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block', ...style}}
  >
    {children}
  </svg>
);

export const HomeIcon: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M3 10.2 12 3l9 7.2V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" />
    <path d="M9 21.5v-6h6v6" fill="#ffffff" opacity={0.9} />
  </Svg>
);

export const TagIcon: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M2.5 4.2A1.7 1.7 0 0 1 4.2 2.5h6.6c.45 0 .88.18 1.2.5l9 9a1.7 1.7 0 0 1 0 2.4l-6.6 6.6a1.7 1.7 0 0 1-2.4 0l-9-9a1.7 1.7 0 0 1-.5-1.2Z" />
    <circle cx="7.5" cy="7.5" r="1.8" fill="#ffffff" />
  </Svg>
);

export const BoardIcon: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M2.5 3.5h19a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" />
    <path d="M6 12.5 9.5 9l3 2.5L17 7" stroke="#6c4ae8" strokeWidth={1.8} fill="none" />
    <path d="M8 21 12 16.5 16 21" stroke={p.color} strokeWidth={1.8} fill="none" />
  </Svg>
);

export const DocIcon: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M5 2.5h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z" />
    <path d="M8 12h8M8 15.5h8M8 19h5" stroke="#ffffff" strokeWidth={1.6} />
  </Svg>
);

export const BellIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 9.5a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15.5 6 9.5Z" />
    <path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" />
  </Svg>
);

export const FilterIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={2.1}>
    <path d="M3.5 4.5h17l-6.5 7.7v6.3l-4 2v-8.3Z" />
  </Svg>
);

export const ChevronDown: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const BarsIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={2}>
    <path d="M5 20V15M9.5 20v-8M14 20V9M18.5 20V5M3.5 20.5h17" />
    <path d="M4.5 11 15 4" />
  </Svg>
);

export const CursorIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={1.7}>
    <path d="m10 9 10.5 4-4.6 1.7L14 19.5Z" />
    <path d="M7 2.5v2.5M2.5 7H5M3.8 3.8l1.7 1.7M10.2 3.8 8.5 5.5M3.8 10.2l1.7-1.7" />
  </Svg>
);

export const RefreshDollarIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={1.7}>
    <path d="M20.5 12A8.5 8.5 0 1 1 17.8 5.8" />
    <path d="M18.5 2.5v3.6h-3.6" />
    <path d="M14.3 9.4c-.4-.8-1.3-1.2-2.3-1.2-1.3 0-2.3.7-2.3 1.7 0 2.4 4.7 1.2 4.7 3.6 0 1-1 1.8-2.4 1.8-1.1 0-2-.5-2.4-1.3M12 7v1.2M12 15.3v1.2" />
  </Svg>
);

export const TargetIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={1.8}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Svg>
);

export const TrendUp: React.FC<P> = (p) => (
  <Svg {...p} sw={2.2}>
    <path d="M6 18 18 6M9 6h9v9" />
  </Svg>
);

export const SortIcon: React.FC<P> = (p) => (
  <Svg {...p} sw={2.4}>
    <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />
  </Svg>
);

export const PieIcon: React.FC<P> = (p) => (
  <svg width={p.size} height={p.size} viewBox="0 0 24 24" style={{display: 'block', ...p.style}}>
    <circle cx="12" cy="12" r="11" fill={p.color} />
    <path d="M12 12V4.5A7.5 7.5 0 0 1 19.5 12Z" fill="#ffffff" opacity={0.9} />
  </svg>
);

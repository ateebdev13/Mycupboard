import React from 'react';
import {Box, SRC, Source} from '../sources';
import {Crop, Screen} from './Crop';
import {PHONE_W, StatusBar} from './Devices';

// Responsive mobile versions of the two desktop dashboards, assembled from the
// original UI panels (no redrawn UI): header, 2×2 KPI grid, full-width charts.
const PAD = 16;
const GAP = 12;
const FULL = PHONE_W - PAD * 2;
const HALF = (FULL - GAP) / 2;

const Row: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: GAP, ...style}}>{children}</div>
);

const Avatar: React.FC<{source: Source; box: Box}> = ({source, box}) => (
  <Crop source={source} box={box} width={38} radius={19} style={{marginLeft: 'auto', boxShadow: '0 0 0 1.5px #ececef'}} />
);

const Stack: React.FC<{scroll: number; bg: string; children: React.ReactNode}> = ({scroll, bg, children}) => (
  <div style={{position: 'absolute', inset: 0, background: bg}}>
    <StatusBar />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 54,
        width: PHONE_W,
        padding: `8px ${PAD}px 40px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: GAP,
        transform: `translateY(${-scroll}px)`,
      }}
    >
      {children}
    </div>
  </div>
);

export const GoatMobile: React.FC<{scroll?: number}> = ({scroll = 0}) => {
  const g = SRC.goat;
  return (
    <Stack scroll={scroll} bg="#f6f6f6">
      <Row style={{background: '#fff', borderRadius: 14, padding: '8px 12px', border: '1px solid #ececef'}}>
        <Crop source={g} box={[98, 78, 268, 136]} width={112} />
        <Avatar source={g} box={[1526, 82, 1578, 134]} />
      </Row>
      <Crop source={g} box={[438, 88, 568, 128]} width={138} style={{margin: '6px 0 2px'}} />
      <Row>
        <Crop source={g} box={[424, 370, 731, 546]} width={HALF} radius={12} />
        <Crop source={g} box={[751, 370, 1058, 546]} width={HALF} radius={12} />
      </Row>
      <Row>
        <Crop source={g} box={[1079, 370, 1386, 546]} width={HALF} radius={12} />
        <Crop source={g} box={[1407, 370, 1714, 546]} width={HALF} radius={12} />
      </Row>
      <Crop source={g} box={[424, 566, 1221, 963]} width={FULL} radius={14} />
      <Crop source={g} box={[1242, 566, 1714, 963]} width={FULL} radius={14} />
      <Crop source={g} box={[424, 985, 1110, 1268]} width={FULL} radius={14} />
    </Stack>
  );
};

export const FloaiMobile: React.FC<{scroll?: number}> = ({scroll = 0}) => {
  const f = SRC.floai;
  return (
    <Stack scroll={scroll} bg="#fafafa">
      <Row style={{background: '#fff', borderRadius: 14, padding: '8px 12px', border: '1px solid #ececef'}}>
        <Crop source={f} box={[176, 104, 296, 152]} width={84} />
        <Avatar source={f} box={[1432, 100, 1490, 158]} />
      </Row>
      <Crop source={f} box={[174, 228, 630, 338]} width={300} style={{margin: '4px 0 0'}} />
      <Crop source={f} box={[1406, 255, 1613, 310]} width={136} />
      <Row>
        <Crop source={f} box={[177, 371, 518, 546]} width={HALF} radius={12} />
        <Crop source={f} box={[540, 371, 881, 546]} width={HALF} radius={12} />
      </Row>
      <Row>
        <Crop source={f} box={[904, 371, 1245, 546]} width={HALF} radius={12} />
        <Crop source={f} box={[1267, 371, 1609, 546]} width={HALF} radius={12} />
      </Row>
      <Crop source={f} box={[177, 569, 1018, 980]} width={FULL} radius={14} />
      <Crop source={f} box={[1040, 569, 1611, 973]} width={FULL} radius={14} />
      <Crop source={f} box={[177, 1003, 900, 1222]} width={FULL} radius={14} />
    </Stack>
  );
};

export const TuraMobile: React.FC<{scroll?: number}> = ({scroll = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: '#ffffff', overflow: 'hidden'}}>
    <Screen source={SRC.turaMobile} width={PHONE_W} scroll={scroll} />
  </div>
);

export const ImageScreen: React.FC<{source: Source; scroll?: number}> = ({source, scroll = 0}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Screen source={source} width={PHONE_W} scroll={scroll} />
  </div>
);

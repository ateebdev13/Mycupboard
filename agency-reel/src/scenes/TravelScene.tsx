import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Phone} from '../components/Devices';
import {Cut, Label} from '../components/Kit';
import {ImageScreen} from '../components/MobileLayouts';
import {SRC} from '../sources';
import {PROJECT, drift, easeOut, mix, prog} from '../theme';

export const TRAVEL_LENGTH = 120;
const C = PROJECT.travel;

const Bg: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 45%, #e6fb98, ${C.bg} 70%)`}} />
);

/** A phone placed by its centre, with 3D rotation. */
const Placed: React.FC<{
  x: number;
  y: number;
  h: number;
  rx?: number;
  ry?: number;
  rz?: number;
  blur?: number;
  children: React.ReactNode;
}> = ({x, y, h, rx = 0, ry = 0, rz = 0, blur = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rz}deg)`,
      filter: blur ? `blur(${blur}px)` : undefined,
    }}
  >
    <Phone height={h} island={false}>
      {children}
    </Phone>
  </div>
);

const Left = () => <ImageScreen source={SRC.travelLeft} />;
const Right = () => <ImageScreen source={SRC.travelRight} />;

export const TravelScene: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{perspective: 2000}}>
    <Bg />

    {/* Phones fly in */}
    <Cut t={t} from={-10} dur={40}>
      {(lt) => {
        const l = lt - 10;
        const a = prog(l, -3, 20, easeOut);
        const b = prog(l, 2, 20, easeOut);
        return (
          <AbsoluteFill style={{perspective: 2000}}>
            <Placed x={mix(760, 800, a) - l * 0.6} y={mix(1500, 540, a)} h={820} rz={mix(-14, -4, a)} ry={mix(-30, 8, a)}>
              <Left />
            </Placed>
            <Placed x={mix(1180, 1130, b) + l * 0.6} y={mix(1550, 560, b)} h={820} rz={mix(14, 4, b)} ry={mix(30, -8, b)}>
              <Right />
            </Placed>
            <Label t={l} index="01" title="Trip Budget App" kind="Mobile App" color={C.ink} />
          </AbsoluteFill>
        );
      }}
    </Cut>

    {/* Close: trip stats header */}
    <Cut t={t} from={30} dur={15}>
      {(lt) => {
        const p = drift(lt / 15);
        return (
          <AbsoluteFill style={{perspective: 2000}}>
            <Placed x={960 + p * 40} y={1330 - p * 30} h={2050} rz={-6} ry={6}>
              <Left />
            </Placed>
          </AbsoluteFill>
        );
      }}
    </Cut>

    {/* Close: expense list */}
    <Cut t={t} from={45} dur={15}>
      {(lt) => {
        const p = drift(lt / 15);
        return (
          <AbsoluteFill style={{perspective: 2000}}>
            <Placed x={1040 - p * 50} y={30 - p * 60} h={2050} rz={5} ry={-8}>
              <Left />
            </Placed>
          </AbsoluteFill>
        );
      }}
    </Cut>

    {/* Trips screen hero, slow 3D turn */}
    <Cut t={t} from={60} dur={30}>
      {(lt) => {
        const p = drift(lt / 30);
        const e = prog(lt, 0, 10, easeOut);
        return (
          <AbsoluteFill style={{perspective: 1600}}>
            <Placed x={660} y={600} h={900} ry={mix(28, 18, p)} rz={-3} blur={6}>
              <Left />
            </Placed>
            <Placed x={mix(1180, 1140, p)} y={540 + (1 - e) * 40} h={1000} ry={mix(-26, -10, p)} rx={4}>
              <Right />
            </Placed>
          </AbsoluteFill>
        );
      }}
    </Cut>

    {/* Close: trip cards */}
    <Cut t={t} from={90} dur={15}>
      {(lt) => {
        const p = drift(lt / 15);
        return (
          <AbsoluteFill style={{perspective: 2000}}>
            <Placed x={980 - p * 30} y={520 + p * 40} h={2150} rz={-4} rx={6}>
              <Right />
            </Placed>
          </AbsoluteFill>
        );
      }}
    </Cut>

    {/* Pair, top-down float */}
    <Cut t={t} from={105} dur={25}>
      {(lt) => {
        const p = drift(lt / 25);
        return (
          <AbsoluteFill style={{perspective: 1800}}>
            <Placed x={790} y={560 - p * 30} h={860} rx={18} rz={-8}>
              <Left />
            </Placed>
            <Placed x={1140} y={520 + p * 30} h={860} rx={18} rz={-8}>
              <Right />
            </Placed>
          </AbsoluteFill>
        );
      }}
    </Cut>
  </AbsoluteFill>
);

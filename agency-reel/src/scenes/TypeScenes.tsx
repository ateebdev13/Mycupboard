import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Browser, Phone} from '../components/Devices';
import {Screen} from '../components/Crop';
import {Cut, Slam} from '../components/Kit';
import {FloaiMobile, GoatMobile, ImageScreen, TuraMobile} from '../components/MobileLayouts';
import {SRC} from '../sources';
import {FONT, easeInOut, easeOut, prog} from '../theme';

const INK = '#0b0b0c';

const Dot: React.FC<{color: string}> = ({color}) => <span style={{color}}>.</span>;

export const INTRO_LENGTH = 60;

export const IntroScene: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: INK}}>
    <Cut t={t} from={0} dur={15}>
      {(lt) => (
        <Slam t={lt}>
          Websites<Dot color="#e1ff8a" />
        </Slam>
      )}
    </Cut>
    <Cut t={t} from={15} dur={15}>
      {(lt) => (
        <Slam t={lt}>
          Apps<Dot color="#d6f472" />
        </Slam>
      )}
    </Cut>
    <Cut t={t} from={30} dur={15}>
      {(lt) => (
        <Slam t={lt}>
          Dashboards<Dot color="#ff5a4a" />
        </Slam>
      )}
    </Cut>
    <Cut t={t} from={45} dur={25}>
      {(lt) => {
        const a = prog(lt, 0, 10, easeOut);
        const b = prog(lt, 3, 10, easeOut);
        const line = prog(lt, 2, 12, easeInOut);
        return (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#fff'}}>
            <div style={{overflow: 'hidden', height: 190}}>
              <div style={{fontSize: 170, fontWeight: 800, letterSpacing: -7, lineHeight: '190px', transform: `translateY(${(1 - a) * 100}%)`}}>
                Selected Work
              </div>
            </div>
            <div style={{width: 760 * line, height: 3, background: '#8133f1', margin: '18px 0 22px'}} />
            <div style={{overflow: 'hidden', height: 40}}>
              <div style={{fontSize: 28, fontWeight: 600, letterSpacing: 8, opacity: 0.7, transform: `translateY(${(1 - b) * 100}%)`}}>
                WEB · MOBILE · PRODUCT DESIGN
              </div>
            </div>
          </AbsoluteFill>
        );
      }}
    </Cut>
  </AbsoluteFill>
);

export const FINALE_LENGTH = 150;

const ITEMS: {kind: 'web' | 'phone'; node: React.ReactNode; url?: string}[] = [
  {kind: 'web', node: <Screen source={SRC.turaDesktop} width={900} />, url: 'Tura Executive'},
  {kind: 'phone', node: <ImageScreen source={SRC.travelLeft} />},
  {kind: 'web', node: <Screen source={SRC.goat} width={900} />, url: 'G.O.A.T. Leads'},
  {kind: 'phone', node: <FloaiMobile />},
  {kind: 'web', node: <Screen source={SRC.floai} width={900} />, url: 'FloAI · Analytics'},
  {kind: 'phone', node: <TuraMobile />},
  {kind: 'phone', node: <ImageScreen source={SRC.travelRight} />},
  {kind: 'phone', node: <GoatMobile />},
];

const Column: React.FC<{items: typeof ITEMS; offset: number}> = ({items, offset}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 50, transform: `translateY(${offset}px)`, alignItems: 'center'}}>
    {[...items, ...items].map((it, i) =>
      it.kind === 'web' ? (
        <Browser key={i} width={900} height={560} url={it.url ?? ''}>
          {it.node}
        </Browser>
      ) : (
        <Phone key={i} height={760}>
          {it.node}
        </Phone>
      ),
    )}
  </div>
);

export const FinaleScene: React.FC<{t: number}> = ({t}) => {
  const words: [string, string][] = [
    ['Web', '#e1ff8a'],
    ['Mobile', '#d6f472'],
    ['Product', '#ff5a4a'],
  ];
  return (
    <AbsoluteFill style={{background: INK}}>
      {/* Device wall */}
      <Cut t={t} from={-10} dur={70}>
        {(lt) => {
          const l = lt - 10;
          const e = prog(l, -4, 24, easeOut);
          const move = l * 9;
          const cols = [
            [ITEMS[0], ITEMS[1], ITEMS[4]],
            [ITEMS[3], ITEMS[2], ITEMS[6]],
            [ITEMS[4], ITEMS[5], ITEMS[0]],
            [ITEMS[7], ITEMS[2], ITEMS[1]],
          ];
          return (
            <AbsoluteFill style={{perspective: 2400, overflow: 'hidden'}}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  display: 'flex',
                  gap: 50,
                  alignItems: 'flex-start',
                  transform: `translate(-50%, -50%) rotateX(${28 - 6 * e}deg) rotateZ(${-16 + 2 * e}deg) scale(${0.62 + 0.08 * e})`,
                }}
              >
                {cols.map((items, i) => (
                  <Column key={i} items={items} offset={(i % 2 ? -1400 + move : -400 - move)} />
                ))}
              </div>
              <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(11,11,12,0) 40%, rgba(11,11,12,0.85) 100%)'}} />
            </AbsoluteFill>
          );
        }}
      </Cut>

      {words.map(([w, c], i) => (
        <Cut key={w} t={t} from={60 + i * 10} dur={10}>
          {(lt) => (
            <Slam t={lt}>
              {w}
              <Dot color={c} />
            </Slam>
          )}
        </Cut>
      ))}

      {/* End card */}
      <Cut t={t} from={90} dur={70}>
        {(lt) => {
          const a = prog(lt, 0, 12, easeOut);
          const b = prog(lt, 5, 12, easeOut);
          const line = prog(lt, 4, 16, easeInOut);
          const fade = interpolate(lt, [50, 60], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#fff', opacity: fade}}>
              <div style={{overflow: 'hidden', height: 150}}>
                <div style={{fontSize: 128, fontWeight: 800, letterSpacing: -5, lineHeight: '150px', transform: `translateY(${(1 - a) * 100}%)`}}>
                  Let&apos;s build yours<Dot color="#8133f1" />
                </div>
              </div>
              <div style={{display: 'flex', gap: 14, margin: '26px 0 0', opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>
                {['#d6f472', '#e1ff8a', '#ff5a4a', '#8133f1'].map((c) => (
                  <div key={c} style={{width: 120 * line, height: 6, borderRadius: 3, background: c}} />
                ))}
              </div>
            </AbsoluteFill>
          );
        }}
      </Cut>
    </AbsoluteFill>
  );
};

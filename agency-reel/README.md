# Agency reel (Remotion)

A 26-second, 1920×1080 @ 30 fps showreel of four projects, cut to a 120 BPM beat.
The final render is in [`renders/agency-reel.mp4`](renders/agency-reel.mp4).

| Time | Section |
| --- | --- |
| 0–2 s | Kinetic type: Websites. Apps. Dashboards. → Selected Work |
| 2–6 s | 01 Trip Budget App: phones fly in, close-ups, 3D turns |
| 6–11 s | 02 Tura Executive: browser hero, 3 close-ups, desktop → mobile morph, side by side |
| 11–16 s | 03 G.O.A.T. Leads: same pattern, with a mobile layout built from its own panels |
| 16–21 s | 04 FloAI: same pattern |
| 21–26 s | Scrolling device wall → Web. Mobile. Product. → end card |

Screens are cut straight from the supplied presentation images (`scripts` is not needed for
that; the crops live in `public/work`). Tura and the travel app use their own mobile designs.
G.O.A.T. and FloAI had no mobile design, so their mobile versions re-stack the original UI panels
(2×2 KPI grid, full-width charts) without redrawing anything (`src/components/MobileLayouts.tsx`).

```bash
npm install
npm run studio   # preview
npm run render   # → out/agency-reel.mp4
npm run music    # regenerate the synthesised soundtrack
```

To change copy, edit `src/scenes/TypeScenes.tsx` (intro and end card) and the project configs in
`src/Reel.tsx`. Scene timings sit on a 15-frame beat grid; if you move a cut, update
`SCENE_CUTS` in `scripts/make_music.py` and re-run `npm run music` so the whooshes stay in sync.

# FloAI — Analytics showcase (Remotion)

A 15-second, 1920×1080 @ 30 fps product showcase of the FloAI analytics dashboard.
The final render is in [`renders/floai-showcase.mp4`](renders/floai-showcase.mp4).

| Time | Beat |
| --- | --- |
| 0–3 s | Dashboard rises and un-tilts over the brand purple; header, title and filter stagger in |
| 3–6 s | Camera pushes in on the metric cards; each lifts, counts up and reveals its trend badge |
| 6–10 s | Focus on Performance Trends: lines draw on, area fills, hover scrubs to Jan22 with the tooltip |
| 10–13 s | Focus on Demographic Breakdown: rotational sweep of the donut, leader labels and legend |
| 13–15 s | Pull back to the full dashboard composition |

The UI is rebuilt in React from the reference screenshot (`public/reference.png`) on the
screenshot's own pixel grid (850-unit-wide window), so every element stays sharp at any
camera zoom. Data, colours, copy and layout follow the screenshot.

## Commands

```bash
npm install
npm run studio   # preview in Remotion Studio
npm run render   # → out/floai-showcase.mp4 (H.264, CRF 16, AAC)
npm run music    # regenerate public/audio/ambient-pad.wav
```

## Notes

- Font: [Figtree](https://fonts.google.com/specimen/Figtree) (closest Google Fonts match to the
  screenshot's typeface), bundled in `public/fonts`. Swap in the original brand font file there if you have it.
- Audio: no licensed music asset was available, so `scripts/make_music.py` synthesises a soft
  ambient pad with a light bell arpeggio. Replace `public/audio/ambient-pad.wav` to use your own track.
- The avatar is cropped from the screenshot, so it is low resolution; drop a sharper
  `public/avatar.png` in to improve it.
- Camera keyframes and section timings live in `src/timeline.ts`.

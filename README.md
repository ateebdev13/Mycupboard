# MetaLogics website

Next.js 15 · TypeScript · Tailwind CSS 4 · Motion

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

- `src/app/globals.css` – design tokens (colours, fonts, easing) and the logo marquee keyframes
- `src/components/Navbar.tsx` – sticky nav, gliding hover pill, Services trigger
- `src/components/ServicesMenu.tsx` – animated mega-menu with shared hover highlight
- `src/components/MobileMenu.tsx` – full-screen menu for < 1024px
- `src/components/Hero.tsx` – word-by-word headline reveal, CTAs, scroll depth
- `src/components/FlowerField.tsx` – WebGL wind animation over the original flower photo
- `src/components/LogoMarquee.tsx` – seamless client logo loop
- `src/lib/sound.ts` – opt-in hover sounds (off by default, toggle in navbar)

## Placeholders to replace from Figma

- `public/hero/flowers-placeholder.jpg` – cropped from a screenshot; replace with the full-resolution export (update `width`/`height` in `Hero.tsx`)
- `public/logos/*.png` – cropped from a screenshot; replace with SVG exports
- Wordmark is live text; replace with the SVG logo
- Font is Plus Jakarta Sans as a stand-in; type sizes, spacing, radii and shadows are estimates

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

## Assets

- `public/hero/flowers.webp` – hero photo from Figma (2000 × 963), animated by `FlowerField`
- `public/logos/*.svg` – client logos exported from Figma
- `src/app/fonts/` – Google Sans Flex (OFL), latin subset with weight + slant axes

Still placeholders (cropped from a screenshot):

- `public/logos/*.png` – replace with the SVG exports

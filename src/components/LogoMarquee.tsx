"use client";

import { useEffect, useRef } from "react";

// SVGs are Figma exports (193 × 86 tiles). PNGs are placeholders cropped from
// a screenshot until their SVG exports arrive; they're centred in the same tile.
const logos: { name: string; src: string; w?: number; h?: number }[] = [
  { name: "Edusource", src: "/logos/edusource.svg" },
  { name: "Little Vista", src: "/logos/little-vista.png", w: 201, h: 51 },
  { name: "ANC", src: "/logos/anc.svg" },
  { name: "Mesakem", src: "/logos/mesakem.png", w: 249, h: 33 },
  { name: "Self Made Couture", src: "/logos/self-made.png", w: 207, h: 75 },
  { name: "Allied X", src: "/logos/allied-x.svg" },
  { name: "MyTick", src: "/logos/mytick.png", w: 171, h: 51 },
  { name: "Popcurb", src: "/logos/popcurb.png", w: 204, h: 51 },
  { name: "KVO", src: "/logos/kvo.png", w: 135, h: 45 },
  { name: "Rental Paid", src: "/logos/rental-paid.png", w: 189, h: 66 },
];

const SPEED = 42; // px per second
const SCALE = 0.6; // placeholder raster px -> CSS px

export function LogoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duration follows content width so speed stays constant at any size.
    const ro = new ResizeObserver(() => {
      const setWidth = track.scrollWidth / 2;
      track.style.setProperty("--marquee-duration", `${setWidth / SPEED}s`);
    });
    ro.observe(track);

    // Don't spend frames on an animation nobody can see.
    const io = new IntersectionObserver(([entry]) => {
      track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    io.observe(track);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Ease to a slow drift on hover rather than stopping dead.
  const setRate = (target: number) => {
    const anim = trackRef.current?.getAnimations()[0];
    if (!anim) return;
    const from = anim.playbackRate;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - t, 3);
      anim.updatePlaybackRate(from + (target - from) * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <section aria-labelledby="clients-heading" className="bg-white pb-14 pt-16 md:pb-20 md:pt-[109px]">
      <h2
        id="clients-heading"
        className="px-5 text-center text-[12px] font-light uppercase leading-[18px] text-body md:text-[14px]"
      >
        Trusted by 100+ high growth startups and enterprise platforms
      </h2>
      <div
        className="marquee-mask mt-8 overflow-hidden motion-reduce:overflow-x-auto md:mt-11"
        onPointerEnter={(e) => e.pointerType === "mouse" && setRate(0.25)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setRate(1)}
      >
        <div ref={trackRef} className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center gap-4 pr-4 md:gap-7 md:pr-7"
            >
              {logos.map((logo) => (
                <li
                  key={logo.name}
                  className="flex h-[70px] w-[156px] shrink-0 items-center justify-center md:h-[86px] md:w-[193px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.name : ""}
                    width={logo.w ? Math.round(logo.w * SCALE) : 193}
                    height={logo.h ? Math.round(logo.h * SCALE) : 86}
                    loading="lazy"
                    draggable={false}
                    className={`select-none opacity-85 transition-opacity duration-300 hover:opacity-100 ${
                      logo.w ? "h-auto max-w-[80%]" : "size-full"
                    }`}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

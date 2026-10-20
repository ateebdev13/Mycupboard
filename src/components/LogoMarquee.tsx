"use client";

import { useEffect, useRef } from "react";

// Placeholder rasters cropped from the approved screenshot; replace with the
// SVG exports from Figma (keep the names, update width/height).
const logos = [
  { name: "Little Vista", src: "/logos/little-vista.png", w: 201, h: 51 },
  { name: "Mesakem", src: "/logos/mesakem.png", w: 249, h: 33 },
  { name: "Self Made Couture", src: "/logos/self-made.png", w: 207, h: 75 },
  { name: "MyTick", src: "/logos/mytick.png", w: 171, h: 51 },
  { name: "Popcurb", src: "/logos/popcurb.png", w: 204, h: 51 },
  { name: "KVO", src: "/logos/kvo.png", w: 135, h: 45 },
  { name: "Rental Paid", src: "/logos/rental-paid.png", w: 189, h: 66 },
];

const SPEED = 42; // px per second
const SCALE = 0.6; // raster px -> CSS px

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
    <section aria-labelledby="clients-heading" className="bg-white py-14 md:py-16">
      <h2
        id="clients-heading"
        className="px-5 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-muted md:text-[12px]"
      >
        Trusted by 100+ high growth startups and enterprise platforms
      </h2>
      <div
        className="marquee-mask mt-8 overflow-hidden motion-reduce:overflow-x-auto md:mt-10"
        onPointerEnter={(e) => e.pointerType === "mouse" && setRate(0.25)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setRate(1)}
      >
        <div ref={trackRef} className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20"
            >
              {logos.map((logo) => (
                <li key={logo.name} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.name : ""}
                    width={Math.round(logo.w * SCALE)}
                    height={Math.round(logo.h * SCALE)}
                    loading="lazy"
                    draggable={false}
                    className="h-auto select-none opacity-80 transition-opacity duration-300 hover:opacity-100"
                    style={{ width: Math.round(logo.w * SCALE) }}
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

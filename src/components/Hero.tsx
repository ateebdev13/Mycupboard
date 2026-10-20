"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { Fragment, useRef } from "react";
import { useHoverSound } from "@/lib/sound";
import { FlowerField } from "./FlowerField";
import { ArrowUpRight, FlagIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

// Each fragment is animated as its own word; style comes from the design.
const headline: { text: string; className: string }[] = [
  { text: "Building", className: "font-bold" },
  { text: "AI", className: "font-normal italic" },
  { text: "Products", className: "font-normal italic" },
  { text: "that", className: "font-bold" },
  { text: "Reduce", className: "font-normal" },
  { text: "Costs", className: "font-normal" },
];

const words: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};

// Words rise out of a mask while a light blur clears: reads as "settling into
// focus" rather than a generic fade, and finishes in well under a second.
const word: Variants = {
  hidden: { y: "105%", opacity: 0, filter: "blur(6px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

const fadeUp = (delay: number): Variants => ({
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE, delay } },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Light depth on scroll: copy drifts up a touch faster than the flowers.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const flowersY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const ctaSound = useHoverSound("cta");

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-gradient-to-b from-hero to-hero-deep"
    >
      <motion.div
        style={{ y: copyY }}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center px-5 pt-16 text-center md:pt-24"
      >
        <motion.p
          variants={fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-[4px] bg-white px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-ink shadow-[0_1px_2px_rgba(13,33,61,0.05)]"
        >
          <FlagIcon className="size-3" />
          One Team. Idea to Production.
        </motion.p>

        <motion.h1
          variants={words}
          className="mt-6 max-w-[16ch] text-balance text-[38px] leading-[1.1] tracking-[-0.025em] text-ink sm:max-w-none sm:text-[46px] lg:text-[52px]"
        >
          {headline.map((w, i) => (
            <Fragment key={i}>
              <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] pr-[0.06em] align-top">
                <motion.span variants={word} className={`inline-block will-change-transform ${w.className}`}>
                  {w.text}
                </motion.span>
              </span>
              {i < headline.length - 1 && " "}
            </Fragment>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp(0.45)}
          className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-ink-soft sm:max-w-none md:text-[18px]"
        >
          One team for your entire product from first strategy call to the final launch
        </motion.p>

        <motion.div variants={fadeUp(0.55)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            onPointerEnter={ctaSound}
            className="rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white transition-[transform,box-shadow,background-color] duration-300 ease-out-expo hover:-translate-y-px hover:bg-[#16304f] hover:shadow-[0_12px_24px_-12px_rgba(13,33,61,0.6)] active:translate-y-0 active:scale-[0.98]"
          >
            Get In Touch
          </a>
          <a
            href="#case-studies"
            onPointerEnter={ctaSound}
            className="group inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-[15px] font-medium text-ink transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-px hover:border-[#d5d9e0] hover:shadow-[0_12px_24px_-14px_rgba(13,33,61,0.3)] active:translate-y-0 active:scale-[0.98]"
          >
            Explore Our Work
            {/* Arrow exits top-right while a copy slides in from bottom-left. */}
            <span className="relative size-4 overflow-hidden">
              <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-4 group-hover:-translate-y-4" />
              <ArrowUpRight className="absolute inset-0 size-4 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: flowersY, transformOrigin: "50% 100%" }}
        initial={{ opacity: 0, scaleY: 0.94 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
        className="relative -mt-4 md:-mt-6"
      >
        {/* Placeholder art cropped from the approved screenshot; swap for the
            full-resolution Figma export without code changes (same aspect). */}
        <FlowerField
          src="/hero/flowers-placeholder.jpg"
          width={1454}
          height={314}
          className="h-[clamp(200px,21.6vw,420px)] w-full [mask-image:linear-gradient(to_bottom,transparent,#000_22%)]"
        />
      </motion.div>
    </section>
  );
}

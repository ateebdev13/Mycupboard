"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { Fragment, useRef } from "react";
import { useHoverSound } from "@/lib/sound";
import { FlowerField } from "./FlowerField";
import { ArrowUpRight, FlagIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

// Each word animates on its own; weights/slant come from the Figma text styles.
const headline: { text: string; className: string }[] = [
  { text: "Building", className: "font-semibold" },
  { text: "AI", className: "font-light slant" },
  { text: "Products", className: "font-light slant" },
  { text: "that", className: "font-semibold" },
  { text: "Reduce", className: "font-light" },
  { text: "Costs", className: "font-light" },
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

// Figma frame: 1440 × 693 photo directly under the 76px navbar.
const PHOTO = { src: "/hero/flowers.webp", width: 2000, height: 963 };

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Light depth on scroll: the copy drifts up a touch faster than the photo.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const ctaSound = useHoverSound("cta");

  return (
    <section
      ref={ref}
      className="relative isolate h-[max(48.125vw,680px)] max-h-[1000px] overflow-hidden bg-hero"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        className="absolute inset-0 -z-10"
      >
        <FlowerField {...PHOTO} className="size-full" />
      </motion.div>

      <motion.div
        style={{ y: copyY }}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-[1440px] flex-col items-center px-5 pt-14 text-center md:pt-[93px]"
      >
        <motion.p
          variants={fadeUp(0)}
          className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[18px] py-[7px] text-[12px] font-light uppercase leading-[18px] text-body md:text-[14px]"
        >
          <FlagIcon className="size-[18px] text-black" />
          One Team. Idea to Production.
        </motion.p>

        <motion.h1
          variants={words}
          className="mt-8 max-w-[14ch] text-balance text-[36px] leading-[1.25] text-ink sm:max-w-none sm:text-[44px] lg:mt-[35px] lg:text-[52px] lg:leading-[67px]"
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
          className="mt-3 max-w-[34ch] text-[17px] leading-[28px] text-body sm:max-w-none md:mt-4 md:text-[20px] md:leading-[32px]"
        >
          One team for your entire product from first strategy call to the final launch
        </motion.p>

        <motion.div
          variants={fadeUp(0.55)}
          className="mt-8 flex flex-wrap items-center justify-center gap-[13px] md:mt-[51px]"
        >
          <a
            href="#contact"
            onPointerEnter={ctaSound}
            className="rounded-[6px] bg-ink px-5 py-3.5 md:px-6 text-[16px] font-medium leading-[22px] text-white transition-[transform,box-shadow,background-color] duration-300 ease-out-expo hover:-translate-y-px hover:bg-[#16304f] hover:shadow-[0_12px_24px_-12px_rgba(13,33,61,0.6)] active:translate-y-0 active:scale-[0.98]"
          >
            Get in Touch
          </a>
          <a
            href="#case-studies"
            onPointerEnter={ctaSound}
            className="group inline-flex items-center gap-2.5 rounded-[6px] bg-white px-5 py-3.5 md:px-6 text-[16px] font-medium leading-[22px] text-ink outline outline-1 -outline-offset-1 outline-line transition-[transform,box-shadow,outline-color] duration-300 ease-out-expo hover:-translate-y-px hover:outline-[#c9d0da] hover:shadow-[0_12px_24px_-14px_rgba(13,33,61,0.3)] active:translate-y-0 active:scale-[0.98]"
          >
            Explore Our Work
            {/* Arrow exits top-right while a copy slides in from bottom-left. */}
            <span className="relative size-2.5 overflow-hidden">
              <ArrowUpRight className="absolute inset-0 size-2.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-3 group-hover:-translate-y-3" />
              <ArrowUpRight className="absolute inset-0 size-2.5 -translate-x-3 translate-y-3 transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

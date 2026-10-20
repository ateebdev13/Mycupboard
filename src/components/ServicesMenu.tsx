"use client";

import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { serviceGroups, servicesTagline } from "@/lib/nav";
import { useHoverSound } from "@/lib/sound";

const panel: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.035,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
};

const column: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } },
};

type Props = {
  id: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onNavigate: () => void;
};

export function ServicesMenu({ id, onPointerEnter, onPointerLeave, onNavigate }: Props) {
  // Defaults to the first item so the panel never opens "empty"; matches the
  // highlighted Product Strategy row in the approved design.
  const [active, setActive] = useState(serviceGroups[0].items[0].href);
  const tick = useHoverSound("tick");

  return (
    <motion.div
      id={id}
      role="region"
      aria-label="Services"
      variants={panel}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ transformOrigin: "50% 0%" }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="absolute left-1/2 top-full w-[min(1088px,calc(100vw-48px))] -translate-x-1/2 pt-2"
    >
      <div className="overflow-hidden rounded-b-xl rounded-t-md border border-line bg-white shadow-[0_24px_60px_-24px_rgba(13,33,61,0.22),0_2px_6px_rgba(13,33,61,0.04)]">
        <div className="grid grid-cols-3 divide-x divide-line">
          {serviceGroups.map((group) => (
            <motion.div key={group.label} variants={column}>
              <p className="border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                {group.label}
              </p>
              <ul className="py-1">
                {group.items.map((item) => {
                  const isActive = active === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={onNavigate}
                        onFocus={() => setActive(item.href)}
                        onPointerEnter={(e) => {
                          if (!isActive) tick(e);
                          setActive(item.href);
                        }}
                        className="group relative block px-5 py-3 outline-none"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="services-highlight"
                            className="absolute inset-0 bg-hover"
                            transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.7 }}
                          />
                        )}
                        <span className="relative block text-[15px] font-semibold leading-snug text-ink transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                          {item.title}
                        </span>
                        <span className="relative mt-0.5 block text-[12.5px] leading-snug text-muted transition-colors duration-300 group-hover:text-ink-soft">
                          {item.description}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.p
          variants={column}
          className="border-t border-line px-5 py-3.5 text-center text-[13px] text-ink-soft"
        >
          {servicesTagline}
        </motion.p>
      </div>
    </motion.div>
  );
}

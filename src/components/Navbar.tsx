"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { navLinks } from "@/lib/nav";
import { useHoverSound, playSound } from "@/lib/sound";
import { CalendarIcon, PlusIcon } from "./icons";
import { ServicesMenu } from "./ServicesMenu";
import { MobileMenu } from "./MobileMenu";
import { SoundToggle } from "./SoundToggle";

const OPEN_DELAY = 70;
const CLOSE_DELAY = 140;

export function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const tick = useHoverSound("tick");
  const ctaSound = useHoverSound("cta");

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const schedule = useCallback((open: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setServicesOpen((was) => {
          if (open && !was) playSound("open");
          return open;
        });
      },
      open ? OPEN_DELAY : CLOSE_DELAY,
    );
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  // The hover pill follows the pointer; while the menu is open it rests on Services.
  const pillOn = hovered ?? (servicesOpen ? "services" : null);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-white"
      }`}
    >
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-8 xl:px-[50px]"
      >
        <a
          href="/"
          className="text-[22px] font-semibold tracking-[-0.02em] text-ink md:text-[24px]"
          aria-label="MetaLogics home"
        >
          MetaLogics
        </a>

        <ul
          className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
          ref={listRef}
          onPointerLeave={() => setHovered(null)}
        >
          <NavPill listRef={listRef} target={pillOn} />
          <li
            data-pill="services"
            onPointerEnter={() => schedule(true)}
            onPointerLeave={() => schedule(false)}
          >
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-controls={menuId}
              onClick={() => {
                clearTimeout(timer.current);
                setServicesOpen((o) => !o);
              }}
              onPointerEnter={(e) => {
                setHovered("services");
                tick(e);
              }}
              className="relative flex items-center gap-1.5 rounded-md px-[15px] py-2.5 text-[16px] leading-[17.6px] text-body transition-colors duration-200 hover:text-ink aria-expanded:text-ink"
            >
              <motion.span
                className="relative inline-flex"
                animate={{ rotate: servicesOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <PlusIcon className="size-[11px]" />
              </motion.span>
              <span className="relative">Services</span>
            </button>
          </li>
          {navLinks.map((link) => (
            <li key={link.href} data-pill={link.href}>
              <a
                href={link.href}
                onPointerEnter={(e) => {
                  setHovered(link.href);
                  tick(e);
                }}
                className="relative block rounded-md px-[15px] py-2.5 text-[16px] leading-[17.6px] text-body transition-colors duration-200 hover:text-ink"
              >
                <span className="relative">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <a
            href="#book"
            onPointerEnter={ctaSound}
            className="group hidden items-center gap-2.5 rounded-[4px] bg-cta px-6 py-3.5 text-[16px] font-medium leading-[22px] text-ink shadow-[0_1px_0_rgba(13,33,61,0.06)] transition-[transform,box-shadow,background-color] duration-300 ease-out-expo hover:-translate-y-px hover:bg-cta-hover hover:shadow-[0_10px_24px_-10px_rgba(255,150,30,0.7)] active:translate-y-0 active:scale-[0.98] sm:inline-flex"
          >
            <CalendarIcon className="size-[21px] transition-transform duration-300 ease-out-expo group-hover:-rotate-6 group-hover:scale-110" />
            Book a Strategy Call
          </a>
          <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>

        <AnimatePresence>
          {servicesOpen && (
            <ServicesMenu
              id={menuId}
              onPointerEnter={() => schedule(true)}
              onPointerLeave={() => schedule(false)}
              onNavigate={() => setServicesOpen(false)}
            />
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

/** One shared background pill that glides between nav items. */
function NavPill({
  listRef,
  target,
}: {
  listRef: RefObject<HTMLUListElement | null>;
  target: string | null;
}) {
  const [box, setBox] = useState({ x: 0, width: 0 });
  const wasVisible = useRef(false);
  const visible = target !== null;

  useLayoutEffect(() => {
    if (!target || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-pill="${CSS.escape(target)}"]`);
    if (el) setBox({ x: el.offsetLeft, width: el.offsetWidth });
  }, [target, listRef]);

  // Appearing from nothing should fade in place, not slide in from the last item.
  const slide = wasVisible.current && visible;
  useEffect(() => {
    wasVisible.current = visible;
  });

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 rounded-md bg-hover"
      initial={false}
      animate={{ x: box.x, width: box.width, opacity: visible ? 1 : 0, scale: visible ? 1 : 0.94 }}
      transition={{
        x: slide ? { type: "spring", stiffness: 520, damping: 40, mass: 0.6 } : { duration: 0 },
        width: slide ? { type: "spring", stiffness: 520, damping: 40, mass: 0.6 } : { duration: 0 },
        opacity: { duration: 0.18 },
        scale: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
      }}
    />
  );
}

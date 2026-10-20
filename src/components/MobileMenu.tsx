"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { navLinks, serviceGroups } from "@/lib/nav";
import { CalendarIcon, PlusIcon } from "./icons";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function MobileMenu({ open, onOpenChange }: Props) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const close = () => onOpenChange(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => onOpenChange(!open)}
        className="relative z-10 flex size-10 items-center justify-center rounded-md transition-colors hover:bg-hover lg:hidden"
      >
        <span className="relative block h-3 w-[18px]">
          <motion.span
            className="absolute left-0 top-0 h-[1.5px] w-full rounded bg-ink"
            animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-ink"
            animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-white lg:hidden"
          >
            <motion.ul
              className="flex flex-col px-5 pb-32 pt-2 md:px-8"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
              }}
            >
              <MobileItem>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((o) => !o)}
                  className="flex w-full items-center justify-between py-4 text-left text-[22px] font-medium text-ink"
                >
                  Services
                  <motion.span
                    animate={{ rotate: servicesOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <PlusIcon className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-5 sm:grid-cols-3">
                        {serviceGroups.map((g) => (
                          <div key={g.label}>
                            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                              {g.label}
                            </p>
                            <ul className="space-y-3">
                              {g.items.map((item) => (
                                <li key={item.href}>
                                  <a href={item.href} onClick={close} className="block">
                                    <span className="block text-[15px] font-semibold text-ink">
                                      {item.title}
                                    </span>
                                    <span className="block text-[13px] text-muted">
                                      {item.description}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MobileItem>
              {navLinks.map((link) => (
                <MobileItem key={link.href}>
                  <a
                    href={link.href}
                    onClick={close}
                    className="block py-4 text-[22px] font-medium text-ink"
                  >
                    {link.label}
                  </a>
                </MobileItem>
              ))}
            </motion.ul>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.18, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ y: 12, opacity: 0, transition: { duration: 0.15 } }}
              className="fixed inset-x-0 bottom-0 border-t border-line bg-white/90 p-5 backdrop-blur-md md:px-8"
            >
              <a
                href="#book"
                onClick={close}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-cta px-5 py-3.5 text-[15px] font-medium text-ink active:scale-[0.98]"
              >
                <CalendarIcon className="size-4" />
                Book a Strategy Call
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileItem({ children }: { children: ReactNode }) {
  return (
    <motion.li
      className="border-b border-line"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.li>
  );
}

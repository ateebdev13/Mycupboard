"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// "user" honours prefers-reduced-motion: transform/layout animations are
// skipped while opacity fades remain, so nothing pops in abruptly.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PointerEvent } from "react";

/*
 * Opt-in hover sound.
 *
 * - Off by default; the visitor turns it on with the navbar toggle. That click
 *   is the user gesture that creates/resumes the AudioContext, so we never
 *   fight autoplay policies.
 * - Sounds are synthesised with Web Audio (no files to download) and are a few
 *   tens of milliseconds long at very low gain.
 * - A global throttle stops rapid cursor sweeps from turning into a buzz.
 * - Only mouse/pen hovers play; touch never triggers hover sounds.
 */

export type SoundKind = "tick" | "open" | "cta";

const STORAGE_KEY = "ml-sound";
const THROTTLE_MS = 110;

let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lastPlayed = 0;
const listeners = new Set<() => void>();

function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  // A stored "on" is honoured, but the context still waits for the first
  // gesture (see unlockOnGesture) before any audio can play.
  enabled = readStored();
  if (enabled) unlockOnGesture();
}

function ensureContext() {
  if (ctx) return ctx;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);
  return ctx;
}

function unlockOnGesture() {
  const unlock = () => {
    ensureContext()?.resume();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function emit() {
  listeners.forEach((l) => l());
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {}
  if (next) {
    // Called from a click handler, so resuming here is allowed.
    ensureContext()
      ?.resume()
      .then(() => playSound("open", true));
  }
  emit();
}

const voices: Record<SoundKind, { from: number; to: number; gain: number; length: number }> = {
  tick: { from: 1320, to: 990, gain: 0.018, length: 0.05 },
  open: { from: 660, to: 880, gain: 0.022, length: 0.09 },
  cta: { from: 880, to: 1175, gain: 0.024, length: 0.08 },
};

export function playSound(kind: SoundKind, force = false) {
  if (!enabled || !ctx || !master || ctx.state !== "running") return;
  if (document.hidden) return;
  const now = performance.now();
  if (!force && now - lastPlayed < THROTTLE_MS) return;
  lastPlayed = now;

  const v = voices[kind];
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(v.from, t);
  osc.frequency.exponentialRampToValueAtTime(v.to, t + v.length);
  filter.type = "lowpass";
  filter.frequency.value = 2400;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(v.gain, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + v.length);

  osc.connect(filter).connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + v.length + 0.02);
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}

/** onPointerEnter handler that plays a hover sound for mouse/pen only. */
export function useHoverSound(kind: SoundKind = "tick") {
  return useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      playSound(kind);
    },
    [kind],
  );
}

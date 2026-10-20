"use client";

import { setSoundEnabled, useSoundEnabled } from "@/lib/sound";
import { SpeakerIcon } from "./icons";

export function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={on ? "Sound on" : "Sound off"}
      // Hover sound is a pointer-only feature, so the control is hidden on touch layouts.
      className="hidden size-9 items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-hover hover:text-ink [@media(hover:hover)]:lg:flex"
    >
      <SpeakerIcon muted={!on} className="size-4" />
    </button>
  );
}

import { useEffect, useState } from "react";

export const STYLIST_LOADING_PHRASES = [
  "Scanning archive...",
  "Matching colors...",
  "Weighing formality...",
  "Finalizing your look...",
];

export function useRotatingPhrase(active, phrases = STYLIST_LOADING_PHRASES, intervalMs = 1500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % phrases.length), intervalMs);
    return () => clearInterval(interval);
  }, [active]);

  return phrases[index];
}

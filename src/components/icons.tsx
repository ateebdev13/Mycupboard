import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function CalendarIcon(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <rect x="2" y="3" width="12" height="11" rx="2" fill="currentColor" />
      <rect x="4.5" y="1.5" width="1.5" height="3" rx=".75" fill="currentColor" />
      <rect x="10" y="1.5" width="1.5" height="3" rx=".75" fill="currentColor" />
      <rect x="3.5" y="6.5" width="9" height="1" fill="var(--color-cta)" />
    </svg>
  );
}

export function ArrowUpRight(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M5 11L11 5M11 5H6M11 5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlagIcon(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path d="M3.5 14V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 2.5h8.5l-2 3 2 3H4z" fill="currentColor" />
    </svg>
  );
}

export function PlusIcon(props: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden {...props}>
      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerIcon({ muted, ...props }: P & { muted: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" />
      {muted ? (
        <path
          d="M10.5 6l3 4M13.5 6l-3 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M10.4 5.6a3.2 3.2 0 010 4.8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M12.2 3.9a5.6 5.6 0 010 8.2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

"use client";

import { useI18n } from "@/contexts/I18nContext";

type Props = {
  className?: string;
};

/** Gold oval + horizontal eye-line overlay for live camera / preview. */
export function FramingGuide({ className = "" }: Props) {
  const { dict } = useI18n();

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="oval-mask">
            <rect width="100" height="100" fill="white" />
            <ellipse cx="50" cy="46" rx="28" ry="36" fill="black" />
          </mask>
        </defs>
        <rect
          width="100"
          height="100"
          fill="rgba(0,0,0,0.45)"
          mask="url(#oval-mask)"
        />
        <ellipse
          cx="50"
          cy="46"
          rx="28"
          ry="36"
          fill="none"
          stroke="#FFD700"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="28"
          y1="40"
          x2="72"
          y2="40"
          stroke="#FFD700"
          strokeWidth="0.45"
          strokeDasharray="2 1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="absolute bottom-3 left-0 right-0 px-4 text-center text-xs text-[var(--gold)]">
        {dict.framingHint}
      </p>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useI18n } from "@/contexts/I18nContext";

type Props = {
  beforeUrl: string;
  afterUrl: string;
};

export function CompareSlider({ beforeUrl, afterUrl }: Props) {
  const { dict } = useI18n();
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  useEffect(() => {
    setPos(50);
  }, [beforeUrl, afterUrl]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={trackRef}
        className="relative aspect-[3/4] w-full touch-none overflow-hidden rounded-sm bg-black select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-labelledby={labelId}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={dict.before}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt={dict.after}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-y-0 w-0.5 bg-[var(--gold)]"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--bg)] text-[var(--gold)]">
            ↔
          </div>
        </div>
        <span className="absolute left-2 top-2 rounded bg-black/55 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
          {dict.before}
        </span>
        <span className="absolute right-2 top-2 rounded bg-black/55 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
          {dict.after}
        </span>
      </div>
      <p id={labelId} className="sr-only">
        {dict.compareHint}
      </p>
    </div>
  );
}

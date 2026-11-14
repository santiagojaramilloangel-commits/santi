"use client";

import { useMemo, useRef } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { CompareSlider } from "@/components/CompareSlider";
import { ShareBookBar } from "@/components/ShareBookBar";
import { SaveLookModal } from "@/components/SaveLookModal";
import { getCutById, type CutId } from "@/lib/cuts";
import { orderedCutsForFaceShape } from "@/lib/faceShapes";

export function CompareStep() {
  const { locale, dict } = useI18n();
  const {
    sourceUrl,
    faceShape,
    generations,
    activeCutId,
    setActiveCutId,
    favoriteCutId,
    setFavoriteCutId,
    setStep,
  } = useSession();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const readyCuts = useMemo(() => {
    if (!faceShape) return [] as CutId[];
    return orderedCutsForFaceShape(faceShape)
      .map((f) => f.cutId)
      .filter((id) => generations[id]?.status === "ready" && generations[id].url);
  }, [faceShape, generations]);

  const currentId =
    activeCutId && generations[activeCutId]?.status === "ready"
      ? activeCutId
      : readyCuts[0] ?? null;

  if (!sourceUrl || !currentId || !generations[currentId]?.url) {
    return (
      <section className="flex flex-col gap-4 pb-28">
        <p className="text-sm text-[var(--fg-muted)]">{dict.selectCutFirst}</p>
        <button type="button" className="btn-secondary" onClick={() => setStep("cuts")}>
          {dict.back}
        </button>
      </section>
    );
  }

  const cut = getCutById(currentId);
  const cutName = locale === "es" ? cut.nameEs : cut.nameEn;

  return (
    <section className="flex flex-col gap-4 pb-36">
      <header>
        <h2 className="font-display text-2xl tracking-tight">{dict.compareTitle}</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{dict.compareHint}</p>
        <p className="mt-2 font-medium text-[var(--gold)]">{cutName}</p>
      </header>

      <CompareSlider beforeUrl={sourceUrl} afterUrl={generations[currentId].url!} />

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--fg-muted)]">
          {dict.swipeCuts}
        </p>
        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {readyCuts.map((id) => {
            const c = getCutById(id);
            const label = locale === "es" ? c.nameEs : c.nameEn;
            const selected = id === currentId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCutId(id)}
                className={`snap-start shrink-0 overflow-hidden border ${
                  selected ? "border-[var(--gold)]" : "border-[var(--border)]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generations[id].url}
                  alt={label}
                  className="h-20 w-16 object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={`w-full rounded-sm border px-3 py-3 text-sm font-semibold ${
          favoriteCutId === currentId
            ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]"
            : "border-[var(--border)]"
        }`}
        onClick={() => setFavoriteCutId(currentId)}
      >
        {favoriteCutId === currentId ? dict.favorite : dict.pickFavorite}
      </button>

      <ShareBookBar />
      <SaveLookModal />

      <button type="button" className="btn-secondary" onClick={() => setStep("cuts")}>
        {dict.back}
      </button>
    </section>
  );
}

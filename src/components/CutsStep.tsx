"use client";

import { useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { CutCard } from "@/components/CutCard";
import { orderedCutsForFaceShape } from "@/lib/faceShapes";

export function CutsStep() {
  const { dict } = useI18n();
  const {
    faceShape,
    generations,
    generateCut,
    activeCutId,
    setActiveCutId,
    favoriteCutId,
    setFavoriteCutId,
    setStep,
  } = useSession();

  const ordered = useMemo(() => {
    if (!faceShape) return [];
    return orderedCutsForFaceShape(faceShape);
  }, [faceShape]);

  if (!faceShape) {
    return (
      <section className="pb-28">
        <button type="button" className="btn-secondary" onClick={() => setStep("face")}>
          {dict.back}
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 pb-36">
      <header>
        <h2 className="font-display text-2xl tracking-tight">{dict.cutsTitle}</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{dict.cutsHint}</p>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ordered.map((fit) => (
          <CutCard
            key={fit.cutId}
            cutId={fit.cutId}
            fit={fit}
            state={generations[fit.cutId]}
            selected={activeCutId === fit.cutId}
            favorite={favoriteCutId === fit.cutId}
            onSelect={() => {
              setActiveCutId(fit.cutId);
              setStep("compare");
            }}
            onGenerate={() => void generateCut(fit.cutId)}
            onFavorite={() => {
              setFavoriteCutId(fit.cutId);
              setActiveCutId(fit.cutId);
            }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => setStep("face")}
        >
          {dict.back}
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={
            !activeCutId || generations[activeCutId]?.status !== "ready"
          }
          onClick={() => setStep("compare")}
        >
          {dict.compareTitle}
        </button>
      </div>
    </section>
  );
}

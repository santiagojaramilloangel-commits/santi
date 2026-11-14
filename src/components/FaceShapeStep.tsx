"use client";

import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { FACE_SHAPES, type FaceShapeId } from "@/lib/faceShapes";

const LABEL_KEY: Record<FaceShapeId, "faceLong" | "faceRound" | "faceSquare" | "faceOval"> = {
  long: "faceLong",
  round: "faceRound",
  square: "faceSquare",
  oval: "faceOval",
};

export function FaceShapeStep() {
  const { dict } = useI18n();
  const { faceShape, setFaceShape, setStep, sourceUrl } = useSession();

  return (
    <section className="flex flex-col gap-4 pb-28">
      <header>
        <h2 className="font-display text-2xl tracking-tight">{dict.faceShapeTitle}</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{dict.faceShapeHint}</p>
      </header>

      {sourceUrl ? (
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-[var(--gold)]/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sourceUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {FACE_SHAPES.map((shape) => {
          const selected = faceShape === shape.id;
          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => setFaceShape(shape.id)}
              className={`min-h-20 rounded-sm border px-3 py-4 text-left transition ${
                selected
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)]"
              }`}
              aria-pressed={selected}
            >
              <span className="font-display text-lg">{dict[LABEL_KEY[shape.id]]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => setStep("capture")}
        >
          {dict.back}
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!faceShape}
          onClick={() => setStep("cuts")}
        >
          {dict.next}
        </button>
      </div>
    </section>
  );
}

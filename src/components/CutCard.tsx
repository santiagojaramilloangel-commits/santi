"use client";

import { useI18n } from "@/contexts/I18nContext";
import type { GenerationState } from "@/contexts/SessionContext";
import { formatPrice, getCutById, getCutPrice, type CutId } from "@/lib/cuts";
import type { CutFaceFit } from "@/lib/faceShapes";

type Props = {
  cutId: CutId;
  fit: CutFaceFit;
  state: GenerationState;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onGenerate: () => void;
  onFavorite: () => void;
};

export function CutCard({
  cutId,
  fit,
  state,
  selected,
  favorite,
  onSelect,
  onGenerate,
  onFavorite,
}: Props) {
  const { locale, dict } = useI18n();
  const cut = getCutById(cutId);
  const name = locale === "es" ? cut.nameEs : cut.nameEn;
  const description = locale === "es" ? cut.descriptionEs : cut.descriptionEn;
  const maintenance = locale === "es" ? cut.maintenanceEs : cut.maintenanceEn;
  const reason = locale === "es" ? fit.reasonEs : fit.reasonEn;
  const price = formatPrice(getCutPrice(cutId), locale);

  const statusLabel =
    state.status === "loading"
      ? dict.generating
      : state.status === "ready"
        ? dict.ready
        : state.status === "error"
          ? dict.failed
          : dict.pending;

  const errorMessage =
    state.errorCode === "timeout"
      ? dict.errorTimeout
      : state.errorCode === "rate_limit"
        ? dict.errorRateLimit
        : state.errorCode === "network"
          ? dict.errorNetwork
          : dict.errorGeneric;

  return (
    <article
      className={`snap-center shrink-0 w-[min(86vw,22rem)] border p-3 transition ${
        selected
          ? "border-[var(--gold)] bg-[var(--bg-elevated)]"
          : "border-[var(--border)] bg-[var(--bg)]"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg leading-tight text-[var(--fg)]">
            {name}
          </h3>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">{description}</p>
        </div>
        <span
          className="shrink-0 rounded-sm border border-[var(--gold)] px-2 py-1 text-xs font-bold tracking-wide text-[var(--gold)]"
          title={`${dict.tierLabel} ${fit.tier}`}
        >
          {fit.tier}
        </span>
      </div>

      <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-black">
        {state.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={state.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--fg-muted)]">
            {statusLabel}
          </div>
        )}
        {state.status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent"
              aria-label={dict.generating}
            />
          </div>
        ) : null}
      </div>

      <dl className="space-y-1 text-xs text-[var(--fg-muted)]">
        <div className="flex justify-between gap-2">
          <dt>{dict.maintenance}</dt>
          <dd className="text-right text-[var(--fg)]">{maintenance}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>{dict.faceFit}</dt>
          <dd className="max-w-[65%] text-right text-[var(--fg)]">{reason}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>{dict.priceLabel}</dt>
          <dd className="font-semibold text-[var(--gold)]">{price}</dd>
        </div>
      </dl>

      {state.status === "error" ? (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {state.status !== "ready" ? (
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={onGenerate}
            disabled={state.status === "loading"}
          >
            {state.status === "error" ? dict.retry : dict.generate}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onSelect}
            >
              {dict.compareTitle}
            </button>
            <button
              type="button"
              className={`flex-1 rounded-sm border px-3 py-3 text-sm font-semibold ${
                favorite
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]"
                  : "border-[var(--border)] text-[var(--fg)]"
              }`}
              onClick={onFavorite}
            >
              {favorite ? dict.favorite : dict.pickFavorite}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

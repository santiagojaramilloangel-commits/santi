"use client";

import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { brand } from "@/lib/brand";
import { getCutById } from "@/lib/cuts";
import { downloadBlob, stampResultImage } from "@/lib/image";
import { buildShareText, openBooking, shareImageFile } from "@/lib/share";

export function ShareBookBar() {
  const { locale, dict } = useI18n();
  const { favoriteCutId, activeCutId, generations } = useSession();
  const cutId = favoriteCutId ?? activeCutId;
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!cutId || generations[cutId]?.status !== "ready" || !generations[cutId].blob) {
    return null;
  }

  const cut = getCutById(cutId);
  const cutName = locale === "es" ? cut.nameEs : cut.nameEn;
  const resultBlob = generations[cutId].blob!;

  const prepareStamped = async () => {
    return stampResultImage(resultBlob, {
      logoUrl: brand.logoPath,
      cutName,
      shopName: brand.shopName,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const stamped = await prepareStamped();
              downloadBlob(
                stamped,
                `${brand.shopName.replace(/\s+/g, "-").toLowerCase()}-${cut.id}.jpg`,
              );
              setHint(dict.downloadSuccess);
            } catch {
              setHint(dict.errorGeneric);
            } finally {
              setBusy(false);
            }
          }}
        >
          {dict.download}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const stamped = await prepareStamped();
              const text = buildShareText(dict, cut, locale);
              const result = await shareImageFile(
                stamped,
                `${cut.id}.jpg`,
                text,
              );
              if (result === "fallback") {
                setHint(dict.shareFallbackHint);
              }
            } catch {
              setHint(dict.shareUnsupported);
            } finally {
              setBusy(false);
            }
          }}
        >
          {dict.share}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openBooking(cut, locale)}
        >
          {dict.bookThisCut}
        </button>
      </div>
      {hint ? (
        <p className="text-xs text-[var(--fg-muted)]" role="status">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

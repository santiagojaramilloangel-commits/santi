"use client";

import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { getLooksRepository } from "@/lib/db/looksRepository";

export function SaveLookModal() {
  const { dict } = useI18n();
  const {
    sourceBlob,
    faceShape,
    favoriteCutId,
    activeCutId,
    generations,
  } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const cutId = favoriteCutId ?? activeCutId;

  const canOpen = Boolean(sourceBlob && faceShape && cutId);

  const save = async () => {
    setError(null);
    setSuccess(false);
    if (!consent) {
      setError(dict.consentRequired);
      return;
    }
    if (!sourceBlob || !faceShape || !cutId) {
      setError(dict.selectPhotoFirst);
      return;
    }
    if (!name.trim()) {
      setError(dict.clientName);
      return;
    }
    setBusy(true);
    try {
      const repo = getLooksRepository();
      await repo.saveLook({
        clientName: name.trim(),
        cutId,
        faceShape,
        notes: notes.trim(),
        photo: sourceBlob,
        resultPhoto: generations[cutId]?.blob,
        consent: true,
      });
      setSuccess(true);
      setName("");
      setNotes("");
      setConsent(false);
    } catch {
      setError(dict.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn-secondary w-full"
        disabled={!canOpen}
        onClick={() => {
          setOpen(true);
          setSuccess(false);
          setError(null);
        }}
      >
        {dict.saveLook}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={dict.saveLook}
        >
          <div className="w-full max-w-md rounded-sm border border-[var(--border)] bg-[var(--bg)] p-4 shadow-xl">
            <h3 className="font-display text-xl text-[var(--fg)]">{dict.saveLook}</h3>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">{dict.barberHint}</p>

            <label className="mt-4 block text-sm">
              <span className="text-[var(--fg-muted)]">{dict.clientName}</span>
              <input
                className="field mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.clientNamePlaceholder}
                autoComplete="name"
              />
            </label>

            <label className="mt-3 block text-sm">
              <span className="text-[var(--fg-muted)]">{dict.barberNotes}</span>
              <textarea
                className="field mt-1 min-h-20"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={dict.barberNotesPlaceholder}
              />
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm text-[var(--fg)]">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-[var(--gold)]"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{dict.consentLabel}</span>
            </label>

            {error ? (
              <p className="mt-2 text-sm text-red-300" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="mt-2 text-sm text-[var(--gold)]" role="status">
                {dict.saveSuccess}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setOpen(false)}
              >
                {dict.cancel}
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={busy}
                onClick={() => void save()}
              >
                {dict.saveLook}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

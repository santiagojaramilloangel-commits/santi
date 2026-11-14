"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { getCutById } from "@/lib/cuts";
import { getFaceShape } from "@/lib/faceShapes";
import {
  getLooksRepository,
  type ClientSummary,
  type SavedLook,
} from "@/lib/db/looksRepository";

export function BarberMode() {
  const { locale, dict } = useI18n();
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [preview, setPreview] = useState<{
    look: SavedLook;
    photoUrl: string;
    resultUrl?: string;
  } | null>(null);

  const refreshClients = useCallback(async () => {
    const repo = getLooksRepository();
    setClients(await repo.listClients(query));
  }, [query]);

  useEffect(() => {
    void refreshClients();
  }, [refreshClients]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview.photoUrl);
        if (preview.resultUrl) URL.revokeObjectURL(preview.resultUrl);
      }
    };
  }, [preview]);

  const openClient = async (name: string) => {
    setSelectedClient(name);
    const repo = getLooksRepository();
    setLooks(await repo.listLooksForClient(name));
  };

  const openLook = (look: SavedLook) => {
    if (preview) {
      URL.revokeObjectURL(preview.photoUrl);
      if (preview.resultUrl) URL.revokeObjectURL(preview.resultUrl);
    }
    setPreview({
      look,
      photoUrl: URL.createObjectURL(look.photo),
      resultUrl: look.resultPhoto
        ? URL.createObjectURL(look.resultPhoto)
        : undefined,
    });
  };

  const deleteLook = async (id: number | undefined) => {
    if (id === undefined) return;
    if (!window.confirm(dict.confirmDeleteLook)) return;
    const repo = getLooksRepository();
    await repo.deleteLook(id);
    if (selectedClient) await openClient(selectedClient);
    await refreshClients();
    setPreview(null);
  };

  const deleteClient = async (name: string) => {
    if (!window.confirm(dict.confirmDeleteClient)) return;
    const repo = getLooksRepository();
    await repo.deleteClient(name);
    setSelectedClient(null);
    setLooks([]);
    setPreview(null);
    await refreshClients();
  };

  return (
    <section className="flex flex-col gap-4 pb-28">
      <header>
        <h1 className="font-display text-2xl tracking-tight">{dict.barberTitle}</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{dict.barberHint}</p>
      </header>

      <label className="block text-sm">
        <span className="text-[var(--fg-muted)]">{dict.searchClients}</span>
        <input
          className="field mt-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.searchPlaceholder}
        />
      </label>

      {!selectedClient ? (
        <ul className="divide-y divide-[var(--border)] border border-[var(--border)]">
          {clients.length === 0 ? (
            <li className="p-4 text-sm text-[var(--fg-muted)]">{dict.noClients}</li>
          ) : (
            clients.map((c) => (
              <li key={c.clientName}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--bg-elevated)]"
                  onClick={() => void openClient(c.clientName)}
                >
                  <span>
                    <span className="block font-medium">{c.clientName}</span>
                    <span className="text-xs text-[var(--fg-muted)]">
                      {c.lookCount} · {dict.savedAt}{" "}
                      {new Date(c.lastSavedAt).toLocaleDateString(
                        locale === "es" ? "es" : "en",
                      )}
                    </span>
                  </span>
                  <span className="text-[var(--gold)]">→</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="text-sm text-[var(--fg-muted)] underline-offset-2 hover:underline"
              onClick={() => {
                setSelectedClient(null);
                setLooks([]);
                setPreview(null);
              }}
            >
              {dict.back}
            </button>
            <button
              type="button"
              className="text-sm text-red-300"
              onClick={() => void deleteClient(selectedClient)}
            >
              {dict.deleteClient}
            </button>
          </div>
          <h2 className="font-display text-xl">{selectedClient}</h2>
          {looks.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">{dict.noLooks}</p>
          ) : (
            <ul className="space-y-2">
              {looks.map((look) => {
                const cut = getCutById(look.cutId);
                const shape = getFaceShape(look.faceShape);
                return (
                  <li
                    key={look.id}
                    className="flex items-center justify-between gap-3 border border-[var(--border)] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {locale === "es" ? cut.nameEs : cut.nameEn}
                      </p>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {locale === "es" ? shape.labelEs : shape.labelEn} ·{" "}
                        {new Date(look.createdAt).toLocaleString(
                          locale === "es" ? "es" : "en",
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="btn-secondary !px-3 !py-2 text-xs"
                        onClick={() => openLook(look)}
                      >
                        {dict.openLook}
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-300"
                        onClick={() => void deleteLook(look.id)}
                      >
                        {dict.deleteLook}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {preview ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-sm border border-[var(--border)] bg-[var(--bg)] p-4">
            <div className="grid grid-cols-2 gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.photoUrl}
                alt=""
                className="aspect-[3/4] w-full object-cover"
              />
              {preview.resultUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.resultUrl}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center border border-[var(--border)] text-xs text-[var(--fg-muted)]">
                  —
                </div>
              )}
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--fg-muted)]">{dict.cut}</dt>
                <dd>
                  {locale === "es"
                    ? getCutById(preview.look.cutId).nameEs
                    : getCutById(preview.look.cutId).nameEn}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--fg-muted)]">{dict.faceShape}</dt>
                <dd>
                  {locale === "es"
                    ? getFaceShape(preview.look.faceShape).labelEs
                    : getFaceShape(preview.look.faceShape).labelEn}
                </dd>
              </div>
              {preview.look.notes ? (
                <div>
                  <dt className="text-[var(--fg-muted)]">{dict.barberNotes}</dt>
                  <dd className="mt-1 whitespace-pre-wrap">{preview.look.notes}</dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              className="btn-secondary mt-4 w-full"
              onClick={() => {
                URL.revokeObjectURL(preview.photoUrl);
                if (preview.resultUrl) URL.revokeObjectURL(preview.resultUrl);
                setPreview(null);
              }}
            >
              {dict.cancel}
            </button>
          </div>
        </div>
      ) : null}

      <Link href="/" className="btn-secondary text-center">
        {dict.backToTryOn}
      </Link>
    </section>
  );
}

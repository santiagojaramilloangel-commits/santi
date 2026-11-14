"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";
import { CameraCapture } from "@/components/CameraCapture";
import { FramingGuide } from "@/components/FramingGuide";
import { preprocessPhoto } from "@/lib/image";

type Mode = "idle" | "camera" | "preview";

export function CaptureStep() {
  const { dict } = useI18n();
  const { sourceUrl, setSourcePhoto, setStep } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>(sourceUrl ? "preview" : "idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(sourceUrl);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptBlob = async (blob: Blob) => {
    setBusy(true);
    setError(null);
    try {
      const processed = await preprocessPhoto(blob);
      const url = URL.createObjectURL(processed);
      setPreviewUrl((prev) => {
        if (prev && prev !== sourceUrl) URL.revokeObjectURL(prev);
        return url;
      });
      setPendingBlob(processed);
      setMode("preview");
    } catch {
      setError(dict.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    await acceptBlob(file);
  };

  const confirm = () => {
    if (!pendingBlob && sourceUrl) {
      setStep("face");
      return;
    }
    if (!pendingBlob) return;
    setSourcePhoto(pendingBlob);
    setStep("face");
  };

  return (
    <section className="flex flex-col gap-4 pb-28">
      <header>
        <h2 className="font-display text-2xl tracking-tight text-[var(--fg)]">
          {dict.captureTitle}
        </h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">{dict.captureHint}</p>
      </header>

      {mode === "camera" ? (
        <CameraCapture
          onCapture={(blob) => {
            void acceptBlob(blob);
          }}
          onCancel={() => setMode(previewUrl ? "preview" : "idle")}
        />
      ) : null}

      {mode === "preview" && previewUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <FramingGuide />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => {
                setMode("idle");
                setPendingBlob(null);
                setPreviewUrl(null);
              }}
            >
              {dict.retake}
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              onClick={confirm}
              disabled={busy}
            >
              {dict.useThisPhoto}
            </button>
          </div>
        </div>
      ) : null}

      {mode === "idle" ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-dashed border-[var(--border)] bg-[var(--bg-elevated)]">
            <FramingGuide />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--fg-muted)]">
              {dict.useSample}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-label={dict.sample1}
                disabled={busy}
                className="overflow-hidden rounded-sm border border-[var(--border)] text-left disabled:opacity-50"
                onClick={() => {
                  void (async () => {
                    try {
                      const res = await fetch("/samples/sample-1.jpg");
                      if (!res.ok) throw new Error("sample");
                      await acceptBlob(await res.blob());
                    } catch {
                      setError(dict.errorGeneric);
                    }
                  })();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/sample-1.jpg"
                  alt=""
                  className="pointer-events-none aspect-[3/4] w-full object-cover"
                />
                <span className="block px-2 py-2 text-xs text-[var(--fg-muted)]">
                  {dict.sample1}
                </span>
              </button>
              <button
                type="button"
                aria-label={dict.sample2}
                disabled={busy}
                className="overflow-hidden rounded-sm border border-[var(--border)] text-left disabled:opacity-50"
                onClick={() => {
                  void (async () => {
                    try {
                      const res = await fetch("/samples/sample-2.jpg");
                      if (!res.ok) throw new Error("sample");
                      await acceptBlob(await res.blob());
                    } catch {
                      setError(dict.errorGeneric);
                    }
                  })();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/sample-2.jpg"
                  alt=""
                  className="pointer-events-none aspect-[3/4] w-full object-cover"
                />
                <span className="block px-2 py-2 text-xs text-[var(--fg-muted)]">
                  {dict.sample2}
                </span>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {dict.uploadPhoto}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setMode("camera")}
            disabled={busy}
          >
            {dict.useCamera}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

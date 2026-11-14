"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { FramingGuide } from "@/components/FramingGuide";

type Props = {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
};

export function CameraCapture({ onCapture, onCancel }: Props) {
  const { dict } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(dict.cameraUnavailable);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "user" },
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          setReady(true);
        }
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setError(dict.cameraPermissionDenied);
        } else {
          setError(dict.cameraUnavailable);
        }
      }
    }

    void start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [dict.cameraPermissionDenied, dict.cameraUnavailable, stop]);

  const snap = () => {
    const video = videoRef.current;
    if (!video || !ready) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1024;
    canvas.height = video.videoHeight || 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror front camera for natural selfie framing in the saved frame
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          stop();
          onCapture(blob);
        }
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full scale-x-[-1] object-cover"
        />
        <FramingGuide />
      </div>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            stop();
            onCancel();
          }}
          className="btn-secondary flex-1"
        >
          {dict.cancel}
        </button>
        <button
          type="button"
          onClick={snap}
          disabled={!ready || Boolean(error)}
          className="btn-primary flex-1"
        >
          {dict.confirm}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          stop();
          onCancel();
        }}
        className="text-sm text-[var(--fg-muted)] underline-offset-2 hover:underline"
      >
        {dict.stopCamera}
      </button>
    </div>
  );
}

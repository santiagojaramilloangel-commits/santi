"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CutId } from "@/lib/cuts";
import { CUTS, getCutById } from "@/lib/cuts";
import type { FaceShapeId } from "@/lib/faceShapes";
import { renderDemoPlaceholder } from "@/lib/image";
import { useI18n } from "@/contexts/I18nContext";

export type GenerationStatus = "idle" | "loading" | "ready" | "error";

export type GenerationState = {
  status: GenerationStatus;
  blob?: Blob;
  url?: string;
  errorCode?: "timeout" | "rate_limit" | "network" | "generic";
};

type SessionContextValue = {
  demoMode: boolean;
  sourceBlob: Blob | null;
  sourceUrl: string | null;
  setSourcePhoto: (blob: Blob) => void;
  clearSource: () => void;
  faceShape: FaceShapeId | null;
  setFaceShape: (shape: FaceShapeId) => void;
  generations: Record<CutId, GenerationState>;
  generateCut: (cutId: CutId) => Promise<void>;
  activeCutId: CutId | null;
  setActiveCutId: (id: CutId | null) => void;
  favoriteCutId: CutId | null;
  setFavoriteCutId: (id: CutId | null) => void;
  step: "capture" | "face" | "cuts" | "compare";
  setStep: (step: SessionContextValue["step"]) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function emptyGenerations(): Record<CutId, GenerationState> {
  return {
    "skin-fade": { status: "idle" },
    "buzz-cut": { status: "idle" },
    "textured-crop": { status: "idle" },
    curtains: { status: "idle" },
    "curly-shag": { status: "idle" },
  };
}

function revokeUrl(url?: string) {
  if (url) URL.revokeObjectURL(url);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const { locale, dict } = useI18n();
  const [demoMode, setDemoMode] = useState(true);
  const [sourceBlob, setSourceBlob] = useState<Blob | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShapeId | null>(null);
  const [generations, setGenerations] =
    useState<Record<CutId, GenerationState>>(emptyGenerations);
  const [activeCutId, setActiveCutId] = useState<CutId | null>(null);
  const [favoriteCutId, setFavoriteCutId] = useState<CutId | null>(null);
  const [step, setStep] =
    useState<SessionContextValue["step"]>("capture");
  const generationsRef = useRef(generations);
  generationsRef.current = generations;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/edit-hair")
      .then((r) => r.json())
      .then((data: { demo?: boolean }) => {
        if (!cancelled) setDemoMode(Boolean(data.demo));
      })
      .catch(() => {
        if (!cancelled) setDemoMode(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      for (const g of Object.values(generationsRef.current)) {
        revokeUrl(g.url);
      }
    };
  }, [sourceUrl]);

  const clearGenerations = useCallback(() => {
    setGenerations((prev) => {
      for (const g of Object.values(prev)) revokeUrl(g.url);
      return emptyGenerations();
    });
    setActiveCutId(null);
    setFavoriteCutId(null);
  }, []);

  const setSourcePhoto = useCallback(
    (blob: Blob) => {
      setSourceUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setSourceBlob(blob);
      clearGenerations();
    },
    [clearGenerations],
  );

  const clearSource = useCallback(() => {
    setSourceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSourceBlob(null);
    clearGenerations();
    setFaceShape(null);
    setStep("capture");
  }, [clearGenerations]);

  const generateCut = useCallback(
    async (cutId: CutId) => {
      if (!sourceBlob) return;

      const existing = generationsRef.current[cutId];
      if (existing.status === "ready" && existing.blob) return;
      if (existing.status === "loading") return;

      setGenerations((prev) => {
        revokeUrl(prev[cutId]?.url);
        return {
          ...prev,
          [cutId]: { status: "loading" },
        };
      });

      try {
        let resultBlob: Blob;

        if (demoMode) {
          const cut = getCutById(cutId);
          const name = locale === "es" ? cut.nameEs : cut.nameEn;
          resultBlob = await renderDemoPlaceholder(
            sourceBlob,
            name,
            dict.demoWatermark,
          );
        } else {
          const form = new FormData();
          form.append("cutId", cutId);
          form.append("image", sourceBlob, "photo.jpg");
          const res = await fetch("/api/edit-hair", {
            method: "POST",
            body: form,
          });

          if (res.status === 200) {
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              const data = (await res.json()) as { demo?: boolean };
              if (data.demo) {
                setDemoMode(true);
                const cut = getCutById(cutId);
                const name = locale === "es" ? cut.nameEs : cut.nameEn;
                resultBlob = await renderDemoPlaceholder(
                  sourceBlob,
                  name,
                  dict.demoWatermark,
                );
              } else {
                throw Object.assign(new Error("unexpected_json"), {
                  code: "generic" as const,
                });
              }
            } else {
              resultBlob = await res.blob();
            }
          } else {
            let code: GenerationState["errorCode"] = "generic";
            if (res.status === 429) code = "rate_limit";
            else if (res.status === 504) code = "timeout";
            else if (res.status === 0) code = "network";
            throw Object.assign(new Error("generate_failed"), { code });
          }
        }

        const url = URL.createObjectURL(resultBlob);
        setGenerations((prev) => {
          revokeUrl(prev[cutId]?.url);
          return {
            ...prev,
            [cutId]: { status: "ready", blob: resultBlob, url },
          };
        });
        setActiveCutId(cutId);
      } catch (err) {
        const code =
          err && typeof err === "object" && "code" in err
            ? (err as { code: GenerationState["errorCode"] }).code
            : "generic";
        setGenerations((prev) => ({
          ...prev,
          [cutId]: { status: "error", errorCode: code ?? "generic" },
        }));
      }
    },
    [sourceBlob, demoMode, locale, dict.demoWatermark],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      demoMode,
      sourceBlob,
      sourceUrl,
      setSourcePhoto,
      clearSource,
      faceShape,
      setFaceShape,
      generations,
      generateCut,
      activeCutId,
      setActiveCutId,
      favoriteCutId,
      setFavoriteCutId,
      step,
      setStep,
    }),
    [
      demoMode,
      sourceBlob,
      sourceUrl,
      setSourcePhoto,
      clearSource,
      faceShape,
      generations,
      generateCut,
      activeCutId,
      favoriteCutId,
      step,
    ],
  );

  // Ensure CUTS stays referenced for tree-shaking clarity in generate paths
  void CUTS;

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}

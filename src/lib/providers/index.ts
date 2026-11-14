import { DemoImageEditProvider } from "./demo";
import { FalImageEditProvider } from "./fal";
import { GeminiImageEditProvider } from "./gemini";
import { ReplicateImageEditProvider } from "./replicate";
import type { ImageEditProvider, ProviderId } from "./types";

export type { HairEditInput, ImageEditProvider, ProviderId } from "./types";
export { ProviderError } from "./types";

function readProviderId(): ProviderId {
  const raw = (process.env.IMAGE_PROVIDER || "").toLowerCase().trim();
  if (raw === "fal" || raw === "replicate" || raw === "gemini" || raw === "demo") {
    return raw;
  }
  return "demo";
}

function hasKeyFor(provider: ProviderId): boolean {
  switch (provider) {
    case "fal":
      return Boolean(process.env.FAL_KEY?.trim());
    case "replicate":
      return Boolean(process.env.REPLICATE_API_TOKEN?.trim());
    case "gemini":
      return Boolean(process.env.GEMINI_API_KEY?.trim());
    case "demo":
      return false;
  }
}

/** True when no usable provider key is configured — client should use demo placeholders. */
export function isDemoMode(): boolean {
  const id = readProviderId();
  if (id === "demo") return true;
  return !hasKeyFor(id);
}

export function createImageEditProvider(): ImageEditProvider {
  const id = readProviderId();

  if (id === "fal" && process.env.FAL_KEY?.trim()) {
    return new FalImageEditProvider(process.env.FAL_KEY.trim());
  }
  if (id === "replicate" && process.env.REPLICATE_API_TOKEN?.trim()) {
    return new ReplicateImageEditProvider(
      process.env.REPLICATE_API_TOKEN.trim(),
    );
  }
  if (id === "gemini" && process.env.GEMINI_API_KEY?.trim()) {
    return new GeminiImageEditProvider(process.env.GEMINI_API_KEY.trim());
  }

  // Auto-pick first available key if IMAGE_PROVIDER unset/mismatched
  if (process.env.FAL_KEY?.trim()) {
    return new FalImageEditProvider(process.env.FAL_KEY.trim());
  }
  if (process.env.REPLICATE_API_TOKEN?.trim()) {
    return new ReplicateImageEditProvider(
      process.env.REPLICATE_API_TOKEN.trim(),
    );
  }
  if (process.env.GEMINI_API_KEY?.trim()) {
    return new GeminiImageEditProvider(process.env.GEMINI_API_KEY.trim());
  }

  return new DemoImageEditProvider();
}

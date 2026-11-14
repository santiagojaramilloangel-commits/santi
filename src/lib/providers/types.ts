export type HairEditInput = {
  /** JPEG/PNG bytes of the preprocessed client photo. */
  image: Blob;
  /** Full identity-preserving hair-edit prompt. */
  cutPrompt: string;
  cutId: string;
};

export interface ImageEditProvider {
  readonly id: string;
  editHair(input: HairEditInput): Promise<Blob>;
}

export type ProviderId = "fal" | "replicate" | "gemini" | "demo";

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code: "timeout" | "rate_limit" | "upstream" | "config",
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

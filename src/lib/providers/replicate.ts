import type { HairEditInput, ImageEditProvider } from "./types";
import { ProviderError } from "./types";

const DEFAULT_MODEL =
  "black-forest-labs/flux-kontext-pro";

async function blobToDataUri(blob: Blob): Promise<string> {
  const buf = Buffer.from(await blob.arrayBuffer());
  const mime = blob.type || "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export class ReplicateImageEditProvider implements ImageEditProvider {
  readonly id = "replicate";

  constructor(
    private readonly apiToken: string,
    private readonly model = process.env.REPLICATE_MODEL || DEFAULT_MODEL,
  ) {}

  async editHair(input: HairEditInput): Promise<Blob> {
    const image = await blobToDataUri(input.image);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000);

    try {
      const createRes = await fetch(
        `https://api.replicate.com/v1/models/${this.model}/predictions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
            Prefer: "wait=60",
          },
          body: JSON.stringify({
            input: {
              prompt: input.cutPrompt,
              input_image: image,
              output_format: "jpg",
            },
          }),
          signal: controller.signal,
        },
      );

      if (createRes.status === 429) {
        throw new ProviderError("Rate limited by Replicate", "rate_limit");
      }
      if (!createRes.ok) {
        const text = await createRes.text().catch(() => "");
        throw new ProviderError(
          `Replicate error ${createRes.status}: ${text.slice(0, 200)}`,
          "upstream",
        );
      }

      let prediction = (await createRes.json()) as {
        id: string;
        status: string;
        output?: string | string[];
        error?: string;
        urls?: { get: string };
      };

      const deadline = Date.now() + 110_000;
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed" &&
        prediction.status !== "canceled"
      ) {
        if (Date.now() > deadline) {
          throw new ProviderError("Replicate timed out", "timeout");
        }
        await new Promise((r) => setTimeout(r, 1500));
        const pollUrl =
          prediction.urls?.get ??
          `https://api.replicate.com/v1/predictions/${prediction.id}`;
        const pollRes = await fetch(pollUrl, {
          headers: { Authorization: `Bearer ${this.apiToken}` },
          signal: controller.signal,
        });
        if (!pollRes.ok) {
          throw new ProviderError("Replicate poll failed", "upstream");
        }
        prediction = (await pollRes.json()) as typeof prediction;
      }

      if (prediction.status !== "succeeded") {
        throw new ProviderError(
          prediction.error || "Replicate prediction failed",
          "upstream",
        );
      }

      const out = prediction.output;
      const url = Array.isArray(out) ? out[0] : out;
      if (!url || typeof url !== "string") {
        throw new ProviderError("Replicate returned no image", "upstream");
      }
      const imgRes = await fetch(url, { signal: controller.signal });
      if (!imgRes.ok) {
        throw new ProviderError(
          "Failed to download Replicate image",
          "upstream",
        );
      }
      return await imgRes.blob();
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProviderError("Replicate request timed out", "timeout");
      }
      throw new ProviderError(
        err instanceof Error ? err.message : "Replicate failed",
        "upstream",
      );
    } finally {
      clearTimeout(timer);
    }
  }
}

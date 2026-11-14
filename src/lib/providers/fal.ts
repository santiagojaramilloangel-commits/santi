import type { HairEditInput, ImageEditProvider } from "./types";
import { ProviderError } from "./types";

const DEFAULT_MODEL = "fal-ai/image-apps-v2/hair-change";

async function blobToDataUri(blob: Blob): Promise<string> {
  const buf = Buffer.from(await blob.arrayBuffer());
  const mime = blob.type || "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export class FalImageEditProvider implements ImageEditProvider {
  readonly id = "fal";

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.FAL_MODEL || DEFAULT_MODEL,
  ) {}

  async editHair(input: HairEditInput): Promise<Blob> {
    const imageUrl = await blobToDataUri(input.image);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);

    try {
      const res = await fetch(`https://fal.run/${this.model}`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: input.cutPrompt,
          sync_mode: true,
        }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        throw new ProviderError("Rate limited by fal", "rate_limit");
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ProviderError(
          `fal error ${res.status}: ${text.slice(0, 200)}`,
          "upstream",
        );
      }

      const json = (await res.json()) as {
        images?: { url: string }[];
        image?: { url: string };
      };
      const url = json.images?.[0]?.url ?? json.image?.url;
      if (!url) {
        throw new ProviderError("fal returned no image", "upstream");
      }
      const imgRes = await fetch(url, { signal: controller.signal });
      if (!imgRes.ok) {
        throw new ProviderError("Failed to download fal image", "upstream");
      }
      return await imgRes.blob();
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProviderError("fal request timed out", "timeout");
      }
      throw new ProviderError(
        err instanceof Error ? err.message : "fal failed",
        "upstream",
      );
    } finally {
      clearTimeout(timer);
    }
  }
}

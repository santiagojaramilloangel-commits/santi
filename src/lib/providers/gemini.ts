import type { HairEditInput, ImageEditProvider } from "./types";
import { ProviderError } from "./types";

const DEFAULT_MODEL = "gemini-2.5-flash-image";

export class GeminiImageEditProvider implements ImageEditProvider {
  readonly id = "gemini";

  constructor(
    private readonly apiKey: string,
    private readonly model = process.env.GEMINI_MODEL || DEFAULT_MODEL,
    private readonly baseUrl =
      process.env.GOOGLE_GEMINI_BASE_URL ||
      "https://generativelanguage.googleapis.com",
  ) {}

  async editHair(input: HairEditInput): Promise<Blob> {
    const buf = Buffer.from(await input.image.arrayBuffer());
    const mime = input.image.type || "image/jpeg";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/v1beta/models/${this.model}:generateContent`;

    try {
      const res = await fetch(`${endpoint}?key=${encodeURIComponent(this.apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: input.cutPrompt },
                {
                  inlineData: {
                    mimeType: mime,
                    data: buf.toString("base64"),
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        throw new ProviderError("Rate limited by Gemini", "rate_limit");
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ProviderError(
          `Gemini error ${res.status}: ${text.slice(0, 200)}`,
          "upstream",
        );
      }

      const json = (await res.json()) as {
        candidates?: {
          content?: {
            parts?: {
              inlineData?: { mimeType?: string; data?: string };
              inline_data?: { mime_type?: string; data?: string };
            }[];
          };
        }[];
      };

      const parts = json.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        const data =
          part.inlineData?.data ?? part.inline_data?.data;
        const partMime =
          part.inlineData?.mimeType ??
          part.inline_data?.mime_type ??
          "image/jpeg";
        if (data) {
          const bytes = Uint8Array.from(Buffer.from(data, "base64"));
          return new Blob([bytes], { type: partMime });
        }
      }

      throw new ProviderError("Gemini returned no image", "upstream");
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProviderError("Gemini request timed out", "timeout");
      }
      throw new ProviderError(
        err instanceof Error ? err.message : "Gemini failed",
        "upstream",
      );
    } finally {
      clearTimeout(timer);
    }
  }
}

import type { HairEditInput, ImageEditProvider } from "./types";
import { ProviderError } from "./types";

/**
 * Server-side demo provider — should not be called when the client already
 * renders placeholders. Kept so the factory always has a safe fallback.
 */
export class DemoImageEditProvider implements ImageEditProvider {
  readonly id = "demo";

  async editHair(input: HairEditInput): Promise<Blob> {
    void input;
    throw new ProviderError(
      "Demo mode: no AI provider key configured",
      "config",
    );
  }
}

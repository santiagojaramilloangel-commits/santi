import { NextResponse } from "next/server";
import { getCutById, type CutId } from "@/lib/cuts";
import {
  createImageEditProvider,
  isDemoMode,
  ProviderError,
} from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CUT_IDS: CutId[] = [
  "skin-fade",
  "buzz-cut",
  "textured-crop",
  "curtains",
  "curly-shag",
];

function isCutId(value: string): value is CutId {
  return (CUT_IDS as string[]).includes(value);
}

/**
 * POST multipart: image (file) + cutId (string).
 * Never writes images to disk. Never logs image bytes.
 * API keys stay server-side only.
 */
export async function POST(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json(
      {
        demo: true,
        error: "demo_mode",
        message: "No AI provider key configured",
      },
      { status: 200 },
    );
  }

  try {
    const form = await request.formData();
    const cutIdRaw = String(form.get("cutId") ?? "");
    const file = form.get("image");

    if (!isCutId(cutIdRaw)) {
      return NextResponse.json(
        { error: "invalid_cut", message: "Invalid cutId" },
        { status: 400 },
      );
    }
    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json(
        { error: "missing_image", message: "Image required" },
        { status: 400 },
      );
    }

    const cut = getCutById(cutIdRaw);
    const provider = createImageEditProvider();
    const result = await provider.editHair({
      image: file,
      cutPrompt: cut.prompt,
      cutId: cut.id,
    });

    return new NextResponse(result, {
      status: 200,
      headers: {
        "Content-Type": result.type || "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof ProviderError) {
      const status =
        err.code === "rate_limit"
          ? 429
          : err.code === "timeout"
            ? 504
            : err.code === "config"
              ? 503
              : 502;
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status },
      );
    }
    return NextResponse.json(
      {
        error: "upstream",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

/** Lightweight status for the client demo banner. */
export async function GET() {
  return NextResponse.json({
    demo: isDemoMode(),
    provider: process.env.IMAGE_PROVIDER || "demo",
  });
}

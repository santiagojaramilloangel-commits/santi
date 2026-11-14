import type { NextConfig } from "next";

const hasProviderKey = Boolean(
  process.env.FAL_KEY?.trim() ||
    process.env.REPLICATE_API_TOKEN?.trim() ||
    process.env.GEMINI_API_KEY?.trim(),
);

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    // Build-time hint for static banners; runtime still checks /api/edit-hair.
    NEXT_PUBLIC_DEMO_MODE:
      process.env.IMAGE_PROVIDER === "demo" || !hasProviderKey ? "1" : "0",
  },
};

export default nextConfig;

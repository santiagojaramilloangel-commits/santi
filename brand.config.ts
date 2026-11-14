/**
 * Shop branding defaults. Override at runtime via NEXT_PUBLIC_* env vars
 * (see src/lib/brand.ts). Keep secrets out of this file.
 */
export const brandConfig = {
  shopName: "Atelier Fade",
  logoPath: "/logo.svg",
  currency: "USD",
  /** Default price applied to every cut unless overridden per-cut. */
  pricePerCut: 45,
  whatsappNumber: "",
  bookingUrl: "",
} as const;

export type BrandConfig = {
  shopName: string;
  logoPath: string;
  currency: string;
  pricePerCut: number;
  whatsappNumber: string;
  bookingUrl: string;
};

import { brandConfig, type BrandConfig } from "../../brand.config";

function env(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") return undefined;
  return value.trim();
}

function envNumber(name: string, fallback: number): number {
  const raw = env(name);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Resolved branding for the running app (config + public env overrides). */
export const brand: BrandConfig = {
  shopName: env("NEXT_PUBLIC_SHOP_NAME") ?? brandConfig.shopName,
  logoPath: env("NEXT_PUBLIC_LOGO_PATH") ?? brandConfig.logoPath,
  currency: env("NEXT_PUBLIC_CURRENCY") ?? brandConfig.currency,
  pricePerCut: envNumber("NEXT_PUBLIC_PRICE_PER_CUT", brandConfig.pricePerCut),
  whatsappNumber:
    env("NEXT_PUBLIC_WHATSAPP_NUMBER") ?? brandConfig.whatsappNumber,
  bookingUrl: env("NEXT_PUBLIC_BOOKING_URL") ?? brandConfig.bookingUrl,
};

export function hasWhatsApp(): boolean {
  return brand.whatsappNumber.replace(/\D/g, "").length >= 8;
}

export function hasBookingUrl(): boolean {
  return brand.bookingUrl.length > 0;
}

export function bookingUrlForCut(cutName: string): string | null {
  if (!hasBookingUrl()) return null;
  const url = new URL(brand.bookingUrl);
  url.searchParams.set("service", cutName);
  return url.toString();
}

export function whatsappDigits(): string {
  return brand.whatsappNumber.replace(/\D/g, "");
}

import {
  brand,
  bookingUrlForCut,
  hasBookingUrl,
  hasWhatsApp,
  whatsappDigits,
} from "@/lib/brand";
import { formatPrice, type CutDefinition } from "@/lib/cuts";
import type { Dictionary, Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function buildShareText(
  dict: Dictionary,
  cut: CutDefinition,
  locale: Locale,
): string {
  const name = locale === "es" ? cut.nameEs : cut.nameEn;
  const price = formatPrice(brand.pricePerCut, locale);
  return t(dict, "shareMessage", {
    shop: brand.shopName,
    cut: name,
    price,
  });
}

export async function canShareFiles(file: File): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  if (!navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export async function shareImageFile(
  blob: Blob,
  filename: string,
  text: string,
): Promise<"shared" | "fallback" | "cancelled"> {
  const file = new File([blob], filename, { type: "image/jpeg" });
  if (await canShareFiles(file)) {
    try {
      await navigator.share({ files: [file], text, title: brand.shopName });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // fall through to WhatsApp
    }
  }
  openWhatsAppWithText(text);
  return "fallback";
}

export function openWhatsAppWithText(text: string): void {
  const digits = whatsappDigits();
  const base = digits
    ? `https://wa.me/${digits}`
    : "https://wa.me/";
  const url = `${base}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openBooking(cut: CutDefinition, locale: Locale): void {
  const name = locale === "es" ? cut.nameEs : cut.nameEn;
  if (hasBookingUrl()) {
    const url = bookingUrlForCut(name);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
  }
  if (hasWhatsApp()) {
    const price = formatPrice(brand.pricePerCut, locale);
    const text =
      locale === "es"
        ? `Hola, quiero reservar: ${name} (${price}) en ${brand.shopName}`
        : `Hi, I'd like to book: ${name} (${price}) at ${brand.shopName}`;
    openWhatsAppWithText(text);
  }
}

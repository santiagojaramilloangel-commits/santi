import { brand } from "@/lib/brand";

export type CutId =
  | "skin-fade"
  | "buzz-cut"
  | "textured-crop"
  | "curtains"
  | "curly-shag";

export type CutDefinition = {
  id: CutId;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  maintenanceEn: string;
  maintenanceEs: string;
  /** Prompt fragment for the image model — hair change only. */
  prompt: string;
};

export const CUTS: readonly CutDefinition[] = [
  {
    id: "skin-fade",
    nameEn: "Skin Fade",
    nameEs: "Degradado al ras",
    descriptionEn: "Clean taper from skin at the sides into length on top.",
    descriptionEs: "Degradado limpio desde la piel en los laterales hasta largo arriba.",
    maintenanceEn: "Touch-up every 2–3 weeks",
    maintenanceEs: "Retoque cada 2–3 semanas",
    prompt:
      "Change only the hair to a precise skin fade (degradado al ras): sides and back faded to bare skin with a seamless blend into short-to-medium length on top. Keep the exact same face, skin tone, facial hair, expression, background, lighting, and camera angle. No beautification, no filters, no makeup changes.",
  },
  {
    id: "buzz-cut",
    nameEn: "Buzz Cut",
    nameEs: "Rapado",
    descriptionEn: "Uniform short clipper length all over — sharp and low-maintenance.",
    descriptionEs: "Largo uniforme a máquina en toda la cabeza — limpio y de bajo mantenimiento.",
    maintenanceEn: "Touch-up every 2–3 weeks",
    maintenanceEs: "Retoque cada 2–3 semanas",
    prompt:
      "Change only the hair to a classic buzz cut (rapado): evenly short clipper length across the entire head, natural scalp texture visible. Keep the exact same face, skin tone, facial hair, expression, background, lighting, and camera angle. No beautification.",
  },
  {
    id: "textured-crop",
    nameEn: "Short Textured Crop",
    nameEs: "Crop texturizado corto",
    descriptionEn: "Choppy texture on top with a tight fringe and faded sides.",
    descriptionEs: "Textura irregular arriba con flequillo corto y laterales degradados.",
    maintenanceEn: "Touch-up every 3–4 weeks",
    maintenanceEs: "Retoque cada 3–4 semanas",
    prompt:
      "Change only the hair to a short textured crop (crop texturizado corto): choppy textured top, forward fringe just above the brows, tight faded sides. Keep the exact same face, skin tone, facial hair, expression, background, lighting, and camera angle. No beautification.",
  },
  {
    id: "curtains",
    nameEn: "Curtains, Middle Part",
    nameEs: "Cortina con raya al medio",
    descriptionEn: "Soft middle part with length framing the face on both sides.",
    descriptionEs: "Raya al medio suave con largo que enmarca el rostro a ambos lados.",
    maintenanceEn: "Trim every 4–6 weeks",
    maintenanceEs: "Corte cada 4–6 semanas",
    prompt:
      "Change only the hair to curtains with a middle part (cortina con raya al medio): soft center part, medium length falling on both sides of the face, slightly textured ends. Keep the exact same face, skin tone, facial hair, expression, background, lighting, and camera angle. No beautification.",
  },
  {
    id: "curly-shag",
    nameEn: "Curly Shag, Scissor Cut",
    nameEs: "Shag rizado a tijera",
    descriptionEn: "Layered scissor shag with curl volume, fringe near the brows.",
    descriptionEs: "Shag en capas a tijera con volumen rizado y flequillo cerca de las cejas.",
    maintenanceEn: "Shape every 6–8 weeks",
    maintenanceEs: "Forma cada 6–8 semanas",
    prompt:
      "Change only the hair to a curly scissor-cut shag (shag rizado a tijera): layered curly volume, fringe near the brows, fuller sides framing the face, natural curl texture. Keep the exact same face, skin tone, facial hair, expression, background, lighting, and camera angle. No beautification.",
  },
] as const;

export function getCutById(id: CutId): CutDefinition {
  const cut = CUTS.find((c) => c.id === id);
  if (!cut) {
    throw new Error(`Unknown cut id: ${id}`);
  }
  return cut;
}

export function getCutPrice(cutId: CutId): number {
  void cutId;
  return brand.pricePerCut;
}

export function formatPrice(amount: number, locale: "en" | "es"): string {
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
      style: "currency",
      currency: brand.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${brand.currency} ${amount}`;
  }
}

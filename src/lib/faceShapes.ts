import type { CutId } from "@/lib/cuts";

export type FaceShapeId = "long" | "round" | "square" | "oval";

export type Tier = "S" | "A" | "B" | "C" | "D";

export type CutFaceFit = {
  cutId: CutId;
  tier: Tier;
  reasonEn: string;
  reasonEs: string;
};

export type FaceShapeDefinition = {
  id: FaceShapeId;
  labelEn: string;
  labelEs: string;
  /** All five cuts, ranked S > A > B > C > D (each tier used once). */
  rankings: readonly CutFaceFit[];
};

const TIER_ORDER: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3, D: 4 };

export const FACE_SHAPES: readonly FaceShapeDefinition[] = [
  {
    id: "long",
    labelEn: "Long",
    labelEs: "Alargado",
    rankings: [
      {
        cutId: "curly-shag",
        tier: "S",
        reasonEn: "Frames face, fringe at brows, full sides",
        reasonEs: "Enmarca el rostro, flequillo a la ceja, laterales llenos",
      },
      {
        cutId: "curtains",
        tier: "A",
        reasonEn: "Frames eyes but draws a straight line down",
        reasonEs: "Enmarca los ojos pero traza una línea recta hacia abajo",
      },
      {
        cutId: "textured-crop",
        tier: "B",
        reasonEn: "Clean but grows flat on top, heavy on sides",
        reasonEs: "Limpio pero crece plano arriba y pesado a los lados",
      },
      {
        cutId: "buzz-cut",
        tier: "C",
        reasonEn: "Shows bone structure, no top volume",
        reasonEs: "Muestra estructura ósea, sin volumen arriba",
      },
      {
        cutId: "skin-fade",
        tier: "D",
        reasonEn: "Pulls face upward",
        reasonEs: "Alarga el rostro hacia arriba",
      },
    ],
  },
  {
    id: "round",
    labelEn: "Round",
    labelEs: "Redondo",
    rankings: [
      {
        cutId: "skin-fade",
        tier: "S",
        reasonEn: "Adds height on top and slims the sides for angles",
        reasonEs: "Suma altura arriba y afina los laterales para dar ángulos",
      },
      {
        cutId: "textured-crop",
        tier: "A",
        reasonEn: "Short fringe and texture break circular width",
        reasonEs: "Flequillo corto y textura rompen el ancho circular",
      },
      {
        cutId: "buzz-cut",
        tier: "B",
        reasonEn: "Clean outline; relies on facial structure, not hair mass",
        reasonEs: "Contorno limpio; se apoya en la estructura, no en masa",
      },
      {
        cutId: "curtains",
        tier: "C",
        reasonEn: "Side length can widen cheeks if left too full",
        reasonEs: "El largo lateral puede ensanchar mejillas si queda muy lleno",
      },
      {
        cutId: "curly-shag",
        tier: "D",
        reasonEn: "Wide curl volume adds width where round faces need less",
        reasonEs: "El volumen rizado suma ancho donde el rostro redondo necesita menos",
      },
    ],
  },
  {
    id: "square",
    labelEn: "Square",
    labelEs: "Cuadrado",
    rankings: [
      {
        cutId: "curtains",
        tier: "S",
        reasonEn: "Soft middle part softens the jawline with vertical lines",
        reasonEs: "La raya al medio suaviza la mandíbula con líneas verticales",
      },
      {
        cutId: "curly-shag",
        tier: "A",
        reasonEn: "Layered fringe and sides round off hard corners",
        reasonEs: "Flequillo y laterales en capas redondean las esquinas duras",
      },
      {
        cutId: "textured-crop",
        tier: "B",
        reasonEn: "Texture on top adds interest without fighting the jaw",
        reasonEs: "Textura arriba aporta interés sin pelear con la mandíbula",
      },
      {
        cutId: "skin-fade",
        tier: "C",
        reasonEn: "Tight sides emphasize square angles at the temples",
        reasonEs: "Laterales cerrados enfatizan ángulos cuadrados en sienes",
      },
      {
        cutId: "buzz-cut",
        tier: "D",
        reasonEn: "Exposes the full square outline with no softening length",
        reasonEs: "Expone el contorno cuadrado sin largo que lo suavice",
      },
    ],
  },
  {
    id: "oval",
    labelEn: "Oval",
    labelEs: "Ovalado",
    rankings: [
      {
        cutId: "textured-crop",
        tier: "S",
        reasonEn: "Balanced proportions suit almost any top texture",
        reasonEs: "Proporciones equilibradas favorecen casi cualquier textura",
      },
      {
        cutId: "skin-fade",
        tier: "A",
        reasonEn: "Clean fade keeps oval balance with polished sides",
        reasonEs: "El degradado limpio mantiene el equilibrio ovalado",
      },
      {
        cutId: "curtains",
        tier: "B",
        reasonEn: "Framing length works; avoid excess that hides the oval",
        reasonEs: "El largo que enmarca funciona; evita exceso que oculte el óvalo",
      },
      {
        cutId: "curly-shag",
        tier: "C",
        reasonEn: "Volume is fine in moderation; too much can overwhelm",
        reasonEs: "El volumen va bien con moderación; demasiado puede saturar",
      },
      {
        cutId: "buzz-cut",
        tier: "D",
        reasonEn: "Works, but removes the hair styling oval faces enjoy most",
        reasonEs: "Funciona, pero quita el juego de peinado que más favorece al óvalo",
      },
    ],
  },
] as const;

function assertUniqueTiers(shape: FaceShapeDefinition): void {
  const tiers = shape.rankings.map((r) => r.tier);
  const unique = new Set(tiers);
  if (unique.size !== 5) {
    throw new Error(`Face shape ${shape.id} must use tiers S–D exactly once`);
  }
}

FACE_SHAPES.forEach(assertUniqueTiers);

export function getFaceShape(id: FaceShapeId): FaceShapeDefinition {
  const shape = FACE_SHAPES.find((s) => s.id === id);
  if (!shape) {
    throw new Error(`Unknown face shape: ${id}`);
  }
  return shape;
}

export function getFitForCut(
  faceShapeId: FaceShapeId,
  cutId: CutId,
): CutFaceFit {
  const shape = getFaceShape(faceShapeId);
  const fit = shape.rankings.find((r) => r.cutId === cutId);
  if (!fit) {
    throw new Error(`No fit for cut ${cutId} on shape ${faceShapeId}`);
  }
  return fit;
}

/** Cuts ordered by tier for the selected face shape (S first). */
export function orderedCutsForFaceShape(faceShapeId: FaceShapeId): CutFaceFit[] {
  const shape = getFaceShape(faceShapeId);
  return [...shape.rankings].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
  );
}

export { TIER_ORDER };

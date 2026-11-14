export type Locale = "en" | "es";

export type Dictionary = {
  appTitle: string;
  tagline: string;
  language: string;
  demoBanner: string;
  demoWatermark: string;
  navTryOn: string;
  navBarber: string;
  next: string;
  back: string;
  retry: string;
  cancel: string;
  confirm: string;
  loading: string;
  errorGeneric: string;
  errorTimeout: string;
  errorRateLimit: string;
  errorNetwork: string;
  // Capture
  captureTitle: string;
  captureHint: string;
  uploadPhoto: string;
  useCamera: string;
  useSample: string;
  sample1: string;
  sample2: string;
  retake: string;
  useThisPhoto: string;
  cameraPermissionDenied: string;
  cameraUnavailable: string;
  framingHint: string;
  stopCamera: string;
  // Face shape
  faceShapeTitle: string;
  faceShapeHint: string;
  faceLong: string;
  faceRound: string;
  faceSquare: string;
  faceOval: string;
  // Cuts
  cutsTitle: string;
  cutsHint: string;
  generate: string;
  generating: string;
  ready: string;
  pending: string;
  failed: string;
  maintenance: string;
  faceFit: string;
  tierLabel: string;
  priceLabel: string;
  pickFavorite: string;
  favorite: string;
  // Compare
  compareTitle: string;
  compareHint: string;
  before: string;
  after: string;
  swipeCuts: string;
  // Share / book
  download: string;
  share: string;
  bookThisCut: string;
  shareFallbackHint: string;
  shareMessage: string;
  downloadSuccess: string;
  shareUnsupported: string;
  // Barber mode
  barberTitle: string;
  barberHint: string;
  clientName: string;
  clientNamePlaceholder: string;
  barberNotes: string;
  barberNotesPlaceholder: string;
  saveLook: string;
  consentLabel: string;
  consentRequired: string;
  searchClients: string;
  searchPlaceholder: string;
  noClients: string;
  noLooks: string;
  deleteLook: string;
  deleteClient: string;
  confirmDeleteLook: string;
  confirmDeleteClient: string;
  savedAt: string;
  openLook: string;
  faceShape: string;
  cut: string;
  saveSuccess: string;
  backToTryOn: string;
  selectCutFirst: string;
  selectPhotoFirst: string;
};

const en: Dictionary = {
  appTitle: "Virtual Try-On",
  tagline: "See the cut before the clippers.",
  language: "Language",
  demoBanner: "Demo mode – no AI generation",
  demoWatermark: "DEMO PLACEHOLDER",
  navTryOn: "Try-on",
  navBarber: "Barber Mode",
  next: "Continue",
  back: "Back",
  retry: "Retry",
  cancel: "Cancel",
  confirm: "Confirm",
  loading: "Loading…",
  errorGeneric: "Something went wrong. Please try again.",
  errorTimeout: "The request timed out. Please try again.",
  errorRateLimit: "Too many requests. Wait a moment and retry.",
  errorNetwork: "Network error. Check your connection and retry.",
  captureTitle: "Capture",
  captureHint: "Upload a photo or use the front camera. Align eyes on the gold line.",
  uploadPhoto: "Upload photo",
  useCamera: "Use camera",
  useSample: "Sample photos",
  sample1: "Sample A",
  sample2: "Sample B",
  retake: "Retake",
  useThisPhoto: "Use this photo",
  cameraPermissionDenied: "Camera permission denied. Upload a photo instead.",
  cameraUnavailable: "Camera is not available on this device.",
  framingHint: "Center the face in the oval. Eyes on the line.",
  stopCamera: "Stop camera",
  faceShapeTitle: "Face shape",
  faceShapeHint: "Pick the closest shape — we'll rank the five cuts for you.",
  faceLong: "Long",
  faceRound: "Round",
  faceSquare: "Square",
  faceOval: "Oval",
  cutsTitle: "Cuts",
  cutsHint: "Generate one cut at a time. Results stay in memory for this session.",
  generate: "Generate",
  generating: "Generating…",
  ready: "Ready",
  pending: "Not generated",
  failed: "Failed",
  maintenance: "Maintenance",
  faceFit: "Face fit",
  tierLabel: "Tier",
  priceLabel: "Price",
  pickFavorite: "Choose favorite",
  favorite: "Favorite",
  compareTitle: "Compare",
  compareHint: "Drag the slider. Swipe to switch cuts.",
  before: "Before",
  after: "After",
  swipeCuts: "Swipe for other cuts",
  download: "Download",
  share: "Share",
  bookThisCut: "Book this cut",
  shareFallbackHint:
    "Sharing files isn't supported here. Download the image, then open WhatsApp.",
  shareMessage: "I'd like this cut at {shop}: {cut} — {price}",
  downloadSuccess: "Image saved",
  shareUnsupported: "Share is not available. Download the image instead.",
  barberTitle: "Barber Mode",
  barberHint: "Save looks on this device for repeat visits. Nothing leaves the phone.",
  clientName: "Client name",
  clientNamePlaceholder: "e.g. Alex Rivera",
  barberNotes: "Barber notes",
  barberNotesPlaceholder: "Clipper guard, product, preferences…",
  saveLook: "Save look",
  consentLabel: "Client agrees to store this photo on this device",
  consentRequired: "Consent is required before saving.",
  searchClients: "Search clients",
  searchPlaceholder: "Search by name…",
  noClients: "No saved clients yet.",
  noLooks: "No looks for this client.",
  deleteLook: "Delete look",
  deleteClient: "Delete client",
  confirmDeleteLook: "Delete this look permanently?",
  confirmDeleteClient: "Delete this client and all their looks?",
  savedAt: "Saved",
  openLook: "Open",
  faceShape: "Face shape",
  cut: "Cut",
  saveSuccess: "Look saved on this device.",
  backToTryOn: "Back to try-on",
  selectCutFirst: "Generate and select a cut first.",
  selectPhotoFirst: "Capture a photo first.",
};

const es: Dictionary = {
  appTitle: "Prueba virtual",
  tagline: "Mira el corte antes de la máquina.",
  language: "Idioma",
  demoBanner: "Modo demo – sin generación IA",
  demoWatermark: "MARCA DEMO",
  navTryOn: "Prueba",
  navBarber: "Modo barbero",
  next: "Continuar",
  back: "Atrás",
  retry: "Reintentar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  loading: "Cargando…",
  errorGeneric: "Algo salió mal. Inténtalo de nuevo.",
  errorTimeout: "La solicitud expiró. Inténtalo de nuevo.",
  errorRateLimit: "Demasiadas solicitudes. Espera un momento y reintenta.",
  errorNetwork: "Error de red. Revisa tu conexión y reintenta.",
  captureTitle: "Captura",
  captureHint:
    "Sube una foto o usa la cámara frontal. Alinea los ojos con la línea dorada.",
  uploadPhoto: "Subir foto",
  useCamera: "Usar cámara",
  useSample: "Fotos de muestra",
  sample1: "Muestra A",
  sample2: "Muestra B",
  retake: "Repetir",
  useThisPhoto: "Usar esta foto",
  cameraPermissionDenied:
    "Permiso de cámara denegado. Sube una foto en su lugar.",
  cameraUnavailable: "La cámara no está disponible en este dispositivo.",
  framingHint: "Centra el rostro en el óvalo. Ojos sobre la línea.",
  stopCamera: "Detener cámara",
  faceShapeTitle: "Forma del rostro",
  faceShapeHint: "Elige la forma más cercana — ordenamos los cinco cortes.",
  faceLong: "Alargado",
  faceRound: "Redondo",
  faceSquare: "Cuadrado",
  faceOval: "Ovalado",
  cutsTitle: "Cortes",
  cutsHint:
    "Genera un corte a la vez. Los resultados quedan en memoria en esta sesión.",
  generate: "Generar",
  generating: "Generando…",
  ready: "Listo",
  pending: "Sin generar",
  failed: "Falló",
  maintenance: "Mantenimiento",
  faceFit: "Ajuste al rostro",
  tierLabel: "Nivel",
  priceLabel: "Precio",
  pickFavorite: "Elegir favorito",
  favorite: "Favorito",
  compareTitle: "Comparar",
  compareHint: "Arrastra el control. Desliza para cambiar de corte.",
  before: "Antes",
  after: "Después",
  swipeCuts: "Desliza para otros cortes",
  download: "Descargar",
  share: "Compartir",
  bookThisCut: "Reservar este corte",
  shareFallbackHint:
    "Compartir archivos no está disponible aquí. Descarga la imagen y abre WhatsApp.",
  shareMessage: "Quiero este corte en {shop}: {cut} — {price}",
  downloadSuccess: "Imagen guardada",
  shareUnsupported: "Compartir no está disponible. Descarga la imagen.",
  barberTitle: "Modo barbero",
  barberHint:
    "Guarda looks en este dispositivo para visitas repetidas. Nada sale del teléfono.",
  clientName: "Nombre del cliente",
  clientNamePlaceholder: "ej. Álex Rivera",
  barberNotes: "Notas del barbero",
  barberNotesPlaceholder: "Peine, producto, preferencias…",
  saveLook: "Guardar look",
  consentLabel: "El cliente acepta guardar esta foto en este dispositivo",
  consentRequired: "Se requiere el consentimiento para guardar.",
  searchClients: "Buscar clientes",
  searchPlaceholder: "Buscar por nombre…",
  noClients: "Aún no hay clientes guardados.",
  noLooks: "No hay looks para este cliente.",
  deleteLook: "Eliminar look",
  deleteClient: "Eliminar cliente",
  confirmDeleteLook: "¿Eliminar este look de forma permanente?",
  confirmDeleteClient: "¿Eliminar este cliente y todos sus looks?",
  savedAt: "Guardado",
  openLook: "Abrir",
  faceShape: "Forma del rostro",
  cut: "Corte",
  saveSuccess: "Look guardado en este dispositivo.",
  backToTryOn: "Volver a la prueba",
  selectCutFirst: "Genera y selecciona un corte primero.",
  selectPhotoFirst: "Captura una foto primero.",
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "en";
  return lang.startsWith("es") ? "es" : "en";
}

export const LOCALE_STORAGE_KEY = "barbershop-tryon-locale";

export function loadStoredLocale(): Locale | null {
  if (typeof localStorage === "undefined") return null;
  const v = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (v === "en" || v === "es") return v;
  return null;
}

export function storeLocale(locale: Locale): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function t(
  dict: Dictionary,
  key: keyof Dictionary,
  vars?: Record<string, string>,
): string {
  let s = dict[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, v);
    }
  }
  return s;
}

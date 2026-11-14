const MAX_LONG_SIDE = 1024;
const JPEG_QUALITY = 0.85;

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Downscale to max 1024px on the long side, export JPEG ~0.85.
 * Canvas re-encode strips EXIF.
 */
export async function preprocessPhoto(source: Blob): Promise<Blob> {
  const img = await loadImageFromBlob(source);
  const longSide = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = longSide > MAX_LONG_SIDE ? MAX_LONG_SIDE / longSide : 1;
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Failed to encode JPEG");
  return blob;
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export type StampOptions = {
  logoUrl: string;
  cutName: string;
  shopName: string;
};

/** Stamp shop logo + cut name in a corner; returns JPEG blob. */
export async function stampResultImage(
  image: Blob,
  options: StampOptions,
): Promise<Blob> {
  const img = await loadImageFromBlob(image);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0);

  const pad = Math.round(Math.min(canvas.width, canvas.height) * 0.04);
  const barH = Math.round(canvas.height * 0.08);
  ctx.fillStyle = "rgba(31, 31, 31, 0.72)";
  ctx.fillRect(0, canvas.height - barH, canvas.width, barH);

  let logoDrawn = false;
  try {
    const logo = await loadImageFromBlob(
      await (await fetch(options.logoUrl)).blob(),
    );
    const logoSize = Math.round(barH * 0.7);
    ctx.drawImage(
      logo,
      pad,
      canvas.height - barH + (barH - logoSize) / 2,
      logoSize,
      logoSize,
    );
    logoDrawn = true;
    void logoDrawn;
  } catch {
    // Logo optional — continue with text only
  }

  const textX = pad + (logoDrawn ? Math.round(barH * 0.7) + pad / 2 : 0);
  ctx.fillStyle = "#FFD700";
  ctx.font = `600 ${Math.round(barH * 0.28)}px "Segoe UI", system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  const label = `${options.cutName} · ${options.shopName}`;
  ctx.fillText(label, textX, canvas.height - barH / 2, canvas.width - textX - pad);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Failed to stamp JPEG");
  return blob;
}

/**
 * Honest demo placeholder: grayscale source + large gold watermark + cut name.
 * Never presented as a real AI result.
 */
export async function renderDemoPlaceholder(
  source: Blob,
  cutName: string,
  watermark: string,
): Promise<Blob> {
  const img = await loadImageFromBlob(source);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = g;
    d[i + 1] = g;
    d[i + 2] = g;
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = "rgba(31, 31, 31, 0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const mainSize = Math.round(Math.min(canvas.width, canvas.height) * 0.09);
  ctx.font = `800 ${mainSize}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(watermark, 0, -mainSize * 0.4);
  ctx.font = `600 ${Math.round(mainSize * 0.55)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(cutName, 0, mainSize * 0.7);
  ctx.restore();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Failed to render demo placeholder");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

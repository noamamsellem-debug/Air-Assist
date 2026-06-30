/**
 * Préparation « best effort » d'un fichier pour upload binaire (côté navigateur).
 * Les images JPEG/PNG/WEBP sont compressées/redimensionnées (~1,3 Mo) ; tout le
 * reste (PDF, format non encodable) est envoyé tel quel. Ne lève jamais : en cas
 * d'échec, on renvoie le fichier original.
 */
export interface FichierPrepare {
  nomFichier: string;
  mimeType: string;
  blob: Blob;
}

export const MIMES_DOCUMENT = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const TYPES_CANVAS = ["image/jpeg", "image/png", "image/webp"];

export async function preparerFichier(file: File): Promise<FichierPrepare> {
  if (TYPES_CANVAS.includes(file.type)) {
    try {
      return await compresserImage(file);
    } catch (e) {
      console.warn("[upload] compression image échouée → envoi du fichier original", file.name, e);
    }
  }
  return { nomFichier: file.name, mimeType: file.type || "application/octet-stream", blob: file };
}

function chargerImage(src: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    const timer = setTimeout(() => {
      im.onload = null;
      im.onerror = null;
      reject(new Error("Chargement de l'image trop long (timeout)."));
    }, timeoutMs);
    im.onload = () => { clearTimeout(timer); resolve(im); };
    im.onerror = () => { clearTimeout(timer); reject(new Error("Image illisible.")); };
    im.src = src;
  });
}

async function compresserImage(file: File, maxDim = 2000): Promise<FichierPrepare> {
  const url = URL.createObjectURL(file);
  try {
    const img = await chargerImage(url);
    let { width, height } = img;
    if (!width || !height) throw new Error("Dimensions invalides.");
    const plusGrand = Math.max(width, height);
    if (plusGrand > maxDim) {
      const ratio = maxDim / plusGrand;
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible.");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob) throw new Error("Encodage JPEG impossible.");
    if (blob.size >= file.size) return { nomFichier: file.name, mimeType: file.type, blob: file };
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return { nomFichier: `${base}.jpg`, mimeType: "image/jpeg", blob };
  } finally {
    URL.revokeObjectURL(url);
  }
}

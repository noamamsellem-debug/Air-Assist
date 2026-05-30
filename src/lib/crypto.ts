/**
 * Chiffrement au repos des documents (AES-256-GCM).
 *
 * Exigence RGPD : les pièces justificatives (cartes d'embarquement, etc.) sont
 * chiffrées au repos. On stocke le triplet { contenuChiffre, iv, authTag }.
 *
 * Clé : variable d'env DOCUMENT_ENCRYPTION_KEY (base64, 32 octets). En dev,
 * si absente, une clé déterministe « mock » est dérivée (NON SÛRE — dev only),
 * de sorte que tout le parcours tourne sans configuration.
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

const ALGO = "aes-256-gcm";

export interface DocumentChiffre {
  contenuChiffre: Buffer;
  iv: Buffer;
  authTag: Buffer;
}

function resoudreCle(env: NodeJS.ProcessEnv = process.env): Buffer {
  const b64 = env.DOCUMENT_ENCRYPTION_KEY;
  if (b64 && b64.trim() !== "") {
    const cle = Buffer.from(b64, "base64");
    if (cle.length !== 32) {
      throw new Error("DOCUMENT_ENCRYPTION_KEY doit faire 32 octets (base64).");
    }
    return cle;
  }
  // Repli dev : clé déterministe dérivée d'une constante. NE PAS utiliser en prod.
  return createHash("sha256").update("air-assist-dev-mock-key").digest();
}

/** true si une vraie clé est configurée (prod), false si repli dev. */
export function chiffrementConfigure(env: NodeJS.ProcessEnv = process.env): boolean {
  return !!env.DOCUMENT_ENCRYPTION_KEY && env.DOCUMENT_ENCRYPTION_KEY.trim() !== "";
}

export function chiffrerDocument(
  contenu: Buffer,
  env: NodeJS.ProcessEnv = process.env,
): DocumentChiffre {
  const cle = resoudreCle(env);
  const iv = randomBytes(12); // 96 bits recommandé pour GCM
  const cipher = createCipheriv(ALGO, cle, iv);
  const contenuChiffre = Buffer.concat([cipher.update(contenu), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { contenuChiffre, iv, authTag };
}

export function dechiffrerDocument(
  doc: DocumentChiffre,
  env: NodeJS.ProcessEnv = process.env,
): Buffer {
  const cle = resoudreCle(env);
  const decipher = createDecipheriv(ALGO, cle, doc.iv);
  decipher.setAuthTag(doc.authTag);
  return Buffer.concat([decipher.update(doc.contenuChiffre), decipher.final()]);
}

/**
 * Génération du numéro de dossier interne lisible.
 * Format : AA-<année>-<séquence sur 6 chiffres>, ex "AA-2026-000123".
 */
export function genererReferenceDossier(annee: number, sequence: number): string {
  if (sequence < 1 || sequence > 999999) {
    throw new Error(`Séquence hors plage [1..999999] : ${sequence}`);
  }
  return `AA-${annee}-${String(sequence).padStart(6, "0")}`;
}

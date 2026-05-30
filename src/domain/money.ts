/**
 * Utilitaires monétaires.
 *
 * Les montants sont manipulés en CENTIMES (entiers) pour éviter toute dérive de
 * virgule flottante. On convertit en euros uniquement à l'affichage / à la
 * persistance. Toute la logique de répartition (commission / part client)
 * s'appuie sur ces helpers.
 */

/** Convertit un montant en euros (number | string | Decimal-like) en centimes entiers. */
export function eurosToCents(euros: number | string): number {
  const value = typeof euros === "string" ? Number(euros) : euros;
  if (!Number.isFinite(value)) {
    throw new Error(`Montant invalide : ${euros}`);
  }
  // Arrondi au centime le plus proche pour neutraliser les imprécisions float.
  return Math.round(value * 100);
}

/** Convertit des centimes entiers en euros (number, 2 décimales). */
export function centsToEuros(cents: number): number {
  if (!Number.isInteger(cents)) {
    throw new Error(`Centimes non entiers : ${cents}`);
  }
  return cents / 100;
}

/** Formate des centimes en chaîne localisée (par défaut fr-FR, EUR). */
export function formatEuros(cents: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(centsToEuros(cents));
}

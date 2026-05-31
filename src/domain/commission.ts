/**
 * Répartition de l'indemnité obtenue.
 *
 * Règle métier (modèle économique Air Assist) :
 *   • commission = 30 % de l'indemnité obtenue
 *   • part client = 70 % (le reste)
 *
 * Invariant fondamental : commission + partClient === montantObtenu, EXACTEMENT.
 * On garantit cet invariant en calculant la commission par arrondi puis en
 * déduisant la part client par soustraction (jamais deux arrondis séparés qui
 * pourraient diverger d'un centime).
 *
 * Ces fonctions sont PURES : `commission30` et `partClient70` du Dossier en
 * dérivent toujours, ils ne sont jamais saisis à la main.
 */

import { eurosToCents, centsToEuros } from "./money";

/** Taux de commission par défaut (30 %). Surchargé via env COMMISSION_RATE. */
export const TAUX_COMMISSION_DEFAUT = 0.3;

export interface RepartitionCents {
  /** Indemnité obtenue, en centimes. */
  montantObtenuCents: number;
  /** Commission Air Assist, en centimes. */
  commissionCents: number;
  /** Part reversée au client, en centimes. */
  partClientCents: number;
}

export interface RepartitionEuros {
  montantObtenu: number;
  commission: number;
  partClient: number;
}

/**
 * Répartit un montant (en centimes) entre commission et part client.
 * @param montantObtenuCents indemnité obtenue, en centimes (entier >= 0)
 * @param taux fraction de commission (0..1), défaut 0.30
 */
export function repartirCents(
  montantObtenuCents: number,
  taux: number = TAUX_COMMISSION_DEFAUT,
): RepartitionCents {
  if (!Number.isInteger(montantObtenuCents)) {
    throw new Error(`Montant en centimes non entier : ${montantObtenuCents}`);
  }
  if (montantObtenuCents < 0) {
    throw new Error(`Montant négatif interdit : ${montantObtenuCents}`);
  }
  if (taux < 0 || taux > 1) {
    throw new Error(`Taux de commission hors bornes [0,1] : ${taux}`);
  }

  const commissionCents = Math.round(montantObtenuCents * taux);
  // Déduction : garantit commission + partClient === montant (pas de dérive).
  const partClientCents = montantObtenuCents - commissionCents;

  return { montantObtenuCents, commissionCents, partClientCents };
}

/** Variante travaillant en euros (number). Pratique pour la persistance/UI. */
export function repartirEuros(
  montantObtenuEuros: number | string,
  taux: number = TAUX_COMMISSION_DEFAUT,
): RepartitionEuros {
  const r = repartirCents(eurosToCents(montantObtenuEuros), taux);
  return {
    montantObtenu: centsToEuros(r.montantObtenuCents),
    commission: centsToEuros(r.commissionCents),
    partClient: centsToEuros(r.partClientCents),
  };
}

/** Lit le taux de commission depuis l'environnement, avec repli sur 30 %. */
export function tauxCommissionConfigure(
  env: Record<string, string | undefined> = process.env,
): number {
  const brut = env.COMMISSION_RATE;
  if (!brut) return TAUX_COMMISSION_DEFAUT;
  const valeur = Number(brut);
  if (!Number.isFinite(valeur) || valeur < 0 || valeur > 1) {
    throw new Error(`COMMISSION_RATE invalide : ${brut}`);
  }
  return valeur;
}

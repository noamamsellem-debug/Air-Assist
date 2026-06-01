/**
 * Module 2 — Machine à états du cycle de vie d'un dossier.
 *
 * Seules les transitions déclarées ici sont autorisées. La couche service
 * (src/lib/dossier-service.ts) applique ces règles ET journalise chaque
 * changement dans HistoriqueStatut (append-only).
 *
 * Cycle nominal :
 *   NOUVEAU → VERIFIE → RECLAMATION_ENVOYEE → ACCUSE_RECU → EN_NEGOCIATION
 *           → ACCEPTE → PAYE → REVERSE
 * États annexes : REFUSE, CONTENTIEUX.
 *
 * Module pur (aucune dépendance Prisma/runtime) → entièrement testable.
 */

import { StatutDossier } from "@prisma/client";

/** Transitions autorisées : pour chaque statut, l'ensemble des cibles permises. */
export const TRANSITIONS: Record<StatutDossier, StatutDossier[]> = {
  NOUVEAU: ["VERIFIE", "REFUSE"],
  VERIFIE: ["RECLAMATION_ENVOYEE", "REFUSE"],
  RECLAMATION_ENVOYEE: ["ACCUSE_RECU", "REFUSE"],
  ACCUSE_RECU: ["EN_NEGOCIATION", "ACCEPTE", "REFUSE", "CONTENTIEUX"],
  EN_NEGOCIATION: ["ACCEPTE", "REFUSE", "CONTENTIEUX"],
  ACCEPTE: ["PAYE"],
  PAYE: ["REVERSE"],
  REVERSE: [], // terminal
  REFUSE: ["CONTENTIEUX"], // un refus peut être porté au contentieux
  CONTENTIEUX: ["ACCEPTE", "REFUSE"], // résolution du contentieux
};

/** Statuts terminaux (aucune transition sortante). */
export const STATUTS_TERMINAUX: StatutDossier[] = (
  Object.keys(TRANSITIONS) as StatutDossier[]
).filter((s) => TRANSITIONS[s].length === 0);

/** Indique si une transition est autorisée. */
export function peutTransiter(
  depuis: StatutDossier,
  vers: StatutDossier,
): boolean {
  return TRANSITIONS[depuis].includes(vers);
}

/** Liste les statuts cibles atteignables depuis un statut donné. */
export function transitionsPossibles(
  depuis: StatutDossier,
): StatutDossier[] {
  return [...TRANSITIONS[depuis]];
}

export class TransitionInterditeError extends Error {
  constructor(
    public readonly depuis: StatutDossier,
    public readonly vers: StatutDossier,
  ) {
    super(`Transition interdite : ${depuis} → ${vers}`);
    this.name = "TransitionInterditeError";
  }
}

/**
 * Valide une transition et renvoie le statut cible.
 * Lève TransitionInterditeError si la transition n'est pas permise.
 */
export function appliquerTransition(
  depuis: StatutDossier,
  vers: StatutDossier,
): StatutDossier {
  if (!peutTransiter(depuis, vers)) {
    throw new TransitionInterditeError(depuis, vers);
  }
  return vers;
}

/** Libellés FR lisibles (pour l'UI/CRM). */
export const LIBELLES_STATUT: Record<StatutDossier, string> = {
  NOUVEAU: "Nouveau",
  VERIFIE: "Vérifié",
  RECLAMATION_ENVOYEE: "Réclamation envoyée",
  ACCUSE_RECU: "Accusé reçu",
  EN_NEGOCIATION: "En négociation",
  ACCEPTE: "Accepté",
  PAYE: "Payé",
  REVERSE: "Reversé",
  REFUSE: "Refusé",
  CONTENTIEUX: "Contentieux",
};

/**
 * Module 3 — Moteur d'éligibilité EC 261/2004.
 *
 * À partir des caractéristiques d'un vol, détermine :
 *   • l'éligibilité à une indemnisation,
 *   • le montant forfaitaire estimé.
 *
 * Barème par distance (Art. 7) :
 *   • 250 €  : trajet ≤ 1500 km
 *   • 400 €  : 1500–3500 km  OU  tout vol intra-UE > 1500 km
 *   • 600 €  : > 3500 km (hors intra-UE)
 *
 * Conditions principales :
 *   • Retard à l'arrivée ≥ 3 h (180 min) pour les motifs « retard » et
 *     « correspondance manquée ».
 *   • Annulation : éligible sauf préavis ≥ 14 jours.
 *   • Surbooking (refus d'embarquement) : éligible.
 *   • Exclusion en cas de « circonstances extraordinaires » (météo extrême,
 *     grève externe, sûreté, instabilité politique…).
 *
 * Cas limite (Art. 7§2c) : pour un vol > 3500 km hors UE dont le retard à
 * l'arrivée est compris entre 3 h et 4 h, l'indemnité est réduite de 50 %.
 *
 * Fonction PURE — aucune dépendance runtime, entièrement testable.
 */

import type { MotifVol } from "@prisma/client";

export const SEUIL_RETARD_MIN = 180; // 3 heures
export const PREAVIS_ANNULATION_EXONERATOIRE_JOURS = 14;

export interface EntreeEligibilite {
  distanceKm: number;
  motif: MotifVol;
  /** Retard à l'arrivée en minutes (requis pour retard / correspondance manquée). */
  dureeRetardMin?: number | null;
  /** Vol entièrement intra-UE (les deux aéroports dans l'UE). */
  intraUe?: boolean;
  /** Préavis d'annulation en jours (≥ 14 ⇒ non éligible). */
  preavisAnnulationJours?: number | null;
  /** La compagnie invoque des circonstances extraordinaires avérées. */
  circonstanceExtraordinaire?: boolean;
}

export type CodeRaison =
  | "ELIGIBLE"
  | "RETARD_INSUFFISANT"
  | "PREAVIS_SUFFISANT"
  | "CIRCONSTANCE_EXTRAORDINAIRE"
  | "DISTANCE_INVALIDE"
  | "MOTIF_INCONNU";

export interface ResultatEligibilite {
  eligible: boolean;
  /** Montant estimé en euros (0 si non éligible). */
  montant: number;
  code: CodeRaison;
  /** Explication lisible (FR). */
  raison: string;
  /** Tranche de distance retenue : 250 | 400 | 600 (montant plein avant réduction). */
  montantPlein: number;
  /** true si la réduction de 50 % (long-courrier 3–4 h) a été appliquée. */
  reductionAppliquee: boolean;
}

/** Montant plein selon la distance et le caractère intra-UE. */
export function montantParDistance(distanceKm: number, intraUe: boolean): number {
  if (distanceKm <= 1500) return 250;
  if (distanceKm <= 3500) return 400;
  // > 3500 km
  return intraUe ? 400 : 600;
}

/** Indique si le motif requiert un retard à l'arrivée ≥ 3 h. */
function motifSoumisAuRetard(motif: MotifVol): boolean {
  return motif === "RETARD" || motif === "CORRESPONDANCE_MANQUEE";
}

export function evaluerEligibilite(entree: EntreeEligibilite): ResultatEligibilite {
  const {
    distanceKm,
    motif,
    dureeRetardMin,
    intraUe = false,
    preavisAnnulationJours,
    circonstanceExtraordinaire = false,
  } = entree;

  const nonEligible = (code: CodeRaison, raison: string): ResultatEligibilite => ({
    eligible: false,
    montant: 0,
    code,
    raison,
    montantPlein: 0,
    reductionAppliquee: false,
  });

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return nonEligible("DISTANCE_INVALIDE", "Distance de vol invalide.");
  }

  // Exclusion prioritaire : circonstances extraordinaires.
  if (circonstanceExtraordinaire) {
    return nonEligible(
      "CIRCONSTANCE_EXTRAORDINAIRE",
      "Indemnisation exclue : circonstances extraordinaires invoquées (à contester si non avérées).",
    );
  }

  // Conditions propres au motif.
  switch (motif) {
    case "RETARD":
    case "CORRESPONDANCE_MANQUEE": {
      const retard = dureeRetardMin ?? 0;
      if (retard < SEUIL_RETARD_MIN) {
        return nonEligible(
          "RETARD_INSUFFISANT",
          `Retard à l'arrivée de ${retard} min < ${SEUIL_RETARD_MIN} min (3 h) requis.`,
        );
      }
      break;
    }
    case "ANNULATION": {
      if (
        preavisAnnulationJours != null &&
        preavisAnnulationJours >= PREAVIS_ANNULATION_EXONERATOIRE_JOURS
      ) {
        return nonEligible(
          "PREAVIS_SUFFISANT",
          `Annulation notifiée ${preavisAnnulationJours} jours à l'avance (≥ 14 j) : pas d'indemnité.`,
        );
      }
      break;
    }
    case "SURBOOKING":
      // Refus d'embarquement involontaire : éligible sans condition de retard.
      break;
    default:
      return nonEligible("MOTIF_INCONNU", "Motif de réclamation inconnu.");
  }

  // Montant.
  const montantPlein = montantParDistance(distanceKm, intraUe);

  // Réduction 50 % : long-courrier hors UE, retard arrivée 3–4 h, motif soumis au retard.
  let montant = montantPlein;
  let reductionAppliquee = false;
  if (
    motifSoumisAuRetard(motif) &&
    distanceKm > 3500 &&
    !intraUe &&
    (dureeRetardMin ?? 0) < 240
  ) {
    montant = montantPlein / 2;
    reductionAppliquee = true;
  }

  return {
    eligible: true,
    montant,
    code: "ELIGIBLE",
    raison: reductionAppliquee
      ? `Éligible — ${montantPlein} € réduits de 50 % (long-courrier, retard 3–4 h).`
      : `Éligible — indemnité forfaitaire de ${montant} €.`,
    montantPlein,
    reductionAppliquee,
  };
}

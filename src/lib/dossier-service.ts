/**
 * Service Dossier : transitions de statut (machine à états) + journalisation
 * automatique dans HistoriqueStatut, et dérivation des montants.
 *
 * Toute évolution de statut DOIT passer par ce service : il garantit que seules
 * les transitions valides sont appliquées et qu'une ligne d'historique est
 * écrite (append-only) à chaque changement.
 */

import type { Prisma, PrismaClient, StatutDossier, AuteurHistorique } from "@prisma/client";
import { prisma } from "./prisma";
import { appliquerTransition } from "@/domain/statut";
import { repartirEuros } from "@/domain/commission";
import { emailPourStatut } from "./emails";
import { envoyerEmailDossier } from "./email-service";

type Db = PrismaClient | Prisma.TransactionClient;

/** Calcule la prochaine référence interne (AA-<année>-<seq>) pour l'année courante. */
export async function genererProchaineReference(db: Db = prisma): Promise<string> {
  // Numéro à 7 chiffres (1000000–9999999). On garantit l'unicité en vérifiant en
  // base avant attribution (et nouvel essai sur collision) ; la contrainte @unique
  // sur `reference` reste le garde-fou final. Les anciennes références AA-AAAA-xxx
  // (non numériques) ne peuvent pas entrer en collision et restent valides.
  for (let i = 0; i < 30; i++) {
    const ref = String(1000000 + Math.floor(Math.random() * 9000000));
    const existe = await db.dossier.findUnique({ where: { reference: ref } });
    if (!existe) return ref;
  }
  throw new Error("Impossible de générer une référence unique après 30 essais.");
}

export interface OptionsChangementStatut {
  auteur: AuteurHistorique;
  commentaire?: string;
  numeroDossierCompagnie?: string;
  /** Indemnité obtenue (EUR) — dérive commission30 / partClient70. */
  montantObtenu?: number;
  /** Boutons d'action rapides : autorise une transition directe (bypass machine). */
  force?: boolean;
}

/**
 * Applique un changement de statut. Lève TransitionInterditeError si la
 * transition n'est pas autorisée. Écrit l'historique dans la même transaction.
 */
export async function changerStatut(
  dossierId: string,
  nouveauStatut: StatutDossier,
  options: OptionsChangementStatut,
) {
  const maj = await prisma.$transaction(async (tx) => {
    const dossier = await tx.dossier.findUniqueOrThrow({ where: { id: dossierId } });
    const ancienStatut = dossier.statut;

    // Valide la transition (peut throw) — sauf en mode « force » (boutons rapides),
    // qui autorise toute transition directe demandée par l'admin.
    if (!options.force) {
      appliquerTransition(ancienStatut, nouveauStatut);
    }

    const data: Prisma.DossierUpdateInput = { statut: nouveauStatut };

    if (options.numeroDossierCompagnie !== undefined) {
      data.numeroDossierCompagnie = options.numeroDossierCompagnie;
    }

    // Dérivation des montants si une indemnité obtenue est fournie.
    if (options.montantObtenu !== undefined) {
      const r = repartirEuros(options.montantObtenu);
      data.montantObtenu = r.montantObtenu.toFixed(2);
      data.commission30 = r.commission.toFixed(2);
      data.partClient70 = r.partClient.toFixed(2);
    }

    // Clôture du dossier au reversement.
    if (nouveauStatut === "REVERSE") {
      data.dateCloture = new Date();
    }

    const maj = await tx.dossier.update({ where: { id: dossierId }, data });

    await tx.historiqueStatut.create({
      data: {
        dossierId,
        ancienStatut,
        nouveauStatut,
        auteur: options.auteur,
        commentaire: options.commentaire,
      },
    });

    return maj;
  });

  // Hook e-mail : après le commit, envoi automatique selon le nouveau statut.
  // envoyerEmailDossier ne lève jamais (erreurs loguées) → ne casse pas le flux.
  const typeEmail = emailPourStatut(nouveauStatut);
  if (typeEmail) {
    await envoyerEmailDossier(dossierId, typeEmail, options.commentaire);
  }

  return maj;
}

/** Met à jour uniquement le n° de dossier compagnie (sans changer de statut). */
export async function definirNumeroDossierCompagnie(dossierId: string, numero: string) {
  return prisma.dossier.update({
    where: { id: dossierId },
    data: { numeroDossierCompagnie: numero },
  });
}

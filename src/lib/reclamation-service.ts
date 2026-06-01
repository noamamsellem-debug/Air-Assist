/**
 * Service de création d'une réclamation (tunnel d'inscription, module 5).
 *
 * Orchestration : Passager + Vol (1-1) + Compagnie (rapprochée via le préfixe
 * IATA du n° de vol) + Dossier (référence auto) + MandatConsentement (signature
 * électronique via l'adaptateur e-sign) + HistoriqueStatut initial.
 *
 * Les coordonnées bancaires NE sont PAS collectées ici (côté PSP uniquement).
 */

import type { MotifVol } from "@prisma/client";
import { prisma } from "./prisma";
import { genererProchaineReference } from "./dossier-service";
import { getSignatureAdapter } from "@/adapters/esign";
import { getEmailAdapter } from "@/adapters/email";
import type { ReclamationInput } from "./validation";

export interface ResultatReclamation {
  dossierId: string;
  reference: string;
  codeParrainage: string;
}

/** Code de parrainage court et lisible (lien de partage « Gagnez 20 € »). */
function genererCodeParrainage(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Rapproche/crée la compagnie à partir du préfixe IATA du n° de vol. */
async function resoudreCompagnie(numeroVol: string, nomLisible: string) {
  const code = numeroVol.trim().slice(0, 2).toUpperCase();
  const existante = await prisma.compagnie.findUnique({ where: { codeIata: code } });
  if (existante) return existante;
  return prisma.compagnie.create({
    data: {
      nom: nomLisible || code,
      codeIata: code,
      procedure: "EMAIL",
      emailReclamation: null,
      autoActive: false,
    },
  });
}

export async function creerReclamation(
  input: ReclamationInput,
): Promise<ResultatReclamation> {
  const compagnie = await resoudreCompagnie(
    input.vol.numeroVol,
    input.vol.numeroVol.slice(0, 2),
  );

  // Référence + signature électronique du mandat (adaptateur, mock en dev).
  const reference = await genererProchaineReference();
  const esign = getSignatureAdapter();
  const contenuMandat =
    `Je soussigné(e) ${input.prenom} ${input.nom} mandate Air Assist pour réclamer en mon ` +
    `nom l'indemnité due au titre du règlement EC 261/2004 pour le vol ${input.vol.numeroVol} ` +
    `du ${input.vol.date}. Commission de 30 % en cas de succès.`;
  const preuve = await esign.signer({
    dossierReference: reference,
    nomSignataire: input.signatureNom,
    emailSignataire: input.email,
    contenuMandat,
    versionCgv: input.versionCgv,
  });

  const dossier = await prisma.$transaction(async (tx) => {
    const passager = await tx.passager.create({
      data: {
        nom: input.nom,
        prenom: input.prenom,
        email: input.email,
        telephone: input.telephone || null,
        adresse: input.adresse || null,
      },
    });

    const vol = await tx.vol.create({
      data: {
        numero: input.vol.numeroVol.toUpperCase(),
        compagnieTexte: compagnie.nom,
        date: new Date(input.vol.date),
        aeroportDepart: input.vol.aeroportDepart.toUpperCase(),
        aeroportArrivee: input.vol.aeroportArrivee.toUpperCase(),
        distanceKm: input.distanceKm,
        motif: input.vol.motif as MotifVol,
        dureeRetardMin: input.vol.dureeRetardMin ?? null,
      },
    });

    const d = await tx.dossier.create({
      data: {
        reference,
        statut: "NOUVEAU",
        passagerId: passager.id,
        volId: vol.id,
        compagnieId: compagnie.id,
        pnr: input.pnr,
        montantEstime: input.montantEstime.toFixed(2),
        dejaContacteCompagnie: input.dejaContacteCompagnie ?? null,
        descriptionIncident: input.descriptionIncident || null,
        langueCommunication: input.langueCommunication || null,
        sourceMarketing: input.sourceMarketing || null,
        causePerturbation: input.causePerturbation || null,
        ouAcheteBillet: input.ouAcheteBillet || null,
        codeParrainage: genererCodeParrainage(),
      },
    });

    await tx.mandatConsentement.create({
      data: {
        dossierId: d.id,
        signatureElectronique: preuve.signatureId,
        consentementRgpd: input.consentementRgpd,
        horodatage: new Date(preuve.horodatage),
        preuve: preuve.preuve,
        versionCgvAcceptee: input.versionCgv,
      },
    });

    await tx.historiqueStatut.create({
      data: {
        dossierId: d.id,
        ancienStatut: null,
        nouveauStatut: "NOUVEAU",
        auteur: "SYSTEME",
        commentaire: "Dossier créé via le tunnel d'inscription",
      },
    });

    return d;
  });

  // Réponse automatique au client (adaptateur e-mail, mock en dev).
  try {
    const email = getEmailAdapter();
    await email.envoyer({
      de: process.env.EMAIL_FROM ?? "reclamations@air-assist.example",
      a: input.email,
      sujet: `Votre réclamation ${reference} est bien enregistrée`,
      texte:
        `Bonjour ${input.prenom},\n\nNous avons bien reçu votre demande. ` +
        `Votre numéro de dossier est ${reference}. Nous revenons vers vous rapidement.\n\n` +
        `L'équipe Air Assist`,
      enTetes: { "X-Dossier": reference },
    });
  } catch {
    // L'envoi d'e-mail ne doit jamais bloquer la création du dossier.
  }

  return { dossierId: dossier.id, reference, codeParrainage: dossier.codeParrainage! };
}

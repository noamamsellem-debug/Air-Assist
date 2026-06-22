/**
 * Création d'un dossier via le tunnel refondu (dépôt complet).
 *
 * Rejoue le `depotSchema` côté serveur (la route le valide), crée le passager
 * (identité + adresse structurée), le vol (trajet entier), le dossier (segments
 * JSON), le mandat horodaté (IP + version CGV), les documents chiffrés au repos
 * (type + sousType), l'historique, puis envoie l'e-mail de confirmation.
 *
 * Pas d'IBAN ici (coordonnées bancaires via le PSP en phase 2).
 * TODO: signature eIDAS réelle — point d'extension via l'adaptateur e-sign.
 */
import type { MotifVol, TypeDocument, SousTypeDocument } from "@prisma/client";
import { prisma } from "./prisma";
import { genererProchaineReference } from "./dossier-service";
import { getSignatureAdapter } from "@/adapters/esign";
import { getEmailAdapter } from "@/adapters/email";
import { chiffrerDocument } from "./crypto";
import type { DepotInput } from "./validation";

const TAILLE_MAX_OCTETS = 8 * 1024 * 1024;

async function resoudreCompagnie(numeroVol: string, nomLisible: string) {
  const code = numeroVol.trim().slice(0, 2).toUpperCase();
  const existante = await prisma.compagnie.findUnique({ where: { codeIata: code } });
  if (existante) return existante;
  return prisma.compagnie.create({
    data: { nom: nomLisible || code, codeIata: code, autoActive: false },
  });
}

export interface ResultatDepot {
  dossierId: string;
  reference: string;
}

export async function creerDepot(
  input: DepotInput,
  meta: { ip?: string | null } = {},
): Promise<ResultatDepot> {
  const premier = input.segments[0]!;
  const final = input.segments[input.segments.length - 1]!;
  const compagnie = await resoudreCompagnie(
    premier.numeroVol,
    premier.compagnie || premier.numeroVol.slice(0, 2),
  );

  const reference = await genererProchaineReference();
  const nomComplet = `${input.passager.prenom} ${input.passager.nom}`.trim();
  // Nom tapé par le passager pour signer (sinon repli sur l'identité).
  const nomSignature = input.nomSignature?.trim() || nomComplet;
  const esign = getSignatureAdapter();
  const preuve = await esign.signer({
    dossierReference: reference,
    nomSignataire: nomSignature,
    emailSignataire: input.email,
    contenuMandat:
      `Je soussigné(e) ${nomComplet} mandate Air Assist pour réclamer en mon nom ` +
      `l'indemnité due au titre du règlement EC 261/2004 pour le trajet ${premier.aeroportDepart} → ` +
      `${final.aeroportArrivee} (vol ${premier.numeroVol}). Commission de 30 % en cas de succès.`,
    versionCgv: input.versionCgv,
  });

  const adr = input.passager.adresse;

  const documents: { type: TypeDocument; sousType: SousTypeDocument | null; f: { nomFichier: string; mimeType: string; contenuBase64: string } }[] = [
    { type: "PIECE_IDENTITE", sousType: input.pieceIdentite.sousType, f: input.pieceIdentite },
    ...input.justificatifsVoyage.map((j) => ({
      type: "JUSTIFICATIF_VOYAGE" as TypeDocument,
      sousType: j.sousType as SousTypeDocument,
      f: j,
    })),
  ];
  if (input.justificatifRetard) {
    documents.push({ type: "JUSTIFICATIF_RETARD", sousType: null, f: input.justificatifRetard });
  }

  const dossier = await prisma.$transaction(async (tx) => {
    const passager = await tx.passager.create({
      data: {
        civilite: input.passager.civilite,
        nom: input.passager.nom,
        prenom: input.passager.prenom,
        dateNaissance: new Date(input.passager.dateNaissance),
        nationalite: input.passager.nationalite,
        email: input.email,
        telephone: input.telephone,
        adresse: [adr.ligne1, adr.complement, adr.codePostal, adr.ville, adr.pays].filter(Boolean).join(", "),
        adresseLigne1: adr.ligne1,
        adresseComplement: adr.complement || null,
        codePostal: adr.codePostal,
        ville: adr.ville,
        pays: adr.pays,
      },
    });

    const vol = await tx.vol.create({
      data: {
        numero: premier.numeroVol.toUpperCase(),
        compagnieTexte: compagnie.nom,
        date: new Date(premier.date),
        aeroportDepart: premier.aeroportDepart.toUpperCase(),
        aeroportArrivee: final.aeroportArrivee.toUpperCase(),
        distanceKm: input.distanceKm,
        motif: input.motif as MotifVol,
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
        typeTrajet: input.typeTrajet,
        reservationUnique: input.reservationUnique ?? null,
        segments: input.segments,
        descriptionIncident: input.descriptionIncident || null,
        causePerturbation: input.causePerturbation || null,
        // Objet { nbPassagers, additionnels } ; l'admin lit aussi l'ancien format tableau.
        passagersSupplementaires: {
          nbPassagers: input.nbPassagers,
          additionnels: input.passagersSupplementaires ?? [],
        },
      },
    });

    await tx.mandatConsentement.create({
      data: {
        dossierId: d.id,
        signatureElectronique: preuve.signatureId,
        consentementRgpd: input.consentementRgpd,
        horodatage: new Date(preuve.horodatage),
        preuve: JSON.stringify({ preuveSignature: preuve.preuve, nomSignature, ip: meta.ip ?? null, versionCgv: input.versionCgv }),
        versionCgvAcceptee: input.versionCgv,
      },
    });

    for (const doc of documents) {
      const brut = Buffer.from(doc.f.contenuBase64, "base64");
      if (brut.length === 0 || brut.length > TAILLE_MAX_OCTETS) continue;
      const { contenuChiffre, iv, authTag } = chiffrerDocument(brut);
      await tx.document.create({
        data: {
          dossierId: d.id,
          type: doc.type,
          sousType: doc.sousType,
          nomFichier: doc.f.nomFichier,
          mimeType: doc.f.mimeType,
          tailleOctets: brut.length,
          contenuChiffre: new Uint8Array(contenuChiffre),
          iv: new Uint8Array(iv),
          authTag: new Uint8Array(authTag),
        },
      });
    }

    await tx.historiqueStatut.create({
      data: {
        dossierId: d.id,
        ancienStatut: null,
        nouveauStatut: "NOUVEAU",
        auteur: "SYSTEME",
        commentaire: "Dossier créé via le tunnel de dépôt",
      },
    });

    return d;
  });

  try {
    const email = getEmailAdapter();
    await email.envoyer({
      de: process.env.EMAIL_FROM ?? "reclamations@air-assist.example",
      a: input.email,
      sujet: `Votre dossier ${reference} est bien enregistré`,
      texte:
        `Bonjour ${input.passager.prenom},\n\nNous avons bien reçu votre demande d'indemnisation. ` +
        `Votre numéro de dossier est ${reference}. Suivez son avancement à tout moment depuis la page de suivi.\n\n` +
        `L'équipe Air Assist`,
      enTetes: { "X-Dossier": reference },
    });
  } catch {
    // L'e-mail ne doit jamais bloquer la création du dossier.
  }

  return { dossierId: dossier.id, reference };
}

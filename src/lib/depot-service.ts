/**
 * Création d'un dossier via le tunnel refondu.
 *
 * Découpage anti-limite (4,5 Mo/requête serverless) :
 *  - `creerDepot` crée le passager, le vol, le dossier (segments JSON), le mandat
 *    horodaté (IP + version CGV) et l'historique, puis envoie l'e-mail. SANS fichiers.
 *  - `ajouterDocument` téléverse UN document (chiffré au repos AES-256-GCM), dans une
 *    requête séparée et légère.
 *
 * Pas d'IBAN ici (coordonnées bancaires via le PSP en phase 2).
 * TODO: signature eIDAS réelle — point d'extension via l'adaptateur e-sign.
 */
import type { MotifVol, TypeDocument, SousTypeDocument } from "@prisma/client";
import { prisma } from "./prisma";
import { genererProchaineReference } from "./dossier-service";
import { getSignatureAdapter } from "@/adapters/esign";
import { envoyerEmailDossier, envoyerNotificationNouveauDossier } from "./email-service";
import { chiffrerDocument } from "./crypto";
import type { DepotInput, DocumentMetaInput } from "./validation";

// Plafond par document. La limite réelle est celle du corps serverless Vercel
// (~4,5 Mo) ; on reste en deçà. Les images sont compressées côté client.
const TAILLE_MAX_OCTETS = 4.4 * 1024 * 1024;

/** Erreur métier avec code HTTP pour la route. */
export class DepotError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

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
        dureeRetardMin: input.dureeRetardMin ?? null,
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
        sourceMarketing: input.sourceMarketing || null,
        dejaContacteCompagnie: input.dejaContacteCompagnie ?? null,
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

  // E-mail 1 (accusé de réception au client) + notification interne (admin).
  await envoyerEmailDossier(dossier.id, "ACCUSE_RECEPTION");
  await envoyerNotificationNouveauDossier(dossier.id);

  return { dossierId: dossier.id, reference };
}

/**
 * Téléverse UN document pour un dossier existant (requête séparée < 4,5 Mo).
 * Le `dossierId` (cuid non devinable) sert de capacité pour cette fenêtre de
 * dépôt ; l'ajout n'est permis que tant que le dossier est au statut NOUVEAU.
 */
export async function ajouterDocument(
  dossierId: string,
  meta: DocumentMetaInput,
  contenu: Buffer,
): Promise<{ documentId: string }> {
  const dossier = await prisma.dossier.findUnique({
    where: { id: dossierId },
    select: { id: true, statut: true, _count: { select: { documents: true } } },
  });
  if (!dossier) throw new DepotError("Dossier introuvable.", 404);
  if (dossier.statut !== "NOUVEAU") throw new DepotError("Dossier non modifiable.", 409);
  if (dossier._count.documents >= 20) throw new DepotError("Trop de documents.", 409);

  if (contenu.length === 0) throw new DepotError("Fichier vide.", 400);
  if (contenu.length > TAILLE_MAX_OCTETS) throw new DepotError("Fichier trop volumineux.", 413);

  const doc = meta;
  const brut = contenu;
  const { contenuChiffre, iv, authTag } = chiffrerDocument(brut);
  const created = await prisma.document.create({
    data: {
      dossierId,
      type: doc.type as TypeDocument,
      sousType: (doc.sousType ?? null) as SousTypeDocument | null,
      nomFichier: doc.nomFichier,
      mimeType: doc.mimeType,
      tailleOctets: brut.length,
      contenuChiffre: new Uint8Array(contenuChiffre),
      iv: new Uint8Array(iv),
      authTag: new Uint8Array(authTag),
    },
  });
  return { documentId: created.id };
}

/**
 * Téléverse un document depuis l'espace de SUIVI public : le client s'identifie
 * par sa référence + son e-mail (doivent correspondre). Autorisé tant que le
 * dossier est NOUVEAU ou DOCUMENT_MANQUANT. Chiffré au repos. Le document apparaît
 * ensuite dans la fiche admin.
 */
export async function ajouterDocumentParSuivi(
  reference: string,
  email: string,
  meta: DocumentMetaInput,
  contenu: Buffer,
): Promise<{ documentId: string }> {
  const dossier = await prisma.dossier.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: { passager: { select: { email: true } }, _count: { select: { documents: true } } },
  });
  if (!dossier || dossier.passager.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new DepotError("Dossier introuvable.", 404);
  }
  if (dossier.statut !== "NOUVEAU" && dossier.statut !== "DOCUMENT_MANQUANT") {
    throw new DepotError("Ce dossier n'accepte plus l'ajout de documents.", 409);
  }
  if (dossier._count.documents >= 30) throw new DepotError("Trop de documents.", 409);
  if (contenu.length === 0) throw new DepotError("Fichier vide.", 400);
  if (contenu.length > TAILLE_MAX_OCTETS) throw new DepotError("Fichier trop volumineux.", 413);

  const { contenuChiffre, iv, authTag } = chiffrerDocument(contenu);
  const created = await prisma.document.create({
    data: {
      dossierId: dossier.id,
      type: meta.type as TypeDocument,
      sousType: (meta.sousType ?? null) as SousTypeDocument | null,
      nomFichier: meta.nomFichier,
      mimeType: meta.mimeType,
      tailleOctets: contenu.length,
      contenuChiffre: new Uint8Array(contenuChiffre),
      iv: new Uint8Array(iv),
      authTag: new Uint8Array(authTag),
    },
  });
  return { documentId: created.id };
}

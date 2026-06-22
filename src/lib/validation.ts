/**
 * Schémas Zod partagés (formulaires publics + API).
 */
import { z } from "zod";

export const motifSchema = z.enum([
  "RETARD",
  "ANNULATION",
  "SURBOOKING",
  "CORRESPONDANCE_MANQUEE",
]);

export const eligibiliteSchema = z.object({
  numeroVol: z
    .string()
    .trim()
    .min(3)
    .max(8)
    .regex(/^[A-Za-z0-9]+$/, "Numéro de vol invalide"),
  date: z.string().min(1),
  aeroportDepart: z.string().trim().length(3),
  aeroportArrivee: z.string().trim().length(3),
  motif: motifSchema,
  dureeRetardMin: z.coerce.number().int().min(0).max(100000).optional(),
});

export type EligibiliteInput = z.infer<typeof eligibiliteSchema>;

// PNR : 6 caractères alphanumériques (record locator).
export const pnrSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/, "PNR invalide (6 caractères alphanumériques).");

export const reclamationSchema = z.object({
  // Vol / éligibilité
  vol: eligibiliteSchema,
  distanceKm: z.coerce.number().int().positive(),
  intraUe: z.boolean(),
  montantEstime: z.coerce.number().nonnegative(),
  // Passager
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  telephone: z.string().trim().max(40).optional().or(z.literal("")),
  adresse: z.string().trim().max(300).optional().or(z.literal("")),
  pnr: pnrSchema,
  // Informations facultatives recueillies par le tunnel
  dejaContacteCompagnie: z.boolean().optional(),
  descriptionIncident: z.string().trim().max(1200).optional().or(z.literal("")),
  langueCommunication: z.string().trim().max(40).optional().or(z.literal("")),
  sourceMarketing: z.string().trim().max(60).optional().or(z.literal("")),
  causePerturbation: z.string().trim().max(60).optional().or(z.literal("")),
  ouAcheteBillet: z.string().trim().max(60).optional().or(z.literal("")),
  // Co-passagers (chacun pouvant aussi prétendre à une indemnité)
  passagersSupplementaires: z
    .array(
      z.object({
        prenom: z.string().trim().min(1).max(100),
        nom: z.string().trim().min(1).max(100),
        email: z.string().trim().email().optional().or(z.literal("")),
        mineur: z.boolean().optional(),
      }),
    )
    .max(20)
    .optional(),
  // Mandat / consentement
  consentementRgpd: z.literal(true),
  accepteCgv: z.literal(true),
  signatureNom: z.string().trim().min(2, "Signature requise."),
  versionCgv: z.string().default("2026-01-v1"),
});

export type ReclamationInput = z.infer<typeof reclamationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Dépôt de dossier (tunnel refondu) — schéma UNIQUE partagé front/back.
// « Aucune donnée manquante ne doit pouvoir passer » : tous les champs
// obligatoires sont requis ici et rejoués côté serveur.
// ─────────────────────────────────────────────────────────────────────────────

export const civiliteSchema = z.enum(["M", "Mme", "Autre"]);
export const typeTrajetSchema = z.enum(["DIRECT", "CORRESPONDANCE"]);
export const sousTypePieceIdentiteSchema = z.enum(["CNI", "PASSEPORT", "PERMIS_CONDUIRE", "CARTE_SEJOUR"]);
export const sousTypeJustificatifVoyageSchema = z.enum(["CARTE_EMBARQUEMENT", "CONFIRMATION_RESERVATION"]);

export const adresseSchema = z.object({
  ligne1: z.string().trim().min(1, "Adresse requise.").max(200),
  complement: z.string().trim().max(200).optional().or(z.literal("")),
  codePostal: z.string().trim().min(1, "Code postal requis.").max(20),
  ville: z.string().trim().min(1, "Ville requise.").max(120),
  pays: z.string().trim().min(1, "Pays requis.").max(80),
});

export const segmentSchema = z.object({
  ordre: z.coerce.number().int().positive(),
  numeroVol: z.string().trim().min(2).max(8).regex(/^[A-Za-z0-9]+$/, "Numéro de vol invalide."),
  compagnie: z.string().trim().min(1, "Compagnie requise.").max(120),
  date: z.string().min(1, "Date requise."),
  aeroportDepart: z.string().trim().length(3, "Aéroport de départ invalide."),
  aeroportArrivee: z.string().trim().length(3, "Aéroport d'arrivée invalide."),
});

const fichierSchema = z.object({
  nomFichier: z.string().trim().min(1).max(255),
  mimeType: z
    .string()
    .regex(/^(image\/(jpeg|png|webp)|application\/pdf)$/, "Format non pris en charge (JPG, PNG ou PDF)."),
  contenuBase64: z.string().min(1, "Fichier manquant."),
});

export const depotSchema = z
  .object({
    // Éligibilité / montant (issus de l'étape 1)
    montantEstime: z.coerce.number().nonnegative(),
    distanceKm: z.coerce.number().int().positive(),
    intraUe: z.boolean(),
    // Vol / trajet
    typeTrajet: typeTrajetSchema,
    reservationUnique: z.boolean().nullable(),
    pnr: pnrSchema,
    motif: motifSchema,
    segments: z.array(segmentSchema).min(1, "Au moins un vol est requis."),
    // Identité du passager
    passager: z.object({
      civilite: civiliteSchema,
      nom: z.string().trim().min(1, "Nom requis.").max(100),
      prenom: z.string().trim().min(1, "Prénom requis.").max(100),
      dateNaissance: z.string().min(1, "Date de naissance requise."),
      nationalite: z.string().trim().min(1, "Nationalité requise.").max(80),
      adresse: adresseSchema,
    }),
    // Coordonnées
    email: z.string().trim().email("E-mail invalide."),
    telephone: z.string().trim().min(5, "Téléphone requis.").max(40),
    // Bénéficiaire : nombre total de passagers (obligatoire) + co-passagers (facultatif).
    nbPassagers: z.coerce.number().int().min(1, "Au moins un passager.").max(9, "Maximum 9 passagers."),
    passagersSupplementaires: z
      .array(
        z.object({
          prenom: z.string().trim().min(1).max(100),
          nom: z.string().trim().min(1).max(100),
          email: z.string().trim().email().optional().or(z.literal("")),
          mineur: z.boolean().optional(),
        }),
      )
      .max(8)
      .optional()
      .default([]),
    // NB : les documents ne sont PAS envoyés ici. Ils sont téléversés un par un
    // après création du dossier (POST /api/depot/[id]/document) pour rester sous
    // la limite de 4,5 Mo par requête serverless. Voir documentUploadSchema.
    // Facultatif
    descriptionIncident: z.string().trim().max(1200).optional().or(z.literal("")),
    // Motif invoqué par la compagnie (facultatif) → Dossier.causePerturbation.
    causePerturbation: z.string().trim().max(120).optional().or(z.literal("")),
    // Mandat + consentement
    nomSignature: z.string().trim().min(1, "Signature (nom complet) requise.").max(120),
    consentementRgpd: z.literal(true),
    accepteCgv: z.literal(true),
    versionCgv: z.string().default("2026-01-v1"),
  })
  .superRefine((d, ctx) => {
    if ((d.passagersSupplementaires?.length ?? 0) > d.nbPassagers - 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passagersSupplementaires"],
        message: "Plus de co-passagers que le nombre total de passagers déclaré.",
      });
    }
    if (d.typeTrajet === "CORRESPONDANCE") {
      if (d.segments.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["segments"], message: "Une correspondance nécessite au moins 2 vols." });
      }
      if (typeof d.reservationUnique !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reservationUnique"],
          message: "Précisez si tous les vols sont sur la même réservation (PNR).",
        });
      }
    }
  });

export type DepotInput = z.infer<typeof depotSchema>;

/**
 * Upload d'UN document, après création du dossier (requête séparée < 4,5 Mo).
 * Chiffré au repos côté serveur. sousType selon la catégorie.
 */
export const documentUploadSchema = fichierSchema.extend({
  type: z.enum(["PIECE_IDENTITE", "JUSTIFICATIF_VOYAGE", "JUSTIFICATIF_RETARD", "AUTRE"]),
  sousType: z
    .enum([
      "CNI",
      "PASSEPORT",
      "PERMIS_CONDUIRE",
      "CARTE_SEJOUR",
      "CARTE_EMBARQUEMENT",
      "CONFIRMATION_RESERVATION",
      "JUSTIFICATIF_FRAIS",
    ])
    .nullable()
    .optional(),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;


export const changementStatutSchema = z.object({
  nouveauStatut: z.enum([
    "NOUVEAU",
    "VERIFIE",
    "RECLAMATION_ENVOYEE",
    "ACCUSE_RECU",
    "EN_NEGOCIATION",
    "ACCEPTE",
    "PAYE",
    "REVERSE",
    "REFUSE",
    "CONTENTIEUX",
  ]),
  commentaire: z.string().trim().max(1000).optional(),
  numeroDossierCompagnie: z.string().trim().max(100).optional(),
  montantObtenu: z.coerce.number().nonnegative().optional(),
});

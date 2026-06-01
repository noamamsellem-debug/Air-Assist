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

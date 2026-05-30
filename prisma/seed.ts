/**
 * Seed de développement — données fictives pour faire tourner le parcours en local.
 *
 * Contenu : quelques compagnies, des passagers, des vols, et des dossiers à
 * différents stades. Les dossiers payés/reversés ont leurs montants dérivés
 * (commission 30 % / part client 70 %) calculés — jamais saisis à la main.
 */

import { PrismaClient, MotifVol, ProcedureCompagnie, StatutDossier, AuteurHistorique } from "@prisma/client";
import { repartirEuros } from "../src/domain/commission";
import { genererReferenceDossier } from "../src/domain/reference";

const prisma = new PrismaClient();

/** Champs montants dérivés à partir d'une indemnité obtenue (ou null si pas encore obtenue). */
function montantsDeriv(montantObtenu: number | null) {
  if (montantObtenu === null) {
    return { montantObtenu: null, commission30: null, partClient70: null };
  }
  const r = repartirEuros(montantObtenu);
  return {
    montantObtenu: r.montantObtenu.toFixed(2),
    commission30: r.commission.toFixed(2),
    partClient70: r.partClient.toFixed(2),
  };
}

async function main() {
  console.log("🌱 Nettoyage…");
  // Ordre de suppression respectant les FK.
  await prisma.historiqueStatut.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.mandatConsentement.deleteMany();
  await prisma.document.deleteMany();
  await prisma.dossier.deleteMany();
  await prisma.vol.deleteMany();
  await prisma.passager.deleteMany();
  await prisma.compagnie.deleteMany();
  await prisma.utilisateur.deleteMany();

  console.log("🏢 Compagnies…");
  const af = await prisma.compagnie.create({
    data: {
      nom: "Air France",
      codeIata: "AF",
      procedure: ProcedureCompagnie.EMAIL,
      emailReclamation: "reclamations@airfrance.example",
      delaiMoyenReponseJours: 45,
      autoActive: false,
    },
  });
  const ryan = await prisma.compagnie.create({
    data: {
      nom: "Ryanair",
      codeIata: "FR",
      procedure: ProcedureCompagnie.FORMULAIRE,
      urlFormulaire: "https://help.ryanair.example/eu261",
      delaiMoyenReponseJours: 60,
      autoActive: false,
    },
  });
  const lh = await prisma.compagnie.create({
    data: {
      nom: "Lufthansa",
      codeIata: "LH",
      procedure: ProcedureCompagnie.EMAIL,
      emailReclamation: "feedback@lufthansa.example",
      delaiMoyenReponseJours: 50,
      autoActive: true, // full-auto activé pour cette compagnie
    },
  });

  console.log("👤 Utilisateurs CRM…");
  await prisma.utilisateur.createMany({
    data: [
      { email: "admin@air-assist.example", nom: "Admin Démo", role: "ADMIN" },
      { email: "agent@air-assist.example", nom: "Agent Démo", role: "AGENT" },
    ],
  });

  console.log("🧑‍✈️ Passagers + vols + dossiers…");

  // Helper : crée un dossier complet (passager, vol, mandat, historique).
  let sequence = 0;
  async function creerDossier(opts: {
    passager: { nom: string; prenom: string; email: string };
    vol: {
      numero: string;
      compagnieTexte: string;
      date: Date;
      dep: string;
      arr: string;
      distanceKm: number;
      motif: MotifVol;
      dureeRetardMin: number | null;
    };
    compagnieId: string;
    statut: StatutDossier;
    montantEstime: number;
    montantObtenu: number | null;
    pnr: string;
    numeroDossierCompagnie?: string;
  }) {
    sequence += 1;
    const reference = genererReferenceDossier(2026, sequence);
    const passager = await prisma.passager.create({ data: opts.passager });
    const vol = await prisma.vol.create({
      data: {
        numero: opts.vol.numero,
        compagnieTexte: opts.vol.compagnieTexte,
        date: opts.vol.date,
        aeroportDepart: opts.vol.dep,
        aeroportArrivee: opts.vol.arr,
        distanceKm: opts.vol.distanceKm,
        motif: opts.vol.motif,
        dureeRetardMin: opts.vol.dureeRetardMin,
      },
    });
    const m = montantsDeriv(opts.montantObtenu);
    const dossier = await prisma.dossier.create({
      data: {
        reference,
        statut: opts.statut,
        passagerId: passager.id,
        volId: vol.id,
        compagnieId: opts.compagnieId,
        pnr: opts.pnr,
        numeroDossierCompagnie: opts.numeroDossierCompagnie ?? null,
        montantEstime: opts.montantEstime.toFixed(2),
        montantObtenu: m.montantObtenu,
        commission30: m.commission30,
        partClient70: m.partClient70,
        dateCloture: opts.statut === StatutDossier.REVERSE ? new Date() : null,
      },
    });
    // Mandat + consentement RGPD (mock de preuve eIDAS).
    await prisma.mandatConsentement.create({
      data: {
        dossierId: dossier.id,
        signatureElectronique: `mock-sig-${dossier.id}`,
        consentementRgpd: true,
        preuve: JSON.stringify({ provider: "mock", hash: `sha256:${dossier.id}` }),
        versionCgvAcceptee: "2026-01-v1",
      },
    });
    // Historique : création initiale.
    await prisma.historiqueStatut.create({
      data: {
        dossierId: dossier.id,
        ancienStatut: null,
        nouveauStatut: StatutDossier.NOUVEAU,
        auteur: AuteurHistorique.SYSTEME,
        commentaire: "Dossier créé (seed)",
      },
    });
    // Si le statut cible n'est pas NOUVEAU, on journalise une transition de plus.
    if (opts.statut !== StatutDossier.NOUVEAU) {
      await prisma.historiqueStatut.create({
        data: {
          dossierId: dossier.id,
          ancienStatut: StatutDossier.NOUVEAU,
          nouveauStatut: opts.statut,
          auteur: AuteurHistorique.SYSTEME,
          commentaire: "Statut positionné (seed)",
        },
      });
    }
    return dossier;
  }

  // Dossier 1 — court-courrier intra-UE, retard 4h, en cours.
  await creerDossier({
    passager: { nom: "Martin", prenom: "Camille", email: "camille.martin@example.com" },
    vol: {
      numero: "AF1234",
      compagnieTexte: "Air France",
      date: new Date("2026-03-12T08:00:00Z"),
      dep: "CDG",
      arr: "LIS", // ~1450 km
      distanceKm: 1454,
      motif: MotifVol.RETARD,
      dureeRetardMin: 245,
    },
    compagnieId: af.id,
    statut: StatutDossier.EN_NEGOCIATION,
    montantEstime: 250,
    montantObtenu: null,
    pnr: "ABC123",
    numeroDossierCompagnie: "AF-CLAIM-99812",
  });

  // Dossier 2 — moyen-courrier, annulation, payé puis reversé.
  await creerDossier({
    passager: { nom: "Dubois", prenom: "Léa", email: "lea.dubois@example.com" },
    vol: {
      numero: "FR8021",
      compagnieTexte: "Ryanair",
      date: new Date("2026-02-02T15:30:00Z"),
      dep: "BVA",
      arr: "ATH", // ~2100 km
      distanceKm: 2095,
      motif: MotifVol.ANNULATION,
      dureeRetardMin: null,
    },
    compagnieId: ryan.id,
    statut: StatutDossier.REVERSE,
    montantEstime: 400,
    montantObtenu: 400,
    pnr: "RYN456",
    numeroDossierCompagnie: "FR-2026-55012",
  });

  // Dossier 3 — long-courrier, surbooking, accepté (paiement à venir).
  await creerDossier({
    passager: { nom: "Nguyen", prenom: "Hugo", email: "hugo.nguyen@example.com" },
    vol: {
      numero: "LH400",
      compagnieTexte: "Lufthansa",
      date: new Date("2026-04-20T10:15:00Z"),
      dep: "FRA",
      arr: "JFK", // ~6200 km
      distanceKm: 6206,
      motif: MotifVol.SURBOOKING,
      dureeRetardMin: null,
    },
    compagnieId: lh.id,
    statut: StatutDossier.ACCEPTE,
    montantEstime: 600,
    montantObtenu: null,
    pnr: "LHX789",
    numeroDossierCompagnie: "LH-DE-77321",
  });

  // Dossier 4 — nouveau, à vérifier.
  await creerDossier({
    passager: { nom: "Garcia", prenom: "Sofia", email: "sofia.garcia@example.com" },
    vol: {
      numero: "AF7788",
      compagnieTexte: "Air France",
      date: new Date("2026-05-01T06:00:00Z"),
      dep: "ORY",
      arr: "TLS", // ~580 km
      distanceKm: 577,
      motif: MotifVol.RETARD,
      dureeRetardMin: 190,
    },
    compagnieId: af.id,
    statut: StatutDossier.NOUVEAU,
    montantEstime: 250,
    montantObtenu: null,
    pnr: "AFQ321",
  });

  const nbDossiers = await prisma.dossier.count();
  const nbCompagnies = await prisma.compagnie.count();
  console.log(`✅ Seed terminé : ${nbCompagnies} compagnies, ${nbDossiers} dossiers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

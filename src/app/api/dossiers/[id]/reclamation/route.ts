import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genererReclamation, type LangueReclamation } from "@/lib/claim-template";
import { dateCourte } from "@/lib/format";
import { changerStatut } from "@/lib/dossier-service";
import { getEmailAdapter } from "@/adapters/email";
import { MOTIF_LIBELLES } from "@/domain/motif";

async function chargerDonnees(id: string, langue: LangueReclamation) {
  const d = await prisma.dossier.findUnique({
    where: { id },
    include: { passager: true, vol: true, compagnie: true, documents: true, mandat: true },
  });
  if (!d) return null;
  const pieces: string[] = [];
  if (d.mandat) pieces.push("Mandat signé");
  for (const doc of d.documents) {
    pieces.push(doc.type === "CARTE_EMBARQUEMENT" ? "Carte d'embarquement" : "Justificatif");
  }
  const contenu = genererReclamation(
    {
      reference: d.reference,
      passagerNom: d.passager.nom,
      passagerPrenom: d.passager.prenom,
      compagnieNom: d.compagnie.nom,
      numeroVol: d.vol.numero,
      dateVol: dateCourte(d.vol.date),
      aeroportDepart: d.vol.aeroportDepart,
      aeroportArrivee: d.vol.aeroportArrivee,
      pnr: d.pnr,
      montantReclame: Number(d.montantEstime),
      motif: MOTIF_LIBELLES[d.vol.motif],
      pieces,
    },
    langue,
  );
  return { dossier: d, contenu };
}

function langueDepuis(url: string): LangueReclamation {
  const l = new URL(url).searchParams.get("langue");
  return l === "en" || l === "es" ? l : "fr";
}

/** Prévisualisation du contenu de la réclamation (validation humaine). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const data = await chargerDonnees(id, langueDepuis(request.url));
  if (!data) return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  return NextResponse.json(data.contenu);
}

/** Envoi (semi-auto : un clic) : envoie le message et passe en « Réclamation envoyée ». */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const data = await chargerDonnees(id, langueDepuis(request.url));
  if (!data) return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });

  const { dossier, contenu } = data;
  const destinataire =
    dossier.compagnie.emailReclamation ?? `reclamations+${dossier.compagnie.codeIata}@example.com`;

  try {
    const email = getEmailAdapter();
    await email.envoyer({
      de: process.env.EMAIL_FROM ?? "reclamations@air-assist.example",
      a: destinataire,
      sujet: contenu.sujet,
      texte: contenu.corps,
      enTetes: { "X-Dossier": dossier.reference },
    });
  } catch (err) {
    console.error("Échec envoi réclamation", err);
    return NextResponse.json({ error: "Envoi e-mail impossible" }, { status: 502 });
  }

  // Transition VERIFIE → RECLAMATION_ENVOYEE si applicable.
  if (dossier.statut === "VERIFIE") {
    await changerStatut(id, "RECLAMATION_ENVOYEE", {
      auteur: "UTILISATEUR",
      commentaire: `Réclamation envoyée à ${destinataire}`,
    });
  }

  return NextResponse.json({ ok: true, destinataire });
}

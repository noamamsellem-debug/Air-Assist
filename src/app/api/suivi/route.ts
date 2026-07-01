import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { LIBELLES_STATUT } from "@/domain/statut";

// Suivi public d'un dossier : référence + e-mail (doivent correspondre).
// Aucune donnée sensible n'est renvoyée ; on ne révèle pas si la référence
// existe quand l'e-mail ne correspond pas (réponse 404 générique).
const schema = z.object({
  reference: z.string().trim().min(3).max(40),
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 422 });
  }
  const { reference, email } = parsed.data;

  const dossier = await prisma.dossier.findUnique({
    where: { reference: reference.toUpperCase() },
    include: {
      passager: true,
      vol: true,
      historique: { where: { nouveauStatut: "DOCUMENT_MANQUANT" }, orderBy: { date: "desc" }, take: 1 },
    },
  });

  // Un dossier en corbeille est considéré comme introuvable côté public.
  if (!dossier || dossier.supprimeLe || dossier.passager.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  }

  // Documents demandés (un par ligne) si le dossier est en attente de pièces.
  const documentsManquants =
    dossier.statut === "DOCUMENT_MANQUANT"
      ? (dossier.historique[0]?.commentaire ?? "").split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

  return NextResponse.json({
    reference: dossier.reference,
    statut: dossier.statut,
    libelle: LIBELLES_STATUT[dossier.statut],
    documentsManquants,
    montantEstime: Number(dossier.montantEstime),
    dateCreation: dossier.dateCreation.toISOString(),
    vol: {
      numero: dossier.vol.numero,
      date: dossier.vol.date.toISOString(),
      depart: dossier.vol.aeroportDepart,
      arrivee: dossier.vol.aeroportArrivee,
    },
  });
}

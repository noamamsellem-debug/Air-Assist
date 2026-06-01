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
    include: { passager: true, vol: true },
  });

  if (!dossier || dossier.passager.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    reference: dossier.reference,
    statut: dossier.statut,
    libelle: LIBELLES_STATUT[dossier.statut],
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

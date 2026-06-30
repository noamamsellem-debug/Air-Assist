import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailDossier } from "@/lib/email-service";

/**
 * Relance manuelle « document manquant » (admin) : renvoie l'e-mail de relance
 * SANS changer le statut. Le cron quotidien fait la relance auto en plus.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;

  const dossier = await prisma.dossier.findUnique({
    where: { id },
    include: {
      passager: { select: { email: true } },
      historique: {
        where: { nouveauStatut: "DOCUMENT_MANQUANT" },
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });
  if (!dossier) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  if (dossier.statut !== "DOCUMENT_MANQUANT") {
    return NextResponse.json(
      { error: "La relance n'est possible que sur un dossier « Document manquant »." },
      { status: 409 },
    );
  }

  const commentaire = dossier.historique[0]?.commentaire ?? undefined;
  const ok = await envoyerEmailDossier(id, "RELANCE_DOCUMENT", commentaire);
  if (!ok) {
    return NextResponse.json({ error: "Échec de l'envoi de la relance." }, { status: 502 });
  }

  await prisma.dossier.update({ where: { id }, data: { relanceDocumentLe: new Date() } });
  return NextResponse.json({ ok: true, email: dossier.passager.email });
}

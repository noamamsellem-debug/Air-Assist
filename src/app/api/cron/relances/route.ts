import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { envoyerEmailDossier } from "@/lib/email-service";

/**
 * Cron (Vercel) : relance « document manquant » après 3 jours sans réception.
 * Vercel envoie automatiquement `Authorization: Bearer <CRON_SECRET>` quand la
 * variable CRON_SECRET est définie — on la vérifie pour interdire tout appel externe.
 * Anti-doublon via Dossier.relanceDocumentLe (une seule relance par dossier).
 */
const DELAI_RELANCE_MS = 3 * 24 * 60 * 60 * 1000; // 3 jours

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const seuil = new Date(Date.now() - DELAI_RELANCE_MS);

  const dossiers = await prisma.dossier.findMany({
    where: { statut: "DOCUMENT_MANQUANT", relanceDocumentLe: null, supprimeLe: null },
    include: {
      historique: {
        where: { nouveauStatut: "DOCUMENT_MANQUANT" },
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });

  let envoyees = 0;
  for (const d of dossiers) {
    const dernier = d.historique[0];
    if (!dernier || dernier.date > seuil) continue; // moins de 3 jours
    const ok = await envoyerEmailDossier(d.id, "RELANCE_DOCUMENT", dernier.commentaire ?? undefined);
    if (ok) {
      await prisma.dossier.update({ where: { id: d.id }, data: { relanceDocumentLe: new Date() } });
      envoyees++;
    }
  }

  return NextResponse.json({ ok: true, examinés: dossiers.length, relancesEnvoyees: envoyees });
}

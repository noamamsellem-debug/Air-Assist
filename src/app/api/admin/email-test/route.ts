import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { construireEmail, basePublique, type TypeEmail, type VariablesEmail } from "@/lib/emails";
import { getEmailAdapter } from "@/adapters/email";

/**
 * Envoi d'un e-mail de TEST (admin) vers une adresse choisie, avec des données
 * d'exemple, pour valider le rendu avant la prod. Aucune écriture en base.
 */
const TYPES: TypeEmail[] = [
  "ACCUSE_RECEPTION",
  "DOCUMENT_MANQUANT",
  "RELANCE_DOCUMENT",
  "RECLAMATION_ENVOYEE",
  "INDEMNITE_OBTENUE",
  "VERSEMENT_EFFECTUE",
  "REFUSE",
];

const EMAIL_FROM = process.env.EMAIL_FROM ?? "AirAssist <info@airassist.eu>";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO ?? "info@airassist.eu";

function exemple(): VariablesEmail {
  const SITE_URL = basePublique();
  return {
    prenom: "Camille",
    compagnie: "Vueling",
    depart: "LGW",
    arrivee: "RMO",
    dateVol: "22/06/2026",
    reference: "AA-2026-000123",
    montantEstime: 400,
    montantObtenu: 400,
    partClient: 280,
    commission: 120,
    lienSuivi: `${SITE_URL}/fr/suivi`,
    lienVersement: `${SITE_URL}/fr/suivi`,
    documentManquant: "Carte d'embarquement lisible (les 4 coins visibles)",
    motifRefus: "Circonstances extraordinaires invoquées par la compagnie",
    annee: new Date().getFullYear(),
    siteUrl: SITE_URL,
  };
}

export async function GET(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") as TypeEmail | null;
  const to = (url.searchParams.get("to") ?? "").trim();

  if (!type || !TYPES.includes(type)) {
    return NextResponse.json({ error: "Type d'e-mail invalide." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  const { sujet, html, texte } = construireEmail(type, exemple());
  try {
    const r = await getEmailAdapter().envoyer({
      de: EMAIL_FROM,
      a: to,
      replyTo: EMAIL_REPLY_TO,
      sujet: `[TEST] ${sujet}`,
      html,
      texte,
      enTetes: { "X-Test": "1" },
    });
    return NextResponse.json({ ok: true, type, to, sujet, provider: r.provider });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Échec de l'envoi." },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import { documentMetaSchema } from "@/lib/validation";
import { ajouterDocumentParSuivi, DepotError } from "@/lib/depot-service";

/**
 * Téléversement d'un document depuis l'espace de suivi public (binaire brut).
 * Le client s'identifie via les en-têtes X-Reference + X-Email (vérifiés). Le
 * document est rangé en type AUTRE (complément) et chiffré au repos.
 */
export async function POST(request: Request) {
  const reference = (request.headers.get("x-reference") ?? "").trim();
  const email = (request.headers.get("x-email") ?? "").trim();
  if (!reference || !email) {
    return NextResponse.json({ error: "Référence ou e-mail manquant." }, { status: 400 });
  }

  const meta = {
    type: "AUTRE" as const,
    sousType: null,
    nomFichier: decodeURIComponent(request.headers.get("x-document-nom") ?? "document"),
    mimeType: ((request.headers.get("content-type") ?? "").split(";")[0] ?? "").trim(),
  };
  const parsed = documentMetaSchema.safeParse(meta);
  if (!parsed.success) {
    return NextResponse.json({ error: "Format de fichier non pris en charge (PDF, JPG, PNG)." }, { status: 422 });
  }

  let contenu: Buffer;
  try {
    contenu = Buffer.from(await request.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  try {
    const { documentId } = await ajouterDocumentParSuivi(reference, email, parsed.data, contenu);
    return NextResponse.json({ ok: true, documentId }, { status: 201 });
  } catch (err) {
    if (err instanceof DepotError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Échec ajout document (suivi)", err);
    return NextResponse.json({ error: "Téléversement impossible. Réessayez." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { documentMetaSchema } from "@/lib/validation";
import { ajouterDocument, DepotError } from "@/lib/depot-service";

/**
 * Téléversement d'UN document en BINAIRE BRUT (corps de la requête = octets du
 * fichier ; métadonnées dans les en-têtes). Évite le base64 (et son inflation de
 * +33 %) ainsi que tout traitement canvas/FileReader côté client. Chiffré au repos.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const meta = {
    type: request.headers.get("x-document-type") ?? "",
    sousType: request.headers.get("x-document-soustype") || null,
    nomFichier: decodeURIComponent(request.headers.get("x-document-nom") ?? ""),
    mimeType: ((request.headers.get("content-type") ?? "").split(";")[0] ?? "").trim(),
  };

  const parsed = documentMetaSchema.safeParse(meta);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Document invalide", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  let contenu: Buffer;
  try {
    contenu = Buffer.from(await request.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible" }, { status: 400 });
  }

  try {
    const { documentId } = await ajouterDocument(id, parsed.data, contenu);
    return NextResponse.json({ documentId }, { status: 201 });
  } catch (err) {
    if (err instanceof DepotError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Échec ajout document", err);
    return NextResponse.json({ error: "Téléversement impossible. Réessayez." }, { status: 500 });
  }
}

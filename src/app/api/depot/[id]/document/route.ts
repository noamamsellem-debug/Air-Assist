import { NextResponse } from "next/server";
import { documentUploadSchema } from "@/lib/validation";
import { ajouterDocument, DepotError } from "@/lib/depot-service";

/**
 * Téléversement d'UN document pour un dossier existant (requête séparée, légère,
 * pour rester sous la limite de corps serverless de 4,5 Mo). Chiffré au repos.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = documentUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Document invalide", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { documentId } = await ajouterDocument(id, parsed.data);
    return NextResponse.json({ documentId }, { status: 201 });
  } catch (err) {
    if (err instanceof DepotError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Échec ajout document", err);
    return NextResponse.json({ error: "Téléversement impossible. Réessayez." }, { status: 500 });
  }
}

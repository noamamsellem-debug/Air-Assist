import { NextResponse } from "next/server";
import { depotSchema } from "@/lib/validation";
import { creerDepot } from "@/lib/depot-service";

/**
 * Dépôt d'un dossier (tunnel refondu). Le `depotSchema` est REJOUÉ ici : un
 * dépôt incomplet est refusé (422) avec le détail des erreurs par champ.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = depotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dépôt incomplet", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  try {
    const { dossierId, reference } = await creerDepot(parsed.data, { ip });
    return NextResponse.json({ dossierId, reference, statut: "NOUVEAU" }, { status: 201 });
  } catch (err) {
    console.error("Échec création dépôt", err);
    return NextResponse.json({ error: "Création impossible. Réessayez." }, { status: 500 });
  }
}

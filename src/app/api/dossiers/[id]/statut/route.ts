import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { changementStatutSchema } from "@/lib/validation";
import { changerStatut } from "@/lib/dossier-service";
import { TransitionInterditeError } from "@/domain/statut";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = changementStatutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const dossier = await changerStatut(id, parsed.data.nouveauStatut, {
      auteur: "UTILISATEUR",
      commentaire: parsed.data.commentaire,
      numeroDossierCompagnie: parsed.data.numeroDossierCompagnie,
      montantObtenu: parsed.data.montantObtenu,
      force: parsed.data.force,
    });
    return NextResponse.json({ ok: true, statut: dossier.statut });
  } catch (err) {
    if (err instanceof TransitionInterditeError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

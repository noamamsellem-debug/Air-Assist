import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { mettreALaCorbeille } from "@/lib/corbeille-service";

/** Met un dossier à la corbeille (soft delete : supprimeLe = now()). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await mettreALaCorbeille(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

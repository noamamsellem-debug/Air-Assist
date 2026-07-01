import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { restaurerDossier } from "@/lib/corbeille-service";

/** Restaure un dossier depuis la corbeille (supprimeLe = null). */
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
    await restaurerDossier(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { viderCorbeille } from "@/lib/corbeille-service";

/** Vide la corbeille : suppression DÉFINITIVE (DELETE + cascade). Irréversible. */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { supprimes } = await viderCorbeille();
    return NextResponse.json({ ok: true, supprimes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

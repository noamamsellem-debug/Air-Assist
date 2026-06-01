import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dechiffrerDocument } from "@/lib/crypto";

// Sert un document déchiffré à l'administrateur connecté (les pièces sont
// chiffrées au repos ; seul un agent authentifié peut les ouvrir).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id, docId } = await params;
  const doc = await prisma.document.findFirst({ where: { id: docId, dossierId: id } });
  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  try {
    const clair = dechiffrerDocument({
      contenuChiffre: Buffer.from(doc.contenuChiffre),
      iv: Buffer.from(doc.iv),
      authTag: Buffer.from(doc.authTag),
    });
    return new NextResponse(new Uint8Array(clair), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(doc.nomFichier)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("Échec déchiffrement document", err);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }
}

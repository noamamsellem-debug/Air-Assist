import { NextResponse } from "next/server";
import { z } from "zod";
import { reclamationSchema } from "@/lib/validation";
import { creerReclamation } from "@/lib/reclamation-service";
import { prisma } from "@/lib/prisma";
import { chiffrerDocument } from "@/lib/crypto";

// Document optionnel transmis en base64 (carte d'embarquement / justificatif).
const documentSchema = z.object({
  type: z.enum(["CARTE_EMBARQUEMENT", "JUSTIFICATIF"]),
  nomFichier: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(120),
  contenuBase64: z.string().min(1),
});

const payloadSchema = reclamationSchema.extend({
  documents: z.array(documentSchema).max(5).optional(),
});

const TAILLE_MAX_OCTETS = 8 * 1024 * 1024; // 8 Mo / fichier

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { documents, ...reclamation } = parsed.data;

  try {
    const { dossierId, reference } = await creerReclamation(reclamation);

    // Stockage chiffré au repos des documents éventuels.
    if (documents?.length) {
      for (const doc of documents) {
        const brut = Buffer.from(doc.contenuBase64, "base64");
        if (brut.length === 0 || brut.length > TAILLE_MAX_OCTETS) continue;
        const { contenuChiffre, iv, authTag } = chiffrerDocument(brut);
        await prisma.document.create({
          data: {
            dossierId,
            type: doc.type,
            nomFichier: doc.nomFichier,
            mimeType: doc.mimeType,
            tailleOctets: brut.length,
            contenuChiffre: new Uint8Array(contenuChiffre),
            iv: new Uint8Array(iv),
            authTag: new Uint8Array(authTag),
          },
        });
      }
    }

    return NextResponse.json({ dossierId, reference }, { status: 201 });
  } catch (err) {
    console.error("Échec création réclamation", err);
    return NextResponse.json(
      { error: "Création impossible. Réessayez." },
      { status: 500 },
    );
  }
}

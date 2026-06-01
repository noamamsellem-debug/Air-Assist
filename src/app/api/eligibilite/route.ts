import { NextResponse } from "next/server";
import { eligibiliteSchema } from "@/lib/validation";
import { trajetEntreAeroports } from "@/domain/distance";
import { evaluerEligibilite } from "@/domain/eligibilite";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = eligibiliteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { aeroportDepart, aeroportArrivee, motif, dureeRetardMin } = parsed.data;
  const trajet = trajetEntreAeroports(aeroportDepart, aeroportArrivee);
  if (!trajet.connu) {
    return NextResponse.json({ error: "Aéroport inconnu", code: "AEROPORT_INCONNU" }, { status: 422 });
  }

  const resultat = evaluerEligibilite({
    distanceKm: trajet.distanceKm,
    motif,
    dureeRetardMin,
    intraUe: trajet.intraUe,
  });

  return NextResponse.json({
    ...resultat,
    distanceKm: trajet.distanceKm,
    intraUe: trajet.intraUe,
  });
}

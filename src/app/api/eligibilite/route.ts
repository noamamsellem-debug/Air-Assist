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

  const { aeroportDepart, aeroportArrivee, motif, dureeRetardMin, date } = parsed.data;

  // Validation intelligente : aéroports connus, distincts, et date plausible.
  if (aeroportDepart.toUpperCase() === aeroportArrivee.toUpperCase()) {
    return NextResponse.json(
      { error: "Le départ et l'arrivée doivent être différents.", code: "TRAJET_INVALIDE" },
      { status: 422 },
    );
  }
  const d = new Date(date);
  const maintenant = Date.now();
  if (Number.isNaN(d.getTime())) {
    return NextResponse.json({ error: "Date invalide.", code: "DATE_INVALIDE" }, { status: 422 });
  }
  if (d.getTime() > maintenant + 2 * 86_400_000) {
    return NextResponse.json(
      { error: "La date du vol est dans le futur.", code: "DATE_FUTURE" },
      { status: 422 },
    );
  }
  // Prescription : au-delà de ~6 ans, peu de chances d'aboutir.
  if (d.getTime() < maintenant - 6 * 365 * 86_400_000) {
    return NextResponse.json(
      { error: "Vol trop ancien (prescription dépassée).", code: "TROP_ANCIEN" },
      { status: 422 },
    );
  }

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

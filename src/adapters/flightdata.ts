/**
 * Adaptateur « données de vol » : enrichit un n° de vol + date
 * (compagnie, aéroports, distance, retard). En dev, `mock` déduit ce qu'il
 * peut du référentiel local d'aéroports et renvoie des valeurs plausibles.
 * En prod : AviationStack, FlightAware, OAG.
 */

import { trajetEntreAeroports } from "@/domain/distance";

export interface InfosVol {
  numero: string;
  date: string; // ISO date
  codeCompagnie?: string;
  aeroportDepart?: string;
  aeroportArrivee?: string;
  distanceKm?: number;
  intraUe?: boolean;
  /** Source : "mock" | nom du fournisseur. */
  source: string;
  /** true si la donnée a pu être résolue. */
  resolu: boolean;
}

export interface AdaptateurDonneesVol {
  readonly nom: string;
  rechercher(numero: string, date: string): Promise<InfosVol>;
}

/**
 * Mock : le préfixe IATA du numéro de vol (2 lettres) donne la compagnie.
 * Sans table de routes réelle, on ne devine pas les aéroports : le parcours
 * demandera alors les aéroports à l'utilisateur (le calculateur fonctionne
 * de toute façon avec une saisie manuelle dep/arr).
 */
export class MockFlightDataAdapter implements AdaptateurDonneesVol {
  readonly nom = "mock";
  async rechercher(numero: string, date: string): Promise<InfosVol> {
    const code = numero.trim().slice(0, 2).toUpperCase();
    return {
      numero: numero.trim().toUpperCase(),
      date,
      codeCompagnie: /^[A-Z0-9]{2}$/.test(code) ? code : undefined,
      source: "mock",
      resolu: false, // le mock ne résout pas la route : saisie manuelle des aéroports
    };
  }
}

/** Utilitaire partagé : enrichit distance + intra-UE à partir de deux IATA. */
export function enrichirDistance(depIata: string, arrIata: string) {
  return trajetEntreAeroports(depIata, arrIata);
}

export function getFlightDataAdapter(
  env: Record<string, string | undefined> = process.env,
): AdaptateurDonneesVol {
  const provider = (env.FLIGHTDATA_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "mock":
      return new MockFlightDataAdapter();
    // case "aviationstack": return new AviationStackAdapter(env.FLIGHTDATA_API_KEY!);
    default:
      throw new Error(
        `FLIGHTDATA_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

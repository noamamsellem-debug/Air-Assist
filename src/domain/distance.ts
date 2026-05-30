/**
 * Calcul de distance grand-cercle (haversine) entre deux aéroports, et
 * détermination du caractère intra-UE d'un trajet.
 */

import { getAeroport } from "@/data/aeroports";

const RAYON_TERRE_KM = 6371;

function radians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distance grand-cercle en km entre deux points (lat/lon en degrés). */
export function distanceHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RAYON_TERRE_KM * c;
}

export interface InfosTrajet {
  distanceKm: number;
  intraUe: boolean;
  /** false si l'un des aéroports est inconnu du référentiel. */
  connu: boolean;
}

/**
 * Distance + intra-UE pour un couple de codes IATA.
 * Si un aéroport est inconnu, renvoie connu=false (distance 0).
 */
export function trajetEntreAeroports(depIata: string, arrIata: string): InfosTrajet {
  const dep = getAeroport(depIata);
  const arr = getAeroport(arrIata);
  if (!dep || !arr) {
    return { distanceKm: 0, intraUe: false, connu: false };
  }
  const distanceKm = Math.round(distanceHaversineKm(dep.lat, dep.lon, arr.lat, arr.lon));
  return { distanceKm, intraUe: dep.ue && arr.ue, connu: true };
}

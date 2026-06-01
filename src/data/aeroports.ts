/**
 * Référentiel minimal d'aéroports (code IATA → coordonnées + pays + UE).
 * Suffisant pour la démo/calculateur ; en prod, brancher l'adaptateur
 * « données de vol » (FLIGHTDATA_PROVIDER) pour un référentiel complet.
 */

export interface Aeroport {
  iata: string;
  nom: string;
  ville: string;
  pays: string;
  lat: number;
  lon: number;
  /** Membre de l'UE (pour la règle intra-UE du barème EC 261). */
  ue: boolean;
}

export const AEROPORTS: Record<string, Aeroport> = {
  CDG: { iata: "CDG", nom: "Paris-Charles de Gaulle", ville: "Paris", pays: "FR", lat: 49.0097, lon: 2.5479, ue: true },
  ORY: { iata: "ORY", nom: "Paris-Orly", ville: "Paris", pays: "FR", lat: 48.7233, lon: 2.3794, ue: true },
  NCE: { iata: "NCE", nom: "Nice Côte d'Azur", ville: "Nice", pays: "FR", lat: 43.6584, lon: 7.2159, ue: true },
  LYS: { iata: "LYS", nom: "Lyon-Saint Exupéry", ville: "Lyon", pays: "FR", lat: 45.7256, lon: 5.0811, ue: true },
  TLS: { iata: "TLS", nom: "Toulouse-Blagnac", ville: "Toulouse", pays: "FR", lat: 43.6293, lon: 1.3638, ue: true },
  MRS: { iata: "MRS", nom: "Marseille-Provence", ville: "Marseille", pays: "FR", lat: 43.4393, lon: 5.2214, ue: true },
  BOD: { iata: "BOD", nom: "Bordeaux-Mérignac", ville: "Bordeaux", pays: "FR", lat: 44.8283, lon: -0.7156, ue: true },
  NTE: { iata: "NTE", nom: "Nantes Atlantique", ville: "Nantes", pays: "FR", lat: 47.1532, lon: -1.6107, ue: true },
  BVA: { iata: "BVA", nom: "Paris-Beauvais", ville: "Beauvais", pays: "FR", lat: 49.4544, lon: 2.1128, ue: true },
  LIS: { iata: "LIS", nom: "Lisbonne", ville: "Lisbonne", pays: "PT", lat: 38.7742, lon: -9.1342, ue: true },
  MAD: { iata: "MAD", nom: "Madrid-Barajas", ville: "Madrid", pays: "ES", lat: 40.4719, lon: -3.5626, ue: true },
  BCN: { iata: "BCN", nom: "Barcelone-El Prat", ville: "Barcelone", pays: "ES", lat: 41.2974, lon: 2.0833, ue: true },
  FCO: { iata: "FCO", nom: "Rome-Fiumicino", ville: "Rome", pays: "IT", lat: 41.8003, lon: 12.2389, ue: true },
  MXP: { iata: "MXP", nom: "Milan-Malpensa", ville: "Milan", pays: "IT", lat: 45.6306, lon: 8.7281, ue: true },
  FRA: { iata: "FRA", nom: "Francfort", ville: "Francfort", pays: "DE", lat: 50.0379, lon: 8.5622, ue: true },
  MUC: { iata: "MUC", nom: "Munich", ville: "Munich", pays: "DE", lat: 48.3538, lon: 11.7861, ue: true },
  BER: { iata: "BER", nom: "Berlin-Brandebourg", ville: "Berlin", pays: "DE", lat: 52.3667, lon: 13.5033, ue: true },
  AMS: { iata: "AMS", nom: "Amsterdam-Schiphol", ville: "Amsterdam", pays: "NL", lat: 52.3105, lon: 4.7683, ue: true },
  BRU: { iata: "BRU", nom: "Bruxelles", ville: "Bruxelles", pays: "BE", lat: 50.9014, lon: 4.4844, ue: true },
  ATH: { iata: "ATH", nom: "Athènes", ville: "Athènes", pays: "GR", lat: 37.9364, lon: 23.9445, ue: true },
  DUB: { iata: "DUB", nom: "Dublin", ville: "Dublin", pays: "IE", lat: 53.4213, lon: -6.2701, ue: true },
  VIE: { iata: "VIE", nom: "Vienne", ville: "Vienne", pays: "AT", lat: 48.1103, lon: 16.5697, ue: true },
  WAW: { iata: "WAW", nom: "Varsovie-Chopin", ville: "Varsovie", pays: "PL", lat: 52.1657, lon: 20.9671, ue: true },
  // Hors UE
  LHR: { iata: "LHR", nom: "Londres-Heathrow", ville: "Londres", pays: "GB", lat: 51.4700, lon: -0.4543, ue: false },
  LGW: { iata: "LGW", nom: "Londres-Gatwick", ville: "Londres", pays: "GB", lat: 51.1537, lon: -0.1821, ue: false },
  GVA: { iata: "GVA", nom: "Genève", ville: "Genève", pays: "CH", lat: 46.2381, lon: 6.1089, ue: false },
  ZRH: { iata: "ZRH", nom: "Zurich", ville: "Zurich", pays: "CH", lat: 47.4582, lon: 8.5556, ue: false },
  IST: { iata: "IST", nom: "Istanbul", ville: "Istanbul", pays: "TR", lat: 41.2753, lon: 28.7519, ue: false },
  JFK: { iata: "JFK", nom: "New York-JFK", ville: "New York", pays: "US", lat: 40.6413, lon: -73.7781, ue: false },
  EWR: { iata: "EWR", nom: "Newark", ville: "New York", pays: "US", lat: 40.6895, lon: -74.1745, ue: false },
  LAX: { iata: "LAX", nom: "Los Angeles", ville: "Los Angeles", pays: "US", lat: 33.9416, lon: -118.4085, ue: false },
  YUL: { iata: "YUL", nom: "Montréal-Trudeau", ville: "Montréal", pays: "CA", lat: 45.4706, lon: -73.7408, ue: false },
  DXB: { iata: "DXB", nom: "Dubaï", ville: "Dubaï", pays: "AE", lat: 25.2532, lon: 55.3657, ue: false },
  CMN: { iata: "CMN", nom: "Casablanca", ville: "Casablanca", pays: "MA", lat: 33.3675, lon: -7.5899, ue: false },
  DSS: { iata: "DSS", nom: "Dakar", ville: "Dakar", pays: "SN", lat: 14.6709, lon: -17.0732, ue: false },
};

export function getAeroport(iata: string): Aeroport | undefined {
  return AEROPORTS[iata.trim().toUpperCase()];
}

export function listeAeroports(): Aeroport[] {
  return Object.values(AEROPORTS).sort((a, b) => a.ville.localeCompare(b.ville));
}

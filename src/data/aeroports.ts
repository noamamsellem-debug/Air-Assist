/**
 * Référentiel d'aéroports (code IATA → coordonnées + pays + UE).
 * Utilisé pour l'autocomplétion du calculateur et le calcul de distance.
 * En prod, l'adaptateur « données de vol » peut enrichir/compléter ce référentiel.
 *
 * `ue` = situé dans l'Union européenne (pour la règle intra-UE du barème EC 261).
 */

export interface Aeroport {
  iata: string;
  nom: string;
  ville: string;
  pays: string;
  lat: number;
  lon: number;
  ue: boolean;
}

export const AEROPORTS: Record<string, Aeroport> = {
  // ── France ────────────────────────────────────────────────────────────────
  CDG: { iata: "CDG", nom: "Paris-Charles de Gaulle", ville: "Paris", pays: "FR", lat: 49.0097, lon: 2.5479, ue: true },
  ORY: { iata: "ORY", nom: "Paris-Orly", ville: "Paris", pays: "FR", lat: 48.7233, lon: 2.3794, ue: true },
  BVA: { iata: "BVA", nom: "Paris-Beauvais", ville: "Beauvais", pays: "FR", lat: 49.4544, lon: 2.1128, ue: true },
  NCE: { iata: "NCE", nom: "Nice Côte d'Azur", ville: "Nice", pays: "FR", lat: 43.6584, lon: 7.2159, ue: true },
  LYS: { iata: "LYS", nom: "Lyon-Saint Exupéry", ville: "Lyon", pays: "FR", lat: 45.7256, lon: 5.0811, ue: true },
  MRS: { iata: "MRS", nom: "Marseille-Provence", ville: "Marseille", pays: "FR", lat: 43.4393, lon: 5.2214, ue: true },
  TLS: { iata: "TLS", nom: "Toulouse-Blagnac", ville: "Toulouse", pays: "FR", lat: 43.6293, lon: 1.3638, ue: true },
  BOD: { iata: "BOD", nom: "Bordeaux-Mérignac", ville: "Bordeaux", pays: "FR", lat: 44.8283, lon: -0.7156, ue: true },
  NTE: { iata: "NTE", nom: "Nantes Atlantique", ville: "Nantes", pays: "FR", lat: 47.1532, lon: -1.6107, ue: true },
  LIL: { iata: "LIL", nom: "Lille-Lesquin", ville: "Lille", pays: "FR", lat: 50.5619, lon: 3.0894, ue: true },
  MPL: { iata: "MPL", nom: "Montpellier-Méditerranée", ville: "Montpellier", pays: "FR", lat: 43.5762, lon: 3.9630, ue: true },
  SXB: { iata: "SXB", nom: "Strasbourg", ville: "Strasbourg", pays: "FR", lat: 48.5383, lon: 7.6282, ue: true },
  BIQ: { iata: "BIQ", nom: "Biarritz-Pays Basque", ville: "Biarritz", pays: "FR", lat: 43.4684, lon: -1.5311, ue: true },
  AJA: { iata: "AJA", nom: "Ajaccio-Napoléon Bonaparte", ville: "Ajaccio", pays: "FR", lat: 41.9236, lon: 8.8029, ue: true },
  BIA: { iata: "BIA", nom: "Bastia-Poretta", ville: "Bastia", pays: "FR", lat: 42.5527, lon: 9.4837, ue: true },
  RNS: { iata: "RNS", nom: "Rennes-Saint-Jacques", ville: "Rennes", pays: "FR", lat: 48.0695, lon: -1.7348, ue: true },
  BES: { iata: "BES", nom: "Brest-Bretagne", ville: "Brest", pays: "FR", lat: 48.4479, lon: -4.4185, ue: true },
  CFE: { iata: "CFE", nom: "Clermont-Ferrand-Auvergne", ville: "Clermont-Ferrand", pays: "FR", lat: 45.7867, lon: 3.1692, ue: true },
  PUF: { iata: "PUF", nom: "Pau-Pyrénées", ville: "Pau", pays: "FR", lat: 43.3800, lon: -0.4186, ue: true },
  TLN: { iata: "TLN", nom: "Toulon-Hyères", ville: "Toulon", pays: "FR", lat: 43.0973, lon: 6.1460, ue: true },
  GNB: { iata: "GNB", nom: "Grenoble-Alpes-Isère", ville: "Grenoble", pays: "FR", lat: 45.3629, lon: 5.3294, ue: true },
  FSC: { iata: "FSC", nom: "Figari Sud-Corse", ville: "Figari", pays: "FR", lat: 41.5006, lon: 9.0978, ue: true },
  // ── Espagne / Portugal ──────────────────────────────────────────────────
  MAD: { iata: "MAD", nom: "Madrid-Barajas", ville: "Madrid", pays: "ES", lat: 40.4719, lon: -3.5626, ue: true },
  BCN: { iata: "BCN", nom: "Barcelone-El Prat", ville: "Barcelone", pays: "ES", lat: 41.2974, lon: 2.0833, ue: true },
  AGP: { iata: "AGP", nom: "Málaga-Costa del Sol", ville: "Málaga", pays: "ES", lat: 36.6749, lon: -4.4991, ue: true },
  PMI: { iata: "PMI", nom: "Palma de Majorque", ville: "Palma", pays: "ES", lat: 39.5517, lon: 2.7388, ue: true },
  VLC: { iata: "VLC", nom: "Valence", ville: "Valence", pays: "ES", lat: 39.4893, lon: -0.4816, ue: true },
  SVQ: { iata: "SVQ", nom: "Séville", ville: "Séville", pays: "ES", lat: 37.4180, lon: -5.8931, ue: true },
  IBZ: { iata: "IBZ", nom: "Ibiza", ville: "Ibiza", pays: "ES", lat: 38.8729, lon: 1.3731, ue: true },
  LIS: { iata: "LIS", nom: "Lisbonne-Humberto Delgado", ville: "Lisbonne", pays: "PT", lat: 38.7742, lon: -9.1342, ue: true },
  OPO: { iata: "OPO", nom: "Porto-Francisco Sá Carneiro", ville: "Porto", pays: "PT", lat: 41.2481, lon: -8.6814, ue: true },
  FAO: { iata: "FAO", nom: "Faro", ville: "Faro", pays: "PT", lat: 37.0144, lon: -7.9659, ue: true },
  FNC: { iata: "FNC", nom: "Madère-Funchal", ville: "Funchal", pays: "PT", lat: 32.6979, lon: -16.7745, ue: true },
  // ── Italie ──────────────────────────────────────────────────────────────
  FCO: { iata: "FCO", nom: "Rome-Fiumicino", ville: "Rome", pays: "IT", lat: 41.8003, lon: 12.2389, ue: true },
  CIA: { iata: "CIA", nom: "Rome-Ciampino", ville: "Rome", pays: "IT", lat: 41.7994, lon: 12.5949, ue: true },
  MXP: { iata: "MXP", nom: "Milan-Malpensa", ville: "Milan", pays: "IT", lat: 45.6306, lon: 8.7281, ue: true },
  LIN: { iata: "LIN", nom: "Milan-Linate", ville: "Milan", pays: "IT", lat: 45.4451, lon: 9.2767, ue: true },
  BGY: { iata: "BGY", nom: "Milan-Bergame", ville: "Bergame", pays: "IT", lat: 45.6739, lon: 9.7042, ue: true },
  VCE: { iata: "VCE", nom: "Venise-Marco Polo", ville: "Venise", pays: "IT", lat: 45.5053, lon: 12.3519, ue: true },
  NAP: { iata: "NAP", nom: "Naples", ville: "Naples", pays: "IT", lat: 40.8860, lon: 14.2908, ue: true },
  BLQ: { iata: "BLQ", nom: "Bologne", ville: "Bologne", pays: "IT", lat: 44.5354, lon: 11.2887, ue: true },
  CTA: { iata: "CTA", nom: "Catane-Fontanarossa", ville: "Catane", pays: "IT", lat: 37.4668, lon: 15.0664, ue: true },
  // ── Allemagne / Benelux / Suisse / Autriche ───────────────────────────────
  FRA: { iata: "FRA", nom: "Francfort", ville: "Francfort", pays: "DE", lat: 50.0379, lon: 8.5622, ue: true },
  MUC: { iata: "MUC", nom: "Munich", ville: "Munich", pays: "DE", lat: 48.3538, lon: 11.7861, ue: true },
  BER: { iata: "BER", nom: "Berlin-Brandebourg", ville: "Berlin", pays: "DE", lat: 52.3667, lon: 13.5033, ue: true },
  DUS: { iata: "DUS", nom: "Düsseldorf", ville: "Düsseldorf", pays: "DE", lat: 51.2895, lon: 6.7668, ue: true },
  HAM: { iata: "HAM", nom: "Hambourg", ville: "Hambourg", pays: "DE", lat: 53.6304, lon: 9.9882, ue: true },
  CGN: { iata: "CGN", nom: "Cologne-Bonn", ville: "Cologne", pays: "DE", lat: 50.8659, lon: 7.1427, ue: true },
  STR: { iata: "STR", nom: "Stuttgart", ville: "Stuttgart", pays: "DE", lat: 48.6899, lon: 9.2220, ue: true },
  AMS: { iata: "AMS", nom: "Amsterdam-Schiphol", ville: "Amsterdam", pays: "NL", lat: 52.3105, lon: 4.7683, ue: true },
  BRU: { iata: "BRU", nom: "Bruxelles", ville: "Bruxelles", pays: "BE", lat: 50.9014, lon: 4.4844, ue: true },
  CRL: { iata: "CRL", nom: "Bruxelles-Charleroi", ville: "Charleroi", pays: "BE", lat: 50.4592, lon: 4.4538, ue: true },
  LUX: { iata: "LUX", nom: "Luxembourg", ville: "Luxembourg", pays: "LU", lat: 49.6266, lon: 6.2115, ue: true },
  GVA: { iata: "GVA", nom: "Genève", ville: "Genève", pays: "CH", lat: 46.2381, lon: 6.1089, ue: false },
  ZRH: { iata: "ZRH", nom: "Zurich", ville: "Zurich", pays: "CH", lat: 47.4582, lon: 8.5556, ue: false },
  BSL: { iata: "BSL", nom: "Bâle-Mulhouse (EuroAirport)", ville: "Bâle", pays: "FR", lat: 47.5896, lon: 7.5299, ue: true },
  VIE: { iata: "VIE", nom: "Vienne", ville: "Vienne", pays: "AT", lat: 48.1103, lon: 16.5697, ue: true },
  // ── Reste de l'Europe ──────────────────────────────────────────────────
  ATH: { iata: "ATH", nom: "Athènes-Elefthérios-Venizélos", ville: "Athènes", pays: "GR", lat: 37.9364, lon: 23.9445, ue: true },
  SKG: { iata: "SKG", nom: "Thessalonique", ville: "Thessalonique", pays: "GR", lat: 40.5197, lon: 22.9709, ue: true },
  DUB: { iata: "DUB", nom: "Dublin", ville: "Dublin", pays: "IE", lat: 53.4213, lon: -6.2701, ue: true },
  WAW: { iata: "WAW", nom: "Varsovie-Chopin", ville: "Varsovie", pays: "PL", lat: 52.1657, lon: 20.9671, ue: true },
  KRK: { iata: "KRK", nom: "Cracovie", ville: "Cracovie", pays: "PL", lat: 50.0777, lon: 19.7848, ue: true },
  PRG: { iata: "PRG", nom: "Prague-Václav Havel", ville: "Prague", pays: "CZ", lat: 50.1008, lon: 14.2600, ue: true },
  BUD: { iata: "BUD", nom: "Budapest-Ferenc Liszt", ville: "Budapest", pays: "HU", lat: 47.4369, lon: 19.2556, ue: true },
  OTP: { iata: "OTP", nom: "Bucarest-Henri Coandă", ville: "Bucarest", pays: "RO", lat: 44.5711, lon: 26.0850, ue: true },
  SOF: { iata: "SOF", nom: "Sofia", ville: "Sofia", pays: "BG", lat: 42.6967, lon: 23.4114, ue: true },
  ZAG: { iata: "ZAG", nom: "Zagreb", ville: "Zagreb", pays: "HR", lat: 45.7429, lon: 16.0688, ue: true },
  HEL: { iata: "HEL", nom: "Helsinki-Vantaa", ville: "Helsinki", pays: "FI", lat: 60.3172, lon: 24.9633, ue: true },
  ARN: { iata: "ARN", nom: "Stockholm-Arlanda", ville: "Stockholm", pays: "SE", lat: 59.6519, lon: 17.9186, ue: true },
  CPH: { iata: "CPH", nom: "Copenhague-Kastrup", ville: "Copenhague", pays: "DK", lat: 55.6180, lon: 12.6508, ue: true },
  OSL: { iata: "OSL", nom: "Oslo-Gardermoen", ville: "Oslo", pays: "NO", lat: 60.1939, lon: 11.1004, ue: false },
  LHR: { iata: "LHR", nom: "Londres-Heathrow", ville: "Londres", pays: "GB", lat: 51.4700, lon: -0.4543, ue: false },
  LGW: { iata: "LGW", nom: "Londres-Gatwick", ville: "Londres", pays: "GB", lat: 51.1537, lon: -0.1821, ue: false },
  STN: { iata: "STN", nom: "Londres-Stansted", ville: "Londres", pays: "GB", lat: 51.8849, lon: 0.2350, ue: false },
  MAN: { iata: "MAN", nom: "Manchester", ville: "Manchester", pays: "GB", lat: 53.3537, lon: -2.2750, ue: false },
  EDI: { iata: "EDI", nom: "Édimbourg", ville: "Édimbourg", pays: "GB", lat: 55.9500, lon: -3.3725, ue: false },
  IST: { iata: "IST", nom: "Istanbul", ville: "Istanbul", pays: "TR", lat: 41.2753, lon: 28.7519, ue: false },
  SAW: { iata: "SAW", nom: "Istanbul-Sabiha Gökçen", ville: "Istanbul", pays: "TR", lat: 40.8986, lon: 29.3092, ue: false },
  RMO: { iata: "RMO", nom: "Chișinău", ville: "Chișinău", pays: "MD", lat: 46.9277, lon: 28.9309, ue: false },
  KIV: { iata: "KIV", nom: "Chișinău (KIV)", ville: "Chișinău", pays: "MD", lat: 46.9277, lon: 28.9309, ue: false },
  // ── Amérique du Nord ──────────────────────────────────────────────────
  JFK: { iata: "JFK", nom: "New York-John F. Kennedy", ville: "New York", pays: "US", lat: 40.6413, lon: -73.7781, ue: false },
  EWR: { iata: "EWR", nom: "New York-Newark", ville: "New York", pays: "US", lat: 40.6895, lon: -74.1745, ue: false },
  LAX: { iata: "LAX", nom: "Los Angeles", ville: "Los Angeles", pays: "US", lat: 33.9416, lon: -118.4085, ue: false },
  MIA: { iata: "MIA", nom: "Miami", ville: "Miami", pays: "US", lat: 25.7959, lon: -80.2870, ue: false },
  ORD: { iata: "ORD", nom: "Chicago-O'Hare", ville: "Chicago", pays: "US", lat: 41.9742, lon: -87.9073, ue: false },
  SFO: { iata: "SFO", nom: "San Francisco", ville: "San Francisco", pays: "US", lat: 37.6213, lon: -122.3790, ue: false },
  BOS: { iata: "BOS", nom: "Boston-Logan", ville: "Boston", pays: "US", lat: 42.3656, lon: -71.0096, ue: false },
  YUL: { iata: "YUL", nom: "Montréal-Trudeau", ville: "Montréal", pays: "CA", lat: 45.4706, lon: -73.7408, ue: false },
  YYZ: { iata: "YYZ", nom: "Toronto-Pearson", ville: "Toronto", pays: "CA", lat: 43.6777, lon: -79.6248, ue: false },
  // ── Moyen-Orient / Asie / Afrique / Amérique du Sud ───────────────────────
  DXB: { iata: "DXB", nom: "Dubaï", ville: "Dubaï", pays: "AE", lat: 25.2532, lon: 55.3657, ue: false },
  AUH: { iata: "AUH", nom: "Abou Dabi", ville: "Abou Dabi", pays: "AE", lat: 24.4330, lon: 54.6511, ue: false },
  DOH: { iata: "DOH", nom: "Doha-Hamad", ville: "Doha", pays: "QA", lat: 25.2731, lon: 51.6081, ue: false },
  TLV: { iata: "TLV", nom: "Tel Aviv-Ben Gourion", ville: "Tel Aviv", pays: "IL", lat: 32.0114, lon: 34.8867, ue: false },
  SIN: { iata: "SIN", nom: "Singapour-Changi", ville: "Singapour", pays: "SG", lat: 1.3644, lon: 103.9915, ue: false },
  HKG: { iata: "HKG", nom: "Hong Kong", ville: "Hong Kong", pays: "HK", lat: 22.3080, lon: 113.9185, ue: false },
  BKK: { iata: "BKK", nom: "Bangkok-Suvarnabhumi", ville: "Bangkok", pays: "TH", lat: 13.6900, lon: 100.7501, ue: false },
  NRT: { iata: "NRT", nom: "Tokyo-Narita", ville: "Tokyo", pays: "JP", lat: 35.7720, lon: 140.3929, ue: false },
  DEL: { iata: "DEL", nom: "New Delhi-Indira Gandhi", ville: "New Delhi", pays: "IN", lat: 28.5562, lon: 77.1000, ue: false },
  PEK: { iata: "PEK", nom: "Pékin-Capitale", ville: "Pékin", pays: "CN", lat: 40.0799, lon: 116.6031, ue: false },
  CMN: { iata: "CMN", nom: "Casablanca-Mohammed V", ville: "Casablanca", pays: "MA", lat: 33.3675, lon: -7.5899, ue: false },
  RAK: { iata: "RAK", nom: "Marrakech-Ménara", ville: "Marrakech", pays: "MA", lat: 31.6069, lon: -8.0363, ue: false },
  TUN: { iata: "TUN", nom: "Tunis-Carthage", ville: "Tunis", pays: "TN", lat: 36.8510, lon: 10.2272, ue: false },
  ALG: { iata: "ALG", nom: "Alger-Houari Boumédiène", ville: "Alger", pays: "DZ", lat: 36.6910, lon: 3.2154, ue: false },
  DKR: { iata: "DKR", nom: "Dakar-Blaise Diagne", ville: "Dakar", pays: "SN", lat: 14.6709, lon: -17.0732, ue: false },
  ABJ: { iata: "ABJ", nom: "Abidjan-Félix-Houphouët-Boigny", ville: "Abidjan", pays: "CI", lat: 5.2614, lon: -3.9263, ue: false },
  JNB: { iata: "JNB", nom: "Johannesburg-O. R. Tambo", ville: "Johannesburg", pays: "ZA", lat: -26.1392, lon: 28.2460, ue: false },
  GRU: { iata: "GRU", nom: "São Paulo-Guarulhos", ville: "São Paulo", pays: "BR", lat: -23.4356, lon: -46.4731, ue: false },
  PTP: { iata: "PTP", nom: "Pointe-à-Pitre", ville: "Pointe-à-Pitre", pays: "FR", lat: 16.2653, lon: -61.5318, ue: true },
  FDF: { iata: "FDF", nom: "Fort-de-France", ville: "Fort-de-France", pays: "FR", lat: 14.5910, lon: -61.0032, ue: true },
  RUN: { iata: "RUN", nom: "Saint-Denis-La Réunion (Roland Garros)", ville: "Saint-Denis", pays: "FR", lat: -20.8871, lon: 55.5103, ue: true },
};

export function getAeroport(iata: string): Aeroport | undefined {
  return AEROPORTS[iata.trim().toUpperCase()];
}

export function listeAeroports(): Aeroport[] {
  return Object.values(AEROPORTS).sort((a, b) => a.ville.localeCompare(b.ville));
}

/** Recherche par ville, nom ou code IATA (insensible à la casse/accents). */
export function rechercherAeroports(requete: string, limite = 8): Aeroport[] {
  const q = requete
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (q.length < 2) return [];
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return Object.values(AEROPORTS)
    .filter(
      (a) =>
        norm(a.ville).includes(q) ||
        norm(a.nom).includes(q) ||
        a.iata.toLowerCase().includes(q),
    )
    .slice(0, limite);
}

/**
 * Autocomplétion d'adresse — couche fournisseur générique (couverture Europe).
 *
 * `AddressProvider` est l'interface : on change de source sans toucher au
 * composant ni à la route API serveur.
 *  - Défaut : Photon (OpenStreetMap, EU-hébergé, gratuit, SANS clé) → couverture
 *    Europe immédiate. Résultats restreints à UE/EEE + UK + Suisse.
 *  - Option : Base Adresse Nationale (France) via ADDRESS_PROVIDER="ban".
 *  - Extension (TODO) : Google Places / Geoapify, activables par variable d'env,
 *    clé lue UNIQUEMENT côté serveur (jamais exposée au client).
 */

/** Pays UE/EEE + UK + Suisse (codes ISO-3166 alpha-2), pour filtrer le bruit hors zone. */
export const PAYS_AUTORISES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
]);

export interface AddressSuggestion {
  /** Libellé lisible affiché dans la liste. */
  label: string;
  /** Numéro + rue (ex. "8 Boulevard du Port"). */
  ligne1: string;
  codePostal: string;
  ville: string;
  pays: string;
  /** Code pays ISO alpha-2 (ex. "FR"). */
  codePays: string;
}

export interface AddressProvider {
  readonly nom: string;
  /** Recherche d'adresses ; `locale` adapte la langue des résultats. */
  search(query: string, locale: string): Promise<AddressSuggestion[]>;
}

function construireLigne1(housenumber?: unknown, street?: unknown, name?: unknown): string {
  const num = String(housenumber ?? "").trim();
  const rue = String(street ?? "").trim();
  const combine = [num, rue].filter(Boolean).join(" ").trim();
  return combine || String(name ?? "").trim();
}

/** Normalise la réponse GeoJSON de Photon, restreinte aux pays autorisés. */
export function normaliserPhoton(json: unknown): AddressSuggestion[] {
  const features = (json as { features?: unknown[] })?.features;
  if (!Array.isArray(features)) return [];
  const out: AddressSuggestion[] = [];
  for (const f of features) {
    const p = (f as { properties?: Record<string, unknown> })?.properties;
    if (!p) continue;
    const codePays = String(p.countrycode ?? "").toUpperCase();
    if (codePays && !PAYS_AUTORISES.has(codePays)) continue;
    const ligne1 = construireLigne1(p.housenumber, p.street, p.name);
    const ville = String(p.city ?? p.name ?? "").trim();
    const codePostal = String(p.postcode ?? "").trim();
    if (!ligne1 && !ville) continue;
    const pays = String(p.country ?? "").trim();
    const label = [ligne1, codePostal, ville, pays].filter(Boolean).join(", ");
    out.push({ label, ligne1, codePostal, ville, pays, codePays });
  }
  return out;
}

/** Normalise la réponse GeoJSON de la Base Adresse Nationale (France). */
export function normaliserBan(json: unknown): AddressSuggestion[] {
  const features = (json as { features?: unknown[] })?.features;
  if (!Array.isArray(features)) return [];
  const out: AddressSuggestion[] = [];
  for (const f of features) {
    const p = (f as { properties?: Record<string, unknown> })?.properties;
    if (!p) continue;
    const ligne1 = String(p.name ?? "").trim();
    const ville = String(p.city ?? "").trim();
    const codePostal = String(p.postcode ?? "").trim();
    if (!ligne1 && !ville) continue;
    out.push({
      label: String(p.label ?? `${ligne1} ${codePostal} ${ville}`).trim(),
      ligne1,
      codePostal,
      ville,
      pays: "France",
      codePays: "FR",
    });
  }
  return out;
}

/** Fournisseur Photon (OpenStreetMap) — couverture Europe, sans clé. */
export class PhotonAddressProvider implements AddressProvider {
  readonly nom = "photon";
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  async search(query: string, locale: string): Promise<AddressSuggestion[]> {
    if (query.trim().length < 3) return [];
    const lang = ["fr", "en", "de", "it"].includes(locale) ? locale : "en";
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=${lang}`;
    const res = await this.fetchImpl(url);
    if (!res.ok) throw new Error(`Photon HTTP ${res.status}`);
    return normaliserPhoton(await res.json());
  }
}

/** Fournisseur Base Adresse Nationale (France). */
export class BanAddressProvider implements AddressProvider {
  readonly nom = "ban";
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  async search(query: string, _locale: string): Promise<AddressSuggestion[]> {
    if (query.trim().length < 3) return [];
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`;
    const res = await this.fetchImpl(url);
    if (!res.ok) throw new Error(`BAN HTTP ${res.status}`);
    return normaliserBan(await res.json());
  }
}

/**
 * Sélection du fournisseur via env `ADDRESS_PROVIDER` (défaut : "photon").
 * TODO Europe payant/hébergé : la clé est lue UNIQUEMENT ici (côté serveur).
 *   - "google"   → GooglePlacesProvider(env.GOOGLE_PLACES_API_KEY)   (proxy serveur)
 *   - "geoapify" → GeoapifyProvider(env.GEOAPIFY_API_KEY)            (EU-hébergé)
 */
export function getAddressProvider(
  env: Record<string, string | undefined> = process.env,
): AddressProvider {
  const provider = (env.ADDRESS_PROVIDER ?? "photon").toLowerCase();
  switch (provider) {
    case "photon":
      return new PhotonAddressProvider();
    case "ban":
      return new BanAddressProvider();
    // case "google":   return new GooglePlacesProvider(env.GOOGLE_PLACES_API_KEY!);
    // case "geoapify": return new GeoapifyProvider(env.GEOAPIFY_API_KEY!);
    default:
      return new PhotonAddressProvider();
  }
}

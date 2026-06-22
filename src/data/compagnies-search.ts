import { COMPAGNIES_REFERENCE, type CompagnieReference } from "./compagnies-reference";

const PAR_CODE = new Map(COMPAGNIES_REFERENCE.map((c) => [c.code, c]));

/** Compagnie par code IATA (2 lettres), ex. "VY" → Vueling. */
export function getCompagnieParCode(code: string): CompagnieReference | undefined {
  return PAR_CODE.get(code.trim().toUpperCase());
}

/** Recherche par nom ou code IATA, classée par pertinence. */
export function rechercherCompagnies(requete: string, limite = 8): CompagnieReference[] {
  const s = requete.trim().toLowerCase();
  if (s.length < 2) return [];
  const score = (c: CompagnieReference): number => {
    const code = c.code.toLowerCase();
    const nom = c.nom.toLowerCase();
    if (code === s) return 4;
    if (nom === s) return 3;
    if (nom.startsWith(s)) return 2;
    if (code.startsWith(s) || nom.includes(s)) return 1;
    return 0;
  };
  return COMPAGNIES_REFERENCE.filter((c) => score(c) > 0)
    .sort((a, b) => score(b) - score(a) || a.nom.localeCompare(b.nom))
    .slice(0, limite);
}

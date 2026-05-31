/**
 * Référentiel de compagnies pour les pages SEO programmatiques.
 * (Distinct des compagnies en base : sert au pré-rendu statique sans DB.)
 */
export interface CompagnieSeo {
  code: string; // IATA, sert de slug
  nom: string;
  procedure: "email" | "formulaire";
  delaiMoyenJours: number;
}

export const COMPAGNIES_SEO: CompagnieSeo[] = [
  { code: "AF", nom: "Air France", procedure: "email", delaiMoyenJours: 45 },
  { code: "FR", nom: "Ryanair", procedure: "formulaire", delaiMoyenJours: 60 },
  { code: "LH", nom: "Lufthansa", procedure: "email", delaiMoyenJours: 50 },
  { code: "U2", nom: "easyJet", procedure: "formulaire", delaiMoyenJours: 55 },
  { code: "VY", nom: "Vueling", procedure: "formulaire", delaiMoyenJours: 60 },
  { code: "IB", nom: "Iberia", procedure: "email", delaiMoyenJours: 50 },
  { code: "BA", nom: "British Airways", procedure: "formulaire", delaiMoyenJours: 45 },
  { code: "TP", nom: "TAP Air Portugal", procedure: "email", delaiMoyenJours: 55 },
];

export function getCompagnieSeo(code: string): CompagnieSeo | undefined {
  return COMPAGNIES_SEO.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

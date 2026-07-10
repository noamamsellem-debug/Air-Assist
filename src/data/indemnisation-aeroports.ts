/**
 * Données des pages SEO « indemnisation par aéroport » (/fr/aeroport/{slug}).
 * Version courte (Lot 3). Les grands aéroports (Lyon, Paris-CDG, Paris-Orly,
 * Marseille, Nice) ont désormais des pages enrichies dédiées
 * (/fr/vol-retarde-{aeroport}-indemnisation, voir pages-aeroports.ts) ; les
 * anciennes URLs sont redirigées (301) via le middleware. Ce fichier ne
 * conserve donc que les aéroports sans page enrichie.
 */
export type AeroportIndem = {
  slug: string;
  nom: string;
  intro: string;
  specs: string;
};

export const AEROPORTS_INDEM: AeroportIndem[] = [
  {
    slug: "toulouse",
    nom: "Toulouse-Blagnac",
    intro:
      "Premier aéroport du sud-ouest, Toulouse-Blagnac (TLS) relie la métropole occitane à Paris, aux grandes villes européennes et à de nombreuses destinations loisirs. Un vol retardé de 3 heures ou plus, annulé ou surbooké au départ ou à l'arrivée de Toulouse peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre éligibilité.",
    specs:
      "Les liaisons les plus fréquentées depuis Toulouse, notamment la navette vers Paris, concentrent une part importante des litiges. Vos droits restent identiques quelle que soit la compagnie.",
  },
  {
    slug: "bordeaux",
    nom: "Bordeaux-Mérignac",
    intro:
      "Principal aéroport de Nouvelle-Aquitaine, Bordeaux-Mérignac (BOD) dessert de nombreuses destinations nationales et européennes, avec une forte composante low-cost. Un vol retardé de 3 heures ou plus, annulé ou surbooké au départ ou à l'arrivée de Bordeaux peut donner droit à une indemnité jusqu'à 600 €. AirAssist s'occupe de la réclamation.",
    specs:
      "Bordeaux accueille beaucoup de vols low-cost et saisonniers, sujets aux perturbations en haute saison. Quelle que soit la compagnie, l'indemnité due reste la même.",
  },
  {
    slug: "nantes",
    nom: "Nantes-Atlantique",
    intro:
      "Premier aéroport du Grand Ouest, Nantes-Atlantique (NTE) connaît une croissance soutenue et dessert de nombreuses destinations européennes et loisirs. Un vol retardé de 3 heures ou plus, annulé tardivement ou surbooké au départ ou à l'arrivée de Nantes peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre dossier.",
    specs:
      "La forte fréquentation de Nantes, parfois à la limite de ses capacités, accroît le risque de retards aux heures de pointe. Vos droits sont identiques quelle que soit la compagnie.",
  },
  {
    slug: "lille",
    nom: "Lille-Lesquin",
    intro:
      "Principal aéroport des Hauts-de-France, Lille-Lesquin (LIL) dessert des destinations nationales, européennes et méditerranéennes, avec une forte présence low-cost. Un vol retardé de 3 heures ou plus, annulé ou surbooké au départ ou à l'arrivée de Lille peut donner droit à une indemnité jusqu'à 600 €. AirAssist s'occupe de la réclamation.",
    specs:
      "Le trafic loisirs et saisonnier de Lille est particulièrement exposé aux perturbations en période de vacances. Conservez vos justificatifs : ils accélèrent le traitement de votre réclamation.",
  },
];

export function getAeroportIndem(slug: string): AeroportIndem | undefined {
  return AEROPORTS_INDEM.find((a) => a.slug === slug);
}

/**
 * Données des pages SEO « indemnisation par aéroport » (/fr/aeroport/{slug}).
 * Template commun + contenu unique par aéroport. Ajouter un aéroport = ajouter
 * un objet ici.
 */
export type AeroportIndem = {
  slug: string;
  nom: string;
  intro: string;
  specs: string;
};

export const AEROPORTS_INDEM: AeroportIndem[] = [
  {
    slug: "lyon",
    nom: "Lyon-Saint-Exupéry",
    intro:
      "Premier aéroport de la région Auvergne-Rhône-Alpes, Lyon-Saint-Exupéry (LYS) voit transiter chaque année des millions de passagers vers l'Europe et au-delà. Un vol retardé de 3 heures ou plus, annulé ou surbooké au départ ou à l'arrivée de Lyon peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre dossier.",
    specs:
      "Les liaisons les plus fréquentées au départ de Lyon (Paris, grandes villes européennes, destinations loisirs) concentrent l'essentiel des litiges. Que vous voyagiez sur une compagnie classique ou low-cost, vos droits sont les mêmes.",
  },
  {
    slug: "paris-cdg",
    nom: "Paris-Charles de Gaulle",
    intro:
      "Premier aéroport de France, Paris-Charles de Gaulle (CDG) est l'un des hubs les plus actifs d'Europe — et l'un de ceux où se produisent le plus de retards et d'annulations. Si votre vol au départ ou à l'arrivée de CDG a été perturbé, vous pouvez réclamer jusqu'à 600 €. Vérification gratuite avec AirAssist.",
    specs:
      "En tant que hub majeur, CDG concentre de nombreuses correspondances : un premier vol en retard qui vous fait rater votre correspondance peut, lui aussi, ouvrir droit à indemnité sur la base du retard à votre destination finale.",
  },
  {
    slug: "paris-orly",
    nom: "Paris-Orly",
    intro:
      "Deuxième aéroport parisien, Orly (ORY) dessert de nombreuses destinations domestiques, européennes et vers l'outre-mer. Un vol retardé de 3 heures ou plus, annulé tardivement ou surbooké peut vous donner droit à une indemnité jusqu'à 600 €. AirAssist s'occupe de la réclamation.",
    specs:
      "Orly accueille beaucoup de vols loisirs et low-cost, particulièrement sujets aux perturbations en haute saison. Vos droits restent identiques quelle que soit la compagnie.",
  },
  {
    slug: "marseille",
    nom: "Marseille-Provence",
    intro:
      "Principal aéroport du sud-est de la France, Marseille-Provence (MRS) dessert de nombreuses destinations nationales, européennes et méditerranéennes. Un vol retardé de 3 heures ou plus, annulé ou surbooké au départ ou à l'arrivée de Marseille peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre dossier.",
    specs:
      "Marseille accueille un fort trafic loisirs, notamment vers le bassin méditerranéen, particulièrement sujet aux perturbations en été. Vos droits sont les mêmes quelle que soit la compagnie, classique ou low-cost.",
  },
  {
    slug: "nice",
    nom: "Nice-Côte d'Azur",
    intro:
      "Troisième aéroport de France, Nice-Côte d'Azur (NCE) est une porte d'entrée majeure vers la Riviera, très fréquentée toute l'année. Un vol retardé de 3 heures ou plus, annulé tardivement ou surbooké au départ ou à l'arrivée de Nice peut donner droit à une indemnité jusqu'à 600 €. AirAssist s'occupe de la réclamation.",
    specs:
      "Le trafic intense de Nice, en particulier l'été et lors des grands événements de la Côte d'Azur, multiplie les risques de retard. Conservez votre carte d'embarquement pour accélérer le traitement de votre dossier.",
  },
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

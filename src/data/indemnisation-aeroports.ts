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
];

export function getAeroportIndem(slug: string): AeroportIndem | undefined {
  return AEROPORTS_INDEM.find((a) => a.slug === slug);
}

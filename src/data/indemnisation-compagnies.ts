/**
 * Données des pages SEO « indemnisation par compagnie » (/fr/indemnisation/{slug}).
 * Le template fournit la structure commune ; ces objets apportent le contenu
 * unique (intro + spécificités). Ajouter une compagnie = ajouter un objet ici.
 */
export type CompagnieIndem = {
  slug: string;
  nom: string;
  intro: string;
  specs: string;
};

export const COMPAGNIES_INDEM: CompagnieIndem[] = [
  {
    slug: "ryanair",
    nom: "Ryanair",
    intro:
      "Première compagnie low-cost d'Europe, Ryanair transporte des millions de passagers chaque année — et génère un grand nombre de litiges pour retards et annulations. Si votre vol Ryanair a été retardé de 3 heures ou plus, annulé tardivement ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. AirAssist se charge de la réclamation à votre place.",
    specs:
      "Ryanair conteste fréquemment les demandes d'indemnisation et invoque souvent des circonstances extraordinaires. Une panne technique ou une grève interne ne dispensent pourtant pas la compagnie de payer. Ne vous découragez pas devant un premier refus : un dossier bien argumenté aboutit souvent.",
  },
  {
    slug: "easyjet",
    nom: "easyJet",
    intro:
      "easyJet est l'une des compagnies les plus présentes au départ et à l'arrivée des aéroports français. En cas de vol retardé de 3 heures ou plus, d'annulation de dernière minute ou de refus d'embarquement, vous pouvez prétendre à une indemnité allant jusqu'à 600 €. AirAssist vérifie gratuitement votre éligibilité.",
    specs:
      "easyJet propose parfois des bons d'achat ou des avoirs en remplacement de l'indemnité légale : ceux-ci ne remplacent pas votre droit à compensation. Vérifiez toujours ce à quoi vous avez réellement droit avant d'accepter une offre.",
  },
  {
    slug: "air-france",
    nom: "Air France",
    intro:
      "Compagnie nationale française, Air France n'échappe pas au règlement européen : un vol retardé de 3 heures ou plus, annulé moins de 14 jours avant le départ ou surbooké peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist mène la réclamation pour vous.",
    specs:
      "Air France dispose d'un service client structuré, mais les délais de traitement peuvent être longs et les premiers refus fréquents. Notre rôle est de relancer, argumenter et faire valoir vos droits jusqu'au versement.",
  },
  {
    slug: "transavia",
    nom: "Transavia",
    intro:
      "Filiale low-cost du groupe Air France-KLM, Transavia opère de nombreux vols loisirs au départ de la France. Retard de 3 heures ou plus, annulation tardive, surbooking : vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Vérification gratuite avec AirAssist.",
    specs:
      "Les vols Transavia desservent beaucoup de destinations saisonnières, où les perturbations sont fréquentes en haute saison. Un retard lié à l'affluence ou à l'organisation de la compagnie reste indemnisable.",
  },
  {
    slug: "vueling",
    nom: "Vueling",
    intro:
      "Compagnie espagnole du groupe IAG, Vueling est très présente sur les liaisons entre la France et l'Espagne. Si votre vol Vueling a été retardé de 3 heures ou plus, annulé ou surbooké, une indemnité jusqu'à 600 € peut vous être due. AirAssist s'occupe de tout.",
    specs:
      "Vueling figure régulièrement parmi les compagnies aux taux de ponctualité les plus faibles sur certaines liaisons. Conservez vos cartes d'embarquement et justificatifs : ils accélèrent le traitement de votre dossier.",
  },
];

export function getCompagnieIndem(slug: string): CompagnieIndem | undefined {
  return COMPAGNIES_INDEM.find((c) => c.slug === slug);
}

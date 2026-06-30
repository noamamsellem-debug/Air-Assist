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
  {
    slug: "volotea",
    nom: "Volotea",
    intro:
      "Compagnie espagnole spécialisée dans les liaisons entre villes moyennes, Volotea opère de nombreuses lignes régionales au départ de la France. Si votre vol Volotea a été retardé de 3 heures ou plus, annulé tardivement ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. AirAssist vérifie gratuitement votre éligibilité.",
    specs:
      "Volotea dessert surtout des aéroports régionaux et des destinations saisonnières, où les perturbations augmentent en haute saison. Vos droits sont identiques à ceux applicables sur les grandes compagnies : conservez votre carte d'embarquement pour accélérer le dossier.",
  },
  {
    slug: "wizz-air",
    nom: "Wizz Air",
    intro:
      "Compagnie ultra low-cost basée en Hongrie, Wizz Air relie la France à de nombreuses destinations d'Europe centrale et orientale. Un vol Wizz Air retardé de 3 heures ou plus, annulé ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 €. AirAssist se charge de la réclamation à votre place.",
    specs:
      "Wizz Air applique des conditions tarifaires strictes et conteste parfois les demandes d'indemnisation. Le règlement européen prime pourtant sur les conditions générales de la compagnie : un retard important ou une annulation tardive reste indemnisable.",
  },
  {
    slug: "lufthansa",
    nom: "Lufthansa",
    intro:
      "Première compagnie allemande, Lufthansa opère de nombreux vols au départ de la France via ses hubs de Francfort et Munich. Un vol Lufthansa retardé de 3 heures ou plus, annulé moins de 14 jours avant le départ ou surbooké peut donner droit à une indemnité jusqu'à 600 €. AirAssist mène la réclamation pour vous.",
    specs:
      "Sur un réseau organisé autour des correspondances, un premier vol Lufthansa en retard qui vous fait manquer un vol suivant peut ouvrir droit à indemnité sur la base du retard à votre destination finale, à condition que le trajet soit sur une réservation unique.",
  },
  {
    slug: "swiss",
    nom: "Swiss",
    intro:
      "Compagnie nationale suisse du groupe Lufthansa, Swiss relie la France à son hub de Zurich et au-delà. Pour un vol au départ de l'Union européenne retardé de 3 heures ou plus, annulé ou surbooké, le règlement EC 261/2004 s'applique et l'indemnité peut atteindre 600 €. AirAssist vérifie gratuitement votre situation.",
    specs:
      "Les vols Swiss au départ d'un aéroport de l'UE relèvent pleinement du règlement européen. Conservez vos justificatifs de voyage : ils permettent d'établir précisément le retard à l'arrivée, qui détermine votre droit à indemnité.",
  },
  {
    slug: "british-airways",
    nom: "British Airways",
    intro:
      "Principale compagnie britannique, British Airways opère de nombreux vols entre la France et le Royaume-Uni ainsi que vers le reste du monde. Un vol au départ de l'Union européenne retardé de 3 heures ou plus, annulé ou surbooké peut ouvrir droit à une indemnité jusqu'à 600 € au titre du règlement EC 261/2004. AirAssist s'occupe de la réclamation.",
    specs:
      "Pour les vols partant d'un aéroport de l'UE, le règlement européen continue de s'appliquer. Un premier refus de la compagnie n'est pas définitif : un dossier argumenté permet souvent d'obtenir le versement.",
  },
  {
    slug: "iberia",
    nom: "Iberia",
    intro:
      "Compagnie nationale espagnole du groupe IAG, Iberia assure de nombreuses liaisons entre la France et l'Espagne, ainsi que vers l'Amérique latine via Madrid. Un vol Iberia retardé de 3 heures ou plus, annulé ou surbooké peut donner droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre dossier.",
    specs:
      "Sur les longs trajets avec correspondance à Madrid, l'indemnité se calcule sur le retard à votre destination finale. Conservez l'ensemble de vos cartes d'embarquement pour reconstituer le trajet complet.",
  },
  {
    slug: "klm",
    nom: "KLM",
    intro:
      "Compagnie nationale néerlandaise du groupe Air France-KLM, KLM relie la France à son hub d'Amsterdam-Schiphol et au monde entier. Un vol KLM retardé de 3 heures ou plus, annulé moins de 14 jours avant le départ ou surbooké peut ouvrir droit à une indemnité jusqu'à 600 €. AirAssist mène la réclamation pour vous.",
    specs:
      "Amsterdam-Schiphol étant un hub de correspondances, un vol KLM en retard qui vous fait manquer une correspondance peut ouvrir droit à indemnité selon le retard à l'arrivée finale, sur une réservation unique.",
  },
  {
    slug: "tap-air-portugal",
    nom: "TAP Air Portugal",
    intro:
      "Compagnie nationale portugaise, TAP Air Portugal dessert la France depuis ses hubs de Lisbonne et Porto, ainsi que le Brésil et l'Afrique. Un vol TAP retardé de 3 heures ou plus, annulé ou surbooké peut donner droit à une indemnité jusqu'à 600 €. AirAssist vérifie gratuitement votre éligibilité.",
    specs:
      "Sur les vols long-courriers au départ ou à destination de l'UE, le règlement EC 261/2004 s'applique. Le retard se mesure à l'arrivée à destination finale, y compris en cas de correspondance à Lisbonne sur un même billet.",
  },
];

export function getCompagnieIndem(slug: string): CompagnieIndem | undefined {
  return COMPAGNIES_INDEM.find((c) => c.slug === slug);
}

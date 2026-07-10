/**
 * Contenu SEO unique par destination (grandes villes de l'UE). Gabarit :
 * src/components/seo/DestinationPage.tsx. Distances de référence depuis Paris.
 * Point territorial clé : ces villes étant dans l'UE, la couverture joue dans
 * les deux sens (aller depuis la France ET retour depuis la ville).
 */
import type { Bloc } from "@/components/seo/SeoPage";

export type PageDestination = {
  slug: string;
  code: string;
  ville: string;
  title: string;
  description: string;
  intro: string;
  corps: Bloc[];
  trajets: { route: string; km: string; montant: string }[];
  etapes: { titre: string; texte: string }[];
  faq: { q: string; a: string }[];
  compagnies: string[];
};

const ETAPES_STD = [
  { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol : nous calculons gratuitement le retard à l'arrivée et le montant applicable." },
  { titre: "Rassemblez vos justificatifs", texte: "Confirmation de réservation et carte d'embarquement suffisent à monter le dossier." },
  { titre: "Nous réclamons pour vous", texte: "Air Assist adresse la demande à la compagnie et conteste les refus infondés." },
  { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue : aucune avance, commission uniquement en cas de succès." },
];

export const PAGES_DESTINATIONS: PageDestination[] = [
  // 1. Barcelone
  {
    slug: "vol-retarde-barcelone-indemnisation",
    code: "BCN",
    ville: "Barcelone",
    title: "Vol retardé Barcelone : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Barcelone retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Destination n°1 des city-breaks depuis la France, Barcelone est reliée quotidiennement par de nombreux vols. Si votre vol vers ou depuis Barcelone (aéroport El Prat, BCN) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Barcelone étant dans l'Union européenne, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Barcelone : vos droits" },
      { type: "p", text: "Que vous partiez de France vers Barcelone ou que vous rentriez de Barcelone, votre vol relève du règlement EC 261/2004 : dans les deux cas, il part d'un aéroport de l'Union européenne. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, quel que soit le prix du billet." },
      { type: "h2", text: "L'aéroport de Barcelone-El Prat" },
      { type: "p", text: "Barcelone-El Prat (BCN) est le deuxième aéroport d'Espagne et l'un des plus fréquentés d'Europe. C'est le **hub de Vueling**, ce qui en fait une plaque tournante très active, avec un trafic dense de city-break et d'affaires. Cette intensité, surtout aux beaux jours, favorise les retards d'exploitation, qui restent indemnisables." },
      { type: "h2", text: "Les compagnies qui desservent Barcelone depuis la France" },
      { type: "p", text: "Barcelone est reliée à la France par **Vueling** (dont c'est le hub), **easyJet**, **Ryanair**, **Air France** et **Transavia**, au départ de Paris, Nice, Lyon, Marseille, Toulouse et bien d'autres villes. Quelle que soit la compagnie, low-cost ou traditionnelle, vos droits sont identiques." },
      { type: "h2", text: "Combien pour un Paris–Barcelone retardé ?" },
      { type: "p", text: "Un Paris–Barcelone (environ 850 km) relève du palier à **250 €**. Les liaisons depuis Nice ou Marseille, plus courtes, relèvent aussi des 250 €. Le montant est forfaitaire : il ne dépend ni du tarif payé, ni de la classe." },
      { type: "h2", text: "Hub Vueling : correspondances comprises" },
      { type: "p", text: "Comme Barcelone est le hub de Vueling, de nombreux voyageurs y transitent. En cas de **correspondance manquée** sur une réservation unique à cause d'un premier vol en retard, l'indemnité se calcule sur le retard à la destination finale — un principe utile à connaître pour les trajets Vueling au départ ou via Barcelone." },
      { type: "h2", text: "Annulation, surbooking et refus abusifs" },
      { type: "p", text: "En cas d'**annulation** (moins de 14 jours avant le départ) ou de **refus d'embarquement** subi, l'indemnité peut être due, en plus du remboursement ou de la prise en charge. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables ; seules des circonstances exceptionnelles réelles exonèrent." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Barcelone", km: "≈ 850 km", montant: "250 €" },
      { route: "Nice – Barcelone", km: "≈ 650 km", montant: "250 €" },
      { route: "Marseille – Barcelone", km: "≈ 500 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Barcelone a été retardé, ai-je droit à une indemnité ?", a: "Oui. Barcelone étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Barcelone retardé de 3 heures, c'est combien ?", a: "Environ 850 km : le vol relève du palier à 250 € par passager." },
      { q: "J'ai raté une correspondance Vueling à Barcelone, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 € selon la distance totale." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["vueling", "easyjet", "ryanair"],
  },

  // 2. Madrid
  {
    slug: "vol-retarde-madrid-indemnisation",
    code: "MAD",
    ville: "Madrid",
    title: "Vol retardé Madrid : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Madrid retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale espagnole et grande porte vers l'Amérique latine, Madrid est très reliée à la France. Si votre vol vers ou depuis Madrid (aéroport Barajas, MAD) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Madrid étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Madrid : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Madrid, comme un vol retour depuis Madrid, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet." },
      { type: "h2", text: "L'aéroport de Madrid-Barajas" },
      { type: "p", text: "Madrid-Adolfo Suárez Barajas (MAD) est le premier aéroport d'Espagne et le **hub d'Iberia**. C'est l'une des principales portes d'entrée européennes vers l'**Amérique latine**, avec un fort trafic de correspondances. Cette activité intense, en particulier aux heures de pointe, favorise les retards d'exploitation, qui restent indemnisables." },
      { type: "h2", text: "Les compagnies qui desservent Madrid depuis la France" },
      { type: "p", text: "Madrid est reliée à la France par **Iberia** (dont c'est le hub), **Air France**, **easyJet** et **Vueling**, au départ de Paris et des grandes villes françaises. Que le vol soit opéré par une compagnie traditionnelle ou low-cost, vos droits sont identiques." },
      { type: "h2", text: "Combien pour un Paris–Madrid retardé ?" },
      { type: "p", text: "Un Paris–Madrid (environ 1 050 km) relève du palier à **250 €**. Le montant est forfaitaire et ne dépend ni du tarif, ni de la classe." },
      { type: "h2", text: "Correspondances Iberia vers l'Amérique latine" },
      { type: "p", text: "De nombreux voyageurs français rejoignent l'**Amérique latine** via Madrid avec Iberia. En cas de **correspondance manquée** à Madrid sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : compte tenu des distances transatlantiques, elle atteint souvent **600 €**." },
      { type: "h2", text: "Annulation, surbooking, motifs d'exonération" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due, en plus du remboursement ou de la prise en charge. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Madrid", km: "≈ 1 050 km", montant: "250 €" },
      { route: "Madrid – Buenos Aires (corresp.)", km: "≈ 10 000 km", montant: "600 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Madrid a été retardé, ai-je droit à une indemnité ?", a: "Oui. Madrid étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Madrid retardé, c'est combien ?", a: "Environ 1 050 km : le vol relève du palier à 250 € par passager." },
      { q: "J'ai raté une correspondance à Madrid vers l'Amérique latine, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 € compte tenu des distances." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["iberia", "air-france", "vueling"],
  },

  // 3. Rome
  {
    slug: "vol-retarde-rome-indemnisation",
    code: "FCO",
    ville: "Rome",
    title: "Vol retardé Rome : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Rome retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Rome figure parmi les destinations touristiques les plus prisées des Français. Si votre vol vers ou depuis Rome (aéroport de Fiumicino, FCO) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Rome étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Rome : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Rome, comme un vol retour depuis Rome, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Rome-Fiumicino" },
      { type: "p", text: "Rome-Fiumicino (FCO) est le premier aéroport d'Italie et le **hub d'ITA Airways**, la compagnie nationale italienne qui a succédé à Alitalia. Le trafic touristique y est massif toute l'année, avec des pics au printemps et en été qui favorisent les retards d'exploitation, indemnisables." },
      { type: "h2", text: "ITA Airways, ex-Alitalia" },
      { type: "p", text: "Beaucoup de voyageurs cherchent encore « Alitalia » : sachez qu'**ITA Airways est une société distincte** qui a remplacé Alitalia. Pour un vol opéré par ITA, la réclamation s'adresse à ITA ; un ancien vol Alitalia relève, lui, de la procédure de liquidation d'Alitalia. Il est donc important d'identifier le transporteur qui a réellement opéré votre vol." },
      { type: "h2", text: "Les compagnies qui desservent Rome depuis la France" },
      { type: "p", text: "Rome est reliée à la France par **ITA Airways**, **Air France**, **easyJet**, **Vueling** et **Transavia**, au départ de Paris, Nice, Lyon, Marseille et d'autres villes. Vos droits sont les mêmes quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Rome retardé ?" },
      { type: "p", text: "Un Paris–Rome (environ 1 100 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due, en plus du remboursement ou de la prise en charge. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Rome", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Nice – Rome", km: "≈ 700 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Rome a été retardé, ai-je droit à une indemnité ?", a: "Oui. Rome étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Rome retardé, c'est combien ?", a: "Environ 1 100 km : le vol relève du palier à 250 € par passager." },
      { q: "J'avais un vol Alitalia, qui gère ma réclamation ?", a: "ITA Airways est une société distincte qui a remplacé Alitalia et ne reprend pas les réclamations des anciens vols Alitalia. Pour un vol ITA, la réclamation s'adresse à ITA." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["ita-airways", "easyjet", "vueling"],
  },

  // 4. Lisbonne
  {
    slug: "vol-retarde-lisbonne-indemnisation",
    code: "LIS",
    ville: "Lisbonne",
    title: "Vol retardé Lisbonne : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Lisbonne retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Lisbonne séduit un nombre croissant de voyageurs français. Si votre vol vers ou depuis Lisbonne (LIS) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Lisbonne étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Lisbonne : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Lisbonne, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Lisbonne" },
      { type: "p", text: "L'aéroport Humberto Delgado de Lisbonne (LIS) est le premier du Portugal et le **hub de TAP Air Portugal**. Situé très près du centre-ville, il connaît une forte affluence et une saturation régulière, sources de retards d'exploitation qui restent indemnisables." },
      { type: "h2", text: "Correspondances TAP vers le Brésil" },
      { type: "p", text: "Lisbonne est une grande porte vers le **Brésil** et l'Afrique lusophone avec TAP. En cas de **correspondance manquée** à Lisbonne sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : sur un trajet transatlantique, elle atteint souvent **600 €**." },
      { type: "h2", text: "Les compagnies qui desservent Lisbonne depuis la France" },
      { type: "p", text: "Lisbonne est reliée à la France par **TAP Air Portugal** (dont c'est le hub), **easyJet**, **Transavia** et **Vueling**, au départ de Paris et de nombreuses villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Lisbonne retardé ?" },
      { type: "p", text: "Un Paris–Lisbonne (environ 1 450 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Lisbonne", km: "≈ 1 450 km", montant: "250 €" },
      { route: "Lisbonne – São Paulo (corresp.)", km: "≈ 7 800 km", montant: "600 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Lisbonne a été retardé, ai-je droit à une indemnité ?", a: "Oui. Lisbonne étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Lisbonne retardé, c'est combien ?", a: "Environ 1 450 km : le vol relève du palier à 250 € par passager." },
      { q: "J'ai raté une correspondance TAP vers le Brésil, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 €." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["tap", "easyjet", "transavia"],
  },

  // 5. Porto
  {
    slug: "vol-retarde-porto-indemnisation",
    code: "OPO",
    ville: "Porto",
    title: "Vol retardé Porto : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Porto retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Porto est l'une des destinations low-cost les plus prisées depuis la France. Si votre vol vers ou depuis Porto (OPO) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Porto étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Porto : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Porto, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Porto" },
      { type: "p", text: "L'aéroport Francisco Sá Carneiro de Porto (OPO) est le deuxième du Portugal et une plaque tournante **low-cost** majeure. Il est desservi depuis un grand nombre de villes françaises, avec une très forte affluence loisirs, source de retards d'exploitation en haute saison." },
      { type: "h2", text: "Les low-cost à Porto : mêmes obligations" },
      { type: "p", text: "Porto est massivement desservie par des compagnies **low-cost** : **Ryanair**, **easyJet**, **Transavia**, **Volotea**, aux côtés de **TAP**. Point important : une compagnie à bas prix a **exactement les mêmes obligations** d'indemnisation qu'une compagnie traditionnelle. Le tarif de votre billet ne réduit en rien votre droit." },
      { type: "h2", text: "Combien pour un Paris–Porto retardé ?" },
      { type: "p", text: "Un Paris–Porto (environ 1 200 km) relève du palier à **250 €**. Les liaisons depuis d'autres villes françaises relèvent généralement du même palier. Le montant est forfaitaire." },
      { type: "h2", text: "Attention aux bons d'achat" },
      { type: "p", text: "En cas de perturbation, une compagnie low-cost peut proposer un **bon d'achat** ou un avoir. Sachez que l'indemnité EC 261/2004 est due **en argent** : accepter un bon revient souvent à renoncer à une somme supérieure. Vérifiez vos droits avant d'accepter." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Porto", km: "≈ 1 200 km", montant: "250 €" },
      { route: "Lyon – Porto", km: "≈ 1 300 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Porto a été retardé, ai-je droit à une indemnité ?", a: "Oui. Porto étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Porto retardé, c'est combien ?", a: "Environ 1 200 km : le vol relève du palier à 250 € par passager." },
      { q: "Une low-cost sur Porto doit-elle vraiment indemniser ?", a: "Oui, sans exception : une compagnie à bas prix a exactement les mêmes obligations qu'une compagnie traditionnelle." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["tap", "ryanair", "volotea"],
  },

  // 6. Athènes
  {
    slug: "vol-retarde-athenes-indemnisation",
    code: "ATH",
    ville: "Athènes",
    title: "Vol retardé Athènes : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Athènes retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Porte d'entrée de la Grèce et de ses îles, Athènes attire chaque été des foules de voyageurs français. Si votre vol vers ou depuis Athènes (ATH) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Athènes étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Athènes : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Athènes, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport d'Athènes" },
      { type: "p", text: "L'aéroport international d'Athènes (ATH) est le **hub d'Aegean Airlines** et la principale porte vers les **îles grecques**. Très saisonnier, il connaît de forts pics d'affluence de juin à septembre, propices aux retards d'exploitation, indemnisables." },
      { type: "h2", text: "Vols vacances et correspondances vers les îles" },
      { type: "p", text: "Beaucoup de voyageurs enchaînent un vol vers Athènes puis une **correspondance vers une île grecque** (Santorin, Mykonos…). Sur une réservation unique, un retard qui vous fait manquer la correspondance se calcule sur le retard à la destination finale. Les vols intérieurs grecs, partant d'un aéroport de l'UE, sont eux aussi couverts." },
      { type: "h2", text: "Les compagnies qui desservent Athènes depuis la France" },
      { type: "p", text: "Athènes est reliée à la France par **Aegean Airlines**, **Transavia**, **Air France**, **easyJet** et **Sky Express**, au départ de Paris, Nice, Marseille et d'autres villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Athènes retardé ?" },
      { type: "p", text: "Un Paris–Athènes (environ 2 100 km) relève du palier à **400 €** : c'est l'une des destinations de cette liste à dépasser 1 500 km. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol — de quoi vérifier aussi un vol de vacances d'un été précédent. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous." },
    ],
    trajets: [
      { route: "Paris – Athènes", km: "≈ 2 100 km", montant: "400 €" },
      { route: "Nice – Athènes", km: "≈ 1 650 km", montant: "400 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Athènes a été retardé, ai-je droit à une indemnité ?", a: "Oui. Athènes étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Athènes retardé de 3 heures, c'est combien ?", a: "Environ 2 100 km : le vol relève du palier à 400 € par passager." },
      { q: "Une correspondance vers une île grecque manquée est-elle couverte ?", a: "Oui, sur une réservation unique : l'indemnité se calcule sur le retard à la destination finale, et les vols intérieurs grecs sont eux aussi couverts." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["aegean", "transavia", "sky-express"],
  },

  // 7. Amsterdam
  {
    slug: "vol-retarde-amsterdam-indemnisation",
    code: "AMS",
    ville: "Amsterdam",
    title: "Vol retardé Amsterdam : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Amsterdam retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Amsterdam est à la fois une destination city-break très prisée et l'un des plus grands hubs européens. Si votre vol vers ou depuis Amsterdam (Schiphol, AMS) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Amsterdam étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Amsterdam : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Amsterdam, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "Schiphol, un hub de correspondances majeur" },
      { type: "p", text: "Amsterdam-Schiphol (AMS) est le **hub de KLM** et l'un des plus grands aéroports de correspondances d'Europe. De très nombreux voyageurs français y transitent vers le reste du monde, ce qui en fait un point sensible pour les **correspondances manquées**." },
      { type: "h2", text: "Correspondance ratée à Amsterdam" },
      { type: "p", text: "Si un premier vol en retard vous fait manquer votre correspondance à Schiphol, l'indemnité se calcule sur le **retard à votre destination finale**, sur une réservation unique. Sur un vol long-courrier au départ d'Amsterdam, elle peut atteindre **600 €**." },
      { type: "h2", text: "Les compagnies qui desservent Amsterdam depuis la France" },
      { type: "p", text: "Amsterdam est reliée à la France par **KLM** (dont c'est le hub), **Transavia**, **easyJet** et **Air France**, au départ de Paris et des grandes villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Amsterdam retardé ?" },
      { type: "p", text: "Un Paris–Amsterdam (environ 430 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, reconstitue les trajets à correspondance et mène la réclamation jusqu'au versement." },
    ],
    trajets: [
      { route: "Paris – Amsterdam", km: "≈ 430 km", montant: "250 €" },
      { route: "Amsterdam – New York (corresp.)", km: "≈ 5 850 km", montant: "600 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Amsterdam a été retardé, ai-je droit à une indemnité ?", a: "Oui. Amsterdam étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Amsterdam retardé, c'est combien ?", a: "Environ 430 km : le vol relève du palier à 250 € par passager." },
      { q: "J'ai raté ma correspondance à Schiphol, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 € selon la distance totale." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["klm", "transavia", "easyjet"],
  },

  // 8. Bruxelles
  {
    slug: "vol-retarde-bruxelles-indemnisation",
    code: "BRU",
    ville: "Bruxelles",
    title: "Vol retardé Bruxelles : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Bruxelles retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale de l'Europe, Bruxelles est très reliée à la France pour les affaires comme pour le tourisme. Si votre vol vers ou depuis Bruxelles (BRU) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Bruxelles étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Bruxelles : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Bruxelles, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Bruxelles" },
      { type: "p", text: "Bruxelles-Zaventem (BRU) est le principal aéroport belge et le **hub de Brussels Airlines**. Il dessert un vaste réseau européen et intercontinental, avec un fort **réseau africain**. Le trafic d'affaires y est important, en particulier autour des institutions européennes." },
      { type: "h2", text: "Une courte distance depuis Paris" },
      { type: "p", text: "La distance Paris–Bruxelles est faible (environ 260 km), ce qui place ces vols au palier de **250 €**. Attention toutefois : sur une distance aussi courte, beaucoup de voyageurs privilégient le train ; les vols concernent souvent des **correspondances** au départ de Bruxelles vers d'autres destinations." },
      { type: "h2", text: "Correspondances vers l'Afrique" },
      { type: "p", text: "Bruxelles est une porte importante vers l'**Afrique** avec Brussels Airlines. En cas de **correspondance manquée** à Bruxelles sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : sur un vol long-courrier vers l'Afrique, elle atteint souvent **600 €**." },
      { type: "h2", text: "Les compagnies qui desservent Bruxelles depuis la France" },
      { type: "p", text: "Bruxelles est reliée à la France par **Brussels Airlines** (dont c'est le hub) et **Air France**, notamment au départ de Paris et de villes régionales. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Bruxelles", km: "≈ 260 km", montant: "250 €" },
      { route: "Bruxelles – Dakar (corresp.)", km: "≈ 4 200 km", montant: "600 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Bruxelles a été retardé, ai-je droit à une indemnité ?", a: "Oui. Bruxelles étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Bruxelles retardé, c'est combien ?", a: "Environ 260 km : le vol relève du palier à 250 € par passager." },
      { q: "J'ai raté une correspondance à Bruxelles vers l'Afrique, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 €." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["brussels-airlines", "air-france"],
  },

  // 9. Berlin
  {
    slug: "vol-retarde-berlin-indemnisation",
    code: "BER",
    ville: "Berlin",
    title: "Vol retardé Berlin : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Berlin retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale allemande et destination city-break majeure, Berlin est très reliée à la France. Si votre vol vers ou depuis Berlin (BER) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Berlin étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Berlin : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Berlin, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Berlin-Brandebourg" },
      { type: "p", text: "Berlin-Brandebourg (BER), ouvert en 2020, est le principal aéroport de la capitale allemande. Il abrite une **grosse base easyJet** et un trafic city-break intense. Sa montée en charge s'est parfois accompagnée de difficultés opérationnelles, sources de retards indemnisables." },
      { type: "h2", text: "Les compagnies qui desservent Berlin depuis la France" },
      { type: "p", text: "Berlin est reliée à la France par **easyJet** (grosse base), **Lufthansa**, **Air France**, **Ryanair** et **Transavia**, au départ de Paris et de plusieurs villes régionales. Vos droits sont identiques quelle que soit la compagnie, low-cost ou traditionnelle." },
      { type: "h2", text: "Combien pour un Paris–Berlin retardé ?" },
      { type: "p", text: "Un Paris–Berlin (environ 880 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Retard d'un vol Lufthansa : la panne technique reste indemnisable" },
      { type: "p", text: "Si votre vol Lufthansa vers ou depuis Berlin est justifié par un « problème technique », rappelez-vous qu'une **panne technique n'est pas une circonstance exceptionnelle** : l'indemnité reste due. Seuls des événements extérieurs réels (météo, grève des contrôleurs, sécurité) exonèrent la compagnie." },
      { type: "h2", text: "Annulation et surbooking" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due, en plus du remboursement ou de la prise en charge." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Berlin", km: "≈ 880 km", montant: "250 €" },
      { route: "Nice – Berlin", km: "≈ 1 100 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Berlin a été retardé, ai-je droit à une indemnité ?", a: "Oui. Berlin étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Berlin retardé, c'est combien ?", a: "Environ 880 km : le vol relève du palier à 250 € par passager." },
      { q: "Lufthansa invoque un problème technique, ai-je droit ?", a: "Oui. Une panne technique n'est pas une circonstance exceptionnelle : l'indemnité reste due." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "lufthansa", "ryanair"],
  },

  // 10. Milan
  {
    slug: "vol-retarde-milan-indemnisation",
    code: "MXP",
    ville: "Milan",
    title: "Vol retardé Milan : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Milan retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale économique de l'Italie et destination affaires et shopping, Milan est très reliée à la France. Si votre vol vers ou depuis Milan (Malpensa MXP, Bergame BGY ou Linate) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Milan étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Milan : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Milan, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "Trois aéroports pour Milan" },
      { type: "p", text: "Milan est desservie par trois aéroports : **Malpensa (MXP)**, le principal, **Linate (LIN)**, proche du centre et orienté affaires, et **Bergame-Orio al Serio (BGY)**, la base low-cost notamment de Ryanair. Vérifiez bien de quel aéroport partait votre vol : vos droits sont les mêmes, mais l'interlocuteur et le contexte diffèrent." },
      { type: "h2", text: "Affaires et low-cost : mêmes droits" },
      { type: "p", text: "Milan mêle une clientèle **d'affaires** (Linate, Malpensa) et un fort trafic **low-cost** (Bergame). Une compagnie low-cost comme Ryanair a exactement les mêmes obligations d'indemnisation qu'une compagnie traditionnelle : le type de vol ou d'aéroport ne change pas vos droits." },
      { type: "h2", text: "Les compagnies qui desservent Milan depuis la France" },
      { type: "p", text: "Milan est reliée à la France par **easyJet**, **ITA Airways**, **Air France**, **Ryanair** (Bergame) et **Vueling**, au départ de Paris et des grandes villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Milan retardé ?" },
      { type: "p", text: "Un Paris–Milan (environ 640 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Milan", km: "≈ 640 km", montant: "250 €" },
      { route: "Paris – Bergame", km: "≈ 640 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Milan a été retardé, ai-je droit à une indemnité ?", a: "Oui. Milan étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Milan retardé, c'est combien ?", a: "Environ 640 km : le vol relève du palier à 250 € par passager." },
      { q: "Mon vol partait de Bergame en Ryanair, suis-je couvert ?", a: "Oui. Bergame est un aéroport de l'UE ; un vol Ryanair qui en part relève d'EC 261/2004, avec les mêmes montants." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "ita-airways", "ryanair"],
  },

  // 11. Naples
  {
    slug: "vol-retarde-naples-indemnisation",
    code: "NAP",
    ville: "Naples",
    title: "Vol retardé Naples : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Naples retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Porte de la côte amalfitaine et de Pompéi, Naples connaît un tourisme en plein essor. Si votre vol vers ou depuis Naples (NAP) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Naples étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Naples : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Naples, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Naples" },
      { type: "p", text: "L'aéroport de Naples-Capodichino (NAP) est l'un des plus dynamiques d'Italie, porté par l'essor touristique de la Campanie (côte amalfitaine, Capri, Pompéi). Très **saisonnier**, il connaît de forts pics d'affluence l'été, sources de retards d'exploitation indemnisables." },
      { type: "h2", text: "Une destination très saisonnière" },
      { type: "p", text: "Le trafic vers Naples explose à la belle saison, avec de nombreuses lignes loisirs et low-cost. Cette densité, combinée aux rotations serrées, augmente le risque de **retards en cascade** de mai à septembre. Ces perturbations d'affluence ne sont pas des circonstances exceptionnelles et restent indemnisables." },
      { type: "h2", text: "Les compagnies qui desservent Naples depuis la France" },
      { type: "p", text: "Naples est reliée à la France par **easyJet**, **Transavia**, **Vueling**, **Volotea** et **Ryanair**, au départ de Paris, Nice, Lyon et d'autres villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Naples retardé ?" },
      { type: "p", text: "Un Paris–Naples (environ 1 300 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Naples", km: "≈ 1 300 km", montant: "250 €" },
      { route: "Nice – Naples", km: "≈ 700 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Naples a été retardé, ai-je droit à une indemnité ?", a: "Oui. Naples étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Naples retardé, c'est combien ?", a: "Environ 1 300 km : le vol relève du palier à 250 € par passager." },
      { q: "Les retards d'été vers Naples sont-ils indemnisables ?", a: "Oui. Les retards liés à l'affluence saisonnière ne sont pas des circonstances exceptionnelles et restent indemnisables." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "transavia", "volotea"],
  },

  // 12. Venise
  {
    slug: "vol-retarde-venise-indemnisation",
    code: "VCE",
    ville: "Venise",
    title: "Vol retardé Venise : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Venise retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Destination city-break romantique par excellence, Venise attire les voyageurs français toute l'année. Si votre vol vers ou depuis Venise (Marco Polo, VCE) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Venise étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Venise : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Venise, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Venise-Marco Polo" },
      { type: "p", text: "Venise-Marco Polo (VCE) est le principal aéroport desservant la Sérénissime. Le tourisme y est intense toute l'année, avec de très fortes pointes d'affluence, sources de retards d'exploitation qui restent indemnisables." },
      { type: "h2", text: "Une forte affluence toute l'année" },
      { type: "p", text: "Contrairement aux destinations purement estivales, Venise attire des visiteurs en continu (Carnaval, Biennale, ponts, fêtes de fin d'année). Cette pression régulière sur l'aéroport augmente le risque de retards aux heures de pointe. Ces perturbations d'organisation ne sont pas des circonstances exceptionnelles." },
      { type: "h2", text: "Les compagnies qui desservent Venise depuis la France" },
      { type: "p", text: "Venise est reliée à la France par **easyJet**, **Air France**, **Transavia**, **Volotea** et **Vueling**, au départ de Paris et des grandes villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Venise retardé ?" },
      { type: "p", text: "Un Paris–Venise (environ 850 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Venise", km: "≈ 850 km", montant: "250 €" },
      { route: "Nantes – Venise", km: "≈ 1 100 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Venise a été retardé, ai-je droit à une indemnité ?", a: "Oui. Venise étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Venise retardé, c'est combien ?", a: "Environ 850 km : le vol relève du palier à 250 € par passager." },
      { q: "Un retard lié à l'affluence à Venise est-il indemnisable ?", a: "Oui. Les retards d'affluence ou d'organisation ne sont pas des circonstances exceptionnelles et restent indemnisables." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "transavia", "volotea"],
  },

  // 13. Palma de Majorque
  {
    slug: "vol-retarde-palma-majorque-indemnisation",
    code: "PMI",
    ville: "Palma de Majorque",
    title: "Vol retardé Palma : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Palma de Majorque retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Destination vacances par excellence, Palma de Majorque voit affluer chaque été des millions de touristes. Si votre vol vers ou depuis Palma (PMI) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Palma étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Palma : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Palma, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Palma de Majorque" },
      { type: "p", text: "L'aéroport de Palma (PMI), aux Baléares, est l'un des plus fréquentés d'Espagne en été, saturé par le tourisme balnéaire. Cette affluence estivale est la principale cause de retards d'exploitation, qui restent indemnisables." },
      { type: "h2", text: "Les pics de retards de l'été" },
      { type: "p", text: "Palma est la destination vacances typique : de juin à septembre, les vols se densifient à l'extrême et les **retards en cascade** se multiplient. Un avion en retard le matin accumule du retard sur tous ses vols suivants. Ces perturbations d'affluence ne sont pas des circonstances exceptionnelles et ouvrent droit à indemnité." },
      { type: "h2", text: "Les compagnies qui desservent Palma depuis la France" },
      { type: "p", text: "Palma est reliée à la France par **Transavia**, **Vueling**, **easyJet**, **Volotea** et **Ryanair**, au départ de Paris, Nantes, Lyon, Marseille et d'autres villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Palma retardé ?" },
      { type: "p", text: "Un Paris–Palma (environ 1 050 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables. Un bon d'achat proposé ne remplace pas l'indemnité légale, due en argent." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol — de quoi vérifier un vol de vacances d'un été précédent. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous." },
    ],
    trajets: [
      { route: "Paris – Palma", km: "≈ 1 050 km", montant: "250 €" },
      { route: "Nantes – Palma", km: "≈ 1 050 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Palma a été retardé, ai-je droit à une indemnité ?", a: "Oui. Palma étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Palma retardé, c'est combien ?", a: "Environ 1 050 km : le vol relève du palier à 250 € par passager." },
      { q: "Les retards d'été vers Palma sont-ils indemnisables ?", a: "Oui. Les retards liés à l'affluence estivale ne sont pas des circonstances exceptionnelles et restent indemnisables." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["transavia", "vueling", "ryanair"],
  },

  // 14. Dublin
  {
    slug: "vol-retarde-dublin-indemnisation",
    code: "DUB",
    ville: "Dublin",
    title: "Vol retardé Dublin : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Dublin retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale irlandaise et grande base de Ryanair, Dublin est très reliée à la France. Si votre vol vers ou depuis Dublin (DUB) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. L'Irlande étant dans l'Union européenne, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "L'Irlande est dans l'UE : aller et retour couverts" },
      { type: "p", text: "Contrairement au Royaume-Uni sorti de l'Union, l'**Irlande est un État membre de l'UE**. Un vol depuis la France vers Dublin, comme un vol retour depuis Dublin, part donc d'un aéroport de l'Union européenne et relève pleinement du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité peut être due." },
      { type: "h2", text: "L'aéroport de Dublin" },
      { type: "p", text: "Dublin (DUB) est le principal aéroport irlandais et le **hub de Ryanair**, premier transporteur européen, ainsi que d'Aer Lingus. Le trafic y est très dense, avec des rotations serrées typiques du low-cost, sources de retards d'exploitation indemnisables." },
      { type: "h2", text: "Ryanair conteste souvent : ne pas se décourager" },
      { type: "p", text: "Dublin étant le hub de Ryanair, beaucoup de vols vers ou depuis la France sont opérés par cette compagnie. Ryanair est connue pour **rendre les réclamations difficiles** : formulaires maison, refus initiaux fréquents. Un dossier bien argumenté aboutit néanmoins souvent, et l'indemnité est due **en argent**, non en bon d'achat." },
      { type: "h2", text: "Les compagnies qui desservent Dublin depuis la France" },
      { type: "p", text: "Dublin est reliée à la France par **Ryanair** (hub), **Aer Lingus**, **Air France** et **Transavia**, au départ de Paris et de plusieurs villes. Vos droits sont identiques quelle que soit la compagnie." },
      { type: "h2", text: "Combien pour un Paris–Dublin retardé ?" },
      { type: "p", text: "Un Paris–Dublin (environ 780 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et affronte, si besoin, la procédure de Ryanair, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Dublin", km: "≈ 780 km", montant: "250 €" },
      { route: "Nice – Dublin", km: "≈ 1 350 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Dublin a été retardé, ai-je droit à une indemnité ?", a: "Oui. L'Irlande est dans l'UE : l'aller comme le retour sont couverts par EC 261/2004, à partir de 3 heures de retard à l'arrivée." },
      { q: "Un Paris–Dublin retardé, c'est combien ?", a: "Environ 780 km : le vol relève du palier à 250 € par passager." },
      { q: "Ryanair a refusé ma demande sur un vol Dublin, que faire ?", a: "Un refus n'est pas définitif. Il faut exiger la justification du motif et, s'il n'est pas exonératoire, la contester. L'indemnité est due en argent, pas en bon d'achat." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["ryanair", "air-france", "transavia"],
  },

  // 15. Vienne
  {
    slug: "vol-retarde-vienne-indemnisation",
    code: "VIE",
    ville: "Vienne",
    title: "Vol retardé Vienne : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Vienne retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Capitale autrichienne réputée pour sa culture et ses affaires, Vienne est bien reliée à la France. Si votre vol vers ou depuis Vienne (VIE) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Vienne étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Vienne : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Vienne, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Vienne-Schwechat" },
      { type: "p", text: "Vienne-Schwechat (VIE) est le principal aéroport autrichien et le hub d'**Austrian Airlines** (groupe Lufthansa). C'est une plateforme importante vers l'Europe centrale et de l'Est, avec un trafic mêlant affaires, institutions et tourisme culturel." },
      { type: "h2", text: "Affaires et culture : un trafic régulier" },
      { type: "p", text: "Vienne attire une clientèle **d'affaires** (sièges d'organisations internationales) et **culturelle** (opéra, musées) tout au long de l'année. Ce trafic régulier expose les passagers à des retards d'exploitation aux heures de pointe, indemnisables comme partout." },
      { type: "h2", text: "Les compagnies qui desservent Vienne depuis la France" },
      { type: "p", text: "Vienne est reliée à la France par **Austrian Airlines**, **easyJet**, **Air France** et **Transavia**, au départ de Paris et de villes régionales. Vos droits sont identiques quelle que soit la compagnie. Sur un vol Austrian, une panne technique ou une grève du personnel de la compagnie restent indemnisables." },
      { type: "h2", text: "Combien pour un Paris–Vienne retardé ?" },
      { type: "p", text: "Un Paris–Vienne (environ 1 030 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Seules des circonstances exceptionnelles réelles (météo, grève des contrôleurs, sécurité) exonèrent la compagnie." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Vienne", km: "≈ 1 030 km", montant: "250 €" },
      { route: "Nice – Vienne", km: "≈ 900 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Vienne a été retardé, ai-je droit à une indemnité ?", a: "Oui. Vienne étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Vienne retardé, c'est combien ?", a: "Environ 1 030 km : le vol relève du palier à 250 € par passager." },
      { q: "Un vol Austrian avec panne technique est-il indemnisable ?", a: "Oui. Une panne technique n'est pas une circonstance exceptionnelle : l'indemnité reste due." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "air-france", "transavia"],
  },

  // 16. Prague
  {
    slug: "vol-retarde-prague-indemnisation",
    code: "PRG",
    ville: "Prague",
    title: "Vol retardé Prague : indemnisation jusqu'à 600 €",
    description:
      "Vol vers ou depuis Prague retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "L'une des destinations city-break les plus populaires d'Europe, Prague est très reliée à la France. Si votre vol vers ou depuis Prague (PRG) a été retardé de 3 heures ou plus, annulé ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. Prague étant dans l'UE, l'aller comme le retour sont couverts. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol vers ou depuis Prague : vos droits" },
      { type: "p", text: "Un vol depuis la France vers Prague, comme un vol retour, part d'un aéroport de l'Union européenne : les deux relèvent du règlement EC 261/2004. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due." },
      { type: "h2", text: "L'aéroport de Prague-Václav Havel" },
      { type: "p", text: "Prague-Václav Havel (PRG) est le principal aéroport tchèque et abrite une **base easyJet**. Le trafic city-break y est très soutenu toute l'année, avec des pics lors des ponts et des fêtes, sources de retards d'exploitation indemnisables." },
      { type: "h2", text: "Une destination city-break très prisée" },
      { type: "p", text: "Prague séduit par son patrimoine et ses prix attractifs, ce qui en fait une destination de week-end privilégiée. La forte demande, notamment sur les vols low-cost, densifie les rotations et augmente le risque de retards aux heures de pointe. Ces perturbations d'organisation restent indemnisables." },
      { type: "h2", text: "Les compagnies qui desservent Prague depuis la France" },
      { type: "p", text: "Prague est reliée à la France par **easyJet** (base), **Air France**, **Transavia**, **Ryanair** et **Vueling**, au départ de Paris et de plusieurs villes. Vos droits sont identiques quelle que soit la compagnie, low-cost ou traditionnelle." },
      { type: "h2", text: "Combien pour un Paris–Prague retardé ?" },
      { type: "p", text: "Un Paris–Prague (environ 880 km) relève du palier à **250 €**. Le montant est forfaitaire et indépendant du prix du billet." },
      { type: "h2", text: "Annulation, surbooking, exonérations" },
      { type: "p", text: "En cas d'**annulation** tardive ou de **refus d'embarquement** subi, l'indemnité peut être due. Une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables." },
      { type: "h2", text: "5 ans pour réclamer" },
      { type: "p", text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé." },
    ],
    trajets: [
      { route: "Paris – Prague", km: "≈ 880 km", montant: "250 €" },
      { route: "Lyon – Prague", km: "≈ 900 km", montant: "250 €" },
    ],
    etapes: ETAPES_STD,
    faq: [
      { q: "Mon vol vers ou depuis Prague a été retardé, ai-je droit à une indemnité ?", a: "Oui. Prague étant dans l'UE, l'aller comme le retour sont couverts : à partir de 3 heures de retard à l'arrivée, l'indemnité peut être due." },
      { q: "Un Paris–Prague retardé, c'est combien ?", a: "Environ 880 km : le vol relève du palier à 250 € par passager." },
      { q: "Un vol low-cost easyJet vers Prague doit-il indemniser ?", a: "Oui. Une compagnie low-cost a exactement les mêmes obligations d'indemnisation qu'une compagnie traditionnelle." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "air-france", "ryanair"],
  },
];

export function getPageDestination(slug: string): PageDestination | undefined {
  return PAGES_DESTINATIONS.find((d) => d.slug === slug);
}

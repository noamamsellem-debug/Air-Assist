/**
 * Contenu SEO unique par compagnie (pages « indemnisation vol retardé [X] »).
 * Gabarit : src/components/seo/CompagniePage.tsx. Chaque objet apporte le texte
 * propre à la compagnie (intro, corps 900-1200 mots, trajets, étapes, FAQ).
 *
 * Faits juridiques communs (à ne pas contredire) : montants forfaitaires
 * EC 261/2004 250/400/600 € selon la distance ; déclenchement à 3 h de retard
 * à l'arrivée ; circonstances exceptionnelles (météo, grève des contrôleurs,
 * sécurité) exonératoires, mais grève du personnel de la compagnie et panne
 * technique restent indemnisables ; règle territoriale (départ UE, ou arrivée
 * UE sur compagnie UE) ; 5 ans pour réclamer en France.
 */
import type { Bloc } from "@/components/seo/SeoPage";

export type PageCompagnie = {
  slug: string;
  nom: string;
  title: string;
  description: string;
  intro: string;
  corps: Bloc[];
  trajets: { route: string; km: string; montant: string }[];
  etapes: { titre: string; texte: string }[];
  faq: { q: string; a: string }[];
};

export const PAGES_COMPAGNIES: PageCompagnie[] = [
  // ─── 1. Transavia ──────────────────────────────────────────────────────────
  {
    slug: "transavia",
    nom: "Transavia",
    title: "Indemnisation vol retardé Transavia : jusqu'à 600 €",
    description:
      "Vol Transavia retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol Transavia retardé, annulé ou surbooké peut vous ouvrir droit à une indemnité forfaitaire allant jusqu'à 600 €, au titre du règlement européen EC 261/2004. Cette somme est due par la compagnie, quel que soit le prix de votre billet low-cost. Transavia opère beaucoup de vols loisirs saisonniers au départ d'Orly, Nantes, Lyon ou Montpellier, où les retards se multiplient en haute saison. Air Assist vérifie gratuitement votre éligibilité et se charge de toute la réclamation auprès de Transavia — vous n'avancez aucun frais et ne payez une commission qu'en cas d'indemnisation.",
    corps: [
      { type: "h2", text: "Vos droits en cas de vol Transavia retardé" },
      {
        type: "p",
        text: "Le règlement EC 261/2004 protège les passagers de tous les vols au départ d'un aéroport de l'Union européenne, y compris ceux d'une compagnie low-cost comme Transavia. Ce qui compte n'est pas le retard au décollage, mais **l'heure réelle d'arrivée** à destination : dès que vous arrivez avec **3 heures de retard ou plus**, une indemnité forfaitaire peut être due. Elle s'ajoute, le cas échéant, à la prise en charge (boissons, repas, hébergement) que la compagnie doit assurer pendant l'attente.",
      },
      { type: "h2", text: "Transavia France : à qui adresser la réclamation ?" },
      {
        type: "p",
        text: "Transavia appartient au groupe Air France-KLM, mais l'essentiel des vols au départ de France sont opérés par **Transavia France**, une entité juridique distincte. Concrètement, votre réclamation doit être adressée à **Transavia**, et non à Air France : ce sont deux transporteurs différents, avec leurs propres services de traitement. C'est un point qui prête souvent à confusion et fait perdre du temps aux passagers qui écrivent au mauvais interlocuteur. Air Assist identifie la bonne entité et adresse le dossier directement au bon service.",
      },
      { type: "h2", text: "Combien pouvez-vous obtenir selon la distance ?" },
      {
        type: "p",
        text: "Le montant est **forfaitaire** et dépend uniquement de la distance du vol. Sur le réseau Transavia, un Orly–Porto (environ 1 200 km) relève du palier à **250 €**, tandis qu'un Orly–Athènes (environ 2 100 km) ou un Orly–Marrakech (environ 1 900 km) atteint **400 €**. Même un long trajet comme Orly–Tel Aviv (environ 3 300 km) reste dans la tranche des 400 €, juste sous le seuil des 3 500 km qui déclenche les 600 €. Le prix payé pour le billet n'entre jamais en compte : un vol acheté 39 € peut donner lieu à 400 € d'indemnité.",
      },
      { type: "h2", text: "Vols loisirs saisonniers : pourquoi les retards s'accumulent l'été" },
      {
        type: "p",
        text: "Transavia est une compagnie de loisirs : ses destinations phares (Grèce, Portugal, Espagne, Italie, Maghreb, Baléares, Canaries, Israël) sont fortement sollicitées de juin à septembre. La densité des rotations, la saturation des aéroports et les enchaînements serrés d'avions provoquent alors des **retards en cascade**. Un appareil en retard le matin accumule du retard sur ses vols suivants dans la journée. Ces perturbations d'organisation ou d'affluence ne sont pas des circonstances exceptionnelles : l'indemnité reste due.",
      },
      { type: "h2", text: "Retard, annulation, surbooking : les trois cas indemnisables" },
      {
        type: "ul",
        items: [
          "**Retard** : 3 heures ou plus à l'arrivée à destination finale.",
          "**Annulation** : sauf si Transavia vous a prévenu au moins 14 jours avant le départ ; le remboursement du billet reste dû dans tous les cas.",
          "**Refus d'embarquement (surbooking)** : indemnité immédiate si vous êtes refusé contre votre gré alors que vous étiez à l'heure avec une réservation valide.",
        ],
      },
      { type: "h2", text: "Quand Transavia peut refuser de vous indemniser" },
      {
        type: "p",
        text: "La compagnie peut s'exonérer de l'indemnité (mais pas de la prise en charge) en cas de **circonstances exceptionnelles** : météo dangereuse, grève des contrôleurs aériens, consigne de sécurité. En revanche, une **panne technique** de l'avion relève de l'exploitation normale et reste indemnisable, tout comme une **grève du personnel de Transavia**. Ne renoncez pas devant un premier refus invoquant vaguement la météo : le motif doit être réel et vérifiable.",
      },
      { type: "h2", text: "Vous avez 5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai pour faire valoir vos droits est de **5 ans** à compter de la date du vol. Il n'est donc jamais trop tard pour vérifier un vol Transavia perturbé lors d'un été précédent. Rassemblez votre confirmation de réservation, votre carte d'embarquement et tout e-mail reçu de la compagnie : ces éléments accélèrent le traitement.",
      },
      { type: "h2", text: "Pourquoi passer par Air Assist" },
      {
        type: "p",
        text: "Adresser la bonne entité, calculer le retard à l'arrivée, contester un refus injustifié : les démarches sont chronophages. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au versement. Vous ne payez rien tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Orly – Porto", km: "≈ 1 200 km", montant: "250 €" },
      { route: "Orly – Marrakech", km: "≈ 1 900 km", montant: "400 €" },
      { route: "Orly – Athènes", km: "≈ 2 100 km", montant: "400 €" },
      { route: "Orly – Tel Aviv", km: "≈ 3 300 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol Transavia : Air Assist calcule gratuitement le retard à l'arrivée et le montant applicable." },
      { titre: "Rassemblez vos justificatifs", texte: "Confirmation de réservation, carte d'embarquement et e-mails de la compagnie renforcent le dossier." },
      { titre: "Nous réclamons auprès de Transavia", texte: "Le dossier est adressé à la bonne entité (Transavia France), avec relances et argumentation." },
      { titre: "Vous êtes indemnisé", texte: "Une fois l'indemnité obtenue, vous la recevez : aucune avance de frais, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Un vol Transavia est-il soumis au règlement européen ?", a: "Oui. Tout vol au départ d'un aéroport de l'UE est couvert par EC 261/2004, y compris ceux d'une compagnie low-cost comme Transavia." },
      { q: "Combien pour un Orly–Athènes retardé de plus de 3 heures ?", a: "Environ 2 100 km : le vol relève du palier à 400 € par passager." },
      { q: "Transavia invoque la météo, ai-je encore droit à une indemnité ?", a: "Seule une météo réellement dangereuse exonère la compagnie. Le motif doit être vérifiable ; un premier refus n'est pas définitif et peut être contesté." },
      { q: "Quel délai pour réclamer un vol Transavia ?", a: "En France, vous disposez de 5 ans après la date du vol pour faire valoir vos droits." },
    ],
  },

  // ─── 2. easyJet ────────────────────────────────────────────────────────────
  {
    slug: "easyjet",
    nom: "easyJet",
    title: "Indemnisation vol retardé easyJet : jusqu'à 600 €",
    description:
      "Vol easyJet retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol easyJet retardé de 3 heures ou plus, annulé tardivement ou surbooké peut vous donner droit à une indemnité forfaitaire allant jusqu'à 600 €, au titre du règlement EC 261/2004. easyJet est très implantée en France, avec une grosse base à Nice et des vols au départ de Lyon, Paris, Nantes, Bordeaux ou Toulouse. La compagnie refuse fréquemment les demandes en invoquant des « circonstances exceptionnelles » : un dossier solide permet souvent de renverser ce refus. Air Assist vérifie gratuitement votre éligibilité et prend en charge toute la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "easyJet et le règlement EC 261/2004" },
      {
        type: "p",
        text: "easyJet est une compagnie britannique, mais elle opère une large partie de ses vols européens via **easyJet Europe**, sa filiale basée en Autriche et titulaire d'une licence d'exploitation de l'Union européenne. Résultat : les vols intra-européens d'easyJet restent pleinement couverts par le règlement EC 261/2004. Comme pour toute compagnie, le critère décisif est le **retard à l'arrivée** : à partir de 3 heures, l'indemnité forfaitaire peut être due.",
      },
      { type: "h2", text: "Nice, Lyon, Paris : une forte présence en France" },
      {
        type: "p",
        text: "Avec l'une de ses principales bases continentales à **Nice**, easyJet dessert un réseau dense de liaisons vers Londres, Genève, Porto, Naples et de nombreuses villes européennes. Cette intensité, combinée à des rotations serrées typiques du low-cost, expose les passagers à des retards fréquents, notamment aux heures de pointe et en période de vacances. Que vous voyagiez au départ de Nice, Lyon, Paris-CDG, Paris-Orly, Nantes, Bordeaux ou Toulouse, vos droits sont identiques.",
      },
      { type: "h2", text: "Le montant selon votre trajet easyJet" },
      {
        type: "p",
        text: "L'indemnité dépend de la distance. Un Nice–Londres (environ 1 030 km) ou un Nice–Porto (environ 1 350 km) relève du palier à **250 €**. Un Paris–Athènes (environ 2 100 km) atteint **400 €**. Les vols de plus de 3 500 km — rares sur le réseau court et moyen-courrier d'easyJet — donneraient droit à 600 €. Le montant est forfaitaire : il ne dépend ni du tarif payé, ni de la classe.",
      },
      { type: "h2", text: "easyJet refuse souvent : comment contester efficacement" },
      {
        type: "p",
        text: "easyJet a la réputation d'opposer volontiers un refus en invoquant des **circonstances exceptionnelles**. Or ce motif est strictement encadré : seuls des événements extérieurs et incontrôlables (météo dangereuse, grève des contrôleurs aériens, sécurité) en relèvent. Une **panne technique** de l'appareil ou un **problème d'organisation** interne ne sont pas exceptionnels et restent indemnisables. Face à un refus, ne baissez pas les bras : il faut demander la justification précise du motif et, si elle ne tient pas, la contester point par point. C'est exactement ce que fait Air Assist.",
      },
      { type: "h2", text: "Annulation et surbooking : vos autres droits" },
      {
        type: "p",
        text: "En cas d'**annulation**, easyJet doit vous proposer le remboursement ou un réacheminement ; une indemnité s'ajoute si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles. En cas de **refus d'embarquement pour surbooking** contre votre volonté, l'indemnité est due immédiatement, en plus de la prise en charge. Attention aux bons d'achat proposés sur place : ils ne remplacent pas l'indemnité légale, qui se règle en argent.",
      },
      { type: "h2", text: "Combien de temps pour être indemnisé ?" },
      {
        type: "p",
        text: "Le délai de traitement varie selon la coopération de la compagnie : de quelques semaines quand easyJet ne conteste pas, à plusieurs mois lorsqu'un refus doit être contesté, voire davantage si un recours devient nécessaire. En France, vous disposez de **5 ans** après la date du vol pour engager la démarche.",
      },
      { type: "h2", text: "Air Assist gère le bras de fer à votre place" },
      {
        type: "p",
        text: "Relancer, exiger la preuve du motif invoqué, argumenter en droit : c'est décourageant seul. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au bout, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Nice – Londres", km: "≈ 1 030 km", montant: "250 €" },
      { route: "Nice – Porto", km: "≈ 1 350 km", montant: "250 €" },
      { route: "Paris – Athènes", km: "≈ 2 100 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Renseignez votre vol easyJet : nous calculons gratuitement le retard à l'arrivée et le montant dû." },
      { titre: "Exigeons la justification", texte: "En cas de refus, nous demandons à easyJet le motif précis et vérifions s'il constitue réellement une circonstance exceptionnelle." },
      { titre: "Nous contestons et relançons", texte: "Si le motif ne tient pas, nous le contestons point par point et poursuivons la réclamation." },
      { titre: "Indemnisation", texte: "Vous êtes payé en argent, pas en bon d'achat. Aucune avance : commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "easyJet a refusé ma demande, que faire ?", a: "Un refus n'est pas définitif. Il faut exiger la justification précise du motif invoqué ; s'il ne s'agit pas d'une véritable circonstance exceptionnelle, la demande peut être contestée et aboutir." },
      { q: "Un Nice–Londres retardé, c'est combien ?", a: "Environ 1 030 km : le vol relève du palier à 250 € par passager." },
      { q: "easyJet Europe et easyJet UK, quelle différence pour mes droits ?", a: "Les vols opérés au départ de l'UE, notamment via easyJet Europe (Autriche), relèvent du règlement EC 261/2004. La règle décisive reste le point de départ du vol." },
      { q: "Combien de temps pour être indemnisé par easyJet ?", a: "De quelques semaines à plusieurs mois selon que la compagnie conteste ou non. En France, vous avez 5 ans pour réclamer." },
    ],
  },

  // ─── 3. Ryanair ────────────────────────────────────────────────────────────
  {
    slug: "ryanair",
    nom: "Ryanair",
    title: "Indemnisation vol retardé Ryanair : jusqu'à 600 €",
    description:
      "Vol Ryanair retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Premier transporteur européen, Ryanair est aussi l'une des compagnies qui génèrent le plus de litiges pour retards et annulations. Si votre vol Ryanair est arrivé avec 3 heures de retard ou plus, a été annulé tardivement ou surbooké, vous pouvez réclamer jusqu'à 600 € au titre du règlement EC 261/2004. La compagnie irlandaise conteste fréquemment les demandes et impose ses propres formulaires : c'est précisément là qu'un service spécialisé fait la différence. Air Assist vérifie gratuitement votre éligibilité et prend en charge l'intégralité de la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Ryanair, compagnie de l'UE : des droits pleins et entiers" },
      {
        type: "p",
        text: "Ryanair est une compagnie **irlandaise**, donc immatriculée dans l'Union européenne. Vos vols au départ de France, mais aussi ceux à destination de l'UE, sont donc couverts par le règlement EC 261/2004. La règle est la même que pour toutes les compagnies : dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix très bas de votre billet.",
      },
      { type: "h2", text: "Beauvais, Marseille, Bordeaux : le réseau français" },
      {
        type: "p",
        text: "Ryanair opère depuis plusieurs bases françaises, dont **Beauvais** (sa principale porte d'entrée vers Paris), Marseille, Bordeaux, Toulouse et Carcassonne. Le modèle ultra low-cost repose sur des rotations extrêmement serrées : le moindre aléa en début de journée se répercute sur toute une série de vols. Ces retards d'exploitation ne constituent pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Le montant selon la distance de votre vol" },
      {
        type: "p",
        text: "L'indemnité est forfaitaire. Un Beauvais–Porto (environ 1 450 km) ou un Beauvais–Séville (environ 1 500 km) se situe au palier à **250 €**. Un Beauvais–Marrakech (environ 2 050 km) atteint **400 €**. Peu importe que vous ayez payé 20 € ou 200 € votre billet : le barème ne tient compte que de la distance.",
      },
      { type: "h2", text: "Ryanair complique les démarches : ne vous découragez pas" },
      {
        type: "p",
        text: "Ryanair est connue pour **rendre les réclamations difficiles** : formulaires maison obligatoires, demandes de pièces répétées, refus initiaux fréquents, délais de réponse allongés. Beaucoup de passagers abandonnent en cours de route — ce qui est exactement l'effet recherché. Or un dossier correctement argumenté aboutit souvent, y compris après un premier refus. Confier la réclamation à un tiers qui connaît les procédures de la compagnie et sait relancer au bon moment change radicalement les chances d'aboutir.",
      },
      { type: "h2", text: "Attention aux bons d'achat" },
      {
        type: "p",
        text: "Si Ryanair vous propose un **bon d'achat** (voucher) en compensation, sachez que l'indemnité EC 261/2004 est due **en argent**. Accepter un voucher revient souvent à renoncer à une somme supérieure versée en espèces. Vérifiez toujours ce à quoi vous avez réellement droit avant d'accepter une offre commerciale.",
      },
      { type: "h2", text: "Annulation, surbooking et délai de 5 ans" },
      {
        type: "p",
        text: "En cas d'**annulation**, vous avez droit au remboursement ou au réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **surbooking** subi, l'indemnité est immédiate. Et vous n'êtes pas pressé par le temps : en France, le délai pour réclamer est de **5 ans**, ce qui permet de traiter aussi d'anciens vols Ryanair.",
      },
      { type: "h2", text: "Air Assist affronte la procédure pour vous" },
      {
        type: "p",
        text: "Face à une compagnie aussi procédurière, Air Assist prend tout en charge : vérification gratuite, montage du dossier, relances, contestation des refus. Vous ne payez rien tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Beauvais – Séville", km: "≈ 1 500 km", montant: "250 €" },
      { route: "Beauvais – Porto", km: "≈ 1 450 km", montant: "250 €" },
      { route: "Beauvais – Marrakech", km: "≈ 2 050 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérification gratuite", texte: "Indiquez votre vol Ryanair : nous calculons le retard à l'arrivée et le montant applicable." },
      { titre: "Nous remplissons les formulaires", texte: "Air Assist maîtrise les procédures maison de Ryanair et adresse le dossier complet." },
      { titre: "Relances et contestation", texte: "Nous relançons et contestons les refus infondés jusqu'à obtenir une réponse motivée." },
      { titre: "Indemnisation en argent", texte: "Vous êtes payé en espèces, pas en bon d'achat. Aucune avance, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Ryanair rend-elle vraiment les réclamations difficiles ?", a: "La compagnie impose ses formulaires, demande des pièces à répétition et refuse souvent en premier lieu. Un dossier bien argumenté aboutit néanmoins fréquemment ; ne pas se décourager est essentiel." },
      { q: "On m'a proposé un bon d'achat, dois-je l'accepter ?", a: "Non : l'indemnité EC 261/2004 est due en argent. Un bon d'achat représente souvent moins que la somme réellement due." },
      { q: "Un Beauvais–Marrakech retardé, c'est combien ?", a: "Environ 2 050 km : le vol relève du palier à 400 € par passager." },
      { q: "Puis-je réclamer un vol Ryanair de plusieurs années ?", a: "Oui. En France, le délai est de 5 ans après la date du vol." },
    ],
  },

  // ─── 4. Air France ─────────────────────────────────────────────────────────
  {
    slug: "air-france",
    nom: "Air France",
    title: "Indemnisation vol retardé Air France : jusqu'à 600 €",
    description:
      "Vol Air France retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie nationale française, Air France opère un vaste réseau mondial depuis son hub de Paris-Charles de Gaulle. Un vol Air France retardé de 3 heures ou plus à l'arrivée, annulé moins de 14 jours avant le départ ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Grâce à ses nombreuses liaisons long-courrier, les montants atteignent souvent le palier maximal. Point important : une grève du personnel d'Air France reste indemnisable. Air Assist vérifie gratuitement votre dossier et mène la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un réseau mondial, des indemnités jusqu'à 600 €" },
      {
        type: "p",
        text: "Air France dessert tous les continents depuis Paris-CDG. Sur les vols long-courriers de plus de 3 500 km, l'indemnité forfaitaire atteint **600 €** par passager. Un Paris–New York (environ 5 800 km) ou un Paris–Dakar (environ 4 200 km) relève ainsi du palier maximal, tandis qu'un court trajet européen comme Paris–Rome (environ 1 100 km) donne 250 €. Le règlement s'applique dès **3 heures de retard à l'arrivée**, et le montant ne dépend jamais du prix du billet.",
      },
      { type: "h2", text: "Grève Air France : vous êtes indemnisable" },
      {
        type: "p",
        text: "C'est une distinction essentielle et souvent mal comprise. Une **grève du contrôle aérien** — extérieure à la compagnie — constitue une circonstance exceptionnelle qui exonère Air France de l'indemnité. Mais une **grève du personnel d'Air France** (pilotes, personnel navigant, personnel au sol) relève de la gestion interne de l'entreprise : selon la jurisprudence européenne, elle **n'exonère pas** la compagnie. Si votre vol a été perturbé par un mouvement social interne à Air France, vous pouvez donc prétendre à l'indemnité.",
      },
      { type: "h2", text: "Les vols vers les DOM sont couverts" },
      {
        type: "p",
        text: "Les liaisons entre la France métropolitaine et les départements et régions d'outre-mer (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte) relèvent du droit de l'Union européenne. Un vol Paris–Pointe-à-Pitre ou Paris–Saint-Denis de La Réunion fortement retardé peut donc, lui aussi, ouvrir droit à indemnité — et, compte tenu des distances, au palier de 600 €.",
      },
      { type: "h2", text: "Panne technique : non exceptionnelle" },
      {
        type: "p",
        text: "Air France dispose d'un service client structuré, mais les délais peuvent être longs et les premiers refus fréquents, parfois au motif d'un « problème technique ». Or l'entretien et la fiabilité des avions relèvent de l'activité normale d'un transporteur : une **panne technique n'est pas une circonstance exceptionnelle** et l'indemnité reste due. Seuls des événements réellement extérieurs (météo dangereuse, sécurité, grève des contrôleurs) exonèrent la compagnie.",
      },
      { type: "h2", text: "Correspondance ratée : la règle de la destination finale" },
      {
        type: "p",
        text: "Sur un billet Air France comprenant une correspondance (par exemple via Paris-CDG), l'indemnité se calcule sur le **retard à l'arrivée finale**, pas sur chaque segment. Si un premier vol en retard vous fait manquer votre correspondance et que vous arrivez à destination avec 3 heures de retard ou plus, le droit à indemnité peut s'ouvrir, à condition que le trajet figure sur une **réservation unique**. La distance retenue est celle du trajet complet, ce qui peut porter l'indemnité à 600 €.",
      },
      { type: "h2", text: "Annulation, surbooking et délai" },
      {
        type: "p",
        text: "En cas d'**annulation**, vous avez droit au remboursement ou au réacheminement, plus une indemnité si l'annonce est tardive. En cas de **surbooking** subi, l'indemnité est immédiate. Vous disposez de **5 ans** en France pour engager la démarche.",
      },
      { type: "h2", text: "Air Assist relance et argumente pour vous" },
      {
        type: "p",
        text: "Faire aboutir un dossier face à un grand transporteur demande de la persévérance. Air Assist vérifie gratuitement votre éligibilité, monte le dossier, relance et argumente jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Rome", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Paris – Dakar", km: "≈ 4 200 km", montant: "600 €" },
      { route: "Paris – New York", km: "≈ 5 800 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol Air France : nous calculons le retard à l'arrivée et le montant, jusqu'à 600 € sur le long-courrier." },
      { titre: "Nous qualifions le motif", texte: "Grève interne, panne technique, correspondance ratée : nous établissons que la situation est indemnisable." },
      { titre: "Réclamation et relances", texte: "Air Assist adresse le dossier à Air France et relance jusqu'à obtenir une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol a été touché par une grève Air France, ai-je droit à une indemnité ?", a: "Oui. Une grève du personnel d'Air France ne constitue pas une circonstance exceptionnelle : elle n'exonère pas la compagnie. Seule une grève des contrôleurs aériens, extérieure à Air France, le ferait." },
      { q: "Un Paris–New York retardé, c'est combien ?", a: "Environ 5 800 km : le vol relève du palier maximal, soit 600 € par passager." },
      { q: "Les vols vers les DOM sont-ils couverts ?", a: "Oui, les liaisons entre la métropole et les départements d'outre-mer relèvent du droit de l'UE ; compte tenu des distances, elles atteignent souvent 600 €." },
      { q: "J'ai raté une correspondance Air France, que puis-je réclamer ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : si vous arrivez avec 3 heures de retard ou plus, le droit peut s'ouvrir jusqu'à 600 € selon la distance totale." },
    ],
  },

  // ─── 5. Volotea ────────────────────────────────────────────────────────────
  {
    slug: "volotea",
    nom: "Volotea",
    title: "Indemnisation vol retardé Volotea : jusqu'à 600 €",
    description:
      "Vol Volotea retardé de 3 h ou plus, ou annulé ? Réclamez votre indemnité EC 261/2004. Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie low-cost espagnole immatriculée dans l'Union européenne, Volotea s'est spécialisée dans les liaisons directes entre villes moyennes, sans passer par les grands hubs. Elle opère depuis de nombreuses bases françaises : Nantes, Bordeaux, Strasbourg, Lyon, Marseille, Toulouse, Ajaccio et Bastia. Un vol Volotea retardé de 3 heures ou plus, annulé ou surbooké peut ouvrir droit à une indemnité au titre du règlement EC 261/2004. Comme beaucoup de ses lignes sont des moyen-courriers de moins de 1 500 km, le montant est le plus souvent de 250 €. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous.",
    corps: [
      { type: "h2", text: "Volotea, compagnie européenne : vos droits sont garantis" },
      {
        type: "p",
        text: "Volotea étant immatriculée dans l'Union européenne, ses vols au départ de France comme ceux à destination de l'UE relèvent du règlement EC 261/2004. Que vous décolliez d'un grand aéroport ou d'une ville moyenne, la protection est identique : dès **3 heures de retard à l'arrivée**, une indemnité forfaitaire peut être due.",
      },
      { type: "h2", text: "Des petites villes desservies, les mêmes droits" },
      {
        type: "p",
        text: "La force de Volotea est de relier directement des villes moyennes que les grandes compagnies négligent. Certains passagers pensent, à tort, que ces liaisons secondaires échappent au règlement européen. Ce n'est pas le cas : la taille de l'aéroport ou la notoriété de la ligne n'a **aucune incidence** sur vos droits. Un Nantes–Venise ou un Bordeaux–Palma retardé ouvre les mêmes droits qu'un vol au départ de Paris.",
      },
      { type: "h2", text: "Un réseau surtout à 250 €" },
      {
        type: "p",
        text: "La plupart des lignes Volotea sont des moyen-courriers de moins de 1 500 km, qui relèvent donc du palier à **250 €**. Un Nantes–Venise (environ 1 100 km), un Bordeaux–Palma (environ 850 km) ou un Lyon–Naples (environ 1 000 km) se situent tous dans cette tranche. Les liaisons plus longues, entre 1 500 et 3 500 km, donneraient droit à 400 €. Le montant reste forfaitaire et indépendant du tarif payé.",
      },
      { type: "h2", text: "Retards en haute saison" },
      {
        type: "p",
        text: "Volotea opère de nombreuses lignes saisonnières, très sollicitées l'été, notamment vers l'Italie, l'Espagne et les îles. La concentration des vols pendant les vacances et l'enchaînement serré des rotations favorisent les retards. Ces perturbations d'exploitation ne sont pas des circonstances exceptionnelles : l'indemnité reste due.",
      },
      { type: "h2", text: "Avoir proposé : vous n'êtes pas obligé de l'accepter" },
      {
        type: "p",
        text: "Comme d'autres low-cost, Volotea peut proposer un **avoir** ou un bon en cas de perturbation. Sachez que cet avoir ne remplace pas l'indemnité forfaitaire prévue par le règlement, qui est due en argent. De même, un remboursement de billet en cas d'annulation **se cumule** avec l'indemnité : ce sont deux droits distincts. Vérifiez toujours ce à quoi vous avez droit avant d'accepter une offre commerciale.",
      },
      { type: "h2", text: "Quand l'indemnité n'est pas due" },
      {
        type: "p",
        text: "Volotea peut s'exonérer de l'indemnité en cas de **circonstances exceptionnelles** réelles : météo dangereuse, grève des contrôleurs aériens, consigne de sécurité. En revanche, une **panne technique** ou une **grève interne** de la compagnie restent indemnisables. En cas de doute sur le motif invoqué, faites-le vérifier.",
      },
      { type: "h2", text: "5 ans pour réclamer, et Air Assist s'occupe de tout" },
      {
        type: "p",
        text: "En France, vous avez **5 ans** pour faire valoir vos droits après un vol Volotea perturbé. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Bordeaux – Palma", km: "≈ 850 km", montant: "250 €" },
      { route: "Lyon – Naples", km: "≈ 1 000 km", montant: "250 €" },
      { route: "Nantes – Venise", km: "≈ 1 100 km", montant: "250 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol Volotea, même au départ d'une ville moyenne : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation et carte d'embarquement suffisent à monter le dossier." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à Volotea et relance jusqu'à l'obtention d'une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité en argent, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Volotea dessert des petites villes, suis-je quand même couvert ?", a: "Oui. La taille de l'aéroport ou de la ligne n'a aucune incidence : tout vol Volotea au départ de l'UE relève du règlement EC 261/2004." },
      { q: "Un Nantes–Venise retardé, c'est combien ?", a: "Environ 1 100 km : le vol relève du palier à 250 € par passager." },
      { q: "Volotea me propose un avoir, dois-je l'accepter ?", a: "Non. L'indemnité forfaitaire est due en argent et un avoir ne la remplace pas ; en cas d'annulation, remboursement et indemnité se cumulent." },
      { q: "Quel délai pour réclamer un vol Volotea ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 6. Lufthansa ──────────────────────────────────────────────────────────
  {
    slug: "lufthansa",
    nom: "Lufthansa",
    title: "Indemnisation vol retardé Lufthansa : jusqu'à 600 €",
    description:
      "Vol Lufthansa retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie nationale allemande immatriculée dans l'Union européenne, Lufthansa opère un vaste réseau mondial depuis ses hubs de Francfort et Munich. Un vol Lufthansa retardé de 3 heures ou plus à l'arrivée, annulé tardivement ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Sur ce réseau organisé autour des correspondances, un premier vol en retard qui vous fait manquer un vol suivant peut, lui aussi, être indemnisé. Air Assist vérifie gratuitement votre dossier et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un réseau de hubs, des indemnités jusqu'à 600 €" },
      {
        type: "p",
        text: "Lufthansa structure son réseau autour de **Francfort** et **Munich**, deux hubs mondiaux. Sur les vols long-courriers de plus de 3 500 km, l'indemnité atteint **600 €** : un Francfort–New York (environ 6 200 km) en relève. Un moyen-courrier comme Munich–Le Caire (environ 2 400 km) donne 400 €, et un court trajet Paris–Francfort (environ 450 km) relève des 250 €. L'indemnité se déclenche dès **3 heures de retard à l'arrivée** et ne dépend jamais du prix du billet.",
      },
      { type: "h2", text: "Correspondance ratée via Francfort ou Munich" },
      {
        type: "p",
        text: "C'est le cas le plus fréquent sur Lufthansa. Lorsqu'un premier vol arrive en retard et vous fait **manquer une correspondance** à Francfort ou Munich, l'indemnité se calcule sur le **retard à votre destination finale**, et non sur chaque segment. Si vous arrivez au bout du voyage avec 3 heures de retard ou plus, le droit peut s'ouvrir, à condition que l'ensemble du trajet figure sur une **réservation unique**. La distance retenue étant celle du trajet complet, l'indemnité peut atteindre 600 €.",
      },
      { type: "h2", text: "Raison technique invoquée : l'indemnité reste due" },
      {
        type: "p",
        text: "Lufthansa peut justifier un retard par un « problème technique » sur l'appareil. Or, selon la jurisprudence de la Cour de justice de l'Union européenne, l'entretien et la fiabilité des avions relèvent de l'exercice normal de l'activité : une **panne technique n'est pas une circonstance exceptionnelle** et n'exonère pas la compagnie. Seuls des événements extérieurs et incontrôlables (météo dangereuse, grève des contrôleurs aériens, sécurité) le font.",
      },
      { type: "h2", text: "Grève : la bonne distinction" },
      {
        type: "p",
        text: "Comme pour toute compagnie, il faut distinguer la **grève des contrôleurs aériens**, extérieure à Lufthansa et exonératoire, de la **grève du personnel de Lufthansa** (pilotes, personnel de cabine), qui relève de la gestion interne et **n'exonère pas** la compagnie. Un vol perturbé par un mouvement social interne à Lufthansa peut donc être indemnisé.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, Lufthansa doit vous rembourser ou vous réacheminer ; une indemnité s'ajoute si l'annonce est intervenue moins de 14 jours avant le départ, hors circonstances exceptionnelles. En cas de **refus d'embarquement** pour surbooking subi, l'indemnité est immédiate, en plus de la prise en charge.",
      },
      { type: "h2", text: "Vous avez 5 ans pour agir" },
      {
        type: "p",
        text: "En France, le délai de réclamation est de **5 ans** à compter de la date du vol. Conservez vos cartes d'embarquement et les horaires réels : ils permettent d'établir précisément le retard à l'arrivée, notamment en cas de correspondance.",
      },
      { type: "h2", text: "Air Assist reconstitue le trajet et réclame" },
      {
        type: "p",
        text: "Sur des voyages à correspondances, calculer le retard final et qualifier le motif demande de la méthode. Air Assist vérifie gratuitement votre éligibilité, reconstitue le trajet, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Francfort", km: "≈ 450 km", montant: "250 €" },
      { route: "Munich – Le Caire", km: "≈ 2 400 km", montant: "400 €" },
      { route: "Francfort – New York", km: "≈ 6 200 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol Lufthansa : nous calculons le retard à l'arrivée finale, correspondances comprises." },
      { titre: "Nous reconstituons le trajet", texte: "Sur une réservation unique, nous établissons le retard à destination finale pour déterminer le montant." },
      { titre: "Réclamation et relances", texte: "Air Assist adresse le dossier à Lufthansa et conteste les motifs techniques infondés." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "J'ai raté une correspondance via Francfort ou Munich, que réclamer ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : à partir de 3 heures de retard, le droit peut s'ouvrir jusqu'à 600 € selon la distance totale." },
      { q: "Un Paris–Francfort retardé, c'est combien ?", a: "Environ 450 km : le vol relève du palier à 250 € par passager." },
      { q: "Lufthansa invoque une raison technique, ai-je droit à une indemnité ?", a: "Oui. Une panne technique n'est pas une circonstance exceptionnelle : elle n'exonère pas la compagnie, l'indemnité reste due." },
      { q: "Quel délai pour réclamer un vol Lufthansa ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 7. British Airways ────────────────────────────────────────────────────
  {
    slug: "british-airways",
    nom: "British Airways",
    title: "Indemnisation vol retardé British Airways : jusqu'à 600 €",
    description:
      "Vol British Airways retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004 ou UK261). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Principale compagnie britannique, British Airways opère depuis son hub de Londres-Heathrow un vaste réseau vers la France, l'Europe et le reste du monde. Depuis le Brexit, vos droits dépendent du point de départ du vol : au départ d'un aéroport de l'Union européenne, c'est le règlement EC 261/2004 qui s'applique ; au départ du Royaume-Uni, c'est son équivalent britannique, le UK261, aux montants similaires. Dans les deux cas, un retard de 3 heures ou plus à l'arrivée peut ouvrir droit à indemnité. Air Assist vérifie gratuitement quel régime s'applique et réclame pour vous.",
    corps: [
      { type: "h2", text: "Brexit : avez-vous encore des droits avec British Airways ?" },
      {
        type: "p",
        text: "Oui, sans ambiguïté. Le Brexit n'a pas supprimé la protection des passagers ; il a créé **deux régimes parallèles** selon le point de départ. Pour un vol **au départ d'un aéroport de l'Union européenne** (par exemple Paris, Nice ou Marseille), le règlement **EC 261/2004** continue de s'appliquer pleinement, quelle que soit la nationalité de la compagnie. Pour un vol **au départ du Royaume-Uni**, le Royaume-Uni a transposé le texte européen dans son droit interne sous le nom de **UK261**, avec des droits et des montants équivalents.",
      },
      { type: "h2", text: "EC 261 ou UK261 : lequel s'applique à mon vol ?" },
      {
        type: "p",
        text: "La règle est simple : **c'est l'aéroport de départ qui détermine le régime**. Un Paris–Londres relève d'EC 261/2004 (départ UE). Un Londres–Paris relève, lui, du UK261 (départ Royaume-Uni). Les seuils sont les mêmes de part et d'autre : 3 heures de retard à l'arrivée pour un retard, annulation sauf préavis de 14 jours, et des montants forfaitaires calés sur la distance. En pratique, vos chances d'être indemnisé sont donc comparables dans les deux sens.",
      },
      { type: "h2", text: "Les montants sur les liaisons British Airways" },
      {
        type: "p",
        text: "Les distances entre la France et Londres sont courtes : un Paris–Londres (environ 340 km) et un Nice–Londres (environ 1 030 km) relèvent du palier à **250 €**. Les liaisons long-courriers de British Airways au départ de l'UE, plus rares, pourraient atteindre 400 ou 600 € selon la distance. Le montant reste forfaitaire, indépendant du prix du billet et de la classe.",
      },
      { type: "h2", text: "Retard, annulation, surbooking" },
      {
        type: "p",
        text: "Les trois situations classiques ouvrent des droits. Un **retard** de 3 heures ou plus à l'arrivée, une **annulation** annoncée moins de 14 jours avant le départ (hors circonstances exceptionnelles), ou un **refus d'embarquement** subi pour surbooking : dans chaque cas, une indemnité peut être due, en plus du remboursement ou de la prise en charge selon la situation.",
      },
      { type: "h2", text: "Les motifs qui exonèrent (ou non) la compagnie" },
      {
        type: "p",
        text: "Comme sous le régime européen, British Airways peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo dangereuse, grève des contrôleurs, sécurité). Une **panne technique** de l'appareil ou une **grève du personnel de British Airways** restent, elles, indemnisables. Ces principes valent aussi bien sous EC 261 que sous UK261.",
      },
      { type: "h2", text: "Comment réclamer si le vol partait de Londres" },
      {
        type: "p",
        text: "Pour un vol au départ du Royaume-Uni, la réclamation se fonde sur le UK261 et l'organisme de recours compétent est britannique. La démarche reste accessible, mais les interlocuteurs et les références juridiques diffèrent du régime européen. Air Assist identifie le bon régime, adresse le dossier au bon service et suit la procédure adaptée.",
      },
      { type: "h2", text: "5 ans pour agir, Air Assist s'en charge" },
      {
        type: "p",
        text: "En France, le délai pour réclamer un vol au départ de l'UE est de **5 ans**. Air Assist vérifie gratuitement votre éligibilité, détermine le régime applicable et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Londres", km: "≈ 340 km", montant: "250 €" },
      { route: "Nice – Londres", km: "≈ 1 030 km", montant: "250 €" },
    ],
    etapes: [
      { titre: "Vérification du régime", texte: "Air Assist détermine si votre vol relève d'EC 261/2004 (départ UE) ou du UK261 (départ Royaume-Uni)." },
      { titre: "Calcul de l'indemnité", texte: "Nous établissons le retard à l'arrivée et le montant applicable selon la distance." },
      { titre: "Réclamation adaptée", texte: "Le dossier est adressé au bon service et suit la procédure du régime concerné." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Après le Brexit, ai-je encore des droits avec British Airways ?", a: "Oui. Au départ de l'UE, le règlement EC 261/2004 s'applique ; au départ du Royaume-Uni, c'est le UK261, aux montants équivalents." },
      { q: "EC 261 ou UK261, lequel s'applique à mon vol ?", a: "C'est l'aéroport de départ qui décide : départ UE → EC 261/2004 ; départ Royaume-Uni → UK261." },
      { q: "Un Paris–Londres retardé, c'est combien ?", a: "Environ 340 km : le vol relève du palier à 250 € par passager." },
      { q: "Comment réclamer si mon vol partait de Londres ?", a: "La réclamation se fonde sur le UK261 et l'organisme de recours britannique. Air Assist identifie le bon régime et suit la procédure adaptée." },
    ],
  },

  // ─── 8. Vueling ────────────────────────────────────────────────────────────
  {
    slug: "vueling",
    nom: "Vueling",
    title: "Indemnisation vol retardé Vueling : jusqu'à 600 €",
    description:
      "Vol Vueling retardé de 3 h ou plus, ou annulé ? Réclamez votre indemnité EC 261/2004. Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie low-cost espagnole immatriculée dans l'Union européenne et membre du groupe IAG (comme Iberia et British Airways), Vueling relie intensément la France à l'Espagne et au reste de l'Europe depuis son hub de Barcelone. Un vol Vueling retardé de 3 heures ou plus à l'arrivée, annulé tardivement ou surbooké peut ouvrir droit à une indemnité au titre du règlement EC 261/2004. Comme ses lignes sont surtout des court et moyen-courriers, le montant est le plus souvent de 250 €. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Vueling, compagnie de l'UE : vos droits sont pleins" },
      {
        type: "p",
        text: "Immatriculée en Espagne, Vueling est une compagnie de l'Union européenne. Ses vols au départ de France, comme ceux à destination de l'UE, sont donc couverts par le règlement EC 261/2004. Le critère décisif est le **retard à l'arrivée** : dès 3 heures, l'indemnité forfaitaire peut être due, quel que soit le prix de votre billet.",
      },
      { type: "h2", text: "Le groupe IAG : ce que ça change (et ne change pas)" },
      {
        type: "p",
        text: "Vueling appartient au même groupe qu'**Iberia** et **British Airways** (International Airlines Group). Cette appartenance ne modifie **pas** vos droits ni l'interlocuteur de votre réclamation : chaque compagnie du groupe est un transporteur distinct, et une réclamation pour un vol Vueling s'adresse à **Vueling**. En revanche, si votre voyage combine plusieurs compagnies du groupe sur une même réservation, c'est la règle de la destination finale qui s'applique pour le calcul du retard.",
      },
      { type: "h2", text: "Un réseau surtout à 250 €" },
      {
        type: "p",
        text: "Les liaisons phares de Vueling sont courtes. Un Paris–Barcelone (environ 850 km), un Nice–Barcelone (environ 650 km) ou un Paris–Séville (environ 1 450 km) relèvent tous du palier à **250 €**. Les lignes de 1 500 à 3 500 km donneraient 400 €. Le montant est forfaitaire : il ne dépend ni du tarif, ni de la classe.",
      },
      { type: "h2", text: "Barcelone, un hub très sollicité" },
      {
        type: "p",
        text: "Le hub de Barcelone concentre un trafic important, notamment en saison. La densité des rotations et l'enchaînement des vols exposent les passagers à des retards, en particulier lors des pics d'affluence. Ces perturbations d'exploitation ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Vueling a annulé mon vol : quels droits ?" },
      {
        type: "p",
        text: "En cas d'**annulation**, Vueling doit vous proposer le **remboursement** du billet ou un **réacheminement** vers votre destination. Une **indemnité** s'y ajoute si l'annulation vous a été annoncée moins de 14 jours avant le départ et qu'aucune circonstance exceptionnelle ne s'applique. Remboursement et indemnité sont deux droits distincts qui se cumulent.",
      },
      { type: "h2", text: "Quand l'indemnité n'est pas due" },
      {
        type: "p",
        text: "Vueling peut s'exonérer en cas de **circonstances exceptionnelles** réelles : météo dangereuse, grève des contrôleurs aériens, sécurité. Une **panne technique** ou une **grève du personnel de Vueling** restent en revanche indemnisables. Conservez vos cartes d'embarquement et justificatifs : ils accélèrent le traitement.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol pour engager la démarche. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Nice – Barcelone", km: "≈ 650 km", montant: "250 €" },
      { route: "Paris – Barcelone", km: "≈ 850 km", montant: "250 €" },
      { route: "Paris – Séville", km: "≈ 1 450 km", montant: "250 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol Vueling : nous calculons gratuitement le retard à l'arrivée et le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent à monter le dossier." },
      { titre: "Nous réclamons auprès de Vueling", texte: "Air Assist adresse la demande à Vueling et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Vueling appartient au même groupe qu'Iberia, ça change quoi ?", a: "Rien pour vos droits : chaque compagnie du groupe IAG est un transporteur distinct. Une réclamation pour un vol Vueling s'adresse à Vueling." },
      { q: "Un Paris–Barcelone retardé, c'est combien ?", a: "Environ 850 km : le vol relève du palier à 250 € par passager." },
      { q: "Vueling a annulé mon vol, quels sont mes droits ?", a: "Remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. Les deux se cumulent." },
      { q: "Quel délai pour réclamer un vol Vueling ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 9. SWISS ──────────────────────────────────────────────────────────────
  {
    slug: "swiss",
    nom: "SWISS",
    title: "Indemnisation vol retardé SWISS : jusqu'à 600 €",
    description:
      "Vol SWISS retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (règlement CE 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Swiss International Air Lines (SWISS) est la compagnie nationale suisse, membre du groupe Lufthansa, avec ses hubs de Zurich et Genève. Bien que la Suisse ne fasse pas partie de l'Union européenne, elle applique le règlement CE 261/2004 en vertu d'un accord bilatéral avec l'UE. Concrètement, un vol SWISS au départ de Suisse, ou à destination de la Suisse opéré par une compagnie de l'UE ou suisse, est couvert. Un retard de 3 heures ou plus à l'arrivée peut ouvrir droit à une indemnité jusqu'à 600 €. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous.",
    corps: [
      { type: "h2", text: "La Suisse applique le règlement CE 261/2004" },
      {
        type: "p",
        text: "C'est le point clé pour les vols SWISS. La Suisse n'est pas membre de l'Union européenne, mais elle a intégré le règlement **CE 261/2004** dans son droit via un **accord bilatéral sur le transport aérien** avec l'UE. Les passagers au départ de Suisse bénéficient donc des mêmes droits qu'au départ d'un pays de l'UE : indemnité forfaitaire en cas de retard de 3 heures ou plus à l'arrivée, d'annulation tardive ou de refus d'embarquement.",
      },
      { type: "h2", text: "Quels vols SWISS sont couverts ?" },
      {
        type: "p",
        text: "Sont couverts les vols **au départ de Suisse** (Zurich, Genève, Bâle) quelle que soit la destination, ainsi que les vols **à destination de la Suisse** opérés par une compagnie suisse ou de l'UE. Par extension, un vol SWISS au départ d'un aéroport de l'Union européenne relève aussi du règlement. La règle territoriale suit la même logique que pour l'UE : c'est le point de départ, et la nationalité du transporteur à l'arrivée, qui déterminent la couverture.",
      },
      { type: "h2", text: "Des indemnités jusqu'à 600 €" },
      {
        type: "p",
        text: "Le barème est identique à celui de l'UE. Un court trajet comme Genève–Paris (environ 410 km) relève des **250 €**. Sur le long-courrier, l'indemnité atteint **600 €** : un Zurich–New York (environ 6 300 km) en relève. Le montant est forfaitaire et ne dépend pas du prix payé.",
      },
      { type: "h2", text: "SWISS, membre du groupe Lufthansa" },
      {
        type: "p",
        text: "SWISS fait partie du groupe Lufthansa, mais reste un **transporteur distinct** : une réclamation pour un vol SWISS s'adresse à SWISS. Comme Lufthansa, la compagnie s'appuie sur des hubs et des correspondances : en cas de correspondance manquée sur une **réservation unique**, l'indemnité se calcule sur le retard à la destination finale.",
      },
      { type: "h2", text: "Annulation, surbooking et motifs d'exonération" },
      {
        type: "p",
        text: "En cas d'**annulation**, SWISS doit vous rembourser ou vous réacheminer, avec une indemnité si l'annonce est tardive. En cas de **surbooking** subi, l'indemnité est immédiate. La compagnie peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité), mais une **panne technique** ou une **grève du personnel de SWISS** restent indemnisables.",
      },
      { type: "h2", text: "Réclamer depuis la Suisse : le même cadre" },
      {
        type: "p",
        text: "Parce que la Suisse applique le règlement CE 261/2004, la démarche suit les mêmes principes que dans l'UE. Les délais de prescription peuvent toutefois varier selon le droit applicable au contrat de transport. Dans le doute, il est prudent de ne pas trop attendre pour engager la réclamation.",
      },
      { type: "h2", text: "Air Assist vérifie la couverture et réclame" },
      {
        type: "p",
        text: "Déterminer la couverture d'un vol suisse et qualifier le motif d'un retard demande de la rigueur. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Genève – Paris", km: "≈ 410 km", montant: "250 €" },
      { route: "Zurich – New York", km: "≈ 6 300 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Vérification de la couverture", texte: "Air Assist confirme que votre vol SWISS relève du règlement CE 261/2004 (départ de Suisse ou de l'UE)." },
      { titre: "Calcul de l'indemnité", texte: "Nous établissons le retard à l'arrivée et le montant, jusqu'à 600 € sur le long-courrier." },
      { titre: "Réclamation auprès de SWISS", texte: "Le dossier est adressé à SWISS, avec relances et argumentation jusqu'à réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "La Suisse est-elle couverte par le règlement européen ?", a: "Oui. Via un accord bilatéral avec l'UE, la Suisse applique le règlement CE 261/2004 : les vols au départ de Suisse bénéficient des mêmes droits qu'au départ de l'UE." },
      { q: "Un Genève–Paris retardé, c'est combien ?", a: "Environ 410 km : le vol relève du palier à 250 € par passager." },
      { q: "Mon vol SWISS a été annulé, quels sont mes droits ?", a: "Remboursement ou réacheminement, plus une indemnité si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles." },
      { q: "Quel délai pour réclamer depuis la Suisse ?", a: "La Suisse applique le règlement CE 261/2004 ; les délais de prescription peuvent varier selon le droit du contrat, mieux vaut donc ne pas trop attendre." },
    ],
  },

  // ─── 10. Iberia ────────────────────────────────────────────────────────────
  {
    slug: "iberia",
    nom: "Iberia",
    title: "Indemnisation vol retardé Iberia : jusqu'à 600 €",
    description:
      "Vol Iberia retardé de 3 h ou plus, ou annulé ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie nationale espagnole immatriculée dans l'Union européenne et membre du groupe IAG, Iberia opère depuis son hub de Madrid un fort réseau vers l'Amérique latine. Un vol Iberia retardé de 3 heures ou plus à l'arrivée, annulé tardivement ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 € au titre du règlement EC 261/2004. Sur les liaisons transatlantiques, les distances placent l'indemnité au palier maximal. Air Assist vérifie gratuitement votre dossier, reconstitue les trajets à correspondance et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Iberia, compagnie de l'UE : des droits complets" },
      {
        type: "p",
        text: "Iberia est une compagnie espagnole, donc de l'Union européenne. Ses vols au départ de France et d'Europe, ainsi que ceux à destination de l'UE, sont couverts par le règlement EC 261/2004. Le déclenchement se fait dès **3 heures de retard à l'arrivée**, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Madrid, porte de l'Amérique latine" },
      {
        type: "p",
        text: "Le hub de **Madrid** est le point de correspondance privilégié d'Iberia vers l'Amérique latine. Les liaisons transatlantiques y sont nombreuses et longues : un Madrid–Buenos Aires (environ 10 000 km) ou un Madrid–Lima (environ 9 500 km) relève du palier maximal à **600 €**. À l'inverse, un court Paris–Madrid (environ 1 050 km) relève des 250 €. Le montant, forfaitaire, dépend uniquement de la distance.",
      },
      { type: "h2", text: "Correspondance via Madrid : la destination finale compte" },
      {
        type: "p",
        text: "C'est le cas typique d'un voyage Iberia vers l'Amérique latine : un vol Paris–Madrid en retard qui vous fait **manquer votre correspondance** vers Bogota, Lima ou Buenos Aires. Sur une **réservation unique**, l'indemnité se calcule sur le **retard à la destination finale**, pas sur le segment initial. Si vous arrivez au bout du voyage avec 3 heures de retard ou plus, le droit peut s'ouvrir, et la distance retenue étant celle du trajet complet, l'indemnité atteint 600 €.",
      },
      { type: "h2", text: "Iberia et Iberia Express : mêmes droits" },
      {
        type: "p",
        text: "Iberia opère aussi via sa filiale low-cost **Iberia Express** sur certaines lignes moyen-courriers. Pour vos droits, cela ne change rien : Iberia Express est une compagnie de l'UE et ses vols relèvent du même règlement EC 261/2004, avec les mêmes seuils et les mêmes montants. Votre réclamation s'adresse au transporteur qui a opéré le vol.",
      },
      { type: "h2", text: "Retard, annulation, surbooking" },
      {
        type: "p",
        text: "Un **retard** de 3 heures ou plus à l'arrivée, une **annulation** annoncée moins de 14 jours avant le départ (hors circonstances exceptionnelles) ou un **refus d'embarquement** subi ouvrent chacun des droits. En cas d'annulation, le remboursement ou le réacheminement s'ajoute à l'indemnité éventuelle.",
      },
      { type: "h2", text: "Motifs d'exonération" },
      {
        type: "p",
        text: "Iberia peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo dangereuse, grève des contrôleurs aériens, sécurité). Une **panne technique** de l'appareil ou une **grève du personnel d'Iberia** restent indemnisables. Conservez l'ensemble de vos cartes d'embarquement, indispensables pour reconstituer un trajet à correspondance.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en charge" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, reconstitue les trajets transatlantiques à correspondance, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Madrid", km: "≈ 1 050 km", montant: "250 €" },
      { route: "Madrid – Lima", km: "≈ 9 500 km", montant: "600 €" },
      { route: "Madrid – Buenos Aires", km: "≈ 10 000 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol Iberia : nous calculons le retard à l'arrivée finale, correspondances comprises." },
      { titre: "Nous reconstituons le trajet", texte: "Sur une réservation unique via Madrid, nous établissons le retard à destination finale." },
      { titre: "Réclamation auprès d'Iberia", texte: "Le dossier est adressé au bon transporteur (Iberia ou Iberia Express), avec relances." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, jusqu'à 600 € sur le transatlantique, sans avance de frais." },
    ],
    faq: [
      { q: "J'ai raté une correspondance via Madrid vers l'Amérique latine, que réclamer ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : à partir de 3 heures de retard, le droit peut s'ouvrir jusqu'à 600 €." },
      { q: "Un Paris–Madrid retardé, c'est combien ?", a: "Environ 1 050 km : le vol relève du palier à 250 € par passager." },
      { q: "Iberia et Iberia Express, mêmes droits ?", a: "Oui. Iberia Express est une compagnie de l'UE ; ses vols relèvent du même règlement EC 261/2004, avec les mêmes seuils et montants." },
      { q: "Quel délai pour réclamer un vol Iberia ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 11. Brussels Airlines ─────────────────────────────────────────────────
  {
    slug: "brussels-airlines",
    nom: "Brussels Airlines",
    title: "Indemnisation vol retardé Brussels Airlines : jusqu'à 600 €",
    description:
      "Vol Brussels Airlines retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Compagnie nationale belge immatriculée dans l'Union européenne et membre du groupe Lufthansa, Brussels Airlines opère depuis son hub de Bruxelles un réseau européen et surtout un fort réseau africain. Un vol Brussels Airlines retardé de 3 heures ou plus à l'arrivée, annulé tardivement ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 € au titre du règlement EC 261/2004. Sur les liaisons vers l'Afrique, les distances placent souvent l'indemnité au palier maximal. Air Assist vérifie gratuitement votre dossier et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Brussels Airlines, compagnie de l'UE" },
      {
        type: "p",
        text: "Immatriculée en Belgique, Brussels Airlines est une compagnie de l'Union européenne. Ses vols au départ de France et d'Europe, comme ceux à destination de l'UE, sont couverts par le règlement EC 261/2004. Le seuil de déclenchement est le même que pour toute compagnie : **3 heures de retard à l'arrivée** ouvrent droit à l'indemnité forfaitaire.",
      },
      { type: "h2", text: "Un fort réseau africain, jusqu'à 600 €" },
      {
        type: "p",
        text: "La spécificité de Brussels Airlines est son **réseau africain** dense, hérité de l'histoire de la compagnie. Les liaisons long-courriers vers l'Afrique subsaharienne relèvent du palier maximal : un Bruxelles–Dakar (environ 4 200 km) ou un Bruxelles–Kinshasa (environ 6 300 km) donne **600 €**. À l'inverse, un court Paris–Bruxelles (environ 260 km) relève des 250 €. Le montant, forfaitaire, dépend uniquement de la distance.",
      },
      { type: "h2", text: "Vol vers l'Afrique retardé : quels droits ?" },
      {
        type: "p",
        text: "Un vol Brussels Airlines vers l'Afrique **au départ de Bruxelles** (donc de l'UE) est pleinement couvert : à partir de 3 heures de retard à l'arrivée, l'indemnité — souvent 600 € compte tenu des distances — peut être due. Attention en revanche au sens du trajet : un vol **au départ d'un pays tiers** hors UE, opéré par une compagnie non-UE, ne serait pas couvert. Brussels Airlines étant une compagnie de l'UE, ses vols à destination de l'UE le sont également.",
      },
      { type: "h2", text: "Correspondance ratée à Bruxelles" },
      {
        type: "p",
        text: "Comme sur tout réseau organisé autour d'un hub, une correspondance manquée à **Bruxelles** peut ouvrir droit à indemnité. Sur une **réservation unique**, le calcul se fait sur le **retard à la destination finale**, pas sur chaque segment. Si vous arrivez au bout du voyage avec 3 heures de retard ou plus, le droit peut s'ouvrir, la distance retenue étant celle du trajet complet.",
      },
      { type: "h2", text: "Annulation, surbooking et exonérations" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est tardive. En cas de **surbooking** subi, indemnité immédiate. La compagnie peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité), mais une **panne technique** ou une **grève du personnel de Brussels Airlines** restent indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol pour engager la démarche. Conservez vos cartes d'embarquement et les horaires réels, indispensables pour établir le retard à l'arrivée, notamment sur les longs trajets à correspondance.",
      },
      { type: "h2", text: "Air Assist réclame pour vous" },
      {
        type: "p",
        text: "Sur des liaisons longues et parfois à correspondance, monter un dossier solide demande de la méthode. Air Assist vérifie gratuitement votre éligibilité, reconstitue le trajet, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Bruxelles", km: "≈ 260 km", montant: "250 €" },
      { route: "Bruxelles – Dakar", km: "≈ 4 200 km", montant: "600 €" },
      { route: "Bruxelles – Kinshasa", km: "≈ 6 300 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol Brussels Airlines : nous calculons le retard à l'arrivée et le montant, jusqu'à 600 € vers l'Afrique." },
      { titre: "Nous qualifions la situation", texte: "Départ UE, correspondance à Bruxelles, motif du retard : nous établissons que la situation est indemnisable." },
      { titre: "Réclamation et relances", texte: "Air Assist adresse le dossier à Brussels Airlines et relance jusqu'à réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol Brussels Airlines vers l'Afrique a été retardé, quels sont mes droits ?", a: "Au départ de Bruxelles (donc de l'UE), le vol est couvert : à partir de 3 heures de retard à l'arrivée, l'indemnité peut atteindre 600 € selon la distance." },
      { q: "J'ai raté une correspondance à Bruxelles, que réclamer ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale, jusqu'à 600 € selon la distance totale." },
      { q: "Un Bruxelles–Dakar retardé, c'est combien ?", a: "Environ 4 200 km : le vol relève du palier maximal, soit 600 € par passager." },
      { q: "Quel délai pour réclamer un vol Brussels Airlines ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 12. ITA Airways ───────────────────────────────────────────────────────
  {
    slug: "ita-airways",
    nom: "ITA Airways",
    title: "Indemnisation vol retardé ITA Airways : jusqu'à 600 €",
    description:
      "Vol ITA Airways (ex-Alitalia) retardé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "ITA Airways est la compagnie nationale italienne, qui a succédé à Alitalia et opère depuis son hub de Rome-Fiumicino un réseau européen et intercontinental (son intégration au groupe Lufthansa est en cours). Un vol ITA Airways retardé de 3 heures ou plus à l'arrivée, annulé tardivement ou surbooké peut ouvrir droit à une indemnité allant jusqu'à 600 € au titre du règlement EC 261/2004. Beaucoup de voyageurs cherchent encore « Alitalia » : attention, ITA Airways est une société distincte. Air Assist vérifie gratuitement votre dossier et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "ITA Airways, compagnie italienne de l'UE" },
      {
        type: "p",
        text: "ITA Airways est immatriculée en Italie : c'est une compagnie de l'Union européenne. Ses vols au départ de France et d'Europe, comme ceux à destination de l'UE, relèvent du règlement EC 261/2004. Le seuil de déclenchement est de **3 heures de retard à l'arrivée**, indépendamment du prix du billet.",
      },
      { type: "h2", text: "ITA Airways et Alitalia : une distinction importante" },
      {
        type: "p",
        text: "ITA Airways a **remplacé Alitalia** en 2021, mais c'est une **société juridiquement distincte**. Cette différence a des conséquences concrètes pour les réclamations. Pour un vol **opéré par ITA Airways**, votre réclamation s'adresse à ITA. En revanche, pour un ancien vol **Alitalia** (compagnie placée en liquidation), la réclamation ne relève pas d'ITA Airways mais de la procédure de liquidation d'Alitalia, ce qui est nettement plus complexe. Il est donc essentiel d'identifier quelle compagnie a réellement opéré votre vol.",
      },
      { type: "h2", text: "Rome-Fiumicino, hub méditerranéen" },
      {
        type: "p",
        text: "ITA Airways structure son réseau autour de **Rome-Fiumicino**. Les liaisons courtes comme Paris–Rome (environ 1 100 km) relèvent du palier à **250 €**. Sur le long-courrier, l'indemnité atteint **600 €** : un Rome–New York (environ 6 900 km) en relève. Le montant est forfaitaire et dépend uniquement de la distance.",
      },
      { type: "h2", text: "Intégration au groupe Lufthansa" },
      {
        type: "p",
        text: "L'intégration progressive d'ITA Airways au **groupe Lufthansa** ne modifie pas vos droits : ITA reste un transporteur de l'UE soumis au règlement EC 261/2004, et une réclamation pour un vol ITA s'adresse à ITA. Les principes de calcul (retard à l'arrivée, correspondance sur réservation unique, montants selon la distance) demeurent inchangés.",
      },
      { type: "h2", text: "Retard, annulation, surbooking" },
      {
        type: "p",
        text: "Un **retard** de 3 heures ou plus à l'arrivée, une **annulation** annoncée moins de 14 jours avant le départ (hors circonstances exceptionnelles) ou un **refus d'embarquement** subi ouvrent chacun des droits. En cas d'annulation, le remboursement ou le réacheminement s'ajoute à l'indemnité éventuelle.",
      },
      { type: "h2", text: "Motifs d'exonération" },
      {
        type: "p",
        text: "ITA Airways peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo dangereuse, grève des contrôleurs aériens, sécurité). Une **panne technique** de l'appareil ou une **grève du personnel d'ITA** restent en revanche indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en occupe" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist identifie d'abord le bon transporteur (ITA Airways ou, pour un ancien vol, Alitalia), puis monte et porte le dossier jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Rome", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Rome – New York", km: "≈ 6 900 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "On identifie le transporteur", texte: "ITA Airways ou ancien vol Alitalia : Air Assist détermine à qui adresser la réclamation." },
      { titre: "Calcul de l'indemnité", texte: "Nous établissons le retard à l'arrivée et le montant, jusqu'à 600 € sur le long-courrier." },
      { titre: "Réclamation auprès d'ITA", texte: "Le dossier est adressé à ITA Airways, avec relances et argumentation." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "J'avais un vol Alitalia, ITA Airways gère-t-elle ma réclamation ?", a: "Non. ITA Airways est une société distincte et ne reprend pas les réclamations des anciens vols Alitalia, dont le traitement relève de la liquidation d'Alitalia. Pour un vol opéré par ITA, la réclamation s'adresse à ITA." },
      { q: "Un Paris–Rome retardé, c'est combien ?", a: "Environ 1 100 km : le vol relève du palier à 250 € par passager." },
      { q: "Mon vol ITA Airways a été annulé, quels sont mes droits ?", a: "Remboursement ou réacheminement, plus une indemnité si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles." },
      { q: "Quel délai pour réclamer un vol ITA Airways ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
  },

  // ─── 13. Pegasus ───────────────────────────────────────────────────────────
  {
    slug: "pegasus",
    nom: "Pegasus",
    title: "Indemnisation vol retardé Pegasus : jusqu'à 600 €",
    description:
      "Vol Pegasus au départ de l'UE retardé de 3 h ou plus ? Réclamez votre indemnité EC 261/2004. Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Pegasus Airlines est une compagnie low-cost turque, basée à l'aéroport d'Istanbul-Sabiha Gökçen. Comme la Turquie ne fait pas partie de l'Union européenne, la couverture d'un vol Pegasus dépend strictement du point de départ. Un vol Pegasus au départ d'un aéroport de l'UE — par exemple Paris–Istanbul — est couvert par le règlement EC 261/2004 et peut ouvrir droit à indemnité en cas de retard de 3 heures ou plus. En revanche, un vol au départ d'Istanbul vers la France n'est pas couvert par le règlement européen. Air Assist vérifie gratuitement si votre vol est éligible et réclame pour vous.",
    corps: [
      { type: "h2", text: "Pegasus, compagnie non-UE : la règle du point de départ" },
      {
        type: "p",
        text: "C'est le point déterminant. Le règlement EC 261/2004 s'applique à **tout vol au départ d'un aéroport de l'Union européenne**, quelle que soit la compagnie — y compris une compagnie non-européenne comme Pegasus. Il s'applique aussi aux vols **à destination de l'UE**, mais uniquement lorsqu'ils sont **opérés par une compagnie de l'UE**. Pegasus étant turque, ses vols à destination de l'UE au départ d'un pays tiers ne sont donc **pas** couverts par le règlement européen.",
      },
      { type: "h2", text: "Paris → Istanbul : couvert" },
      {
        type: "p",
        text: "Un vol Pegasus **au départ de Paris** (ou de tout autre aéroport de l'UE) vers Istanbul est pleinement couvert par le règlement EC 261/2004, car c'est le point de départ qui compte. Un Paris–Istanbul mesure environ **2 250 km**, ce qui le place au palier à **400 €**. Si ce vol arrive avec 3 heures de retard ou plus, ou s'il est annulé tardivement, l'indemnité peut être due, quelle que soit la nationalité turque de la compagnie.",
      },
      { type: "h2", text: "Istanbul → Paris : non couvert par le règlement européen" },
      {
        type: "p",
        text: "À l'inverse, un vol Pegasus **au départ d'Istanbul** vers la France n'est **pas** couvert par le règlement EC 261/2004 : le départ a lieu hors de l'UE et la compagnie n'est pas européenne. Dans ce sens, vous ne pouvez pas invoquer le règlement européen. Il peut alors rester des recours au titre du droit turc ou du contrat de transport, mais ils ne relèvent pas d'EC 261/2004 et sont généralement moins favorables.",
      },
      { type: "h2", text: "Vérifiez bien le sens de votre trajet" },
      {
        type: "p",
        text: "Pour un aller-retour Paris–Istanbul–Paris, cela signifie que **seul l'aller** (Paris→Istanbul) relève du règlement européen. Beaucoup de passagers l'ignorent et abandonnent une réclamation pourtant fondée sur le vol aller. Air Assist vérifie précisément le point de départ de chaque vol pour déterminer ce qui est réclamable.",
      },
      { type: "h2", text: "Retard, annulation : les conditions sur le vol couvert" },
      {
        type: "p",
        text: "Sur un vol Pegasus **au départ de l'UE**, les règles habituelles s'appliquent : indemnité en cas de **retard** de 3 heures ou plus à l'arrivée, d'**annulation** annoncée moins de 14 jours avant le départ (hors circonstances exceptionnelles) ou de **refus d'embarquement** subi. Une **panne technique** reste indemnisable ; seules des circonstances exceptionnelles réelles (météo, grève des contrôleurs, sécurité) exonèrent la compagnie.",
      },
      { type: "h2", text: "Combien de temps pour réclamer ?" },
      {
        type: "p",
        text: "Pour un vol couvert au départ de France, le délai de réclamation est de **5 ans**. Conservez votre carte d'embarquement et l'horaire réel d'arrivée : ils établissent le retard qui ouvre le droit à indemnité.",
      },
      { type: "h2", text: "Air Assist détermine l'éligibilité et réclame" },
      {
        type: "p",
        text: "Sur une compagnie non-UE, tout se joue sur le point de départ du vol. Air Assist vérifie gratuitement l'éligibilité de chaque segment, monte le dossier pour les vols couverts et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Paris – Istanbul (départ UE)", km: "≈ 2 250 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "On vérifie le point de départ", texte: "Air Assist détermine si votre vol Pegasus part d'un aéroport de l'UE (couvert) ou d'Istanbul (non couvert par EC 261/2004)." },
      { titre: "Calcul de l'indemnité", texte: "Pour un vol couvert, nous établissons le retard à l'arrivée et le montant selon la distance." },
      { titre: "Réclamation auprès de Pegasus", texte: "Le dossier est adressé à Pegasus pour les vols au départ de l'UE, avec relances." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Pegasus est turque, ai-je quand même des droits ?", a: "Oui, mais uniquement pour les vols au départ d'un aéroport de l'UE. Le règlement EC 261/2004 s'applique à tout vol partant de l'UE, quelle que soit la compagnie." },
      { q: "Mon vol partait de Paris, suis-je couvert ?", a: "Oui. Un Paris–Istanbul relève du règlement européen (départ UE) : environ 2 250 km, soit le palier à 400 € par passager." },
      { q: "Et si le vol partait d'Istanbul ?", a: "Un vol au départ d'Istanbul vers la France n'est pas couvert par EC 261/2004 (départ hors UE, compagnie non-UE). Seuls d'éventuels recours de droit turc peuvent subsister." },
      { q: "Un Paris–Istanbul retardé, c'est combien ?", a: "Environ 2 250 km : le vol relève du palier à 400 € par passager." },
    ],
  },
];

export function getPageCompagnie(slug: string): PageCompagnie | undefined {
  return PAGES_COMPAGNIES.find((c) => c.slug === slug);
}

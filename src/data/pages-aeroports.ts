/**
 * Contenu SEO unique par aéroport (pages « vol retardé [aéroport] indemnisation »).
 * Gabarit : src/components/seo/AeroportPage.tsx. Faits juridiques communs
 * identiques aux pages compagnies (montants 250/400/600 €, seuil 3 h à l'arrivée,
 * tout vol au départ de l'UE couvert, circonstances exceptionnelles, 5 ans).
 */
import type { Bloc } from "@/components/seo/SeoPage";

export type PageAeroport = {
  slug: string;
  code: string;
  nom: string;
  title: string;
  description: string;
  intro: string;
  corps: Bloc[];
  trajets: { route: string; km: string; montant: string }[];
  etapes: { titre: string; texte: string }[];
  faq: { q: string; a: string }[];
  /** Slugs de pages-compagnies pour le maillage interne. */
  compagnies: string[];
};

export const PAGES_AEROPORTS: PageAeroport[] = [
  // ─── 1. Lyon Saint-Exupéry (LYS) ────────────────────────────────────────────
  {
    slug: "vol-retarde-lyon-saint-exupery-indemnisation",
    code: "LYS",
    nom: "Lyon Saint-Exupéry",
    title: "Vol retardé Lyon Saint-Exupéry : indemnisation 600 €",
    description:
      "Vol retardé à Lyon Saint-Exupéry de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Lyon Saint-Exupéry (LYS) peut vous ouvrir droit à une indemnité forfaitaire allant jusqu'à 600 €, au titre du règlement européen EC 261/2004. Principal aéroport d'Auvergne-Rhône-Alpes, votre aéroport lyonnais voit transiter des millions de passagers vers l'Europe du Sud, la Méditerranée et au-delà — avec de forts pics de retards l'été. Air Assist connaît le terrain, vérifie gratuitement votre éligibilité et se charge de toute la réclamation. Vous n'avancez aucun frais : nous ne sommes rémunérés qu'en cas de succès.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Lyon : quels droits ?" },
      {
        type: "p",
        text: "Lyon Saint-Exupéry est un aéroport de l'Union européenne : **tout vol qui en part est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Le critère décisif n'est pas le retard au décollage, mais **l'heure réelle d'arrivée** à destination : dès 3 heures de retard, l'indemnité forfaitaire peut être due, en plus de la prise en charge (boissons, repas, hébergement) que la compagnie doit assurer pendant l'attente.",
      },
      { type: "h2", text: "Les compagnies les plus présentes à Lyon" },
      {
        type: "p",
        text: "Lyon accueille une **grosse base easyJet**, ainsi qu'une forte présence de **Transavia**, **Air France**, **Volotea**, **Vueling** et **Lufthansa**. Les low-cost y opèrent de nombreuses lignes loisirs vers l'Espagne, le Portugal, l'Italie, la Grèce et le Maghreb. Que votre vol soit assuré par une compagnie traditionnelle ou low-cost, vos droits sont strictement identiques : une compagnie à bas prix a exactement les mêmes obligations d'indemnisation.",
      },
      { type: "h2", text: "Combien pouvez-vous obtenir au départ de Lyon ?" },
      {
        type: "p",
        text: "Le montant est **forfaitaire** et dépend de la distance. Sur le réseau lyonnais, un Lyon–Lisbonne (environ 1 450 km) ou un Lyon–Porto (environ 1 300 km) relève du palier à **250 €**. Un Lyon–Marrakech (environ 1 750 km) ou un Lyon–Athènes (environ 1 900 km) atteint **400 €**. Les liaisons plus longues, au-delà de 3 500 km, donneraient 600 €. Le prix payé pour le billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Été à Lyon : la saison des retards" },
      {
        type: "p",
        text: "En juillet et août, Lyon Saint-Exupéry concentre une part importante de son trafic sur les **destinations loisirs du Sud et de la Méditerranée**. La densité des rotations, la saturation des aéroports de destination et l'enchaînement serré des vols provoquent alors des **retards en cascade** : un avion en retard le matin accumule du retard toute la journée. Ces perturbations d'exploitation ou d'affluence ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Annulation et surbooking au départ de Lyon" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous proposer le remboursement ou un réacheminement ; une indemnité s'y ajoute si l'annonce est intervenue moins de 14 jours avant le départ, hors circonstances exceptionnelles. En cas de **refus d'embarquement** subi pour surbooking, l'indemnité est immédiate. Ces droits s'appliquent aussi bien sur les vols easyJet, Transavia, Volotea que sur ceux d'Air France au départ de LYS.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "Une compagnie peut s'exonérer de l'indemnité (mais pas de la prise en charge) en cas de **circonstances exceptionnelles** réelles : météo dangereuse, grève des contrôleurs aériens, consigne de sécurité. En revanche, une **panne technique** de l'avion ou une **grève du personnel de la compagnie** restent indemnisables. Ne renoncez pas devant un premier refus vaguement motivé : le motif doit être réel et vérifiable.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en charge" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol pour faire valoir vos droits — de quoi vérifier aussi un vol lyonnais perturbé lors d'un été précédent. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Lyon – Porto", km: "≈ 1 300 km", montant: "250 €" },
      { route: "Lyon – Lisbonne", km: "≈ 1 450 km", montant: "250 €" },
      { route: "Lyon – Marrakech", km: "≈ 1 750 km", montant: "400 €" },
      { route: "Lyon – Athènes", km: "≈ 1 900 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Lyon : nous calculons gratuitement le retard à l'arrivée et le montant applicable." },
      { titre: "Rassemblez vos justificatifs", texte: "Confirmation de réservation et carte d'embarquement suffisent à monter le dossier." },
      { titre: "Nous réclamons pour vous", texte: "Air Assist adresse la demande à la compagnie et conteste les refus infondés." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue : aucune avance de frais, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol partait de Lyon Saint-Exupéry, suis-je couvert ?", a: "Oui. Lyon Saint-Exupéry est un aéroport de l'UE : tout vol qui en part est couvert par EC 261/2004, quelle que soit la compagnie." },
      { q: "Un Lyon–Athènes retardé de plus de 3 heures, c'est combien ?", a: "Environ 1 900 km : le vol relève du palier à 400 € par passager." },
      { q: "easyJet a refusé ma demande à Lyon, que faire ?", a: "Un refus n'est pas définitif. Il faut exiger la justification précise du motif ; s'il ne s'agit pas d'une véritable circonstance exceptionnelle, la demande peut être contestée et aboutir." },
      { q: "Combien de temps pour réclamer un vol au départ de Lyon ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "transavia", "volotea", "vueling"],
  },

  // ─── 2. Paris-Charles de Gaulle (CDG) ───────────────────────────────────────
  {
    slug: "vol-retarde-paris-cdg-indemnisation",
    code: "CDG",
    nom: "Paris-Charles de Gaulle",
    title: "Vol retardé Paris-CDG : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Paris-Charles de Gaulle de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Paris-Charles de Gaulle (CDG) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Premier aéroport de France et hub d'Air France, Roissy-CDG concentre un énorme trafic long-courrier : de nombreuses liaisons de plus de 3 500 km y donnent droit au palier maximal. C'est aussi une immense plaque tournante de correspondances, où les vols manqués sont fréquents. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Roissy-CDG : un vol retardé, quels droits ?" },
      {
        type: "p",
        text: "Paris-Charles de Gaulle est un aéroport de l'Union européenne : **tout vol au départ de CDG est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. À partir de **3 heures de retard à l'arrivée** à destination, l'indemnité forfaitaire peut être due, indépendamment du prix payé pour le billet.",
      },
      { type: "h2", text: "Un hub mondial, des indemnités jusqu'à 600 €" },
      {
        type: "p",
        text: "CDG est le **hub d'Air France** et le point de départ de la plupart des grandes compagnies mondiales, aux côtés d'**easyJet**, **Lufthansa** ou **Vueling**. Grâce à cette densité de vols long-courriers, beaucoup de trajets dépassent 3 500 km et relèvent du palier maximal : un Paris–New York (environ 5 800 km) ou un Paris–Dakar (environ 4 200 km) donne **600 €**. Un Paris–Le Caire (environ 3 200 km) atteint 400 €, et un court Paris–Rome (environ 1 100 km) relève des 250 €.",
      },
      { type: "h2", text: "Correspondance ratée à CDG : la destination finale compte" },
      {
        type: "p",
        text: "C'est l'un des cas les plus fréquents à Roissy. Lorsqu'un premier vol arrive en retard et vous fait **manquer votre correspondance** à CDG, l'indemnité se calcule sur le **retard à votre destination finale**, et non sur chaque segment. Si vous arrivez au bout du voyage avec 3 heures de retard ou plus, le droit peut s'ouvrir, à condition que l'ensemble du trajet figure sur une **réservation unique**. La distance retenue étant celle du trajet complet, l'indemnité peut atteindre 600 €.",
      },
      { type: "h2", text: "Pourquoi CDG cumule les retards" },
      {
        type: "p",
        text: "En tant que l'un des aéroports les plus actifs d'Europe, CDG est soumis à une **forte pression opérationnelle** : saturation des créneaux, gestion complexe des correspondances, aléas météo et parfois mouvements sociaux. Ces perturbations d'organisation ne sont pas, en règle générale, des circonstances exceptionnelles : elles restent indemnisables. Seuls des événements réellement extérieurs (météo dangereuse, grève des contrôleurs aériens, sécurité) exonèrent la compagnie.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous rembourser ou vous réacheminer, avec une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi pour surbooking, l'indemnité est immédiate. Attention aux bons d'achat proposés sur place : ils ne remplacent pas l'indemnité légale, due en argent.",
      },
      { type: "h2", text: "Grève et panne technique" },
      {
        type: "p",
        text: "Une distinction essentielle : la **grève des contrôleurs aériens**, extérieure à la compagnie, est exonératoire, mais une **grève du personnel de la compagnie** (pilotes, personnel de cabine) ne l'est pas. De même, une **panne technique** de l'avion relève de l'exploitation normale et reste indemnisable. Un vol perturbé par un mouvement social interne à Air France au départ de CDG peut donc être indemnisé.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Sur un trajet à correspondance, conservez toutes vos cartes d'embarquement : elles permettent d'établir précisément le retard à l'arrivée finale. Air Assist vérifie gratuitement votre éligibilité, reconstitue le trajet et mène la réclamation jusqu'au versement.",
      },
    ],
    trajets: [
      { route: "Paris – Rome", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Paris – Le Caire", km: "≈ 3 200 km", montant: "400 €" },
      { route: "Paris – Dakar", km: "≈ 4 200 km", montant: "600 €" },
      { route: "Paris – New York", km: "≈ 5 800 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Estimez votre indemnité", texte: "Indiquez votre vol au départ ou à l'arrivée de CDG : nous calculons le retard à l'arrivée finale, correspondances comprises." },
      { titre: "Nous reconstituons le trajet", texte: "Sur une réservation unique, nous établissons le retard à destination finale pour déterminer le montant." },
      { titre: "Réclamation et relances", texte: "Air Assist adresse le dossier à la compagnie et conteste les motifs infondés." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, jusqu'à 600 € sur le long-courrier, sans avance de frais." },
    ],
    faq: [
      { q: "Mon vol partait de Roissy-CDG, quels sont mes droits ?", a: "Tout vol au départ de CDG relève d'EC 261/2004, quelle que soit la compagnie : à partir de 3 heures de retard à l'arrivée, l'indemnité peut atteindre 600 € selon la distance." },
      { q: "J'ai raté ma correspondance à CDG, que puis-je réclamer ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : si vous arrivez avec 3 heures de retard ou plus, le droit peut s'ouvrir jusqu'à 600 €." },
      { q: "Un Paris–New York retardé, c'est combien ?", a: "Environ 5 800 km : le vol relève du palier maximal, soit 600 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de CDG ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["air-france", "lufthansa", "easyjet", "vueling"],
  },

  // ─── 3. Paris-Orly (ORY) ────────────────────────────────────────────────────
  {
    slug: "vol-retarde-paris-orly-indemnisation",
    code: "ORY",
    nom: "Paris-Orly",
    title: "Vol retardé Paris-Orly : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Paris-Orly de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Paris-Orly (ORY) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Deuxième aéroport parisien, Orly est une base majeure de Transavia et de Vueling, avec une forte présence low-cost et de nombreux vols vers l'Europe du Sud, le Maghreb et les départements d'outre-mer. Ces liaisons vers les DOM, très longues, atteignent le palier maximal. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ d'Orly : vos droits" },
      {
        type: "p",
        text: "Paris-Orly est un aéroport de l'Union européenne : **tout vol au départ d'Orly est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée** à destination, l'indemnité forfaitaire peut être due, indépendamment du tarif payé.",
      },
      { type: "h2", text: "Transavia, Vueling : les bases low-cost d'Orly" },
      {
        type: "p",
        text: "Orly abrite une **base importante de Transavia** et de **Vueling**, aux côtés d'**easyJet** et d'**Air France** (navettes intérieures et vols vers les DOM). Le poids du low-cost et des vols loisirs y est particulièrement élevé, notamment vers l'Espagne, le Portugal, l'Italie et le Maghreb. Rappelons-le : une compagnie low-cost est soumise aux **mêmes obligations d'indemnisation** qu'une compagnie traditionnelle.",
      },
      { type: "h2", text: "Vols vers les DOM : jusqu'à 600 €" },
      {
        type: "p",
        text: "Orly est le principal point de départ vers les **départements et régions d'outre-mer** (Antilles, Guyane, La Réunion, Mayotte). Ces liaisons relèvent du droit de l'Union européenne et sont donc couvertes. Compte tenu des distances, elles atteignent le palier maximal : un Orly–Pointe-à-Pitre (environ 6 800 km) fortement retardé donne **600 €**. Un Orly–Marrakech (environ 1 900 km) relève des 400 €, et un Orly–Porto (environ 1 200 km) des 250 €.",
      },
      { type: "h2", text: "Vols loisirs et haute saison" },
      {
        type: "p",
        text: "Comme les autres grandes plateformes, Orly connaît des **pics de perturbations** en haute saison, lorsque les vols loisirs se densifient. Les retards liés à l'affluence, à l'enchaînement des rotations ou à l'organisation de la compagnie ne constituent pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Annulation et surbooking au départ d'Orly" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous rembourser ou vous réacheminer, avec une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate. Ces droits valent aussi bien pour un vol Transavia ou Vueling que pour un Air France au départ d'ORY.",
      },
      { type: "h2", text: "Les motifs qui exonèrent (ou non) la compagnie" },
      {
        type: "p",
        text: "Une compagnie peut s'exonérer en cas de **circonstances exceptionnelles** réelles (météo dangereuse, grève des contrôleurs aériens, sécurité). Une **panne technique** ou une **grève du personnel de la compagnie** restent en revanche indemnisables. En cas de doute sur le motif invoqué, faites-le vérifier plutôt que d'abandonner.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en occupe" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Orly – Porto", km: "≈ 1 200 km", montant: "250 €" },
      { route: "Orly – Marrakech", km: "≈ 1 900 km", montant: "400 €" },
      { route: "Orly – Pointe-à-Pitre (DOM)", km: "≈ 6 800 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée d'Orly, DOM compris : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent à monter le dossier." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, jusqu'à 600 € sur les vols vers les DOM, sans avance de frais." },
    ],
    faq: [
      { q: "Mon vol partait d'Orly, suis-je couvert ?", a: "Oui. Orly est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Un vol Orly ↔ Antilles ou Réunion retardé, quels droits ?", a: "Les vols vers les DOM relèvent du droit de l'UE et sont couverts ; compte tenu des distances, l'indemnité atteint 600 € en cas de retard de 3 heures ou plus à l'arrivée." },
      { q: "Transavia à Orly a annulé mon vol, que faire ?", a: "Vous avez droit au remboursement ou au réacheminement, plus une indemnité si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles." },
      { q: "Quel délai pour réclamer un vol au départ d'Orly ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["transavia", "vueling", "easyjet", "air-france"],
  },

  // ─── 4. Marseille-Provence (MRS) ────────────────────────────────────────────
  {
    slug: "vol-retarde-marseille-indemnisation",
    code: "MRS",
    nom: "Marseille-Provence",
    title: "Vol retardé Marseille : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Marseille-Provence de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Marseille-Provence (MRS) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Principal aéroport du Sud-Est, Marseille est une base de Ryanair et accueille une forte présence de Volotea, easyJet, Air France et Transavia. Face à des compagnies low-cost qui contestent souvent, un service spécialisé fait la différence. Air Assist vérifie gratuitement votre éligibilité et prend en charge la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Vol retardé au départ de Marseille : vos droits" },
      {
        type: "p",
        text: "Marseille-Provence est un aéroport de l'Union européenne : **tout vol au départ de Marseille est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Le seuil de déclenchement est de **3 heures de retard à l'arrivée** à destination, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Les low-cost doivent indemniser comme les autres" },
      {
        type: "p",
        text: "Marseille est une **base de Ryanair** et accueille beaucoup de **Volotea**, aux côtés d'easyJet, Air France et Transavia. C'est le point central de cette page : une **compagnie low-cost est soumise exactement aux mêmes obligations** d'indemnisation qu'une compagnie traditionnelle. Le tarif très bas de votre billet ne réduit en rien votre droit : un billet à 25 € peut ouvrir droit à 400 € d'indemnité. Ne vous laissez pas dissuader par l'idée qu'une compagnie à bas prix « ne paie pas » : la loi européenne s'impose à toutes.",
      },
      { type: "h2", text: "Ryanair conteste : la valeur d'un service qui gère le litige" },
      {
        type: "p",
        text: "Ryanair, très présente à Marseille, est connue pour **rendre les réclamations difficiles** : formulaires maison, demandes de pièces répétées, refus initiaux fréquents. Beaucoup de passagers abandonnent — c'est précisément l'effet recherché. Or un dossier correctement argumenté aboutit souvent, y compris après un premier refus. Confier la réclamation à un tiers qui connaît les procédures de la compagnie change radicalement les chances d'obtenir gain de cause.",
      },
      { type: "h2", text: "Combien au départ de Marseille ?" },
      {
        type: "p",
        text: "Le montant, forfaitaire, dépend de la distance. Un Marseille–Séville (environ 1 200 km) relève du palier à **250 €**. Un Marseille–Athènes (environ 1 650 km) ou un Marseille–Istanbul (environ 2 100 km) atteint **400 €**. Les liaisons de plus de 3 500 km donneraient 600 €. Le barème ne tient jamais compte du prix payé.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous rembourser ou vous réacheminer, avec une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi pour surbooking, l'indemnité est immédiate. Si Ryanair ou une autre compagnie vous propose un **bon d'achat**, sachez que l'indemnité légale est due en argent : vérifiez toujours vos droits avant d'accepter.",
      },
      { type: "h2", text: "Circonstances exceptionnelles : ce qui exonère" },
      {
        type: "p",
        text: "Une compagnie ne peut se dispenser de l'indemnité qu'en cas de **circonstances exceptionnelles** réelles : météo dangereuse, grève des contrôleurs aériens, sécurité. Une **panne technique** de l'avion ou une **grève du personnel de la compagnie** restent indemnisables. Un motif invoqué doit toujours être justifié et vérifiable.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, affronte la procédure de la compagnie et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Marseille – Séville", km: "≈ 1 200 km", montant: "250 €" },
      { route: "Marseille – Athènes", km: "≈ 1 650 km", montant: "400 €" },
      { route: "Marseille – Istanbul", km: "≈ 2 100 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Marseille : nous calculons gratuitement le montant dû, low-cost compris." },
      { titre: "Nous remplissons les formulaires", texte: "Air Assist maîtrise les procédures des low-cost comme Ryanair et adresse un dossier complet." },
      { titre: "Relances et contestation", texte: "Nous relançons et contestons les refus infondés jusqu'à une réponse motivée." },
      { titre: "Indemnisation en argent", texte: "Vous êtes payé en espèces, pas en bon d'achat. Aucune avance, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol Ryanair partait de Marseille, ai-je droit à une indemnité ?", a: "Oui. Tout vol au départ de Marseille est couvert par EC 261/2004, y compris ceux d'une low-cost comme Ryanair, avec les mêmes montants." },
      { q: "Les compagnies low-cost doivent-elles vraiment indemniser ?", a: "Oui, sans exception. Une compagnie à bas prix a exactement les mêmes obligations d'indemnisation qu'une compagnie traditionnelle." },
      { q: "Un Marseille–Athènes retardé, c'est combien ?", a: "Environ 1 650 km : le vol relève du palier à 400 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Marseille ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["ryanair", "volotea", "easyjet", "transavia"],
  },

  // ─── 5. Nice-Côte d'Azur (NCE) ──────────────────────────────────────────────
  {
    slug: "vol-retarde-nice-indemnisation",
    code: "NCE",
    nom: "Nice-Côte d'Azur",
    title: "Vol retardé Nice : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Nice-Côte d'Azur de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Nice-Côte d'Azur (NCE) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Troisième aéroport de France, Nice abrite l'une des plus grandes bases easyJet d'Europe et accueille une clientèle affaires et touristique internationale, avec Air France, Vueling, British Airways, Lufthansa ou SWISS. Sur ce hub low-cost très dense, retards et annulations sont fréquents. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Vol retardé au départ de Nice : vos droits" },
      {
        type: "p",
        text: "Nice-Côte d'Azur est un aéroport de l'Union européenne : **tout vol au départ de Nice est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. À partir de **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Nice, plaque tournante d'easyJet" },
      {
        type: "p",
        text: "Nice accueille l'une des **plus grosses bases easyJet d'Europe**, avec un réseau très dense vers Londres, Genève, Porto et de nombreuses villes européennes. Cette intensité, combinée aux rotations serrées du low-cost, expose les passagers à des **retards et annulations fréquents**, en particulier aux heures de pointe et lors des grands événements de la Côte d'Azur. Ces perturbations d'exploitation ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Une clientèle internationale, des compagnies variées" },
      {
        type: "p",
        text: "Au-delà d'easyJet, Nice est desservie par **Air France**, **Vueling**, **British Airways**, **Lufthansa** et **SWISS**, au service d'une clientèle affaires et touristique venue du monde entier. Les mêmes règles s'appliquent à toutes : un vol British Airways au départ de Nice relève d'EC 261/2004 (départ UE), tout comme un vol SWISS ou Lufthansa. La couverture ne dépend pas de la nationalité de la compagnie, mais du fait que le vol **part d'un aéroport de l'UE**.",
      },
      { type: "h2", text: "Combien au départ de Nice ?" },
      {
        type: "p",
        text: "Le montant, forfaitaire, dépend de la distance. Un Nice–Genève (environ 300 km), un Nice–Londres (environ 1 030 km) ou un Nice–Porto (environ 1 350 km) relève du palier à **250 €**. Les liaisons saisonnières long-courriers, comme un Nice–New York (environ 6 300 km), atteignent **600 €**. Le prix payé pour le billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Comment réclamer face à easyJet à Nice" },
      {
        type: "p",
        text: "easyJet a la réputation d'opposer volontiers un refus en invoquant des **circonstances exceptionnelles**. Or ce motif est strictement encadré : seuls des événements extérieurs et incontrôlables en relèvent. Une **panne technique** ou un **problème d'organisation** interne restent indemnisables. Face à un refus, il faut exiger la justification précise du motif et, si elle ne tient pas, la contester — ce que fait Air Assist.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous rembourser ou vous réacheminer, avec une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi pour surbooking, l'indemnité est immédiate. Ces droits s'appliquent quelle que soit la compagnie opérant au départ de Nice.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en charge" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Nice – Genève", km: "≈ 300 km", montant: "250 €" },
      { route: "Nice – Londres", km: "≈ 1 030 km", montant: "250 €" },
      { route: "Nice – Porto", km: "≈ 1 350 km", montant: "250 €" },
      { route: "Nice – New York (saisonnier)", km: "≈ 6 300 km", montant: "600 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Nice : nous calculons gratuitement le retard à l'arrivée et le montant." },
      { titre: "Exigeons la justification", texte: "En cas de refus d'easyJet, nous demandons le motif précis et vérifions s'il constitue une véritable circonstance exceptionnelle." },
      { titre: "Nous contestons et relançons", texte: "Si le motif ne tient pas, nous le contestons et poursuivons la réclamation." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais et commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol partait de Nice, quels sont mes droits ?", a: "Tout vol au départ de Nice relève d'EC 261/2004, quelle que soit la compagnie : à partir de 3 heures de retard à l'arrivée, l'indemnité peut aller jusqu'à 600 € selon la distance." },
      { q: "easyJet à Nice a beaucoup de retards, comment réclamer ?", a: "Estimez d'abord votre indemnité, puis exigez la justification du motif en cas de refus. S'il ne s'agit pas d'une véritable circonstance exceptionnelle, la demande peut être contestée et aboutir." },
      { q: "Un Nice–Londres retardé, c'est combien ?", a: "Environ 1 030 km : le vol relève du palier à 250 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Nice ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "british-airways", "vueling", "swiss"],
  },

  // ─── 6. Toulouse-Blagnac (TLS) ──────────────────────────────────────────────
  {
    slug: "vol-retarde-toulouse-indemnisation",
    code: "TLS",
    nom: "Toulouse-Blagnac",
    title: "Vol retardé Toulouse : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Toulouse-Blagnac de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Toulouse-Blagnac (TLS) peut vous ouvrir droit à une indemnité forfaitaire allant jusqu'à 600 €, au titre du règlement EC 261/2004. Premier aéroport du Sud-Ouest, Toulouse mêle une forte clientèle d'affaires liée à l'aéronautique et un trafic touristique vers l'Europe du Sud et le Maghreb. Air Assist vérifie gratuitement votre éligibilité et se charge de toute la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Toulouse : quels droits ?" },
      {
        type: "p",
        text: "Toulouse-Blagnac est un aéroport de l'Union européenne : **tout vol qui en part est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Le critère décisif est l'**heure réelle d'arrivée** à destination : dès 3 heures de retard, l'indemnité forfaitaire peut être due, en plus de la prise en charge assurée pendant l'attente.",
      },
      { type: "h2", text: "Les compagnies présentes à Toulouse" },
      {
        type: "p",
        text: "Toulouse est desservie par **easyJet**, **Volotea**, **Air France**, **Ryanair** et **Transavia**. On y trouve à la fois la navette vers Paris, très empruntée par la clientèle d'affaires de la filière aéronautique, et de nombreuses lignes loisirs vers l'Espagne, le Portugal, la Grèce et le Maghreb. Que votre vol soit opéré par une compagnie classique ou low-cost, vos droits sont strictement identiques.",
      },
      { type: "h2", text: "Combien au départ de Toulouse ?" },
      {
        type: "p",
        text: "Le montant est **forfaitaire** et dépend de la distance. Un Toulouse–Marrakech (environ 1 400 km) ou un Toulouse–Porto (environ 1 000 km) relève du palier à **250 €**. Un Toulouse–Athènes (environ 1 900 km) atteint **400 €**. Les liaisons de plus de 3 500 km donneraient 600 €. Le prix payé pour le billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Affaires et loisirs : deux profils de retards" },
      {
        type: "p",
        text: "La navette Toulouse–Paris, très fréquentée aux heures de pointe, concentre une part des litiges liés aux retards d'exploitation. À l'inverse, les lignes loisirs vers le Sud connaissent des pics l'été. Dans les deux cas, ces perturbations d'organisation ou d'affluence ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Annulation et surbooking au départ de Toulouse" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous proposer le remboursement ou un réacheminement ; une indemnité s'y ajoute si l'annonce est intervenue moins de 14 jours avant le départ, hors circonstances exceptionnelles. En cas de **refus d'embarquement** subi pour surbooking, l'indemnité est immédiate.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "Une compagnie ne peut s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo dangereuse, grève des contrôleurs aériens, sécurité). Une **panne technique** ou une **grève du personnel de la compagnie** restent indemnisables. Ne renoncez pas devant un premier refus vaguement motivé.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité, monte le dossier et le porte jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Toulouse – Porto", km: "≈ 1 000 km", montant: "250 €" },
      { route: "Toulouse – Marrakech", km: "≈ 1 400 km", montant: "250 €" },
      { route: "Toulouse – Athènes", km: "≈ 1 900 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Toulouse : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos justificatifs", texte: "Confirmation de réservation et carte d'embarquement suffisent à monter le dossier." },
      { titre: "Nous réclamons pour vous", texte: "Air Assist adresse la demande à la compagnie et conteste les refus infondés." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue : aucune avance, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Un vol au départ de Toulouse est-il couvert ?", a: "Oui. Toulouse-Blagnac est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Un Toulouse–Athènes retardé, c'est combien ?", a: "Environ 1 900 km : le vol relève du palier à 400 € par passager." },
      { q: "Les low-cost à Toulouse ont-elles les mêmes obligations ?", a: "Oui, sans exception : une compagnie low-cost doit indemniser dans les mêmes conditions qu'une compagnie traditionnelle." },
      { q: "Quel délai pour réclamer un vol au départ de Toulouse ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "volotea", "ryanair", "transavia"],
  },

  // ─── 7. Bordeaux-Mérignac (BOD) ─────────────────────────────────────────────
  {
    slug: "vol-retarde-bordeaux-indemnisation",
    code: "BOD",
    nom: "Bordeaux-Mérignac",
    title: "Vol retardé Bordeaux : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Bordeaux-Mérignac de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Bordeaux-Mérignac (BOD) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Principal aéroport de Nouvelle-Aquitaine, Bordeaux accueille une forte composante low-cost, notamment via son terminal « billi ». Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Bordeaux : vos droits" },
      {
        type: "p",
        text: "Bordeaux-Mérignac est un aéroport de l'Union européenne : **tout vol au départ de Bordeaux est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Le terminal billi ne change rien à vos droits" },
      {
        type: "p",
        text: "Bordeaux dispose d'un terminal low-cost dédié, **« billi »**, d'où opèrent notamment easyJet, Volotea et Ryanair. Certains voyageurs pensent, à tort, que partir d'un terminal low-cost réduit leurs droits. C'est faux : le terminal d'embarquement n'a **aucune incidence** sur le règlement EC 261/2004. Un vol au départ de billi ouvre exactement les mêmes droits qu'un vol du terminal principal.",
      },
      { type: "h2", text: "Les compagnies présentes à Bordeaux" },
      {
        type: "p",
        text: "Bordeaux est desservie par **easyJet**, **Volotea**, **Ryanair**, **Air France** et **Transavia**, avec de nombreuses lignes vers l'Europe du Sud, le Maghreb et les grandes villes françaises. La densité des vols low-cost et saisonniers accroît le risque de retards en haute saison — des perturbations qui restent indemnisables.",
      },
      { type: "h2", text: "Combien au départ de Bordeaux ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Bordeaux–Lisbonne (environ 900 km) ou un Bordeaux–Marrakech (environ 1 500 km) relève du palier à **250 €**. Un Bordeaux–Athènes (environ 1 900 km) atteint **400 €**. Le prix payé n'entre jamais en compte.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate. Un bon d'achat proposé ne remplace pas l'indemnité légale, due en argent.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "La compagnie ne peut s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité). Une **panne technique** ou une **grève de son personnel** restent indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Bordeaux – Lisbonne", km: "≈ 900 km", montant: "250 €" },
      { route: "Bordeaux – Marrakech", km: "≈ 1 500 km", montant: "250 €" },
      { route: "Bordeaux – Athènes", km: "≈ 1 900 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Bordeaux, terminal billi compris : nous calculons gratuitement le montant." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "Un vol depuis Bordeaux est-il couvert ?", a: "Oui. Bordeaux-Mérignac est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Départ du terminal billi, est-ce que ça change quelque chose ?", a: "Non. Le terminal d'embarquement n'a aucune incidence : vos droits sont identiques à ceux d'un vol du terminal principal." },
      { q: "Un Bordeaux–Athènes retardé, c'est combien ?", a: "Environ 1 900 km : le vol relève du palier à 400 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Bordeaux ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "volotea", "ryanair", "transavia"],
  },

  // ─── 8. Nantes-Atlantique (NTE) ─────────────────────────────────────────────
  {
    slug: "vol-retarde-nantes-indemnisation",
    code: "NTE",
    nom: "Nantes-Atlantique",
    title: "Vol retardé Nantes : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Nantes-Atlantique de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Nantes-Atlantique (NTE) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Premier aéroport du Grand Ouest, Nantes connaît une croissance soutenue, avec une base Volotea et de nombreuses lignes loisirs. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Nantes : vos droits" },
      {
        type: "p",
        text: "Nantes-Atlantique est un aéroport de l'Union européenne : **tout vol au départ de Nantes est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Volotea et les low-cost à Nantes" },
      {
        type: "p",
        text: "Nantes abrite une **base Volotea** et accueille **easyJet**, **Transavia**, **Air France** et **Ryanair**. La compagnie Volotea y opère de nombreuses lignes directes vers l'Italie, l'Espagne, la Grèce et le Maghreb, souvent uniques sur le marché. Comme toute compagnie, Volotea et les autres low-cost sont soumises aux mêmes obligations d'indemnisation qu'une compagnie traditionnelle.",
      },
      { type: "h2", text: "Combien au départ de Nantes ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Nantes–Porto (environ 900 km) ou un Nantes–Venise (environ 1 100 km) relève du palier à **250 €**. Un Nantes–Marrakech (environ 1 900 km) atteint **400 €**. Le prix du billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Un aéroport à forte croissance" },
      {
        type: "p",
        text: "La fréquentation de Nantes progresse rapidement, parfois à la limite des capacités de l'aéroport. Cette pression accroît le risque de **retards aux heures de pointe**, en particulier en été sur les lignes loisirs. Ces perturbations d'affluence ou d'organisation ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate, en plus de la prise en charge.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "La compagnie ne peut s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité). Une **panne technique** ou une **grève de son personnel** restent indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Nantes – Porto", km: "≈ 900 km", montant: "250 €" },
      { route: "Nantes – Venise", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Nantes – Marrakech", km: "≈ 1 900 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Nantes : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "Un vol au départ de Nantes est-il couvert ?", a: "Oui. Nantes-Atlantique est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Volotea à Nantes a-t-elle les mêmes obligations ?", a: "Oui. Comme toute compagnie, Volotea doit indemniser dans les mêmes conditions qu'une compagnie traditionnelle." },
      { q: "Un Nantes–Marrakech retardé, c'est combien ?", a: "Environ 1 900 km : le vol relève du palier à 400 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Nantes ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["volotea", "easyjet", "transavia", "ryanair"],
  },

  // ─── 9. Lille-Lesquin (LIL) ─────────────────────────────────────────────────
  {
    slug: "vol-retarde-lille-indemnisation",
    code: "LIL",
    nom: "Lille-Lesquin",
    title: "Vol retardé Lille : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Lille-Lesquin de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Lille-Lesquin (LIL) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Principal aéroport des Hauts-de-France, Lille dessert de nombreuses destinations loisirs, avec une forte présence low-cost. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Lille : vos droits" },
      {
        type: "p",
        text: "Lille-Lesquin est un aéroport de l'Union européenne : **tout vol au départ de Lille est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Les compagnies présentes à Lille" },
      {
        type: "p",
        text: "Lille est desservie par **Transavia**, **easyJet**, **Volotea** et **Air France**, avec de nombreuses lignes vers l'Europe du Sud, la Méditerranée, le Maghreb et la Corse. Le trafic loisirs et saisonnier y est particulièrement exposé aux perturbations en période de vacances — des retards qui restent indemnisables.",
      },
      { type: "h2", text: "Lille et la concurrence de Charleroi" },
      {
        type: "p",
        text: "La proximité de la frontière belge et de l'aéroport de **Bruxelles-Charleroi** amène certains voyageurs des Hauts-de-France à choisir l'un ou l'autre. Un point à retenir : peu importe l'aéroport, ce qui compte est qu'il se situe dans l'Union européenne. Un vol au départ de Lille est couvert par EC 261/2004 exactement comme un vol au départ de Charleroi.",
      },
      { type: "h2", text: "Combien au départ de Lille ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Lille–Ajaccio (environ 1 050 km) relève du palier à **250 €**. Un Lille–Lisbonne (environ 1 600 km) ou un Lille–Marrakech (environ 2 100 km) atteint **400 €**. Le prix du billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Vol annulé au départ de Lille : quels droits ?" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous proposer le **remboursement** du billet ou un **réacheminement**, et une **indemnité** s'y ajoute si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles. Remboursement et indemnité se cumulent.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "La compagnie ne peut s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité). Une **panne technique** ou une **grève de son personnel** restent indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Lille – Ajaccio", km: "≈ 1 050 km", montant: "250 €" },
      { route: "Lille – Lisbonne", km: "≈ 1 600 km", montant: "400 €" },
      { route: "Lille – Marrakech", km: "≈ 2 100 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Lille : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "Un vol depuis Lille est-il couvert ?", a: "Oui. Lille-Lesquin est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Un Lille–Marrakech retardé, c'est combien ?", a: "Environ 2 100 km : le vol relève du palier à 400 € par passager." },
      { q: "Vol annulé au départ de Lille, quels sont mes droits ?", a: "Remboursement ou réacheminement, plus une indemnité si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles." },
      { q: "Quel délai pour réclamer un vol au départ de Lille ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["transavia", "easyjet", "volotea", "air-france"],
  },

  // ─── 10. Beauvais-Tillé (BVA) ───────────────────────────────────────────────
  {
    slug: "vol-retarde-beauvais-indemnisation",
    code: "BVA",
    nom: "Beauvais-Tillé",
    title: "Vol retardé Beauvais : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Beauvais-Tillé de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Beauvais-Tillé (BVA) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Aéroport low-cost au nord de Paris, Beauvais est une base majeure de Ryanair et de Wizz Air — deux compagnies réputées pour contester les réclamations. Air Assist vérifie gratuitement votre éligibilité et affronte la procédure pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un aéroport quasi 100 % low-cost : vos droits sont pleins" },
      {
        type: "p",
        text: "Beauvais-Tillé est un aéroport de l'Union européenne : **tout vol au départ de Beauvais est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Beauvais étant presque exclusivement dédié au low-cost, c'est le point à retenir : une compagnie à bas prix a **exactement les mêmes obligations** d'indemnisation qu'une compagnie traditionnelle. Le tarif très bas du billet ne réduit en rien votre droit.",
      },
      { type: "h2", text: "Ryanair et Wizz Air : deux bases, des refus fréquents" },
      {
        type: "p",
        text: "Beauvais est une **base majeure de Ryanair et de Wizz Air**. Ces deux ultra low-cost sont connues pour **rendre les réclamations difficiles** : formulaires maison, demandes de pièces répétées, refus initiaux fréquents, délais allongés. Beaucoup de passagers renoncent — c'est l'effet recherché. Or un dossier correctement argumenté aboutit souvent, y compris après un premier refus. C'est là qu'un service qui connaît leurs procédures fait la différence.",
      },
      { type: "h2", text: "Combien au départ de Beauvais ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Beauvais–Porto (environ 1 450 km) ou un Beauvais–Budapest (environ 1 250 km) relève du palier à **250 €**. Un Beauvais–Marrakech (environ 2 050 km) atteint **400 €**. Peu importe que vous ayez payé 20 € ou 120 € votre billet : seul compte le kilométrage.",
      },
      { type: "h2", text: "Attention aux bons d'achat et avoirs" },
      {
        type: "p",
        text: "Ryanair peut proposer un **bon d'achat** et Wizz Air un **avoir** sur votre compte client. Sachez que l'indemnité EC 261/2004 est due **en argent** : accepter un bon ou un avoir revient souvent à renoncer à une somme supérieure. Vérifiez toujours vos droits avant d'accepter une offre.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "Ryanair comme Wizz Air ne peuvent s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité). Une **panne technique** ou une **grève de leur personnel** restent indemnisables. Un premier refus n'est pas définitif.",
      },
      { type: "h2", text: "5 ans pour réclamer, Air Assist s'en charge" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Face à des compagnies procédurières, Air Assist prend tout en charge : vérification gratuite, montage du dossier, relances, contestation des refus, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Beauvais – Budapest", km: "≈ 1 250 km", montant: "250 €" },
      { route: "Beauvais – Porto", km: "≈ 1 450 km", montant: "250 €" },
      { route: "Beauvais – Marrakech", km: "≈ 2 050 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérification gratuite", texte: "Indiquez votre vol Ryanair ou Wizz Air au départ de Beauvais : nous calculons le montant applicable." },
      { titre: "Nous remplissons les formulaires", texte: "Air Assist maîtrise les procédures maison de Ryanair et Wizz Air et adresse un dossier complet." },
      { titre: "Relances et contestation", texte: "Nous relançons et contestons les refus infondés jusqu'à une réponse motivée." },
      { titre: "Indemnisation en argent", texte: "Vous êtes payé en espèces, pas en bon ou en avoir. Aucune avance, commission uniquement en cas de succès." },
    ],
    faq: [
      { q: "Mon vol Ryanair ou Wizz Air partait de Beauvais, ai-je droit à une indemnité ?", a: "Oui. Tout vol au départ de Beauvais est couvert par EC 261/2004, y compris ceux des low-cost, avec les mêmes montants." },
      { q: "Les low-cost doivent-elles vraiment indemniser ?", a: "Oui, sans exception : une compagnie à bas prix a exactement les mêmes obligations d'indemnisation qu'une compagnie traditionnelle." },
      { q: "Un Beauvais–Marrakech retardé, c'est combien ?", a: "Environ 2 050 km : le vol relève du palier à 400 € par passager." },
      { q: "Ryanair a refusé ma demande, que faire ?", a: "Un refus n'est pas définitif. Il faut exiger la justification du motif et, s'il n'est pas exonératoire, la contester — ce que fait Air Assist." },
    ],
    compagnies: ["ryanair", "wizz-air", "transavia"],
  },

  // ─── 11. Strasbourg-Entzheim (SXB) ──────────────────────────────────────────
  {
    slug: "vol-retarde-strasbourg-indemnisation",
    code: "SXB",
    nom: "Strasbourg-Entzheim",
    title: "Vol retardé Strasbourg : indemnisation jusqu'à 600 €",
    description:
      "Vol retardé à Strasbourg de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Strasbourg-Entzheim (SXB) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Aéroport d'Alsace, Strasbourg mêle une clientèle institutionnelle liée au Parlement européen et un trafic loisirs. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Strasbourg : vos droits" },
      {
        type: "p",
        text: "Strasbourg-Entzheim est un aéroport de l'Union européenne : **tout vol au départ de Strasbourg est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Les compagnies présentes à Strasbourg" },
      {
        type: "p",
        text: "Strasbourg est desservie par **Volotea**, **Air France** et **Transavia**, avec des lignes vers Paris, le Sud de la France, la Corse, l'Europe du Sud et le Maghreb. La clientèle est double : voyageurs d'affaires et institutionnels liés au **Parlement européen**, et voyageurs loisirs. Quelle que soit la compagnie, vos droits sont identiques.",
      },
      { type: "h2", text: "Combien au départ de Strasbourg ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Strasbourg–Nice (environ 500 km), un Strasbourg–Ajaccio (environ 900 km) ou un Strasbourg–Porto (environ 1 500 km) relève du palier à **250 €**. Les liaisons de 1 500 à 3 500 km atteindraient 400 €. Le prix du billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Une desserte sensible aux aléas" },
      {
        type: "p",
        text: "Aéroport de taille moyenne, Strasbourg peut voir ses vols perturbés par des aléas d'exploitation ou des rotations serrées, notamment aux heures de pointe. Ces perturbations d'organisation ne sont pas des circonstances exceptionnelles et restent indemnisables. Seuls des événements extérieurs réels (météo dangereuse, grève des contrôleurs, sécurité) exonèrent la compagnie.",
      },
      { type: "h2", text: "Vol annulé au départ de Strasbourg : quels droits ?" },
      {
        type: "p",
        text: "En cas d'**annulation**, la compagnie doit vous proposer le **remboursement** ou un **réacheminement**, et une **indemnité** s'y ajoute si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles. En cas de **refus d'embarquement** subi, l'indemnité est immédiate.",
      },
      { type: "h2", text: "Panne technique et grève" },
      {
        type: "p",
        text: "Une **panne technique** de l'avion ou une **grève du personnel de la compagnie** restent indemnisables : ce ne sont pas des circonstances exceptionnelles. Seule une grève des contrôleurs aériens, extérieure à la compagnie, l'exonère de l'indemnité.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Strasbourg – Nice", km: "≈ 500 km", montant: "250 €" },
      { route: "Strasbourg – Ajaccio", km: "≈ 900 km", montant: "250 €" },
      { route: "Strasbourg – Porto", km: "≈ 1 500 km", montant: "250 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Strasbourg : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "Un vol au départ de Strasbourg est-il couvert ?", a: "Oui. Strasbourg-Entzheim est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Un Strasbourg–Porto retardé, c'est combien ?", a: "Environ 1 500 km : le vol relève du palier à 250 € par passager." },
      { q: "Vol annulé au départ de Strasbourg, quels droits ?", a: "Remboursement ou réacheminement, plus une indemnité si l'annulation a été annoncée moins de 14 jours avant le départ, hors circonstances exceptionnelles." },
      { q: "Quel délai pour réclamer un vol au départ de Strasbourg ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["volotea", "air-france", "transavia"],
  },

  // ─── 12. Montpellier-Méditerranée (MPL) ─────────────────────────────────────
  {
    slug: "vol-retarde-montpellier-indemnisation",
    code: "MPL",
    nom: "Montpellier-Méditerranée",
    title: "Vol retardé Montpellier : indemnisation 600 €",
    description:
      "Vol retardé à Montpellier de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si nous n'obtenons rien.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Montpellier-Méditerranée (MPL) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Aéroport de l'Hérault, Montpellier abrite une base Transavia et dessert de nombreuses destinations loisirs méditerranéennes. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un vol retardé au départ de Montpellier : vos droits" },
      {
        type: "p",
        text: "Montpellier-Méditerranée est un aéroport de l'Union européenne : **tout vol au départ de Montpellier est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès **3 heures de retard à l'arrivée**, l'indemnité forfaitaire peut être due, indépendamment du prix du billet.",
      },
      { type: "h2", text: "Transavia et les compagnies présentes à Montpellier" },
      {
        type: "p",
        text: "Montpellier abrite une **base Transavia** et accueille **Volotea**, **Air France** et **easyJet**. La compagnie Transavia y opère de nombreuses lignes loisirs vers l'Espagne, le Portugal, la Grèce, l'Italie et le Maghreb. Comme toute compagnie, Transavia et les autres transporteurs low-cost sont soumis aux mêmes obligations d'indemnisation qu'une compagnie traditionnelle.",
      },
      { type: "h2", text: "Combien au départ de Montpellier ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Montpellier–Porto (environ 1 100 km) ou un Montpellier–Marrakech (environ 1 500 km) relève du palier à **250 €**. Un Montpellier–Athènes (environ 1 700 km) atteint **400 €**. Le prix du billet n'entre jamais en compte.",
      },
      { type: "h2", text: "Des lignes loisirs très saisonnières" },
      {
        type: "p",
        text: "Le trafic de Montpellier est fortement orienté **loisirs et méditerranéen**, avec des pics marqués l'été. La densité des rotations et l'affluence saisonnière augmentent alors le risque de retards. Ces perturbations d'affluence ou d'organisation ne sont pas des circonstances exceptionnelles et restent indemnisables.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate, en plus de la prise en charge.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "La compagnie ne peut s'exonérer qu'en cas de **circonstances exceptionnelles** réelles (météo, grève des contrôleurs, sécurité). Une **panne technique** ou une **grève de son personnel** restent indemnisables.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Montpellier – Porto", km: "≈ 1 100 km", montant: "250 €" },
      { route: "Montpellier – Marrakech", km: "≈ 1 500 km", montant: "250 €" },
      { route: "Montpellier – Athènes", km: "≈ 1 700 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Montpellier : nous calculons gratuitement le montant dû." },
      { titre: "Rassemblez vos preuves", texte: "Confirmation de réservation et carte d'embarquement suffisent." },
      { titre: "Nous réclamons", texte: "Air Assist adresse la demande à la compagnie et relance jusqu'à une réponse motivée." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "Un vol depuis Montpellier est-il couvert ?", a: "Oui. Montpellier-Méditerranée est un aéroport de l'UE : tout vol qui en part relève d'EC 261/2004, quelle que soit la compagnie." },
      { q: "Transavia à Montpellier a-t-elle les mêmes obligations ?", a: "Oui. Comme toute compagnie, Transavia doit indemniser dans les mêmes conditions qu'une compagnie traditionnelle." },
      { q: "Un Montpellier–Athènes retardé, c'est combien ?", a: "Environ 1 700 km : le vol relève du palier à 400 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Montpellier ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["transavia", "volotea", "air-france", "easyjet"],
  },

  // ─── 13. Bâle-Mulhouse / EuroAirport (BSL/MLH) ──────────────────────────────
  {
    slug: "vol-retarde-bale-mulhouse-indemnisation",
    code: "BSL/MLH",
    nom: "Bâle-Mulhouse",
    title: "Vol retardé Bâle-Mulhouse : indemnisation 600 €",
    description:
      "Vol retardé à l'EuroAirport Bâle-Mulhouse de 3 h ou plus ? Réclamez jusqu'à 600 € (EC 261/2004). Estimation gratuite, sans frais si rien obtenu.",
    intro:
      "Un vol retardé, annulé ou surbooké au départ ou à l'arrivée de Bâle-Mulhouse (EuroAirport, BSL/MLH) peut ouvrir droit à une indemnité allant jusqu'à 600 €, au titre du règlement EC 261/2004. Cet aéroport binational franco-suisse est implanté **sur le sol français** : les vols qui en partent relèvent donc du règlement européen. Base majeure d'easyJet, il accueille aussi Wizz Air et Air France. Air Assist vérifie gratuitement votre éligibilité et réclame pour vous, sans frais tant que vous n'êtes pas indemnisé.",
    corps: [
      { type: "h2", text: "Un aéroport franco-suisse, mais sur le sol français" },
      {
        type: "p",
        text: "L'EuroAirport de Bâle-Mulhouse est un aéroport **binational** géré conjointement par la France et la Suisse. Point essentiel pour vos droits : il est physiquement situé **sur le territoire français**, donc dans l'Union européenne. Résultat : **tout vol au départ de Bâle-Mulhouse est couvert par le règlement EC 261/2004**, quelle que soit la compagnie. Dès 3 heures de retard à l'arrivée, l'indemnité forfaitaire peut être due.",
      },
      { type: "h2", text: "Une grosse base easyJet" },
      {
        type: "p",
        text: "Bâle-Mulhouse est l'une des principales bases continentales d'**easyJet**, avec un réseau dense vers l'Europe. La compagnie y opère de nombreuses rotations serrées, typiques du low-cost, qui exposent les passagers à des retards fréquents. **Wizz Air** et **Air France** y sont également présents. Comme toujours, la nature low-cost d'une compagnie ne réduit en rien vos droits.",
      },
      { type: "h2", text: "Combien au départ de Bâle-Mulhouse ?" },
      {
        type: "p",
        text: "Le montant est forfaitaire. Un Bâle-Mulhouse–Porto (environ 1 300 km) relève du palier à **250 €**. Un Bâle-Mulhouse–Lisbonne (environ 1 550 km) ou un Bâle-Mulhouse–Athènes (environ 1 900 km) atteint **400 €**. Le prix du billet n'entre jamais en compte.",
      },
      { type: "h2", text: "easyJet à Bâle-Mulhouse : contester les refus" },
      {
        type: "p",
        text: "easyJet a la réputation d'opposer volontiers un refus en invoquant des **circonstances exceptionnelles**. Or ce motif est strictement encadré : une **panne technique** ou un **problème d'organisation** interne restent indemnisables. Face à un refus, il faut exiger la justification précise du motif et la contester s'il n'est pas fondé.",
      },
      { type: "h2", text: "Annulation et surbooking" },
      {
        type: "p",
        text: "En cas d'**annulation**, remboursement ou réacheminement, plus une indemnité si l'annonce est intervenue moins de 14 jours avant le départ. En cas de **refus d'embarquement** subi, l'indemnité est immédiate, en plus de la prise en charge.",
      },
      { type: "h2", text: "Panne technique et grève" },
      {
        type: "p",
        text: "Une **panne technique** de l'avion ou une **grève du personnel de la compagnie** restent indemnisables. Seuls des événements extérieurs réels (météo dangereuse, grève des contrôleurs aériens, sécurité) exonèrent la compagnie de l'indemnité.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol. Air Assist vérifie gratuitement votre éligibilité et mène la réclamation jusqu'au versement, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    trajets: [
      { route: "Bâle-Mulhouse – Porto", km: "≈ 1 300 km", montant: "250 €" },
      { route: "Bâle-Mulhouse – Lisbonne", km: "≈ 1 550 km", montant: "400 €" },
      { route: "Bâle-Mulhouse – Athènes", km: "≈ 1 900 km", montant: "400 €" },
    ],
    etapes: [
      { titre: "Vérifiez votre éligibilité", texte: "Indiquez votre vol au départ ou à l'arrivée de Bâle-Mulhouse : nous calculons gratuitement le montant dû." },
      { titre: "Nous confirmons la couverture", texte: "L'aéroport étant sur le sol français, le règlement EC 261/2004 s'applique aux départs." },
      { titre: "Nous réclamons et contestons", texte: "Air Assist adresse la demande à la compagnie et conteste les refus infondés." },
      { titre: "Indemnisation", texte: "Vous recevez l'indemnité obtenue, sans avance de frais." },
    ],
    faq: [
      { q: "L'EuroAirport est franco-suisse, quel règlement s'applique ?", a: "Le règlement européen UE261 (EC 261/2004) : l'aéroport est situé sur le sol français, donc dans l'UE, et les vols qui en partent sont couverts." },
      { q: "easyJet à Bâle-Mulhouse a-t-elle les mêmes obligations ?", a: "Oui. La nature low-cost d'une compagnie ne réduit pas vos droits : easyJet doit indemniser comme toute compagnie." },
      { q: "Un Bâle-Mulhouse–Lisbonne retardé, c'est combien ?", a: "Environ 1 550 km : le vol relève du palier à 400 € par passager." },
      { q: "Quel délai pour réclamer un vol au départ de Bâle-Mulhouse ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    compagnies: ["easyjet", "wizz-air", "air-france"],
  },
];

export function getPageAeroport(slug: string): PageAeroport | undefined {
  return PAGES_AEROPORTS.find((a) => a.slug === slug);
}

/**
 * Articles piliers du blog (contenu SEO informationnel). Gabarit :
 * src/components/seo/ArticleBlog.tsx. Faits juridiques communs identiques au
 * reste du site (montants 250/400/600 €, seuil 3 h à l'arrivée, circonstances
 * exceptionnelles, règle territoriale, 5 ans, médiation obligatoire depuis le
 * 7 février 2026 avant saisine du tribunal).
 */
import type { Bloc } from "@/components/seo/SeoPage";

export type ArticleBlog = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  categorie: string;
  datePublished: string;
  lecture: string;
  chapo: string;
  corps: Bloc[];
  faq: { q: string; a: string }[];
  liens: { href: string; label: string }[];
};

export const ARTICLES_BLOG: ArticleBlog[] = [
  // ─── 1 ──────────────────────────────────────────────────────────────────────
  {
    slug: "vol-retarde-plus-3-heures-indemnisation",
    title: "Vol retardé +3h : indemnisation jusqu'à 600 €",
    h1: "Vol retardé de plus de 3 heures : quelle indemnisation ?",
    description:
      "Vol arrivé avec plus de 3 h de retard ? Vous pouvez toucher jusqu'à 600 € (EC 261/2004). Barème, conditions et démarches expliqués simplement.",
    categorie: "Retards",
    datePublished: "2026-01-12",
    lecture: "7 min",
    chapo:
      "Trois heures de retard à l'arrivée : c'est le seuil qui déclenche votre droit à indemnisation. Voici comment ça marche, combien vous pouvez toucher et dans quels cas la compagnie peut refuser.",
    corps: [
      { type: "h2", text: "La règle des 3 heures, en clair" },
      {
        type: "p",
        text: "Le règlement européen EC 261/2004 prévoit une indemnité forfaitaire lorsque vous arrivez à destination avec **3 heures de retard ou plus**. Ce seuil, fixé par la Cour de justice de l'Union européenne, s'applique à tout vol au départ d'un aéroport de l'UE, quelle que soit la compagnie, ainsi qu'aux vols à destination de l'UE opérés par une compagnie européenne. En dessous de 3 heures, aucune indemnité forfaitaire n'est due, même pour 2 h 55 de retard.",
      },
      { type: "h2", text: "Le retard se juge à l'arrivée, pas au départ" },
      {
        type: "p",
        text: "C'est le point le plus mal compris. Ce n'est pas l'heure de décollage qui compte, mais **l'heure réelle d'arrivée** — précisément le moment où les portes de l'avion s'ouvrent à destination. Un vol parti avec 4 heures de retard mais ayant rattrapé du temps en vol peut arriver avec moins de 3 heures de retard, et n'ouvre alors pas de droit. À l'inverse, un petit retard au départ qui s'aggrave en vol peut franchir le seuil.",
      },
      { type: "h2", text: "Le barème : 250, 400 ou 600 €" },
      {
        type: "p",
        text: "Le montant est **forfaitaire** et dépend uniquement de la distance du vol :",
      },
      {
        type: "ul",
        items: [
          "**250 €** pour les vols jusqu'à 1 500 km.",
          "**400 €** pour les vols de 1 500 à 3 500 km, et tous les vols intra-UE de plus de 1 500 km.",
          "**600 €** pour les vols de plus de 3 500 km.",
        ],
      },
      {
        type: "p",
        text: "Ce montant est identique pour tous les passagers d'un même vol : il ne dépend ni du prix payé, ni de la classe de voyage. Un billet à 40 € peut donner droit à 600 €.",
      },
      { type: "h2", text: "Un droit qui s'ajoute à la prise en charge" },
      {
        type: "p",
        text: "Pendant l'attente à l'aéroport, la compagnie doit aussi vous fournir **gratuitement** de quoi patienter (boissons, repas) dès que le retard atteint un certain seuil, et un **hébergement** si le départ est reporté au lendemain. Cette prise en charge est due **même en cas de circonstance exceptionnelle**, et se cumule avec l'indemnité forfaitaire quand celle-ci est due.",
      },
      { type: "h2", text: "Quand la compagnie peut refuser" },
      {
        type: "p",
        text: "La compagnie peut s'exonérer de l'indemnité (mais pas de la prise en charge) en cas de **circonstances exceptionnelles** : météo dangereuse, grève des contrôleurs aériens, consigne de sécurité. En revanche, une **panne technique** de l'avion ou une **grève du personnel de la compagnie** ne sont pas exceptionnelles : l'indemnité reste due. Un premier refus vaguement motivé peut être contesté.",
      },
      { type: "h2", text: "Correspondance : la destination finale compte" },
      {
        type: "p",
        text: "Si un premier vol en retard vous fait manquer une correspondance, l'indemnité se calcule sur le **retard à votre destination finale**, sur la base d'une **réservation unique**. La distance retenue est celle du trajet complet, ce qui peut porter l'indemnité à 600 €.",
      },
      { type: "h2", text: "5 ans pour agir" },
      {
        type: "p",
        text: "En France, vous disposez de **5 ans** après la date du vol pour réclamer. Conservez votre carte d'embarquement et les e-mails de la compagnie : ils établissent le retard. Air Assist vérifie gratuitement votre éligibilité et se charge de la réclamation, sans frais si aucune indemnité n'est obtenue.",
      },
    ],
    faq: [
      { q: "À partir de combien d'heures ai-je droit à une indemnité ?", a: "À partir de 3 heures pleines de retard à l'arrivée à destination. En dessous, aucune indemnité forfaitaire n'est due." },
      { q: "Le retard se calcule au départ ou à l'arrivée ?", a: "À l'arrivée : c'est l'heure d'ouverture des portes à destination qui compte, pas l'heure de décollage." },
      { q: "Et si le retard vient de la météo ?", a: "Une météo réellement dangereuse est une circonstance exceptionnelle qui exonère la compagnie. Le motif doit toutefois être vérifiable et peut être contesté." },
      { q: "Combien de temps pour réclamer ?", a: "En France, vous avez 5 ans après la date du vol." },
    ],
    liens: [
      { href: "/indemnisation-vol-retarde", label: "Indemnisation vol retardé" },
      { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
      { href: "/blog/circonstances-exceptionnelles-indemnisation-vol", label: "Circonstances exceptionnelles" },
      { href: "/blog/montant-indemnisation-vol-250-400-600", label: "Calcul du montant" },
    ],
  },

  // ─── 2 ──────────────────────────────────────────────────────────────────────
  {
    slug: "vol-annule-droits-indemnisation",
    title: "Vol annulé : vos droits et l'indemnisation (600 €)",
    h1: "Vol annulé : quels droits et quelle indemnisation ?",
    description:
      "Vol annulé ? Remboursement, réacheminement et jusqu'à 600 € d'indemnité : découvrez vos droits et la règle des 14 jours (EC 261/2004).",
    categorie: "Annulations",
    datePublished: "2026-01-19",
    lecture: "7 min",
    chapo:
      "L'annulation d'un vol vous ouvre deux droits distincts et cumulables : le remboursement ou le réacheminement, et, souvent, une indemnité forfaitaire. Voici comment les faire valoir.",
    corps: [
      { type: "h2", text: "Deux droits qui se cumulent" },
      {
        type: "p",
        text: "En cas d'annulation, il faut distinguer deux choses. D'une part, la compagnie doit vous proposer **le remboursement intégral du billet ou un réacheminement** vers votre destination : ce droit s'applique toujours, quelle que soit la raison de l'annulation. D'autre part, une **indemnité forfaitaire** (250, 400 ou 600 €) peut s'y ajouter. Ces deux droits ne se remplacent pas : ils se cumulent.",
      },
      { type: "h2", text: "La règle des 14 jours" },
      {
        type: "p",
        text: "L'indemnité dépend du **délai de prévenance** et du réacheminement proposé :",
      },
      {
        type: "ul",
        items: [
          "Annonce **plus de 14 jours** avant le départ : pas d'indemnité, mais le remboursement reste dû.",
          "Annonce **entre 7 et 14 jours** : indemnité due selon les écarts d'horaires du vol de remplacement.",
          "Annonce **moins de 7 jours** : indemnité due si le vol de remplacement vous fait partir bien plus tôt ou arriver nettement plus tard.",
        ],
      },
      { type: "h2", text: "Remboursement ou réacheminement : à vous de choisir" },
      {
        type: "p",
        text: "C'est vous qui choisissez entre le **remboursement** (retour de l'argent du billet) et le **réacheminement** (un autre vol vers votre destination, au plus tôt ou à une date ultérieure de votre choix). La compagnie ne peut pas vous imposer un avoir à la place du remboursement en argent si vous ne le souhaitez pas.",
      },
      { type: "h2", text: "L'avoir n'est pas obligatoire" },
      {
        type: "p",
        text: "Beaucoup de compagnies proposent un **avoir** à utiliser sur un prochain voyage. Vous n'êtes pas tenu de l'accepter : vous avez droit au remboursement en argent, et l'avoir ne remplace pas l'indemnité forfaitaire éventuellement due. Avant d'accepter une offre commerciale, vérifiez ce à quoi vous avez réellement droit.",
      },
      { type: "h2", text: "Les circonstances exceptionnelles" },
      {
        type: "p",
        text: "Comme pour les retards, la compagnie peut être dispensée de l'**indemnité** (mais pas du remboursement) si l'annulation est due à une **circonstance exceptionnelle** : météo dangereuse, grève des contrôleurs aériens, sécurité. Une annulation pour raison économique, manque de personnel ou **panne technique** reste, en principe, indemnisable.",
      },
      { type: "h2", text: "Grève : la bonne distinction" },
      {
        type: "p",
        text: "Une **grève des contrôleurs aériens**, extérieure à la compagnie, est exonératoire. Une **grève du personnel de la compagnie** (pilotes, personnel de cabine) relève de sa gestion interne et **n'exonère pas** : l'indemnité reste due.",
      },
      { type: "h2", text: "Combien de temps pour réclamer ?" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après la date du vol annulé. Air Assist détermine gratuitement si une indemnité est due en plus de votre remboursement, et mène la réclamation à votre place.",
      },
    ],
    faq: [
      { q: "Annulation la veille du départ, ai-je droit à une indemnité ?", a: "Oui, en principe : une annonce à moins de 7 jours ouvre droit à indemnité selon les horaires du vol de remplacement, hors circonstances exceptionnelles." },
      { q: "Remboursement ET indemnité, est-ce cumulable ?", a: "Oui, ce sont deux droits distincts qui se cumulent." },
      { q: "La compagnie propose un avoir, dois-je l'accepter ?", a: "Non. Vous avez droit au remboursement en argent, et l'avoir ne remplace pas l'indemnité forfaitaire." },
      { q: "Une annulation pour circonstances exceptionnelles est-elle indemnisée ?", a: "Le remboursement reste dû, mais l'indemnité forfaitaire ne l'est pas si la circonstance exceptionnelle est réelle et vérifiable." },
    ],
    liens: [
      { href: "/indemnisation-vol-annule", label: "Indemnisation vol annulé" },
      { href: "/blog/circonstances-exceptionnelles-indemnisation-vol", label: "Circonstances exceptionnelles" },
      { href: "/blog/vol-retarde-plus-3-heures-indemnisation", label: "Vol retardé de plus de 3 h" },
      { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
    ],
  },

  // ─── 3 ──────────────────────────────────────────────────────────────────────
  {
    slug: "surbooking-refus-embarquement-indemnisation",
    title: "Surbooking : indemnisation du refus d'embarquement",
    h1: "Surbooking et refus d'embarquement : vos droits",
    description:
      "Refusé à l'embarquement pour surbooking ? Vous avez droit à une indemnité immédiate jusqu'à 600 €. Volontaires, prise en charge : tout expliqué.",
    categorie: "Surbooking",
    datePublished: "2026-01-26",
    lecture: "6 min",
    chapo:
      "Quand une compagnie vend plus de billets qu'il n'y a de sièges, certains passagers sont refusés à l'embarquement. Si cela vous arrive contre votre gré, vos droits sont immédiats.",
    corps: [
      { type: "h2", text: "Le surbooking, une pratique commerciale courante" },
      {
        type: "p",
        text: "Les compagnies vendent parfois plus de billets que de sièges disponibles, en pariant sur les absences. Quand tout le monde se présente, il faut **refuser des passagers** : c'est le refus d'embarquement pour cause de surbooking. Contrairement à une circonstance exceptionnelle, c'est une **décision commerciale** de la compagnie : elle n'exonère jamais de l'indemnité.",
      },
      { type: "h2", text: "D'abord l'appel aux volontaires" },
      {
        type: "p",
        text: "Avant de refuser quiconque contre son gré, la compagnie doit chercher des **volontaires** prêts à céder leur place en échange d'une compensation négociée (bon, surclassement, vol ultérieur…). Si vous êtes volontaire, vous négociez librement cette compensation — mais vous renoncez alors à l'indemnité forfaitaire légale.",
      },
      { type: "h2", text: "Refusé contre votre gré : l'indemnité est immédiate" },
      {
        type: "p",
        text: "S'il n'y a pas assez de volontaires et que vous êtes refusé **involontairement**, alors que vous étiez à l'heure à l'enregistrement avec une réservation valide, vous avez droit à une **indemnité forfaitaire immédiate** : 250, 400 ou 600 € selon la distance. Elle est due sur place, sans avoir à démontrer un préjudice.",
      },
      { type: "h2", text: "Remboursement, réacheminement et prise en charge" },
      {
        type: "p",
        text: "En plus de l'indemnité, la compagnie doit vous proposer le **remboursement** du billet ou un **réacheminement**, et assurer une **prise en charge** : rafraîchissements, repas, et hébergement si une nuit est nécessaire. Ces droits se cumulent avec l'indemnité.",
      },
      { type: "h2", text: "Attention aux bons proposés sur le moment" },
      {
        type: "p",
        text: "Dans la confusion, la compagnie peut proposer un **bon d'achat** pour que vous acceptiez de céder votre place. Sachez que l'indemnité légale est due **en argent** et qu'accepter un bon peut revenir à renoncer à une somme supérieure. Prenez le temps de vérifier vos droits avant de signer quoi que ce soit.",
      },
      { type: "h2", text: "Que faire sur place ?" },
      {
        type: "p",
        text: "Demandez à la compagnie une **confirmation écrite** du refus d'embarquement et de son motif, conservez votre carte d'embarquement et votre réservation, et notez les horaires. Ces éléments faciliteront votre réclamation.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, vous avez **5 ans** pour faire valoir vos droits. Air Assist vérifie gratuitement votre dossier et réclame l'indemnité due, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    faq: [
      { q: "La compagnie m'a débarqué contre mon gré, combien puis-je toucher ?", a: "250, 400 ou 600 € selon la distance, en indemnité immédiate, en plus du remboursement ou du réacheminement et de la prise en charge." },
      { q: "J'ai accepté un autre vol, ai-je encore droit à l'indemnité ?", a: "Oui, si vous avez été refusé involontairement : accepter un réacheminement ne supprime pas l'indemnité." },
      { q: "Quelle différence entre volontaire et involontaire ?", a: "Un volontaire négocie librement une compensation et renonce à l'indemnité légale ; un passager refusé contre son gré conserve son droit à l'indemnité forfaitaire." },
      { q: "Que faire sur le moment ?", a: "Demandez une confirmation écrite du refus et de son motif, gardez carte d'embarquement et réservation, et ne signez pas un bon sans vérifier vos droits." },
    ],
    liens: [
      { href: "/indemnisation-surbooking", label: "Indemnisation surbooking" },
      { href: "/blog/vol-annule-droits-indemnisation", label: "Vol annulé : vos droits" },
      { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
      { href: "/blog/que-faire-vol-retarde-aeroport-checklist", label: "Checklist à l'aéroport" },
    ],
  },

  // ─── 4 ──────────────────────────────────────────────────────────────────────
  {
    slug: "correspondance-ratee-retard-indemnisation",
    title: "Correspondance ratée : indemnisation du retard",
    h1: "Correspondance ratée : quelle indemnisation ?",
    description:
      "Correspondance manquée à cause d'un premier vol en retard ? Le retard se juge à la destination finale : jusqu'à 600 € sur une réservation unique.",
    categorie: "Correspondances",
    datePublished: "2026-02-02",
    lecture: "6 min",
    chapo:
      "Un premier vol en retard vous a fait rater votre correspondance ? Ce qui compte est l'heure à laquelle vous arrivez à votre destination finale — pas le segment manqué.",
    corps: [
      { type: "h2", text: "La règle de la destination finale" },
      {
        type: "p",
        text: "Pour un voyage comprenant plusieurs vols, l'indemnité ne se calcule pas segment par segment, mais sur le **retard à l'arrivée finale**. Peu importe que vous ayez raté votre correspondance d'une minute : si vous arrivez à destination avec **3 heures de retard ou plus**, le droit à indemnité peut s'ouvrir.",
      },
      { type: "h2", text: "Condition essentielle : la réservation unique" },
      {
        type: "p",
        text: "Ce principe s'applique aux vols réservés sous un **même numéro de réservation** (un seul billet), même si les segments sont opérés par des compagnies différentes. La distance retenue est alors celle entre votre **aéroport de départ initial** et votre **destination finale** : un long trajet à correspondance peut donc atteindre 600 €.",
      },
      { type: "h2", text: "Billets séparés : un cas plus complexe" },
      {
        type: "p",
        text: "Si vous avez réservé vos vols **séparément** (deux billets distincts), chaque vol est traité indépendamment. Le retard du premier vol n'engage alors pas automatiquement la compagnie du second pour la correspondance manquée. C'est plus difficile, mais chaque vol pris isolément peut ouvrir des droits s'il remplit les conditions. En cas de doute, faites vérifier votre situation.",
      },
      { type: "h2", text: "Le cas des grands hubs" },
      {
        type: "p",
        text: "Les correspondances manquées sont fréquentes dans les grands hubs européens : **Paris-CDG**, **Amsterdam-Schiphol**, **Francfort**, **Munich** ou **Lisbonne**. Un premier vol qui arrive en retard au hub et vous fait manquer le vol suivant est la situation type. Sur une réservation unique, l'indemnité se calcule sur le retard à l'arrivée finale, quelle que soit la compagnie du groupe qui opérait chaque segment.",
      },
      { type: "h2", text: "Combien pour un long-courrier raté ?" },
      {
        type: "p",
        text: "Comme la distance retenue est celle du trajet complet, un voyage intercontinental à correspondance dépasse presque toujours 3 500 km et relève donc du palier maximal de **600 €**. Par exemple, un Paris–hub–Amérique du Sud dont l'arrivée finale accuse 3 heures de retard ou plus peut ouvrir droit à 600 €.",
      },
      { type: "h2", text: "Motifs d'exonération" },
      {
        type: "p",
        text: "Les règles habituelles s'appliquent : une **circonstance exceptionnelle** réelle exonère la compagnie, mais une **panne technique** ou une **grève du personnel** de la compagnie restent indemnisables. Conservez toutes vos cartes d'embarquement, indispensables pour reconstituer le trajet.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans** après le vol. Air Assist reconstitue le trajet complet, calcule le retard à l'arrivée finale et mène la réclamation, sans frais tant que vous n'êtes pas indemnisé.",
      },
    ],
    faq: [
      { q: "J'ai raté ma correspondance à cause du 1er vol, quels droits ?", a: "Sur une réservation unique, l'indemnité se calcule sur le retard à la destination finale : à partir de 3 heures, le droit peut s'ouvrir jusqu'à 600 €." },
      { q: "Mes billets étaient séparés, suis-je couvert ?", a: "C'est plus complexe : chaque vol est traité séparément. Le retard du premier n'engage pas automatiquement la compagnie du second. Faites vérifier votre cas." },
      { q: "Combien pour un long-courrier raté ?", a: "La distance retenue étant celle du trajet complet, un intercontinental à correspondance relève presque toujours du palier maximal de 600 €." },
      { q: "Quel délai pour réclamer ?", a: "En France, vous disposez de 5 ans après la date du vol." },
    ],
    liens: [
      { href: "/indemnisation-correspondance-ratee", label: "Indemnisation correspondance ratée" },
      { href: "/vol-retarde-paris-cdg-indemnisation", label: "Vol retardé à Paris-CDG" },
      { href: "/indemnisation-vol-retarde-klm", label: "Indemnisation KLM" },
      { href: "/indemnisation-vol-retarde-lufthansa", label: "Indemnisation Lufthansa" },
    ],
  },

  // ─── 5 ──────────────────────────────────────────────────────────────────────
  {
    slug: "greve-avion-indemnisation-droits",
    title: "Grève et avion : ai-je droit à une indemnisation ?",
    h1: "Grève et vol perturbé : avez-vous droit à une indemnité ?",
    description:
      "Grève et vol annulé ou retardé ? Tout dépend de qui fait grève : personnel de la compagnie (indemnisable) ou contrôleurs aériens (exonératoire).",
    categorie: "Grèves",
    datePublished: "2026-02-09",
    lecture: "6 min",
    chapo:
      "Toutes les grèves ne se valent pas au regard de l'indemnisation. La distinction décisive : qui fait grève ? Personnel de la compagnie, ou acteur extérieur comme les contrôleurs aériens ?",
    corps: [
      { type: "h2", text: "La distinction qui change tout" },
      {
        type: "p",
        text: "Face à une grève, la question n'est pas « y a-t-il eu grève ? » mais « **qui** faisait grève ? ». Une grève **interne à la compagnie** relève de sa gestion et n'exonère pas de l'indemnité. Une grève d'un **acteur extérieur** (comme les contrôleurs aériens) est généralement considérée comme une circonstance exceptionnelle, qui exonère la compagnie.",
      },
      { type: "h2", text: "Grève du personnel de la compagnie : indemnisable" },
      {
        type: "p",
        text: "Lorsque ce sont les **pilotes, le personnel de cabine ou le personnel au sol de la compagnie** qui font grève, la jurisprudence européenne considère qu'il s'agit d'un événement inhérent à l'activité normale du transporteur. Résultat : un vol annulé ou retardé de 3 heures ou plus à cause d'un **mouvement social interne** ouvre droit à l'indemnité forfaitaire, dans les conditions habituelles.",
      },
      { type: "h2", text: "Grève des contrôleurs aériens : exonératoire" },
      {
        type: "p",
        text: "À l'inverse, une **grève du contrôle aérien** (ou de tout autre tiers extérieur à la compagnie, comme le personnel de l'aéroport) échappe au contrôle du transporteur. Elle constitue en principe une **circonstance exceptionnelle** : l'indemnité forfaitaire n'est alors pas due. La compagnie reste néanmoins tenue à la **prise en charge** (repas, hébergement) et au remboursement ou réacheminement.",
      },
      { type: "h2", text: "La compagnie devait-elle anticiper ?" },
      {
        type: "p",
        text: "Même en cas de grève extérieure, la compagnie doit prendre les **mesures raisonnables** pour limiter les conséquences (réacheminement, information). Si un préavis de grève était connu et que la compagnie n'a rien fait pour vous réacheminer, la question de sa responsabilité peut se poser. Chaque situation mérite un examen précis.",
      },
      { type: "h2", text: "Des exemples concrets" },
      {
        type: "ul",
        items: [
          "Grève des pilotes d'une grande compagnie nationale : votre vol annulé est **indemnisable**.",
          "Grève nationale des contrôleurs aériens : votre vol retardé n'ouvre **pas** droit à l'indemnité forfaitaire, mais la prise en charge reste due.",
          "Grève du personnel au sol d'un prestataire de la compagnie : l'analyse dépend du lien avec la compagnie ; à faire vérifier.",
        ],
      },
      { type: "h2", text: "Ne renoncez pas devant un refus « grève »" },
      {
        type: "p",
        text: "Les compagnies invoquent souvent « la grève » de façon générale pour refuser. Il faut identifier **précisément** qui faisait grève : si c'est leur propre personnel, le refus n'est pas fondé. Air Assist analyse gratuitement le motif exact et conteste s'il n'est pas justifié.",
      },
      { type: "h2", text: "5 ans pour réclamer" },
      {
        type: "p",
        text: "En France, le délai est de **5 ans**. Rassemblez vos justificatifs et l'e-mail d'annulation : ils précisent souvent le motif invoqué, point de départ de toute contestation.",
      },
    ],
    faq: [
      { q: "Grève des pilotes ou du personnel de la compagnie, ai-je droit à une indemnité ?", a: "Oui. Une grève interne à la compagnie n'est pas une circonstance exceptionnelle : l'indemnité forfaitaire reste due." },
      { q: "Grève des contrôleurs aériens, ai-je droit à une indemnité ?", a: "En principe non : c'est un acteur extérieur, la grève est une circonstance exceptionnelle. La prise en charge et le remboursement restent toutefois dus." },
      { q: "La compagnie était prévenue de la grève, ça change quelque chose ?", a: "Elle doit prendre des mesures raisonnables pour limiter les conséquences (réacheminement). Son inaction peut poser la question de sa responsabilité." },
      { q: "Que puis-je réclamer en cas de grève interne ?", a: "L'indemnité forfaitaire (250 à 600 € selon la distance), en plus du remboursement ou du réacheminement et de la prise en charge." },
    ],
    liens: [
      { href: "/blog/circonstances-exceptionnelles-indemnisation-vol", label: "Circonstances exceptionnelles" },
      { href: "/indemnisation-vol-retarde-air-france", label: "Indemnisation Air France" },
      { href: "/indemnisation-vol-annule", label: "Indemnisation vol annulé" },
      { href: "/droits-passagers", label: "Vos droits (EC 261/2004)" },
    ],
  },

  // ─── 6 ──────────────────────────────────────────────────────────────────────
  {
    slug: "circonstances-exceptionnelles-indemnisation-vol",
    title: "Circonstances exceptionnelles : indemnité ou non ?",
    h1: "Circonstances exceptionnelles : quand la compagnie ne paie pas",
    description:
      "Météo, panne technique, grève : ce qui exonère vraiment la compagnie et ce qui reste indemnisable. Le motif de refus n°1, décrypté.",
    categorie: "Vos droits",
    datePublished: "2026-02-16",
    lecture: "7 min",
    chapo:
      "« Circonstances exceptionnelles » : c'est le motif de refus n°1 des compagnies. Mais il est strictement encadré, et souvent invoqué à tort. Voici comment faire la part des choses.",
    corps: [
      { type: "h2", text: "Une notion strictement encadrée" },
      {
        type: "p",
        text: "Le règlement EC 261/2004 permet à une compagnie de ne pas verser l'indemnité si la perturbation est due à des **circonstances exceptionnelles** qu'elle ne pouvait éviter même en prenant toutes les mesures raisonnables. La Cour de justice de l'Union européenne interprète cette exception de manière **restrictive** : tout ce qui relève de l'activité normale d'un transporteur n'en fait pas partie.",
      },
      { type: "h2", text: "Ce qui exonère réellement la compagnie" },
      {
        type: "ul",
        items: [
          "**La météo dangereuse** (tempête, neige, brouillard) qui empêche réellement le vol.",
          "**La grève des contrôleurs aériens** ou d'un tiers extérieur à la compagnie.",
          "**L'instabilité politique** ou un risque de sécurité.",
          "Une **consigne des autorités** (fermeture d'espace aérien, par exemple).",
        ],
      },
      {
        type: "p",
        text: "Dans ces cas, l'indemnité forfaitaire n'est pas due — mais la **prise en charge** (repas, hébergement) et le remboursement ou réacheminement restent obligatoires.",
      },
      { type: "h2", text: "Ce qui NE l'exonère PAS" },
      {
        type: "ul",
        items: [
          "Une **panne technique** de l'avion : l'entretien fait partie de l'activité normale du transporteur.",
          "Un **problème d'équipage** (retard, absence, temps de service dépassé).",
          "Un **retard en cascade** dû à un vol précédent de la compagnie.",
          "Une **grève interne** du personnel de la compagnie.",
        ],
      },
      { type: "h2", text: "Le cas particulier de la panne technique" },
      {
        type: "p",
        text: "C'est le point le plus souvent contesté. Une compagnie invoque volontiers un « problème technique » pour refuser. Or, sauf cas très particulier (défaut caché révélé par le constructeur, acte de sabotage…), une **panne technique n'est pas une circonstance exceptionnelle** : elle relève de la maintenance, donc de l'exploitation normale. L'indemnité reste due.",
      },
      { type: "h2", text: "La météo : à vérifier" },
      {
        type: "p",
        text: "Une compagnie peut invoquer la météo alors que d'autres vols ont décollé normalement au même moment. Il est donc utile de **vérifier les conditions réelles** : un mauvais temps modéré, qui n'empêchait pas les autres vols, ne constitue pas une circonstance exceptionnelle. Le motif doit être sérieux et documenté.",
      },
      { type: "h2", text: "Comment contester un refus" },
      {
        type: "p",
        text: "Face à un refus « circonstances exceptionnelles », demandez à la compagnie la **justification précise et écrite** du motif. Si elle est vague, ou si elle invoque un motif qui n'exonère pas (panne technique, équipage…), le refus peut être contesté. Air Assist analyse gratuitement le motif invoqué et engage la contestation lorsque c'est justifié.",
      },
    ],
    faq: [
      { q: "Qu'est-ce qu'une circonstance exceptionnelle ?", a: "Un événement extérieur et incontrôlable que la compagnie ne pouvait éviter : météo dangereuse, grève des contrôleurs aériens, sécurité, consigne des autorités." },
      { q: "Une panne technique est-elle une circonstance exceptionnelle ?", a: "Non, sauf cas très particulier. L'entretien relève de l'activité normale de la compagnie : l'indemnité reste due." },
      { q: "La compagnie invoque la météo, comment vérifier ?", a: "Vérifiez si d'autres vols ont décollé normalement au même moment. Un mauvais temps modéré qui n'empêchait pas les autres vols n'est pas exonératoire." },
      { q: "Puis-je contester un refus ?", a: "Oui. Exigez la justification écrite du motif ; s'il est vague ou non exonératoire, le refus peut être contesté." },
    ],
    liens: [
      { href: "/blog/greve-avion-indemnisation-droits", label: "Grève et indemnisation" },
      { href: "/blog/vol-retarde-plus-3-heures-indemnisation", label: "Vol retardé de plus de 3 h" },
      { href: "/blog/reclamer-indemnisation-soi-meme-ou-service", label: "Réclamer soi-même ou via un service" },
      { href: "/droits-passagers", label: "Vos droits (EC 261/2004)" },
    ],
  },

  // ─── 7 ──────────────────────────────────────────────────────────────────────
  {
    slug: "delai-reclamation-indemnisation-vol",
    title: "Délai pour réclamer une indemnisation de vol",
    h1: "Quel délai pour réclamer une indemnisation de vol ?",
    description:
      "En France, vous avez 5 ans pour réclamer une indemnité de vol. Prescription, preuves à garder et médiation obligatoire depuis février 2026.",
    categorie: "Vos droits",
    datePublished: "2026-02-23",
    lecture: "6 min",
    chapo:
      "Il n'est pas nécessaire d'agir immédiatement : en France, le délai pour réclamer une indemnité de vol est long. Mais quelques réflexes protègent vos droits — et une étape nouvelle est apparue en 2026.",
    corps: [
      { type: "h2", text: "5 ans pour réclamer en France" },
      {
        type: "p",
        text: "En France, le délai de prescription pour réclamer une indemnité au titre du règlement EC 261/2004 est de **5 ans** à compter de la date du vol. C'est un délai confortable : un vol perturbé il y a deux ou trois ans peut donc encore faire l'objet d'une réclamation, à condition de disposer des preuves nécessaires.",
      },
      { type: "h2", text: "Le délai varie selon les pays" },
      {
        type: "p",
        text: "Ce délai de 5 ans est propre au droit français. D'autres pays appliquent des durées différentes. La règle applicable dépend généralement du droit du contrat de transport ou de la juridiction compétente. En cas de doute sur un vol international, il vaut mieux ne pas trop attendre pour engager la démarche.",
      },
      { type: "h2", text: "Les preuves à conserver" },
      {
        type: "p",
        text: "Pour appuyer votre réclamation, gardez précieusement :",
      },
      {
        type: "ul",
        items: [
          "Votre **confirmation de réservation** et votre **carte d'embarquement**.",
          "Les **e-mails et SMS** de la compagnie (annonce du retard, de l'annulation, du motif).",
          "Des **photos des panneaux d'affichage** indiquant le retard ou l'annulation.",
          "Vos **justificatifs de frais** engagés (repas, hôtel, transport) si la prise en charge n'a pas été assurée.",
        ],
      },
      { type: "h2", text: "Comment se calcule le point de départ" },
      {
        type: "p",
        text: "Le délai court à partir de la **date du vol** concerné. Une réclamation adressée à la compagnie n'a pas besoin d'aboutir immédiatement : tant que vous êtes dans le délai de prescription, vous pouvez relancer, contester un refus, puis engager une procédure si nécessaire.",
      },
      { type: "h2", text: "Nouveauté 2026 : la médiation obligatoire" },
      {
        type: "p",
        text: "Depuis le **7 février 2026**, avant de saisir le tribunal pour un litige de ce type, il faut d'abord passer par une **médiation** — en pratique, le **Médiateur Tourisme et Voyage**. Cette étape, gratuite pour le passager, vise à trouver une solution amiable avec la compagnie avant tout recours judiciaire. Elle ne supprime pas vos droits : elle ajoute une étape préalable au procès.",
      },
      { type: "h2", text: "Agir tôt reste préférable" },
      {
        type: "p",
        text: "Même si vous avez 5 ans, réclamer rapidement présente des avantages : les preuves sont plus faciles à réunir, les souvenirs plus précis, et la compagnie plus prompte à répondre. Air Assist vérifie gratuitement votre éligibilité, y compris pour d'anciens vols, et prend en charge toute la démarche.",
      },
    ],
    faq: [
      { q: "Combien de temps après le vol puis-je réclamer ?", a: "En France, 5 ans à compter de la date du vol." },
      { q: "Un vol d'il y a 3 ans, est-ce encore possible ?", a: "Oui, tant que vous êtes dans le délai de 5 ans et que vous disposez des preuves du vol et de la perturbation." },
      { q: "Quels documents dois-je conserver ?", a: "Confirmation de réservation, carte d'embarquement, e-mails de la compagnie, photos des panneaux et justificatifs de frais." },
      { q: "Dois-je passer par une médiation ?", a: "Depuis le 7 février 2026, une médiation (Médiateur Tourisme et Voyage) est obligatoire avant de saisir le tribunal. Elle est gratuite pour le passager." },
    ],
    liens: [
      { href: "/blog/reclamer-indemnisation-soi-meme-ou-service", label: "Réclamer soi-même ou via un service" },
      { href: "/blog/que-faire-vol-retarde-aeroport-checklist", label: "Checklist à l'aéroport" },
      { href: "/indemnisation-vol-retarde", label: "Indemnisation vol retardé" },
      { href: "/droits-passagers", label: "Vos droits (EC 261/2004)" },
    ],
  },

  // ─── 8 ──────────────────────────────────────────────────────────────────────
  {
    slug: "montant-indemnisation-vol-250-400-600",
    title: "Montant d'indemnisation vol : 250, 400 ou 600 € ?",
    h1: "Montant de l'indemnisation : 250, 400 ou 600 € ?",
    description:
      "Comment se calcule le montant d'indemnisation d'un vol ? Le barème EC 261/2004 selon la distance, par passager, avec des exemples concrets.",
    categorie: "Vos droits",
    datePublished: "2026-03-02",
    lecture: "6 min",
    chapo:
      "L'indemnité de vol n'est pas négociée au cas par cas : elle suit un barème forfaitaire fondé sur une seule variable, la distance. Voici comment déterminer votre montant.",
    corps: [
      { type: "h2", text: "Un barème forfaitaire, pas une estimation" },
      {
        type: "p",
        text: "Contrairement à un dédommagement classique, l'indemnité EC 261/2004 est **forfaitaire** : elle est identique pour tous les passagers d'un même vol, quelles que soient leurs circonstances personnelles. Elle ne dépend ni du prix payé, ni de la classe, ni du préjudice réellement subi. La seule variable est la **distance du vol**.",
      },
      { type: "h2", text: "Le barème selon la distance" },
      {
        type: "ul",
        items: [
          "**250 €** — vols jusqu'à 1 500 km.",
          "**400 €** — vols de 1 500 à 3 500 km, et tous les vols intra-UE de plus de 1 500 km.",
          "**600 €** — vols de plus de 3 500 km.",
        ],
      },
      { type: "h2", text: "Des exemples concrets" },
      {
        type: "p",
        text: "Quelques repères : Paris–Barcelone (environ 850 km) → **250 €** ; Paris–Athènes (environ 2 100 km) → **400 €** ; Paris–New York (environ 5 800 km) → **600 €**. Pour un trajet à correspondance sur une réservation unique, on retient la distance entre l'aéroport de départ initial et la destination finale.",
      },
      { type: "h2", text: "C'est par passager, pas par réservation" },
      {
        type: "p",
        text: "L'indemnité est due **à chaque passager**, et non par dossier de réservation. Une famille de quatre personnes dont le vol est retardé de plus de 3 heures peut donc prétendre à quatre indemnités. Sur un long-courrier, cela peut représenter 2 400 € pour la famille.",
      },
      { type: "h2", text: "Les enfants aussi" },
      {
        type: "p",
        text: "Un enfant disposant de son propre billet a droit à l'indemnité **au même titre qu'un adulte**. En revanche, un bébé voyageant gratuitement sur les genoux d'un parent, sans siège attribué ni billet payant, n'ouvre en général pas de droit à indemnité.",
      },
      { type: "h2", text: "Quand le montant peut être réduit" },
      {
        type: "p",
        text: "Sur les vols de **plus de 3 500 km**, si la compagnie vous a **réacheminé** et que votre retard à l'arrivée reste **compris entre 3 et 4 heures**, l'indemnité peut être réduite de moitié, à **300 €** au lieu de 600 €. En dessous de 3 500 km, il n'y a pas de réduction : c'est le montant plein.",
      },
      { type: "h2", text: "Comment connaître votre montant exact" },
      {
        type: "p",
        text: "Le plus simple est d'indiquer votre trajet à un outil qui calcule la distance et applique le barème. Air Assist estime gratuitement votre indemnité en 2 minutes et vérifie votre éligibilité, sans engagement.",
      },
    ],
    faq: [
      { q: "Comment connaître le montant exact ?", a: "Il dépend de la distance du vol : 250 € (≤ 1 500 km), 400 € (1 500–3 500 km et intra-UE > 1 500 km) ou 600 € (> 3 500 km). Une estimation en ligne le calcule en 2 minutes." },
      { q: "C'est par passager ou par réservation ?", a: "Par passager. Chaque voyageur disposant d'un billet a droit à sa propre indemnité." },
      { q: "Les enfants ont-ils droit à l'indemnité ?", a: "Oui, un enfant avec son propre billet y a droit comme un adulte. Un bébé voyageant gratuitement sur les genoux d'un parent, non." },
      { q: "Le montant peut-il être réduit ?", a: "Sur les vols de plus de 3 500 km, il peut être réduit à 300 € si un réacheminement limite le retard à l'arrivée entre 3 et 4 heures." },
    ],
    liens: [
      { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
      { href: "/blog/vol-retarde-plus-3-heures-indemnisation", label: "Vol retardé de plus de 3 h" },
      { href: "/blog/correspondance-ratee-retard-indemnisation", label: "Correspondance ratée" },
      { href: "/indemnisation-vol-retarde", label: "Indemnisation vol retardé" },
    ],
  },

  // ─── 9 ──────────────────────────────────────────────────────────────────────
  {
    slug: "que-faire-vol-retarde-aeroport-checklist",
    title: "Vol retardé à l'aéroport : la checklist à suivre",
    h1: "Que faire en cas de vol retardé à l'aéroport ?",
    description:
      "Vol retardé ou annulé à l'aéroport ? La checklist des bons réflexes : preuves à garder, repas et hôtel à exiger, pièges à éviter.",
    categorie: "Guide pratique",
    datePublished: "2026-03-09",
    lecture: "6 min",
    chapo:
      "Quand votre vol est retardé ou annulé, les bons réflexes pris à l'aéroport font toute la différence pour votre future réclamation. Voici la checklist à garder en tête.",
    corps: [
      { type: "h2", text: "1. Gardez toutes vos preuves" },
      {
        type: "p",
        text: "C'est le réflexe n°1. Conservez votre **carte d'embarquement** et votre confirmation de réservation, et **photographiez le panneau d'affichage** indiquant le retard ou l'annulation, avec l'heure visible. Gardez aussi les **e-mails et SMS** envoyés par la compagnie. Ces éléments prouveront le retard et, souvent, le motif invoqué.",
      },
      { type: "h2", text: "2. Demandez la cause par écrit" },
      {
        type: "p",
        text: "Rendez-vous au comptoir de la compagnie et **demandez la raison précise** du retard ou de l'annulation, si possible par écrit. Le motif est déterminant : une panne technique ou un problème d'équipage restent indemnisables, contrairement à une véritable circonstance exceptionnelle. Une justification écrite vous protège en cas de refus ultérieur.",
      },
      { type: "h2", text: "3. Exigez votre prise en charge" },
      {
        type: "p",
        text: "Dès que l'attente se prolonge, la compagnie doit vous fournir **gratuitement** de quoi patienter : boissons et repas en rapport avec la durée d'attente, et la possibilité de communiquer. Si le départ est reporté au lendemain, elle doit prendre en charge l'**hôtel** et les transferts. Ce droit s'applique **même en cas de circonstance exceptionnelle**.",
      },
      { type: "h2", text: "4. Si la compagnie ne fournit rien, gardez les factures" },
      {
        type: "p",
        text: "Si la compagnie n'assure pas la prise en charge, vous pouvez engager des frais raisonnables (repas, nuit d'hôtel, transport) et en demander le **remboursement**. Conservez impérativement toutes les **factures** : elles seront nécessaires pour vous faire rembourser ces dépenses, distinctes de l'indemnité forfaitaire.",
      },
      { type: "h2", text: "5. Ne signez pas un bon trop vite" },
      {
        type: "p",
        text: "La compagnie peut proposer un **bon d'achat** ou un avoir pour compenser. Ne l'acceptez pas dans la précipitation : l'indemnité légale est due **en argent**, et un bon peut représenter moins que la somme réellement due. De même, un avoir ne remplace pas votre droit au remboursement en cas d'annulation.",
      },
      { type: "h2", text: "6. Notez les horaires réels" },
      {
        type: "p",
        text: "Notez l'**heure réelle d'arrivée** à destination (ouverture des portes), car c'est elle qui détermine votre droit — pas l'heure de décollage. En cas de correspondance, notez l'horaire d'arrivée à la **destination finale**.",
      },
      { type: "h2", text: "7. Vérifiez votre éligibilité, puis réclamez" },
      {
        type: "p",
        text: "Une fois rentré, faites le point : un retard de 3 heures ou plus à l'arrivée, une annulation tardive ou un refus d'embarquement peuvent ouvrir droit à une indemnité de 250 à 600 €. Air Assist vérifie gratuitement votre situation et se charge de la réclamation, sans frais si rien n'est obtenu.",
      },
    ],
    faq: [
      { q: "Que dois-je réclamer sur place ?", a: "La prise en charge (boissons, repas, hôtel si nécessaire) et, si possible, une justification écrite du motif du retard ou de l'annulation." },
      { q: "Ai-je droit à un repas ou un hôtel ?", a: "Oui, dès que l'attente se prolonge : la compagnie doit fournir repas et, si le départ est reporté au lendemain, l'hébergement — même en cas de circonstance exceptionnelle." },
      { q: "Quelles preuves garder ?", a: "Carte d'embarquement, réservation, photos des panneaux avec l'heure, e-mails de la compagnie et factures des frais engagés." },
      { q: "Dois-je accepter le bon proposé ?", a: "Pas dans la précipitation : l'indemnité est due en argent et un bon représente souvent moins. Vérifiez vos droits avant d'accepter." },
    ],
    liens: [
      { href: "/blog/vol-retarde-plus-3-heures-indemnisation", label: "Vol retardé de plus de 3 h" },
      { href: "/blog/surbooking-refus-embarquement-indemnisation", label: "Surbooking : vos droits" },
      { href: "/indemnisation-vol-retarde", label: "Indemnisation vol retardé" },
      { href: "/droits-passagers", label: "Vos droits (EC 261/2004)" },
    ],
  },

  // ─── 10 ─────────────────────────────────────────────────────────────────────
  {
    slug: "reclamer-indemnisation-soi-meme-ou-service",
    title: "Réclamer soi-même ou via un service : que choisir ?",
    h1: "Réclamer son indemnisation soi-même ou passer par un service ?",
    description:
      "Faire sa réclamation seul (gratuit mais long) ou passer par un service (commission si succès) ? Comparatif honnête pour choisir sans risque.",
    categorie: "Conseils",
    datePublished: "2026-03-16",
    lecture: "7 min",
    chapo:
      "Vous pouvez tout à fait réclamer votre indemnité vous-même, gratuitement. Mais entre les refus fréquents et les délais, beaucoup préfèrent déléguer. Comparatif honnête des deux options.",
    corps: [
      { type: "h2", text: "Option 1 : faire soi-même, gratuitement" },
      {
        type: "p",
        text: "Rien ne vous oblige à passer par un intermédiaire. Vous pouvez contacter directement la compagnie, remplir son formulaire de réclamation et demander votre indemnité. Si la compagnie reconnaît sa responsabilité rapidement, c'est la solution la plus simple et **entièrement gratuite** : vous conservez 100 % de l'indemnité.",
      },
      { type: "h2", text: "Les limites du « soi-même »" },
      {
        type: "p",
        text: "Dans les faits, beaucoup de réclamations se heurtent à des obstacles : **refus initial** (souvent au motif de « circonstances exceptionnelles »), demandes de pièces à répétition, absence de réponse, délais qui s'étirent sur plusieurs mois. Il faut alors relancer, argumenter en droit, parfois engager une médiation puis une procédure. C'est **chronophage et décourageant**, et une partie des passagers abandonne en cours de route.",
      },
      { type: "h2", text: "Pourquoi les compagnies refusent souvent" },
      {
        type: "p",
        text: "Les compagnies savent qu'un refus, même mal fondé, décourage une part des demandeurs. Invoquer une circonstance exceptionnelle de façon générale, imposer des formulaires complexes ou tarder à répondre sont autant de moyens de **filtrer les réclamations**. Un dossier isolé, sans relance, a donc statistiquement moins de chances d'aboutir qu'un dossier suivi et argumenté.",
      },
      { type: "h2", text: "Option 2 : passer par un service spécialisé" },
      {
        type: "p",
        text: "Un service comme Air Assist prend en charge **l'intégralité de la démarche** : vérification de l'éligibilité, montage du dossier, envoi à la bonne entité, relances, contestation des refus, et si nécessaire la médiation puis le contentieux. Vous n'avez rien à gérer, et vous bénéficiez de l'expérience accumulée face aux pratiques de chaque compagnie.",
      },
      { type: "h2", text: "Combien coûte un service comme Air Assist ?" },
      {
        type: "p",
        text: "Le modèle est **« sans gain, sans frais »** : vous ne payez rien à l'avance, et une **commission** n'est prélevée que **sur l'indemnité effectivement obtenue**. Si aucune indemnité n'est récupérée, vous ne payez rien. Le service se rémunère donc uniquement en cas de succès, ce qui aligne son intérêt sur le vôtre.",
      },
      { type: "h2", text: "Que se passe-t-il si la réclamation échoue ?" },
      {
        type: "p",
        text: "Si le dossier n'aboutit pas — par exemple parce que la circonstance exceptionnelle était réelle et vérifiée —, vous ne devez **rien**. Vous n'avez pris aucun risque financier, contrairement à une procédure engagée seul où certains frais peuvent rester à votre charge.",
      },
      { type: "h2", text: "Comment choisir ?" },
      {
        type: "p",
        text: "Si votre cas est simple et la compagnie coopérative, faire soi-même est parfaitement viable et gratuit. Si la compagnie conteste, tarde ou refuse, déléguer à un service **sans risque** fait gagner du temps et augmente les chances d'aboutir. Dans tous les cas, commencez par **vérifier gratuitement votre éligibilité** : cela ne vous engage à rien.",
      },
    ],
    faq: [
      { q: "Puis-je le faire moi-même gratuitement ?", a: "Oui, absolument. Vous pouvez réclamer directement auprès de la compagnie et conserver 100 % de l'indemnité si elle accepte." },
      { q: "Pourquoi les compagnies refusent-elles souvent ?", a: "Un refus, même mal fondé, décourage une partie des demandeurs. Formulaires complexes, motifs vagues et lenteurs servent à filtrer les réclamations." },
      { q: "Combien prend un service comme Air Assist ?", a: "Rien à l'avance : une commission est prélevée uniquement sur l'indemnité effectivement obtenue. Sans résultat, vous ne payez rien." },
      { q: "Que se passe-t-il si je perds ?", a: "Avec un service « sans gain sans frais », vous ne devez rien si la réclamation n'aboutit pas : aucun risque financier." },
    ],
    liens: [
      { href: "/blog/circonstances-exceptionnelles-indemnisation-vol", label: "Circonstances exceptionnelles" },
      { href: "/blog/delai-reclamation-indemnisation-vol", label: "Délai pour réclamer" },
      { href: "/indemnisation-vol-retarde", label: "Indemnisation vol retardé" },
      { href: "/reclamation", label: "Lancer ma réclamation" },
    ],
  },
];

export function getArticleBlog(slug: string): ArticleBlog | undefined {
  return ARTICLES_BLOG.find((a) => a.slug === slug);
}

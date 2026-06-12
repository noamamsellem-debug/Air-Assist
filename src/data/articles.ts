/**
 * Articles de blog (SEO de contenu). Chaque article a un contenu par langue
 * (fr/en/es traduits, repli anglais pour les autres). Le corps est du HTML.
 */
export interface ContenuArticle {
  titre: string;
  extrait: string;
  corps: string;
}

export interface Article {
  slug: string;
  date: string; // ISO
  contenu: Record<string, ContenuArticle>;
}

export const ARTICLES: Article[] = [
  {
    slug: "vol-retarde-indemnisation",
    date: "2026-05-02",
    contenu: {
      fr: {
        titre: "Vol retardé : comment obtenir votre indemnisation (EC 261/2004)",
        extrait:
          "Retard de 3 heures ou plus à l'arrivée ? Vous pouvez réclamer jusqu'à 600 €. Voici comment, étape par étape.",
        corps: `<p>Un vol retardé peut vous donner droit à une indemnisation forfaitaire de 250 € à 600 € au titre du règlement européen EC 261/2004, indépendamment du prix de votre billet.</p>
<h2>Quand avez-vous droit à une indemnité ?</h2>
<p>La règle principale : un retard d'au moins 3 heures à l'arrivée, sur un vol au départ d'un aéroport de l'UE, ou à l'arrivée dans l'UE avec une compagnie européenne.</p>
<ul><li><strong>250 €</strong> pour les vols jusqu'à 1 500 km</li><li><strong>400 €</strong> pour les vols de 1 500 à 3 500 km</li><li><strong>600 €</strong> pour les vols de plus de 3 500 km</li></ul>
<h2>Les exceptions</h2>
<p>La compagnie n'a pas à indemniser en cas de « circonstances extraordinaires » : météo dangereuse, grève du contrôle aérien, risque de sécurité. En revanche, un problème technique courant reste indemnisable.</p>
<h2>Comment réclamer</h2>
<p>Rassemblez votre carte d'embarquement et une pièce d'identité, puis lancez votre demande. Nous vérifions votre éligibilité gratuitement et gérons toute la procédure : sans gain, sans frais — 30 % de commission uniquement en cas de succès.</p>`,
      },
      en: {
        titre: "Flight delayed: how to claim your compensation (EC 261/2004)",
        extrait:
          "Delayed 3 hours or more on arrival? You may be able to claim up to €600. Here's how, step by step.",
        corps: `<p>A delayed flight can entitle you to fixed compensation of €250 to €600 under EU Regulation EC 261/2004, regardless of your ticket price.</p>
<h2>When are you entitled to compensation?</h2>
<p>The main rule: an arrival delay of at least 3 hours, on a flight departing from an EU airport, or arriving in the EU on a European airline.</p>
<ul><li><strong>€250</strong> for flights up to 1,500 km</li><li><strong>€400</strong> for flights of 1,500 to 3,500 km</li><li><strong>€600</strong> for flights over 3,500 km</li></ul>
<h2>The exceptions</h2>
<p>The airline doesn't have to pay in case of "extraordinary circumstances": dangerous weather, air traffic control strikes, security risks. However, a common technical fault is still eligible.</p>
<h2>How to claim</h2>
<p>Gather your boarding pass and an ID document, then start your claim. We check your eligibility for free and handle the whole process: no win, no fee — 30% commission only if we succeed.</p>`,
      },
      es: {
        titre: "Vuelo retrasado: cómo reclamar tu indemnización (CE 261/2004)",
        extrait:
          "¿Retraso de 3 horas o más a la llegada? Puedes reclamar hasta 600 €. Te explicamos cómo, paso a paso.",
        corps: `<p>Un vuelo retrasado puede darte derecho a una indemnización fija de 250 € a 600 € según el Reglamento europeo CE 261/2004, sin relación con el precio de tu billete.</p>
<h2>¿Cuándo tienes derecho a indemnización?</h2>
<p>La regla principal: un retraso de al menos 3 horas a la llegada, en un vuelo que salga de un aeropuerto de la UE o que llegue a la UE con una aerolínea europea.</p>
<ul><li><strong>250 €</strong> para vuelos de hasta 1.500 km</li><li><strong>400 €</strong> para vuelos de 1.500 a 3.500 km</li><li><strong>600 €</strong> para vuelos de más de 3.500 km</li></ul>
<h2>Las excepciones</h2>
<p>La aerolínea no tiene que pagar en caso de "circunstancias extraordinarias": mal tiempo peligroso, huelga del control aéreo, riesgo de seguridad. En cambio, una avería técnica habitual sí da derecho a indemnización.</p>
<h2>Cómo reclamar</h2>
<p>Reúne tu tarjeta de embarque y un documento de identidad, y luego inicia tu reclamación. Comprobamos tu elegibilidad gratis y gestionamos todo el proceso: sin éxito, sin coste — 30 % de comisión solo si lo conseguimos.</p>`,
      },
    },
  },
  {
    slug: "vol-annule-droits",
    date: "2026-05-09",
    contenu: {
      fr: {
        titre: "Vol annulé : vos droits et le montant de l'indemnité",
        extrait:
          "Annulation de dernière minute ? Entre remboursement, réacheminement et indemnité, voici ce que la compagnie vous doit.",
        corps: `<p>En cas d'annulation, vous avez deux types de droits cumulables : le <strong>remboursement ou le réacheminement</strong>, et une éventuelle <strong>indemnité forfaitaire</strong>.</p>
<h2>Remboursement ou réacheminement</h2>
<p>La compagnie doit vous proposer soit le remboursement du billet, soit un vol de remplacement vers votre destination, à votre choix. Elle doit aussi vous prendre en charge (repas, hébergement si nécessaire).</p>
<h2>L'indemnité forfaitaire</h2>
<p>Sauf si vous avez été prévenu au moins 14 jours à l'avance, ou en cas de circonstances extraordinaires, l'annulation ouvre droit à 250 € à 600 € selon la distance — comme pour un retard.</p>
<h2>Bon à savoir</h2>
<p>Le remboursement du billet et l'indemnité forfaitaire sont <strong>distincts</strong> : accepter un remboursement ne vous fait pas renoncer à l'indemnité. Lancez votre demande, nous vérifions tout gratuitement.</p>`,
      },
      en: {
        titre: "Flight cancelled: your rights and the compensation amount",
        extrait:
          "Last-minute cancellation? Between refund, rerouting and compensation, here's what the airline owes you.",
        corps: `<p>If your flight is cancelled, you have two types of rights that can be combined: a <strong>refund or rerouting</strong>, and possibly a <strong>fixed compensation</strong>.</p>
<h2>Refund or rerouting</h2>
<p>The airline must offer you either a refund of your ticket or a replacement flight to your destination, at your choice. It must also take care of you (meals, accommodation if needed).</p>
<h2>The fixed compensation</h2>
<p>Unless you were notified at least 14 days in advance, or in case of extraordinary circumstances, a cancellation entitles you to €250 to €600 depending on distance — just like a delay.</p>
<h2>Good to know</h2>
<p>The ticket refund and the fixed compensation are <strong>separate</strong>: accepting a refund does not waive your right to compensation. Start your claim and we'll check everything for free.</p>`,
      },
      es: {
        titre: "Vuelo cancelado: tus derechos y el importe de la indemnización",
        extrait:
          "¿Cancelación de última hora? Entre reembolso, transporte alternativo e indemnización, esto es lo que te debe la aerolínea.",
        corps: `<p>En caso de cancelación, tienes dos tipos de derechos acumulables: el <strong>reembolso o el transporte alternativo</strong>, y una posible <strong>indemnización fija</strong>.</p>
<h2>Reembolso o transporte alternativo</h2>
<p>La aerolínea debe ofrecerte el reembolso del billete o un vuelo alternativo a tu destino, a tu elección. También debe atenderte (comidas, alojamiento si es necesario).</p>
<h2>La indemnización fija</h2>
<p>Salvo que te avisaran con al menos 14 días de antelación, o en caso de circunstancias extraordinarias, la cancelación da derecho a 250 € a 600 € según la distancia — igual que un retraso.</p>
<h2>Conviene saber</h2>
<p>El reembolso del billete y la indemnización fija son <strong>distintos</strong>: aceptar un reembolso no te hace renunciar a la indemnización. Inicia tu reclamación y lo comprobamos todo gratis.</p>`,
      },
    },
  },
  {
    slug: "surbooking-refus-embarquement",
    date: "2026-05-16",
    contenu: {
      fr: {
        titre: "Surbooking : que faire en cas de refus d'embarquement",
        extrait:
          "Refusé à l'embarquement alors que vous aviez un billet valide ? Le surbooking est indemnisé, quel que soit le retard.",
        corps: `<p>Le surbooking (surréservation) survient quand une compagnie vend plus de billets que de sièges. Si vous êtes refusé à l'embarquement contre votre volonté, vous avez des droits immédiats.</p>
<h2>Une indemnité due, sans condition de retard</h2>
<p>Contrairement au retard, le refus d'embarquement involontaire est indemnisé <strong>même si vous arrivez peu après</strong> : 250 € à 600 € selon la distance.</p>
<h2>Ne renoncez pas à vos droits</h2>
<p>La compagnie cherche souvent des volontaires en échange d'avantages. Si vous acceptez volontairement, vous renoncez à l'indemnité. Si vous êtes refusé contre votre gré, conservez votre carte d'embarquement.</p>
<h2>Comment réclamer</h2>
<p>Munissez-vous de vos documents de voyage et lancez votre demande. Vérification gratuite, et 30 % de commission uniquement en cas de succès.</p>`,
      },
      en: {
        titre: "Overbooking: what to do if you're denied boarding",
        extrait:
          "Denied boarding despite a valid ticket? Overbooking is compensated, regardless of any delay.",
        corps: `<p>Overbooking happens when an airline sells more tickets than there are seats. If you're denied boarding against your will, you have immediate rights.</p>
<h2>Compensation due, regardless of delay</h2>
<p>Unlike a delay, involuntary denied boarding is compensated <strong>even if you arrive shortly after</strong>: €250 to €600 depending on distance.</p>
<h2>Don't waive your rights</h2>
<p>The airline often looks for volunteers in exchange for benefits. If you volunteer, you waive the compensation. If you're denied against your will, keep your boarding pass.</p>
<h2>How to claim</h2>
<p>Get your travel documents ready and start your claim. Free eligibility check, and 30% commission only if we succeed.</p>`,
      },
      es: {
        titre: "Overbooking: qué hacer si te deniegan el embarque",
        extrait:
          "¿Te deniegan el embarque a pesar de tener un billete válido? El overbooking se indemniza, sin importar el retraso.",
        corps: `<p>El overbooking ocurre cuando una aerolínea vende más billetes que asientos. Si te deniegan el embarque en contra de tu voluntad, tienes derechos inmediatos.</p>
<h2>Indemnización debida, sin condición de retraso</h2>
<p>A diferencia del retraso, la denegación de embarque involuntaria se indemniza <strong>aunque llegues poco después</strong>: 250 € a 600 € según la distancia.</p>
<h2>No renuncies a tus derechos</h2>
<p>La aerolínea suele buscar voluntarios a cambio de ventajas. Si te ofreces voluntariamente, renuncias a la indemnización. Si te deniegan en contra de tu voluntad, conserva tu tarjeta de embarque.</p>
<h2>Cómo reclamar</h2>
<p>Ten a mano tus documentos de viaje e inicia tu reclamación. Comprobación gratuita, y 30 % de comisión solo si lo conseguimos.</p>`,
      },
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function contenuArticle(a: Article, locale: string): ContenuArticle {
  return a.contenu[locale] ?? a.contenu.en!;
}

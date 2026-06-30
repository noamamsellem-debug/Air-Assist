import { setRequestLocale } from "next-intl/server";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import {
  SeoHero,
  ProseBlocks,
  EstimationSection,
  FaqSection,
  RelatedLinks,
  type Bloc,
} from "@/components/seo/SeoPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

const PATH = "/indemnisation-vol-retarde";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Indemnisation vol retardé : jusqu'à 600 € (EC 261/2004)",
    description:
      "Votre vol est arrivé avec plus de 3 h de retard ? Réclamez jusqu'à 600 € d'indemnité. Vérification gratuite en 2 minutes avec AirAssist.",
  });
}

const LEAD =
  "Un vol arrivé en retard peut vous donner droit à une indemnité forfaitaire allant jusqu'à 600 €, au titre du règlement européen EC 261/2004. Cette somme est due par la compagnie aérienne, indépendamment du prix de votre billet. AirAssist vérifie gratuitement votre éligibilité et se charge de toute la réclamation à votre place.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Quand un retard est-il indemnisable ?" },
  {
    type: "p",
    text: "Le critère qui compte n'est pas le retard au décollage, mais **l'heure réelle d'arrivée** à destination. Vous pouvez prétendre à une indemnité si votre vol est arrivé avec **3 heures de retard ou plus** par rapport à l'horaire prévu, et si le vol entre dans le champ du règlement européen (départ d'un aéroport de l'UE, ou arrivée dans l'UE sur une compagnie européenne).",
  },
  { type: "h2", text: "Combien pouvez-vous toucher ?" },
  { type: "p", text: "Le montant dépend de la distance du vol :" },
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
    text: "Pour les vols de plus de 3 500 km, l'indemnité peut être réduite de moitié si le retard à l'arrivée est compris entre 3 et 4 heures.",
  },
  { type: "h2", text: "Dans quels cas la compagnie ne paie pas ?" },
  {
    type: "p",
    text: "La compagnie peut refuser l'indemnité en cas de **circonstances extraordinaires** : conditions météo dangereuses, instabilité politique, grève du contrôle aérien, risque de sécurité. En revanche, une panne technique de l'avion ou une grève interne de la compagnie ne sont, en général, pas considérées comme extraordinaires : l'indemnité reste due.",
  },
  { type: "h2", text: "Combien de temps avez-vous pour réclamer ?" },
  {
    type: "p",
    text: "Le délai dépend du pays. En France, vous disposez de **5 ans** pour faire valoir vos droits. Il n'est donc jamais trop tard pour vérifier un ancien vol.",
  },
  { type: "h2", text: "Comment AirAssist vous aide" },
  {
    type: "p",
    text: "Vous indiquez votre vol, nous vérifions gratuitement votre éligibilité, et si votre dossier est recevable nous nous chargeons de la réclamation auprès de la compagnie. Vous n'avancez aucun frais : nous ne sommes rémunérés que si vous êtes indemnisé.",
  },
];

const FAQ = [
  {
    q: "Le retard se calcule au décollage ou à l'arrivée ?",
    a: "À l'arrivée : c'est l'heure d'ouverture des portes à destination qui compte.",
  },
  {
    q: "J'ai eu 2 h 45 de retard, ai-je droit à quelque chose ?",
    a: "Non, le seuil est de 3 heures pleines à l'arrivée.",
  },
  {
    q: "La compagnie m'a déjà proposé un bon d'achat, puis-je quand même réclamer ?",
    a: "Oui, un avoir ou un geste commercial ne remplace pas l'indemnité légale.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Indemnisation vol retardé",
    serviceType: "Réclamation d'indemnité EC 261/2004 pour vol retardé",
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    url: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero eyebrow="Règlement EC 261/2004" title="Indemnisation pour vol retardé" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <FaqSection items={FAQ} />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/indemnisation-surbooking", label: "Surbooking" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

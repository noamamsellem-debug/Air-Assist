import { setRequestLocale } from "next-intl/server";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import {
  SeoHero,
  ProseBlocks,
  EstimationSection,
  RelatedLinks,
  type Bloc,
} from "@/components/seo/SeoPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

const PATH = "/blog/circonstances-extraordinaires";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Grève, météo, panne : ai-je droit à une indemnité ?",
    description:
      "Toutes les perturbations ne sont pas indemnisables. Grève, météo, panne technique : ce qui ouvre droit à indemnité et ce qui en dispense la compagnie.",
  });
}

const LEAD =
  "La compagnie refuse votre indemnité en invoquant une « circonstance extraordinaire » ? Ce motif est réel, mais souvent utilisé à tort. Voici comment distinguer les cas.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Ce qui dispense la compagnie (circonstances extraordinaires)" },
  {
    type: "ul",
    items: [
      "**La météo dangereuse** (tempête, neige, brouillard) qui empêche réellement le vol.",
      "**La grève du contrôle aérien** ou d'un tiers extérieur à la compagnie.",
      "**L'instabilité politique** ou un risque de sécurité.",
      "Une **consigne des autorités** (fermeture d'espace aérien, par exemple).",
    ],
  },
  {
    type: "p",
    text: "Dans ces cas, l'indemnité forfaitaire n'est pas due — mais la prise en charge (repas, hôtel) reste obligatoire.",
  },
  { type: "h2", text: "Ce qui reste indemnisable" },
  {
    type: "ul",
    items: [
      "Une **panne technique** de l'avion : la jurisprudence européenne considère l'entretien comme relevant de l'activité normale de la compagnie.",
      "Une **grève interne** du personnel de la compagnie : elle ne constitue généralement pas une circonstance extraordinaire.",
      "Un **problème d'organisation** : équipage manquant, rotation mal gérée, surbooking.",
    ],
  },
  { type: "h2", text: "En cas de doute, faites vérifier" },
  {
    type: "p",
    text: "Les compagnies invoquent souvent les circonstances extraordinaires de façon abusive pour éviter de payer. Un premier refus n'est pas définitif. AirAssist analyse gratuitement le motif invoqué et conteste s'il n'est pas justifié.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Grève, météo, panne : dans quels cas êtes-vous indemnisé ?",
    description:
      "Quelles perturbations ouvrent droit à indemnité et lesquelles dispensent la compagnie (circonstances extraordinaires).",
    inLanguage: "fr",
    author: { "@type": "Organization", name: "Air Assist" },
    publisher: {
      "@type": "Organization",
      name: "Air Assist",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/airassist-logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero
        eyebrow="Guide"
        title="Grève, météo, panne : dans quels cas êtes-vous indemnisé ?"
        lead={LEAD}
      />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

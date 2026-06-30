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

const PATH = "/blog/droits-vol-retarde";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Vol retardé : quels sont vos droits ? Le guide complet",
    description:
      "Retard, repas, hébergement, indemnité jusqu'à 600 € : tous vos droits en cas de vol retardé expliqués simplement. Guide AirAssist.",
  });
}

const LEAD =
  "Un vol en retard ne se limite pas à quelques heures perdues : la réglementation européenne vous accorde de vrais droits, souvent méconnus. Voici ce que vous pouvez exiger, étape par étape.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Pendant l'attente : le droit à la prise en charge" },
  {
    type: "p",
    text: "Dès que le retard atteint un certain seuil (2 heures pour les courts vols, davantage pour les longs), la compagnie doit vous fournir **gratuitement** de quoi patienter : boissons, repas en rapport avec l'attente, et la possibilité de passer des appels. Si le départ est reporté au lendemain, elle doit prendre en charge l'**hébergement** et les transferts. Ce droit s'applique **même si le retard est dû à une circonstance extraordinaire**.",
  },
  { type: "h2", text: "À l'arrivée : le droit à l'indemnité" },
  {
    type: "p",
    text: "Si vous arrivez à destination avec **3 heures de retard ou plus**, vous pouvez prétendre à une indemnité forfaitaire de 250 €, 400 € ou 600 € selon la distance. C'est le retard à l'arrivée qui compte, pas celui au décollage.",
  },
  { type: "h2", text: "Les circonstances extraordinaires" },
  {
    type: "p",
    text: "La compagnie peut refuser l'indemnité (mais pas la prise en charge) si le retard est dû à un événement hors de son contrôle : météo dangereuse, grève du contrôle aérien, sécurité. À l'inverse, une panne technique ou un problème d'organisation interne reste indemnisable.",
  },
  { type: "h2", text: "Conservez vos preuves" },
  {
    type: "p",
    text: "Cartes d'embarquement, e-mails de la compagnie, photos des panneaux d'affichage : tout cela renforce votre dossier. Vous avez **5 ans en France** pour réclamer.",
  },
  { type: "h2", text: "Faire valoir vos droits sans effort" },
  {
    type: "p",
    text: "Plutôt que d'affronter seul le service client de la compagnie, AirAssist vérifie gratuitement votre éligibilité et mène la réclamation pour vous, sans frais tant que vous n'êtes pas indemnisé.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Vol retardé : quels sont vos droits ?",
    description:
      "Tous vos droits en cas de vol retardé : prise en charge, indemnité jusqu'à 600 €, circonstances extraordinaires, délais.",
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
      <SeoHero eyebrow="Guide" title="Vol retardé : quels sont vos droits ?" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

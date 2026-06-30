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

const PATH = "/blog/regle-3-heures-retard";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "La règle des 3 heures de retard expliquée",
    description:
      "Pourquoi 3 heures ? Comment se calcule le retard à l'arrivée ? L'arrêt Sturgeon expliqué simplement pour savoir si vous êtes indemnisable.",
  });
}

const LEAD =
  "Trois heures : c'est le seuil qui sépare un vol indemnisable d'un vol qui ne l'est pas. Mais trois heures de quoi, exactement ? Voici comment cette règle fonctionne et d'où elle vient.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Pourquoi trois heures ?" },
  {
    type: "p",
    text: "Le règlement EC 261/2004 ne prévoyait initialement une indemnité que pour les annulations. C'est la **Cour de justice de l'Union européenne**, avec l'**arrêt Sturgeon** (2009), qui a étendu ce droit aux retards : un passager arrivé avec **3 heures ou plus** de retard subit un préjudice comparable à une annulation, et doit donc être indemnisé.",
  },
  { type: "h2", text: "Le retard se mesure à l'arrivée" },
  {
    type: "p",
    text: "Ce qui compte n'est pas l'heure de décollage, mais l'**heure réelle d'arrivée** à destination — précisément, l'ouverture des portes de l'avion. Un vol parti très en retard mais ayant rattrapé son temps en vol peut ne pas être indemnisable ; à l'inverse, un petit retard au départ qui s'aggrave peut franchir le seuil.",
  },
  { type: "h2", text: "Le cas des correspondances" },
  {
    type: "p",
    text: "Pour un trajet à correspondance sur une **réservation unique**, c'est le retard à la **destination finale** qui est pris en compte, pas celui de chaque segment. Rater une correspondance peut donc ouvrir droit à indemnité si l'arrivée finale dépasse 3 heures de retard.",
  },
  { type: "h2", text: "Et entre 3 et 4 heures ?" },
  {
    type: "p",
    text: "Pour les vols de plus de 3 500 km, l'indemnité peut être réduite de moitié (300 € au lieu de 600 €) lorsque le retard à l'arrivée est compris entre 3 et 4 heures. En dessous de 3 500 km, le montant reste plein.",
  },
  { type: "h2", text: "Vérifiez votre vol" },
  {
    type: "p",
    text: "Vous pensez avoir dépassé le seuil des 3 heures ? AirAssist calcule gratuitement votre retard à l'arrivée et votre éligibilité en 2 minutes.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "La règle des 3 heures de retard",
    description:
      "Pourquoi le seuil de 3 heures, comment se calcule le retard à l'arrivée et ce qu'a changé l'arrêt Sturgeon.",
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
      <SeoHero eyebrow="Guide" title="La règle des 3 heures de retard" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
          { href: "/blog/circonstances-extraordinaires", label: "Circonstances extraordinaires" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

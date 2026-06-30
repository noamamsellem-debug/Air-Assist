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

const PATH = "/blog/delai-indemnisation-vol";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Combien de temps pour être indemnisé d'un vol ?",
    description:
      "Délais de traitement, relances, recours : combien de temps faut-il vraiment pour toucher son indemnité de vol ? Explications AirAssist.",
  });
}

const LEAD =
  "C'est la question que tout le monde se pose après avoir déposé une réclamation : quand vais-je toucher mon argent ? La réponse honnête : cela dépend de la compagnie et de sa coopération. Voici les ordres de grandeur.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Le scénario rapide : quelques semaines" },
  {
    type: "p",
    text: "Quand la compagnie reconnaît rapidement sa responsabilité et ne conteste pas, l'indemnité peut être versée en **quelques semaines**. C'est le cas idéal, mais loin d'être systématique.",
  },
  { type: "h2", text: "Le scénario courant : quelques mois" },
  {
    type: "p",
    text: "Beaucoup de compagnies tardent à répondre, demandent des justificatifs supplémentaires ou refusent dans un premier temps. Entre les relances et les échanges, il faut souvent compter **deux à quatre mois** pour aboutir.",
  },
  { type: "h2", text: "Le scénario long : le recours" },
  {
    type: "p",
    text: "Si la compagnie persiste à refuser à tort, il peut être nécessaire de saisir un médiateur ou la justice. La procédure s'allonge alors à **plusieurs mois**, mais les chances d'obtenir gain de cause restent élevées lorsque le droit est de votre côté.",
  },
  { type: "h2", text: "Pourquoi passer par AirAssist" },
  {
    type: "p",
    text: "Relancer une compagnie, argumenter face à un refus, suivre les délais : c'est chronophage et décourageant. AirAssist prend tout en charge et ne se rémunère qu'en cas de succès. Vous suivez l'avancement de votre dossier en ligne, sans avoir à courir après la compagnie.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Combien de temps faut-il pour être indemnisé d'un vol ?",
    description:
      "Délais de traitement, relances et recours : combien de temps pour toucher son indemnité de vol.",
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
      <SeoHero eyebrow="Guide" title="Combien de temps faut-il pour être indemnisé d'un vol ?" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/#comment-ca-marche", label: "Comment ça marche" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

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

const PATH = "/blog/reglement-ec-261-2004";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "EC 261/2004 : le règlement passagers expliqué simplement",
    description:
      "Le règlement européen EC 261/2004 expliqué simplement : à qui il s'applique, quels droits, quels montants d'indemnisation. Guide clair par AirAssist.",
  });
}

const LEAD =
  "Derrière ce nom technique se cache le texte qui protège les passagers aériens en Europe. Voici l'essentiel, sans jargon : à qui il s'applique, ce qu'il vous garantit et combien vous pouvez toucher.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "À qui s'applique le règlement ?" },
  {
    type: "p",
    text: "Le règlement EC 261/2004 couvre tous les vols **au départ d'un aéroport de l'Union européenne**, quelle que soit la compagnie, ainsi que les vols **à destination de l'UE opérés par une compagnie européenne**. Il s'applique donc à la grande majorité des vols qui partent de France.",
  },
  { type: "h2", text: "Quels droits vous garantit-il ?" },
  {
    type: "ul",
    items: [
      "Une **indemnité forfaitaire** en cas de retard important, d'annulation ou de refus d'embarquement.",
      "Une **prise en charge** (boissons, repas, hébergement) pendant l'attente.",
      "Le **remboursement ou le réacheminement** en cas d'annulation.",
    ],
  },
  { type: "h2", text: "Quels montants ?" },
  {
    type: "p",
    text: "L'indemnité dépend de la distance : **250 €** jusqu'à 1 500 km, **400 €** de 1 500 à 3 500 km, **600 €** au-delà. Elle est forfaitaire : elle ne dépend pas du prix payé pour le billet.",
  },
  { type: "h2", text: "Les limites : les circonstances extraordinaires" },
  {
    type: "p",
    text: "La compagnie peut être dispensée de l'indemnité (mais pas de la prise en charge) si la perturbation résulte d'un événement hors de son contrôle, comme une météo dangereuse ou une grève du contrôle aérien. Une panne technique, elle, reste en principe indemnisable.",
  },
  { type: "h2", text: "Comment l'utiliser concrètement" },
  {
    type: "p",
    text: "Si votre vol au départ ou à destination de l'UE a été fortement perturbé, vous avez probablement des droits. AirAssist vérifie gratuitement votre éligibilité et se charge de la réclamation.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Le règlement EC 261/2004 expliqué simplement",
    description:
      "À qui s'applique le règlement EC 261/2004, quels droits et quels montants d'indemnisation pour les passagers aériens.",
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
      <SeoHero eyebrow="Guide" title="Le règlement EC 261/2004 expliqué simplement" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/blog/regle-3-heures-retard", label: "La règle des 3 heures" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

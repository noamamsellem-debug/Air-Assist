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

const PATH = "/bareme-indemnisation";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Barème indemnisation vol : 250 €, 400 € ou 600 € ?",
    description:
      "Découvrez le barème officiel d'indemnisation des vols (EC 261/2004) selon la distance. Calculez gratuitement votre montant avec AirAssist.",
  });
}

const LEAD =
  "Le règlement européen EC 261/2004 fixe des montants forfaitaires, identiques pour tous les passagers d'un même vol, quel que soit le prix payé. Le montant dépend uniquement de la distance du vol et, dans certains cas, de l'ampleur du retard. Voici comment il se décompose.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Le barème selon la distance" },
  {
    type: "ul",
    items: [
      "**250 €** — vols jusqu'à 1 500 km (ex. la plupart des vols intérieurs et courts européens).",
      "**400 €** — vols de 1 500 à 3 500 km, ainsi que tous les vols à l'intérieur de l'UE de plus de 1 500 km.",
      "**600 €** — vols de plus de 3 500 km (long-courriers hors UE).",
    ],
  },
  { type: "h2", text: "Les cas de réduction de moitié" },
  {
    type: "p",
    text: "Pour les vols **de plus de 3 500 km**, si le retard à l'arrivée est compris entre 3 et 4 heures, l'indemnité peut être réduite à **300 €** au lieu de 600 €. En dessous de 3 500 km, il n'y a pas de réduction : c'est le montant plein.",
  },
  { type: "h2", text: "Ce qui ne change pas le montant" },
  {
    type: "p",
    text: "Le prix de votre billet, la classe de voyage, le fait d'avoir payé avec des miles : rien de tout cela n'entre en compte. L'indemnité est forfaitaire. Un billet à 40 € peut donner droit à 600 €.",
  },
  { type: "h2", text: "Indemnité ≠ remboursement" },
  {
    type: "p",
    text: "L'indemnité forfaitaire est une **compensation** pour le préjudice subi. Elle ne se confond pas avec le **remboursement** du billet (en cas d'annulation) ni avec la prise en charge (repas, hôtel). Ces droits peuvent se cumuler.",
  },
  { type: "h2", text: "Calculez votre montant" },
  {
    type: "p",
    text: "Indiquez votre vol : AirAssist calcule gratuitement la distance, le montant applicable et vérifie votre éligibilité en 2 minutes.",
  },
];

const FAQ = [
  {
    q: "Le montant dépend-il du prix de mon billet ?",
    a: "Non, il est forfaitaire et dépend seulement de la distance.",
  },
  {
    q: "Puis-je cumuler indemnité et remboursement ?",
    a: "Oui, ce sont deux droits distincts.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Barème d'indemnisation des vols (EC 261/2004)",
    serviceType: "Calcul et réclamation d'indemnité EC 261/2004",
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    url: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero
        eyebrow="Règlement EC 261/2004"
        title="Barème d'indemnisation des vols (EC 261/2004)"
        lead={LEAD}
      />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <FaqSection items={FAQ} />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/indemnisation-surbooking", label: "Surbooking" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

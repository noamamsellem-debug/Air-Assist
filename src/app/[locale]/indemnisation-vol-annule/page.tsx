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

const PATH = "/indemnisation-vol-annule";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Vol annulé : indemnisation jusqu'à 600 € + remboursement",
    description:
      "Vol annulé moins de 14 jours avant le départ ? Vous avez droit à un remboursement et jusqu'à 600 € d'indemnité. Vérification gratuite avec AirAssist.",
  });
}

const LEAD =
  "L'annulation d'un vol vous ouvre deux droits distincts : le remboursement ou le réacheminement, et, dans de nombreux cas, une indemnité forfaitaire allant jusqu'à 600 €. Ces deux droits se cumulent. AirAssist vérifie gratuitement votre situation et réclame ce qui vous est dû.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Vos deux droits en cas d'annulation" },
  {
    type: "ol",
    items: [
      "**Le choix entre remboursement et réacheminement.** La compagnie doit vous proposer soit le remboursement intégral du billet, soit un autre vol vers votre destination. Ce droit s'applique toujours, quelle que soit la raison de l'annulation.",
      "**Une indemnité forfaitaire**, en plus, si l'annulation vous a été annoncée **moins de 14 jours avant le départ** et qu'aucune circonstance extraordinaire ne s'applique.",
    ],
  },
  { type: "h2", text: "Quand l'indemnité est-elle due ?" },
  {
    type: "p",
    text: "L'indemnité (250 €, 400 € ou 600 € selon la distance) dépend du moment où vous avez été prévenu et du réacheminement proposé :",
  },
  {
    type: "ul",
    items: [
      "Annonce **moins de 7 jours** avant le départ : indemnité due si le vol de remplacement vous fait partir bien plus tôt ou arriver nettement plus tard.",
      "Annonce **entre 7 et 14 jours** avant : indemnité due selon les écarts d'horaires du vol proposé.",
      "Annonce **plus de 14 jours** avant : pas d'indemnité, mais le remboursement reste dû.",
    ],
  },
  { type: "h2", text: "Les circonstances extraordinaires" },
  {
    type: "p",
    text: "Comme pour les retards, la compagnie peut s'exonérer de l'indemnité en cas de circonstances extraordinaires (météo, grève du contrôle aérien, sécurité). Une annulation pour raison économique, manque de personnel ou panne technique reste, en principe, indemnisable.",
  },
  { type: "h2", text: "Combien de temps pour réclamer ?" },
  { type: "p", text: "En France, le délai est de **5 ans** après la date du vol annulé." },
  { type: "h2", text: "Comment AirAssist vous aide" },
  {
    type: "p",
    text: "Indiquez votre vol annulé : nous déterminons gratuitement si une indemnité est due en plus de votre remboursement, et nous menons la réclamation. Aucun frais tant que vous n'êtes pas indemnisé.",
  },
];

const FAQ = [
  {
    q: "On m'a remboursé mon billet, ai-je encore droit à l'indemnité ?",
    a: "Oui, le remboursement et l'indemnité sont deux choses différentes et cumulables.",
  },
  {
    q: "La compagnie a annulé pour cause de grève, suis-je indemnisé ?",
    a: "Cela dépend : une grève interne à la compagnie est souvent indemnisable, une grève du contrôle aérien généralement non.",
  },
  {
    q: "J'ai accepté un autre vol, puis-je quand même être indemnisé ?",
    a: "Oui, si l'annonce est intervenue moins de 14 jours avant et selon les écarts d'horaires.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Indemnisation vol annulé",
    serviceType: "Réclamation d'indemnité EC 261/2004 pour vol annulé",
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    url: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero eyebrow="Règlement EC 261/2004" title="Indemnisation pour vol annulé" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <FaqSection items={FAQ} />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-surbooking", label: "Surbooking" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

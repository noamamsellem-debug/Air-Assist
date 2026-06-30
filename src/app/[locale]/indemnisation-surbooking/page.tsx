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

const PATH = "/indemnisation-surbooking";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Surbooking : indemnisation refus d'embarquement jusqu'à 600 €",
    description:
      "Refusé à l'embarquement pour cause de surbooking ? Vous avez droit à une indemnité immédiate jusqu'à 600 €. Vérification gratuite avec AirAssist.",
  });
}

const LEAD =
  "Quand une compagnie vend plus de billets qu'il n'y a de sièges, certains passagers se voient refuser l'embarquement : c'est le surbooking. Si cela vous arrive contre votre volonté, vous avez droit à une indemnité immédiate pouvant atteindre 600 €, en plus de la prise en charge. AirAssist fait valoir ce droit pour vous.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Vos droits en cas de refus d'embarquement" },
  {
    type: "p",
    text: "La compagnie doit d'abord chercher des **volontaires** prêts à céder leur place en échange d'une compensation négociée. S'il n'y a pas assez de volontaires et que vous êtes refusé contre votre gré, vous avez droit à :",
  },
  {
    type: "ul",
    items: [
      "Une **indemnité forfaitaire** : 250 €, 400 € ou 600 € selon la distance du vol.",
      "Le **remboursement** du billet ou un **réacheminement** vers votre destination.",
      "Une **prise en charge** : repas, rafraîchissements, et hébergement si une nuit est nécessaire.",
    ],
  },
  { type: "h2", text: "Une indemnité rarement réduite" },
  {
    type: "p",
    text: "Contrairement au retard, l'indemnité pour refus d'embarquement involontaire est due **dès lors que vous remplissez les conditions** : vous étiez à l'heure à l'enregistrement, en possession d'une réservation valide. Le surbooking n'est jamais une « circonstance extraordinaire » : c'est une décision commerciale de la compagnie.",
  },
  { type: "h2", text: "Attention aux compensations proposées sur place" },
  {
    type: "p",
    text: "Si la compagnie vous propose un bon d'achat pour accepter de céder votre place, sachez que vous renoncez alors à l'indemnité légale. Avant d'accepter, vérifiez ce que vous valez réellement.",
  },
  { type: "h2", text: "Comment AirAssist vous aide" },
  {
    type: "p",
    text: "Vous avez été débarqué ou refusé à l'embarquement ? Nous vérifions gratuitement votre dossier et réclamons l'indemnité due. Aucun frais tant que vous n'êtes pas indemnisé.",
  },
];

const FAQ = [
  {
    q: "J'ai accepté un bon d'achat, puis-je revenir dessus ?",
    a: "C'est difficile une fois l'accord signé : c'est pourquoi il vaut mieux vérifier ses droits avant d'accepter.",
  },
  {
    q: "Le surbooking peut-il être une circonstance extraordinaire ?",
    a: "Non, c'est une décision commerciale de la compagnie, l'indemnité est due.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Indemnisation surbooking et refus d'embarquement",
    serviceType: "Réclamation d'indemnité EC 261/2004 pour refus d'embarquement",
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    url: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero
        eyebrow="Règlement EC 261/2004"
        title="Indemnisation pour surbooking et refus d'embarquement"
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
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

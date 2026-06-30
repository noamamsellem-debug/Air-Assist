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

const PATH = "/blog/compagnie-refuse-indemnisation";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "La compagnie refuse de m'indemniser : que faire ?",
    description:
      "Refus d'indemnisation par la compagnie ? Relance, mise en demeure, médiateur, justice : les étapes pour faire valoir vos droits. Guide AirAssist.",
  });
}

const LEAD =
  "Un refus de la compagnie est fréquent — et loin d'être la fin de l'histoire. Beaucoup de refus sont infondés et cèdent dès qu'on insiste avec les bons arguments. Voici les étapes pour faire valoir vos droits.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "Étape 1 : la relance écrite" },
  {
    type: "p",
    text: "Répondez par écrit en rappelant le règlement EC 261/2004, votre numéro de vol, le retard constaté à l'arrivée et le montant dû. Demandez une réponse motivée. Une relance ferme et documentée suffit parfois à débloquer le versement.",
  },
  { type: "h2", text: "Étape 2 : la mise en demeure" },
  {
    type: "p",
    text: "Si la compagnie persiste, adressez une **mise en demeure** par lettre recommandée, en fixant un délai de paiement. Ce courrier formel marque le passage à une démarche contentieuse et est souvent pris plus au sérieux.",
  },
  { type: "h2", text: "Étape 3 : le médiateur" },
  {
    type: "p",
    text: "Vous pouvez saisir gratuitement le **médiateur du tourisme et du voyage** si la compagnie y adhère, ou l'organisme national compétent. Le médiateur examine le litige et propose une solution, sans frais pour vous.",
  },
  { type: "h2", text: "Étape 4 : la justice" },
  {
    type: "p",
    text: "En dernier recours, le litige peut être porté devant le tribunal compétent. Pour des montants de cet ordre, la procédure reste accessible, et les chances d'aboutir sont élevées quand le droit est de votre côté.",
  },
  { type: "h2", text: "AirAssist prend le relais" },
  {
    type: "p",
    text: "Plutôt que de mener seul ces démarches, vous pouvez confier votre dossier à AirAssist : nous relançons, argumentons et engageons les recours nécessaires, sans frais tant que vous n'êtes pas indemnisé.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "La compagnie refuse de m'indemniser : que faire ?",
    description:
      "Relance, mise en demeure, médiateur, justice : les étapes pour obtenir l'indemnité refusée par la compagnie.",
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
      <SeoHero eyebrow="Guide" title="La compagnie refuse de m'indemniser : que faire ?" lead={LEAD} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={BLOCS} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/blog/circonstances-extraordinaires", label: "Circonstances extraordinaires" },
        ]}
      />
      <div className="py-10" />
    </>
  );
}

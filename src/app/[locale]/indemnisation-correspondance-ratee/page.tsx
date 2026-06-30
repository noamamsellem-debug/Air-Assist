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

const PATH = "/indemnisation-correspondance-ratee";

export function generateMetadata() {
  return buildSeoMetadata({
    path: PATH,
    title: "Correspondance ratée : indemnisation jusqu'à 600 €",
    description:
      "Correspondance manquée à cause d'un premier vol en retard et arrivée finale +3 h ? Réclamez jusqu'à 600 €. Vérification gratuite avec AirAssist.",
  });
}

const LEAD =
  "Quand un premier vol en retard vous fait rater votre correspondance, ce qui compte est l'heure à laquelle vous arrivez à votre destination finale. Si ce retard final atteint 3 heures ou plus, vous pouvez prétendre à une indemnité allant jusqu'à 600 €. AirAssist vérifie gratuitement votre trajet complet.";

const BLOCS: Bloc[] = [
  { type: "h2", text: "La règle de la destination finale" },
  {
    type: "p",
    text: "Pour une réservation comprenant plusieurs vols sous un **même numéro de réservation**, l'indemnité se calcule sur le retard à l'arrivée finale, pas sur chaque segment. Peu importe que vous ayez raté la correspondance d'une minute : si vous arrivez 3 heures ou plus après l'heure prévue, le droit à indemnité peut s'ouvrir.",
  },
  { type: "h2", text: "Conditions à réunir" },
  {
    type: "ul",
    items: [
      "Les vols doivent faire partie d'une **réservation unique** (un seul billet, même si les compagnies diffèrent).",
      "Le **retard final** à destination doit être de 3 heures ou plus.",
      "Le trajet doit entrer dans le champ du règlement EC 261/2004.",
    ],
  },
  { type: "h2", text: "La distance se calcule sur tout le trajet" },
  {
    type: "p",
    text: "Le montant (250 €, 400 € ou 600 €) se calcule sur la distance entre votre **aéroport de départ initial** et votre **destination finale**, pas sur un seul segment. Un long trajet avec correspondance peut donc atteindre les 600 €.",
  },
  { type: "h2", text: "Comment AirAssist vous aide" },
  {
    type: "p",
    text: "Donnez-nous votre trajet complet : nous reconstituons les horaires, calculons le retard final et déterminons gratuitement votre indemnité. Réclamation prise en charge, aucun frais sans résultat.",
  },
];

const FAQ = [
  {
    q: "Mes deux vols étaient sur deux compagnies différentes, suis-je couvert ?",
    a: "Oui, si tout était sur la même réservation.",
  },
  {
    q: "J'avais réservé mes vols séparément, ai-je droit à quelque chose ?",
    a: "C'est plus complexe : chaque vol est traité séparément. Faites vérifier votre cas.",
  },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Indemnisation correspondance ratée",
    serviceType: "Réclamation d'indemnité EC 261/2004 pour correspondance manquée",
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    url: `${SITE_URL}/fr${PATH}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero eyebrow="Règlement EC 261/2004" title="Indemnisation pour correspondance ratée" lead={LEAD} />
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

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import { COMPAGNIES_INDEM, getCompagnieIndem } from "@/data/indemnisation-compagnies";
import {
  SeoHero,
  ProseBlocks,
  EstimationSection,
  RelatedLinks,
  type Bloc,
} from "@/components/seo/SeoPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return COMPAGNIES_INDEM.map((c) => ({ locale: "fr", slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCompagnieIndem(slug);
  if (!c) return {};
  return buildSeoMetadata({
    path: `/indemnisation/${c.slug}`,
    title: `Indemnisation ${c.nom} : retard & annulation jusqu'à 600 €`,
    description: `Vol ${c.nom} retardé ou annulé ? Réclamez jusqu'à 600 € d'indemnité (EC 261/2004). Vérification gratuite avec AirAssist.`,
  });
}

/** Construit le contenu commun en interpolant le nom de la compagnie. */
function blocs(nom: string, specs: string): Bloc[] {
  return [
    { type: "h2", text: `Vos droits face à ${nom}` },
    {
      type: "p",
      text: `Un vol ${nom} perturbé relève du règlement européen EC 261/2004. Le montant de l'indemnité dépend de la distance du vol :`,
    },
    {
      type: "ul",
      items: [
        "**250 €** pour les vols jusqu'à 1 500 km.",
        "**400 €** pour les vols de 1 500 à 3 500 km.",
        "**600 €** pour les vols de plus de 3 500 km.",
      ],
    },
    {
      type: "p",
      text: "Les principaux cas ouvrant droit à indemnité : un **retard de 3 heures ou plus** à l'arrivée, une **annulation** annoncée moins de 14 jours avant le départ, ou un **refus d'embarquement** pour cause de surbooking.",
    },
    { type: "h2", text: `${nom} en pratique` },
    { type: "p", text: specs },
    { type: "h2", text: "Comment AirAssist réclame pour vous" },
    {
      type: "p",
      text: `Vous vérifiez gratuitement votre éligibilité en 2 minutes. Si votre dossier est recevable, nous nous chargeons de toute la réclamation auprès de ${nom} : courriers, relances, argumentation. Vous n'avancez aucun frais — nous ne sommes rémunérés qu'en cas de succès.`,
    },
  ];
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = getCompagnieIndem(slug);
  if (!c) notFound();

  const url = `${SITE_URL}/fr/indemnisation/${c.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Indemnisation vol ${c.nom}`,
      serviceType: "Réclamation d'indemnité EC 261/2004",
      provider: { "@type": "Organization", name: "Air Assist" },
      areaServed: "EU",
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Air Assist", item: `${SITE_URL}/fr` },
        { "@type": "ListItem", position: 2, name: c.nom, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero eyebrow="Règlement EC 261/2004" title={`Réclamer une indemnité à ${c.nom}`} lead={c.intro} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={blocs(c.nom, c.specs)} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />

      {/* Autres compagnies (maillage interne) */}
      <section className="mx-auto mt-10 max-w-3xl px-4">
        <h2 className="text-lg font-semibold text-slate-900">Autres compagnies</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {COMPAGNIES_INDEM.filter((x) => x.slug !== c.slug).map((x) => (
            <li key={x.slug}>
              <Link
                href={`/indemnisation/${x.slug}`}
                className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                {x.nom}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="py-10" />
    </>
  );
}

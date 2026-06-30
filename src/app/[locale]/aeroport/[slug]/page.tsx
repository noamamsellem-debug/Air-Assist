import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import { AEROPORTS_INDEM, getAeroportIndem } from "@/data/indemnisation-aeroports";
import {
  SeoHero,
  ProseBlocks,
  EstimationSection,
  RelatedLinks,
  type Bloc,
} from "@/components/seo/SeoPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return AEROPORTS_INDEM.map((a) => ({ locale: "fr", slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAeroportIndem(slug);
  if (!a) return {};
  return buildSeoMetadata({
    path: `/aeroport/${a.slug}`,
    title: `Vol retardé à ${a.nom} : indemnisation jusqu'à 600 €`,
    description: `Vol retardé ou annulé au départ de ${a.nom} ? Réclamez jusqu'à 600 € d'indemnité. Vérification gratuite avec AirAssist.`,
  });
}

function blocs(nom: string, specs: string): Bloc[] {
  return [
    { type: "h2", text: `Vos droits au départ de ${nom}` },
    {
      type: "p",
      text: `Que votre vol parte de ${nom} ou y arrive, le règlement européen EC 261/2004 s'applique. L'indemnité dépend de la distance du vol :`,
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
      text: "Vous pouvez prétendre à une indemnité en cas de **retard de 3 heures ou plus** à l'arrivée, d'**annulation** annoncée moins de 14 jours avant le départ, ou de **refus d'embarquement** pour surbooking.",
    },
    { type: "h2", text: `${nom} en pratique` },
    { type: "p", text: specs },
    { type: "h2", text: "Comment AirAssist vous aide" },
    {
      type: "p",
      text: "Indiquez votre vol : nous vérifions gratuitement votre éligibilité et menons la réclamation auprès de la compagnie. Aucun frais tant que vous n'êtes pas indemnisé.",
    },
  ];
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = getAeroportIndem(slug);
  if (!a) notFound();

  const url = `${SITE_URL}/fr/aeroport/${a.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Indemnisation des vols à ${a.nom}`,
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
        { "@type": "ListItem", position: 2, name: a.nom, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoHero eyebrow="Règlement EC 261/2004" title={`Indemnisation des vols à ${a.nom}`} lead={a.intro} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={blocs(a.nom, a.specs)} />
      </article>
      <EstimationSection />
      <RelatedLinks
        items={[
          { href: "/indemnisation-vol-retarde", label: "Retard de vol" },
          { href: "/indemnisation-vol-annule", label: "Vol annulé" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation" },
        ]}
      />

      {/* Autres aéroports (maillage interne) */}
      <section className="mx-auto mt-10 max-w-3xl px-4">
        <h2 className="text-lg font-semibold text-slate-900">Autres aéroports</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {AEROPORTS_INDEM.filter((x) => x.slug !== a.slug).map((x) => (
            <li key={x.slug}>
              <Link
                href={`/aeroport/${x.slug}`}
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

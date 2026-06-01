import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { AEROPORTS, getAeroport, listeAeroports } from "@/data/aeroports";
import { Calculator } from "@/components/Calculator";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(AEROPORTS).map((iata) => ({ locale, iata: iata.toLowerCase() })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; iata: string }>;
}) {
  const { locale, iata } = await params;
  const a = getAeroport(iata);
  if (!a) return {};
  return buildMetadata({
    locale,
    path: `/aeroports/${a.iata.toLowerCase()}`,
    title: `Vol retardé à ${a.ville} (${a.iata}) : indemnisation EC 261/2004`,
    description: `Réclamez votre indemnité pour un vol retardé ou annulé au départ ou à l'arrivée de ${a.nom} (${a.iata}).`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; iata: string }>;
}) {
  const { locale, iata } = await params;
  setRequestLocale(locale);
  const a = getAeroport(iata);
  if (!a) notFound();
  const n = await getTranslations("nav");

  const url = `${SITE_URL}/${locale}/aeroports/${a.iata.toLowerCase()}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Mon vol au départ de ${a.ville} a été retardé, ai-je droit à une indemnité ?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Oui, à partir de 3 heures de retard à l'arrivée, un vol depuis ${a.nom} (${a.iata}) peut ouvrir droit à 250 € à 600 € selon la distance.`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Air Assist", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Aéroports", item: url },
        { "@type": "ListItem", position: 3, name: `${a.ville} (${a.iata})`, item: url },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold">
        Vol retardé ou annulé à {a.ville} ({a.iata})
      </h1>
      <p className="mt-4 text-slate-600">
        Un vol au départ ou à l'arrivée de {a.nom} retardé de plus de 3 heures, annulé ou
        surbooké peut être indemnisé au titre du règlement EC 261/2004.
        {a.ue ? " Cet aéroport est situé dans l'Union européenne." : ""}
      </p>
      <p className="mt-6">
        <Link href="/reclamation" className="btn-primary">{n("startClaim")}</Link>
      </p>

      <section className="mt-10">
        <Calculator />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Autres aéroports</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {listeAeroports()
            .filter((x) => x.iata !== a.iata)
            .slice(0, 12)
            .map((x) => (
              <li key={x.iata}>
                <Link
                  href={`/aeroports/${x.iata.toLowerCase()}`}
                  className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
                >
                  {x.ville} ({x.iata})
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </article>
  );
}

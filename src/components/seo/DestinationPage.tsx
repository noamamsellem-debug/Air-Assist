import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import { SeoHero, EstimationSection, ProseBlocks, FaqSection } from "@/components/seo/SeoPage";
import { PAGES_DESTINATIONS, getPageDestination } from "@/data/pages-destinations";
import { getPageCompagnie } from "@/data/pages-compagnies";

/** Métadonnées d'une page destination (title/description/canonical fr). */
export function metaDestination(slug: string) {
  const d = getPageDestination(slug);
  if (!d) return {};
  return buildSeoMetadata({ path: `/${d.slug}`, title: d.title, description: d.description });
}

/** Rendu complet d'une page « vol retardé [Ville] indemnisation ». */
export function DestinationContent({ slug }: { slug: string }) {
  const d = getPageDestination(slug);
  if (!d) notFound();

  const url = `${SITE_URL}/fr/${d.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Indemnisation vol retardé ${d.ville}`,
      serviceType: "Réclamation d'indemnité EC 261/2004",
      provider: { "@type": "Organization", name: "Air Assist" },
      areaServed: "EU",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Air Assist", item: `${SITE_URL}/fr` },
        { "@type": "ListItem", position: 2, name: `Vol retardé ${d.ville}`, item: url },
      ],
    },
  ];

  const compagnies = d.compagnies
    .map((s) => getPageCompagnie(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const autresDestinations = PAGES_DESTINATIONS.filter((x) => x.slug !== d.slug).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SeoHero
        eyebrow="Règlement EC 261/2004"
        title={`Vol retardé ${d.ville} : votre indemnisation`}
        lead={d.intro}
      />

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <nav className="text-sm text-slate-500" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-brand-600">Accueil</Link>
          <span className="px-1.5">›</span>
          <span className="text-slate-700">Vol retardé {d.ville}</span>
        </nav>
      </div>

      <EstimationSection title={`Calculez votre indemnité — vol vers ou depuis ${d.ville}`} />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={d.corps} />

        {/* Tableau des montants contextualisé */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Montants d&apos;indemnisation pour un vol vers {d.ville}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="rounded-l-lg px-4 py-2 font-medium">Trajet (exemple)</th>
                <th className="px-4 py-2 font-medium">Distance</th>
                <th className="rounded-r-lg px-4 py-2 font-medium">Indemnité</th>
              </tr>
            </thead>
            <tbody>
              {d.trajets.map((t) => (
                <tr key={t.route} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{t.route}</td>
                  <td className="px-4 py-2 text-slate-600">{t.km}</td>
                  <td className="px-4 py-2 font-semibold text-brand-600">{t.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Barème forfaitaire EC 261/2004, indépendant du prix du billet : 250 € (≤ 1 500 km),
          400 € (1 500–3 500 km et intra-UE &gt; 1 500 km), 600 € (&gt; 3 500 km).
        </p>

        {/* Couverture territoriale */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Vos droits pour un vol vers ou depuis {d.ville}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          {d.ville} se trouvant dans l&apos;Union européenne, la couverture joue{" "}
          <strong>dans les deux sens</strong> : un vol <strong>depuis la France</strong> vers{" "}
          {d.ville} relève du règlement EC 261/2004 (départ d&apos;un aéroport de l&apos;UE), et un vol{" "}
          <strong>retour depuis {d.ville}</strong> l&apos;est également (départ d&apos;un aéroport de
          l&apos;UE). C&apos;est un avantage par rapport aux destinations hors UE, où seul le vol au
          départ de l&apos;UE est couvert. Dès 3 heures de retard à l&apos;arrivée, une annulation
          annoncée moins de 14 jours avant le départ ou un refus d&apos;embarquement, une indemnité
          peut être due — une panne technique ou une grève du personnel de la compagnie restant
          indemnisables.
        </p>

        {/* Comment réclamer */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Comment réclamer votre indemnité
        </h2>
        <ol className="mt-4 space-y-4">
          {d.etapes.map((e, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{e.titre}</p>
                <p className="mt-1 text-sm text-slate-600">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </article>

      <FaqSection items={d.faq} />

      {/* Maillage interne */}
      <section className="mx-auto mt-12 max-w-3xl px-4">
        <h2 className="text-lg font-semibold text-slate-900">Pages liées</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {compagnies.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/indemnisation-vol-retarde-${c.slug}`}
                className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Indemnisation {c.nom}
              </Link>
            </li>
          ))}
          {autresDestinations.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/${x.slug}`}
                className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Vol retardé {x.ville}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/vol-retarde-paris-cdg-indemnisation" className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              Vol retardé Paris-CDG
            </Link>
          </li>
          <li>
            <Link href="/bareme-indemnisation" className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
              Barème d&apos;indemnisation →
            </Link>
          </li>
          <li>
            <Link href="/droits-passagers" className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
              Vos droits (EC 261/2004) →
            </Link>
          </li>
        </ul>
      </section>

      {/* CTA final */}
      <section className="mx-auto mt-12 max-w-3xl px-4 pb-16">
        <div className="home-hero rounded-3xl px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight">Vol vers ou depuis {d.ville} perturbé ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/85">
            Vérifiez gratuitement votre indemnité en 2 minutes. Sans frais si nous n&apos;obtenons rien.
          </p>
          <Link href="/reclamation" className="btn-light mt-5 inline-flex">
            Réclamer mon indemnisation
          </Link>
        </div>
      </section>
    </>
  );
}

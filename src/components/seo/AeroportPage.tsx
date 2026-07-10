import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import { SeoHero, EstimationSection, ProseBlocks, FaqSection } from "@/components/seo/SeoPage";
import { PAGES_AEROPORTS, getPageAeroport } from "@/data/pages-aeroports";
import { getPageCompagnie } from "@/data/pages-compagnies";

/** Métadonnées d'une page aéroport (title/description/canonical fr). */
export function metaAeroport(slug: string) {
  const a = getPageAeroport(slug);
  if (!a) return {};
  return buildSeoMetadata({
    path: `/${a.slug}`,
    title: a.title,
    description: a.description,
  });
}

/** Rendu complet d'une page « vol retardé [Aéroport] indemnisation ». */
export function AeroportContent({ slug }: { slug: string }) {
  const a = getPageAeroport(slug);
  if (!a) notFound();

  const url = `${SITE_URL}/fr/${a.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Indemnisation vol retardé ${a.nom}`,
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
        { "@type": "ListItem", position: 2, name: `Vol retardé ${a.nom}`, item: url },
      ],
    },
  ];

  // Maillage : compagnies présentes + 2 autres aéroports + barème + droits.
  const compagnies = a.compagnies
    .map((s) => getPageCompagnie(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const autresAeroports = PAGES_AEROPORTS.filter((x) => x.slug !== a.slug).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SeoHero
        eyebrow="Règlement EC 261/2004"
        title={`Vol retardé à ${a.nom} : votre indemnisation`}
        lead={a.intro}
      />

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <nav className="text-sm text-slate-500" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-brand-600">Accueil</Link>
          <span className="px-1.5">›</span>
          <span className="text-slate-700">Vol retardé {a.nom}</span>
        </nav>
      </div>

      <EstimationSection title={`Calculez votre indemnité — vol au départ ou à l'arrivée de ${a.nom}`} />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <ProseBlocks blocks={a.corps} />

        {/* Tableau des montants contextualisé */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Montants d&apos;indemnisation au départ de {a.nom}
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
              {a.trajets.map((t) => (
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

        {/* Couverture au départ de l'aéroport */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Vos droits pour un vol au départ de {a.nom}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          {a.nom} étant un aéroport de l&apos;Union européenne, <strong>tout vol qui en part est
          couvert par le règlement EC 261/2004, quelle que soit la compagnie</strong> — nationale,
          traditionnelle ou low-cost, européenne ou non. Dès que vous arrivez à destination avec
          3 heures de retard ou plus, ou en cas d&apos;annulation annoncée moins de 14 jours avant le
          départ ou de refus d&apos;embarquement, une indemnité forfaitaire peut être due. Une panne
          technique de l&apos;avion ou une grève du personnel de la compagnie restent indemnisables ;
          seules des circonstances exceptionnelles réelles (météo dangereuse, grève des contrôleurs
          aériens, sécurité) exonèrent le transporteur.
        </p>

        {/* Comment réclamer */}
        <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
          Comment réclamer votre indemnité
        </h2>
        <ol className="mt-4 space-y-4">
          {a.etapes.map((e, i) => (
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

      <FaqSection items={a.faq} />

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
          {autresAeroports.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/${x.slug}`}
                className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Vol retardé {x.nom}
              </Link>
            </li>
          ))}
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
          <h2 className="text-2xl font-extrabold tracking-tight">Vol retardé au départ de {a.nom} ?</h2>
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

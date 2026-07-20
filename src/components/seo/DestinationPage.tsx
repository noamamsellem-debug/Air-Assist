import { notFound } from "next/navigation";
import { buildSeoMetadata, SITE_URL } from "@/lib/seo";
import {
  SeoHero,
  SeoBreadcrumb,
  EstimationSection,
  ProseBlocks,
  ProseToc,
  AmountTable,
  StepList,
  FaqSection,
  LinkPills,
  SeoCta,
  ancre,
} from "@/components/seo/SeoPage";
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

      <SeoBreadcrumb courant={`Vol retardé ${d.ville}`} label="Fil d'Ariane" />

      <EstimationSection title={`Calculez votre indemnité — vol vers ou depuis ${d.ville}`} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10">
          <ProseToc blocks={d.corps} titre="Sommaire" />
        </div>

        <ProseBlocks blocks={d.corps} />

        {/* Tableau des montants contextualisé */}
        <AmountTable
          titre={`Montants d'indemnisation pour un vol vers ${d.ville}`}
          lignes={d.trajets}
          note="Barème forfaitaire EC 261/2004, indépendant du prix du billet : 250 € (≤ 1 500 km), 400 € (1 500–3 500 km et intra-UE > 1 500 km), 600 € (> 3 500 km)."
        />

        {/* Couverture territoriale */}
        <h2
          id={ancre(`Vos droits pour un vol vers ou depuis ${d.ville}`)}
          className="mt-12 scroll-mt-24 text-display-sm text-ink-900"
        >
          Vos droits pour un vol vers ou depuis {d.ville}
        </h2>
        <p className="mt-4 max-w-prose text-prose-lg leading-relaxed text-ink-700">
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
        <h2
          id={ancre("Comment réclamer votre indemnité")}
          className="mt-12 scroll-mt-24 text-display-sm text-ink-900"
        >
          Comment réclamer votre indemnité
        </h2>
        <StepList etapes={d.etapes} />
      </article>

      <FaqSection items={d.faq} />

      {/* Maillage interne */}
      <LinkPills
        items={[
          ...compagnies.map((c) => ({
            href: `/indemnisation-vol-retarde-${c.slug}`,
            label: `Indemnisation ${c.nom}`,
          })),
          ...autresDestinations.map((x) => ({
            href: `/${x.slug}`,
            label: `Vol retardé ${x.ville}`,
          })),
          { href: "/vol-retarde-paris-cdg-indemnisation", label: "Vol retardé Paris-CDG" },
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation", accent: true },
          { href: "/droits-passagers", label: "Vos droits (EC 261/2004)", accent: true },
        ]}
      />

      <SeoCta
        titre={`Vol vers ou depuis ${d.ville} perturbé ?`}
        texte="Vérifiez gratuitement votre indemnité en 2 minutes. Sans frais si nous n'obtenons rien."
      />
    </>
  );
}

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
import { PAGES_COMPAGNIES, getPageCompagnie } from "@/data/pages-compagnies";

const PREFIXE = "/indemnisation-vol-retarde-";

/** Métadonnées d'une page compagnie (title/description/canonical fr). */
export function metaCompagnie(slug: string) {
  const c = getPageCompagnie(slug);
  if (!c) return {};
  return buildSeoMetadata({
    path: `${PREFIXE}${c.slug}`,
    title: c.title,
    description: c.description,
  });
}

/** Rendu complet d'une page « indemnisation vol retardé [Compagnie] ». */
export function CompagnieContent({ slug }: { slug: string }) {
  const c = getPageCompagnie(slug);
  if (!c) notFound();

  const url = `${SITE_URL}/fr${PREFIXE}${c.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Indemnisation vol retardé ${c.nom}`,
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
        { "@type": "ListItem", position: 2, name: `Indemnisation ${c.nom}`, item: url },
      ],
    },
  ];

  // Maillage : 3 autres compagnies + barème + vos droits.
  const autres = PAGES_COMPAGNIES.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SeoHero
        eyebrow="Règlement EC 261/2004"
        title={`Indemnisation vol retardé ${c.nom}`}
        lead={c.intro}
      />

      <SeoBreadcrumb courant={`Indemnisation ${c.nom}`} label="Fil d'Ariane" />

      <EstimationSection title={`Calculez votre indemnité ${c.nom}`} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10">
          <ProseToc blocks={c.corps} titre="Sommaire" />
        </div>

        <ProseBlocks blocks={c.corps} />

        {/* Tableau des montants contextualisé */}
        <AmountTable
          titre={`Montants d'indemnisation sur les vols ${c.nom}`}
          lignes={c.trajets}
          note="Barème forfaitaire EC 261/2004, indépendant du prix du billet : 250 € (≤ 1 500 km), 400 € (1 500–3 500 km et intra-UE > 1 500 km), 600 € (> 3 500 km)."
        />

        {/* Comment réclamer */}
        <h2
          id={ancre(`Comment réclamer avec ${c.nom}`)}
          className="mt-12 scroll-mt-24 text-display-sm text-ink-900"
        >
          Comment réclamer avec {c.nom}
        </h2>
        <StepList etapes={c.etapes} />
      </article>

      <FaqSection items={c.faq} />

      {/* Maillage interne */}
      <LinkPills
        items={[
          ...autres.map((x) => ({
            href: `${PREFIXE}${x.slug}`,
            label: `Indemnisation ${x.nom}`,
          })),
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation", accent: true },
          { href: "/droits-passagers", label: "Vos droits (EC 261/2004)", accent: true },
        ]}
      />

      <SeoCta
        titre={`Vol ${c.nom} retardé ou annulé ?`}
        texte="Vérifiez gratuitement votre indemnité en 2 minutes. Sans frais si nous n'obtenons rien."
      />
    </>
  );
}

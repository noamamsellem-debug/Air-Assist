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

      <SeoBreadcrumb courant={`Vol retardé ${a.nom}`} label="Fil d'Ariane" />

      <EstimationSection title={`Calculez votre indemnité — vol au départ ou à l'arrivée de ${a.nom}`} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10">
          <ProseToc blocks={a.corps} titre="Sommaire" />
        </div>

        <ProseBlocks blocks={a.corps} />

        {/* Tableau des montants contextualisé */}
        <AmountTable
          titre={`Montants d'indemnisation au départ de ${a.nom}`}
          lignes={a.trajets}
          note="Barème forfaitaire EC 261/2004, indépendant du prix du billet : 250 € (≤ 1 500 km), 400 € (1 500–3 500 km et intra-UE > 1 500 km), 600 € (> 3 500 km)."
        />

        {/* Couverture au départ de l'aéroport */}
        <h2
          id={ancre(`Vos droits pour un vol au départ de ${a.nom}`)}
          className="mt-12 scroll-mt-24 text-display-sm text-ink-900"
        >
          Vos droits pour un vol au départ de {a.nom}
        </h2>
        <p className="mt-4 max-w-prose text-prose-lg leading-relaxed text-ink-700">
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
        <h2
          id={ancre("Comment réclamer votre indemnité")}
          className="mt-12 scroll-mt-24 text-display-sm text-ink-900"
        >
          Comment réclamer votre indemnité
        </h2>
        <StepList etapes={a.etapes} />
      </article>

      <FaqSection items={a.faq} />

      {/* Maillage interne */}
      <LinkPills
        items={[
          ...compagnies.map((c) => ({
            href: `/indemnisation-vol-retarde-${c.slug}`,
            label: `Indemnisation ${c.nom}`,
          })),
          ...autresAeroports.map((x) => ({
            href: `/${x.slug}`,
            label: `Vol retardé ${x.nom}`,
          })),
          { href: "/bareme-indemnisation", label: "Barème d'indemnisation", accent: true },
          { href: "/droits-passagers", label: "Vos droits (EC 261/2004)", accent: true },
        ]}
      />

      <SeoCta
        titre={`Vol retardé au départ de ${a.nom} ?`}
        texte="Vérifiez gratuitement votre indemnité en 2 minutes. Sans frais si nous n'obtenons rien."
      />
    </>
  );
}

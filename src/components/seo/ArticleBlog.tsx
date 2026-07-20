import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo";
import {
  EstimationSection,
  ProseBlocks,
  ProseToc,
  FaqSection,
  LinkPills,
  SeoCta,
  type Bloc,
} from "@/components/seo/SeoPage";
import { getArticleBlog } from "@/data/articles-blog";

/** Date ISO → format lisible fr (ex. « 12 février 2026 »). */
function dateFr(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Métadonnées d'un article (title/description/canonical + og:article). */
export function metaArticle(slug: string): Metadata {
  const a = getArticleBlog(slug);
  if (!a) return {};
  const url = `${SITE_URL}/fr/blog/${a.slug}`;
  return {
    title: { absolute: a.title },
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      publishedTime: a.datePublished,
      title: a.title,
      description: a.description,
      url,
      siteName: "Air Assist",
      locale: "fr_FR",
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
    robots: { index: true, follow: true },
  };
}

/** Insère le CTA d'estimation au h2 le plus proche du milieu de l'article. */
function scinderCorps(blocks: Bloc[]): [Bloc[], Bloc[]] {
  const milieu = blocks.length / 2;
  const h2s = blocks.map((b, i) => (b.type === "h2" ? i : -1)).filter((i) => i > 0);
  if (h2s.length === 0) return [blocks, []];
  const coupe = h2s.reduce((best, i) => (Math.abs(i - milieu) < Math.abs(best - milieu) ? i : best), h2s[0]!);
  return [blocks.slice(0, coupe), blocks.slice(coupe)];
}

/** Rendu complet d'un article de blog. */
export function ArticleContent({ slug }: { slug: string }) {
  const a = getArticleBlog(slug);
  if (!a) notFound();

  const url = `${SITE_URL}/fr/blog/${a.slug}`;
  const [avant, apres] = scinderCorps(a.corps);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.h1,
      description: a.description,
      inLanguage: "fr",
      datePublished: a.datePublished,
      dateModified: a.datePublished,
      author: { "@type": "Organization", name: "Air Assist" },
      publisher: {
        "@type": "Organization",
        name: "Air Assist",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/airassist-logo.png` },
      },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Air Assist", item: `${SITE_URL}/fr` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/fr/blog` },
        { "@type": "ListItem", position: 3, name: a.h1, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* En-tête : page claire, le titre porte le message (plus de bandeau dégradé). */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:pt-14">
          <p className="flex flex-wrap items-center gap-2.5 font-mono text-board-label uppercase text-ink-500">
            <span className="rounded-md bg-vol-100 px-2 py-1 text-vol-700">{a.categorie}</span>
            <span>· {dateFr(a.datePublished)} · {a.lecture} de lecture</span>
          </p>
          <h1 className="mt-4 text-display-lg text-ink-900">{a.h1}</h1>
          <p className="mt-5 max-w-prose text-prose-lg text-ink-600">{a.chapo}</p>
        </div>
      </section>

      {/* Fil d'Ariane à trois niveaux (le maillage vers /blog est conservé). */}
      <nav className="mx-auto max-w-3xl px-4 pt-6 text-sm text-ink-500" aria-label="Fil d'Ariane">
        <Link href="/" className="transition-colors duration-fast hover:text-vol-700">
          Accueil
        </Link>
        <span className="px-2" aria-hidden>
          ›
        </span>
        <Link href="/blog" className="transition-colors duration-fast hover:text-vol-700">
          Blog
        </Link>
        <span className="px-2" aria-hidden>
          ›
        </span>
        <span className="text-ink-700">{a.categorie}</span>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-10">
          <ProseToc blocks={a.corps} titre="Sommaire" />
        </div>

        <ProseBlocks blocks={avant} />
      </article>

      {/* Encadré CTA au milieu */}
      <EstimationSection title="Vérifiez gratuitement votre éligibilité" />

      {apres.length > 0 && (
        <article className="mx-auto max-w-3xl px-4 py-10">
          <ProseBlocks blocks={apres} />
        </article>
      )}

      {a.faq.length > 0 && <FaqSection items={a.faq} />}

      {/* Maillage interne */}
      {a.liens.length > 0 && (
        <LinkPills
          titre="À lire aussi"
          items={a.liens.map((l) => ({ href: l.href, label: l.label, accent: true }))}
        />
      )}

      <SeoCta
        titre="Un vol perturbé récemment ?"
        texte="Vérifiez gratuitement votre indemnité en 2 minutes. Sans frais si nous n'obtenons rien."
      />
    </>
  );
}

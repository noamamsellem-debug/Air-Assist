import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo";
import { EstimationSection, ProseBlocks, FaqSection, type Bloc } from "@/components/seo/SeoPage";
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

      {/* En-tête */}
      <section className="home-hero relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-12 text-white sm:pt-14">
          <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/80">
            <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/25">{a.categorie}</span>
            <span>· {dateFr(a.datePublished)} · {a.lecture} de lecture</span>
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{a.h1}</h1>
          <p className="mt-4 text-base text-white/85 sm:text-lg">{a.chapo}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <nav className="text-sm text-slate-500" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-brand-600">Accueil</Link>
          <span className="px-1.5">›</span>
          <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          <span className="px-1.5">›</span>
          <span className="text-slate-700">{a.categorie}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-8">
        <ProseBlocks blocks={avant} />
      </article>

      {/* Encadré CTA au milieu */}
      <EstimationSection title="Vérifiez gratuitement votre éligibilité" />

      {apres.length > 0 && (
        <article className="mx-auto max-w-3xl px-4 py-8">
          <ProseBlocks blocks={apres} />
        </article>
      )}

      {a.faq.length > 0 && <FaqSection items={a.faq} />}

      {/* Maillage interne */}
      {a.liens.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl px-4">
          <h2 className="text-lg font-semibold text-slate-900">À lire aussi</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {a.liens.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
                >
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA final */}
      <section className="mx-auto mt-12 max-w-3xl px-4 pb-16">
        <div className="home-hero rounded-3xl px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight">Un vol perturbé récemment ?</h2>
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

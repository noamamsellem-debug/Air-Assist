import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ARTICLES, getArticle, contenuArticle } from "@/data/articles";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => ARTICLES.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const c = contenuArticle(a, locale);
  return buildMetadata({ locale, path: `/blog/${slug}`, title: c.titre, description: c.extrait });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = getArticle(slug);
  if (!a) notFound();
  const c = contenuArticle(a, locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const n = await getTranslations({ locale, namespace: "nav" });

  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.titre,
      description: c.extrait,
      datePublished: a.date,
      dateModified: a.date,
      inLanguage: locale,
      author: { "@type": "Organization", name: "Air Assist" },
      publisher: { "@type": "Organization", name: "Air Assist" },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Air Assist", item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: t("title"), item: `${SITE_URL}/${locale}/blog` },
        { "@type": "ListItem", position: 3, name: c.titre, item: url },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-500">
        <Link href="/blog" className="hover:text-vol-700">
          {t("title")}
        </Link>
      </nav>
      <h1 className="mt-2 text-3xl font-bold">{c.titre}</h1>
      <p className="mt-2 text-xs text-ink-400">{new Date(a.date).toLocaleDateString(locale)}</p>
      <div className="article-corps mt-6" dangerouslySetInnerHTML={{ __html: c.corps }} />
      <p className="mt-8">
        <Link href="/reclamation" className="btn-primary">
          {n("startClaim")}
        </Link>
      </p>
      <p className="mt-4">
        <Link href="/blog" className="text-sm text-vol-700 hover:underline">
          ← {t("back")}
        </Link>
      </p>
    </article>
  );
}

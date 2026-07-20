import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ARTICLES, contenuArticle } from "@/data/articles";
import { ARTICLES_BLOG } from "@/data/articles-blog";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({ locale, path: "/blog", title: t("title"), description: t("intro") });
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-slate-600">{t("intro")}</p>

      {/* Articles piliers (fr) */}
      {locale === "fr" && (
        <div className="mt-8 space-y-6">
          {[...ARTICLES_BLOG]
            .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
            .map((a) => (
              <article key={a.slug} className="card">
                <p className="text-xs text-slate-400">
                  {new Date(a.datePublished).toLocaleDateString("fr-FR")} · {a.categorie} · {a.lecture}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  <Link href={`/blog/${a.slug}`} className="hover:text-brand-600">
                    {a.h1}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-slate-600">{a.chapo}</p>
                <Link
                  href={`/blog/${a.slug}`}
                  className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
                >
                  Lire l&apos;article →
                </Link>
              </article>
            ))}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {ARTICLES.map((a) => {
          const c = contenuArticle(a, locale);
          return (
            <article key={a.slug} className="card">
              <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString(locale)}</p>
              <h2 className="mt-1 text-xl font-semibold">
                <Link href={`/blog/${a.slug}`} className="hover:text-brand-600">
                  {c.titre}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-slate-600">{c.extrait}</p>
              <Link
                href={`/blog/${a.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
              >
                {t("readMore")} →
              </Link>
            </article>
          );
        })}
      </div>

      {/* Guides pratiques (français, pages SEO dédiées) */}
      {locale === "fr" && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Guides pratiques</h2>
          <ul className="mt-4 space-y-2">
            {[
              // Les autres guides de 1re génération ont été fusionnés dans les
              // articles piliers ci-dessus (301, cf. REDIRECTS_BLOG).
              { href: "/blog/reglement-ec-261-2004", label: "Le règlement EC 261/2004 expliqué simplement" },
            ].map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="font-medium text-brand-600 hover:underline">
                  {g.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

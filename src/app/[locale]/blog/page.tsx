import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ARTICLES, contenuArticle } from "@/data/articles";
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
    </div>
  );
}

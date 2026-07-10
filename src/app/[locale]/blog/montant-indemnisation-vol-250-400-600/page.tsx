import { setRequestLocale } from "next-intl/server";
import { metaArticle, ArticleContent } from "@/components/seo/ArticleBlog";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export function generateMetadata() {
  return metaArticle("montant-indemnisation-vol-250-400-600");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ArticleContent slug="montant-indemnisation-vol-250-400-600" />;
}

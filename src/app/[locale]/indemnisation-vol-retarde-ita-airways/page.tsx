import { setRequestLocale } from "next-intl/server";
import { metaCompagnie, CompagnieContent } from "@/components/seo/CompagniePage";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export function generateMetadata() {
  return metaCompagnie("ita-airways");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CompagnieContent slug="ita-airways" />;
}

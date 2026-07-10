import { setRequestLocale } from "next-intl/server";
import { metaAeroport, AeroportContent } from "@/components/seo/AeroportPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export function generateMetadata() {
  return metaAeroport("vol-retarde-beauvais-indemnisation");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AeroportContent slug="vol-retarde-beauvais-indemnisation" />;
}

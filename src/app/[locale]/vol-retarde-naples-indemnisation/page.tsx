import { setRequestLocale } from "next-intl/server";
import { metaDestination, DestinationContent } from "@/components/seo/DestinationPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export function generateMetadata() {
  return metaDestination("vol-retarde-naples-indemnisation");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DestinationContent slug="vol-retarde-naples-indemnisation" />;
}

import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Funnel } from "@/components/Funnel";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "funnel" });
  const c = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({
    locale,
    path: "/reclamation",
    title: t("title"),
    description: c("commissionNote"),
  });
}

export default async function ReclamationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <Funnel />
    </Suspense>
  );
}

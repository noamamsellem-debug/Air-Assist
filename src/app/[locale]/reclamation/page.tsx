import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { Funnel } from "@/components/Funnel";

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

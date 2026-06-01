import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { SuiviForm } from "./SuiviForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suivi" });
  return buildMetadata({ locale, path: "/suivi", title: t("title"), description: t("intro") });
}

export default async function SuiviPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "suivi" });
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-slate-600">{t("intro")}</p>
      <div className="mt-6">
        <SuiviForm />
      </div>
    </div>
  );
}

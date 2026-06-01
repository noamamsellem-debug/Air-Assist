import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "scale" });
  return buildMetadata({
    locale,
    path: "/bareme",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function BaremePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contenu />;
}

function Contenu() {
  const t = useTranslations("scale");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-slate-600">{t("intro")}</p>
      <ul className="mt-6 space-y-3">
        <li className="card">{t("row1")}</li>
        <li className="card">{t("row2")}</li>
        <li className="card">{t("row3")}</li>
      </ul>
      <p className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        {t("reductionNote")}
      </p>
    </article>
  );
}

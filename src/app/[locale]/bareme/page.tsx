import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

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

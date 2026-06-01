import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rights" });
  return buildMetadata({
    locale,
    path: "/droits-passagers",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function DroitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contenu />;
}

function Contenu() {
  const t = useTranslations("rights");
  const n = useTranslations("nav");
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-slate-600">{t("intro")}</p>
      <section className="mt-6 space-y-4">
        <div className="card">
          <h2 className="font-semibold">{t("delayTitle")}</h2>
          <p className="mt-1 text-slate-600">{t("delayText")}</p>
        </div>
        <div className="card">
          <h2 className="font-semibold">{t("cancelTitle")}</h2>
          <p className="mt-1 text-slate-600">{t("cancelText")}</p>
        </div>
        <div className="card">
          <h2 className="font-semibold">{t("overbookingTitle")}</h2>
          <p className="mt-1 text-slate-600">{t("overbookingText")}</p>
        </div>
      </section>
      <p className="mt-6">
        <Link href="/reclamation" className="btn-primary">
          {n("startClaim")}
        </Link>
      </p>
    </article>
  );
}

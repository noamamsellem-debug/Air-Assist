import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calculator } from "@/components/Calculator";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    locale,
    // L'accueil partage le segment qui définit le template de titre : on ajoute
    // donc la marque manuellement pour la balise <title>.
    path: "/",
    title: `${t("heroTitle")} · Air Assist`,
    description: t("heroSubtitle"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const c = useTranslations("common");
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 via-brand-50 to-slate-50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
              Règlement européen EC 261/2004
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t("heroSubtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                💸 {t("trustNoWinNoFee")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                ✅ {t("trustCommission")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                🇪🇺 {t("trustEu")}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{c("commissionNote")}</p>
          </div>
          <Calculator />
        </div>
      </section>

      <section id="comment-ca-marche" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">{t("howTitle")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="font-semibold">{t("step1Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("step1Text")}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold">{t("step2Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("step2Text")}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold">{t("step3Title")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("step3Text")}</p>
          </div>
        </div>
      </section>
    </>
  );
}

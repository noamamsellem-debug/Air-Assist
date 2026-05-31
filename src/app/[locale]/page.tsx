import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/Calculator";

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
      <section className="bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t("heroSubtitle")}</p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li>✅ {t("trustNoWinNoFee")}</li>
              <li>✅ {t("trustCommission")}</li>
              <li>✅ {t("trustEu")}</li>
            </ul>
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

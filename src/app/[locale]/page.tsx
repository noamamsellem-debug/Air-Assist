import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calculator } from "@/components/Calculator";
import { Link } from "@/i18n/navigation";
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
  const r = useTranslations("rights");
  const s = useTranslations("scale");
  const nav = useTranslations("nav");
  const f = useTranslations("faq");

  const faqItems = [1, 2, 3, 4, 5].map((i) => ({
    q: f(`q${i}`),
    a: f(`a${i}`),
  }));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Air Assist",
    serviceType: "Flight compensation claim (EC 261/2004)",
    areaServed: "EU",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: c("commissionNote"),
    },
  };
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

      {/* Vos droits (EC 261/2004) — contenu SEO traduit dans les 19 langues */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">{r("title")}</h2>
          <p className="mt-2 max-w-3xl text-slate-600">{r("intro")}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="card">
              <p className="text-2xl" aria-hidden>⏱️</p>
              <h3 className="mt-2 font-semibold">{r("delayTitle")}</h3>
              <p className="mt-2 text-sm text-slate-600">{r("delayText")}</p>
            </div>
            <div className="card">
              <p className="text-2xl" aria-hidden>🚫</p>
              <h3 className="mt-2 font-semibold">{r("cancelTitle")}</h3>
              <p className="mt-2 text-sm text-slate-600">{r("cancelText")}</p>
            </div>
            <div className="card">
              <p className="text-2xl" aria-hidden>🎟️</p>
              <h3 className="mt-2 font-semibold">{r("overbookingTitle")}</h3>
              <p className="mt-2 text-sm text-slate-600">{r("overbookingText")}</p>
            </div>
          </div>
          <p className="mt-4">
            <Link href="/droits-passagers" className="text-sm font-semibold text-brand-600 hover:underline">
              {nav("rights")} →
            </Link>
          </p>
        </div>
      </section>

      {/* Barème des indemnités */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">{s("title")}</h2>
          <p className="mt-2 text-slate-600">{s("intro")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { amount: "250 €", text: s("row1") },
              { amount: "400 €", text: s("row2") },
              { amount: "600 €", text: s("row3") },
            ].map((row) => (
              <div key={row.amount} className="card text-center">
                <p className="text-3xl font-extrabold text-brand-600">{row.amount}</p>
                <p className="mt-2 text-sm text-slate-600">{row.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">{s("reductionNote")}</p>
          <p className="mt-4">
            <Link href="/bareme" className="text-sm font-semibold text-brand-600 hover:underline">
              {nav("scale")} →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ — contenu + données structurées FAQPage pour Google */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-bold">{f("faqTitle")}</h2>
          <div className="mt-6 divide-y divide-slate-200">
            {faqItems.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 marker:content-none">
                  {item.q}
                  <span className="text-brand-500 transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, serviceJsonLd]) }}
      />

      {/* Appel à l'action final */}
      <section className="bg-brand-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("heroTitle")}</h2>
          <p className="max-w-2xl text-brand-50">{c("commissionNote")}</p>
          <Link
            href="/reclamation"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            {nav("startClaim")}
          </Link>
        </div>
      </section>
    </>
  );
}

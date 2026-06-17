import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calculator } from "@/components/Calculator";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/home/SectionHeading";
import { TrustBar } from "@/components/home/TrustBar";
import { HowTimeline } from "@/components/home/HowTimeline";
import { DisruptionCards } from "@/components/home/DisruptionCards";
import { CompensationSlider } from "@/components/home/CompensationSlider";

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
  const hp = useTranslations("hp");

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
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                {hp("heroEyebrow")}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/80">{t("heroSubtitle")}</p>
              <div className="mt-7">
                <TrustBar />
              </div>
            </div>
            <div className="lg:pl-4">
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPES DE PERTURBATIONS ───────────────────────────────────── */}
      <section className="grid-soft bg-white">
        <div className="section">
          <SectionHeading
            eyebrow={hp("eyebrowProblems")}
            title={hp("disruptionsTitle")}
            intro={hp("disruptionsIntro")}
          />
          <DisruptionCards />
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE + SLIDER D'INDEMNITÉ ───────────────────── */}
      <section id="comment-ca-marche" className="bg-slate-50">
        <div className="section grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={hp("eyebrowHow")} title={t("howTitle")} />
            <div className="mt-8">
              <HowTimeline />
            </div>
          </div>
          <div className="lg:pt-2">
            <SectionHeading eyebrow={hp("eyebrowComp")} title={hp("compTitle")} intro={hp("compIntro")} />
            <div className="mt-8">
              <CompensationSlider />
            </div>
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
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t("heroTitle")}</h2>
          <p className="max-w-2xl text-lg text-white/80">{c("commissionNote")}</p>
          <Link href="/reclamation" className="btn-light mt-2 text-lg">
            {nav("startClaim")}
          </Link>
        </div>
      </section>
    </>
  );
}

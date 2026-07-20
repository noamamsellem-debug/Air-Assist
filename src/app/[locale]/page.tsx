import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calculator } from "@/components/Calculator";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/home/SectionHeading";
import { HowTimeline } from "@/components/home/HowTimeline";
import { DisruptionCards } from "@/components/home/DisruptionCards";
import { StatusBoard } from "@/components/home/StatusBoard";
import { ProofSection } from "@/components/home/ProofSection";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { Reveal } from "@/components/Reveal";

/**
 * Régénération horaire : la page reste prérendue (donc rapide), tout en
 * laissant les compteurs de réassurance se mettre à jour quand des dossiers
 * réels arrivent, sans redéploiement.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    locale,
    path: "/",
    // Titre SEO ciblé (porte déjà la marque) → absoluteTitle pour éviter le
    // doublon « · Air Assist » ajouté par le template du layout.
    title: t("seoTitle"),
    description: t("seoDescription"),
    keywords: t("seoKeywords"),
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HomeContent />
      {/* Composant serveur : interroge la base pour les compteurs réels. */}
      <ProofSection locale={locale} />
      <HomeTail />
    </>
  );
}

function HomeContent() {
  const t = useTranslations("home");
  const c = useTranslations("common");
  const hp = useTranslations("hp");
  const tr = useTranslations("tracking");

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────
          Plus d'aplat dégradé : fond clair, le titre porte le message et la
          couleur est réservée à l'action. L'estimateur est le seul objet
          sombre — c'est lui qu'on doit regarder. */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-24 lg:pt-16">
          <div>
            <p className="eyebrow">{hp("heroEyebrow")}</p>
            <h1 className="mt-4 text-display-xl text-ink-900">{t("heroTitle")}</h1>
            <p className="mt-6 max-w-prose text-prose-lg text-ink-600">{t("heroSubtitle")}</p>

            {/* Une seule action principale. Les preuves suivent, en retrait. */}
            <ul className="mt-8 space-y-2.5">
              {["trustNoWinNoFee", "trustCommission", "trustEu"].map((cle) => (
                <li key={cle} className="trust-pill">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 flex-none fill-vol-500" aria-hidden>
                    <path d="M6.4 11.8L3 8.4l1.1-1.1 2.3 2.3 5.5-5.5L13 5.2z" />
                  </svg>
                  {t(cle)}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-2">
            <Calculator />
          </div>
        </div>
      </section>

      {/* ── TYPES DE PERTURBATIONS ───────────────────────────────────── */}
      <section className="bg-ink-50">
        <div className="section">
          <Reveal>
            <SectionHeading
              eyebrow={hp("eyebrowProblems")}
              title={hp("disruptionsTitle")}
              intro={hp("disruptionsIntro")}
            />
          </Reveal>
          <Reveal delay={120}>
            <DisruptionCards />
          </Reveal>
        </div>
      </section>

      {/* ── LE SERVICE, RENDU TANGIBLE ───────────────────────────────────
          Le suivi de dossier en tableau d'affichage : le même objet que
          l'estimateur, et le même vocabulaire que la machine à états métier. */}
      <section className="bg-white">
        <div className="section grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">{tr("eyebrow")}</p>
            <h2 className="mt-3 text-display-md">{tr("title")}</h2>
            <p className="mt-4 max-w-prose text-prose text-ink-600">{tr("intro")}</p>
            <div className="mt-8">
              <HowTimeline />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <StatusBoard />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Bas de page : barème, FAQ, appel à l'action. */
function HomeTail() {
  const t = useTranslations("home");
  const c = useTranslations("common");
  const r = useTranslations("rights");
  const s = useTranslations("scale");
  const nav = useTranslations("nav");
  const f = useTranslations("faq");

  const faqItems = [1, 2, 3, 4, 5].map((i) => ({ q: f(`q${i}`), a: f(`a${i}`) }));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      {/* ── VOS DROITS ───────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="section">
          <h2 className="text-display-md">{r("title")}</h2>
          <p className="mt-3 max-w-prose text-prose text-ink-600">{r("intro")}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { k: "delay", icone: "⏱" },
              { k: "cancel", icone: "⊘" },
              { k: "overbooking", icone: "◫" },
            ].map((bloc) => (
              <div key={bloc.k} className="card card-hover">
                <p className="font-mono text-2xl text-vol-600" aria-hidden>
                  {bloc.icone}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold">{r(`${bloc.k}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{r(`${bloc.k}Text`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/droits-passagers"
              className="text-sm font-semibold text-vol-700 underline underline-offset-4"
            >
              {nav("rights")} →
            </Link>
          </p>
        </div>
      </section>

      {/* ── BARÈME ───────────────────────────────────────────────────── */}
      <section className="bg-ink-50">
        <div className="section">
          <h2 className="text-display-md">{s("title")}</h2>
          <p className="mt-3 max-w-prose text-prose text-ink-600">{s("intro")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { amount: "250", text: s("row1") },
              { amount: "400", text: s("row2") },
              { amount: "600", text: s("row3") },
            ].map((row, i) => (
              <Reveal key={row.amount} delay={i * 100} className="card">
                <p className="font-display text-display-md text-vol-600">
                  {row.amount}
                  <span className="ml-1 text-2xl">€</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{row.text}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-500">{s("reductionNote")}</p>
          <p className="mt-4">
            <Link
              href="/bareme"
              className="text-sm font-semibold text-vol-700 underline underline-offset-4"
            >
              {nav("scale")} →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-section">
          <h2 className="text-display-md">{f("faqTitle")}</h2>
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>

      {/* ── APPEL À L'ACTION FINAL ───────────────────────────────────── */}
      <section className="bg-white pb-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="board on-board px-6 py-14 text-center sm:px-10">
            <h2 className="mx-auto max-w-2xl font-display text-display-md text-white">
              {t("heroTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-prose text-ink-300">{c("commissionNote")}</p>
            <Link href="/reclamation" className="btn-primary mt-8">
              {nav("startClaim")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

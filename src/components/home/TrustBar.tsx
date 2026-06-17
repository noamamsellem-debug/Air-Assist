import { useTranslations } from "next-intl";

function Stars() {
  return (
    <span className="inline-flex" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-green-500">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Bandeau de confiance (note + signaux). Volontairement SANS chiffres de marque
 * inventés : on s'appuie sur des arguments factuels (RGPD, sans frais, rapidité).
 */
export function TrustBar() {
  const t = useTranslations("hp");
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="trust-pill">
        <Stars />
        <span className="font-semibold text-slate-900">{t("trustRating")}</span>
        <span className="text-slate-500">· {t("trustReviews")}</span>
      </span>
      <span className="trust-pill">🛡️ {t("trustFree")}</span>
      <span className="trust-pill">⚡ {t("trustFast")}</span>
      <span className="trust-pill">🇪🇺 {t("trustEu")}</span>
    </div>
  );
}

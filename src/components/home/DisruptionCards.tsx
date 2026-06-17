import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * 4 cartes « types de perturbations » avec mini-illustration SVG générique
 * (anonymisée, faite maison) + fait réglementaire EC 261 en pied de carte.
 */
function MiniCarte({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full rounded-xl bg-slate-50" aria-hidden>
      <rect x="16" y="18" width="168" height="74" rx="10" fill="#fff" stroke="#e2e8f0" />
      <rect x="28" y="30" width="60" height="9" rx="4" fill="#e2e8f0" />
      <rect x="28" y="48" width="90" height="7" rx="3" fill="#eef2f7" />
      <rect x="28" y="62" width="70" height="7" rx="3" fill="#eef2f7" />
      <circle cx="158" cy="40" r="14" fill={accent} opacity="0.18" />
      <circle cx="158" cy="40" r="6" fill={accent} />
    </svg>
  );
}

export function DisruptionCards() {
  const t = useTranslations("hp");
  const cards = [
    { icon: "🛬", color: "#1f6feb", title: t("d1Title"), text: t("d1Text"), stat: t("d1Stat") },
    { icon: "🚫", color: "#0284c7", title: t("d2Title"), text: t("d2Text"), stat: t("d2Stat") },
    { icon: "🔁", color: "#0ea5e9", title: t("d3Title"), text: t("d3Text"), stat: t("d3Stat") },
    { icon: "ℹ️", color: "#6366f1", title: t("d4Title"), text: t("d4Text"), stat: t("d4Stat") },
  ];
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.title}
          href="/reclamation"
          className="card card-hover flex flex-col"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${c.color}1a`, color: c.color }}
          >
            {c.icon}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">{c.title}</h3>
          <p className="mt-2 flex-1 text-sm text-slate-600">{c.text}</p>
          <div className="mt-4">
            <MiniCarte accent={c.color} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">{c.stat}</p>
        </Link>
      ))}
    </div>
  );
}

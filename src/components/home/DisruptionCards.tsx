import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DisruptionArt } from "./DisruptionArt";

/**
 * 4 cartes « types de perturbations » avec vraie illustration vectorielle par
 * cas (avion, horloge, sièges…) + fait réglementaire EC 261 en pied de carte.
 */
export function DisruptionCards() {
  const t = useTranslations("hp");
  const cards = [
    { icon: "🛬", color: "#0060ff", kind: "delay", title: t("d1Title"), text: t("d1Text"), stat: t("d1Stat") },
    { icon: "🚫", color: "#0050d6", kind: "cancel", title: t("d2Title"), text: t("d2Text"), stat: t("d2Stat") },
    { icon: "🔁", color: "#0ea5e9", kind: "connection", title: t("d3Title"), text: t("d3Text"), stat: t("d3Stat") },
    { icon: "🎟️", color: "#6366f1", kind: "overbooking", title: t("d4Title"), text: t("d4Text"), stat: t("d4Stat") },
  ] as const;
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.title}
          href="/reclamation"
          className="card card-hover group flex flex-col overflow-hidden !p-0"
        >
          <div className="overflow-hidden">
            <div className="transition duration-300 group-hover:scale-[1.04]">
              <DisruptionArt kind={c.kind} />
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: `${c.color}1a`, color: c.color }}
            >
              {c.icon}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm text-slate-600">{c.text}</p>
            <p className="mt-4 text-sm font-semibold text-slate-700">{c.stat}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

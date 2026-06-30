import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DisruptionArt } from "./DisruptionArt";

/**
 * Cartes « types de perturbations » : cartes pleines colorées (une couleur par
 * type) avec pictogramme vectoriel blanc épuré en tête. Mobile-first, texte
 * blanc, focus clavier visible.
 */
export function DisruptionCards() {
  const t = useTranslations("hp");
  const cards = [
    { kind: "delay", gradient: "linear-gradient(145deg,#0060ff,#4f7dff)", title: t("d1Title"), text: t("d1Text"), stat: t("d1Stat") },
    { kind: "cancel", gradient: "linear-gradient(145deg,#f43f5e,#fb7185)", title: t("d2Title"), text: t("d2Text"), stat: t("d2Stat") },
    { kind: "connection", gradient: "linear-gradient(145deg,#0ea5e9,#22d3ee)", title: t("d3Title"), text: t("d3Text"), stat: t("d3Stat") },
    { kind: "overbooking", gradient: "linear-gradient(145deg,#6366f1,#818cf8)", title: t("d4Title"), text: t("d4Text"), stat: t("d4Stat") },
  ] as const;
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.title}
          href="/reclamation"
          style={{ backgroundImage: c.gradient }}
          className="group block rounded-[20px] p-[18px] text-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <div className="transition duration-300 group-hover:scale-[1.06]">
            <DisruptionArt kind={c.kind} />
          </div>
          <h3 className="mt-3 text-[17px] font-extrabold leading-tight">{c.title}</h3>
          <p
            className="mt-1.5 text-[12.5px] leading-snug text-white/90"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,.15)" }}
          >
            {c.text}
          </p>
          <p className="mt-3 text-[12.5px] font-semibold text-white">{c.stat}</p>
        </Link>
      ))}
    </div>
  );
}

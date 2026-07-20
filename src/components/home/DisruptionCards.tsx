import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Types de perturbations, rendus comme des lignes d'un tableau d'affichage.
 *
 * Chaque perturbation EST un statut : elle porte donc la pastille ambre, la
 * couleur du problème. Le vert n'apparaît que sur l'appel à l'action, jamais
 * sur la perturbation elle-même.
 */
export function DisruptionCards() {
  const t = useTranslations("hp");
  const cards = [
    { code: "DELAYED", title: t("d1Title"), text: t("d1Text"), stat: t("d1Stat") },
    { code: "CANCELLED", title: t("d2Title"), text: t("d2Text"), stat: t("d2Stat") },
    { code: "MISSED", title: t("d3Title"), text: t("d3Text"), stat: t("d3Stat") },
    { code: "DENIED", title: t("d4Title"), text: t("d4Text"), stat: t("d4Stat") },
  ] as const;

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link key={c.title} href="/reclamation" className="card card-hover group flex flex-col">
          <span className="board-statut bg-ambre-100 text-ambre-700">{c.code}</span>
          <h3 className="mt-4 font-display text-base font-bold leading-tight text-ink-900">
            {c.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{c.text}</p>
          <p className="mt-4 font-mono text-xs font-semibold text-vol-700 transition-transform duration-fast group-hover:translate-x-0.5">
            {c.stat} →
          </p>
        </Link>
      ))}
    </div>
  );
}

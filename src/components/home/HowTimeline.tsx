import { useTranslations } from "next-intl";

/** « Comment ça marche » : timeline verticale à 3 noeuds numérotés. */
export function HowTimeline() {
  const t = useTranslations("home");
  const steps = [
    { icon: "⏱️", title: t("step1Title"), text: t("step1Text") },
    { icon: "🛡️", title: t("step2Title"), text: t("step2Text") },
    { icon: "💸", title: t("step3Title"), text: t("step3Text") },
  ];
  return (
    <ol className="relative space-y-8">
      {/* Ligne verticale reliant les noeuds */}
      <span className="absolute left-6 top-3 bottom-3 w-px bg-gradient-to-b from-brand-200 via-brand-300 to-accent-400" aria-hidden />
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-5">
          <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-lg text-white shadow-card">
            {s.icon}
          </span>
          <div className="pt-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {t("howTitle")} · {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-slate-600">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

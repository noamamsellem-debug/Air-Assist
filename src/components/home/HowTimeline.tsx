import { useTranslations } from "next-intl";

/**
 * « Comment ça marche » : trois étapes numérotées reliées par un filet.
 * Registre horaire — numéros en mono, pas de pictogramme décoratif.
 */
export function HowTimeline() {
  const t = useTranslations("home");
  const steps = [
    { title: t("step1Title"), text: t("step1Text") },
    { title: t("step2Title"), text: t("step2Text") },
    { title: t("step3Title"), text: t("step3Text") },
  ];
  return (
    <ol className="relative space-y-7">
      {/* Filet vertical reliant les jalons. */}
      <span className="absolute bottom-4 left-[15px] top-4 w-px bg-ink-200" aria-hidden />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4">
          <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-vol-500 bg-white font-mono text-xs font-bold text-vol-600">
            {i + 1}
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-600">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

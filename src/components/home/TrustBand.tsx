import { useTranslations } from "next-intl";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/Reveal";

/**
 * Bande de réassurance : 4 piliers factuels (sans gain sans frais, expertise
 * EC 261, RGPD, 100 % en ligne). Pas de faux avis nominatifs — arguments
 * vérifiables, cohérents avec la charte.
 */
function Icone({ name }: { name: "shield" | "scale" | "lock" | "bolt" }) {
  const paths: Record<typeof name, string> = {
    shield: "M12 3l7 3v5c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V6l7-3z",
    scale: "M12 3v18M5 7h14M7 7l-3 6a3 3 0 006 0L7 7zm10 0l-3 6a3 3 0 006 0l-3-6z",
    lock: "M6 10V8a6 6 0 1112 0v2M5 10h14v10H5z",
    bolt: "M13 3L4 14h7l-1 7 9-11h-7l1-7z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

export function TrustBand() {
  const t = useTranslations("trustband");
  const piliers = [
    { icon: "bolt", title: t("p1Title"), text: t("p1Text") },
    { icon: "scale", title: t("p2Title"), text: t("p2Text") },
    { icon: "lock", title: t("p3Title"), text: t("p3Text") },
    { icon: "shield", title: t("p4Title"), text: t("p4Text") },
  ] as const;
  return (
    <div className="section">
      <Reveal>
        <SectionHeading eyebrow="Air Assist" title={t("title")} intro={t("intro")} />
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {piliers.map((p, i) => (
          <Reveal key={p.title} delay={i * 90} className="card card-hover flex flex-col">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icone name={p.icon} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";

/**
 * Barre de réassurance horizontale « verre » posée sur le hero : 4 colonnes
 * égales (valeur forte + label), séparées par un fin trait vertical. Passe en
 * 2×2 sous 360 px. Pas de chiffres de marque inventés (avis « milliers »,
 * arguments factuels : sans risque, vérification gratuite, RGPD/UE).
 */
export function TrustBar() {
  const t = useTranslations("hp");
  const cols = [
    { value: "★★★★★", label: t("rbReviews") },
    { value: "0 €", label: t("rbRisk") },
    { value: "2 min", label: t("rbFree") },
    { value: "🇪🇺", label: t("rbEu") },
  ];
  return (
    <div
      className="grid max-w-md grid-cols-2 overflow-hidden rounded-[14px] border border-white/[0.22] bg-white/[0.14] backdrop-blur-sm min-[360px]:grid-cols-4"
    >
      {cols.map((c, i) => (
        <div
          key={i}
          className={[
            "flex flex-col items-center justify-center gap-0.5 border-white/25 px-2 py-3 text-center",
            // Trait vertical entre colonnes (jamais sur la dernière).
            "border-r last:border-r-0",
            // En mode 2×2 (<360px) : pas de trait à droite de la 2e colonne,
            // et trait horizontal sous la 1re rangée.
            "max-[359px]:[&:nth-child(2)]:border-r-0 max-[359px]:[&:nth-child(-n+2)]:border-b",
          ].join(" ")}
        >
          <span className="text-base font-extrabold leading-none text-white">{c.value}</span>
          <span className="text-[11px] font-medium leading-tight text-white/80">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

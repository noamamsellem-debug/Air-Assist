"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

/**
 * Slider d'indemnité interactif : on déplace le curseur (distance) et le montant
 * EC 261 se met à jour (250 € < 1 500 km, 400 € jusqu'à 3 500 km, 600 € au-delà).
 */
export function CompensationSlider() {
  const t = useTranslations("hp");
  const locale = useLocale();
  const [km, setKm] = useState(3800);

  const montant = km < 1500 ? 250 : km <= 3500 ? 400 : 600;
  const montantFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(montant);

  return (
    <div className="hero-gradient overflow-hidden rounded-3xl p-8 text-white shadow-lift sm:p-10">
      <p className="text-center text-6xl font-extrabold tracking-tight sm:text-7xl">{montantFmt}</p>
      <p className="mt-1 text-center text-sm text-white/70">
        {km.toLocaleString(locale)} km{km > 3500 ? ` · ${t("compMax")}` : ""}
      </p>

      <div className="mt-8">
        <input
          type="range"
          min={300}
          max={6000}
          step={50}
          value={km}
          onChange={(e) => setKm(Number(e.target.value))}
          aria-label={t("compTitle")}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white
            [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        />
        <div className="mt-3 flex justify-between text-xs font-medium text-white/70">
          <span>1 500 km</span>
          <span>3 500 km</span>
          <span>{t("compMax")}</span>
        </div>
      </div>
    </div>
  );
}

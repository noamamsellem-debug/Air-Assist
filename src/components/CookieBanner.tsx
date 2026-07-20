"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CLE = "aa-cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CLE)) setVisible(true);
    } catch {
      /* localStorage indisponible */
    }
  }, []);

  function choisir(valeur: "accepte" | "refuse") {
    try {
      localStorage.setItem(CLE, valeur);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    // pb : rembourrage + safe-area basse, sinon les boutons tombent sous la
    // barre de gestes iOS et deviennent difficiles à atteindre.
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {t("text")}{" "}
          <Link href="/cookies" className="font-medium text-brand-600 hover:underline">
            {t("more")}
          </Link>
        </p>
        {/* Pleine largeur sous 640 px : deux cibles confortables au pouce
            plutôt que deux petits boutons collés à droite. */}
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            onClick={() => choisir("refuse")}
            className="min-h-[44px] flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none"
          >
            {t("refuse")}
          </button>
          <button
            onClick={() => choisir("accepte")}
            className="min-h-[44px] flex-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 sm:flex-none"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

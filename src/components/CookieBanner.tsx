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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-600">
          {t("text")}{" "}
          <Link href="/cookies" className="font-medium text-vol-700 hover:underline">
            {t("more")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choisir("refuse")}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            {t("refuse")}
          </button>
          <button
            onClick={() => choisir("accepte")}
            className="rounded-lg bg-vol-600 px-4 py-2 text-sm font-semibold text-white hover:bg-vol-700"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

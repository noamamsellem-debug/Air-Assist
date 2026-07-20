"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Drapeau + nom par langue (mêmes locales que le routing i18n).
const LANGS: Record<string, { flag: string; name: string }> = {
  fr: { flag: "🇫🇷", name: "Français" },
  en: { flag: "🇬🇧", name: "English" },
  es: { flag: "🇪🇸", name: "Español" },
  de: { flag: "🇩🇪", name: "Deutsch" },
  it: { flag: "🇮🇹", name: "Italiano" },
  pt: { flag: "🇵🇹", name: "Português" },
  nl: { flag: "🇳🇱", name: "Nederlands" },
  pl: { flag: "🇵🇱", name: "Polski" },
  ro: { flag: "🇷🇴", name: "Română" },
  sv: { flag: "🇸🇪", name: "Svenska" },
  da: { flag: "🇩🇰", name: "Dansk" },
  fi: { flag: "🇫🇮", name: "Suomi" },
  no: { flag: "🇳🇴", name: "Norsk" },
  el: { flag: "🇬🇷", name: "Ελληνικά" },
  cs: { flag: "🇨🇿", name: "Čeština" },
  sk: { flag: "🇸🇰", name: "Slovenčina" },
  hr: { flag: "🇭🇷", name: "Hrvatski" },
  bg: { flag: "🇧🇬", name: "Български" },
  hu: { flag: "🇭🇺", name: "Magyar" },
};

/**
 * Sélecteur de langue compact pour la barre du haut : drapeau actif + flèche,
 * menu déroulant (drapeau + nom). Réutilise le routing i18n et la même bascule
 * que le sélecteur historique (router.replace en conservant le chemin).
 */
export function HeaderLangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Fermeture au clic en dehors + touche Échap.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const courant = LANGS[locale];

  function choisir(l: string) {
    setOpen(false);
    startTransition(() => router.replace(pathname, { locale: l }));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Langue"
        className="inline-flex h-10 items-center gap-1 rounded-xl border border-ink-200 bg-white px-2.5 text-ink-700 transition hover:bg-ink-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vol-500"
      >
        <span className="text-base leading-none">{courant?.flag ?? "🌍"}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 text-ink-400 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Langue"
          className="absolute right-0 z-50 mt-2 max-h-80 w-44 overflow-auto rounded-xl border border-ink-200 bg-white py-1 shadow-lift"
        >
          {routing.locales.map((l) => {
            const L = LANGS[l];
            const actif = l === locale;
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={actif}
                  onClick={() => choisir(l)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:bg-ink-100 ${
                    actif ? "bg-vol-100 font-semibold text-vol-700" : "text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  <span className="text-base leading-none">{L?.flag ?? "🏳️"}</span>
                  <span>{L?.name ?? l.toUpperCase()}</span>
                  {actif && <span className="ml-auto text-vol-700" aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

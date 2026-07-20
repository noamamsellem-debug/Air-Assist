"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

const NOMS: Record<string, string> = {
  fr: "🇫🇷 Français",
  en: "🇬🇧 English",
  es: "🇪🇸 Español",
  de: "🇩🇪 Deutsch",
  it: "🇮🇹 Italiano",
  pt: "🇵🇹 Português",
  nl: "🇳🇱 Nederlands",
  pl: "🇵🇱 Polski",
  ro: "🇷🇴 Română",
  sv: "🇸🇪 Svenska",
  da: "🇩🇰 Dansk",
  fi: "🇫🇮 Suomi",
  no: "🇳🇴 Norsk",
  el: "🇬🇷 Ελληνικά",
  cs: "🇨🇿 Čeština",
  sk: "🇸🇰 Slovenčina",
  hr: "🇭🇷 Hrvatski",
  bg: "🇧🇬 Български",
  hu: "🇭🇺 Magyar",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Langue"
      // text-base (16px) : en dessous, Safari iOS zoome tout seul au focus.
      className="min-h-[44px] rounded-md border border-slate-300 bg-white px-2 py-1 text-base"
      value={locale}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {NOMS[l] ?? l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

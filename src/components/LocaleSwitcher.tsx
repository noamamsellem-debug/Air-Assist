"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

const NOMS: Record<string, string> = { fr: "FR", en: "EN", es: "ES" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Langue"
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
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

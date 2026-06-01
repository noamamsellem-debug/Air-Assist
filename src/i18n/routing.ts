import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "es", "de", "it", "pt", "nl", "pl", "ro", "sv", "da", "fi", "no"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

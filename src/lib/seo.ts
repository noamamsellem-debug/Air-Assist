import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const OG_LOCALE: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
  pt: "pt_PT",
  nl: "nl_NL",
  pl: "pl_PL",
  ro: "ro_RO",
  sv: "sv_SE",
  da: "da_DK",
  fi: "fi_FI",
  no: "nb_NO",
  el: "el_GR",
  cs: "cs_CZ",
  sk: "sk_SK",
  hr: "hr_HR",
  bg: "bg_BG",
  hu: "hu_HU",
};

/**
 * Construit les métadonnées SEO d'une page : titre, description, canonical
 * PROPRE À LA PAGE, hreflang (toutes les langues + x-default) PROPRES À LA PAGE,
 * Open Graph et Twitter Card.
 *
 * @param path chemin SANS préfixe de langue, ex "" (accueil), "/bareme",
 *             "/compagnies/af". Doit commencer par "/" sauf pour l'accueil.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  absoluteTitle = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Mots-clés SEO (séparés par des virgules) propres à la page. */
  keywords?: string;
  /**
   * Si vrai, le <title> n'est PAS suffixé par le template parent « · Air
   * Assist » : utile quand le titre porte déjà la marque (évite le doublon).
   */
  absoluteTitle?: boolean;
}): Metadata {
  const cheminPropre = path === "/" ? "" : path;
  const canonical = `${SITE_URL}/${locale}${cheminPropre}`;

  // hreflang : une URL par langue POUR CETTE PAGE + x-default (fr).
  const languages: Record<string, string> = {
    "x-default": `${SITE_URL}/${routing.defaultLocale}${cheminPropre}`,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${cheminPropre}`;
  }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Air Assist",
      locale: OG_LOCALE[locale] ?? "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

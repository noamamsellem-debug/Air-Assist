import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { AEROPORTS } from "@/data/aeroports";
import { COMPAGNIES_SEO } from "@/data/compagnies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PAGES_STATIQUES = [
  "",
  "/droits-passagers",
  "/bareme",
  "/reclamation",
  "/suivi",
  "/mentions-legales",
  "/confidentialite",
  "/cgv",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const alternates = (suffix: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${suffix}`]),
    ),
  });

  for (const locale of routing.locales) {
    for (const page of PAGES_STATIQUES) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.7,
        alternates: alternates(page),
      });
    }
    for (const code of COMPAGNIES_SEO.map((c) => c.code.toLowerCase())) {
      entries.push({
        url: `${SITE_URL}/${locale}/compagnies/${code}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: alternates(`/compagnies/${code}`),
      });
    }
    for (const iata of Object.keys(AEROPORTS).map((i) => i.toLowerCase())) {
      entries.push({
        url: `${SITE_URL}/${locale}/aeroports/${iata}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: alternates(`/aeroports/${iata}`),
      });
    }
  }

  return entries;
}

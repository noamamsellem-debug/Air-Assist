import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { AEROPORTS } from "@/data/aeroports";
import { COMPAGNIES_SEO } from "@/data/compagnies";
import { ARTICLES } from "@/data/articles";
import { PAGES_COMPAGNIES } from "@/data/pages-compagnies";
import { PAGES_AEROPORTS } from "@/data/pages-aeroports";
import { PAGES_DESTINATIONS } from "@/data/pages-destinations";
import { ARTICLES_BLOG } from "@/data/articles-blog";

const PAGES_STATIQUES = [
  "",
  "/droits-passagers",
  "/bareme",
  "/reclamation",
  "/suivi",
  "/blog",
  "/mentions-legales",
  "/confidentialite",
  "/cgv",
  "/cookies",
];

// Pages SEO rédigées en français uniquement pour l'instant (pas de hreflang
// tant que les traductions n'existent pas). Voir buildSeoMetadata.
const PAGES_SEO_FR = [
  "/indemnisation-vol-retarde",
  "/indemnisation-vol-annule",
  "/indemnisation-surbooking",
  "/indemnisation-correspondance-ratee",
  "/bareme-indemnisation",
  "/blog/droits-vol-retarde",
  "/blog/delai-indemnisation-vol",
  "/blog/circonstances-extraordinaires",
  "/blog/compagnie-refuse-indemnisation",
  "/blog/reglement-ec-261-2004",
  "/blog/regle-3-heures-retard",
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
    for (const a of ARTICLES) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${a.slug}`,
        lastModified: new Date(a.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: alternates(`/blog/${a.slug}`),
      });
    }
  }

  // Pages SEO françaises (fr uniquement, sans alternates).
  const seoFr = [
    ...PAGES_SEO_FR,
    ...PAGES_COMPAGNIES.map((c) => `/indemnisation-vol-retarde-${c.slug}`),
    ...PAGES_AEROPORTS.map((a) => `/${a.slug}`),
    ...PAGES_DESTINATIONS.map((d) => `/${d.slug}`),
    ...ARTICLES_BLOG.map((a) => `/blog/${a.slug}`),
  ];
  for (const page of seoFr) {
    entries.push({
      url: `${SITE_URL}/fr${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}

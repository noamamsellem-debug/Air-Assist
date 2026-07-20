import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const CANONICAL_ORIGIN = "https://airassist.eu";

// Anciennes pages compagnies (/fr/indemnisation/{slug}) → nouvelles pages
// enrichies. Les 3 compagnies sans page dédiée pointent vers la page service.
const REDIRECTS_COMPAGNIES: Record<string, string> = {
  "/fr/indemnisation/ryanair": "/fr/indemnisation-vol-retarde-ryanair",
  "/fr/indemnisation/easyjet": "/fr/indemnisation-vol-retarde-easyjet",
  "/fr/indemnisation/air-france": "/fr/indemnisation-vol-retarde-air-france",
  "/fr/indemnisation/transavia": "/fr/indemnisation-vol-retarde-transavia",
  "/fr/indemnisation/vueling": "/fr/indemnisation-vol-retarde-vueling",
  "/fr/indemnisation/volotea": "/fr/indemnisation-vol-retarde-volotea",
  "/fr/indemnisation/lufthansa": "/fr/indemnisation-vol-retarde-lufthansa",
  "/fr/indemnisation/swiss": "/fr/indemnisation-vol-retarde-swiss",
  "/fr/indemnisation/british-airways": "/fr/indemnisation-vol-retarde-british-airways",
  "/fr/indemnisation/iberia": "/fr/indemnisation-vol-retarde-iberia",
  "/fr/indemnisation/wizz-air": "/fr/indemnisation-vol-retarde-wizz-air",
  "/fr/indemnisation/klm": "/fr/indemnisation-vol-retarde-klm",
  "/fr/indemnisation/tap-air-portugal": "/fr/indemnisation-vol-retarde-tap",
  // Anciennes pages aéroports (/fr/aeroport/{slug}) → nouvelles pages enrichies.
  "/fr/aeroport/lyon": "/fr/vol-retarde-lyon-saint-exupery-indemnisation",
  "/fr/aeroport/paris-cdg": "/fr/vol-retarde-paris-cdg-indemnisation",
  "/fr/aeroport/paris-orly": "/fr/vol-retarde-paris-orly-indemnisation",
  "/fr/aeroport/marseille": "/fr/vol-retarde-marseille-indemnisation",
  "/fr/aeroport/nice": "/fr/vol-retarde-nice-indemnisation",
  "/fr/aeroport/toulouse": "/fr/vol-retarde-toulouse-indemnisation",
  "/fr/aeroport/bordeaux": "/fr/vol-retarde-bordeaux-indemnisation",
  "/fr/aeroport/nantes": "/fr/vol-retarde-nantes-indemnisation",
  "/fr/aeroport/lille": "/fr/vol-retarde-lille-indemnisation",
};

// Anciens articles de blog (1re génération) → articles piliers enrichis.
// Ils traitaient la même intention de recherche avec un contenu plus pauvre :
// on concentre le jus SEO sur un seul article par sujet.
const REDIRECTS_BLOG: Record<string, string> = {
  "/fr/blog/circonstances-extraordinaires":
    "/fr/blog/circonstances-exceptionnelles-indemnisation-vol",
  "/fr/blog/regle-3-heures-retard": "/fr/blog/vol-retarde-plus-3-heures-indemnisation",
  "/fr/blog/droits-vol-retarde": "/fr/blog/vol-retarde-plus-3-heures-indemnisation",
  "/fr/blog/delai-indemnisation-vol": "/fr/blog/delai-reclamation-indemnisation-vol",
  // L'escalade juridique de cet article (mise en demeure, médiateur, justice) a
  // été réinjectée dans l'article cible : aucune perte de contenu.
  "/fr/blog/compagnie-refuse-indemnisation":
    "/fr/blog/reclamer-indemnisation-soi-meme-ou-service",
};

/** Le chemin relève-t-il de l'i18n (pages publiques) ? (mêmes exclusions qu'avant) */
function estPageIntl(pathname: string): boolean {
  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) return false;
  // Fichiers (sitemap.xml, robots.txt, images…) : servis tels quels.
  if (/\.[^/]+$/.test(pathname)) return false;
  return true;
}

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // Redirection 301 : en PRODUCTION, tout accès via un domaine *.vercel.app est
  // renvoyé vers le domaine canonique (même chemin). Les déploiements de preview
  // (VERCEL_ENV = "preview") ne sont PAS redirigés → tests toujours possibles.
  if (process.env.VERCEL_ENV === "production" && host.endsWith(".vercel.app")) {
    const cible = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, CANONICAL_ORIGIN);
    return NextResponse.redirect(cible, 301);
  }

  // Redirection 301 des anciennes URLs (compagnies, aéroports, blog) vers les
  // nouvelles pages enrichies.
  const redirCompagnie =
    REDIRECTS_COMPAGNIES[req.nextUrl.pathname] ?? REDIRECTS_BLOG[req.nextUrl.pathname];
  if (redirCompagnie) {
    const url = req.nextUrl.clone();
    url.pathname = redirCompagnie;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // Sinon : i18n uniquement sur les pages publiques, le reste passe tel quel.
  if (estPageIntl(req.nextUrl.pathname)) return intlMiddleware(req);
  return NextResponse.next();
}

export const config = {
  // Large : on couvre aussi /api, /admin, sitemap.xml… pour la redirection 301.
  // On exclut seulement les internes Next et les assets statiques.
  matcher: ["/((?!_next|_vercel).*)"],
};

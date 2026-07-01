import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const CANONICAL_ORIGIN = "https://airassist.eu";

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

  // Sinon : i18n uniquement sur les pages publiques, le reste passe tel quel.
  if (estPageIntl(req.nextUrl.pathname)) return intlMiddleware(req);
  return NextResponse.next();
}

export const config = {
  // Large : on couvre aussi /api, /admin, sitemap.xml… pour la redirection 301.
  // On exclut seulement les internes Next et les assets statiques.
  matcher: ["/((?!_next|_vercel).*)"],
};

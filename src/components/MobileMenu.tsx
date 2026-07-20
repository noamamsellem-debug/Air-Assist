"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Menu mobile en panneau déroulant (burger). Regroupe la navigation, le suivi
 * de dossier et le sélecteur de langue pour éviter tout chevauchement sur
 * petit écran. Le CTA principal reste visible en permanence dans le header.
 */
export function MobileMenu() {
  const t = useTranslations("nav");
  const b = useTranslations("blog");
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  // Referme le panneau à chaque changement de route.
  useEffect(() => setOuvert(false), [pathname]);

  // Bloque le défilement de l'arrière-plan quand le panneau est ouvert.
  useEffect(() => {
    if (ouvert) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [ouvert]);

  const liens = [
    { href: "/droits-passagers", label: t("rights") },
    { href: "/bareme", label: t("scale") },
    { href: "/#comment-ca-marche", label: t("howItWorks") },
    { href: "/blog", label: b("title") },
  ] as const;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-label={ouvert ? t("close") : t("menu")}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95"
      >
        {ouvert ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {ouvert && (
        <>
          {/* Voile cliquable pour refermer */}
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => setOuvert(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 top-full z-40 origin-top animate-[menuIn_180ms_ease-out] border-b border-slate-200 bg-white shadow-lift">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
              {liens.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-slate-100" />
              <Link href="/suivi" className="btn-secondary w-full">
                {t("trackClaim")}
              </Link>
              <Link href="/reclamation" className="btn-primary mt-2 w-full">
                {t("startClaim")}
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

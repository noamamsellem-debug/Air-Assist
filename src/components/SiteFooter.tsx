import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PAGES_COMPAGNIES } from "@/data/pages-compagnies";
import { PAGES_AEROPORTS } from "@/data/pages-aeroports";
import { PAGES_DESTINATIONS } from "@/data/pages-destinations";
import { identiteSociete } from "@/lib/preuve-sociale";

/**
 * Pied de page — il porte le maillage SEO (une cinquantaine de liens).
 *
 * L'ancienne version les alignait en trois rangées à la file : dense,
 * illisible, et impossible à parcourir des yeux. Ils sont désormais rangés en
 * colonnes titrées, sur une seule ligne chacune, ce qui rend le bloc
 * consultable sans rien retirer au maillage.
 */

function ColonneLiens({
  titre,
  liens,
}: {
  titre: string;
  liens: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-mono text-board-label uppercase text-ink-400">{titre}</h3>
      <ul className="mt-4 space-y-2">
        {liens.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink-300 transition-colors duration-fast hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const c = useTranslations("common");
  const s = useTranslations("suivi");
  const b = useTranslations("blog");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const societe = identiteSociete();

  const liensService = [
    { href: "/suivi", label: s("title") },
    { href: "/blog", label: b("title") },
    { href: "/droits-passagers", label: n("rights") },
    { href: "/bareme", label: n("scale") },
  ];
  const liensLegaux = [
    { href: "/mentions-legales", label: n("legal") },
    { href: "/confidentialite", label: n("privacy") },
    { href: "/cgv", label: n("terms") },
    { href: "/cookies", label: "Cookies" },
  ];

  return (
    <footer className="bg-board-900 text-ink-300">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* ── Marque + navigation de service ───────────────────────────── */}
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <span className="inline-flex rounded-xl bg-white px-3 py-2">
              <Image
                src="/airassist-logo.png"
                alt="AirAssist"
                width={817}
                height={600}
                className="h-12 w-auto"
              />
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">{c("tagline")}</p>

            {/* Identité société : rendue seulement si renseignée (cf.
                lib/preuve-sociale.ts). On ne publie pas un SIRET d'exemple. */}
            {societe && (
              <dl className="mt-6 space-y-1 font-mono text-xs text-ink-400">
                <div>
                  {societe.raisonSociale} · {societe.formeJuridique}
                </div>
                <div>SIRET {societe.siret}</div>
                <div>{societe.adresse}</div>
                <div>
                  <a
                    href={`mailto:${societe.email}`}
                    className="underline underline-offset-2 transition-colors duration-fast hover:text-white"
                  >
                    {societe.email}
                  </a>
                </div>
              </dl>
            )}
          </div>

          <ColonneLiens titre={t("colService")} liens={liensService} />
          <ColonneLiens titre={t("colLegal")} liens={liensLegaux} />
        </div>

        {/* ── Maillage SEO (français uniquement) ───────────────────────── */}
        {locale === "fr" && (
          <div className="mt-10 grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-3">
            <ColonneLiens
              titre="Indemnisation par compagnie"
              liens={PAGES_COMPAGNIES.map((cp) => ({
                href: `/indemnisation-vol-retarde-${cp.slug}`,
                label: cp.nom,
              }))}
            />
            <ColonneLiens
              titre="Indemnisation par aéroport"
              liens={PAGES_AEROPORTS.map((ap) => ({ href: `/${ap.slug}`, label: ap.nom }))}
            />
            <ColonneLiens
              titre="Indemnisation par destination"
              liens={PAGES_DESTINATIONS.map((dp) => ({ href: `/${dp.slug}`, label: dp.ville }))}
            />
          </div>
        )}

        <p className="mt-8 max-w-prose text-xs leading-relaxed text-ink-400">{t("disclaimer")}</p>
        <p className="mt-2 text-xs text-ink-400">
          © {year} {c("brand")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

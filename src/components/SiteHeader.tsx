import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { HeaderLangSwitcher } from "./HeaderLangSwitcher";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";

/**
 * En-tête allégé : une seule rangée, une seule action principale.
 *
 * Le bandeau de confiance passe en filet discret AU-DESSUS du logo plutôt
 * qu'en pavé coloré — il rassurait, mais il volait la hauteur utile et
 * repoussait le titre hors de l'écran sur mobile.
 *
 * `sticky` + fond opaque : pas d'effet d'escamotage au scroll. Une barre qui
 * disparaît et réapparaît est un gadget qui coûte un reflow à chaque geste ;
 * ici elle reste, simplement, et le contenu passe dessous.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const b = useTranslations("blog");

  const liens = [
    { href: "/droits-passagers", label: t("rights") },
    { href: "/bareme", label: t("scale") },
    { href: "/#comment-ca-marche", label: t("howItWorks") },
    { href: "/blog", label: b("title") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      {/* Filet de réassurance, registre « affichage ». */}
      <div className="border-b border-ink-100 bg-ink-50">
        <p className="mx-auto max-w-6xl px-4 py-1.5 text-center font-mono text-board-label uppercase text-ink-500">
          {c("trustBanner")}
        </p>
      </div>

      {/* px-3 sous 640 px : à 360 px, logo + CTA + langue + burger ne tiennent
          pas avec la gouttière pleine. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3.5 sm:gap-4 sm:px-4">
        <Link href="/" aria-label="Air Assist — accueil" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-600 lg:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors duration-fast hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions bureau : le suivi est secondaire, la réclamation primaire. */}
        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/suivi"
            className="text-sm font-medium text-ink-600 transition-colors duration-fast hover:text-ink-900"
          >
            {t("trackClaim")}
          </Link>
          <Link href="/reclamation" className="btn-primary !px-4 !py-2.5 text-sm">
            {t("startClaim")}
          </Link>
        </div>

        {/* Actions mobile : CTA compact + langue (drapeau) + burger. */}
        <div className="flex items-center gap-1.5 lg:hidden sm:gap-2">
          <Link
            href="/reclamation"
            className="btn-primary whitespace-nowrap !px-3 !py-2 text-[13px] sm:!px-3.5 sm:!py-2.5 sm:text-sm"
          >
            {t("startShort")}
          </Link>
          <HeaderLangSwitcher />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

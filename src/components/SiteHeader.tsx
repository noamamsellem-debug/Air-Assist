import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { HeaderLangSwitcher } from "./HeaderLangSwitcher";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";

export function SiteHeader() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const b = useTranslations("blog");
  return (
    // pt-[env(safe-area-inset-top)] : en-tête collant, il passerait sinon sous
    // l'encoche / la barre d'état iOS en plein écran.
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="bg-brand-50 text-brand-800">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-medium sm:text-sm">
          <span aria-hidden>🛡️</span>
          <span>{c("trustBanner")}</span>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="Air Assist — accueil" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/droits-passagers" className="hover:text-brand-600">
            {t("rights")}
          </Link>
          <Link href="/bareme" className="hover:text-brand-600">
            {t("scale")}
          </Link>
          <Link href="/#comment-ca-marche" className="hover:text-brand-600">
            {t("howItWorks")}
          </Link>
          <Link href="/blog" className="hover:text-brand-600">
            {b("title")}
          </Link>
        </nav>

        {/* Actions bureau */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <Link href="/suivi" className="btn-secondary !px-4 !py-2 text-sm">
            {t("trackClaim")}
          </Link>
          <Link href="/reclamation" className="btn-primary !px-4 !py-2 text-sm">
            {t("startClaim")}
          </Link>
        </div>

        {/* Actions mobile : CTA compact + langue (drapeau) + burger.
            min-h-[44px] partout : norme tactile Apple. */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/reclamation"
            className="btn-primary min-h-[44px] whitespace-nowrap !px-3 !py-2 text-sm"
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

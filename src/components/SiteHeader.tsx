import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

export function SiteHeader() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const b = useTranslations("blog");
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="bg-brand-50 text-brand-800">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-medium sm:text-sm">
          <span aria-hidden>🛡️</span>
          <span>{c("trustBanner")}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Air Assist — accueil">
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
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link href="/reclamation" className="btn-primary !px-4 !py-2 text-sm">
            {t("startClaim")}
          </Link>
        </div>
      </div>
    </header>
  );
}

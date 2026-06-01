import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="text-xl">✈️</span>
          <span>{c("brand")}</span>
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

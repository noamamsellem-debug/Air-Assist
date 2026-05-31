import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const c = useTranslations("common");
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/mentions-legales" className="hover:text-brand-600">
            {n("legal")}
          </Link>
          <Link href="/confidentialite" className="hover:text-brand-600">
            {n("privacy")}
          </Link>
          <Link href="/cgv" className="hover:text-brand-600">
            {n("terms")}
          </Link>
          <Link href="/cookies" className="hover:text-brand-600">
            Cookies
          </Link>
        </div>
        <p className="mt-4">{t("disclaimer")}</p>
        <p className="mt-1">
          © {year} {c("brand")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

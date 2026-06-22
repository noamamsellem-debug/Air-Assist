import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const c = useTranslations("common");
  const s = useTranslations("suivi");
  const b = useTranslations("blog");
  const year = new Date().getFullYear();
  const liens = [
    { href: "/mentions-legales", label: n("legal") },
    { href: "/confidentialite", label: n("privacy") },
    { href: "/cgv", label: n("terms") },
    { href: "/cookies", label: "Cookies" },
    { href: "/suivi", label: s("title") },
    { href: "/blog", label: b("title") },
  ] as const;
  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <span className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image src="/airassist-logo.png" alt="AirAssist" width={817} height={600} className="h-14 w-auto" />
            </span>
            <p className="mt-3 text-slate-400">{c("tagline")}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {liens.map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-300 transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-slate-400">{t("disclaimer")}</p>
        <p className="mt-1 text-slate-500">
          © {year} {c("brand")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

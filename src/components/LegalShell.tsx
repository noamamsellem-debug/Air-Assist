import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

export function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  const t = useTranslations("legal");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
        ⚠️ {t("draftNotice")}
      </p>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-slate-700">{children}</div>
    </article>
  );
}

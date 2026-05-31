import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contenu />;
}

function Contenu() {
  const t = useTranslations("legal");
  return (
    <LegalShell title={t("termsTitle")}>
      <h2 className="text-xl font-semibold">Objet & mandat</h2>
      <p>
        Air Assist est mandatée par le passager pour réclamer en son nom l'indemnité due au titre
        du règlement (CE) n° 261/2004.
      </p>
      <h2 className="text-xl font-semibold">Commission</h2>
      <p className="rounded-lg bg-brand-50 p-4 font-medium text-brand-900">
        {t("commissionClause")}
      </p>
      <h2 className="text-xl font-semibold">{t("withdrawalTitle")}</h2>
      <p>{t("withdrawalText")}</p>
    </LegalShell>
  );
}

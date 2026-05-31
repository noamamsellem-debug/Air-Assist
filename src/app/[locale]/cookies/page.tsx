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
    <LegalShell title={t("cookiesTitle")}>
      <p>
        Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement (par
        ex. la préférence de langue et la session). Aucun cookie publicitaire ou de mesure
        d'audience n'est déposé sans votre consentement.
      </p>
      <p>
        Vous pouvez configurer votre navigateur pour bloquer les cookies ; certaines
        fonctionnalités pourraient alors ne plus être disponibles.
      </p>
    </LegalShell>
  );
}

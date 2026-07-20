import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: "/cookies",
    title: t("cookiesTitle"),
    description: t("cookiesTitle"),
  });
}

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
      <p>
        Pour toute question :{" "}
        <a className="text-vol-700 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a>
      </p>
    </LegalShell>
  );
}

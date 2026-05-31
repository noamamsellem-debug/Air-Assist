import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: "/mentions-legales",
    title: t("mentionsTitle"),
    description: t("mentionsTitle"),
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
    <LegalShell title={t("mentionsTitle")}>
      <p>
        <strong>Air Assist</strong> — éditeur du site. Société à compléter (forme, capital,
        RCS, siège social dans l'UE, directeur de la publication).
      </p>
      <p>Hébergeur : à compléter (prestataire UE).</p>
      <p>Contact : contact@air-assist.example</p>
      <p>
        Air Assist agit en qualité d'intermédiaire mandaté par le passager pour la réclamation
        d'indemnités au titre du règlement (CE) n° 261/2004.
      </p>
    </LegalShell>
  );
}

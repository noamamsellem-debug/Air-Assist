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
    <LegalShell title={t("privacyTitle")}>
      <p>
        Responsable de traitement : Air Assist. Finalités : gestion de votre réclamation
        d'indemnité, relation client, obligations légales et comptables.
      </p>
      <h2 className="text-xl font-semibold">Données collectées</h2>
      <p>
        Identité et coordonnées du passager, informations de vol, pièces justificatives.
        <strong> Aucune coordonnée bancaire n'est stockée par Air Assist</strong> : le versement
        passe par un prestataire de paiement agréé (token uniquement).
      </p>
      <h2 className="text-xl font-semibold">Base légale & durée</h2>
      <p>
        Exécution du mandat (contrat) et consentement. Conservation pendant la durée du dossier
        puis archivage légal (preuve du mandat) ; les pièces sont chiffrées au repos.
      </p>
      <h2 className="text-xl font-semibold">Vos droits</h2>
      <p>
        Accès, rectification, effacement, limitation, portabilité, opposition, retrait du
        consentement à tout moment : contact@air-assist.example. Réclamation possible auprès de
        la CNIL.
      </p>
    </LegalShell>
  );
}

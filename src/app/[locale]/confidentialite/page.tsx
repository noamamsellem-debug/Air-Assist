import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: "/confidentialite",
    title: t("privacyTitle"),
    description: t("privacyTitle"),
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
    <LegalShell title={t("privacyTitle")}>
      <h2 className="text-xl font-semibold">Responsable de traitement</h2>
      <p>
        AirAssist (coordonnées en Mentions légales) est responsable du traitement des données
        personnelles collectées via le site. Contact pour toute question relative aux données :{" "}
        <a className="text-vol-700 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a>.
      </p>
      <h2 className="text-xl font-semibold">Données collectées</h2>
      <p>Dans le cadre du traitement de votre réclamation, nous collectons :</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>vos informations d'identité (civilité, nom, prénom, date de naissance, nationalité) ;</li>
        <li>vos coordonnées (e-mail, téléphone, adresse postale) ;</li>
        <li>les informations relatives à votre vol (numéro de vol, compagnie, date, aéroports, référence de réservation, motif de la perturbation) ;</li>
        <li>les pièces justificatives que vous transmettez (pièce d'identité, justificatif de voyage, justificatif de retard, justificatifs de frais).</li>
      </ul>
      <p>
        <strong>Aucune coordonnée bancaire (carte ou IBAN) n'est stockée en clair par AirAssist.</strong>{" "}
        Le reversement de votre indemnité est opéré via un prestataire de paiement agréé (Stripe),
        qui collecte et sécurise les informations de paiement nécessaires au moment du versement.
      </p>
      <h2 className="text-xl font-semibold">Finalités</h2>
      <p>
        Les données sont traitées pour : la gestion et le suivi de votre réclamation, la relation
        client, le reversement de votre indemnité, et le respect de nos obligations légales et comptables.
      </p>
      <h2 className="text-xl font-semibold">Base légale</h2>
      <p>Exécution du mandat (contrat) et, le cas échéant, consentement et obligations légales.</p>
      <h2 className="text-xl font-semibold">Destinataires</h2>
      <p>
        Vos données sont destinées à AirAssist et, dans la stricte mesure nécessaire : à la compagnie
        aérienne concernée (pour le traitement de la réclamation), au prestataire de paiement Stripe
        (pour le reversement), et à l'hébergeur du site. Aucune donnée n'est vendue à des tiers.
      </p>
      <h2 className="text-xl font-semibold">Sécurité</h2>
      <p>
        Les pièces justificatives transmises sont <strong>chiffrées au repos (AES-256-GCM)</strong>.
        L'accès aux dossiers est restreint et protégé.
      </p>
      <h2 className="text-xl font-semibold">Durée de conservation</h2>
      <p>
        Les données sont conservées pendant la durée du traitement du dossier, puis archivées pour la
        durée nécessaire au respect de nos obligations légales et comptables (notamment la preuve du
        mandat), avant suppression.
      </p>
      <h2 className="text-xl font-semibold">Vos droits</h2>
      <p>
        Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, de portabilité,
        d'opposition et de retrait du consentement à tout moment, en écrivant à{" "}
        <a className="text-vol-700 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a>.
        Vous pouvez également introduire une réclamation auprès de la CNIL
        (<a className="text-vol-700 hover:underline" href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
      </p>
      <h2 className="text-xl font-semibold">Cookies</h2>
      <p>Voir la Politique cookies.</p>
    </LegalShell>
  );
}

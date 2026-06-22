import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: "/cgv",
    title: t("termsTitle"),
    description: t("commissionClause"),
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
    <LegalShell title={t("termsTitle")}>
      <h2 className="text-xl font-semibold">Article 1 — Objet</h2>
      <p>
        Les présentes conditions régissent l'utilisation du site airassist.eu et le service de
        réclamation d'indemnité fourni par AirAssist au titre du règlement (CE) n° 261/2004.
      </p>
      <h2 className="text-xl font-semibold">Article 2 — Description du service</h2>
      <p>
        AirAssist accompagne le passager dans la réclamation de l'indemnité due par une compagnie
        aérienne en cas de retard important, d'annulation ou de refus d'embarquement. Le passager
        confie à AirAssist un mandat de représentation et de cession de créance (voir le Mandat).
      </p>
      <h2 className="text-xl font-semibold">Article 3 — Éligibilité</h2>
      <p>
        L'indemnité éventuelle dépend des conditions fixées par le règlement (CE) n° 261/2004,
        notamment la distance du vol et la durée du retard à l'arrivée. Montants indicatifs : 250 €,
        400 € ou 600 € selon la distance. <strong>Les montants affichés sur le site sont des
        estimations</strong> et ne constituent pas une garantie d'indemnisation.
      </p>
      <h2 className="text-xl font-semibold">Article 4 — Commission et reversement (« no win, no fee »)</h2>
      <p className="rounded-lg bg-brand-50 p-4 font-medium text-brand-900">
        En cas de succès, AirAssist perçoit une commission de <strong>30 % TTC</strong> du montant de
        l'indemnité effectivement obtenue ; le passager perçoit <strong>70 %</strong>. Aucun frais
        n'est dû en l'absence d'indemnisation. L'indemnité est versée par la compagnie à AirAssist,
        qui reverse la part du passager via le prestataire de paiement agréé <strong>Stripe</strong>.
      </p>
      <h2 className="text-xl font-semibold">Article 5 — Obligations du client</h2>
      <p>
        Le client s'engage à fournir des informations exactes et complètes, à transmettre les pièces
        justificatives nécessaires, et à ne pas mener en parallèle une démarche concurrente pour le
        même dossier sans en informer AirAssist.
      </p>
      <h2 className="text-xl font-semibold">Article 6 — Durée</h2>
      <p>
        Le mandat est valable pour la durée du traitement de la réclamation et prend fin une fois
        l'indemnisation versée ou la réclamation définitivement close.
      </p>
      <h2 className="text-xl font-semibold">Article 7 — Droit de rétractation</h2>
      <p>
        Conformément au Code de la consommation, le client dispose d'un délai de rétractation de
        <strong> 14 jours</strong> à compter de l'acceptation du mandat. S'il demande le démarrage
        immédiat de la prestation, il pourra être redevable du service déjà exécuté en cas de
        rétractation. La demande de rétractation s'exerce à{" "}
        <a className="text-brand-600 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a>.
      </p>
      <h2 className="text-xl font-semibold">Article 8 — Responsabilité</h2>
      <p>
        AirAssist est tenue à une obligation de moyens. Elle ne saurait garantir l'obtention d'une
        indemnité, qui dépend de la décision de la compagnie et des faits du dossier.
      </p>
      <h2 className="text-xl font-semibold">Article 9 — Données personnelles</h2>
      <p>Le traitement des données est décrit dans la Politique de confidentialité.</p>
      <h2 className="text-xl font-semibold">Article 10 — Droit applicable et litiges</h2>
      <p>
        Les présentes conditions sont soumises au droit [À COMPLÉTER — ex. français]. En cas de
        litige, une solution amiable sera recherchée en priorité ; à défaut, le client consommateur
        peut recourir au médiateur de la consommation mentionné dans les Mentions légales.
      </p>
      <p>
        Contact : <a className="text-brand-600 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a>
      </p>
    </LegalShell>
  );
}

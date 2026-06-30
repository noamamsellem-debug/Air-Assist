import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dateCourte, dateHeure } from "@/lib/format";
import { BoutonImprimer } from "@/components/admin/BoutonImprimer";

export const dynamic = "force-dynamic";

export default async function MandatPdf({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await prisma.dossier.findUnique({
    where: { id },
    include: { passager: true, vol: true, compagnie: true, mandat: true },
  });
  if (!d) notFound();

  // Preuve de signature (nom tapé + IP) stockée en JSON dans MandatConsentement.preuve.
  let nomSignature = `${d.passager.prenom} ${d.passager.nom}`;
  let ip: string | null = null;
  try {
    if (d.mandat?.preuve) {
      const pr = JSON.parse(d.mandat.preuve) as { nomSignature?: string; ip?: string | null };
      if (pr.nomSignature) nomSignature = pr.nomSignature;
      ip = pr.ip ?? null;
    }
  } catch {
    /* preuve illisible : on garde les valeurs par défaut */
  }

  const adresse = [d.passager.adresseLigne1, d.passager.adresseComplement, d.passager.codePostal, d.passager.ville, d.passager.pays]
    .filter(Boolean)
    .join(", ") || d.passager.adresse || "—";
  const nomComplet = `${d.passager.civilite ? d.passager.civilite + " " : ""}${d.passager.prenom} ${d.passager.nom}`;

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .mandat-doc, .mandat-doc * { visibility: visible; }
          .mandat-doc { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        .mandat-doc { max-width: 800px; margin: 0 auto; color: #0f172a; font-size: 13px; line-height: 1.6; }
        .mandat-doc h1 { font-size: 20px; margin: 16px 0 4px; }
        .mandat-doc h2 { font-size: 14px; margin: 16px 0 4px; }
        .mandat-doc .sig { font-family: cursive; font-size: 22px; color: #0060FF; }
      `}</style>

      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/admin/dossiers/${d.id}`} className="text-sm text-brand-600 hover:underline">← Retour au dossier</Link>
        <BoutonImprimer />
      </div>

      <div className="mandat-doc rounded-xl border border-slate-200 bg-white p-10">
        <img src="/airassist-logo-header.png" alt="AirAssist" height="40" style={{ height: 40, width: "auto" }} />
        <h1>Mandat de représentation et de cession de créance</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Règlement (CE) n° 261/2004 — Dossier n° <strong>{d.reference}</strong></p>

        <h2>Entre les soussignés</h2>
        <p>
          <strong>Le mandant</strong> : {nomComplet}
          {d.passager.dateNaissance ? `, né(e) le ${dateCourte(d.passager.dateNaissance)}` : ""}
          {d.passager.nationalite ? `, de nationalité ${d.passager.nationalite}` : ""}.<br />
          Adresse : {adresse}.<br />
          E-mail : {d.passager.email}{d.passager.telephone ? ` · Tél. : ${d.passager.telephone}` : ""}.
        </p>
        <p>
          <strong>Le mandataire</strong> : AirAssist, intermédiaire mandaté pour la réclamation d'indemnités
          au titre du règlement (CE) n° 261/2004 (coordonnées : info@airassist.eu).
        </p>

        <h2>Vol concerné</h2>
        <p>
          Compagnie : {d.compagnie?.nom ?? d.vol.compagnieTexte} · Vol {d.vol.numero} · {d.vol.aeroportDepart} → {d.vol.aeroportArrivee}
          {" "}du {dateCourte(d.vol.date)}{d.pnr ? ` · Référence de réservation (PNR) : ${d.pnr}` : ""}.
        </p>

        <h2>Articles</h2>
        <p><strong>1. Objet</strong> — Je, soussigné(e) {nomComplet}, donne mandat à la société AirAssist (« le Mandataire ») pour me représenter et entreprendre les démarches nécessaires afin d'obtenir l'indemnisation à laquelle j'ai droit auprès de la compagnie aérienne concernée, au titre du règlement européen CE n° 261/2004 ou de toute réglementation applicable, pour le vol référencé ci-dessus.</p>
        <p><strong>2. Étendue</strong> — J'autorise AirAssist à contacter la compagnie en mon nom, à transmettre ma réclamation, à fournir les informations et documents nécessaires, à négocier et, le cas échéant, à recevoir l'indemnisation pour mon compte.</p>
        <p><strong>3. Cession et versement</strong> — J'accepte que l'indemnisation soit versée par la compagnie directement à AirAssist, qui me reversera ensuite la somme due après déduction de sa commission, via un prestataire de paiement agréé.</p>
        <p><strong>4. Commission</strong> — AirAssist percevra une commission de 30 % TTC du montant obtenu ; je percevrai 70 % de la somme récupérée. Aucun frais ne me sera facturé si aucune indemnisation n'est obtenue : pas de gain, pas de frais.</p>
        <p><strong>5. Exactitude</strong> — Je certifie que les informations fournies sont exactes et que je suis le passager concerné ou son représentant légal habilité.</p>
        <p><strong>6. Durée</strong> — Le mandat est valable pour la durée du traitement de la réclamation et prend fin une fois l'indemnisation versée ou la réclamation close.</p>
        <p><strong>7. Données</strong> — J'accepte que mes données soient traitées aux seules fins du traitement de ma réclamation, conformément au RGPD.</p>

        <h2>Signature électronique</h2>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
          <p style={{ margin: 0 }}>Fait électroniquement, accepté et signé par :</p>
          <p className="sig" style={{ margin: "6px 0" }}>{nomSignature}</p>
          <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
            {d.mandat ? `Le ${dateHeure(d.mandat.horodatage)}` : "Horodatage indisponible"}
            {ip ? ` · Adresse IP : ${ip}` : ""}
            {d.mandat ? ` · Consentement RGPD : ${d.mandat.consentementRgpd ? "Oui" : "Non"}` : ""}
            {d.mandat?.versionCgvAcceptee ? ` · CGV acceptées : version ${d.mandat.versionCgvAcceptee}` : ""}
            {d.mandat?.signatureElectronique ? ` · Réf. signature : ${d.mandat.signatureElectronique}` : ""}
          </p>
        </div>

        <p style={{ marginTop: 18, color: "#64748b", fontSize: 11 }}>
          AirAssist — Nous faisons valoir vos droits de passagers aériens. Réclamation au titre du règlement (CE) n° 261/2004. info@airassist.eu
        </p>
      </div>
    </div>
  );
}

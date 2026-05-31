import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { euros, dateCourte, dateHeure } from "@/lib/format";
import { LIBELLES_STATUT, transitionsPossibles } from "@/domain/statut";
import { MOTIF_LIBELLES } from "@/domain/motif";
import { StatusChanger } from "@/components/admin/StatusChanger";
import { ClaimGenerator } from "@/components/admin/ClaimGenerator";

export const dynamic = "force-dynamic";

export default async function DossierDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await prisma.dossier.findUnique({
    where: { id },
    include: {
      passager: true,
      vol: true,
      compagnie: true,
      documents: true,
      mandat: true,
      paiement: true,
      historique: { orderBy: { date: "desc" } },
    },
  });
  if (!d) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dossiers" className="text-sm text-brand-600 hover:underline">
            ← Dossiers
          </Link>
          <h1 className="mt-1 font-mono text-2xl font-bold">{d.reference}</h1>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
          {LIBELLES_STATUT[d.statut]}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2 space-y-6">
          {/* Passager */}
          <div>
            <h2 className="text-lg font-semibold">Passager</h2>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <Champ k="Nom" v={`${d.passager.prenom} ${d.passager.nom}`} />
              <Champ k="E-mail" v={d.passager.email} />
              <Champ k="Téléphone" v={d.passager.telephone ?? "—"} />
              <Champ k="Adresse" v={d.passager.adresse ?? "—"} />
            </dl>
          </div>

          {/* Vol */}
          <div>
            <h2 className="text-lg font-semibold">Vol</h2>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <Champ k="Numéro" v={d.vol.numero} />
              <Champ k="Date" v={dateCourte(d.vol.date)} />
              <Champ k="Trajet" v={`${d.vol.aeroportDepart} → ${d.vol.aeroportArrivee}`} />
              <Champ k="Distance" v={`${d.vol.distanceKm} km`} />
              <Champ k="Motif" v={MOTIF_LIBELLES[d.vol.motif]} />
              <Champ k="Retard" v={d.vol.dureeRetardMin ? `${d.vol.dureeRetardMin} min` : "—"} />
              <Champ k="PNR" v={d.pnr ?? "—"} />
              <Champ k="N° dossier compagnie" v={d.numeroDossierCompagnie ?? "—"} />
            </dl>
          </div>

          {/* Montants */}
          <div>
            <h2 className="text-lg font-semibold">Montants</h2>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <Champ k="Estimé" v={euros(d.montantEstime)} />
              <Champ k="Obtenu" v={d.montantObtenu ? euros(d.montantObtenu) : "—"} />
              <Champ k="Commission (30 %)" v={d.commission30 ? euros(d.commission30) : "—"} />
              <Champ k="Part client (70 %)" v={d.partClient70 ? euros(d.partClient70) : "—"} />
            </dl>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-lg font-semibold">Documents ({d.documents.length})</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {d.documents.map((doc) => (
                <li key={doc.id} className="flex justify-between rounded bg-slate-50 px-3 py-2">
                  <span>
                    {doc.type === "CARTE_EMBARQUEMENT" ? "Carte d'embarquement" : "Justificatif"} ·{" "}
                    {doc.nomFichier}
                  </span>
                  <span className="text-slate-400">🔒 chiffré ({Math.round(doc.tailleOctets / 1024)} Ko)</span>
                </li>
              ))}
              {d.documents.length === 0 && <li className="text-slate-400">Aucun document.</li>}
            </ul>
          </div>

          {/* Mandat */}
          <div>
            <h2 className="text-lg font-semibold">Mandat & consentement</h2>
            {d.mandat ? (
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <Champ k="Signature" v={d.mandat.signatureElectronique} />
                <Champ k="Consentement RGPD" v={d.mandat.consentementRgpd ? "Oui" : "Non"} />
                <Champ k="Horodatage" v={dateHeure(d.mandat.horodatage)} />
                <Champ k="Version CGV" v={d.mandat.versionCgvAcceptee} />
              </dl>
            ) : (
              <p className="text-sm text-slate-400">Aucun mandat enregistré.</p>
            )}
          </div>
        </section>

        {/* Colonne actions */}
        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold">Changer de statut</h2>
            <p className="mt-1 text-xs text-slate-500">
              Seules les transitions valides sont proposées ; chaque changement est journalisé.
            </p>
            <div className="mt-3">
              <StatusChanger
                dossierId={d.id}
                statutActuel={d.statut}
                transitions={transitionsPossibles(d.statut)}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold">Réclamation à la compagnie</h2>
            <div className="mt-3">
              <ClaimGenerator dossierId={d.id} autoActive={d.compagnie.autoActive} />
            </div>
          </div>
        </aside>
      </div>

      {/* Historique */}
      <section className="card mt-6">
        <h2 className="text-lg font-semibold">Historique</h2>
        <ol className="mt-3 space-y-2 text-sm">
          {d.historique.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-slate-400">{dateHeure(h.date)}</span>
              <span className="font-medium">
                {h.ancienStatut ? `${LIBELLES_STATUT[h.ancienStatut]} → ` : ""}
                {LIBELLES_STATUT[h.nouveauStatut]}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{h.auteur}</span>
              {h.commentaire && <span className="text-slate-500">— {h.commentaire}</span>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Champ({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-400">{k}</dt>
      <dd className="text-slate-800">{v}</dd>
    </div>
  );
}

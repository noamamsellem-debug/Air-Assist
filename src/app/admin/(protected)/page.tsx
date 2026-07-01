import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { euros } from "@/lib/format";
import { LIBELLES_STATUT } from "@/domain/statut";
import type { StatutDossier } from "@prisma/client";

export const dynamic = "force-dynamic";

const ACTIFS: StatutDossier[] = [
  "NOUVEAU",
  "VERIFIE",
  "RECLAMATION_ENVOYEE",
  "ACCUSE_RECU",
  "EN_NEGOCIATION",
  "ACCEPTE",
];

export default async function DashboardPage() {
  // On exclut partout les dossiers en corbeille (supprimeLe renseigné).
  const [parStatut, dossiers, corbeille] = await Promise.all([
    prisma.dossier.groupBy({ by: ["statut"], where: { supprimeLe: null }, _count: { _all: true } }),
    prisma.dossier.findMany({
      where: { supprimeLe: null },
      select: {
        id: true,
        reference: true,
        statut: true,
        dateCreation: true,
        montantEstime: true,
        montantObtenu: true,
        commission30: true,
      },
    }),
    prisma.dossier.count({ where: { supprimeLe: { not: null } } }),
  ]);

  const compteur = (s: StatutDossier) =>
    parStatut.find((p) => p.statut === s)?._count._all ?? 0;

  // Indicateurs financiers.
  const enCours = dossiers
    .filter((d) => ACTIFS.includes(d.statut))
    .reduce((acc, d) => acc + Number(d.montantEstime), 0);
  const encaisse = dossiers
    .filter((d) => d.statut === "PAYE" || d.statut === "REVERSE")
    .reduce((acc, d) => acc + Number(d.montantObtenu ?? 0), 0);
  const commissionCumulee = dossiers
    .filter((d) => d.statut === "REVERSE")
    .reduce((acc, d) => acc + Number(d.commission30 ?? 0), 0);

  // Alertes.
  const maintenant = Date.now();
  const jours = (d: Date) => (maintenant - new Date(d).getTime()) / 86_400_000;
  const aReverser = dossiers.filter((d) => d.statut === "PAYE");
  const bloques = dossiers.filter((d) => d.statut === "NOUVEAU" && jours(d.dateCreation) > 7);
  const relances = dossiers.filter(
    (d) => d.statut === "RECLAMATION_ENVOYEE" && jours(d.dateCreation) > 14,
  );

  const tousStatuts = Object.keys(LIBELLES_STATUT) as StatutDossier[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Indicateur titre="Indemnités en cours" valeur={euros(enCours)} />
        <Indicateur titre="Encaissé (compagnies)" valeur={euros(encaisse)} />
        <Indicateur titre="Commission réalisée (30 %)" valeur={euros(commissionCumulee)} />
      </div>

      <h2 className="mt-8 text-lg font-semibold">Dossiers par statut</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tousStatuts.map((s) => (
          <Link
            key={s}
            href={`/admin/dossiers?statut=${s}`}
            className="card flex items-center justify-between hover:border-brand-400"
          >
            <span className="text-sm text-slate-600">{LIBELLES_STATUT[s]}</span>
            <span className="text-xl font-bold">{compteur(s)}</span>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Alertes</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <Alerte
          titre="Reversements à faire"
          n={aReverser.length}
          couleur="bg-blue-50 text-blue-800"
          lien="/admin/dossiers?statut=PAYE"
        />
        <Alerte
          titre="Dossiers bloqués (> 7 j en Nouveau)"
          n={bloques.length}
          couleur="bg-red-50 text-red-800"
          lien="/admin/dossiers?statut=NOUVEAU"
        />
        <Alerte
          titre="Relances dues (> 14 j)"
          n={relances.length}
          couleur="bg-amber-50 text-amber-800"
          lien="/admin/dossiers?statut=RECLAMATION_ENVOYEE"
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold">Corbeille</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/dossiers/corbeille" className="card flex items-center justify-between hover:border-brand-400">
          <span className="flex items-center gap-2 text-sm text-slate-600">🗑️ Dossiers en corbeille</span>
          <span className="text-2xl font-bold">{corbeille}</span>
        </Link>
      </div>
    </div>
  );
}

function Indicateur({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{titre}</p>
      <p className="mt-1 text-2xl font-bold">{valeur}</p>
    </div>
  );
}

function Alerte({
  titre,
  n,
  couleur,
  lien,
}: {
  titre: string;
  n: number;
  couleur: string;
  lien: string;
}) {
  return (
    <Link href={lien} className={`card ${couleur}`}>
      <p className="text-sm">{titre}</p>
      <p className="mt-1 text-2xl font-bold">{n}</p>
    </Link>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dateHeure } from "@/lib/format";
import { LIBELLES_STATUT } from "@/domain/statut";
import { EmptyTrashButton, RestoreDossierButton } from "@/components/admin/CorbeilleActions";

export const dynamic = "force-dynamic";

export default async function CorbeillePage() {
  const dossiers = await prisma.dossier.findMany({
    where: { supprimeLe: { not: null } },
    orderBy: { supprimeLe: "desc" },
    include: { passager: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/dossiers" className="text-sm text-brand-600 hover:underline">
            ← Dossiers
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Corbeille</h1>
          <p className="text-sm text-slate-500">
            {dossiers.length} dossier{dossiers.length > 1 ? "s" : ""} en corbeille.
          </p>
        </div>
        <EmptyTrashButton count={dossiers.length} />
      </div>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Référence</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">E-mail</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Supprimé le</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-mono">{d.reference}</td>
                <td className="px-4 py-2">{d.passager.nom}</td>
                <td className="px-4 py-2">{d.passager.prenom}</td>
                <td className="px-4 py-2">{d.passager.email}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {LIBELLES_STATUT[d.statut]}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-500">{d.supprimeLe ? dateHeure(d.supprimeLe) : "—"}</td>
                <td className="px-4 py-2 text-right">
                  <RestoreDossierButton dossierId={d.id} />
                </td>
              </tr>
            ))}
            {dossiers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  La corbeille est vide.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

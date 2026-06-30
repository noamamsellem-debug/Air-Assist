import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { euros, dateCourte } from "@/lib/format";
import { LIBELLES_STATUT } from "@/domain/statut";
import type { Prisma, StatutDossier } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DossiersPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; compagnie?: string; q?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const where: Prisma.DossierWhereInput = {};
  if (sp.statut && sp.statut in LIBELLES_STATUT) {
    where.statut = sp.statut as StatutDossier;
  }
  if (sp.compagnie) where.compagnieId = sp.compagnie;
  if (sp.q) {
    const q = sp.q.trim();
    where.OR = [
      { reference: { contains: q, mode: "insensitive" } },
      { pnr: { contains: q, mode: "insensitive" } },
      { passager: { nom: { contains: q, mode: "insensitive" } } },
      { passager: { prenom: { contains: q, mode: "insensitive" } } },
      { passager: { email: { contains: q, mode: "insensitive" } } },
    ];
  }
  // Filtre par date de création (jour ou plage). `to` inclut toute la journée.
  if (sp.from || sp.to) {
    const intervalle: Prisma.DateTimeFilter = {};
    if (sp.from) intervalle.gte = new Date(sp.from);
    if (sp.to) {
      const fin = new Date(sp.to);
      fin.setHours(23, 59, 59, 999);
      intervalle.lte = fin;
    }
    where.dateCreation = intervalle;
  }

  const [dossiers, compagnies] = await Promise.all([
    prisma.dossier.findMany({
      where,
      orderBy: { dateCreation: "desc" },
      include: { passager: true, compagnie: true, vol: true },
      take: 200,
    }),
    prisma.compagnie.findMany({ orderBy: { nom: "asc" } }),
  ]);

  const statuts = Object.keys(LIBELLES_STATUT) as StatutDossier[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dossiers</h1>

      {/* Filtres */}
      <form className="card mt-4 grid gap-3 sm:grid-cols-3" method="get">
        <div>
          <label className="label">Recherche</label>
          <input name="q" defaultValue={sp.q ?? ""} className="input" placeholder="N° dossier, nom, prénom, PNR, e-mail" />
        </div>
        <div>
          <label className="label">Statut</label>
          <select name="statut" defaultValue={sp.statut ?? ""} className="input">
            <option value="">Tous</option>
            {statuts.map((s) => (
              <option key={s} value={s}>{LIBELLES_STATUT[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Compagnie</label>
          <select name="compagnie" defaultValue={sp.compagnie ?? ""} className="input">
            <option value="">Toutes</option>
            {compagnies.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Créé du</label>
          <input type="date" name="from" defaultValue={sp.from ?? ""} className="input" />
        </div>
        <div>
          <label className="label">au</label>
          <input type="date" name="to" defaultValue={sp.to ?? ""} className="input" />
        </div>
        <div className="flex items-end gap-2">
          <button className="btn-primary w-full">Filtrer</button>
          <Link href="/admin/dossiers" className="btn-secondary">Réinitialiser</Link>
        </div>
      </form>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Référence</th>
              <th className="px-4 py-2">Passager</th>
              <th className="px-4 py-2">Vol</th>
              <th className="px-4 py-2">Compagnie</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Estimé</th>
              <th className="px-4 py-2">Créé</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((d) => (
              <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-mono">
                  <Link href={`/admin/dossiers/${d.id}`} className="text-brand-600 hover:underline">
                    {d.reference}
                  </Link>
                </td>
                <td className="px-4 py-2">{d.passager.prenom} {d.passager.nom}</td>
                <td className="px-4 py-2">{d.vol.numero}</td>
                <td className="px-4 py-2">{d.compagnie.nom}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {LIBELLES_STATUT[d.statut]}
                  </span>
                </td>
                <td className="px-4 py-2">{euros(d.montantEstime)}</td>
                <td className="px-4 py-2 text-slate-500">{dateCourte(d.dateCreation)}</td>
              </tr>
            ))}
            {dossiers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Aucun dossier.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

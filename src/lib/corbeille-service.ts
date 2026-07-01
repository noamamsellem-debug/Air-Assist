/**
 * Corbeille des dossiers (soft delete).
 *
 *  - `mettreALaCorbeille` / `restaurerDossier` : basculent le champ `supprimeLe`
 *    (aucune donnée détruite).
 *  - `viderCorbeille` : suppression DÉFINITIVE des dossiers en corbeille. Les
 *    enfants (documents, mandat, historique, paiement) partent en cascade
 *    (onDelete: Cascade au schéma) ; on nettoie ensuite les passagers/vols
 *    devenus orphelins. Compagnies et utilisateurs ne sont jamais touchés.
 */
import { prisma } from "./prisma";

export async function mettreALaCorbeille(id: string): Promise<void> {
  await prisma.dossier.update({
    where: { id },
    data: { supprimeLe: new Date() },
  });
}

export async function restaurerDossier(id: string): Promise<void> {
  await prisma.dossier.update({
    where: { id },
    data: { supprimeLe: null },
  });
}

export async function compterCorbeille(): Promise<number> {
  return prisma.dossier.count({ where: { supprimeLe: { not: null } } });
}

export async function viderCorbeille(): Promise<{ supprimes: number }> {
  const enCorbeille = await prisma.dossier.findMany({
    where: { supprimeLe: { not: null } },
    select: { id: true, passagerId: true, volId: true },
  });
  if (enCorbeille.length === 0) return { supprimes: 0 };

  const passagerIds = [...new Set(enCorbeille.map((d) => d.passagerId))];
  const volIds = enCorbeille.map((d) => d.volId);

  await prisma.$transaction(async (tx) => {
    // Supprime les dossiers en corbeille → cascade documents/mandat/historique/paiement.
    await tx.dossier.deleteMany({ where: { supprimeLe: { not: null } } });
    // Vols en relation 1‑1 : plus aucun dossier ne les référence.
    await tx.vol.deleteMany({ where: { id: { in: volIds } } });
    // Passagers : seulement ceux qui n'ont plus AUCUN dossier (garde-fou si un
    // passager était partagé avec un dossier hors corbeille).
    await tx.passager.deleteMany({
      where: { id: { in: passagerIds }, dossiers: { none: {} } },
    });
  });

  return { supprimes: enCorbeille.length };
}

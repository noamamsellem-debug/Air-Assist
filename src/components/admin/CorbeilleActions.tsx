"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Met le dossier à la corbeille (soft delete) puis redirige vers la liste. */
export function DeleteDossierButton({ dossierId }: { dossierId: string }) {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);

  async function supprimer() {
    if (!confirm("Mettre ce dossier à la corbeille ?")) return;
    setEnvoi(true);
    const res = await fetch(`/api/dossiers/${dossierId}/supprimer`, { method: "POST" });
    setEnvoi(false);
    if (res.ok) {
      router.push("/admin/dossiers");
      router.refresh();
    } else {
      alert("Échec de la mise à la corbeille.");
    }
  }

  return (
    <button
      onClick={supprimer}
      disabled={envoi}
      className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      🗑️ {envoi ? "…" : "Supprimer"}
    </button>
  );
}

/** Restaure un dossier depuis la corbeille. */
export function RestoreDossierButton({ dossierId }: { dossierId: string }) {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);

  async function restaurer() {
    setEnvoi(true);
    const res = await fetch(`/api/dossiers/${dossierId}/restaurer`, { method: "POST" });
    setEnvoi(false);
    if (res.ok) router.refresh();
    else alert("Échec de la restauration.");
  }

  return (
    <button
      onClick={restaurer}
      disabled={envoi}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
    >
      {envoi ? "…" : "Restaurer"}
    </button>
  );
}

/** Vide la corbeille : suppression définitive, avec confirmation. */
export function EmptyTrashButton({ count }: { count: number }) {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);

  async function vider() {
    if (count === 0) return;
    if (
      !confirm(
        `Cette action est irréversible, ${count} dossier${count > 1 ? "s" : ""} ` +
          `${count > 1 ? "seront supprimés" : "sera supprimé"} définitivement, continuer ?`,
      )
    )
      return;
    setEnvoi(true);
    const res = await fetch(`/api/dossiers/corbeille/vider`, { method: "POST" });
    setEnvoi(false);
    if (res.ok) router.refresh();
    else alert("Échec de la suppression définitive.");
  }

  return (
    <button
      onClick={vider}
      disabled={envoi || count === 0}
      className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
    >
      🗑️ {envoi ? "Suppression…" : "Vider la corbeille"}
    </button>
  );
}

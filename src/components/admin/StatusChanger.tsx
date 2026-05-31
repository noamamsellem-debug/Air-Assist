"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIBELLES_STATUT } from "@/domain/statut";
import type { StatutDossier } from "@prisma/client";

export function StatusChanger({
  dossierId,
  statutActuel,
  transitions,
}: {
  dossierId: string;
  statutActuel: StatutDossier;
  transitions: StatutDossier[];
}) {
  const router = useRouter();
  const [cible, setCible] = useState<StatutDossier | "">("");
  const [commentaire, setCommentaire] = useState("");
  const [numeroDossierCompagnie, setNumero] = useState("");
  const [montantObtenu, setMontant] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const demandeNumero = cible === "ACCUSE_RECU";
  const demandeMontant = cible === "ACCEPTE" || cible === "PAYE";

  async function soumettre() {
    if (!cible) return;
    setErreur(null);
    setEnvoi(true);
    const res = await fetch(`/api/dossiers/${dossierId}/statut`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nouveauStatut: cible,
        commentaire: commentaire || undefined,
        numeroDossierCompagnie: demandeNumero ? numeroDossierCompagnie || undefined : undefined,
        montantObtenu: demandeMontant && montantObtenu ? Number(montantObtenu) : undefined,
      }),
    });
    setEnvoi(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErreur(data.error ?? "Erreur");
      return;
    }
    setCible("");
    setCommentaire("");
    router.refresh();
  }

  if (transitions.length === 0) {
    return <p className="text-sm text-slate-500">Statut terminal — aucune action possible.</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Nouveau statut</label>
        <select
          className="input"
          value={cible}
          onChange={(e) => setCible(e.target.value as StatutDossier)}
        >
          <option value="">Choisir…</option>
          {transitions.map((s) => (
            <option key={s} value={s}>
              {LIBELLES_STATUT[statutActuel]} → {LIBELLES_STATUT[s]}
            </option>
          ))}
        </select>
      </div>

      {demandeNumero && (
        <div>
          <label className="label">N° de dossier compagnie</label>
          <input className="input" value={numeroDossierCompagnie} onChange={(e) => setNumero(e.target.value)} />
        </div>
      )}

      {demandeMontant && (
        <div>
          <label className="label">Montant obtenu (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={montantObtenu}
            onChange={(e) => setMontant(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Commission (30 %) et part client (70 %) seront calculées automatiquement.
          </p>
        </div>
      )}

      <div>
        <label className="label">Commentaire (optionnel)</label>
        <input className="input" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
      </div>

      {erreur && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}

      <button className="btn-primary" disabled={!cible || envoi} onClick={soumettre}>
        {envoi ? "…" : "Appliquer le changement"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StatutDossier } from "@prisma/client";

interface ActionRapide {
  statut: StatutDossier;
  label: string;
  champ?: { label: string; placeholder: string }; // texte libre → commentaire
  montant?: boolean; // demande le montant obtenu (€)
  couleur?: string;
}

const ACTIONS: ActionRapide[] = [
  { statut: "DOCUMENT_MANQUANT", label: "Document manquant", champ: { label: "Quel document manque ?", placeholder: "Ex : carte d'embarquement lisible" } },
  { statut: "RECLAMATION_ENVOYEE", label: "Réclamation envoyée" },
  { statut: "ACCEPTE", label: "Demande de RIB / Indemnité obtenue", montant: true },
  { statut: "REVERSE", label: "Versement effectué" },
  { statut: "REFUSE", label: "Refusé", champ: { label: "Motif du refus", placeholder: "Ex : circonstances extraordinaires" } },
];

export function QuickActions({
  dossierId,
  statutActuel,
  transitions,
  passagerEmail,
}: {
  dossierId: string;
  statutActuel: StatutDossier;
  transitions: StatutDossier[];
  passagerEmail: string;
}) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState<StatutDossier | "RELANCE" | null>(null);
  const [texte, setTexte] = useState("");
  const [montant, setMontant] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  function reset() {
    setOuvert(null);
    setTexte("");
    setMontant("");
    setErreur(null);
  }

  async function appliquer(action: ActionRapide) {
    setEnvoi(true);
    setErreur(null);
    setMessage(null);
    try {
      const body: Record<string, unknown> = { nouveauStatut: action.statut };
      if (action.champ) body.commentaire = texte;
      if (action.montant) body.montantObtenu = Number(montant);
      const res = await fetch(`/api/dossiers/${dossierId}/statut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErreur(data?.error ?? "Action impossible.");
        return;
      }
      reset();
      setMessage(`✅ Statut mis à jour — e-mail envoyé à ${passagerEmail}.`);
      router.refresh();
    } catch {
      setErreur("Erreur réseau, réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  async function relancer() {
    setEnvoi(true);
    setErreur(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/dossiers/${dossierId}/relancer`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErreur(data?.error ?? "Relance impossible.");
        return;
      }
      reset();
      setMessage(`✅ Relance envoyée à ${passagerEmail}.`);
      router.refresh();
    } catch {
      setErreur("Erreur réseau, réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  const disponibles = ACTIONS.filter((a) => transitions.includes(a.statut));

  return (
    <div className="space-y-2">
      {disponibles.map((a) => (
        <div key={a.statut}>
          <button
            type="button"
            disabled={envoi}
            onClick={() => {
              setMessage(null);
              setErreur(null);
              if (a.champ || a.montant) setOuvert(ouvert === a.statut ? null : a.statut);
              else appliquer(a);
            }}
            className="w-full rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-left text-sm font-semibold text-brand-800 hover:bg-brand-100 disabled:opacity-50"
          >
            {a.label}
          </button>

          {ouvert === a.statut && (a.champ || a.montant) && (
            <div className="mt-2 rounded-lg border border-slate-200 p-3">
              {a.champ && (
                <>
                  <label className="label">{a.champ.label}</label>
                  <input className="input" placeholder={a.champ.placeholder} value={texte} onChange={(e) => setTexte(e.target.value)} />
                  <p className="mt-1 text-xs text-slate-500">Ce texte sera inséré dans l'e-mail au client.</p>
                </>
              )}
              {a.montant && (
                <>
                  <label className="label">Montant obtenu (€)</label>
                  <input type="number" step="0.01" min="0" className="input" placeholder="Ex : 400" value={montant} onChange={(e) => setMontant(e.target.value)} />
                  <p className="mt-1 text-xs text-slate-500">Part client (70 %) et commission (30 %) calculées automatiquement.</p>
                </>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={envoi || (a.champ ? !texte.trim() : false) || (a.montant ? !(Number(montant) > 0) : false)}
                  onClick={() => appliquer(a)}
                  className="btn-primary !px-4 !py-2 text-sm"
                >
                  {envoi ? "…" : "Confirmer et envoyer l'e-mail"}
                </button>
                <button type="button" onClick={reset} className="btn-secondary !px-4 !py-2 text-sm">Annuler</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {statutActuel === "DOCUMENT_MANQUANT" && (
        <button
          type="button"
          disabled={envoi}
          onClick={relancer}
          className="w-full rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-left text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
        >
          Relancer le document (renvoyer l'e-mail)
        </button>
      )}

      {message && <p className="rounded bg-green-50 p-2 text-sm text-green-700">{message}</p>}
      {erreur && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
    </div>
  );
}

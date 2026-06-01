"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClaimGenerator({
  dossierId,
  autoActive,
}: {
  dossierId: string;
  autoActive: boolean;
}) {
  const router = useRouter();
  const [langue, setLangue] = useState("fr");
  const [sujet, setSujet] = useState("");
  const [corps, setCorps] = useState("");
  const [charge, setCharge] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function previsualiser() {
    setCharge(true);
    setInfo(null);
    const res = await fetch(`/api/dossiers/${dossierId}/reclamation?langue=${langue}`);
    setCharge(false);
    if (res.ok) {
      const data = await res.json();
      setSujet(data.sujet);
      setCorps(data.corps);
    } else {
      setInfo("Impossible de générer le contenu.");
    }
  }

  async function envoyer() {
    setEnvoi(true);
    setInfo(null);
    const res = await fetch(`/api/dossiers/${dossierId}/reclamation?langue=${langue}`, {
      method: "POST",
    });
    setEnvoi(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setInfo(`Réclamation envoyée à ${data.destinataire} (mock e-mail en dev).`);
      router.refresh();
    } else {
      setInfo(data.error ?? "Échec de l'envoi.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <select className="input max-w-[140px]" value={langue} onChange={(e) => setLangue(e.target.value)}>
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        <button className="btn-secondary" onClick={previsualiser} disabled={charge}>
          {charge ? "…" : "Générer / prévisualiser"}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        {autoActive
          ? "Compagnie en full-auto : l'envoi peut être automatisé."
          : "Mode semi-auto : validez le contenu avant d'envoyer."}
      </p>

      {(sujet || corps) && (
        <div className="space-y-2">
          <input className="input font-medium" value={sujet} onChange={(e) => setSujet(e.target.value)} />
          <textarea
            className="input h-64 font-mono text-sm"
            value={corps}
            onChange={(e) => setCorps(e.target.value)}
          />
          <button className="btn-primary" onClick={envoyer} disabled={envoi}>
            {envoi ? "…" : "Valider et envoyer (1 clic)"}
          </button>
        </div>
      )}

      {info && <p className="rounded bg-slate-100 p-2 text-sm text-slate-700">{info}</p>}
    </div>
  );
}

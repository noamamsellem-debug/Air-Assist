"use client";

import { useState } from "react";

export function PasswordForm() {
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirme, setConfirme] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; texte: string } | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (nouveau !== confirme) {
      setMessage({ type: "err", texte: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }
    setEnvoi(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actuel, nouveau }),
    });
    setEnvoi(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMessage({ type: "ok", texte: "Mot de passe modifié ✅" });
      setActuel("");
      setNouveau("");
      setConfirme("");
    } else {
      setMessage({ type: "err", texte: data.error ?? "Erreur" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-3">
      <div>
        <label className="label">Mot de passe actuel</label>
        <input type="password" className="input" value={actuel} onChange={(e) => setActuel(e.target.value)} required />
      </div>
      <div>
        <label className="label">Nouveau mot de passe</label>
        <input type="password" className="input" value={nouveau} onChange={(e) => setNouveau(e.target.value)} required minLength={8} />
        <p className="mt-1 text-xs text-slate-500">8 caractères minimum.</p>
      </div>
      <div>
        <label className="label">Confirmer le nouveau mot de passe</label>
        <input type="password" className="input" value={confirme} onChange={(e) => setConfirme(e.target.value)} required minLength={8} />
      </div>
      {message && (
        <p className={`rounded p-2 text-sm ${message.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.texte}
        </p>
      )}
      <button className="btn-primary" disabled={envoi}>
        {envoi ? "…" : "Changer mon mot de passe"}
      </button>
    </form>
  );
}

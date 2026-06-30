"use client";

import { useState } from "react";

const EMAILS: { type: string; label: string }[] = [
  { type: "ACCUSE_RECEPTION", label: "1. Accusé de réception (création)" },
  { type: "DOCUMENT_MANQUANT", label: "2. Document manquant" },
  { type: "RELANCE_DOCUMENT", label: "3. Relance document" },
  { type: "RECLAMATION_ENVOYEE", label: "4. Réclamation envoyée" },
  { type: "INDEMNITE_OBTENUE", label: "5. Indemnité obtenue (RIB)" },
  { type: "VERSEMENT_EFFECTUE", label: "6. Versement effectué" },
  { type: "REFUSE", label: "7. Dossier refusé" },
];

export default function PageTestEmails() {
  const [to, setTo] = useState("");
  const [enCours, setEnCours] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const emailValide = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to.trim());

  async function envoyer(type: string, label: string) {
    setErreur(null);
    setMessage(null);
    setEnCours(type);
    try {
      const res = await fetch(`/api/admin/email-test?type=${type}&to=${encodeURIComponent(to.trim())}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) setErreur(data?.error ?? "Échec de l'envoi.");
      else setMessage(`✅ « ${label} » envoyé à ${to.trim()} (via ${data?.provider ?? "?"}).`);
    } catch {
      setErreur("Erreur réseau, réessayez.");
    } finally {
      setEnCours(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Test des e-mails</h1>
      <p className="mt-2 text-sm text-slate-600">
        Envoie chaque template avec des données d'exemple à l'adresse de ton choix, pour valider le rendu
        (logo, couleur #0060FF, variables) avant la prod. Le sujet est préfixé « [TEST] ».
      </p>

      <div className="card mt-6">
        <label className="label" htmlFor="to">Adresse de réception du test</label>
        <input
          id="to"
          type="email"
          className="input"
          placeholder="moi@exemple.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EMAILS.map((e) => (
            <button
              key={e.type}
              type="button"
              disabled={!emailValide || enCours !== null}
              onClick={() => envoyer(e.type, e.label)}
              className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-left text-sm font-semibold text-brand-800 hover:bg-brand-100 disabled:opacity-50"
            >
              {enCours === e.type ? "Envoi…" : e.label}
            </button>
          ))}
        </div>

        {message && <p className="mt-4 rounded bg-green-50 p-2 text-sm text-green-700">{message}</p>}
        {erreur && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
      </div>
    </div>
  );
}

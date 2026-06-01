"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

interface Resultat {
  reference: string;
  libelle: string;
  montantEstime: number;
  dateCreation: string;
  vol: { numero: string; date: string; depart: string; arrivee: string };
}

export function SuiviForm() {
  const t = useTranslations("suivi");
  const locale = useLocale();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setResultat(null);
    setEnvoi(true);
    const res = await fetch("/api/suivi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, email }),
    });
    setEnvoi(false);
    if (res.ok) {
      setResultat(await res.json());
    } else {
      setErreur(t("notFound"));
    }
  }

  const dateFmt = (iso: string) => new Date(iso).toLocaleDateString(locale);
  const montantFmt = (m: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(m);

  return (
    <div>
      <form onSubmit={onSubmit} className="card max-w-md space-y-3">
        <div>
          <label className="label">{t("reference")}</label>
          <input className="input uppercase" value={reference} onChange={(e) => setReference(e.target.value)} required />
        </div>
        <div>
          <label className="label">{t("email")}</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {erreur && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
        <button className="btn-primary w-full" disabled={envoi}>
          {envoi ? "…" : t("submit")}
        </button>
      </form>

      {resultat && (
        <div className="card mt-6 max-w-md">
          <p className="text-xs uppercase tracking-wide text-slate-400">{t("statusLabel")}</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-700">{resultat.libelle}</p>
          <dl className="mt-4 space-y-1 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>{t("ref")}</dt>
              <dd className="font-mono">{resultat.reference}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("flight")}</dt>
              <dd>
                {resultat.vol.numero} · {resultat.vol.depart} → {resultat.vol.arrivee}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("estimated")}</dt>
              <dd>{montantFmt(resultat.montantEstime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("created")}</dt>
              <dd>{dateFmt(resultat.dateCreation)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

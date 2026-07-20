"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { preparerFichier, MIMES_DOCUMENT } from "@/lib/image-upload";

const MAX_OCTETS = 4 * 1024 * 1024;
type EtatDoc = { id: string; nom: string; etat: "cours" | "ok" | "err"; msg?: string };

interface Resultat {
  reference: string;
  libelle: string;
  montantEstime: number;
  dateCreation: string;
  documentsManquants?: string[];
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
  const [docs, setDocs] = useState<EtatDoc[]>([]);

  function setEtat(id: string, patch: Partial<EtatDoc>) {
    setDocs((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  async function televerser(liste: FileList | null) {
    if (!liste || liste.length === 0) return;
    const entrees = Array.from(liste).map((file, i) => ({ id: `${Date.now()}-${i}`, file }));
    setDocs((p) => [...p, ...entrees.map((e) => ({ id: e.id, nom: e.file.name, etat: "cours" as const }))]);
    for (const { id, file } of entrees) {
      if (!MIMES_DOCUMENT.includes(file.type)) {
        setEtat(id, { etat: "err", msg: t("uploadFormat") });
        continue;
      }
      try {
        const prep = await preparerFichier(file);
        if (prep.blob.size > MAX_OCTETS) {
          setEtat(id, { etat: "err", msg: t("uploadTooBig") });
          continue;
        }
        const res = await fetch("/api/suivi/document", {
          method: "POST",
          headers: {
            "Content-Type": prep.mimeType,
            "X-Reference": reference,
            "X-Email": email,
            "X-Document-Nom": encodeURIComponent(prep.nomFichier),
          },
          body: prep.blob,
        });
        const data = await res.json().catch(() => null);
        setEtat(id, res.ok ? { etat: "ok" } : { etat: "err", msg: data?.error ?? t("uploadFail") });
      } catch {
        setEtat(id, { etat: "err", msg: t("uploadFail") });
      }
    }
  }

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
          <p className="text-xs uppercase tracking-wide text-ink-400">{t("statusLabel")}</p>
          <p className="mt-1 text-2xl font-extrabold text-vol-700">{resultat.libelle}</p>
          <dl className="mt-4 space-y-1 text-sm text-ink-600">
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

          {/* Ajout de documents manquants */}
          <div className="mt-6 border-t border-ink-200 pt-4">
            {resultat.documentsManquants && resultat.documentsManquants.length > 0 && (
              <div className="mb-3 rounded-lg bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-800">{t("missingTitle")}</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-amber-800">
                  {resultat.documentsManquants.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            <h3 className="font-semibold text-ink-800">{t("uploadTitle")}</h3>
            <p className="mt-1 text-sm text-ink-500">{t("uploadHelp")}</p>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-vol-700 hover:bg-vol-100">
              ⬆️ {t("uploadChoose")}
              <input
                type="file"
                multiple
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => televerser(e.target.files)}
              />
            </label>
            {docs.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-ink-700">{d.nom}</span>
                    <span className={d.etat === "ok" ? "text-green-700" : d.etat === "err" ? "text-red-600" : "text-ink-400"}>
                      {d.etat === "ok" ? "✅ " + t("uploadOk") : d.etat === "err" ? "⚠️ " + (d.msg ?? "") : "…"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

const VERSION_CGV = "2026-01-v1";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result);
      resolve(res.includes(",") ? res.split(",")[1]! : res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Funnel() {
  const t = useTranslations("funnel");
  const locale = useLocale();
  const sp = useSearchParams();

  // Pré-remplissage depuis le calculateur.
  const vol = {
    numeroVol: sp.get("numeroVol") ?? "",
    date: sp.get("date") ?? "",
    aeroportDepart: sp.get("aeroportDepart") ?? "",
    aeroportArrivee: sp.get("aeroportArrivee") ?? "",
    motif: sp.get("motif") ?? "RETARD",
    dureeRetardMin: sp.get("dureeRetardMin") ? Number(sp.get("dureeRetardMin")) : undefined,
  };
  const distanceKm = Number(sp.get("distanceKm") ?? "0");
  const intraUe = sp.get("intraUe") === "true";
  const montantEstime = Number(sp.get("montant") ?? "0");

  const [etape, setEtape] = useState(0);
  const [contact, setContact] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    pnr: "",
  });
  const [boarding, setBoarding] = useState<File | null>(null);
  const [mandat, setMandat] = useState({
    consentementRgpd: false,
    accepteCgv: false,
    signatureNom: "",
  });
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const etapes = [
    t("stepEligibility"),
    t("stepContact"),
    t("stepDocuments"),
    t("stepMandate"),
    t("stepDone"),
  ];

  const montantFormate = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(montantEstime);

  function contactValide() {
    return (
      contact.prenom.trim() &&
      contact.nom.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email) &&
      /^[A-Za-z0-9]{6}$/.test(contact.pnr.trim())
    );
  }

  async function soumettre() {
    setErreur(null);
    if (!mandat.consentementRgpd || !mandat.accepteCgv || mandat.signatureNom.trim().length < 2) {
      setErreur(t("required"));
      return;
    }
    setEnvoi(true);
    try {
      const documents = [];
      if (boarding) {
        documents.push({
          type: "CARTE_EMBARQUEMENT" as const,
          nomFichier: boarding.name,
          mimeType: boarding.type || "application/octet-stream",
          contenuBase64: await fileToBase64(boarding),
        });
      }
      const res = await fetch("/api/reclamations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vol,
          distanceKm,
          intraUe,
          montantEstime,
          prenom: contact.prenom,
          nom: contact.nom,
          email: contact.email,
          telephone: contact.telephone,
          adresse: contact.adresse,
          pnr: contact.pnr.toUpperCase(),
          consentementRgpd: true,
          accepteCgv: true,
          signatureNom: mandat.signatureNom,
          versionCgv: VERSION_CGV,
          documents,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur");
      } else {
        setReference(data.reference);
        setEtape(4);
      }
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Indicateur d'étapes */}
      <ol className="mt-4 flex flex-wrap gap-2 text-xs">
        {etapes.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${
              i === etape
                ? "bg-brand-500 text-white"
                : i < etape
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="card mt-6">
        {etape === 0 && (
          <div>
            <p className="text-lg font-semibold">{montantFormate}</p>
            <p className="mt-1 text-sm text-slate-600">
              {vol.numeroVol} · {vol.aeroportDepart} → {vol.aeroportArrivee} · {vol.date}
            </p>
            <p className="mt-2 text-sm text-slate-500">{distanceKm} km</p>
            <button className="btn-primary mt-4" onClick={() => setEtape(1)}>
              {t("next")}
            </button>
          </div>
        )}

        {etape === 1 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t("firstName")}</label>
              <input className="input" value={contact.prenom} onChange={(e) => setContact({ ...contact, prenom: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("lastName")}</label>
              <input className="input" value={contact.nom} onChange={(e) => setContact({ ...contact, nom: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("email")}</label>
              <input type="email" className="input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("phone")}</label>
              <input className="input" value={contact.telephone} onChange={(e) => setContact({ ...contact, telephone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t("address")}</label>
              <input className="input" value={contact.adresse} onChange={(e) => setContact({ ...contact, adresse: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t("pnr")}</label>
              <input className="input uppercase" maxLength={6} value={contact.pnr} onChange={(e) => setContact({ ...contact, pnr: e.target.value })} />
              <p className="mt-1 text-xs text-slate-500">{t("pnrHelp")}</p>
            </div>
            <div className="flex justify-between sm:col-span-2">
              <button className="btn-secondary" onClick={() => setEtape(0)}>{t("back")}</button>
              <button className="btn-primary" disabled={!contactValide()} onClick={() => setEtape(2)}>{t("next")}</button>
            </div>
          </div>
        )}

        {etape === 2 && (
          <div>
            <label className="label">{t("uploadBoarding")}</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="input"
              onChange={(e) => setBoarding(e.target.files?.[0] ?? null)}
            />
            <div className="mt-6 flex justify-between">
              <button className="btn-secondary" onClick={() => setEtape(1)}>{t("back")}</button>
              <button className="btn-primary" onClick={() => setEtape(3)}>{t("next")}</button>
            </div>
          </div>
        )}

        {etape === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700">{t("mandateIntro")}</p>
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">{t("bankNote")}</p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={mandat.consentementRgpd} onChange={(e) => setMandat({ ...mandat, consentementRgpd: e.target.checked })} />
              <span>{t("mandateConsentRgpd")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={mandat.accepteCgv} onChange={(e) => setMandat({ ...mandat, accepteCgv: e.target.checked })} />
              <span>{t("mandateAcceptCgv")}</span>
            </label>
            <div>
              <label className="label">{t("mandateSignLabel")}</label>
              <input className="input" value={mandat.signatureNom} onChange={(e) => setMandat({ ...mandat, signatureNom: e.target.value })} />
            </div>
            {erreur && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setEtape(2)}>{t("back")}</button>
              <button className="btn-primary" disabled={envoi} onClick={soumettre}>
                {envoi ? "…" : t("submit")}
              </button>
            </div>
          </div>
        )}

        {etape === 4 && reference && (
          <div className="text-center">
            <p className="text-4xl">🎉</p>
            <h2 className="mt-2 text-xl font-bold">{t("doneTitle")}</h2>
            <p className="mt-2 text-slate-600">{t("doneText", { reference })}</p>
          </div>
        )}
      </div>
    </div>
  );
}

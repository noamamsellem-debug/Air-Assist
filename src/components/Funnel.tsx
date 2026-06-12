"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { SignaturePad } from "@/components/SignaturePad";

interface Copassager {
  prenom: string;
  nom: string;
  email: string;
  mineur: boolean;
}

const VERSION_CGV = "2026-01-v1";

const LANGUES = ["Français", "English", "Español", "Deutsch", "Italiano", "Português", "Nederlands", "Polski"];

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

const MIMES_OK = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const TAILLE_MAX = 8 * 1024 * 1024;

type Verdict = "ok" | "blurry" | "tooBig" | "type";

/**
 * Contrôle BASIQUE côté navigateur (pas d'OCR) : type, taille et un proxy de
 * netteté/luminosité calculé sur l'image réduite. Honnête sur ses limites.
 */
async function analyserFichier(file: File): Promise<Verdict> {
  if (!MIMES_OK.includes(file.type)) return "type";
  if (file.size > TAILLE_MAX) return "tooBig";
  if (file.type === "application/pdf") return "ok";
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const taille = 64;
    const canvas = document.createElement("canvas");
    canvas.width = taille;
    canvas.height = taille;
    const ctx = canvas.getContext("2d");
    URL.revokeObjectURL(url);
    if (!ctx) return "ok";
    ctx.drawImage(img, 0, 0, taille, taille);
    const { data } = ctx.getImageData(0, 0, taille, taille);
    let somme = 0;
    const lum: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const l = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
      lum.push(l);
      somme += l;
    }
    const moyenne = somme / lum.length;
    const variance = lum.reduce((acc, l) => acc + (l - moyenne) ** 2, 0) / lum.length;
    // Trop sombre / trop clair / quasi uniforme (flou ou cache) → averti.
    if (moyenne < 25 || moyenne > 235 || variance < 120) return "blurry";
    return "ok";
  } catch {
    return "ok";
  }
}

type DocType = "CARTE_EMBARQUEMENT" | "CARTE_IDENTITE";
interface DocEtat {
  file: File | null;
  verdict: Verdict | null;
  verification: boolean;
  confirme: boolean;
}
const docVide = (): DocEtat => ({ file: null, verdict: null, verification: false, confirme: false });

export function Funnel() {
  const t = useTranslations("funnel");
  const locale = useLocale();
  const sp = useSearchParams();

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
  const [dejaContacte, setDejaContacte] = useState<boolean | null>(null);
  const [description, setDescription] = useState("");
  const [extra, setExtra] = useState({ langue: "", billet: "", source: "", cause: "" });
  const [contact, setContact] = useState({ prenom: "", nom: "", email: "", telephone: "", adresse: "", pnr: "" });
  const [docBoarding, setDocBoarding] = useState<DocEtat>(docVide());
  const [docId, setDocId] = useState<DocEtat>(docVide());
  const [mandat, setMandat] = useState({ consentementRgpd: false, accepteCgv: false, signatureNom: "" });
  const [copassagers, setCopassagers] = useState<Copassager[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [resultat, setResultat] = useState<{ reference: string; codeParrainage: string } | null>(null);
  const [copie, setCopie] = useState<"track" | null>(null);

  const TOTAL = 6;
  const montantFormate = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(montantEstime),
    [locale, montantEstime],
  );
  const totalFormate = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(
    montantEstime * (1 + copassagers.length),
  );
  function majCopassager(i: number, patch: Partial<Copassager>) {
    setCopassagers((prev) => prev.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  function contactValide() {
    return (
      contact.prenom.trim() &&
      contact.nom.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email) &&
      /^[A-Za-z0-9]{6}$/.test(contact.pnr.trim())
    );
  }

  async function copier(texte: string, quoi: "track") {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(quoi);
      setTimeout(() => setCopie(null), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  async function soumettre() {
    setErreur(null);
    if (!mandat.consentementRgpd || !mandat.accepteCgv || !signature) {
      setErreur(t("required"));
      return;
    }
    const signatureNom = `${contact.prenom} ${contact.nom}`.trim() || "Signature";
    setEnvoi(true);
    try {
      const documents = [];
      for (const [etat, type] of [
        [docBoarding, "CARTE_EMBARQUEMENT"] as const,
        [docId, "CARTE_IDENTITE"] as const,
      ]) {
        if (etat.file) {
          documents.push({
            type,
            nomFichier: etat.file.name,
            mimeType: etat.file.type || "application/octet-stream",
            contenuBase64: await fileToBase64(etat.file),
          });
        }
      }
      // Signature manuscrite stockée comme justificatif chiffré.
      if (signature.includes(",")) {
        documents.push({
          type: "JUSTIFICATIF" as const,
          nomFichier: "signature.png",
          mimeType: "image/png",
          contenuBase64: signature.split(",")[1]!,
        });
      }
      const copassagersValides = copassagers.filter((p) => p.prenom.trim() && p.nom.trim());
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
          dejaContacteCompagnie: dejaContacte ?? undefined,
          descriptionIncident: description,
          langueCommunication: extra.langue,
          sourceMarketing: extra.source,
          causePerturbation: extra.cause,
          ouAcheteBillet: extra.billet,
          passagersSupplementaires: copassagersValides,
          consentementRgpd: true,
          accepteCgv: true,
          signatureNom,
          versionCgv: VERSION_CGV,
          documents,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur");
      } else {
        setResultat({ reference: data.reference, codeParrainage: data.codeParrainage });
        setEtape(7);
        window.scrollTo({ top: 0 });
      }
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnvoi(false);
    }
  }

  // ── Écran de confirmation ───────────────────────────────────────────────
  if (etape === 7 && resultat) {
    const etapesSuivantes = [
      { icon: "🔎", titre: t("next1Title"), texte: t("next1Text") },
      { icon: "📄", titre: t("next2Title"), texte: t("next2Text") },
      { icon: "💬", titre: t("next3Title"), texte: t("next3Text") },
      { icon: "⚖️", titre: t("next4Title"), texte: t("next4Text") },
      { icon: "💸", titre: t("next5Title"), texte: t("next5Text") },
    ];
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900">{t("doneTitle")}</h1>
        <p className="mt-3 text-slate-600">{t("doneSubtitle", { reference: resultat.reference })}</p>

        <section className="card mt-8">
          <h2 className="text-xl font-bold">{t("nextTitle")}</h2>
          <ul className="mt-4 space-y-5">
            {etapesSuivantes.map((s) => (
              <li key={s.titre} className="flex gap-3">
                <span className="text-xl" aria-hidden>{s.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900">{s.titre}</p>
                  <p className="text-sm text-slate-600">{s.texte}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <p className="text-sm font-medium text-slate-700">{t("trackTitle")}</p>
          <div className="mt-2 flex items-stretch overflow-hidden rounded-lg border border-slate-300">
            <span className="flex-1 truncate px-3 py-2 font-mono text-sm">{resultat.reference}</span>
            <button onClick={() => copier(resultat.reference, "track")} className="bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600">
              {copie === "track" ? t("copied") : t("copy")}
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-slate-400">{t("helpNote")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Barre de progression (étapes de saisie 1→6) */}
      {etape >= 1 && etape <= TOTAL && (
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>{t("progress", { current: etape, total: TOTAL })}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(etape / TOTAL) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="card">
        {/* 0 — Récap éligibilité */}
        {etape === 0 && (
          <div>
            <h1 className="text-xl font-bold">{t("recapTitle")}</h1>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{t("recapAmountLabel")}</p>
            <p className="text-4xl font-extrabold text-green-700">{montantFormate}</p>
            <p className="mt-3 text-sm text-slate-600">
              {vol.numeroVol} · {vol.aeroportDepart} → {vol.aeroportArrivee} · {vol.date}
            </p>
            <p className="mt-1 text-sm text-slate-500">{distanceKm} km</p>
            <button className="btn-primary mt-6 w-full" onClick={() => setEtape(1)}>{t("recapStart")}</button>
          </div>
        )}

        {/* 1 — Déjà contacté la compagnie ? */}
        {etape === 1 && (
          <div>
            <h2 className="text-lg font-bold">{t("contactedTitle")}</h2>
            <div className="mt-4 space-y-3">
              {[
                { v: true, label: t("yes") },
                { v: false, label: t("no") },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setDejaContacte(opt.v)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    dejaContacte === opt.v ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full border ${dejaContacte === opt.v ? "border-4 border-brand-500" : "border-slate-400"}`} />
                  {opt.label}
                </button>
              ))}
            </div>
            <Nav onBack={() => setEtape(0)} onNext={() => setEtape(2)} nextDisabled={dejaContacte === null} t={t} />
          </div>
        )}

        {/* 2 — Description libre */}
        {etape === 2 && (
          <div>
            <h2 className="text-lg font-bold">{t("descTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("descSubtitle")}</p>
            <div className="relative mt-4">
              <textarea
                className="input min-h-[160px] resize-y"
                maxLength={1200}
                placeholder={t("descPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">{description.length}/1200</span>
            </div>
            <Nav onBack={() => setEtape(1)} onNext={() => setEtape(3)} t={t} />
          </div>
        )}

        {/* 3 — Infos complémentaires */}
        {etape === 3 && (
          <div>
            <h2 className="text-lg font-bold">{t("extraTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("extraSubtitle")}</p>
            <div className="mt-4 space-y-4">
              <Select label={t("langLabel")} value={extra.langue} onChange={(v) => setExtra({ ...extra, langue: v })} placeholder={t("choose")}
                options={LANGUES.map((l) => ({ value: l, label: l }))} />
              <Select label={t("ticketLabel")} value={extra.billet} onChange={(v) => setExtra({ ...extra, billet: v })} placeholder={t("choose")}
                options={[
                  { value: "airline", label: t("ticketAirline") },
                  { value: "offline", label: t("ticketOffline") },
                  { value: "online", label: t("ticketOnline") },
                ]} />
              <Select label={t("sourceLabel")} value={extra.source} onChange={(v) => setExtra({ ...extra, source: v })} placeholder={t("choose")}
                options={[
                  { value: "tv", label: t("sourceTv") },
                  { value: "social", label: t("sourceSocial") },
                  { value: "friend", label: t("sourceFriend") },
                  { value: "search", label: t("sourceSearch") },
                  { value: "other", label: t("sourceOther") },
                ]} />
              <Select label={t("causeLabel")} value={extra.cause} onChange={(v) => setExtra({ ...extra, cause: v })} placeholder={t("choose")}
                options={[
                  { value: "unknown", label: t("causeUnknown") },
                  { value: "technical", label: t("causeTechnical") },
                  { value: "weather", label: t("causeWeather") },
                  { value: "otherFlights", label: t("causeOtherFlights") },
                  { value: "airport", label: t("causeAirport") },
                  { value: "strike", label: t("causeStrike") },
                  { value: "none", label: t("causeNone") },
                  { value: "force", label: t("causeForce") },
                ]} />
            </div>
            <Nav onBack={() => setEtape(2)} onNext={() => setEtape(4)} t={t} />
          </div>
        )}

        {/* 4 — Coordonnées */}
        {etape === 4 && (
          <div>
            <h2 className="text-lg font-bold">{t("contactTitle")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <details className="group mt-2 rounded-lg bg-slate-50 p-3">
                  <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-700 marker:content-none">
                    <span aria-hidden>❓</span> {t("pnrHelpTitle")}
                  </summary>
                  <p className="mt-2 text-xs text-slate-600">{t("pnrHelpLong")}</p>
                </details>
              </div>
            </div>

            {/* Co-passagers */}
            <div className="mt-6">
              <h3 className="font-semibold text-slate-800">{t("coTitle")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("coIntro")}</p>
              <div className="mt-3 space-y-4">
                {copassagers.map((p, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("coPassenger", { n: i + 2 })}</span>
                      <button
                        type="button"
                        onClick={() => setCopassagers(copassagers.filter((_, j) => j !== i))}
                        className="text-xs text-red-600 hover:underline"
                      >
                        {t("coRemove")}
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input className="input" placeholder={t("firstName")} value={p.prenom} onChange={(e) => majCopassager(i, { prenom: e.target.value })} />
                      <input className="input" placeholder={t("lastName")} value={p.nom} onChange={(e) => majCopassager(i, { nom: e.target.value })} />
                      <input type="email" className="input sm:col-span-2" placeholder={t("email")} value={p.email} onChange={(e) => majCopassager(i, { email: e.target.value })} />
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" checked={p.mineur} onChange={(e) => majCopassager(i, { mineur: e.target.checked })} />
                      {t("coMinor")}
                    </label>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCopassagers([...copassagers, { prenom: "", nom: "", email: "", mineur: false }])}
                className="mt-3 w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                + {t("coAdd")}
              </button>
            </div>

            {/* Indemnisation totale */}
            {montantEstime > 0 && (
              <div className="mt-4 rounded-xl bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t("totalLabel")}</span>
                  <span className="text-2xl font-extrabold text-green-700">{totalFormate}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{t("perPassenger")}</span>
                  <span>
                    {montantFormate} × {1 + copassagers.length}
                  </span>
                </div>
              </div>
            )}

            <Nav onBack={() => setEtape(3)} onNext={() => setEtape(5)} nextDisabled={!contactValide()} t={t} />
          </div>
        )}

        {/* 5 — Documents */}
        {etape === 5 && (
          <div>
            <h2 className="text-lg font-bold">{t("docsTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("docsSubtitle")}</p>
            <div className="mt-4 space-y-4">
              <DocSlot titre={t("docBoarding")} etat={docBoarding} setEtat={setDocBoarding} t={t} requis />
              <DocSlot titre={t("docId")} etat={docId} setEtat={setDocId} t={t} requis />
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-800">
              <span aria-hidden>🔒</span>
              <span>{t("docPrivacy")}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{t("docNote")}</p>
            <Nav
              onBack={() => setEtape(4)}
              onNext={() => setEtape(6)}
              nextDisabled={!(docBoarding.confirme && docId.confirme)}
              t={t}
            />
          </div>
        )}

        {/* 6 — Mandat & signature */}
        {etape === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{t("mandateTitle")}</h2>
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
              <label className="label">{t("signatureLabel")}</label>
              <SignaturePad onChange={setSignature} clearLabel={t("signatureClear")} />
            </div>
            {erreur && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setEtape(5)}>{t("back")}</button>
              <button className="btn-primary" disabled={envoi} onClick={soumettre}>{envoi ? "…" : t("submit")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  nextDisabled,
  t,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mt-6 flex justify-between">
      <button className="btn-secondary" onClick={onBack}>{t("back")}</button>
      <button className="btn-primary" disabled={nextDisabled} onClick={onNext}>{t("next")}</button>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function DocSlot({
  titre,
  etat,
  setEtat,
  t,
  requis,
}: {
  titre: string;
  etat: DocEtat;
  setEtat: (e: DocEtat) => void;
  t: ReturnType<typeof useTranslations>;
  requis?: boolean;
}) {
  async function onFichier(file: File | null) {
    if (!file) return;
    setEtat({ file, verdict: null, verification: true, confirme: false });
    const verdict = await analyserFichier(file);
    setEtat({ file, verdict, verification: false, confirme: verdict === "ok" });
  }

  const messageVerdict =
    etat.verdict === "blurry" ? t("docCheckBlurry") : etat.verdict === "tooBig" ? t("docCheckTooBig") : etat.verdict === "type" ? t("docCheckType") : null;
  const bloquant = etat.verdict === "tooBig" || etat.verdict === "type";

  return (
    <div className="rounded-lg border border-slate-300 p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-800">{titre}</span>
        {etat.confirme ? (
          <span className="text-sm font-semibold text-green-600">✓ {t("docAdded")}</span>
        ) : requis ? (
          <span className="text-xs font-semibold text-amber-600">{t("docRequired")}</span>
        ) : (
          <span className="text-xs text-slate-400">{t("docOptional")}</span>
        )}
      </div>

      {!etat.file && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-300 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
            ⬆️ {t("docUpload")}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFichier(e.target.files?.[0] ?? null)} />
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-300 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
            📷 {t("docTakePhoto")}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFichier(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      )}

      {etat.file && (
        <div className="mt-3">
          {etat.verification ? (
            <p className="text-sm text-slate-500">⏳ {t("docCheckLoading")}</p>
          ) : (
            <>
              <p className="truncate text-sm text-slate-600">📎 {etat.file.name}</p>
              {messageVerdict && (
                <p className={`mt-2 rounded p-2 text-xs ${bloquant ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>{messageVerdict}</p>
              )}
              <div className="mt-2 flex gap-2">
                {!bloquant && !etat.confirme && (
                  <button type="button" className="rounded bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600" onClick={() => setEtat({ ...etat, confirme: true })}>
                    {t("docConfirm")}
                  </button>
                )}
                <button type="button" className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50" onClick={() => setEtat(docVide())}>
                  {t("docRetake")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

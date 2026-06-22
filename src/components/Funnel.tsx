"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { AddressAutocomplete, adresseVide, type AddressValue } from "@/components/AddressAutocomplete";
import { DocIllustration } from "@/components/DocIllustration";
import { depotSchema } from "@/lib/validation";
import { repartirEuros, TAUX_COMMISSION_DEFAUT } from "@/domain/commission";

const VERSION_CGV = "2026-01-v1";
const MIMES_OK = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 8 * 1024 * 1024;

type Tt = ReturnType<typeof useTranslations>;
type SousId = "CNI" | "PASSEPORT" | "PERMIS_CONDUIRE" | "CARTE_SEJOUR";
type SousVoyage = "CARTE_EMBARQUEMENT" | "CONFIRMATION_RESERVATION";

interface Segment {
  numeroVol: string;
  compagnie: string;
  date: string;
  aeroportDepart: string;
  aeroportArrivee: string;
}
interface DocFichier {
  file: File | null;
  erreur: string | null;
}
const docVide = (): DocFichier => ({ file: null, erreur: null });

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result);
      resolve(s.includes(",") ? s.split(",")[1]! : s);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const LEGENDES_ID: Record<SousId, string> = {
  CNI: "legendCni",
  PASSEPORT: "legendPasseport",
  PERMIS_CONDUIRE: "legendPermis",
  CARTE_SEJOUR: "legendSejour",
};
const LABELS_ID: Record<SousId, string> = {
  CNI: "subCni",
  PASSEPORT: "subPasseport",
  PERMIS_CONDUIRE: "subPermis",
  CARTE_SEJOUR: "subSejour",
};

export function Funnel() {
  const t = useTranslations("depot");
  const locale = useLocale();
  const sp = useSearchParams();

  const montantEstime = Number(sp.get("montant") ?? "0");
  const distanceKm = Number(sp.get("distanceKm") ?? "0");
  const intraUe = sp.get("intraUe") === "true";

  const [etape, setEtape] = useState(0);
  const TOTAL = 6;

  // Trajet
  const [typeTrajet, setTypeTrajet] = useState<"DIRECT" | "CORRESPONDANCE">("DIRECT");
  const [reservationUnique, setReservationUnique] = useState<boolean | null>(null);
  const [pnr, setPnr] = useState("");
  const [motif, setMotif] = useState(sp.get("motif") ?? "RETARD");
  const [causePerturbation, setCausePerturbation] = useState("");
  const [segments, setSegments] = useState<Segment[]>([
    {
      numeroVol: sp.get("numeroVol") ?? "",
      compagnie: "",
      date: sp.get("date") ?? "",
      aeroportDepart: sp.get("aeroportDepart") ?? "",
      aeroportArrivee: sp.get("aeroportArrivee") ?? "",
    },
  ]);

  // Identité
  const [civilite, setCivilite] = useState<"M" | "Mme" | "Autre" | "">("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [adresse, setAdresse] = useState<AddressValue>(adresseVide);

  // Coordonnées
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nbPassagers, setNbPassagers] = useState(1);
  const [coPassagers, setCoPassagers] = useState<{ prenom: string; nom: string; email: string; mineur: boolean }[]>([]);

  // Documents
  const [pieceSousType, setPieceSousType] = useState<SousId>("CNI");
  const [pieceDoc, setPieceDoc] = useState<DocFichier>(docVide());
  const [voyages, setVoyages] = useState<{ sousType: SousVoyage; doc: DocFichier }[]>([
    { sousType: "CARTE_EMBARQUEMENT", doc: docVide() },
  ]);
  const [retardDoc, setRetardDoc] = useState<DocFichier>(docVide());
  const [fraisDocs, setFraisDocs] = useState<DocFichier[]>([]);

  // Mandat
  const [nomSignature, setNomSignature] = useState("");
  const [consentRgpd, setConsentRgpd] = useState(false);
  const [accepteCgv, setAccepteCgv] = useState(false);

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const fmtEur = useMemo(
    () => (m: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(m),
    [locale],
  );
  const montantFmt = fmtEur(montantEstime);
  // Estimation de la répartition « no win, no fee » : 30 % commission / 70 % client.
  const repartition = useMemo(() => repartirEuros(montantEstime), [montantEstime]);

  function majSegment(i: number, patch: Partial<Segment>) {
    setSegments((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }
  function validerFichier(f: File | null): string | null {
    if (!f) return null;
    if (!MIMES_OK.includes(f.type)) return t("formatError");
    if (f.size > TAILLE_MAX) return t("sizeError");
    return null;
  }

  // ── Construit le payload de dépôt (pour validation + envoi) ────────────────
  function construirePayload() {
    return {
      montantEstime,
      distanceKm,
      intraUe,
      typeTrajet,
      reservationUnique,
      pnr: pnr.toUpperCase(),
      motif,
      causePerturbation,
      segments: segments.map((s, i) => ({
        ordre: i + 1,
        numeroVol: s.numeroVol,
        compagnie: s.compagnie,
        date: s.date,
        aeroportDepart: s.aeroportDepart,
        aeroportArrivee: s.aeroportArrivee,
      })),
      passager: {
        civilite,
        nom,
        prenom,
        dateNaissance,
        nationalite,
        adresse: {
          ligne1: adresse.ligne1,
          complement: adresse.complement,
          codePostal: adresse.codePostal,
          ville: adresse.ville,
          pays: adresse.pays,
        },
      },
      email,
      telephone,
      nbPassagers,
      // On ne transmet que les co-passagers réellement renseignés (prénom + nom).
      passagersSupplementaires: coPassagers
        .filter((p) => p.prenom.trim() && p.nom.trim())
        .map((p) => ({ prenom: p.prenom, nom: p.nom, email: p.email, mineur: p.mineur })),
      pieceIdentite: pieceDoc.file
        ? { sousType: pieceSousType, nomFichier: pieceDoc.file.name, mimeType: pieceDoc.file.type, contenuBase64: "x" }
        : undefined,
      justificatifsVoyage: voyages
        .filter((v) => v.doc.file)
        .map((v) => ({ sousType: v.sousType, nomFichier: v.doc.file!.name, mimeType: v.doc.file!.type, contenuBase64: "x" })),
      justificatifsFrais: fraisDocs
        .filter((d) => d.file)
        .map((d) => ({ nomFichier: d.file!.name, mimeType: d.file!.type, contenuBase64: "x" })),
      nomSignature,
      consentementRgpd: consentRgpd,
      accepteCgv,
      versionCgv: VERSION_CGV,
    };
  }

  const validation = depotSchema.safeParse(construirePayload());

  async function soumettre() {
    setErreur(null);
    setEnvoi(true);
    try {
      const pieceB64 = pieceDoc.file ? await fileToBase64(pieceDoc.file) : "";
      const voyagesB64 = await Promise.all(
        voyages.filter((v) => v.doc.file).map(async (v) => ({
          sousType: v.sousType,
          nomFichier: v.doc.file!.name,
          mimeType: v.doc.file!.type,
          contenuBase64: await fileToBase64(v.doc.file!),
        })),
      );
      const fraisB64 = await Promise.all(
        fraisDocs.filter((d) => d.file).map(async (d) => ({
          nomFichier: d.file!.name,
          mimeType: d.file!.type,
          contenuBase64: await fileToBase64(d.file!),
        })),
      );
      const payload = {
        ...construirePayload(),
        pieceIdentite: { sousType: pieceSousType, nomFichier: pieceDoc.file!.name, mimeType: pieceDoc.file!.type, contenuBase64: pieceB64 },
        justificatifsVoyage: voyagesB64,
        justificatifsFrais: fraisB64,
        justificatifRetard: retardDoc.file
          ? { nomFichier: retardDoc.file.name, mimeType: retardDoc.file.type, contenuBase64: await fileToBase64(retardDoc.file) }
          : undefined,
      };
      const res = await fetch("/api/depot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) setErreur(data.error ?? t("networkError"));
      else {
        setReference(data.reference);
        setEtape(7);
        window.scrollTo({ top: 0 });
      }
    } catch {
      setErreur(t("networkError"));
    } finally {
      setEnvoi(false);
    }
  }

  // ── Confirmation ───────────────────────────────────────────────────────────
  if (etape === 7 && reference) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{t("confirmTitle")}</h1>
        <p className="mt-3 text-slate-600">{t("confirmText", { reference })}</p>
        <Link href="/suivi" className="btn-primary mt-6 inline-flex">{t("trackLink")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {etape >= 1 && etape <= TOTAL && (
        <div className="mb-6">
          <p className="mb-1 text-xs text-slate-500">{t("progress", { current: etape, total: TOTAL })}</p>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(etape / TOTAL) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="card">
        {etape === 0 && (
          <div>
            <h1 className="text-xl font-bold">{t("recapTitle")}</h1>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{t("recapAmount")}</p>
            <p className="text-4xl font-extrabold text-green-700">{montantFmt}</p>
            <p className="mt-2 text-sm text-slate-500">{distanceKm} km</p>
            <button className="btn-primary mt-6 w-full" onClick={() => setEtape(1)}>{t("recapStart")}</button>
          </div>
        )}

        {etape === 1 && (
          <EtapeTrajet
            t={t} typeTrajet={typeTrajet} setTypeTrajet={setTypeTrajet}
            reservationUnique={reservationUnique} setReservationUnique={setReservationUnique}
            pnr={pnr} setPnr={setPnr} motif={motif} setMotif={setMotif}
            causePerturbation={causePerturbation} setCausePerturbation={setCausePerturbation}
            segments={segments} setSegments={setSegments} majSegment={majSegment}
            onNext={() => setEtape(2)}
          />
        )}

        {etape === 2 && (
          <div>
            <h2 className="text-lg font-bold">{t("identiteTitle")}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">{t("civilite")}</label>
                <div className="flex gap-2">
                  {(["M", "Mme", "Autre"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => setCivilite(c)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${civilite === c ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300"}`}>
                      {t(c === "M" ? "civiliteM" : c === "Mme" ? "civiliteMme" : "civiliteAutre")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className="label">{t("prenom")}</label><input className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} /></div>
                <div><label className="label">{t("nom")}</label><input className="input" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
                <div><label className="label">{t("dateNaissance")}</label><input type="date" className="input" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} /></div>
                <div><label className="label">{t("nationalite")}</label><input className="input" value={nationalite} onChange={(e) => setNationalite(e.target.value)} /></div>
              </div>
              <div>
                <h3 className="label">{t("adresseTitle")}</h3>
                <AddressAutocomplete value={adresse} onChange={setAdresse} />
              </div>
            </div>
            <Nav t={t} onBack={() => setEtape(1)} onNext={() => setEtape(3)}
              nextDisabled={!(civilite && prenom.trim() && nom.trim() && dateNaissance && nationalite.trim() && adresse.ligne1 && adresse.codePostal && adresse.ville && adresse.pays)} />
          </div>
        )}

        {etape === 3 && (
          <div>
            <h2 className="text-lg font-bold">{t("coordonneesTitle")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="label">{t("email")}</label><input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><label className="label">{t("telephone")}</label><input className="input" value={telephone} onChange={(e) => setTelephone(e.target.value)} /></div>
            </div>

            {/* Nombre de passagers (obligatoire) */}
            <div className="mt-4">
              <label className="label" htmlFor="nbpax">{t("nbPassengers")}</label>
              <select
                id="nbpax"
                className="input sm:w-40"
                value={nbPassagers}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setNbPassagers(n);
                  // On tronque les co-passagers si on réduit le nombre total.
                  setCoPassagers((prev) => prev.slice(0, Math.max(0, n - 1)));
                }}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">{t("nbPassengersHelp")}</p>
            </div>

            {/* Co-passagers répétables (facultatif), plafonnés à nbPassagers − 1 */}
            {nbPassagers > 1 && (
              <section className="mt-4">
                <h3 className="font-semibold text-slate-800">{t("coPassengersTitle")}</h3>
                <div className="mt-3 space-y-3">
                  {coPassagers.map((p, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input className="input" placeholder={t("prenom")} value={p.prenom}
                          onChange={(e) => setCoPassagers((prev) => prev.map((x, j) => (j === i ? { ...x, prenom: e.target.value } : x)))} />
                        <input className="input" placeholder={t("nom")} value={p.nom}
                          onChange={(e) => setCoPassagers((prev) => prev.map((x, j) => (j === i ? { ...x, nom: e.target.value } : x)))} />
                        <input className="input sm:col-span-2" type="email" placeholder={t("email")} value={p.email}
                          onChange={(e) => setCoPassagers((prev) => prev.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" checked={p.mineur}
                            onChange={(e) => setCoPassagers((prev) => prev.map((x, j) => (j === i ? { ...x, mineur: e.target.checked } : x)))} />
                          {t("coMineur")}
                        </label>
                        <button type="button" className="text-xs text-red-600 hover:underline"
                          onClick={() => setCoPassagers((prev) => prev.filter((_, j) => j !== i))}>
                          {t("removeSegment")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {coPassagers.length < nbPassagers - 1 && (
                  <button type="button" className="mt-3 w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    onClick={() => setCoPassagers((prev) => [...prev, { prenom: "", nom: "", email: "", mineur: false }])}>
                    + {t("coAdd")}
                  </button>
                )}
              </section>
            )}

            <Nav t={t} onBack={() => setEtape(2)} onNext={() => setEtape(4)}
              nextDisabled={
                !(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && telephone.trim().length >= 5) ||
                coPassagers.some((p) => !(p.prenom.trim() && p.nom.trim()))
              } />
          </div>
        )}

        {etape === 4 && (
          <div>
            <h2 className="text-lg font-bold">{t("documentsTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("documentsIntro")}</p>

            {/* Groupe 1 : pièce d'identité */}
            <section className="mt-5">
              <h3 className="font-semibold text-slate-800">{t("idGroupTitle")}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(LABELS_ID) as SousId[]).map((s) => (
                  <button key={s} type="button" onClick={() => setPieceSousType(s)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${pieceSousType === s ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300"}`}>
                    {t(LABELS_ID[s])}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <DocIllustration variante="identite" />
                <p className="text-sm text-slate-600">{t(LEGENDES_ID[pieceSousType])}</p>
              </div>
              <FileField t={t} doc={pieceDoc} onPick={(file) => setPieceDoc({ file, erreur: validerFichier(file) })} />
            </section>

            {/* Groupe 2 : justificatif de voyage */}
            <section className="mt-6">
              <h3 className="font-semibold text-slate-800">{t("voyageGroupTitle")}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <DocIllustration variante="voyage" />
                <p className="text-sm text-slate-600">{t("legendCarteEmb")}</p>
              </div>
              <div className="mt-3 space-y-4">
                {voyages.map((v, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-2">
                        {(["CARTE_EMBARQUEMENT", "CONFIRMATION_RESERVATION"] as SousVoyage[]).map((s) => (
                          <button key={s} type="button"
                            onClick={() => setVoyages((prev) => prev.map((x, j) => (j === i ? { ...x, sousType: s } : x)))}
                            className={`rounded-lg border px-3 py-1.5 text-xs ${v.sousType === s ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300"}`}>
                            {t(s === "CARTE_EMBARQUEMENT" ? "subCarteEmb" : "subConfResa")}
                          </button>
                        ))}
                      </div>
                      {voyages.length > 1 && (
                        <button type="button" className="text-xs text-red-600 hover:underline"
                          onClick={() => setVoyages((prev) => prev.filter((_, j) => j !== i))}>
                          {t("removeSegment")}
                        </button>
                      )}
                    </div>
                    <FileField t={t} doc={v.doc}
                      onPick={(file) => setVoyages((prev) => prev.map((x, j) => (j === i ? { ...x, doc: { file, erreur: validerFichier(file) } } : x)))} />
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                onClick={() => setVoyages((prev) => [...prev, { sousType: "CARTE_EMBARQUEMENT", doc: docVide() }])}>
                + {t("addAnother")}
              </button>
            </section>

            {/* Justificatif de retard (optionnel) */}
            <section className="mt-6">
              <h3 className="font-semibold text-slate-800">{t("retardTitle")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("retardHelp")}</p>
              <FileField t={t} doc={retardDoc} onPick={(file) => setRetardDoc({ file, erreur: validerFichier(file) })} />
            </section>

            {/* Justificatifs de frais (optionnel, répétable) → AUTRE / JUSTIFICATIF_FRAIS */}
            <section className="mt-6">
              <h3 className="font-semibold text-slate-800">{t("fraisTitle")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("fraisHelp")}</p>
              <div className="mt-3 space-y-3">
                {fraisDocs.map((d, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">#{i + 1}</span>
                      <button type="button" className="text-xs text-red-600 hover:underline"
                        onClick={() => setFraisDocs((prev) => prev.filter((_, j) => j !== i))}>
                        {t("removeSegment")}
                      </button>
                    </div>
                    <FileField t={t} doc={d}
                      onPick={(file) => setFraisDocs((prev) => prev.map((x, j) => (j === i ? { file, erreur: validerFichier(file) } : x)))} />
                  </div>
                ))}
              </div>
              {fraisDocs.length < 8 && (
                <button type="button" className="mt-3 w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                  onClick={() => setFraisDocs((prev) => [...prev, docVide()])}>
                  + {t("fraisAdd")}
                </button>
              )}
            </section>

            <Nav t={t} onBack={() => setEtape(3)} onNext={() => setEtape(5)}
              nextDisabled={
                !pieceDoc.file || !!pieceDoc.erreur ||
                voyages.filter((v) => v.doc.file && !v.doc.erreur).length < 1 ||
                fraisDocs.some((d) => !!d.erreur)
              } />
          </div>
        )}

        {etape === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{t("mandatTitle")}</h2>
            <p className="text-sm text-slate-700">{t("mandatIntro")}</p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={consentRgpd} onChange={(e) => setConsentRgpd(e.target.checked)} />
              <span>{t("consentRgpd")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={accepteCgv} onChange={(e) => setAccepteCgv(e.target.checked)} />
              <span>{t("accepteCgv")}</span>
            </label>
            <div>
              <label className="label" htmlFor="sign">{t("signLabel")}</label>
              <input
                id="sign"
                className="input font-[cursive] text-lg"
                placeholder={`${prenom} ${nom}`.trim()}
                value={nomSignature}
                onChange={(e) => setNomSignature(e.target.value)}
              />
            </div>
            <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{t("ipNote")}</p>
            <Nav t={t} onBack={() => setEtape(4)} onNext={() => setEtape(6)} nextDisabled={!(consentRgpd && accepteCgv && nomSignature.trim().length >= 1)} />
          </div>
        )}

        {etape === 6 && (
          <EtapeRecap
            t={t} montantFmt={montantFmt}
            commissionFmt={fmtEur(repartition.commission)} partClientFmt={fmtEur(repartition.partClient)}
            valide={validation.success}
            manquants={validation.success ? [] : Object.keys(validation.error.flatten().fieldErrors)}
            data={{ civilite, prenom, nom, dateNaissance, nationalite, adresse, email, telephone, pnr, motif, typeTrajet, segments,
              nbPassagers,
              nbDocs: 1 + voyages.filter((v) => v.doc.file).length + (retardDoc.file ? 1 : 0) }}
            onModifier={setEtape} onSubmit={soumettre} envoi={envoi} erreur={erreur}
          />
        )}
      </div>
    </div>
  );
}

function Nav({ t, onBack, onNext, nextDisabled }: { t: Tt; onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="mt-6 flex justify-between">
      <button className="btn-secondary" onClick={onBack}>{t("back")}</button>
      <button className="btn-primary" disabled={nextDisabled} onClick={onNext}>{t("next")}</button>
    </div>
  );
}

function FileField({ t, doc, onPick }: { t: Tt; doc: DocFichier; onPick: (f: File | null) => void }) {
  return (
    <div className="mt-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand-300 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
        ⬆️ {doc.file ? `${t("chosen")} : ${doc.file.name}` : t("upload")}
        <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
      </label>
      {doc.erreur && <p className="mt-1 text-xs text-red-600">{doc.erreur}</p>}
    </div>
  );
}

function EtapeTrajet(props: {
  t: Tt;
  typeTrajet: "DIRECT" | "CORRESPONDANCE";
  setTypeTrajet: (v: "DIRECT" | "CORRESPONDANCE") => void;
  reservationUnique: boolean | null;
  setReservationUnique: (v: boolean) => void;
  pnr: string; setPnr: (v: string) => void;
  motif: string; setMotif: (v: string) => void;
  causePerturbation: string; setCausePerturbation: (v: string) => void;
  segments: Segment[]; setSegments: (s: Segment[]) => void;
  majSegment: (i: number, patch: Partial<Segment>) => void;
  onNext: () => void;
}) {
  const { t, typeTrajet, setTypeTrajet, reservationUnique, setReservationUnique, pnr, setPnr, motif, setMotif, causePerturbation, setCausePerturbation, segments, setSegments, majSegment, onNext } = props;
  const pnrOk = /^[A-Za-z0-9]{6}$/.test(pnr.trim());
  const segmentsOk = segments.every((s) => s.numeroVol.trim() && s.date && s.aeroportDepart && s.aeroportArrivee);
  const correspondanceOk = typeTrajet === "DIRECT" || (segments.length >= 2 && typeof reservationUnique === "boolean");

  return (
    <div>
      <h2 className="text-lg font-bold">{t("trajetTitle")}</h2>
      <div className="mt-4 flex gap-2">
        {(["DIRECT", "CORRESPONDANCE"] as const).map((tt) => (
          <button key={tt} type="button"
            onClick={() => { setTypeTrajet(tt); if (tt === "CORRESPONDANCE" && segments.length < 2) setSegments([...segments, { numeroVol: "", compagnie: "", date: segments[0]?.date ?? "", aeroportDepart: "", aeroportArrivee: "" }]); }}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm ${typeTrajet === tt ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300"}`}>
            {t(tt === "DIRECT" ? "typeDirect" : "typeCorrespondance")}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {segments.map((s, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("segment", { n: i + 1 })}</span>
              {segments.length > 1 && (
                <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => setSegments(segments.filter((_, j) => j !== i))}>
                  {t("removeSegment")}
                </button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><label className="label">{t("segFlightNumber")}</label><input className="input uppercase" value={s.numeroVol} onChange={(e) => majSegment(i, { numeroVol: e.target.value })} /></div>
              <div><label className="label">{t("segAirline")}</label><input className="input" value={s.compagnie} onChange={(e) => majSegment(i, { compagnie: e.target.value })} /></div>
              <div><label className="label">{t("segDate")}</label><input type="date" className="input" value={s.date} onChange={(e) => majSegment(i, { date: e.target.value })} /></div>
              <div />
              <div><label className="label">{t("segFrom")}</label><AirportAutocomplete value={s.aeroportDepart} onChange={(iata) => majSegment(i, { aeroportDepart: iata })} /></div>
              <div><label className="label">{t("segTo")}</label><AirportAutocomplete value={s.aeroportArrivee} onChange={(iata) => majSegment(i, { aeroportArrivee: iata })} /></div>
            </div>
          </div>
        ))}
        {typeTrajet === "CORRESPONDANCE" && (
          <button type="button" className="w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            onClick={() => setSegments([...segments, { numeroVol: "", compagnie: "", date: "", aeroportDepart: "", aeroportArrivee: "" }])}>
            + {t("addSegment")}
          </button>
        )}
      </div>

      {typeTrajet === "CORRESPONDANCE" && (
        <div className="mt-4">
          <label className="label">{t("reservationUniqueQ")}</label>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button key={String(v)} type="button" onClick={() => setReservationUnique(v)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${reservationUnique === v ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-300"}`}>
                {t(v ? "yes" : "no")}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t("pnrLabel")}</label>
          <input className="input uppercase" maxLength={6} value={pnr} onChange={(e) => setPnr(e.target.value)} />
          <p className="mt-1 text-xs text-slate-500">{t("pnrHelp")}</p>
        </div>
        <div>
          <label className="label">{t("motifLabel")}</label>
          <select className="input" value={motif} onChange={(e) => setMotif(e.target.value)}>
            <option value="RETARD">{t("motifRetard")}</option>
            <option value="ANNULATION">{t("motifAnnulation")}</option>
            <option value="SURBOOKING">{t("motifSurbooking")}</option>
            <option value="CORRESPONDANCE_MANQUEE">{t("motifCorrespondance")}</option>
          </select>
        </div>
      </div>

      {/* Motif invoqué par la compagnie — facultatif. */}
      <div className="mt-4">
        <label className="label">{t("causeLabel")}</label>
        <select className="input" value={causePerturbation} onChange={(e) => setCausePerturbation(e.target.value)}>
          <option value="">{t("causeChoose")}</option>
          <option value="technique">{t("causeTechnical")}</option>
          <option value="meteo">{t("causeWeather")}</option>
          <option value="greve">{t("causeStrike")}</option>
          <option value="aeroport">{t("causeAirport")}</option>
          <option value="autres_vols">{t("causeOtherFlights")}</option>
          <option value="force_majeure">{t("causeForce")}</option>
          <option value="inconnu">{t("causeUnknown")}</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={!(pnrOk && segmentsOk && correspondanceOk)} onClick={onNext}>{t("next")}</button>
      </div>
    </div>
  );
}

function EtapeRecap(props: {
  t: Tt; montantFmt: string; commissionFmt: string; partClientFmt: string; valide: boolean; manquants: string[];
  data: { civilite: string; prenom: string; nom: string; dateNaissance: string; nationalite: string; adresse: AddressValue; email: string; telephone: string; pnr: string; motif: string; typeTrajet: string; segments: Segment[]; nbPassagers: number; nbDocs: number };
  onModifier: (etape: number) => void; onSubmit: () => void; envoi: boolean; erreur: string | null;
}) {
  const { t, montantFmt, commissionFmt, partClientFmt, valide, manquants, data, onModifier, onSubmit, envoi, erreur } = props;
  const pctCommission = Math.round(TAUX_COMMISSION_DEFAUT * 100);
  return (
    <div>
      <h2 className="text-lg font-bold">{t("recapPageTitle")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("recapPageIntro")}</p>

      <div className="mt-4 space-y-3">
        <Section t={t} titre={t("secPassager")} onModifier={() => onModifier(2)}>
          {data.civilite} {data.prenom} {data.nom} · {data.dateNaissance} · {data.nationalite}<br />
          {data.email} · {data.telephone}<br />
          {t("nbPassengers")} : {data.nbPassagers}
        </Section>
        <Section t={t} titre={t("secAdresse")} onModifier={() => onModifier(2)}>
          {[data.adresse.ligne1, data.adresse.complement, data.adresse.codePostal, data.adresse.ville, data.adresse.pays].filter(Boolean).join(", ")}
        </Section>
        <Section t={t} titre={t("secVol")} onModifier={() => onModifier(1)}>
          {t(data.typeTrajet === "DIRECT" ? "typeDirect" : "typeCorrespondance")} · PNR {data.pnr.toUpperCase()}<br />
          {data.segments.map((s, i) => (<span key={i}>{s.numeroVol} {s.aeroportDepart}→{s.aeroportArrivee} ({s.date})<br /></span>))}
          <span className="text-slate-500">{montantFmt}</span>
        </Section>
        <Section t={t} titre={t("secDocs")} onModifier={() => onModifier(4)}>
          {data.nbDocs}
        </Section>
      </div>

      {/* Répartition « no win, no fee » : estimation indicative sur le montant estimé. */}
      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{t("recapEstimate")}</span>
          <span className="font-semibold text-slate-900">{montantFmt}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-600">{t("recapCommission", { pct: pctCommission })}</span>
          <span className="font-medium text-slate-700">− {commissionFmt}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-brand-100 pt-2">
          <span className="font-semibold text-slate-800">{t("recapYourShare", { pct: 100 - pctCommission })}</span>
          <span className="text-lg font-extrabold text-green-700">{partClientFmt}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">{t("recapCommissionNote")}</p>
      </div>

      {!valide && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">{t("missingTitle")}</p>
          <ul className="mt-1 list-disc pl-5">
            {manquants.map((m) => (<li key={m}>{m}</li>))}
          </ul>
        </div>
      )}
      {erreur && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}

      <button className="btn-primary mt-6 w-full" disabled={!valide || envoi} onClick={onSubmit}>
        {envoi ? "…" : t("submitFinal")}
      </button>
    </div>
  );
}

function Section({ t, titre, onModifier, children }: { t: Tt; titre: string; onModifier: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{titre}</h3>
        <button type="button" className="text-xs font-medium text-brand-600 hover:underline" onClick={onModifier}>{t("modify")}</button>
      </div>
      <p className="mt-1 text-sm text-slate-600">{children}</p>
    </div>
  );
}

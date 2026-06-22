"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { AirlineAutocomplete } from "@/components/AirlineAutocomplete";
import { NationaliteAutocomplete } from "@/components/NationaliteAutocomplete";
import { getCompagnieParCode } from "@/data/compagnies-search";
import { AddressAutocomplete, adresseVide, type AddressValue } from "@/components/AddressAutocomplete";
import { DocIllustration } from "@/components/DocIllustration";
import { depotSchema } from "@/lib/validation";
import { repartirEuros, TAUX_COMMISSION_DEFAUT } from "@/domain/commission";
import { trajetEntreAeroports } from "@/domain/distance";
import { evaluerEligibilite } from "@/domain/eligibilite";
import type { MotifVol as MotifEligibilite } from "@prisma/client";

const VERSION_CGV = "2026-01-v1";
const MIMES_OK = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 8 * 1024 * 1024;

// Durée du retard à l'arrivée en 4 paliers → minutes pour le moteur d'éligibilité.
type RetardChoix = "MOINS3" | "DE3A4" | "PLUS4" | "JAMAIS";
const RETARD_VERS_MIN: Record<RetardChoix, number> = {
  MOINS3: 60,
  DE3A4: 210,
  PLUS4: 300,
  JAMAIS: 600,
};
const RETARD_LABELS: Record<RetardChoix, string> = {
  MOINS3: "delayUnder3",
  DE3A4: "delay3to4",
  PLUS4: "delayOver4",
  JAMAIS: "delayNever",
};

type Tt = ReturnType<typeof useTranslations>;
type SousId = "CNI" | "PASSEPORT" | "PERMIS_CONDUIRE" | "CARTE_SEJOUR";
type SousVoyage = "CARTE_EMBARQUEMENT" | "CONFIRMATION_RESERVATION";

interface Segment {
  numeroVol: string;
  compagnie: string; // nom lisible (ex. « Vueling »)
  compagnieCode: string; // code IATA (ex. « VY »)
  date: string;
  aeroportDepart: string;
  aeroportArrivee: string;
}
const segmentVide = (date = ""): Segment => ({
  numeroVol: "",
  compagnie: "",
  compagnieCode: "",
  date,
  aeroportDepart: "",
  aeroportArrivee: "",
});
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

interface DocPrepare { nomFichier: string; mimeType: string; contenuBase64: string }

// Types réellement encodables par <canvas>. Tout le reste (PDF, HEIC…) est envoyé
// tel quel, sans passer par le canvas (qui planterait/hangerait).
const TYPES_CANVAS = ["image/jpeg", "image/png", "image/webp"];

/**
 * Prépare un document pour l'upload. Les images JPEG/PNG/WEBP sont compressées ;
 * tout le reste (PDF, format non encodable) est envoyé brut. La compression ne
 * peut JAMAIS bloquer l'envoi : en cas d'échec, repli garanti sur le fichier
 * original.
 */
async function preparerDocument(file: File): Promise<DocPrepare> {
  if (TYPES_CANVAS.includes(file.type)) {
    try {
      return await compresserImage(file);
    } catch (e) {
      console.warn("[depot] compression image échouée → envoi du fichier original", file.name, e);
    }
  }
  return { nomFichier: file.name, mimeType: file.type || "application/octet-stream", contenuBase64: await fileToBase64(file) };
}

/** Charge une image avec un délai maximal pour ne JAMAIS rester bloqué. */
function chargerImage(src: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    const timer = setTimeout(() => {
      im.onload = null;
      im.onerror = null;
      reject(new Error("Chargement de l'image trop long (timeout)."));
    }, timeoutMs);
    im.onload = () => { clearTimeout(timer); resolve(im); };
    im.onerror = () => { clearTimeout(timer); reject(new Error("Image illisible par le navigateur.")); };
    im.src = src;
  });
}

async function compresserImage(file: File, maxDim = 2000, maxOctets = 1.3 * 1024 * 1024): Promise<DocPrepare> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Lecture du fichier impossible."));
    r.readAsDataURL(file);
  });
  const img = await chargerImage(dataUrl);
  let { width, height } = img;
  if (!width || !height) throw new Error("Dimensions d'image invalides.");
  const plusGrand = Math.max(width, height);
  if (plusGrand > maxDim) {
    const ratio = maxDim / plusGrand;
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");
  ctx.drawImage(img, 0, 0, width, height);

  let qualite = 0.85;
  let sortie = canvas.toDataURL("image/jpeg", qualite);
  if (!sortie.startsWith("data:image/jpeg")) throw new Error("Encodage JPEG non supporté.");
  while (sortie.length * 0.75 > maxOctets && qualite > 0.4) {
    qualite -= 0.1;
    sortie = canvas.toDataURL("image/jpeg", qualite);
  }
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return { nomFichier: `${base}.jpg`, mimeType: "image/jpeg", contenuBase64: sortie.split(",")[1]! };
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

  const [etape, setEtape] = useState(0);
  const TOTAL = 6;

  // Trajet
  const [typeTrajet, setTypeTrajet] = useState<"DIRECT" | "CORRESPONDANCE">("DIRECT");
  const [reservationUnique, setReservationUnique] = useState<boolean | null>(null);
  const [pnr, setPnr] = useState("");
  const [motif, setMotif] = useState(sp.get("motif") ?? "RETARD");
  const [retard, setRetard] = useState<RetardChoix | "">("");
  const [descriptionIncident, setDescriptionIncident] = useState("");
  const [causePerturbation, setCausePerturbation] = useState("");
  const [segments, setSegments] = useState<Segment[]>([
    {
      ...segmentVide(sp.get("date") ?? ""),
      numeroVol: sp.get("numeroVol") ?? "",
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

  // Marketing (facultatif)
  const [sourceMarketing, setSourceMarketing] = useState("");
  // Mandat
  const [nomSignature, setNomSignature] = useState("");
  const [consentRgpd, setConsentRgpd] = useState(false);
  const [accepteCgv, setAccepteCgv] = useState(false);

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // ── Distance + montant calculés AUTOMATIQUEMENT (jamais saisis ni dépendants
  // d'une simulation préalable) à partir des aéroports + motif + durée du retard ──
  const premierSeg = segments[0];
  const dernierSeg = segments[segments.length - 1];
  const trajet = useMemo(
    () => trajetEntreAeroports(premierSeg?.aeroportDepart ?? "", dernierSeg?.aeroportArrivee ?? ""),
    [premierSeg?.aeroportDepart, dernierSeg?.aeroportArrivee],
  );
  const distanceKm = trajet.distanceKm;
  const intraUe = trajet.intraUe;
  const dureeRetardMin = motif === "RETARD" && retard ? RETARD_VERS_MIN[retard] : undefined;
  const eligibilite = useMemo(
    () =>
      trajet.connu
        ? evaluerEligibilite({ distanceKm, motif: motif as MotifEligibilite, dureeRetardMin, intraUe })
        : null,
    [trajet.connu, distanceKm, motif, dureeRetardMin, intraUe],
  );
  const montantEstime = eligibilite?.montant ?? 0;

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

  // Conservés entre tentatives : évite de recréer un dossier et reprend les
  // uploads là où ils s'étaient arrêtés en cas d'échec partiel.
  const dossierRef = useRef<{ dossierId: string; reference: string } | null>(null);
  const uploadesRef = useRef<Set<string>>(new Set());

  // ── Payload INFOS (sans fichiers : les documents sont téléversés à part) ────
  function construirePayload() {
    return {
      montantEstime,
      distanceKm,
      intraUe,
      typeTrajet,
      reservationUnique,
      pnr: pnr.toUpperCase(),
      motif,
      dureeRetardMin,
      descriptionIncident,
      causePerturbation,
      sourceMarketing,
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
      nomSignature,
      consentementRgpd: consentRgpd,
      accepteCgv,
      versionCgv: VERSION_CGV,
    };
  }

  const infoValidation = depotSchema.safeParse(construirePayload());
  const docsOk =
    !!pieceDoc.file && !pieceDoc.erreur &&
    voyages.filter((v) => v.doc.file && !v.doc.erreur).length >= 1 &&
    fraisDocs.every((d) => !d.erreur) && !retardDoc.erreur;
  const valide = infoValidation.success && docsOk;
  const manquants = [
    ...(infoValidation.success ? [] : Object.keys(infoValidation.error.flatten().fieldErrors)),
    ...(docsOk ? [] : [t("secDocs")]),
  ];

  async function soumettre() {
    setErreur(null);
    setEnvoi(true);
    try {
      // 1) Créer le dossier (une seule fois ; conservé pour reprise).
      if (!dossierRef.current) {
        const res = await fetch("/api/depot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(construirePayload()),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.dossierId) {
          setErreur(data?.error ?? t("networkError"));
          return;
        }
        dossierRef.current = { dossierId: data.dossierId, reference: data.reference };
      }
      const { dossierId, reference: ref } = dossierRef.current;

      // 2) Liste ordonnée des documents à téléverser.
      const aEnvoyer: { key: string; type: string; sousType: string | null; file: File }[] = [];
      if (pieceDoc.file) aEnvoyer.push({ key: "piece", type: "PIECE_IDENTITE", sousType: pieceSousType, file: pieceDoc.file });
      voyages.forEach((v, i) => { if (v.doc.file) aEnvoyer.push({ key: `voyage-${i}`, type: "JUSTIFICATIF_VOYAGE", sousType: v.sousType, file: v.doc.file }); });
      if (retardDoc.file) aEnvoyer.push({ key: "retard", type: "JUSTIFICATIF_RETARD", sousType: null, file: retardDoc.file });
      fraisDocs.forEach((d, i) => { if (d.file) aEnvoyer.push({ key: `frais-${i}`, type: "AUTRE", sousType: "JUSTIFICATIF_FRAIS", file: d.file }); });

      // 3) Upload séquentiel (chaque requête < 4,5 Mo ; reprise sur échec partiel).
      for (const doc of aEnvoyer) {
        if (uploadesRef.current.has(doc.key)) continue;
        let prep: DocPrepare;
        try {
          prep = await preparerDocument(doc.file);
        } catch (e) {
          console.error(`[depot] préparation du document « ${doc.file.name} » échouée`, e);
          throw new Error(`Document « ${doc.file.name} » : ${e instanceof Error ? e.message : "préparation impossible"}`);
        }
        const r = await fetch(`/api/depot/${dossierId}/document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: doc.type, sousType: doc.sousType, ...prep }),
        });
        if (!r.ok) {
          const e = await r.json().catch(() => null);
          setErreur(e?.error ?? `Échec du téléversement (HTTP ${r.status}).`);
          return;
        }
        uploadesRef.current.add(doc.key);
      }

      setReference(ref);
      setEtape(7);
      window.scrollTo({ top: 0 });
    } catch (e) {
      // On affiche le VRAI message (plus de « Erreur réseau » générique masquant tout).
      console.error("[depot] échec de la soumission", e);
      setErreur(e instanceof Error ? e.message : t("networkError"));
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
            {montantEstime > 0 ? (
              <>
                <h1 className="text-xl font-bold">{t("recapTitle")}</h1>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{t("recapAmount")}</p>
                <p className="text-4xl font-extrabold text-green-700">{montantFmt}</p>
                <p className="mt-2 text-sm text-slate-500">{distanceKm} km</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold">{t("startTitle")}</h1>
                <p className="mt-3 text-sm text-slate-600">{t("startIntro")}</p>
              </>
            )}
            <button className="btn-primary mt-6 w-full" onClick={() => setEtape(1)}>{t("recapStart")}</button>
          </div>
        )}

        {etape === 1 && (
          <EtapeTrajet
            t={t} typeTrajet={typeTrajet} setTypeTrajet={setTypeTrajet}
            reservationUnique={reservationUnique} setReservationUnique={setReservationUnique}
            pnr={pnr} setPnr={setPnr} motif={motif} setMotif={setMotif}
            retard={retard} setRetard={setRetard}
            descriptionIncident={descriptionIncident} setDescriptionIncident={setDescriptionIncident}
            causePerturbation={causePerturbation} setCausePerturbation={setCausePerturbation}
            segments={segments} setSegments={setSegments} majSegment={majSegment}
            montantEstime={montantEstime} montantFmt={montantFmt}
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
                <div><label className="label">{t("nationalite")}</label><NationaliteAutocomplete value={nationalite} onChange={setNationalite} placeholder={t("nationalitePlaceholder")} /></div>
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

            {/* Mandat complet pré-rempli (texte juridique FR qui fait foi). */}
            <MandatTexte prenom={prenom} nom={nom} locale={locale} />

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={consentRgpd} onChange={(e) => setConsentRgpd(e.target.checked)} />
              <span>
                {t.rich("consentRgpd", {
                  lien: (c) => (
                    <Link href="/confidentialite" target="_blank" rel="noopener noreferrer"
                      className="font-medium text-brand-600 underline" onClick={(e) => e.stopPropagation()}>{c}</Link>
                  ),
                })}
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={accepteCgv} onChange={(e) => setAccepteCgv(e.target.checked)} />
              <span>
                {t.rich("accepteCgv", {
                  lien: (c) => (
                    <Link href="/cgv" target="_blank" rel="noopener noreferrer"
                      className="font-medium text-brand-600 underline" onClick={(e) => e.stopPropagation()}>{c}</Link>
                  ),
                })}
              </span>
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
            {/* « Comment nous avez-vous connus ? » — facultatif. */}
            <div>
              <label className="label" htmlFor="src">{t("sourceLabel")}</label>
              <select id="src" className="input" value={sourceMarketing} onChange={(e) => setSourceMarketing(e.target.value)}>
                <option value="">—</option>
                <option value="tv">{t("sourceTv")}</option>
                <option value="radio">{t("sourceRadio")}</option>
                <option value="reseaux">{t("sourceSocial")}</option>
                <option value="internet">{t("sourceInternet")}</option>
                <option value="aeroport">{t("sourceAeroport")}</option>
                <option value="entourage">{t("sourceEntourage")}</option>
                <option value="autre">{t("sourceAutre")}</option>
              </select>
            </div>
            <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{t("ipNote")}</p>
            <Nav t={t} onBack={() => setEtape(4)} onNext={() => setEtape(6)} nextDisabled={!(consentRgpd && accepteCgv && nomSignature.trim().length >= 1)} />
          </div>
        )}

        {etape === 6 && (
          <EtapeRecap
            t={t} montantFmt={montantFmt}
            commissionFmt={fmtEur(repartition.commission)} partClientFmt={fmtEur(repartition.partClient)}
            valide={valide}
            manquants={manquants}
            data={{ civilite, prenom, nom, dateNaissance, nationalite, adresse, email, telephone, pnr, motif, typeTrajet, segments,
              nbPassagers,
              nbDocs: 1 + voyages.filter((v) => v.doc.file).length + fraisDocs.filter((d) => d.file).length + (retardDoc.file ? 1 : 0) }}
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

/**
 * Mandat de représentation et de cession de créance — texte juridique (FR, qui
 * fait foi), pré-rempli avec le nom et la date. La valeur de signature
 * électronique = case cochée + nom complet saisi + horodatage + IP (serveur).
 */
function MandatTexte({ prenom, nom, locale }: { prenom: string; nom: string; locale: string }) {
  const nomComplet = `${prenom} ${nom}`.trim() || "[nom et prénom]";
  const date = new Date().toLocaleDateString(locale);
  return (
    <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
      <p className="font-semibold text-slate-900">Mandat de représentation et de cession de créance</p>
      <p className="mt-2">
        En cochant la case « J'accepte », je confirme avoir lu et accepté les conditions suivantes :
      </p>
      <p className="mt-2"><strong>1. Objet</strong> — Je, soussigné(e) <strong>{nomComplet}</strong>, donne mandat à la société AirAssist (« le Mandataire ») pour me représenter et entreprendre les démarches nécessaires afin d'obtenir l'indemnisation à laquelle j'ai droit auprès de la compagnie aérienne concernée, au titre du règlement européen CE n° 261/2004 ou de toute réglementation applicable, pour le vol référencé dans mon dossier.</p>
      <p className="mt-2"><strong>2. Étendue</strong> — J'autorise AirAssist à contacter la compagnie en mon nom, à transmettre ma réclamation, à fournir les informations et documents nécessaires, à négocier et, le cas échéant, à recevoir l'indemnisation pour mon compte.</p>
      <p className="mt-2"><strong>3. Cession et versement</strong> — J'accepte que l'indemnisation soit versée par la compagnie directement à AirAssist, qui me reversera ensuite la somme due après déduction de sa commission, via un prestataire de paiement agréé (Stripe).</p>
      <p className="mt-2"><strong>4. Commission</strong> — AirAssist percevra une commission de <strong>30 % TTC</strong> du montant obtenu ; je percevrai <strong>70 %</strong> de la somme récupérée. <strong>Aucun frais ne me sera facturé si aucune indemnisation n'est obtenue : pas de gain, pas de frais.</strong></p>
      <p className="mt-2"><strong>5. Exactitude</strong> — Je certifie que les informations fournies sont exactes et que je suis le passager concerné ou son représentant légal habilité.</p>
      <p className="mt-2"><strong>6. Durée</strong> — Le mandat est valable pour la durée du traitement de la réclamation et prend fin une fois l'indemnisation versée ou la réclamation close.</p>
      <p className="mt-2"><strong>7. Données</strong> — J'accepte que mes données soient traitées aux seules fins du traitement de ma réclamation, conformément au RGPD.</p>
      <p className="mt-3 italic">Fait électroniquement, le {date}, par {nomComplet}, qui reconnaît que cette acceptation électronique a valeur de signature.</p>
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
  retard: RetardChoix | ""; setRetard: (v: RetardChoix) => void;
  descriptionIncident: string; setDescriptionIncident: (v: string) => void;
  causePerturbation: string; setCausePerturbation: (v: string) => void;
  segments: Segment[]; setSegments: (s: Segment[]) => void;
  majSegment: (i: number, patch: Partial<Segment>) => void;
  montantEstime: number; montantFmt: string;
  onNext: () => void;
}) {
  const { t, typeTrajet, setTypeTrajet, reservationUnique, setReservationUnique, pnr, setPnr, motif, setMotif, retard, setRetard, descriptionIncident, setDescriptionIncident, causePerturbation, setCausePerturbation, segments, setSegments, majSegment, montantEstime, montantFmt, onNext } = props;
  const pnrOk = /^[A-Za-z0-9]{6}$/.test(pnr.trim());
  const segmentsOk = segments.every((s) => s.numeroVol.trim() && s.compagnie.trim() && s.date && s.aeroportDepart && s.aeroportArrivee);
  const correspondanceOk = typeTrajet === "DIRECT" || (segments.length >= 2 && typeof reservationUnique === "boolean");
  const retardOk = motif !== "RETARD" || retard !== "";
  const autreOk = motif !== "AUTRE" || descriptionIncident.trim().length >= 5;

  return (
    <div>
      <h2 className="text-lg font-bold">{t("trajetTitle")}</h2>
      <div className="mt-4 flex gap-2">
        {(["DIRECT", "CORRESPONDANCE"] as const).map((tt) => (
          <button key={tt} type="button"
            onClick={() => { setTypeTrajet(tt); if (tt === "CORRESPONDANCE" && segments.length < 2) setSegments([...segments, segmentVide(segments[0]?.date ?? "")]); }}
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
              <div>
                <label className="label">{t("segAirline")} <span className="text-red-500">*</span></label>
                <AirlineAutocomplete
                  value={s.compagnieCode}
                  nom={s.compagnie}
                  onChange={(code, nom) => majSegment(i, { compagnie: nom, compagnieCode: code })}
                  placeholder={t("airlinePlaceholder")}
                />
              </div>
              <div>
                <label className="label">{t("segFlightNumber")}</label>
                <input
                  className="input uppercase"
                  placeholder={t("flightNumberPlaceholder")}
                  value={s.numeroVol}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    const patch: Partial<Segment> = { numeroVol: val };
                    // Auto-détection de la compagnie via le préfixe IATA (si non déjà choisie).
                    const c = getCompagnieParCode(val.slice(0, 2));
                    if (c && !s.compagnie) { patch.compagnie = c.nom; patch.compagnieCode = c.code; }
                    majSegment(i, patch);
                  }}
                />
                <p className="mt-1 text-xs text-slate-500">{t("flightNumberHelp")}</p>
              </div>
              <div><label className="label">{t("segDate")}</label><input type="date" className="input" value={s.date} onChange={(e) => majSegment(i, { date: e.target.value })} /></div>
              <div />
              <div><label className="label">{t("segFrom")}</label><AirportAutocomplete value={s.aeroportDepart} onChange={(iata) => majSegment(i, { aeroportDepart: iata })} placeholder={t("airportPlaceholder")} /></div>
              <div><label className="label">{t("segTo")}</label><AirportAutocomplete value={s.aeroportArrivee} onChange={(iata) => majSegment(i, { aeroportArrivee: iata })} placeholder={t("airportPlaceholder")} /></div>
            </div>
          </div>
        ))}
        {typeTrajet === "CORRESPONDANCE" && (
          <button type="button" className="w-full rounded-lg border border-dashed border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            onClick={() => setSegments([...segments, segmentVide()])}>
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
            <option value="AUTRE">{t("motifAutre")}</option>
          </select>
        </div>
      </div>

      {/* Durée du retard à l'arrivée — uniquement pour un retard. */}
      {motif === "RETARD" && (
        <div className="mt-4">
          <label className="label">{t("delayLabel")}</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(["MOINS3", "DE3A4", "PLUS4", "JAMAIS"] as RetardChoix[]).map((opt) => (
              <button key={opt} type="button" onClick={() => setRetard(opt)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition ${retard === opt ? "border-brand-500 bg-brand-50 font-semibold text-brand-800" : "border-slate-300 hover:bg-slate-50"}`}>
                {t(RETARD_LABELS[opt])}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* « Autre » — description courte de la situation. */}
      {motif === "AUTRE" && (
        <div className="mt-4">
          <label className="label">{t("autreLabel")}</label>
          <textarea className="input" rows={3} maxLength={1200}
            placeholder={t("autrePlaceholder")}
            value={descriptionIncident} onChange={(e) => setDescriptionIncident(e.target.value)} />
        </div>
      )}

      {/* Estimation live (dès que départ + arrivée + motif/durée sont connus). */}
      {montantEstime > 0 && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs uppercase tracking-wide text-green-700">{t("recapAmount")}</p>
          <p className="text-2xl font-extrabold text-green-700">{montantFmt}</p>
        </div>
      )}

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
        <button className="btn-primary" disabled={!(pnrOk && segmentsOk && correspondanceOk && retardOk && autreOk)} onClick={onNext}>{t("next")}</button>
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

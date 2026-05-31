"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { listeAeroports } from "@/data/aeroports";

interface ResultatApi {
  eligible: boolean;
  montant: number;
  distanceKm: number;
  intraUe: boolean;
  raison: string;
  code: string;
}

const AEROPORTS = listeAeroports();

export function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({
    numeroVol: "",
    date: "",
    aeroportDepart: "",
    aeroportArrivee: "",
    motif: "RETARD",
    dureeRetardMin: "",
  });
  const [resultat, setResultat] = useState<ResultatApi | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const montantFormate = (m: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(m);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setResultat(null);
    if (!form.aeroportDepart || !form.aeroportArrivee) {
      setErreur(t("errorAirports"));
      return;
    }
    setChargement(true);
    try {
      const res = await fetch("/api/eligibilite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dureeRetardMin: form.dureeRetardMin ? Number(form.dureeRetardMin) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur");
      } else {
        setResultat(data as ResultatApi);
      }
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setChargement(false);
    }
  }

  function lancerReclamation() {
    if (!resultat) return;
    const q = new URLSearchParams({
      numeroVol: form.numeroVol,
      date: form.date,
      aeroportDepart: form.aeroportDepart,
      aeroportArrivee: form.aeroportArrivee,
      motif: form.motif,
      dureeRetardMin: form.dureeRetardMin || "",
      distanceKm: String(resultat.distanceKm),
      intraUe: String(resultat.intraUe),
      montant: String(resultat.montant),
    });
    router.push(`/reclamation?${q.toString()}`);
  }

  const besoinRetard = form.motif === "RETARD" || form.motif === "CORRESPONDANCE_MANQUEE";

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">{t("title")}</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="numeroVol">
            {t("flightNumber")}
          </label>
          <input
            id="numeroVol"
            className="input"
            placeholder={t("flightNumberPlaceholder")}
            value={form.numeroVol}
            onChange={(e) => setForm({ ...form, numeroVol: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="date">
            {t("date")}
          </label>
          <input
            id="date"
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="dep">
            {t("departure")}
          </label>
          <select
            id="dep"
            className="input"
            value={form.aeroportDepart}
            onChange={(e) => setForm({ ...form, aeroportDepart: e.target.value })}
            required
          >
            <option value="">{t("selectAirport")}</option>
            {AEROPORTS.map((a) => (
              <option key={a.iata} value={a.iata}>
                {a.ville} ({a.iata})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="arr">
            {t("arrival")}
          </label>
          <select
            id="arr"
            className="input"
            value={form.aeroportArrivee}
            onChange={(e) => setForm({ ...form, aeroportArrivee: e.target.value })}
            required
          >
            <option value="">{t("selectAirport")}</option>
            {AEROPORTS.map((a) => (
              <option key={a.iata} value={a.iata}>
                {a.ville} ({a.iata})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="motif">
            {t("reason")}
          </label>
          <select
            id="motif"
            className="input"
            value={form.motif}
            onChange={(e) => setForm({ ...form, motif: e.target.value })}
          >
            <option value="RETARD">{t("reasonRetard")}</option>
            <option value="ANNULATION">{t("reasonAnnulation")}</option>
            <option value="SURBOOKING">{t("reasonSurbooking")}</option>
            <option value="CORRESPONDANCE_MANQUEE">{t("reasonCorrespondance")}</option>
          </select>
        </div>
        {besoinRetard && (
          <div>
            <label className="label" htmlFor="retard">
              {t("delayMinutes")}
            </label>
            <input
              id="retard"
              type="number"
              min={0}
              className="input"
              value={form.dureeRetardMin}
              onChange={(e) => setForm({ ...form, dureeRetardMin: e.target.value })}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary w-full" disabled={chargement}>
            {chargement ? "…" : t("submit")}
          </button>
        </div>
      </form>

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erreur}</p>
      )}

      {resultat && (
        <div
          className={`mt-4 rounded-lg p-4 ${
            resultat.eligible ? "bg-green-50" : "bg-amber-50"
          }`}
        >
          <p className="font-bold">
            {resultat.eligible ? t("resultEligibleTitle") : t("resultNotEligibleTitle")}
          </p>
          {resultat.eligible ? (
            <p className="mt-1 text-lg">
              {t("resultEligible", { amount: montantFormate(resultat.montant) })}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">{resultat.raison}</p>
          )}
          <p className="mt-1 text-sm text-slate-500">
            {t("distance", { km: resultat.distanceKm })}
          </p>
          {resultat.eligible && (
            <button onClick={lancerReclamation} className="btn-primary mt-3">
              {t("ctaStart")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

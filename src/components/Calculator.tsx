"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { COMPAGNIES_AERIENNES } from "@/data/compagnies-aeriennes";

const COMPAGNIES_TRIEES = [...COMPAGNIES_AERIENNES].sort((a, b) => a.nom.localeCompare(b.nom));

interface ResultatApi {
  eligible: boolean;
  montant: number;
  distanceKm: number;
  intraUe: boolean;
  raison: string;
  code: string;
}

// Retard exprimé en heures (façon AirHelp), converti en minutes pour le moteur.
type RetardChoix = "PLUS3" | "MOINS3" | "JAMAIS";
const RETARD_VERS_MIN: Record<RetardChoix, number> = {
  PLUS3: 200, // ≥ 3 h → éligible
  MOINS3: 60, // < 3 h → non éligible
  JAMAIS: 600, // jamais arrivé → traité comme une forte perturbation, éligible
};

export function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({
    compagnie: "",
    numVolNum: "",
    date: "",
    aeroportDepart: "",
    aeroportArrivee: "",
    motif: "RETARD",
  });
  // N° de vol = préfixe IATA de la compagnie + partie numérique (ex. LH1024).
  const numeroVol = form.compagnie ? `${form.compagnie}${form.numVolNum}` : "";
  const [retard, setRetard] = useState<RetardChoix | "">("");
  const [resultat, setResultat] = useState<ResultatApi | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const besoinRetard = form.motif === "RETARD" || form.motif === "CORRESPONDANCE_MANQUEE";
  const dureeRetardMin = besoinRetard && retard ? RETARD_VERS_MIN[retard] : undefined;

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
          numeroVol: numeroVol || "AA000",
          date: form.date,
          aeroportDepart: form.aeroportDepart,
          aeroportArrivee: form.aeroportArrivee,
          motif: form.motif,
          dureeRetardMin,
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
      numeroVol,
      date: form.date,
      aeroportDepart: form.aeroportDepart,
      aeroportArrivee: form.aeroportArrivee,
      motif: form.motif,
      dureeRetardMin: dureeRetardMin ? String(dureeRetardMin) : "",
      distanceKm: String(resultat.distanceKm),
      intraUe: String(resultat.intraUe),
      montant: String(resultat.montant),
    });
    router.push(`/reclamation?${q.toString()}`);
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">{t("title")}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="dep">{t("departure")}</label>
          <AirportAutocomplete
            id="dep"
            value={form.aeroportDepart}
            onChange={(iata) => setForm({ ...form, aeroportDepart: iata })}
          />
        </div>
        <div>
          <label className="label" htmlFor="arr">{t("arrival")}</label>
          <AirportAutocomplete
            id="arr"
            value={form.aeroportArrivee}
            onChange={(iata) => setForm({ ...form, aeroportArrivee: iata })}
          />
        </div>

        <div>
          <label className="label" htmlFor="date">{t("date")}</label>
          <input
            id="date"
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <div className="mt-2 flex gap-2">
            {[
              { key: "dateYesterday", days: 1 },
              { key: "dateToday", days: 0 },
            ].map(({ key, days }) => {
              const d = new Date();
              d.setDate(d.getDate() - days);
              const iso = d.toISOString().slice(0, 10);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setForm({ ...form, date: iso })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.date === iso
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t(key)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="airline">{t("airline")}</label>
          <select
            id="airline"
            className="input"
            value={form.compagnie}
            onChange={(e) => setForm({ ...form, compagnie: e.target.value })}
          >
            <option value="">{t("airlineChoose")}</option>
            {COMPAGNIES_TRIEES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.nom} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="numVol">{t("flightNumber")}</label>
          <div className="flex gap-2">
            <span className="flex w-14 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 font-mono text-sm font-semibold text-slate-500">
              {form.compagnie || "—"}
            </span>
            <input
              id="numVol"
              inputMode="numeric"
              maxLength={5}
              className="input flex-1 disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="1234"
              value={form.numVolNum}
              onChange={(e) => setForm({ ...form, numVolNum: e.target.value.replace(/\D/g, "") })}
              disabled={!form.compagnie}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="motif">{t("reason")}</label>
          <select
            id="motif"
            className="input"
            value={form.motif}
            onChange={(e) => {
              setForm({ ...form, motif: e.target.value });
              setRetard("");
            }}
          >
            <option value="RETARD">{t("reasonRetard")}</option>
            <option value="ANNULATION">{t("reasonAnnulation")}</option>
            <option value="SURBOOKING">{t("reasonSurbooking")}</option>
            <option value="CORRESPONDANCE_MANQUEE">{t("reasonCorrespondance")}</option>
          </select>
        </div>

        {besoinRetard && (
          <div>
            <label className="label">{t("delayQuestion")}</label>
            <div className="grid grid-cols-1 gap-2">
              {(["PLUS3", "MOINS3", "JAMAIS"] as RetardChoix[]).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setRetard(opt)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    retard === opt
                      ? "border-brand-500 bg-brand-50 font-semibold text-brand-800"
                      : "border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {opt === "PLUS3" && t("delay3plus")}
                  {opt === "MOINS3" && t("delayUnder3")}
                  {opt === "JAMAIS" && t("delayNever")}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={chargement || (besoinRetard && !retard)}
        >
          {chargement ? "…" : t("submit")}
        </button>
      </form>

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erreur}</p>
      )}

      {resultat && (
        <div className={`mt-4 rounded-lg p-4 ${resultat.eligible ? "bg-green-50" : "bg-amber-50"}`}>
          <p className="font-bold">
            {resultat.eligible ? t("resultEligibleTitle") : t("resultNotEligibleTitle")}
          </p>
          {resultat.eligible ? (
            <p className="mt-1 text-2xl font-extrabold text-green-700">
              {montantFormate(resultat.montant)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">{resultat.raison}</p>
          )}
          <p className="mt-1 text-sm text-slate-500">
            {t("distance", { km: resultat.distanceKm })}
          </p>
          {resultat.eligible && (
            <button onClick={lancerReclamation} className="btn-primary mt-3 w-full">
              {t("ctaStart")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

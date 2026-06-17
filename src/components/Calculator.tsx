"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";

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
    aeroportDepart: "",
    aeroportArrivee: "",
    motif: "RETARD",
  });
  // Détails du vol (compagnie, n° de vol, date exacte) collectés ensuite dans le
  // tunnel : ils ne changent pas l'estimation (qui dépend de la distance + motif).
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
      // Date du jour par défaut : l'estimation ne dépend pas de la date exacte
      // (collectée plus tard dans le tunnel), et l'API refuse une date future.
      const aujourdhui = new Date().toISOString().slice(0, 10);
      const res = await fetch("/api/eligibilite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroVol: "AA000",
          date: aujourdhui,
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
    // Le tunnel collectera le n° de vol, la compagnie et la date exacte.
    const q = new URLSearchParams({
      numeroVol: "",
      date: "",
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

"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { SplitFlapAmount } from "@/components/home/SplitFlapAmount";
import { trajetEntreAeroports } from "@/domain/distance";
import { evaluerEligibilite, montantParDistance } from "@/domain/eligibilite";
import type { MotifVol } from "@prisma/client";

/**
 * Estimateur — le cœur de la conversion, pas un formulaire.
 *
 * Le montant se calcule EN DIRECT pendant la saisie, sans attendre de
 * soumission : `evaluerEligibilite` et `trajetEntreAeroports` sont des
 * fonctions pures de `src/domain/`, sans I/O ni Prisma, donc utilisables
 * côté client. La règle métier n'est PAS dupliquée — c'est exactement le même
 * moteur que celui appelé par /api/eligibilite dans le tunnel.
 *
 * Trois états, dans cet ordre de révélation :
 *   1. trajet incomplet          → pas de montant, on invite à le renseigner ;
 *   2. trajet connu, retard non  → montant PLEIN de la tranche (« jusqu'à X € »),
 *      renseigné                   honnête et incitatif ;
 *   3. saisie complète           → montant réel, ou explication de non-éligibilité.
 */

type RetardChoix = "MOINS3" | "DE3A4" | "PLUS4" | "JAMAIS";

// Retard à l'arrivée en 4 paliers, converti en minutes pour le moteur.
// Le palier 3 h–4 h déclenche la réduction de 50 % sur les long-courriers (>3500 km).
const RETARD_VERS_MIN: Record<RetardChoix, number> = {
  MOINS3: 60, // < 3 h → non éligible
  DE3A4: 210, // 3 h–4 h (3 h 30) → éligible, réduction 50 % si long-courrier
  PLUS4: 300, // + de 4 h → éligible, plein montant
  JAMAIS: 600, // jamais arrivé → forte perturbation, éligible
};
const RETARD_LABELS: Record<RetardChoix, string> = {
  MOINS3: "delayUnder3",
  DE3A4: "delay3to4",
  PLUS4: "delayOver4",
  JAMAIS: "delayNever",
};

const MOTIFS: MotifVol[] = ["RETARD", "ANNULATION", "SURBOOKING", "CORRESPONDANCE_MANQUEE"];
const MOTIF_LABELS: Record<string, string> = {
  RETARD: "reasonRetard",
  ANNULATION: "reasonAnnulation",
  SURBOOKING: "reasonSurbooking",
  CORRESPONDANCE_MANQUEE: "reasonCorrespondance",
};

export function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const router = useRouter();

  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [motif, setMotif] = useState<MotifVol>("RETARD");
  const [retard, setRetard] = useState<RetardChoix | "">("");

  const besoinRetard = motif === "RETARD" || motif === "CORRESPONDANCE_MANQUEE";
  const dureeRetardMin = besoinRetard && retard ? RETARD_VERS_MIN[retard] : undefined;

  /** Estimation recalculée à chaque frappe — aucun appel réseau. */
  const estimation = useMemo(() => {
    if (!depart || !arrivee || depart === arrivee) {
      return { etat: "incomplet" as const };
    }
    const trajet = trajetEntreAeroports(depart, arrivee);
    if (!trajet.connu || trajet.distanceKm <= 0) {
      return { etat: "incomplet" as const };
    }

    // Trajet connu mais palier de retard pas encore choisi : on affiche le
    // montant PLEIN de la tranche de distance. C'est un plafond honnête,
    // pas une promesse — le libellé dit « jusqu'à ».
    if (besoinRetard && !retard) {
      return {
        etat: "potentiel" as const,
        montant: montantParDistance(trajet.distanceKm, trajet.intraUe),
        distanceKm: trajet.distanceKm,
        intraUe: trajet.intraUe,
      };
    }

    const res = evaluerEligibilite({
      distanceKm: trajet.distanceKm,
      motif,
      dureeRetardMin,
      intraUe: trajet.intraUe,
    });
    return {
      etat: res.eligible ? ("eligible" as const) : ("ineligible" as const),
      montant: res.montant,
      code: res.code,
      distanceKm: trajet.distanceKm,
      intraUe: trajet.intraUe,
    };
  }, [depart, arrivee, motif, retard, besoinRetard, dureeRetardMin]);

  const montantAffiche =
    estimation.etat === "potentiel" || estimation.etat === "eligible" ? estimation.montant : 0;

  const montantFormate = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(montantAffiche);

  function lancerReclamation() {
    if (estimation.etat !== "eligible") return;
    // Le tunnel collectera le n° de vol, la compagnie et la date exacte.
    const q = new URLSearchParams({
      numeroVol: "",
      date: "",
      aeroportDepart: depart,
      aeroportArrivee: arrivee,
      motif,
      dureeRetardMin: dureeRetardMin ? String(dureeRetardMin) : "",
      distanceKm: String(estimation.distanceKm),
      intraUe: String(estimation.intraUe),
      montant: String(estimation.montant),
    });
    router.push(`/reclamation?${q.toString()}`);
  }

  return (
    <div className="board on-board overflow-hidden">
      {/* ── Bandeau : le trajet, en registre « affichage » ─────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5 font-mono text-board-label uppercase">
          <span className={depart ? "text-white" : "text-ink-400"}>{depart || "———"}</span>
          <span aria-hidden className="text-ink-400">
            ▸
          </span>
          <span className={arrivee ? "text-white" : "text-ink-400"}>{arrivee || "———"}</span>
        </div>
        <span
          className={`board-statut ${
            estimation.etat === "eligible"
              ? "board-statut--reussi"
              : estimation.etat === "ineligible"
                ? "board-statut--attente"
                : "board-statut--perturbe"
          }`}
        >
          {estimation.etat === "eligible"
            ? t("statusEligible")
            : estimation.etat === "ineligible"
              ? t("statusIneligible")
              : t("statusChecking")}
        </span>
      </div>

      {/* ── Le montant : la signature du site ──────────────────────────── */}
      <div className="px-5 pb-5 pt-6 text-center sm:px-6">
        <p className="board-label">
          {estimation.etat === "potentiel" ? t("amountUpTo") : t("amountCould")}
        </p>
        <div className="mt-3 font-display text-[clamp(3rem,13vw,4.5rem)] font-extrabold leading-none tracking-tighter">
          {estimation.etat === "incomplet" || estimation.etat === "ineligible" ? (
            <span className="text-ink-600" aria-hidden>
              ———
            </span>
          ) : (
            <SplitFlapAmount
              value={montantAffiche}
              ariaLabel={t("amountAria", { amount: montantFormate })}
              className={estimation.etat === "eligible" ? "text-vol-400" : "text-white"}
            />
          )}
        </div>

        {estimation.etat === "incomplet" && (
          <p className="mt-3 text-sm text-ink-400">{t("hintRoute")}</p>
        )}
        {estimation.etat === "ineligible" && (
          <p className="mt-3 text-sm text-ambre-400">
            {estimation.code === "RETARD_INSUFFISANT" ? t("hintUnder3") : t("hintNotEligible")}
          </p>
        )}
        {(estimation.etat === "potentiel" || estimation.etat === "eligible") && (
          <p className="mt-3 font-mono text-xs text-ink-400">
            {t("distance", { km: estimation.distanceKm })}
          </p>
        )}
      </div>

      {/* ── La saisie ──────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 px-5 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-board" htmlFor="dep">
              {t("departure")}
            </label>
            <AirportAutocomplete
              id="dep"
              value={depart}
              onChange={setDepart}
              placeholder={t("selectAirport")}
              variant="board"
            />
          </div>
          <div>
            <label className="label-board" htmlFor="arr">
              {t("arrival")}
            </label>
            <AirportAutocomplete
              id="arr"
              value={arrivee}
              onChange={setArrivee}
              placeholder={t("selectAirport")}
              variant="board"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label-board" htmlFor="motif">
            {t("reason")}
          </label>
          <select
            id="motif"
            className="input-board"
            value={motif}
            onChange={(e) => {
              setMotif(e.target.value as MotifVol);
              setRetard("");
            }}
          >
            {MOTIFS.map((m) => (
              // `text-ink-900` : la liste déroulante native se rend sur fond
              // clair, un texte blanc y serait invisible.
              <option key={m} value={m} className="text-ink-900">
                {t(MOTIF_LABELS[m] as string)}
              </option>
            ))}
          </select>
        </div>

        {besoinRetard && (
          <fieldset className="mt-4">
            <legend className="label-board">{t("delayQuestion")}</legend>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {(["MOINS3", "DE3A4", "PLUS4", "JAMAIS"] as RetardChoix[]).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setRetard(opt)}
                  aria-pressed={retard === opt}
                  className={`rounded-xl border-[1.5px] px-3.5 py-3 text-left text-sm font-medium transition-colors duration-fast ${
                    retard === opt
                      ? "border-vol-400 bg-vol-400/15 text-white"
                      : "border-white/15 bg-white/5 text-ink-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {t(RETARD_LABELS[opt])}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          onClick={lancerReclamation}
          disabled={estimation.etat !== "eligible"}
          className="btn-primary mt-5 w-full"
        >
          {t("ctaStart")}
        </button>
        <p className="mt-3 text-center text-xs text-ink-400">{t("noWinNoFee")}</p>
      </div>
    </div>
  );
}

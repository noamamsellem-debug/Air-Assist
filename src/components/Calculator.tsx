"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { trajetEntreAeroports } from "@/domain/distance";
import { evaluerEligibilite, montantParDistance } from "@/domain/eligibilite";
import type { MotifVol } from "@prisma/client";

/**
 * Estimateur d'indemnité — TEMPS RÉEL.
 *
 * Le montant se recalcule à chaque changement de champ : plus de bouton
 * « Estimer », plus d'appel réseau. La règle métier n'est PAS dupliquée —
 * `trajetEntreAeroports` et `evaluerEligibilite` sont les fonctions pures de
 * `src/domain/`, sans I/O ni Prisma, donc directement utilisables côté client.
 * C'est le même moteur que celui derrière /api/eligibilite, qui reste en place
 * pour le tunnel de réclamation.
 *
 * Le bouton final ne calcule rien : il transmet au tunnel une estimation déjà
 * établie.
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

/** État affiché par le panneau de montant. */
type Etat =
  | { kind: "incomplet" }
  | { kind: "memeAeroport" }
  | { kind: "potentiel"; montant: number; distanceKm: number; intraUe: boolean }
  | { kind: "eligible"; montant: number; distanceKm: number; intraUe: boolean }
  | { kind: "ineligible"; distanceKm: number };

export function Calculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const router = useRouter();

  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [motif, setMotif] = useState<MotifVol>("RETARD");
  const [retard, setRetard] = useState<RetardChoix | "">("");

  // La question de durée n'a de sens que pour les motifs que le moteur soumet
  // au seuil des 3 h. La masquer pour « correspondance manquée » rendrait ce
  // motif systématiquement non indemnisable.
  const besoinRetard = motif === "RETARD" || motif === "CORRESPONDANCE_MANQUEE";
  const dureeRetardMin = besoinRetard && retard ? RETARD_VERS_MIN[retard] : undefined;

  /** Recalculé à chaque frappe. Aucun effet de bord, aucun réseau. */
  const etat = useMemo<Etat>(() => {
    if (!depart || !arrivee) return { kind: "incomplet" };
    if (depart === arrivee) return { kind: "memeAeroport" };

    const trajet = trajetEntreAeroports(depart, arrivee);
    if (!trajet.connu || trajet.distanceKm <= 0) return { kind: "incomplet" };

    // Trajet connu, palier de retard pas encore choisi : on affiche le plafond
    // du barème pour cette distance. Le libellé dit « jusqu'à » — c'est un
    // plafond honnête, pas une promesse.
    if (besoinRetard && !retard) {
      return {
        kind: "potentiel",
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

    if (!res.eligible) return { kind: "ineligible", distanceKm: trajet.distanceKm };
    return {
      kind: "eligible",
      montant: res.montant,
      distanceKm: trajet.distanceKm,
      intraUe: trajet.intraUe,
    };
  }, [depart, arrivee, motif, retard, besoinRetard, dureeRetardMin]);

  const nombre = new Intl.NumberFormat(locale);

  // ── Traduction de l'état en éléments d'affichage ───────────────────────
  const badge =
    etat.kind === "eligible"
      ? { classe: "bg-emerald-100 text-emerald-800", texte: t("statusEligible") }
      : etat.kind === "ineligible"
        ? { classe: "bg-red-100 text-red-800", texte: t("statusIneligible") }
        : etat.kind === "memeAeroport"
          ? { classe: "bg-red-100 text-red-800", texte: t("statusNotEligible") }
          : { classe: "bg-amber-100 text-amber-800", texte: t("statusChecking") };

  const libelle =
    etat.kind === "potentiel"
      ? t("amountUpTo")
      : etat.kind === "ineligible"
        ? t("amountNotDue")
        : t("amountCould");

  const montantTexte =
    etat.kind === "potentiel" || etat.kind === "eligible" ? String(etat.montant) : null;

  const distanceTexte =
    etat.kind === "potentiel" || etat.kind === "eligible" || etat.kind === "ineligible"
      ? t("distance", { km: nombre.format(etat.distanceKm) })
      : null;

  const sousTitre =
    etat.kind === "incomplet"
      ? t("hintRoute")
      : etat.kind === "memeAeroport"
        ? t("hintSameAirport")
        : etat.kind === "ineligible"
          ? `${distanceTexte} · ${t("hintUnder3")}`
          : distanceTexte;

  function lancerReclamation() {
    if (etat.kind !== "eligible") return;
    // Le tunnel collectera le n° de vol, la compagnie et la date exacte.
    const q = new URLSearchParams({
      numeroVol: "",
      date: "",
      aeroportDepart: depart,
      aeroportArrivee: arrivee,
      motif,
      dureeRetardMin: dureeRetardMin ? String(dureeRetardMin) : "",
      distanceKm: String(etat.distanceKm),
      intraUe: String(etat.intraUe),
      montant: String(etat.montant),
    });
    router.push(`/reclamation?${q.toString()}`);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* ── Panneau de montant ──────────────────────────────────────────
          Greffé en haut de la carte, dans la famille chromatique du hero.
          Le montant reste blanc dans TOUS les états : c'est le badge qui
          porte l'éligibilité, pas la couleur du chiffre. */}
      <div className="relative bg-[linear-gradient(155deg,#122a72_0%,#1e40af_100%)] px-5 py-5 text-white sm:px-6">
        <span
          className={`absolute right-4 top-4 rounded-lg px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wider sm:right-5 ${badge.classe}`}
        >
          {badge.texte}
        </span>

        {/* Hauteurs FIXES sur les trois lignes du panneau : les libellés et
            sous-titres passent de une à deux lignes selon l'état, ce qui
            faisait sauter la carte de 17 px à chaque recalcul. On réserve la
            place du pire cas une fois pour toutes. */}
        <p className="flex h-[34px] max-w-[60%] items-start text-[10.5px] font-bold uppercase leading-[17px] tracking-[0.08em] text-white/65">
          {libelle}
        </p>

        {/* Monospace : registre « tableau d'affichage », et chiffres de largeur
            constante donc aucun décalage entre 250 et 600.
            `clamp` + `whitespace-nowrap` : « 600 € » tient sur une ligne dès
            375 px sans jamais se replier. */}
        <p className="font-mono font-bold leading-none tracking-tight whitespace-nowrap text-[clamp(2.5rem,11vw,3rem)]">
          {montantTexte ? (
            <>
              {montantTexte}
              <span className="ml-1.5 font-semibold text-white/70">€</span>
            </>
          ) : (
            <span aria-hidden>———</span>
          )}
        </p>

        <p className="mt-2 flex h-[34px] items-start text-[11.5px] leading-[17px] text-white/60">
          {sousTitre}
        </p>

        {/* Annonce unique et lisible pour les lecteurs d'écran : le panneau
            visuel est fragmenté, celle-ci ne l'est pas. */}
        <p className="sr-only" aria-live="polite">
          {montantTexte
            ? t("amountAria", { label: libelle, amount: `${montantTexte} €` })
            : `${badge.texte}. ${sousTitre}`}
        </p>
      </div>

      {/* ── Saisie ──────────────────────────────────────────────────────
          Style identique à la carte actuelle : rien n'y change. */}
      <div className="p-5 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="dep">
              {t("departure")}
            </label>
            <AirportAutocomplete
              id="dep"
              value={depart}
              onChange={setDepart}
              placeholder={t("selectAirport")}
            />
          </div>

          <div>
            <label className="label" htmlFor="arr">
              {t("arrival")}
            </label>
            <AirportAutocomplete
              id="arr"
              value={arrivee}
              onChange={setArrivee}
              placeholder={t("selectAirport")}
            />
          </div>

          <div>
            <label className="label" htmlFor="motif">
              {t("reason")}
            </label>
            <select
              id="motif"
              className="input"
              value={motif}
              onChange={(e) => {
                setMotif(e.target.value as MotifVol);
                setRetard("");
              }}
            >
              {MOTIFS.map((m) => (
                <option key={m} value={m}>
                  {t(MOTIF_LABELS[m] as string)}
                </option>
              ))}
            </select>
          </div>

          {besoinRetard && (
            <fieldset>
              <legend className="label">{t("delayQuestion")}</legend>
              <div className="grid grid-cols-1 gap-2">
                {(["MOINS3", "DE3A4", "PLUS4", "JAMAIS"] as RetardChoix[]).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRetard(opt)}
                    aria-pressed={retard === opt}
                    // min-h-[52px] : confortablement au-dessus des 44 px de la
                    // norme Apple, avec de l'espace entre les cibles au pouce.
                    className={`min-h-[52px] rounded-xl border-[1.5px] p-3.5 text-left text-base transition focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,96,255,0.15)] ${
                      retard === opt
                        ? "border-brand-500 bg-[rgba(0,96,255,0.08)] font-semibold text-brand-600"
                        : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {t(RETARD_LABELS[opt])}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <button
          type="button"
          onClick={lancerReclamation}
          disabled={etat.kind !== "eligible"}
          className="btn-primary mt-5 w-full"
        >
          {t("ctaStart")}
        </button>
        <p className="mt-2.5 text-center text-xs text-slate-500">{t("noWinNoFee")}</p>
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";

/**
 * Suivi de dossier rendu comme un tableau d'affichage.
 *
 * Le motif n'est pas décoratif : la machine à états de `domain/statut.ts` EST
 * déjà une suite de statuts. On montre ici le parcours réel — dossier reçu,
 * réclamation envoyée, réponse de la compagnie, indemnité versée — pour rendre
 * le service tangible. Les gens achètent ce qu'ils peuvent se représenter.
 *
 * Les dates sont volontairement des DURÉES relatives (« J+1 », « J+3 »), pas
 * des dates simulées : on n'invente pas un dossier client qui n'existe pas.
 */

type Etat = "reussi" | "encours" | "attente";

const ETAPES: { cle: string; jalon: string; etat: Etat }[] = [
  { cle: "received", jalon: "J+0", etat: "reussi" },
  { cle: "sent", jalon: "J+1", etat: "reussi" },
  { cle: "reply", jalon: "J+30", etat: "encours" },
  { cle: "paid", jalon: "—", etat: "attente" },
];

export function StatusBoard() {
  const t = useTranslations("tracking");

  return (
    <div className="board overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
        <span className="board-label">{t("boardTitle")}</span>
        <span className="font-mono text-board-label uppercase text-ink-400">AA-2026-000123</span>
      </div>

      <ol className="px-5 py-2 sm:px-6">
        {ETAPES.map((etape) => (
          <li key={etape.cle} className="board-row first:border-t-0">
            <span
              aria-hidden
              className={`h-2 w-2 flex-none rounded-full ${
                etape.etat === "reussi"
                  ? "bg-vol-400"
                  : etape.etat === "encours"
                    ? "bg-ambre-500"
                    : "bg-white/20"
              }`}
            />
            <span
              className={`flex-1 text-sm font-medium ${
                etape.etat === "attente" ? "text-ink-400" : "text-white"
              }`}
            >
              {t(`step_${etape.cle}`)}
            </span>
            <span className="font-mono text-board-label uppercase text-ink-400">{etape.jalon}</span>
            <span
              className={`board-statut ${
                etape.etat === "reussi"
                  ? "board-statut--reussi"
                  : etape.etat === "encours"
                    ? "board-statut--perturbe"
                    : "board-statut--attente"
              }`}
            >
              {t(`state_${etape.etat}`)}
            </span>
          </li>
        ))}
      </ol>

      <p className="border-t border-white/10 px-5 py-4 text-sm text-ink-400 sm:px-6">
        {t("boardNote")}
      </p>
    </div>
  );
}

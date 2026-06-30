"use client";

/** Bouton « Enregistrer en PDF » : ouvre la boîte d'impression du navigateur
 *  (→ « Destination : Enregistrer au format PDF »). Masqué à l'impression. */
export function BoutonImprimer() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary no-print">
      🖨️ Enregistrer en PDF / Imprimer
    </button>
  );
}

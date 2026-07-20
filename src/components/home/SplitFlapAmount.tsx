"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compteur « palettes » (split-flap) — la signature visuelle du site.
 *
 * Le montant ne se contente pas de changer : chaque chiffre TOMBE, comme sur un
 * tableau d'affichage d'aéroport. C'est l'endroit exact où le passager a appris
 * que son vol était retardé : le motif dit quelque chose de vrai sur le service.
 *
 * Implémentation volontairement sans librairie : deux `<span>` superposés et une
 * rotation CSS sur l'axe X. Coût nul sur le bundle.
 *
 * Accessibilité : le mécanisme est décoratif et masqué aux lecteurs d'écran ;
 * la valeur réelle est annoncée une seule fois via un nœud `sr-only` en
 * `aria-live="polite"`. `prefers-reduced-motion` est neutralisé globalement
 * dans globals.css, la valeur s'affiche alors sans transition.
 */

/** Un caractère qui bascule quand sa valeur change. */
function Flap({ char, delayMs }: { char: string; delayMs: number }) {
  const [affiche, setAffiche] = useState(char);
  const [anime, setAnime] = useState(false);
  const precedent = useRef(char);

  useEffect(() => {
    if (char === precedent.current) return;
    precedent.current = char;
    const t = window.setTimeout(() => {
      setAffiche(char);
      setAnime(true);
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [char, delayMs]);

  // Fin d'animation : on retire la classe pour pouvoir la rejouer au prochain
  // changement (sinon l'animation ne se déclenche qu'une fois).
  useEffect(() => {
    if (!anime) return;
    const t = window.setTimeout(() => setAnime(false), 260);
    return () => window.clearTimeout(t);
  }, [anime]);

  return (
    <span
      className={`inline-block tabular-nums ${anime ? "animate-flapIn" : ""}`}
      style={{ transformOrigin: "center top", backfaceVisibility: "hidden" }}
    >
      {affiche}
    </span>
  );
}

export function SplitFlapAmount({
  /** Montant en euros. */
  value,
  /** Libellé lu par les lecteurs d'écran (le montant y est interpolé). */
  ariaLabel,
  className = "",
}: {
  value: number;
  ariaLabel: string;
  className?: string;
}) {
  // Formatage sans séparateur de milliers : sur un tableau d'affichage, chaque
  // palette porte un caractère et un espace fine parasiterait l'alignement.
  const chars = String(Math.round(value)).split("");

  return (
    <span className={className}>
      <span aria-hidden className="inline-flex items-baseline">
        {chars.map((c, i) => (
          // La clé inclut la position : un changement de longueur (99 → 100)
          // remonte des palettes neuves plutôt que d'animer de travers.
          <Flap key={`${chars.length}-${i}`} char={c} delayMs={i * 45} />
        ))}
        <span className="ml-1">€</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {ariaLabel}
      </span>
    </span>
  );
}

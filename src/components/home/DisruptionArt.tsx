/**
 * Pictogrammes vectoriels épurés (blancs) pour les cartes « types de
 * perturbations ». Rendu inline, transparent → posé sur le fond coloré de la
 * carte. ~120×60, décoratif (aria-hidden).
 */

type Kind = "delay" | "cancel" | "connection" | "overbooking";

// Silhouette d'avion (icône « flight », pointe vers le haut).
const PLANE =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

export function DisruptionArt({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 120 60" className="h-[60px] w-[120px] max-w-full" role="img" aria-hidden>
      {kind === "delay" && (
        <>
          <path fill="#fff" transform="translate(4 6) scale(1.5) rotate(-12 12 12)" d={PLANE} />
          <g transform="translate(94 30)" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <circle r="14" />
            <path d="M0 -9 V0 L7 4" />
          </g>
          <circle cx="94" cy="30" r="2.4" fill="#fff" />
        </>
      )}

      {kind === "cancel" && (
        <>
          <path fill="#fff" transform="translate(0 8) scale(1.5) rotate(-12 12 12)" d={PLANE} />
          <g transform="translate(92 30)">
            <circle r="15" fill="#fff" />
            <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </>
      )}

      {kind === "connection" && (
        <>
          {/* Trajectoire prévue, en pointillés */}
          <path
            d="M10 48 Q48 8 110 16"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="10" cy="48" r="3.5" fill="#fff" />
          {/* Déviation (correspondance manquée) + flèche */}
          <path d="M54 24 C 62 36 64 46 60 56" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 56 l-6 -5 M60 56 l7 -2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {kind === "overbooking" && (
        <>
          <g transform="translate(8 14)">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 30} 0)`} fill="#fff" opacity={i === 2 ? 0.45 : 1}>
                <rect x="0" y="14" width="22" height="20" rx="5" />
                <rect x="2" y="0" width="18" height="16" rx="6" />
              </g>
            ))}
          </g>
          {/* Voyageur en surnombre */}
          <g transform="translate(102 22)" fill="#fff">
            <circle cx="0" cy="0" r="7" />
            <path d="M-10 26 a10 12 0 0 1 20 0 Z" />
          </g>
        </>
      )}
    </svg>
  );
}

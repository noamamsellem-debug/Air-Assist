/**
 * Illustrations vectorielles « maison » pour les 4 types de perturbations.
 * 100 % SVG inline → aucun téléchargement d'image, net sur tout écran, léger.
 * Style cohérent : ciel dégradé bleu de marque, avion blanc, badge de statut
 * coloré selon le cas. Décoratif → aria-hidden.
 */

type Kind = "delay" | "cancel" | "connection" | "overbooking";

const SKY: Record<Kind, [string, string]> = {
  delay: ["#0060ff", "#38bdf8"],
  cancel: ["#0050d6", "#3d85ff"],
  connection: ["#0a3aa8", "#0ea5e9"],
  overbooking: ["#0040ab", "#6366f1"],
};

/** Avion stylisé (vue de dessus), pointe vers le haut. */
function Plane({ transform, opacity = 1 }: { transform?: string; opacity?: number }) {
  return (
    <path
      transform={transform}
      opacity={opacity}
      fill="#fff"
      d="M30 4c2 0 3.5 2 3.5 6.5V22l16 11v5l-16-5v12l5 4v4l-8.5-2.5L21 66v-4l5-4V46l-16 5v-5l16-11V10.5C26 6 28 4 30 4z"
    />
  );
}

function Clouds() {
  return (
    <g fill="#fff" opacity="0.22" aria-hidden>
      <ellipse cx="44" cy="120" rx="30" ry="9" />
      <ellipse cx="200" cy="34" rx="26" ry="8" />
      <ellipse cx="186" cy="116" rx="18" ry="6" />
    </g>
  );
}

export function DisruptionArt({ kind }: { kind: Kind }) {
  const [from, to] = SKY[kind];
  const id = `sky-${kind}`;
  return (
    <svg viewBox="0 0 240 150" className="h-auto w-full rounded-xl" role="img" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="240" height="150" rx="14" fill={`url(#${id})`} />
      <Clouds />

      {kind === "delay" && (
        <>
          <Plane transform="translate(82 38) rotate(8)" />
          {/* Horloge */}
          <g transform="translate(158 88)">
            <circle r="26" fill="#fff" />
            <circle r="26" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <line x1="0" y1="0" x2="0" y2="-15" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="12" y2="4" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <circle r="2.5" fill="#0f172a" />
          </g>
        </>
      )}

      {kind === "cancel" && (
        <>
          <Plane transform="translate(86 36) rotate(10)" opacity={0.92} />
          {/* Pastille d'annulation */}
          <g transform="translate(160 92)">
            <circle r="24" fill="#f43f5e" />
            <path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </g>
        </>
      )}

      {kind === "connection" && (
        <>
          {/* Arc de correspondance interrompu */}
          <path
            d="M40 110 Q120 30 200 110"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="8 9"
            opacity="0.85"
          />
          <Plane transform="translate(20 92) rotate(45) scale(0.7)" />
          <Plane transform="translate(196 92) rotate(45) scale(0.7)" opacity={0.5} />
          {/* Rupture de liaison */}
          <g transform="translate(120 48)">
            <circle r="18" fill="#fff" />
            <path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </>
      )}

      {kind === "overbooking" && (
        <>
          {/* Rangée de sièges, un passager refusé */}
          <g transform="translate(40 58)">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 46} 0)`} fill="#fff" opacity={i === 2 ? 0.4 : 1}>
                <rect x="0" y="14" width="34" height="30" rx="6" />
                <rect x="2" y="0" width="30" height="20" rx="7" />
              </g>
            ))}
          </g>
          {/* Voyageur en surnombre */}
          <g transform="translate(196 64)" fill="#fff">
            <circle cx="0" cy="0" r="11" />
            <path d="M-15 40 a15 18 0 0 1 30 0 Z" />
          </g>
          <g transform="translate(196 64)">
            <circle cx="14" cy="-12" r="11" fill="#f59e0b" />
            <path d="M9 -12 h10 M14 -17 v10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </g>
        </>
      )}
    </svg>
  );
}

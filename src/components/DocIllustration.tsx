/**
 * Illustrations SVG GÉNÉRIQUES et ANONYMISÉES (aucun visuel officiel/protégé).
 * Des repères numérotés ①②③ pointent vers les zones d'info ; la légende
 * détaillée (traduite) est affichée à côté par le tunnel.
 */

export type IllustrationVariante = "identite" | "voyage";

export function DocIllustration({ variante }: { variante: IllustrationVariante }) {
  if (variante === "voyage") return <SchemaVoyage />;
  return <SchemaIdentite />;
}

function Repere({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill="#2563eb" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
        {n}
      </text>
    </g>
  );
}

/** Carte d'identité générique : photo + lignes nom/date + zone numéro. */
function SchemaIdentite() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Schéma de pièce d'identité">
      <rect x="14" y="14" width="292" height="172" rx="12" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      {/* Photo */}
      <rect x="30" y="40" width="74" height="92" rx="6" fill="#e2e8f0" stroke="#94a3b8" />
      <circle cx="67" cy="74" r="18" fill="#cbd5e1" />
      <rect x="42" y="98" width="50" height="24" rx="10" fill="#cbd5e1" />
      <Repere x={104} y={40} n={1} />
      {/* Lignes nom / prénom / date */}
      <rect x="124" y="46" width="150" height="10" rx="5" fill="#e2e8f0" />
      <rect x="124" y="66" width="120" height="10" rx="5" fill="#e2e8f0" />
      <rect x="124" y="86" width="90" height="10" rx="5" fill="#e2e8f0" />
      <Repere x={284} y={51} n={2} />
      {/* Zone numéro (mise en évidence) */}
      <rect x="124" y="120" width="160" height="22" rx="6" fill="#dbeafe" stroke="#2563eb" strokeDasharray="4 3" />
      <text x="132" y="135" fontSize="12" fontWeight="700" fill="#1e3a8a" fontFamily="monospace">N° 0000 0000</text>
      <Repere x={120} y={131} n={3} />
      {/* Bandeau bas générique */}
      <rect x="30" y="150" width="254" height="8" rx="4" fill="#f1f5f9" />
    </svg>
  );
}

/** Document de voyage générique (type carte d'embarquement) : zone PNR mise en évidence. */
function SchemaVoyage() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Schéma de document de voyage">
      <rect x="14" y="24" width="292" height="152" rx="12" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      {/* En-tête générique */}
      <rect x="30" y="40" width="120" height="12" rx="6" fill="#e2e8f0" />
      {/* Passager + vol */}
      <rect x="30" y="70" width="150" height="10" rx="5" fill="#e2e8f0" />
      <Repere x={186} y={75} n={1} />
      <rect x="30" y="92" width="90" height="10" rx="5" fill="#e2e8f0" />
      <Repere x={126} y={97} n={2} />
      {/* Siège / date */}
      <rect x="200" y="70" width="80" height="10" rx="5" fill="#e2e8f0" />
      <rect x="200" y="92" width="80" height="10" rx="5" fill="#e2e8f0" />
      {/* Zone PNR mise en évidence */}
      <rect x="30" y="124" width="150" height="26" rx="6" fill="#dbeafe" stroke="#2563eb" strokeDasharray="4 3" />
      <text x="40" y="141" fontSize="13" fontWeight="700" fill="#1e3a8a" fontFamily="monospace">PNR · ABC123</text>
      <Repere x={26} y={137} n={3} />
      {/* Code-barres générique */}
      <g fill="#94a3b8">
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={210 + i * 4} y={120} width={i % 3 === 0 ? 3 : 1.5} height={34} />
        ))}
      </g>
    </svg>
  );
}

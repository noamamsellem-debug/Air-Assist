/**
 * Logo Air Assist — marque vectorielle (triangle « A » + sillage d'avion).
 * Inspiré du logo fourni. Pour utiliser le PNG exact, déposez-le dans
 * `public/logo.png` et remplacez le <svg> par <img src="/logo.png" />.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg viewBox="0 0 44 40" className="h-8 w-8 shrink-0 text-brand-600" fill="none" aria-hidden="true">
        {/* Triangle « A » */}
        <path
          d="M20.05 4.3a2.2 2.2 0 0 1 3.9 0l16.8 29.4A2.2 2.2 0 0 1 38.8 37H25l-3-5.6-3 5.6H5.2a2.2 2.2 0 0 1-1.9-3.3z"
          fill="currentColor"
        />
        {/* Sillage / aile d'avion */}
        <path
          d="M12.8 29.2 35.6 22.9c1.05-.29 1.8 1.05.95 1.74L15.4 33.6z"
          fill="#fff"
        />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-slate-900">Air</span>
        <span className="text-brand-600">Assist</span>
      </span>
    </span>
  );
}

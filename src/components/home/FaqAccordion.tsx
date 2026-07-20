/**
 * Accordéon FAQ — `<details>` natif.
 *
 * Aucun état React : l'élément natif gère l'ouverture, reste accessible au
 * clavier par construction et fonctionne sans JavaScript. Le seul travail est
 * typographique — la FAQ de la home était un pavé de texte.
 */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-base font-semibold text-ink-900 transition-colors duration-fast marker:content-none hover:text-vol-700">
            {item.q}
            {/* Croix qui pivote en « − » à l'ouverture. */}
            <span
              aria-hidden
              className="relative h-4 w-4 flex-none text-vol-600 transition-transform duration-base group-open:rotate-45"
            >
              <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
            </span>
          </summary>
          <p className="max-w-prose pb-5 text-prose text-ink-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

import { Link } from "@/i18n/navigation";
import { Calculator } from "@/components/Calculator";

/**
 * Briques partagées des pages SEO (service, compagnie, aéroport, blog).
 * Contenu fourni en blocs structurés → rendu via expressions {} : pas de
 * texte JSX littéral (évite tout souci d'entités non échappées) et même
 * modèle réutilisable pour toutes les pages.
 */

export type Bloc =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

/** Rend le gras inline noté **ainsi** dans les chaînes de contenu. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </>
  );
}

export function ProseBlocks({ blocks }: { blocks: Bloc[] }) {
  return (
    <div className="prose-seo">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}><Inline text={b.text} /></h2>;
        if (b.type === "h3") return <h3 key={i}><Inline text={b.text} /></h3>;
        if (b.type === "p") return <p key={i}><Inline text={b.text} /></p>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
            </ul>
          );
        return (
          <ol key={i}>
            {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
          </ol>
        );
      })}
    </div>
  );
}

export function SeoHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="home-hero relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-12 text-white sm:pt-14">
        {eyebrow && (
          <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold ring-1 ring-white/30">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-base text-white/85 sm:text-lg">{lead}</p>}
      </div>
    </section>
  );
}

export function EstimationSection({ title = "Calculez votre indemnité" }: { title?: string }) {
  return (
    <section className="mx-auto mt-12 max-w-xl px-4">
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-600">
        Indiquez votre vol : estimation gratuite en 2 minutes, sans engagement.
      </p>
      <div className="mt-6">
        <Calculator />
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <section className="mx-auto mt-12 max-w-3xl px-4">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Questions fréquentes</h2>
      <div className="mt-6 divide-y divide-slate-200">
        {items.map((it) => (
          <details key={it.q} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 marker:content-none">
              {it.q}
              <span className="text-brand-500 transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600">{it.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

export function RelatedLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <section className="mx-auto mt-12 max-w-3xl px-4">
      <h2 className="text-lg font-semibold text-slate-900">Pages liées</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
            >
              {it.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

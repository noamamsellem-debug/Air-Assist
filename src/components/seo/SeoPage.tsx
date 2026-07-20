import { Link } from "@/i18n/navigation";
import { Calculator } from "@/components/Calculator";

/**
 * Briques partagées des pages SEO (service, compagnie, aéroport, destination,
 * blog). ~68 pages en dépendent : ce fichier est le point unique où se joue
 * leur habillage. Le CONTENU, la hiérarchie h1/h2/h3, les métadonnées et le
 * JSON-LD restent la responsabilité des gabarits appelants — ici, rien que
 * de la mise en forme.
 *
 * Contenu fourni en blocs structurés → rendu via expressions {} : pas de
 * texte JSX littéral (évite tout souci d'entités non échappées).
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

/** Plage Unicode des diacritiques combinants, isolés par la normalisation NFD. */
const DIACRITIQUES = /[̀-ͯ]/g;

/**
 * Identifiant d'ancre stable dérivé du titre : accents retirés, non-alphanum
 * réduits à des tirets. Sert au sommaire et aux liens profonds.
 */
export function ancre(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(DIACRITIQUES, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function ProseBlocks({ blocks }: { blocks: Bloc[] }) {
  return (
    <div className="prose-seo max-w-prose">
      {blocks.map((b, i) => {
        // Les h2 portent une ancre : le sommaire y renvoie, et les liens
        // profonds deviennent partageables. La hiérarchie est inchangée.
        if (b.type === "h2")
          return (
            <h2 key={i} id={ancre(b.text)} className="scroll-mt-24">
              <Inline text={b.text} />
            </h2>
          );
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

/**
 * Sommaire d'article : uniquement les h2, uniquement s'il y en a au moins
 * quatre — en dessous, un sommaire encombre plus qu'il n'aide.
 */
export function ProseToc({ blocks, titre }: { blocks: Bloc[]; titre: string }) {
  const h2s = blocks.filter((b): b is { type: "h2"; text: string } => b.type === "h2");
  if (h2s.length < 4) return null;

  return (
    <nav aria-label={titre} className="max-w-prose rounded-2xl border border-ink-200 bg-ink-50 p-5">
      <p className="board-label text-ink-500">{titre}</p>
      <ol className="mt-3 space-y-1.5">
        {h2s.map((h, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="font-mono text-xs text-ink-400" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${ancre(h.text)}`}
              className="text-ink-700 underline decoration-ink-300 underline-offset-2 transition-colors duration-fast hover:text-vol-700 hover:decoration-vol-500"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * En-tête de page SEO. Plus de bandeau dégradé : fond clair, le titre porte
 * le message. La barre supérieure reprend le registre du tableau (eyebrow en
 * mono) sans en faire un objet sombre — c'est du contenu de lecture.
 */
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
    <section className="border-b border-ink-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:pt-14">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-4 text-display-lg text-ink-900">{title}</h1>
        {lead && <p className="mt-5 max-w-prose text-prose-lg text-ink-600">{lead}</p>}
      </div>
    </section>
  );
}

/** Fil d'Ariane textuel (le JSON-LD BreadcrumbList reste chez l'appelant). */
export function SeoBreadcrumb({ courant, label }: { courant: string; label: string }) {
  return (
    <nav className="mx-auto max-w-3xl px-4 pt-6 text-sm text-ink-500" aria-label={label}>
      <Link href="/" className="transition-colors duration-fast hover:text-vol-700">
        Accueil
      </Link>
      <span className="px-2" aria-hidden>
        ›
      </span>
      <span className="text-ink-700">{courant}</span>
    </nav>
  );
}

export function EstimationSection({ title = "Calculez votre indemnité" }: { title?: string }) {
  return (
    <section className="mx-auto mt-10 max-w-xl px-4">
      <h2 className="text-display-sm text-ink-900">{title}</h2>
      <p className="mt-2 text-sm text-ink-600">
        Estimation gratuite, sans engagement. Le montant s&apos;affiche pendant la saisie.
      </p>
      <div className="mt-5">
        <Calculator />
      </div>
    </section>
  );
}

/**
 * Tableau des montants. Sur mobile, le tableau bascule en liste de cartes :
 * trois colonnes serrées sous 400 px sont illisibles, et un simple
 * défilement horizontal se rate au doigt.
 */
export function AmountTable({
  titre,
  lignes,
  note,
  // Libellé d'origine des trois gabarits — conservé tel quel : c'est du
  // contenu, pas de l'habillage.
  labelTrajet = "Trajet (exemple)",
}: {
  titre: string;
  lignes: { route: string; km: string; montant: string }[];
  note?: string;
  labelTrajet?: string;
}) {
  return (
    <>
      <h2 id={ancre(titre)} className="mt-12 scroll-mt-24 text-display-sm text-ink-900">
        {titre}
      </h2>

      {/* ≥ sm : vrai tableau. */}
      <div className="mt-5 hidden sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-[1.5px] border-ink-300">
              <th className="board-label px-1 pb-2.5 text-left text-ink-500">{labelTrajet}</th>
              <th className="board-label px-1 pb-2.5 text-left text-ink-500">Distance</th>
              <th className="board-label px-1 pb-2.5 text-right text-ink-500">Indemnité</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.route} className="border-b border-ink-100">
                <td className="px-1 py-3 font-medium text-ink-900">{l.route}</td>
                <td className="px-1 py-3 font-mono text-xs text-ink-500">{l.km}</td>
                <td className="px-1 py-3 text-right font-display font-bold text-vol-700">
                  {l.montant}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* < sm : une carte par ligne, montant mis en avant. */}
      <ul className="mt-5 space-y-2 sm:hidden">
        {lignes.map((l) => (
          <li
            key={l.route}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 px-4 py-3"
          >
            <span>
              <span className="block text-sm font-medium text-ink-900">{l.route}</span>
              <span className="mt-0.5 block font-mono text-xs text-ink-500">{l.km}</span>
            </span>
            <span className="font-display text-lg font-bold text-vol-700">{l.montant}</span>
          </li>
        ))}
      </ul>

      {note && <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-500">{note}</p>}
    </>
  );
}

/** Étapes numérotées (« comment réclamer »). */
export function StepList({ etapes }: { etapes: { titre: string; texte: string }[] }) {
  return (
    <ol className="mt-5 max-w-prose space-y-5">
      {etapes.map((e, i) => (
        <li key={e.titre} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-vol-500 font-mono text-xs font-bold text-vol-600">
            {i + 1}
          </span>
          <div>
            <p className="font-display font-semibold text-ink-900">{e.titre}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{e.texte}</p>
          </div>
        </li>
      ))}
    </ol>
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
    <section className="mx-auto mt-14 max-w-3xl px-4">
      <h2 className="text-display-sm text-ink-900">Questions fréquentes</h2>
      <div className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
        {items.map((it) => (
          <details key={it.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-base font-semibold text-ink-900 transition-colors duration-fast marker:content-none hover:text-vol-700">
              {it.q}
              <span
                aria-hidden
                className="relative h-4 w-4 flex-none text-vol-600 transition-transform duration-base group-open:rotate-45"
              >
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
              </span>
            </summary>
            <p className="max-w-prose pb-4 text-prose text-ink-600">{it.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/**
 * Maillage interne. `accent` distingue les liens transverses (barème, droits)
 * des liens latéraux, sans changer leur poids SEO.
 */
export function LinkPills({
  titre = "Pages liées",
  items,
}: {
  titre?: string;
  items: { href: string; label: string; accent?: boolean }[];
}) {
  return (
    <section className="mx-auto mt-14 max-w-3xl px-4">
      <h2 className="font-display text-base font-semibold text-ink-900">{titre}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`inline-flex rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-fast ${
                it.accent
                  ? "border border-vol-500/40 text-vol-700 hover:bg-vol-100"
                  : "bg-ink-100 text-ink-700 hover:bg-ink-200"
              }`}
            >
              {it.label}
              {it.accent ? " →" : ""}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Conserve l'ancienne signature (utilisée par les pages de 1re génération). */
export function RelatedLinks({ items }: { items: { href: string; label: string }[] }) {
  return <LinkPills items={items.map((i) => ({ ...i, accent: true }))} />;
}

/** Appel à l'action final : le tableau, en pleine largeur. */
export function SeoCta({
  titre,
  texte,
  libelleBouton = "Réclamer mon indemnisation",
}: {
  titre: string;
  texte: string;
  libelleBouton?: string;
}) {
  return (
    <section className="mx-auto mt-14 max-w-3xl px-4 pb-20">
      <div className="board on-board px-6 py-10 text-center sm:px-10">
        <h2 className="font-display text-display-sm text-white">{titre}</h2>
        <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-ink-300">{texte}</p>
        <Link href="/reclamation" className="btn-primary mt-6">
          {libelleBouton}
        </Link>
      </div>
    </section>
  );
}

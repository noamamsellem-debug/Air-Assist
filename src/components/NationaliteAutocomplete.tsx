"use client";

import { useState, useRef, useEffect } from "react";
import { NATIONALITES, type Nationalite } from "@/data/nationalites";

function rechercher(q: string, limite = 8): Nationalite[] {
  const s = q.trim().toLowerCase();
  if (s.length < 1) return [];
  return NATIONALITES.filter(
    (n) => n.nom.toLowerCase().includes(s) || n.en.toLowerCase().includes(s) || n.code.toLowerCase() === s,
  )
    .sort((a, b) => {
      const ax = a.nom.toLowerCase().startsWith(s) ? 0 : 1;
      const bx = b.nom.toLowerCase().startsWith(s) ? 0 : 1;
      return ax - bx || a.nom.localeCompare(b.nom, "fr");
    })
    .slice(0, limite);
}

/** Sélecteur de nationalité/pays avec recherche. `value` = nom (FR) stocké. */
export function NationaliteAutocomplete({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (nom: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const [requete, setRequete] = useState(value ?? "");
  const [ouvert, setOuvert] = useState(false);
  const [resultats, setResultats] = useState<Nationalite[]>([]);
  const [surligne, setSurligne] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clic(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
    }
    document.addEventListener("mousedown", clic);
    return () => document.removeEventListener("mousedown", clic);
  }, []);

  function maj(q: string) {
    setRequete(q);
    onChange(""); // tant qu'aucune suggestion n'est choisie
    const r = rechercher(q);
    setResultats(r);
    setOuvert(r.length > 0);
    setSurligne(0);
  }

  function choisir(n: Nationalite) {
    onChange(n.nom);
    setRequete(n.nom);
    setOuvert(false);
  }

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        className="input"
        autoComplete="off"
        placeholder={placeholder}
        value={requete}
        onChange={(e) => maj(e.target.value)}
        onFocus={() => {
          const r = rechercher(requete);
          setResultats(r);
          setOuvert(r.length > 0);
        }}
        onKeyDown={(e) => {
          if (!ouvert) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setSurligne((s) => Math.min(s + 1, resultats.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setSurligne((s) => Math.max(s - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); const n = resultats[surligne]; if (n) choisir(n); }
          else if (e.key === "Escape") setOuvert(false);
        }}
        aria-autocomplete="list"
        aria-expanded={ouvert}
        role="combobox"
      />
      {ouvert && resultats.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-ink-200 bg-white shadow-lg">
          {resultats.map((n, i) => (
            <li key={n.code}>
              <button
                type="button"
                onMouseEnter={() => setSurligne(i)}
                onClick={() => choisir(n)}
                className={`w-full px-3 py-2 text-left text-sm ${i === surligne ? "bg-vol-100" : "hover:bg-ink-50"}`}
              >
                {n.nom}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

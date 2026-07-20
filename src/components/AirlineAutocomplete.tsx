"use client";

import { useState, useRef, useEffect } from "react";
import { rechercherCompagnies, getCompagnieParCode } from "@/data/compagnies-search";
import type { CompagnieReference } from "@/data/compagnies-reference";

/**
 * Autocomplete compagnie aérienne : l'utilisateur tape (nom ou code IATA),
 * choisit une suggestion. `value` = code IATA sélectionné ; `onChange(code, nom)`.
 */
export function AirlineAutocomplete({
  value,
  nom,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  nom?: string;
  onChange: (code: string, nom: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const initiale = value ? getCompagnieParCode(value) : undefined;
  const [requete, setRequete] = useState(
    initiale ? `${initiale.nom} (${initiale.code})` : nom ?? "",
  );
  const [ouvert, setOuvert] = useState(false);
  const [resultats, setResultats] = useState<CompagnieReference[]>([]);
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
    onChange("", ""); // tant qu'aucune suggestion n'est choisie
    const r = rechercherCompagnies(q);
    setResultats(r);
    setOuvert(r.length > 0);
    setSurligne(0);
  }

  function choisir(c: CompagnieReference) {
    onChange(c.code, c.nom);
    setRequete(`${c.nom} (${c.code})`);
    setOuvert(false);
  }

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        className="input"
        autoComplete="off"
        placeholder={placeholder ?? "Tapez une compagnie ou un code IATA"}
        value={requete}
        onChange={(e) => maj(e.target.value)}
        onFocus={() => {
          if (requete.length >= 2) {
            const r = rechercherCompagnies(requete);
            setResultats(r);
            setOuvert(r.length > 0);
          }
        }}
        onKeyDown={(e) => {
          if (!ouvert) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSurligne((s) => Math.min(s + 1, resultats.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSurligne((s) => Math.max(s - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const c = resultats[surligne];
            if (c) choisir(c);
          } else if (e.key === "Escape") {
            setOuvert(false);
          }
        }}
        aria-autocomplete="list"
        aria-expanded={ouvert}
        role="combobox"
      />
      {ouvert && resultats.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-ink-200 bg-white shadow-lg">
          {resultats.map((c, i) => (
            <li key={c.code}>
              <button
                type="button"
                onMouseEnter={() => setSurligne(i)}
                onClick={() => choisir(c)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm ${
                  i === surligne ? "bg-vol-100" : "hover:bg-ink-50"
                }`}
              >
                <span className="font-medium text-ink-800">{c.nom}</span>
                <span className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-xs text-ink-600">{c.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

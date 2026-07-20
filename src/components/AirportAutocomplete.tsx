"use client";

import { useState, useRef, useEffect } from "react";
import { rechercherAeroports, getAeroport, type Aeroport } from "@/data/aeroports";

export function AirportAutocomplete({
  value,
  onChange,
  placeholder,
  id,
  variant = "clair",
}: {
  /** Code IATA sélectionné (ou ""). */
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
  id?: string;
  /** `board` : champ posé sur le tableau sombre (estimateur). */
  variant?: "clair" | "board";
}) {
  const surBoard = variant === "board";
  const selectionne = value ? getAeroport(value) : undefined;
  const [requete, setRequete] = useState(
    selectionne ? `${selectionne.ville} (${selectionne.iata})` : "",
  );
  const [ouvert, setOuvert] = useState(false);
  const [resultats, setResultats] = useState<Aeroport[]>([]);
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
    const r = rechercherAeroports(q);
    setResultats(r);
    setOuvert(r.length > 0);
    setSurligne(0);
  }

  function choisir(a: Aeroport) {
    onChange(a.iata);
    setRequete(`${a.ville} (${a.iata})`);
    setOuvert(false);
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          id={id}
          className={`${surBoard ? "input-board" : "input"} pr-9`}
          autoComplete="off"
          placeholder={placeholder ?? "Tapez une ville ou un code IATA"}
          value={requete}
          onChange={(e) => maj(e.target.value)}
          onFocus={() => {
            if (requete.length >= 2) {
              const r = rechercherAeroports(requete);
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
              const a = resultats[surligne];
              if (a) choisir(a);
            } else if (e.key === "Escape") {
              setOuvert(false);
            }
          }}
          aria-autocomplete="list"
          aria-expanded={ouvert}
          role="combobox"
        />
        {value && (
          <button
            type="button"
            aria-label="Effacer"
            onClick={() => {
              onChange("");
              setRequete("");
              setResultats([]);
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              surBoard ? "text-ink-400 hover:text-white" : "text-ink-400 hover:text-ink-700"
            }`}
          >
            ✕
          </button>
        )}
      </div>

      {ouvert && resultats.length > 0 && (
        // La liste reste claire même sur le tableau sombre : c'est une surface
        // flottante, et du texte long se lit mieux sur fond clair.
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-ink-200 bg-white shadow-lift">
          {resultats.map((a, i) => (
            <li key={a.iata}>
              <button
                type="button"
                onMouseEnter={() => setSurligne(i)}
                onClick={() => choisir(a)}
                className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm ${
                  i === surligne ? "bg-vol-100" : "hover:bg-ink-50"
                }`}
              >
                <span>
                  <span className="font-medium text-ink-900">{a.ville}</span>{" "}
                  <span className="text-ink-500">— {a.nom}</span>
                </span>
                <span className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-ink-600">
                  {a.iata}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

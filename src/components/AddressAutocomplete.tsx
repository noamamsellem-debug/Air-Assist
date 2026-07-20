"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { AddressSuggestion } from "@/lib/address";

export interface AddressValue {
  ligne1: string;
  complement: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export const adresseVide: AddressValue = {
  ligne1: "",
  complement: "",
  codePostal: "",
  ville: "",
  pays: "",
};

/**
 * Champ d'adresse avec autocomplétion (via /api/address) + saisie manuelle
 * toujours possible en repli. Les champs structurés restent éditables.
 */
export function AddressAutocomplete({
  value,
  onChange,
}: {
  value: AddressValue;
  onChange: (v: AddressValue) => void;
}) {
  const t = useTranslations("address");
  const locale = useLocale();
  const [requete, setRequete] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur.
  useEffect(() => {
    function clic(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
    }
    document.addEventListener("mousedown", clic);
    return () => document.removeEventListener("mousedown", clic);
  }, []);

  // Débounce ~300 ms + annulation de la requête précédente.
  useEffect(() => {
    if (requete.trim().length < 3) {
      setSuggestions([]);
      setOuvert(false);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setChargement(true);
      setErreur(false);
      try {
        const res = await fetch(
          `/api/address?q=${encodeURIComponent(requete)}&locale=${locale}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        if (data.erreur) setErreur(true);
        setSuggestions(data.suggestions ?? []);
        setOuvert(true);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setErreur(true);
          setSuggestions([]);
          setOuvert(true);
        }
      } finally {
        setChargement(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [requete, locale]);

  function choisir(s: AddressSuggestion) {
    onChange({
      ...value,
      ligne1: s.ligne1,
      codePostal: s.codePostal,
      ville: s.ville,
      pays: s.pays,
    });
    setRequete("");
    setSuggestions([]);
    setOuvert(false);
  }

  const set = (champ: keyof AddressValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [champ]: e.target.value });

  return (
    <div className="space-y-3">
      <div ref={ref} className="relative">
        <label className="label">{t("search")}</label>
        <input
          className="input"
          autoComplete="off"
          placeholder={t("searchPlaceholder")}
          value={requete}
          onChange={(e) => setRequete(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOuvert(true)}
        />
        {chargement && <p className="mt-1 text-xs text-ink-400">{t("loading")}</p>}
        {erreur && <p className="mt-1 text-xs text-amber-600">{t("error")}</p>}
        {ouvert && !erreur && suggestions.length === 0 && !chargement && requete.trim().length >= 3 && (
          <p className="mt-1 text-xs text-ink-400">{t("noResults")}</p>
        )}
        {ouvert && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-ink-200 bg-white shadow-lg">
            {suggestions.map((s, i) => (
              <li key={`${s.label}-${i}`}>
                <button
                  type="button"
                  onClick={() => choisir(s)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-vol-100"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Champs structurés — éditables (repli manuel toujours possible). */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">{t("line1")}</label>
          <input className="input" value={value.ligne1} onChange={set("ligne1")} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">{t("complement")}</label>
          <input className="input" value={value.complement} onChange={set("complement")} />
        </div>
        <div>
          <label className="label">{t("postcode")}</label>
          <input className="input" value={value.codePostal} onChange={set("codePostal")} />
        </div>
        <div>
          <label className="label">{t("city")}</label>
          <input className="input" value={value.ville} onChange={set("ville")} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">{t("country")}</label>
          <input className="input" value={value.pays} onChange={set("pays")} />
        </div>
      </div>
    </div>
  );
}

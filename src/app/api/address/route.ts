import { NextResponse } from "next/server";
import { getAddressProvider } from "@/lib/address";

/**
 * Proxy serveur d'autocomplétion d'adresse. Centralise l'appel au fournisseur
 * (et garderait une éventuelle clé API secrète, jamais exposée au client).
 * En cas d'échec réseau/quota : 200 + { suggestions: [], erreur: true } pour
 * que le front bascule proprement en saisie manuelle.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const locale = searchParams.get("locale") ?? "fr";
  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }
  try {
    const provider = getAddressProvider();
    const suggestions = await provider.search(q, locale);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("Autocomplétion adresse indisponible :", err);
    return NextResponse.json({ suggestions: [], erreur: true });
  }
}

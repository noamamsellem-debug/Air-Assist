import Image from "next/image";

/**
 * Logo AirAssist (header) — vrai visuel fourni, fond transparent.
 * Hauteur fixe (réduite sur mobile), largeur auto pour rester net et sans
 * décalage de mise en page.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/airassist-logo-header.png"
      alt="AirAssist"
      width={326}
      height={240}
      priority
      className={`h-9 w-auto sm:h-11 ${className ?? ""}`}
    />
  );
}

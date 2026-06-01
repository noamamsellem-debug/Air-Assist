import type { Prisma } from "@prisma/client";

type Montant = number | string | Prisma.Decimal | null | undefined;

/** Formate un montant (Decimal/number/string) en euros. */
export function euros(montant: Montant, locale = "fr-FR"): string {
  const n = montant == null ? 0 : Number(montant.toString());
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n);
}

export function dateCourte(d: Date | string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(d));
}

export function dateHeure(d: Date | string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(d),
  );
}

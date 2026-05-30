import { describe, it, expect } from "vitest";
import {
  repartirCents,
  repartirEuros,
  tauxCommissionConfigure,
  TAUX_COMMISSION_DEFAUT,
} from "@/domain/commission";
import { eurosToCents, centsToEuros, formatEuros } from "@/domain/money";

describe("repartirCents — répartition 30/70", () => {
  it("répartit 250 € en 75 € / 175 €", () => {
    const r = repartirCents(25000);
    expect(r.commissionCents).toBe(7500);
    expect(r.partClientCents).toBe(17500);
  });

  it("répartit 400 € en 120 € / 280 €", () => {
    const r = repartirCents(40000);
    expect(r.commissionCents).toBe(12000);
    expect(r.partClientCents).toBe(28000);
  });

  it("répartit 600 € en 180 € / 420 €", () => {
    const r = repartirCents(60000);
    expect(r.commissionCents).toBe(18000);
    expect(r.partClientCents).toBe(42000);
  });

  it("gère le montant zéro", () => {
    const r = repartirCents(0);
    expect(r.commissionCents).toBe(0);
    expect(r.partClientCents).toBe(0);
  });

  it("INVARIANT : commission + partClient === montant, pour 0..100000 centimes", () => {
    for (let cents = 0; cents <= 100000; cents += 7) {
      const r = repartirCents(cents);
      expect(r.commissionCents + r.partClientCents).toBe(cents);
    }
  });

  it("arrondit la commission au centime (montant non rond)", () => {
    // 333 centimes * 0.30 = 99.9 -> arrondi 100 ; client = 233
    const r = repartirCents(333);
    expect(r.commissionCents).toBe(100);
    expect(r.partClientCents).toBe(233);
    expect(r.commissionCents + r.partClientCents).toBe(333);
  });

  it("accepte un taux personnalisé (ex 25 %)", () => {
    const r = repartirCents(40000, 0.25);
    expect(r.commissionCents).toBe(10000);
    expect(r.partClientCents).toBe(30000);
  });

  it("taux 0 % => toute la somme au client", () => {
    const r = repartirCents(40000, 0);
    expect(r.commissionCents).toBe(0);
    expect(r.partClientCents).toBe(40000);
  });

  it("taux 100 % => toute la somme en commission", () => {
    const r = repartirCents(40000, 1);
    expect(r.commissionCents).toBe(40000);
    expect(r.partClientCents).toBe(0);
  });
});

describe("repartirCents — cas d'erreur", () => {
  it("refuse un montant négatif", () => {
    expect(() => repartirCents(-1)).toThrow(/négatif/);
  });

  it("refuse un montant non entier (centimes)", () => {
    expect(() => repartirCents(100.5)).toThrow(/non entier/);
  });

  it("refuse un taux > 1", () => {
    expect(() => repartirCents(100, 1.5)).toThrow(/bornes/);
  });

  it("refuse un taux < 0", () => {
    expect(() => repartirCents(100, -0.1)).toThrow(/bornes/);
  });
});

describe("repartirEuros — variante euros", () => {
  it("répartit 600 € en 180 / 420", () => {
    const r = repartirEuros(600);
    expect(r.commission).toBe(180);
    expect(r.partClient).toBe(420);
    expect(r.montantObtenu).toBe(600);
  });

  it("accepte une chaîne (\"250.00\")", () => {
    const r = repartirEuros("250.00");
    expect(r.commission).toBe(75);
    expect(r.partClient).toBe(175);
  });

  it("gère un montant avec centimes (123.45 €)", () => {
    const r = repartirEuros(123.45);
    // 12345 * 0.30 = 3703.5 -> arrondi 3704 ; client = 8641
    expect(r.commission).toBe(37.04);
    expect(r.partClient).toBe(86.41);
    expect(Math.round((r.commission + r.partClient) * 100)).toBe(12345);
  });
});

describe("money — conversions", () => {
  it("eurosToCents arrondit au centime le plus proche", () => {
    expect(eurosToCents(1)).toBe(100);
    expect(eurosToCents(1.006)).toBe(101); // 100.6 -> 101
    expect(eurosToCents(1.004)).toBe(100); // 100.4 -> 100
    expect(eurosToCents("12.34")).toBe(1234);
  });

  it("centsToEuros", () => {
    expect(centsToEuros(7500)).toBe(75);
  });

  it("centsToEuros refuse les non-entiers", () => {
    expect(() => centsToEuros(100.5)).toThrow(/non entiers/);
  });

  it("formatEuros produit une chaîne EUR", () => {
    const s = formatEuros(25000);
    expect(s).toContain("250");
    expect(s).toContain("€");
  });
});

describe("tauxCommissionConfigure", () => {
  it("repli sur 30 % si non défini", () => {
    expect(tauxCommissionConfigure({})).toBe(TAUX_COMMISSION_DEFAUT);
  });

  it("lit COMMISSION_RATE", () => {
    expect(tauxCommissionConfigure({ COMMISSION_RATE: "0.25" })).toBe(0.25);
  });

  it("refuse une valeur invalide", () => {
    expect(() => tauxCommissionConfigure({ COMMISSION_RATE: "abc" })).toThrow(/invalide/);
    expect(() => tauxCommissionConfigure({ COMMISSION_RATE: "2" })).toThrow(/invalide/);
  });
});

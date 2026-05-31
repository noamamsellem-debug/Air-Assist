import { describe, it, expect } from "vitest";
import { genererReclamation, type DonneesReclamation } from "@/lib/claim-template";

const base: DonneesReclamation = {
  reference: "AA-2026-000001",
  passagerNom: "Martin",
  passagerPrenom: "Camille",
  compagnieNom: "Air France",
  numeroVol: "AF1234",
  dateVol: "12/03/2026",
  aeroportDepart: "CDG",
  aeroportArrivee: "LIS",
  pnr: "ABC123",
  montantReclame: 250,
  motif: "Retard",
  pieces: ["Carte d'embarquement", "Mandat signé"],
};

describe("genererReclamation", () => {
  it("FR : contient les éléments réglementaires", () => {
    const c = genererReclamation(base, "fr");
    expect(c.langue).toBe("fr");
    expect(c.sujet).toContain("EC 261/2004");
    expect(c.sujet).toContain("AF1234");
    expect(c.corps).toContain("261/2004");
    expect(c.corps).toContain("250.00 €");
    expect(c.corps).toContain("Camille Martin");
    expect(c.corps).toContain("ABC123");
    expect(c.corps).toContain("Carte d'embarquement");
    expect(c.corps).toContain("AA-2026-000001");
  });

  it("EN : sujet et corps en anglais", () => {
    const c = genererReclamation(base, "en");
    expect(c.corps).toContain("Regulation (EC) No 261/2004");
    expect(c.corps).toContain("on behalf of");
  });

  it("ES : sujet et corps en espagnol", () => {
    const c = genererReclamation(base, "es");
    expect(c.corps).toContain("Reglamento (CE) n.º 261/2004");
    expect(c.corps).toContain("en nombre de");
  });

  it("gère un PNR absent", () => {
    const c = genererReclamation({ ...base, pnr: null }, "fr");
    expect(c.corps).not.toContain("PNR");
  });

  it("liste des pièces vide ⇒ tiret", () => {
    const c = genererReclamation({ ...base, pieces: [] }, "fr");
    expect(c.corps).toContain("- —");
  });
});

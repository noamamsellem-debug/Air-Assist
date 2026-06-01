import { describe, it, expect } from "vitest";
import {
  evaluerEligibilite,
  montantParDistance,
  SEUIL_RETARD_MIN,
} from "@/domain/eligibilite";

describe("montantParDistance — barème", () => {
  it("250 € jusqu'à 1500 km", () => {
    expect(montantParDistance(500, false)).toBe(250);
    expect(montantParDistance(1500, false)).toBe(250);
  });
  it("400 € entre 1500 et 3500 km", () => {
    expect(montantParDistance(1501, false)).toBe(400);
    expect(montantParDistance(3500, false)).toBe(400);
  });
  it("600 € au-delà de 3500 km (hors UE)", () => {
    expect(montantParDistance(3501, false)).toBe(600);
    expect(montantParDistance(10000, false)).toBe(600);
  });
  it("400 € pour un intra-UE > 3500 km", () => {
    expect(montantParDistance(4000, true)).toBe(400);
  });
});

describe("evaluerEligibilite — retard", () => {
  it("éligible 250 € : court-courrier, retard 3 h pile", () => {
    const r = evaluerEligibilite({
      distanceKm: 1000,
      motif: "RETARD",
      dureeRetardMin: SEUIL_RETARD_MIN,
    });
    expect(r.eligible).toBe(true);
    expect(r.montant).toBe(250);
  });

  it("non éligible : retard de 2 h 59", () => {
    const r = evaluerEligibilite({
      distanceKm: 1000,
      motif: "RETARD",
      dureeRetardMin: 179,
    });
    expect(r.eligible).toBe(false);
    expect(r.code).toBe("RETARD_INSUFFISANT");
    expect(r.montant).toBe(0);
  });

  it("retard absent (null) ⇒ non éligible", () => {
    const r = evaluerEligibilite({
      distanceKm: 1000,
      motif: "RETARD",
      dureeRetardMin: null,
    });
    expect(r.eligible).toBe(false);
    expect(r.code).toBe("RETARD_INSUFFISANT");
  });

  it("éligible 400 € : moyen-courrier 2000 km", () => {
    const r = evaluerEligibilite({
      distanceKm: 2000,
      motif: "RETARD",
      dureeRetardMin: 200,
    });
    expect(r.montant).toBe(400);
  });
});

describe("evaluerEligibilite — long-courrier & réduction 50 %", () => {
  it("réduction 50 % : >3500 km hors UE, retard 3–4 h ⇒ 300 €", () => {
    const r = evaluerEligibilite({
      distanceKm: 6000,
      motif: "RETARD",
      dureeRetardMin: 200,
      intraUe: false,
    });
    expect(r.eligible).toBe(true);
    expect(r.montant).toBe(300);
    expect(r.montantPlein).toBe(600);
    expect(r.reductionAppliquee).toBe(true);
  });

  it("pas de réduction : retard ≥ 4 h ⇒ 600 €", () => {
    const r = evaluerEligibilite({
      distanceKm: 6000,
      motif: "RETARD",
      dureeRetardMin: 240,
      intraUe: false,
    });
    expect(r.montant).toBe(600);
    expect(r.reductionAppliquee).toBe(false);
  });

  it("intra-UE > 3500 km : pas de réduction, 400 €", () => {
    const r = evaluerEligibilite({
      distanceKm: 4000,
      motif: "RETARD",
      dureeRetardMin: 200,
      intraUe: true,
    });
    expect(r.montant).toBe(400);
    expect(r.reductionAppliquee).toBe(false);
  });
});

describe("evaluerEligibilite — annulation", () => {
  it("éligible si préavis court", () => {
    const r = evaluerEligibilite({
      distanceKm: 2000,
      motif: "ANNULATION",
      preavisAnnulationJours: 3,
    });
    expect(r.eligible).toBe(true);
    expect(r.montant).toBe(400);
  });

  it("non éligible si préavis ≥ 14 jours", () => {
    const r = evaluerEligibilite({
      distanceKm: 2000,
      motif: "ANNULATION",
      preavisAnnulationJours: 20,
    });
    expect(r.eligible).toBe(false);
    expect(r.code).toBe("PREAVIS_SUFFISANT");
  });

  it("éligible si préavis non renseigné", () => {
    const r = evaluerEligibilite({ distanceKm: 800, motif: "ANNULATION" });
    expect(r.eligible).toBe(true);
    expect(r.montant).toBe(250);
  });
});

describe("evaluerEligibilite — surbooking", () => {
  it("éligible sans condition de retard", () => {
    const r = evaluerEligibilite({ distanceKm: 6000, motif: "SURBOOKING" });
    expect(r.eligible).toBe(true);
    expect(r.montant).toBe(600);
  });
});

describe("evaluerEligibilite — exclusions & garde-fous", () => {
  it("circonstances extraordinaires ⇒ non éligible quel que soit le retard", () => {
    const r = evaluerEligibilite({
      distanceKm: 2000,
      motif: "RETARD",
      dureeRetardMin: 600,
      circonstanceExtraordinaire: true,
    });
    expect(r.eligible).toBe(false);
    expect(r.code).toBe("CIRCONSTANCE_EXTRAORDINAIRE");
  });

  it("distance invalide ⇒ non éligible", () => {
    const r = evaluerEligibilite({ distanceKm: 0, motif: "SURBOOKING" });
    expect(r.eligible).toBe(false);
    expect(r.code).toBe("DISTANCE_INVALIDE");
  });

  it("correspondance manquée se comporte comme un retard", () => {
    const ok = evaluerEligibilite({
      distanceKm: 2000,
      motif: "CORRESPONDANCE_MANQUEE",
      dureeRetardMin: 200,
    });
    expect(ok.eligible).toBe(true);
    const ko = evaluerEligibilite({
      distanceKm: 2000,
      motif: "CORRESPONDANCE_MANQUEE",
      dureeRetardMin: 60,
    });
    expect(ko.eligible).toBe(false);
  });
});

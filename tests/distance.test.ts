import { describe, it, expect } from "vitest";
import { distanceHaversineKm, trajetEntreAeroports } from "@/domain/distance";

describe("distanceHaversineKm", () => {
  it("distance nulle entre un point et lui-même", () => {
    expect(distanceHaversineKm(48.85, 2.35, 48.85, 2.35)).toBeCloseTo(0, 5);
  });

  it("CDG → JFK ≈ 5830 km (±50)", () => {
    const d = distanceHaversineKm(49.0097, 2.5479, 40.6413, -73.7781);
    expect(d).toBeGreaterThan(5750);
    expect(d).toBeLessThan(5900);
  });
});

describe("trajetEntreAeroports", () => {
  it("CDG → LIS : intra-UE, ~1450 km", () => {
    const t = trajetEntreAeroports("CDG", "LIS");
    expect(t.connu).toBe(true);
    expect(t.intraUe).toBe(true);
    expect(t.distanceKm).toBeGreaterThan(1400);
    expect(t.distanceKm).toBeLessThan(1500);
  });

  it("CDG → JFK : hors UE, long-courrier", () => {
    const t = trajetEntreAeroports("CDG", "JFK");
    expect(t.intraUe).toBe(false);
    expect(t.distanceKm).toBeGreaterThan(3500);
  });

  it("CDG → LHR : hors UE (Royaume-Uni)", () => {
    const t = trajetEntreAeroports("cdg", "lhr");
    expect(t.connu).toBe(true);
    expect(t.intraUe).toBe(false);
  });

  it("aéroport inconnu ⇒ connu=false", () => {
    const t = trajetEntreAeroports("CDG", "ZZZ");
    expect(t.connu).toBe(false);
  });
});

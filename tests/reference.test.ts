import { describe, it, expect } from "vitest";
import { genererReferenceDossier } from "@/domain/reference";

describe("genererReferenceDossier", () => {
  it("formate avec séquence sur 6 chiffres", () => {
    expect(genererReferenceDossier(2026, 123)).toBe("AA-2026-000123");
  });

  it("gère la première séquence", () => {
    expect(genererReferenceDossier(2026, 1)).toBe("AA-2026-000001");
  });

  it("gère la séquence max", () => {
    expect(genererReferenceDossier(2026, 999999)).toBe("AA-2026-999999");
  });

  it("refuse une séquence hors plage", () => {
    expect(() => genererReferenceDossier(2026, 0)).toThrow(/plage/);
    expect(() => genererReferenceDossier(2026, 1000000)).toThrow(/plage/);
  });
});

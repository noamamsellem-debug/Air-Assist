import { describe, it, expect } from "vitest";
import {
  peutTransiter,
  transitionsPossibles,
  appliquerTransition,
  TransitionInterditeError,
  STATUTS_TERMINAUX,
  TRANSITIONS,
} from "@/domain/statut";

describe("machine à états — transitions valides", () => {
  it("suit le chemin nominal complet", () => {
    const chemin = [
      "NOUVEAU",
      "VERIFIE",
      "RECLAMATION_ENVOYEE",
      "ACCUSE_RECU",
      "EN_NEGOCIATION",
      "ACCEPTE",
      "PAYE",
      "REVERSE",
    ] as const;
    for (let i = 0; i < chemin.length - 1; i++) {
      const de = chemin[i]!;
      const vers = chemin[i + 1]!;
      expect(peutTransiter(de, vers)).toBe(true);
      expect(appliquerTransition(de, vers)).toBe(vers);
    }
  });

  it("permet de refuser depuis les étapes amont", () => {
    expect(peutTransiter("NOUVEAU", "REFUSE")).toBe(true);
    expect(peutTransiter("VERIFIE", "REFUSE")).toBe(true);
    expect(peutTransiter("EN_NEGOCIATION", "REFUSE")).toBe(true);
  });

  it("permet le passage au contentieux puis une résolution", () => {
    expect(peutTransiter("EN_NEGOCIATION", "CONTENTIEUX")).toBe(true);
    expect(peutTransiter("REFUSE", "CONTENTIEUX")).toBe(true);
    expect(peutTransiter("CONTENTIEUX", "ACCEPTE")).toBe(true);
  });
});

describe("machine à états — transitions interdites", () => {
  it("interdit de sauter des étapes", () => {
    expect(peutTransiter("NOUVEAU", "PAYE")).toBe(false);
    expect(peutTransiter("VERIFIE", "REVERSE")).toBe(false);
    expect(peutTransiter("NOUVEAU", "ACCEPTE")).toBe(false);
  });

  it("interdit de revenir en arrière", () => {
    expect(peutTransiter("VERIFIE", "NOUVEAU")).toBe(false);
    expect(peutTransiter("PAYE", "ACCEPTE")).toBe(false);
  });

  it("REVERSE est terminal", () => {
    expect(transitionsPossibles("REVERSE")).toHaveLength(0);
    expect(STATUTS_TERMINAUX).toContain("REVERSE");
  });

  it("appliquerTransition lève une erreur typée sur transition interdite", () => {
    expect(() => appliquerTransition("NOUVEAU", "PAYE")).toThrow(
      TransitionInterditeError,
    );
    try {
      appliquerTransition("NOUVEAU", "PAYE");
    } catch (e) {
      expect(e).toBeInstanceOf(TransitionInterditeError);
      expect((e as TransitionInterditeError).depuis).toBe("NOUVEAU");
      expect((e as TransitionInterditeError).vers).toBe("PAYE");
    }
  });

  it("interdit la transition vers soi-même", () => {
    for (const s of Object.keys(TRANSITIONS) as (keyof typeof TRANSITIONS)[]) {
      expect(peutTransiter(s, s)).toBe(false);
    }
  });
});

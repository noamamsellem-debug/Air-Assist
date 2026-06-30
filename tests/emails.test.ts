import { describe, it, expect } from "vitest";
import { construireEmail, emailPourStatut, type TypeEmail, type VariablesEmail } from "@/lib/emails";

const vars: VariablesEmail = {
  prenom: "Camille",
  compagnie: "Vueling",
  depart: "LGW",
  arrivee: "RMO",
  dateVol: "22/06/2026",
  reference: "AA-2026-000123",
  montantEstime: 400,
  montantObtenu: 400,
  partClient: 280,
  commission: 120,
  lienSuivi: "https://airassist.eu/fr/suivi",
  lienVersement: "https://airassist.eu/fr/suivi",
  documentManquant: "Carte d'embarquement lisible",
  motifRefus: "Circonstances extraordinaires invoquées",
  annee: 2026,
  siteUrl: "https://airassist.eu",
};

const TOUS: TypeEmail[] = [
  "ACCUSE_RECEPTION",
  "DOCUMENT_MANQUANT",
  "RELANCE_DOCUMENT",
  "RECLAMATION_ENVOYEE",
  "INDEMNITE_OBTENUE",
  "VERSEMENT_EFFECTUE",
  "REFUSE",
];

describe("emails — rendu des 7 templates", () => {
  for (const type of TOUS) {
    it(`${type} : sujet + référence + logo + charte présents`, () => {
      const r = construireEmail(type, vars);
      expect(r.sujet.length).toBeGreaterThan(5);
      expect(r.sujet).toContain(vars.reference); // référence dans le sujet
      expect(r.html).toContain(vars.reference); // et dans le corps
      expect(r.html).toContain("#0060FF"); // couleur de marque
      expect(r.html).toContain("airassist-logo-header.png"); // logo
      expect(r.html).toContain("L'équipe AirAssist"); // signature
      expect(r.html).toContain("/fr/mentions-legales"); // pied de page légal
      expect(r.texte).toContain(vars.reference); // version texte aussi
    });
  }

  it("INDEMNITE_OBTENUE affiche part client + commission", () => {
    const r = construireEmail("INDEMNITE_OBTENUE", vars);
    expect(r.html).toContain("280,00");
    expect(r.html).toContain("120,00");
    expect(r.html).toContain(vars.lienVersement);
  });

  it("DOCUMENT_MANQUANT injecte le texte libre du document", () => {
    const r = construireEmail("DOCUMENT_MANQUANT", vars);
    expect(r.html).toContain("Carte d'embarquement lisible");
  });

  it("REFUSE injecte le motif de refus", () => {
    const r = construireEmail("REFUSE", vars);
    expect(r.html).toContain("Circonstances extraordinaires");
  });
});

describe("emails — mapping statut → type", () => {
  it("mappe les statuts attendus", () => {
    expect(emailPourStatut("DOCUMENT_MANQUANT")).toBe("DOCUMENT_MANQUANT");
    expect(emailPourStatut("RECLAMATION_ENVOYEE")).toBe("RECLAMATION_ENVOYEE");
    expect(emailPourStatut("ACCEPTE")).toBe("INDEMNITE_OBTENUE");
    expect(emailPourStatut("REVERSE")).toBe("VERSEMENT_EFFECTUE");
    expect(emailPourStatut("REFUSE")).toBe("REFUSE");
  });

  it("n'envoie pas d'e-mail pour NOUVEAU/VERIFIE/PAYE", () => {
    expect(emailPourStatut("NOUVEAU")).toBeNull();
    expect(emailPourStatut("VERIFIE")).toBeNull();
    expect(emailPourStatut("PAYE")).toBeNull();
  });
});

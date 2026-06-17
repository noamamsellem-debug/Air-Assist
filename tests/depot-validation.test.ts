import { describe, it, expect } from "vitest";
import { depotSchema } from "@/lib/validation";

const fichier = { nomFichier: "doc.png", mimeType: "image/png", contenuBase64: "QUJD" };

function depotValide() {
  return {
    montantEstime: 400,
    distanceKm: 2000,
    intraUe: true,
    typeTrajet: "DIRECT" as "DIRECT" | "CORRESPONDANCE",
    reservationUnique: null as boolean | null,
    pnr: "ABC123",
    motif: "RETARD" as const,
    segments: [
      { ordre: 1, numeroVol: "AF1234", compagnie: "Air France", date: "2026-03-01", aeroportDepart: "CDG", aeroportArrivee: "JFK" },
    ],
    passager: {
      civilite: "M" as const,
      nom: "Martin",
      prenom: "Camille",
      dateNaissance: "1990-05-05",
      nationalite: "Française",
      adresse: { ligne1: "8 Boulevard du Port", complement: "", codePostal: "80000", ville: "Amiens", pays: "France" },
    },
    email: "camille@example.com",
    telephone: "+33600000000",
    pieceIdentite: { ...fichier, sousType: "CNI" as const },
    justificatifsVoyage: [{ ...fichier, sousType: "CARTE_EMBARQUEMENT" as const }],
    consentementRgpd: true as const,
    accepteCgv: true as const,
    versionCgv: "2026-01-v1",
  };
}

describe("depotSchema — dépôt complet", () => {
  it("accepte un dépôt complet (vol direct)", () => {
    expect(depotSchema.safeParse(depotValide()).success).toBe(true);
  });

  it("refuse sans pièce d'identité", () => {
    const d = depotValide() as Record<string, unknown>;
    delete d.pieceIdentite;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse sans aucun justificatif de voyage", () => {
    const d = depotValide();
    d.justificatifsVoyage = [];
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse un PNR invalide", () => {
    const d = depotValide();
    d.pnr = "AB1"; // trop court
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse une identité incomplète (nationalité manquante)", () => {
    const d = depotValide();
    d.passager.nationalite = "";
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse une adresse incomplète (code postal manquant)", () => {
    const d = depotValide();
    d.passager.adresse.codePostal = "";
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse si le consentement RGPD n'est pas coché", () => {
    const d = depotValide() as Record<string, unknown>;
    d.consentementRgpd = false;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse un format de document non autorisé", () => {
    const d = depotValide();
    d.pieceIdentite.mimeType = "image/gif";
    expect(depotSchema.safeParse(d).success).toBe(false);
  });
});

describe("depotSchema — correspondance", () => {
  it("refuse une correspondance avec un seul segment", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE" as never;
    d.reservationUnique = true as never;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse une correspondance sans réponse 'réservation unique'", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE" as never;
    d.segments = [
      { ordre: 1, numeroVol: "AF1234", compagnie: "Air France", date: "2026-03-01", aeroportDepart: "CDG", aeroportArrivee: "AMS" },
      { ordre: 2, numeroVol: "KL5678", compagnie: "KLM", date: "2026-03-01", aeroportDepart: "AMS", aeroportArrivee: "JFK" },
    ];
    d.reservationUnique = null;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("accepte une correspondance valide (2 segments, réservation unique renseignée)", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE" as never;
    d.segments = [
      { ordre: 1, numeroVol: "AF1234", compagnie: "Air France", date: "2026-03-01", aeroportDepart: "CDG", aeroportArrivee: "AMS" },
      { ordre: 2, numeroVol: "KL5678", compagnie: "KLM", date: "2026-03-01", aeroportDepart: "AMS", aeroportArrivee: "JFK" },
    ];
    d.reservationUnique = true;
    d.justificatifsVoyage = [
      { ...fichier, sousType: "CARTE_EMBARQUEMENT" as const },
      { ...fichier, sousType: "CARTE_EMBARQUEMENT" as const },
    ];
    expect(depotSchema.safeParse(d).success).toBe(true);
  });
});

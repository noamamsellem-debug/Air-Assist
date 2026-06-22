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
    nbPassagers: 1,
    nomSignature: "Camille Martin",
    consentementRgpd: true as const,
    accepteCgv: true as const,
    versionCgv: "2026-01-v1",
  };
}

describe("depotSchema — dépôt complet", () => {
  it("accepte un dépôt complet (vol direct)", () => {
    expect(depotSchema.safeParse(depotValide()).success).toBe(true);
  });

  it("accepte un motif compagnie facultatif (causePerturbation)", () => {
    const d = depotValide() as Record<string, unknown>;
    d.causePerturbation = "technique";
    const r = depotSchema.safeParse(d);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.causePerturbation).toBe("technique");
  });

  it("accepte des justificatifs de frais (facultatif, répétable)", () => {
    const d = depotValide() as Record<string, unknown>;
    d.justificatifsFrais = [
      { nomFichier: "hotel.pdf", mimeType: "application/pdf", contenuBase64: "eA==" },
      { nomFichier: "repas.jpg", mimeType: "image/jpeg", contenuBase64: "eA==" },
    ];
    const r = depotSchema.safeParse(d);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.justificatifsFrais).toHaveLength(2);
  });

  it("refuse un justificatif de frais au format non autorisé", () => {
    const d = depotValide() as Record<string, unknown>;
    d.justificatifsFrais = [{ nomFichier: "x.txt", mimeType: "text/plain", contenuBase64: "eA==" }];
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("accepte un dépôt sans causePerturbation (facultatif)", () => {
    const d = depotValide() as Record<string, unknown>;
    delete d.causePerturbation;
    expect(depotSchema.safeParse(d).success).toBe(true);
  });

  it("accepte des co-passagers cohérents avec le nombre de passagers", () => {
    const d = depotValide() as Record<string, unknown>;
    d.nbPassagers = 3;
    d.passagersSupplementaires = [
      { prenom: "Léa", nom: "Martin" },
      { prenom: "Tom", nom: "Martin", mineur: true },
    ];
    expect(depotSchema.safeParse(d).success).toBe(true);
  });

  it("refuse plus de co-passagers que le nombre déclaré", () => {
    const d = depotValide() as Record<string, unknown>;
    d.nbPassagers = 1;
    d.passagersSupplementaires = [{ prenom: "Léa", nom: "Martin" }];
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse un nombre de passagers nul", () => {
    const d = depotValide() as Record<string, unknown>;
    d.nbPassagers = 0;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse sans nom de signature (mandat)", () => {
    const d = depotValide() as Record<string, unknown>;
    delete d.nomSignature;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse un nom de signature vide", () => {
    const d = depotValide() as Record<string, unknown>;
    d.nomSignature = "   ";
    expect(depotSchema.safeParse(d).success).toBe(false);
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

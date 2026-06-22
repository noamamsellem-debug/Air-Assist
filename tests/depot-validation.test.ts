import { describe, it, expect } from "vitest";
import { depotSchema, documentUploadSchema } from "@/lib/validation";

// Le dépôt ne contient plus les fichiers : ils sont téléversés séparément
// (voir documentUploadSchema) pour rester sous la limite de 4,5 Mo par requête.
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
    nbPassagers: 1,
    nomSignature: "Camille Martin",
    consentementRgpd: true as const,
    accepteCgv: true as const,
    versionCgv: "2026-01-v1",
  };
}

describe("depotSchema — infos du dépôt (sans fichiers)", () => {
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

  it("accepte le motif AUTRE avec une durée de retard", () => {
    const d = depotValide() as Record<string, unknown>;
    d.motif = "AUTRE";
    d.dureeRetardMin = 300;
    d.montantEstime = 0; // « Autre » : montant à évaluer
    expect(depotSchema.safeParse(d).success).toBe(true);
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
});

describe("depotSchema — correspondance", () => {
  const deuxSegments = [
    { ordre: 1, numeroVol: "AF1234", compagnie: "Air France", date: "2026-03-01", aeroportDepart: "CDG", aeroportArrivee: "AMS" },
    { ordre: 2, numeroVol: "KL5678", compagnie: "KLM", date: "2026-03-01", aeroportDepart: "AMS", aeroportArrivee: "JFK" },
  ];

  it("refuse une correspondance avec un seul segment", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE";
    d.reservationUnique = true;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("refuse une correspondance sans réponse 'réservation unique'", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE";
    d.segments = deuxSegments;
    d.reservationUnique = null;
    expect(depotSchema.safeParse(d).success).toBe(false);
  });

  it("accepte une correspondance valide (2 segments, réservation unique renseignée)", () => {
    const d = depotValide();
    d.typeTrajet = "CORRESPONDANCE";
    d.segments = deuxSegments;
    d.reservationUnique = true;
    expect(depotSchema.safeParse(d).success).toBe(true);
  });
});

describe("documentUploadSchema — upload unitaire", () => {
  const png = { nomFichier: "doc.png", mimeType: "image/png", contenuBase64: "QUJD" };

  it("accepte une pièce d'identité (CNI)", () => {
    expect(documentUploadSchema.safeParse({ ...png, type: "PIECE_IDENTITE", sousType: "CNI" }).success).toBe(true);
  });

  it("accepte un justificatif de frais (AUTRE / JUSTIFICATIF_FRAIS)", () => {
    const r = documentUploadSchema.safeParse({ ...png, type: "AUTRE", sousType: "JUSTIFICATIF_FRAIS" });
    expect(r.success).toBe(true);
  });

  it("accepte un justificatif de retard sans sousType", () => {
    expect(documentUploadSchema.safeParse({ ...png, type: "JUSTIFICATIF_RETARD" }).success).toBe(true);
  });

  it("refuse un format non autorisé", () => {
    expect(documentUploadSchema.safeParse({ ...png, mimeType: "image/gif", type: "PIECE_IDENTITE", sousType: "CNI" }).success).toBe(false);
  });

  it("refuse un contenu vide", () => {
    expect(documentUploadSchema.safeParse({ ...png, contenuBase64: "", type: "PIECE_IDENTITE" }).success).toBe(false);
  });

  it("refuse un type inconnu", () => {
    expect(documentUploadSchema.safeParse({ ...png, type: "BIDON" }).success).toBe(false);
  });
});

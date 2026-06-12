import { describe, it, expect, beforeEach } from "vitest";
import { getSignatureAdapter, MockSignatureAdapter } from "@/adapters/esign";
import { getEmailAdapter, MockEmailAdapter } from "@/adapters/email";
import { getPspAdapter, MockPspAdapter, StripeConnectAdapter } from "@/adapters/psp";
import { getFlightDataAdapter } from "@/adapters/flightdata";

describe("sélection des adaptateurs via env", () => {
  it("renvoie le mock par défaut", () => {
    expect(getSignatureAdapter({})).toBeInstanceOf(MockSignatureAdapter);
    expect(getEmailAdapter({})).toBeInstanceOf(MockEmailAdapter);
    expect(getPspAdapter({})).toBeInstanceOf(MockPspAdapter);
    expect(getFlightDataAdapter({}).nom).toBe("mock");
  });

  it("lève une erreur pour un provider non implémenté", () => {
    expect(() => getPspAdapter({ PSP_PROVIDER: "inconnu" })).toThrow(
      /non implémenté/,
    );
  });

  it("sélectionne Stripe quand la clé est présente, sinon erreur explicite", () => {
    expect(() => getPspAdapter({ PSP_PROVIDER: "stripe" })).toThrow(/STRIPE_SECRET_KEY/);
    expect(
      getPspAdapter({ PSP_PROVIDER: "stripe", STRIPE_SECRET_KEY: "sk_test_x" }),
    ).toBeInstanceOf(StripeConnectAdapter);
  });
});

describe("MockSignatureAdapter", () => {
  it("produit une preuve horodatée avec empreinte", async () => {
    const a = new MockSignatureAdapter();
    const p = await a.signer({
      dossierReference: "AA-2026-000001",
      nomSignataire: "Camille Martin",
      emailSignataire: "c@example.com",
      contenuMandat: "Je mandate Air Assist…",
      versionCgv: "2026-01-v1",
    });
    expect(p.signatureId).toMatch(/^mock-sig-/);
    expect(p.empreinte).toMatch(/^sha256:/);
    expect(() => new Date(p.horodatage)).not.toThrow();
  });
});

describe("MockEmailAdapter", () => {
  beforeEach(() => {
    MockEmailAdapter.boiteEnvoi = [];
  });
  it("capture le message dans la boîte d'envoi", async () => {
    const a = new MockEmailAdapter();
    await a.envoyer({ de: "x@a.fr", a: "y@b.fr", sujet: "Test", texte: "Bonjour" });
    expect(MockEmailAdapter.boiteEnvoi).toHaveLength(1);
    expect(MockEmailAdapter.boiteEnvoi[0]!.sujet).toBe("Test");
  });
});

describe("MockPspAdapter", () => {
  it("tokenise sans jamais voir l'IBAN, et reverse via token", async () => {
    const a = new MockPspAdapter();
    const t = await a.tokeniserBeneficiaire({
      dossierReference: "AA-2026-000002",
      beneficiaireNom: "Léa Dubois",
      beneficiaireEmail: "lea@example.com",
    });
    expect(t.tokenPsp).toMatch(/^mock-psp-/);
    const r = await a.reverser({
      tokenPsp: t.tokenPsp,
      montantCents: 28000,
      dossierReference: "AA-2026-000002",
    });
    expect(r.montantCents).toBe(28000);
    expect(r.transfertId).toMatch(/^mock-tr-/);
  });

  it("refuse un reversement de montant nul", async () => {
    const a = new MockPspAdapter();
    await expect(
      a.reverser({ tokenPsp: "x", montantCents: 0, dossierReference: "r" }),
    ).rejects.toThrow(/invalide/);
  });
});

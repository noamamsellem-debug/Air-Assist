/**
 * Adaptateur PSP (paiement / KYC / reversement) — Phase 2/3.
 *
 * RÈGLE ABSOLUE : aucune coordonnée bancaire stockée côté Air Assist.
 * Le PSP collecte l'IBAN et renvoie un TOKEN opaque, seul élément conservé
 * (modèle Paiement.tokenPsp). Le reversement se fait via ce token.
 * En prod : Stripe Connect, Lemonway, MangoPay (cantonnement des fonds).
 */

import { randomUUID } from "node:crypto";

export interface DemandeTokenisation {
  dossierReference: string;
  /** Le PSP collecte l'IBAN sur SON interface ; on ne le voit jamais ici. */
  beneficiaireNom: string;
  beneficiaireEmail: string;
}

export interface ResultatTokenisation {
  provider: string;
  tokenPsp: string;
  statutKyc: "NON_DEMARRE" | "EN_COURS" | "VALIDE" | "REFUSE";
}

export interface DemandeReversement {
  tokenPsp: string;
  montantCents: number;
  dossierReference: string;
}

export interface ResultatReversement {
  provider: string;
  transfertId: string;
  montantCents: number;
  date: string;
}

export interface AdaptateurPsp {
  readonly nom: string;
  /** Tokenise un bénéficiaire (le PSP gère l'IBAN + KYC). */
  tokeniserBeneficiaire(d: DemandeTokenisation): Promise<ResultatTokenisation>;
  /** Vérifie / fait progresser le KYC du bénéficiaire. */
  statutKyc(tokenPsp: string): Promise<ResultatTokenisation["statutKyc"]>;
  /** Reverse la part client (70 %) via le token. */
  reverser(d: DemandeReversement): Promise<ResultatReversement>;
}

export class MockPspAdapter implements AdaptateurPsp {
  readonly nom = "mock";

  async tokeniserBeneficiaire(d: DemandeTokenisation): Promise<ResultatTokenisation> {
    return {
      provider: "mock",
      tokenPsp: `mock-psp-${randomUUID()}`,
      statutKyc: "EN_COURS",
    };
  }

  async statutKyc(): Promise<ResultatTokenisation["statutKyc"]> {
    // En mock, le KYC est réputé validé.
    return "VALIDE";
  }

  async reverser(d: DemandeReversement): Promise<ResultatReversement> {
    if (d.montantCents <= 0) throw new Error("Montant de reversement invalide.");
    return {
      provider: "mock",
      transfertId: `mock-tr-${randomUUID()}`,
      montantCents: d.montantCents,
      date: new Date().toISOString(),
    };
  }
}

export function getPspAdapter(env: Record<string, string | undefined> = process.env): AdaptateurPsp {
  const provider = (env.PSP_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "mock":
      return new MockPspAdapter();
    // case "stripe": return new StripeConnectAdapter(env.PSP_API_KEY!);
    default:
      throw new Error(
        `PSP_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

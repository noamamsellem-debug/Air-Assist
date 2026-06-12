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

/**
 * Adaptateur Stripe Connect réel — appels directs à l'API REST Stripe
 * (aucune dépendance npm à installer). Activé via PSP_PROVIDER="stripe" et
 * STRIPE_SECRET_KEY. Modèle : compte connecté Express par bénéficiaire
 * (KYC géré par Stripe, IBAN jamais vu côté Air Assist) ; reversement des
 * 70 % via un Transfer vers le compte connecté.
 */
interface StripeReponse {
  id?: string;
  payouts_enabled?: boolean;
  requirements?: { disabled_reason?: string | null };
  error?: { message?: string };
}

export class StripeConnectAdapter implements AdaptateurPsp {
  readonly nom = "stripe";
  constructor(private readonly cleSecrete: string) {}

  private async appel(
    methode: "GET" | "POST",
    chemin: string,
    params?: Record<string, string>,
  ): Promise<StripeReponse> {
    const res = await fetch(`https://api.stripe.com/v1${chemin}`, {
      method: methode,
      headers: {
        Authorization: `Bearer ${this.cleSecrete}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params ? new URLSearchParams(params).toString() : undefined,
    });
    const data = (await res.json()) as StripeReponse;
    if (!res.ok) {
      throw new Error(`Stripe ${chemin} : ${data.error?.message ?? res.status}`);
    }
    return data;
  }

  async tokeniserBeneficiaire(d: DemandeTokenisation): Promise<ResultatTokenisation> {
    const compte = await this.appel("POST", "/accounts", {
      type: "express",
      email: d.beneficiaireEmail,
      "capabilities[transfers][requested]": "true",
      business_type: "individual",
      "metadata[dossier]": d.dossierReference,
      "metadata[beneficiaire]": d.beneficiaireNom,
    });
    return { provider: "stripe", tokenPsp: compte.id ?? "", statutKyc: "EN_COURS" };
  }

  async statutKyc(tokenPsp: string): Promise<ResultatTokenisation["statutKyc"]> {
    const compte = await this.appel("GET", `/accounts/${tokenPsp}`);
    if (compte.payouts_enabled) return "VALIDE";
    if (compte.requirements?.disabled_reason) return "REFUSE";
    return "EN_COURS";
  }

  async reverser(d: DemandeReversement): Promise<ResultatReversement> {
    if (d.montantCents <= 0) throw new Error("Montant de reversement invalide.");
    const transfert = await this.appel("POST", "/transfers", {
      amount: String(d.montantCents),
      currency: "eur",
      destination: d.tokenPsp,
      "metadata[dossier]": d.dossierReference,
    });
    return {
      provider: "stripe",
      transfertId: transfert.id ?? "",
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
    case "stripe": {
      const cle = env.STRIPE_SECRET_KEY;
      if (!cle) {
        throw new Error('PSP_PROVIDER="stripe" mais STRIPE_SECRET_KEY est absente.');
      }
      return new StripeConnectAdapter(cle);
    }
    default:
      throw new Error(
        `PSP_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

/**
 * Adaptateur signature électronique (mandat — eIDAS).
 *
 * Une simple case cochée ne suffit pas : on capture une signature avec preuve
 * horodatée. En dev, l'implémentation `mock` génère une preuve déterministe
 * sans appel externe. En prod, brancher Yousign / Universign / Docusign.
 */

import { createHash, randomUUID } from "node:crypto";

export interface DemandeSignature {
  dossierReference: string;
  nomSignataire: string;
  emailSignataire: string;
  /** Contenu textuel du mandat présenté au signataire. */
  contenuMandat: string;
  versionCgv: string;
}

export interface PreuveSignature {
  provider: string;
  /** Identifiant de la signature chez le prestataire. */
  signatureId: string;
  /** Empreinte (hash) du document signé. */
  empreinte: string;
  horodatage: string; // ISO 8601
  /** Blob de preuve sérialisé (journal de signature, certificat…). */
  preuve: string;
}

export interface AdaptateurSignature {
  readonly nom: string;
  signer(demande: DemandeSignature): Promise<PreuveSignature>;
}

/** Implémentation mock — aucune dépendance externe. */
export class MockSignatureAdapter implements AdaptateurSignature {
  readonly nom = "mock";
  async signer(demande: DemandeSignature): Promise<PreuveSignature> {
    const horodatage = new Date().toISOString();
    const empreinte =
      "sha256:" +
      createHash("sha256")
        .update(demande.contenuMandat + demande.versionCgv)
        .digest("hex");
    const signatureId = `mock-sig-${randomUUID()}`;
    const preuve = JSON.stringify({
      provider: "mock",
      signataire: demande.nomSignataire,
      email: demande.emailSignataire,
      dossier: demande.dossierReference,
      empreinte,
      horodatage,
      avertissement: "Preuve de DÉMO — non valide juridiquement.",
    });
    return { provider: "mock", signatureId, empreinte, horodatage, preuve };
  }
}

export function getSignatureAdapter(
  env: NodeJS.ProcessEnv = process.env,
): AdaptateurSignature {
  const provider = (env.ESIGN_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "mock":
      return new MockSignatureAdapter();
    // case "yousign": return new YousignAdapter(env.ESIGN_API_KEY!);
    default:
      throw new Error(
        `ESIGN_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

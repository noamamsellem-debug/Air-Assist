/**
 * Adaptateur e-mail : envoi des réclamations, réponses auto au client,
 * relances programmées. En dev, `mock` capture les messages en mémoire
 * (consultables dans le CRM / les tests) sans rien envoyer.
 * En prod : SMTP pro, Postmark, Brevo…
 */

export interface MessageEmail {
  de: string;
  a: string;
  sujet: string;
  texte: string;
  /** Métadonnées de rapprochement (n° de dossier, etc.). */
  enTetes?: Record<string, string>;
}

export interface ResultatEnvoi {
  provider: string;
  messageId: string;
  envoyeLe: string;
}

export interface AdaptateurEmail {
  readonly nom: string;
  envoyer(message: MessageEmail): Promise<ResultatEnvoi>;
}

/** Mock : conserve les messages en mémoire (utile pour CRM démo & tests). */
export class MockEmailAdapter implements AdaptateurEmail {
  readonly nom = "mock";
  /** Boîte d'envoi en mémoire (réinitialisée à chaque process). */
  static boiteEnvoi: Array<MessageEmail & ResultatEnvoi> = [];

  async envoyer(message: MessageEmail): Promise<ResultatEnvoi> {
    const resultat: ResultatEnvoi = {
      provider: "mock",
      messageId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      envoyeLe: new Date().toISOString(),
    };
    MockEmailAdapter.boiteEnvoi.push({ ...message, ...resultat });
    return resultat;
  }
}

export function getEmailAdapter(env: NodeJS.ProcessEnv = process.env): AdaptateurEmail {
  const provider = (env.EMAIL_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "mock":
      return new MockEmailAdapter();
    // case "smtp": return new SmtpAdapter({...});
    // case "postmark": return new PostmarkAdapter(env.EMAIL_API_KEY!);
    default:
      throw new Error(
        `EMAIL_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

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
  /** Corps HTML (optionnel) ; `texte` reste le repli en clair. */
  html?: string;
  /** Adresse de réponse (reply-to). */
  replyTo?: string;
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

/** Resend (API HTTP) — adapté au serverless Vercel. From + reply-to = info@airassist.eu. */
export class ResendEmailAdapter implements AdaptateurEmail {
  readonly nom = "resend";
  constructor(private readonly apiKey: string) {}

  async envoyer(message: MessageEmail): Promise<ResultatEnvoi> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.de,
        to: [message.a],
        subject: message.sujet,
        html: message.html,
        text: message.texte,
        reply_to: message.replyTo,
        headers: message.enTetes,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend ${res.status} : ${detail}`);
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return {
      provider: "resend",
      messageId: data.id ?? "",
      envoyeLe: new Date().toISOString(),
    };
  }
}

export function getEmailAdapter(env: Record<string, string | undefined> = process.env): AdaptateurEmail {
  const provider = (env.EMAIL_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "mock":
      return new MockEmailAdapter();
    case "resend": {
      const cle = env.RESEND_API_KEY;
      if (!cle) throw new Error("RESEND_API_KEY manquant (EMAIL_PROVIDER=resend).");
      return new ResendEmailAdapter(cle);
    }
    default:
      throw new Error(
        `EMAIL_PROVIDER="${provider}" non implémenté. Branchez l'adaptateur réel ou utilisez "mock".`,
      );
  }
}

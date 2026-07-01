/**
 * Webhook d'inscription (Zapier/CRM) déclenché à la création d'un dossier.
 *
 * Volontairement « best-effort » : toute erreur est avalée (try/catch) et ne
 * doit JAMAIS faire échouer la création du dossier ni la réponse au client.
 * Un timeout court évite qu'un endpoint lent ne bloque la requête.
 */

// URL configurable par variable d'env (repli sur l'URL Zapier fournie).
const WEBHOOK_URL =
  process.env.ZAPIER_SIGNUP_WEBHOOK_URL ??
  "https://hooks.zapier.com/hooks/catch/28117738/42njrdd/";

export interface InscriptionWebhookData {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string | null;
  dateInscription: string;
  reference: string;
  dossierId: string;
  montantEstime?: number;
  trajet?: string;
}

export async function envoyerWebhookInscription(data: InscriptionWebhookData): Promise<void> {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      // Ne pas laisser un webhook lent bloquer la requête d'inscription.
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    // Non bloquant : on journalise sans propager l'erreur.
    console.error("[webhook inscription] envoi échoué (ignoré)", err);
  }
}

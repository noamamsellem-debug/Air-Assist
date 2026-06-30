/**
 * Envoi des e-mails transactionnels liés à un dossier : charge le dossier + ses
 * relations, construit les variables, rend le template et l'envoie via
 * l'adaptateur (Resend en prod, mock sinon). Ne lève jamais pour ne pas casser
 * le flux appelant (changement de statut, création) — les erreurs sont loguées.
 */
import { prisma } from "./prisma";
import { getEmailAdapter } from "@/adapters/email";
import { construireEmail, construireVariables, basePublique, type TypeEmail, type DossierPourEmail } from "./emails";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "AirAssist <info@airassist.eu>";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO ?? "info@airassist.eu";

/** Envoie l'e-mail `type` au passager du dossier. Retourne true si envoyé. */
export async function envoyerEmailDossier(
  dossierId: string,
  type: TypeEmail,
  commentaire?: string,
): Promise<boolean> {
  try {
    const dossier = await prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { passager: true, vol: true, compagnie: true },
    });
    if (!dossier?.passager?.email) {
      console.error(`[email] dossier ${dossierId} introuvable ou sans e-mail passager.`);
      return false;
    }

    const vars = construireVariables(dossier as unknown as DossierPourEmail, {
      siteUrl: basePublique(),
      commentaire,
      annee: new Date().getFullYear(),
    });
    const { sujet, html, texte } = construireEmail(type, vars);

    await getEmailAdapter().envoyer({
      de: EMAIL_FROM,
      a: dossier.passager.email,
      replyTo: EMAIL_REPLY_TO,
      sujet,
      html,
      texte,
      enTetes: { "X-Dossier": dossier.reference },
    });
    return true;
  } catch (e) {
    console.error(`[email] échec envoi ${type} pour dossier ${dossierId}`, e);
    return false;
  }
}

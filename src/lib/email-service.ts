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
const ADMIN_NOTIF_EMAIL = process.env.ADMIN_NOTIF_EMAIL ?? "info@airassist.eu";

/** Notifie l'admin (info@airassist.eu) à chaque nouveau dossier créé. Ne lève jamais. */
export async function envoyerNotificationNouveauDossier(dossierId: string): Promise<boolean> {
  try {
    const d = await prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { passager: true, vol: true, compagnie: true },
    });
    if (!d) return false;

    const compagnie = d.compagnie?.nom || d.vol.compagnieTexte;
    const nom = `${d.passager.prenom} ${d.passager.nom}`.trim();
    const montant = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(d.montantEstime));
    const ligne = `Nouveau dossier ${d.reference} — ${nom}, vol ${compagnie} ${d.vol.aeroportDepart}→${d.vol.aeroportArrivee}, indemnité estimée ${montant} €.`;
    const lienFiche = `${basePublique()}/admin/dossiers/${d.id}`;

    await getEmailAdapter().envoyer({
      de: EMAIL_FROM,
      a: ADMIN_NOTIF_EMAIL,
      replyTo: d.passager.email, // réponse directe au client
      sujet: `🆕 Nouveau dossier ${d.reference} — ${montant} €`,
      texte: `${ligne}\n\nClient : ${nom} · ${d.passager.email}${d.passager.telephone ? " · " + d.passager.telephone : ""}\nFiche : ${lienFiche}`,
      html: `<p style="font-family:Arial,sans-serif;font-size:15px;">${ligne}</p>` +
        `<p style="font-family:Arial,sans-serif;font-size:14px;color:#475569;">Client : ${nom} · ${d.passager.email}${d.passager.telephone ? " · " + d.passager.telephone : ""}<br>` +
        `<a href="${lienFiche}" style="color:#0060FF;">Ouvrir la fiche du dossier</a></p>`,
      enTetes: { "X-Dossier": d.reference },
    });
    return true;
  } catch (e) {
    console.error(`[email] échec notification admin pour dossier ${dossierId}`, e);
    return false;
  }
}

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

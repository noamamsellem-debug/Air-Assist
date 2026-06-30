/**
 * Templates des 7 e-mails transactionnels AirAssist (HTML charté #0060FF + logo
 * + pied de page commun, et version texte). Fonctions pures : la couche métier
 * (Étape C) fournit les variables depuis le dossier.
 *
 * Le numéro de dossier {reference} figure dans CHAQUE e-mail. Signature « L'équipe
 * AirAssist ». Expéditeur/реply-to = info@airassist.eu (géré par l'adaptateur).
 */

const BRAND = "#0060FF";

export type TypeEmail =
  | "ACCUSE_RECEPTION"
  | "DOCUMENT_MANQUANT"
  | "RELANCE_DOCUMENT"
  | "RECLAMATION_ENVOYEE"
  | "INDEMNITE_OBTENUE"
  | "VERSEMENT_EFFECTUE"
  | "REFUSE";

export interface VariablesEmail {
  prenom: string;
  compagnie: string;
  depart: string;
  arrivee: string;
  dateVol: string; // déjà formatée (ex. "22/06/2026")
  reference: string;
  montantEstime: number;
  montantObtenu?: number;
  partClient?: number;
  commission?: number;
  lienSuivi: string;
  lienVersement: string;
  documentManquant?: string;
  motifRefus?: string;
  annee: number;
  siteUrl: string;
}

export interface EmailRendu {
  sujet: string;
  html: string;
  texte: string;
}

/** Statut du dossier → type d'e-mail à envoyer (ou null si aucun). */
export function emailPourStatut(statut: string): TypeEmail | null {
  switch (statut) {
    case "DOCUMENT_MANQUANT":
      return "DOCUMENT_MANQUANT";
    case "RECLAMATION_ENVOYEE":
      return "RECLAMATION_ENVOYEE";
    case "ACCEPTE":
      return "INDEMNITE_OBTENUE";
    case "REVERSE": // versement effectif au client (PAYE = compagnie→nous, interne)
      return "VERSEMENT_EFFECTUE";
    case "REFUSE":
      return "REFUSE";
    default:
      return null; // NOUVEAU géré à la création ; PAYE/VERIFIE/etc. = pas d'e-mail
  }
}

/** Dossier (+ relations) minimal nécessaire pour remplir les variables d'e-mail. */
export interface DossierPourEmail {
  reference: string;
  montantEstime: unknown;
  montantObtenu?: unknown | null;
  partClient70?: unknown | null;
  commission30?: unknown | null;
  passager: { prenom: string; email: string };
  vol: { aeroportDepart: string; aeroportArrivee: string; date: Date | string; compagnieTexte: string };
  compagnie: { nom: string };
}

function nombre(x: unknown): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

/** Construit les variables d'e-mail depuis un dossier (fonction pure, testable). */
export function construireVariables(
  d: DossierPourEmail,
  options: { siteUrl: string; commentaire?: string; annee: number },
): VariablesEmail {
  const siteUrl = options.siteUrl.replace(/\/$/, "");
  return {
    prenom: d.passager.prenom,
    compagnie: d.compagnie?.nom || d.vol.compagnieTexte,
    depart: d.vol.aeroportDepart,
    arrivee: d.vol.aeroportArrivee,
    dateVol: new Intl.DateTimeFormat("fr-FR").format(new Date(d.vol.date)),
    reference: d.reference,
    montantEstime: nombre(d.montantEstime),
    montantObtenu: d.montantObtenu != null ? nombre(d.montantObtenu) : undefined,
    partClient: d.partClient70 != null ? nombre(d.partClient70) : undefined,
    commission: d.commission30 != null ? nombre(d.commission30) : undefined,
    lienSuivi: `${siteUrl}/fr/suivi`,
    lienVersement: `${siteUrl}/fr/suivi`,
    documentManquant: options.commentaire || undefined,
    motifRefus: options.commentaire || undefined,
    annee: options.annee,
    siteUrl,
  };
}

function eur(n: number): string {
  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " €";
}

function bouton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px;">${label}</a>`;
}

function encadreRef(reference: string): string {
  return `<div style="background:#eaf2ff;border:1px solid #bcd9ff;border-radius:10px;padding:12px 16px;margin:18px 0;font-size:14px;">Votre numéro de dossier : <strong style="font-family:monospace;color:${BRAND};">${reference}</strong></div>`;
}

function p(html: string): string {
  return `<p style="margin:0 0 14px 0;">${html}</p>`;
}

function enveloppe(corps: string, v: VariablesEmail): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f1f5f9;padding:24px 0;font-family:Arial,Helvetica,sans-serif;color:#0f172a;font-size:15px;line-height:1.6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <tr><td style="background:${BRAND};height:6px;line-height:6px;font-size:6px;">&nbsp;</td></tr>
    <tr><td align="center" style="padding:24px 32px 4px 32px;">
      <img src="${v.siteUrl}/airassist-logo-header.png" alt="AirAssist" height="44" style="height:44px;width:auto;display:block;border:0;">
    </td></tr>
    <tr><td style="padding:12px 32px 8px 32px;">${corps}</td></tr>
    <tr><td style="padding:22px 32px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
      <strong>AirAssist</strong> — Nous faisons valoir vos droits de passagers aériens.<br>
      Réclamation au titre du règlement (CE) n° 261/2004.<br>
      Une question ? <a href="mailto:info@airassist.eu" style="color:${BRAND};text-decoration:none;">info@airassist.eu</a> · Suivre mon dossier : <a href="${v.lienSuivi}" style="color:${BRAND};text-decoration:none;">${v.lienSuivi}</a><br>
      <a href="${v.siteUrl}/fr/mentions-legales" style="color:#64748b;">Mentions légales</a> · <a href="${v.siteUrl}/fr/confidentialite" style="color:#64748b;">Confidentialité</a> · <a href="${v.siteUrl}/fr/cgv" style="color:#64748b;">CGV</a><br>
      © ${v.annee} AirAssist
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const PIED_TEXTE = (v: VariablesEmail): string =>
  `\n\n—\nAirAssist — Nous faisons valoir vos droits de passagers aériens.\n` +
  `Réclamation au titre du règlement (CE) n° 261/2004.\n` +
  `Une question ? info@airassist.eu · Suivre mon dossier : ${v.lienSuivi}\n` +
  `Mentions légales · Confidentialité · CGV — © ${v.annee} AirAssist`;

/** Construit l'e-mail (sujet + HTML + texte) pour un type donné. */
export function construireEmail(type: TypeEmail, v: VariablesEmail): EmailRendu {
  let sujet = "";
  let corps = "";
  let texte = "";

  switch (type) {
    case "ACCUSE_RECEPTION": {
      sujet = `Votre dossier est bien reçu — n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Bonne nouvelle : nous avons bien reçu votre demande d'indemnisation pour votre vol <strong>${v.compagnie} ${v.depart} → ${v.arrivee}</strong> du ${v.dateVol}. 🎉`) +
        encadreRef(v.reference) +
        p(`Gardez ce numéro précieusement, il vous permet de suivre votre demande à tout moment.`) +
        p(`Voici ce qui se passe maintenant :`) +
        `<ul style="margin:0 0 14px 20px;padding:0;"><li>Notre équipe vérifie votre dossier et les documents fournis.</li><li>Nous préparons la réclamation auprès de ${v.compagnie}.</li><li>Nous vous tenons informé(e) à chaque étape par e-mail.</li></ul>` +
        p(`<strong>Indemnisation estimée : ${eur(v.montantEstime)}</strong> — vous percevez 70 % en cas de succès, et vous ne payez rien si nous n'obtenons rien.`) +
        p(bouton("Suivre mon dossier", v.lienSuivi)) +
        p(`À très vite,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nBonne nouvelle : nous avons bien reçu votre demande d'indemnisation pour votre vol ${v.compagnie} ${v.depart} → ${v.arrivee} du ${v.dateVol}.\n\n` +
        `Votre numéro de dossier : ${v.reference}\n\nCe qui se passe maintenant :\n- Nous vérifions votre dossier et vos documents.\n- Nous préparons la réclamation auprès de ${v.compagnie}.\n- Nous vous tenons informé(e) à chaque étape.\n\n` +
        `Indemnisation estimée : ${eur(v.montantEstime)} — 70 % en cas de succès, rien si nous n'obtenons rien.\nSuivre mon dossier : ${v.lienSuivi}\n\nÀ très vite,\nL'équipe AirAssist`;
      break;
    }

    case "DOCUMENT_MANQUANT": {
      sujet = `Il nous manque un document pour avancer — dossier n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Votre dossier <strong>${v.reference}</strong> avance bien, mais il nous manque un élément pour pouvoir le transmettre à ${v.compagnie} :`) +
        p(`👉 <strong>${v.documentManquant ?? "un document"}</strong>`) +
        p(`C'est rapide : ajoutez simplement ce document depuis votre espace de suivi.`) +
        p(bouton("Ajouter mon document", v.lienSuivi)) +
        p(`Dès que nous l'aurons reçu, nous reprenons votre demande immédiatement. N'oubliez pas : il s'agit de <strong>${eur(v.montantEstime)}</strong> auxquels vous avez droit.`) +
        p(`Une question ? Répondez simplement à cet e-mail, nous sommes là pour vous aider.`) +
        p(`À très vite,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nVotre dossier ${v.reference} avance bien, mais il nous manque un élément pour le transmettre à ${v.compagnie} :\n\n` +
        `Document attendu : ${v.documentManquant ?? "un document"}\n\nAjoutez-le depuis votre espace de suivi : ${v.lienSuivi}\n\n` +
        `Dès réception, nous reprenons votre demande. Il s'agit de ${eur(v.montantEstime)} auxquels vous avez droit.\nUne question ? Répondez à cet e-mail.\n\nÀ très vite,\nL'équipe AirAssist`;
      break;
    }

    case "RELANCE_DOCUMENT": {
      sujet = `Rappel : votre dossier ${v.reference} est en attente d'un document`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Nous n'avons pas encore reçu le document nécessaire pour poursuivre votre demande d'indemnisation pour votre vol <strong>${v.compagnie}</strong> du ${v.dateVol}.`) +
        p(`Document attendu : <strong>${v.documentManquant ?? "un document"}</strong>`) +
        p(`Votre dossier <strong>${v.reference}</strong> reste ouvert et nous sommes prêts à reprendre dès que vous l'aurez ajouté :`) +
        p(bouton("Ajouter mon document", v.lienSuivi)) +
        p(`Ne laissez pas filer vos <strong>${eur(v.montantEstime)}</strong> — l'envoi du document ne prend qu'une minute. Une difficulté ? Répondez simplement à cet e-mail.`) +
        p(`À très vite,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nNous n'avons pas encore reçu le document nécessaire pour votre demande (vol ${v.compagnie} du ${v.dateVol}).\n\n` +
        `Document attendu : ${v.documentManquant ?? "un document"}\nDossier ${v.reference} — ajoutez-le ici : ${v.lienSuivi}\n\n` +
        `Ne laissez pas filer vos ${eur(v.montantEstime)} — ça prend une minute. Une difficulté ? Répondez à cet e-mail.\n\nÀ très vite,\nL'équipe AirAssist`;
      break;
    }

    case "RECLAMATION_ENVOYEE": {
      sujet = `Votre réclamation est partie ! — dossier n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Ça y est : nous venons d'envoyer officiellement votre réclamation à <strong>${v.compagnie}</strong> pour votre vol ${v.depart} → ${v.arrivee} du ${v.dateVol}. ✈️`) +
        encadreRef(v.reference) +
        p(`Votre dossier est désormais entre les mains de la compagnie. Voici la suite :`) +
        `<ul style="margin:0 0 14px 20px;padding:0;"><li>${v.compagnie} dispose d'un délai légal pour répondre.</li><li>Nous suivons votre dossier de près et relançons la compagnie si nécessaire.</li><li>Dès que nous avons du nouveau, vous êtes le premier informé.</li></ul>` +
        p(`Il n'y a rien à faire de votre côté pour le moment — on s'occupe de tout. 💪`) +
        p(bouton("Suivre mon dossier", v.lienSuivi)) +
        p(`À très vite,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nÇa y est : nous venons d'envoyer votre réclamation à ${v.compagnie} pour votre vol ${v.depart} → ${v.arrivee} du ${v.dateVol}.\n\n` +
        `Dossier ${v.reference}. La suite :\n- ${v.compagnie} a un délai légal pour répondre.\n- Nous suivons et relançons si besoin.\n- Vous serez le premier informé.\n\n` +
        `Rien à faire de votre côté pour le moment.\nSuivi : ${v.lienSuivi}\n\nÀ très vite,\nL'équipe AirAssist`;
      break;
    }

    case "INDEMNITE_OBTENUE": {
      sujet = `🎉 Bonne nouvelle ! Votre indemnisation est acceptée — dossier n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Excellente nouvelle : <strong>${v.compagnie}</strong> a accepté de vous indemniser pour votre vol ${v.depart} → ${v.arrivee} ! 🎉`) +
        `<div style="background:#eaf2ff;border:1px solid #bcd9ff;border-radius:10px;padding:14px 16px;margin:18px 0;font-size:14px;">` +
        `Montant obtenu : <strong>${eur(v.montantObtenu ?? 0)}</strong><br>` +
        `Votre part (70 %) : <strong style="color:${BRAND};">${eur(v.partClient ?? 0)}</strong><br>` +
        `Commission AirAssist (30 %) : ${eur(v.commission ?? 0)}</div>` +
        encadreRef(v.reference) +
        p(`Il ne reste qu'une étape pour recevoir votre argent : nous transmettre vos coordonnées bancaires de façon sécurisée.`) +
        p(bouton("Renseigner mon IBAN", v.lienVersement)) +
        p(`Dès réception, nous procédons au virement de vos <strong>${eur(v.partClient ?? 0)}</strong>.`) +
        p(`Merci de nous avoir fait confiance — c'est exactement pour ce moment que nous travaillons. 😊`) +
        p(`À très vite,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nExcellente nouvelle : ${v.compagnie} a accepté de vous indemniser (vol ${v.depart} → ${v.arrivee}) !\n\n` +
        `Montant obtenu : ${eur(v.montantObtenu ?? 0)}\n- Votre part (70 %) : ${eur(v.partClient ?? 0)}\n- Commission AirAssist (30 %) : ${eur(v.commission ?? 0)}\n\n` +
        `Dossier ${v.reference}. Dernière étape : transmettez votre IBAN de façon sécurisée ici : ${v.lienVersement}\n` +
        `Dès réception, nous virons vos ${eur(v.partClient ?? 0)}.\n\nMerci de votre confiance.\nÀ très vite,\nL'équipe AirAssist`;
      break;
    }

    case "VERSEMENT_EFFECTUE": {
      sujet = `💸 Votre argent est en route ! — dossier n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`C'est fait : nous venons de vous envoyer <strong>${eur(v.partClient ?? 0)}</strong> sur le compte que vous nous avez communiqué.`) +
        p(`Selon votre banque, le virement peut prendre 1 à 3 jours ouvrés pour apparaître sur votre compte.`) +
        `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin:18px 0;font-size:14px;">` +
        `Récapitulatif du dossier <strong>${v.reference}</strong> :<br>` +
        `Vol : ${v.compagnie} ${v.depart} → ${v.arrivee} du ${v.dateVol}<br>` +
        `Montant obtenu : ${eur(v.montantObtenu ?? 0)}<br>` +
        `Votre part versée : <strong style="color:${BRAND};">${eur(v.partClient ?? 0)}</strong></div>` +
        p(`Merci d'avoir fait confiance à AirAssist. Un prochain vol perturbé ? Vous savez désormais que vous avez des droits — et nous serons là. ✈️`) +
        p(`Si ce message vous a été utile, n'hésitez pas à parler de nous autour de vous.`) +
        p(`Au plaisir,<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nC'est fait : nous venons de vous envoyer ${eur(v.partClient ?? 0)} sur votre compte.\n` +
        `Le virement peut prendre 1 à 3 jours ouvrés.\n\n` +
        `Récapitulatif du dossier ${v.reference} :\n- Vol : ${v.compagnie} ${v.depart} → ${v.arrivee} du ${v.dateVol}\n- Montant obtenu : ${eur(v.montantObtenu ?? 0)}\n- Votre part versée : ${eur(v.partClient ?? 0)}\n\n` +
        `Merci d'avoir fait confiance à AirAssist.\nAu plaisir,\nL'équipe AirAssist`;
      break;
    }

    case "REFUSE": {
      sujet = `Mise à jour sur votre dossier n° ${v.reference}`;
      corps =
        p(`Bonjour ${v.prenom},`) +
        p(`Nous avons une mise à jour concernant votre demande d'indemnisation (dossier <strong>${v.reference}</strong>) pour le vol <strong>${v.compagnie} ${v.depart} → ${v.arrivee}</strong> du ${v.dateVol}.`) +
        p(`Après examen, ${v.compagnie} a refusé l'indemnisation pour le motif suivant : <em>${v.motifRefus ?? "non précisé"}</em>`) +
        p(`Nous comprenons que ce n'est pas la réponse espérée. Sachez que, conformément à notre engagement, <strong>vous n'avez rien à payer : pas de gain, pas de frais.</strong>`) +
        p(`Selon votre situation, d'autres recours peuvent parfois être envisagés. Si vous souhaitez en discuter, répondez simplement à cet e-mail : nous restons à votre écoute.`) +
        p(`Merci de la confiance que vous nous avez accordée.<br>L'équipe AirAssist`);
      texte =
        `Bonjour ${v.prenom},\n\nMise à jour sur votre demande (dossier ${v.reference} — vol ${v.compagnie} ${v.depart} → ${v.arrivee} du ${v.dateVol}).\n\n` +
        `Après examen, ${v.compagnie} a refusé l'indemnisation pour le motif suivant : ${v.motifRefus ?? "non précisé"}\n\n` +
        `Conformément à notre engagement, vous n'avez rien à payer : pas de gain, pas de frais.\n` +
        `D'autres recours sont parfois possibles — répondez à cet e-mail pour en discuter.\n\nMerci de votre confiance.\nL'équipe AirAssist`;
      break;
    }
  }

  return { sujet, html: enveloppe(corps, v), texte: texte + PIED_TEXTE(v) };
}

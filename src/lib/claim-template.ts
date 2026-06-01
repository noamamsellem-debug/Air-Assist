/**
 * Module 8 — Génération semi-automatique des réclamations.
 *
 * Produit le contenu (e-mail ou corps de formulaire) dans la bonne langue, avec
 * les éléments réglementaires (référence EC 261/2004, montant réclamé, pièces).
 * Fonction PURE : prend les données du dossier, renvoie sujet + corps.
 *
 * Validation humaine en un clic avant envoi (semi-auto par défaut). Le full-auto
 * s'active par compagnie via Compagnie.autoActive (lu côté CRM/worker).
 */

export type LangueReclamation = "fr" | "en" | "es";

export interface DonneesReclamation {
  reference: string;
  passagerNom: string;
  passagerPrenom: string;
  compagnieNom: string;
  numeroVol: string;
  dateVol: string; // déjà formatée
  aeroportDepart: string;
  aeroportArrivee: string;
  pnr: string | null;
  montantReclame: number; // EUR
  motif: string; // libellé
  pieces: string[];
}

export interface ContenuReclamation {
  langue: LangueReclamation;
  sujet: string;
  corps: string;
}

function listePieces(pieces: string[], puce: string): string {
  return pieces.length ? pieces.map((p) => `${puce} ${p}`).join("\n") : `${puce} —`;
}

export function genererReclamation(
  d: DonneesReclamation,
  langue: LangueReclamation = "fr",
): ContenuReclamation {
  const montant = `${d.montantReclame.toFixed(2)} €`;
  const ref = d.pnr ? ` (PNR ${d.pnr})` : "";

  if (langue === "en") {
    return {
      langue,
      sujet: `EC 261/2004 compensation claim — flight ${d.numeroVol} on ${d.dateVol} — ref ${d.reference}`,
      corps:
        `Dear ${d.compagnieNom} Customer Relations,\n\n` +
        `Acting on behalf of ${d.passagerPrenom} ${d.passagerNom}, we hereby claim compensation under ` +
        `Regulation (EC) No 261/2004 for flight ${d.numeroVol}${ref} from ${d.aeroportDepart} to ` +
        `${d.aeroportArrivee} on ${d.dateVol} (reason: ${d.motif}).\n\n` +
        `Amount claimed: ${montant}.\n\n` +
        `Supporting documents:\n${listePieces(d.pieces, "-")}\n\n` +
        `Please confirm receipt and provide your claim reference. We remain available for any ` +
        `additional information.\n\nKind regards,\nAir Assist — on behalf of the passenger\nOur reference: ${d.reference}`,
    };
  }

  if (langue === "es") {
    return {
      langue,
      sujet: `Reclamación EC 261/2004 — vuelo ${d.numeroVol} del ${d.dateVol} — ref ${d.reference}`,
      corps:
        `Estimado servicio de atención al cliente de ${d.compagnieNom},\n\n` +
        `En nombre de ${d.passagerPrenom} ${d.passagerNom}, reclamamos una indemnización conforme al ` +
        `Reglamento (CE) n.º 261/2004 por el vuelo ${d.numeroVol}${ref} de ${d.aeroportDepart} a ` +
        `${d.aeroportArrivee} el ${d.dateVol} (motivo: ${d.motif}).\n\n` +
        `Importe reclamado: ${montant}.\n\n` +
        `Documentos justificativos:\n${listePieces(d.pieces, "-")}\n\n` +
        `Le rogamos confirme la recepción y nos facilite su número de expediente. Quedamos a su ` +
        `disposición.\n\nAtentamente,\nAir Assist — en nombre del pasajero\nNuestra referencia: ${d.reference}`,
    };
  }

  return {
    langue: "fr",
    sujet: `Réclamation EC 261/2004 — vol ${d.numeroVol} du ${d.dateVol} — réf ${d.reference}`,
    corps:
      `Madame, Monsieur,\n\n` +
      `Agissant pour le compte de ${d.passagerPrenom} ${d.passagerNom}, nous réclamons une indemnisation ` +
      `au titre du règlement (CE) n° 261/2004 pour le vol ${d.numeroVol}${ref} reliant ${d.aeroportDepart} ` +
      `à ${d.aeroportArrivee} le ${d.dateVol} (motif : ${d.motif}).\n\n` +
      `Montant réclamé : ${montant}.\n\n` +
      `Pièces justificatives :\n${listePieces(d.pieces, "-")}\n\n` +
      `Nous vous remercions de bien vouloir accuser réception et de nous communiquer votre numéro de ` +
      `dossier. Nous restons à votre disposition pour tout complément.\n\n` +
      `Cordialement,\nAir Assist — pour le compte du passager\nNotre référence : ${d.reference}`,
  };
}

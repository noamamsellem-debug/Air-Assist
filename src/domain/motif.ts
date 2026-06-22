import type { MotifVol } from "@prisma/client";

export const MOTIF_LIBELLES: Record<MotifVol, string> = {
  RETARD: "Retard",
  ANNULATION: "Annulation",
  SURBOOKING: "Surbooking / refus d'embarquement",
  CORRESPONDANCE_MANQUEE: "Correspondance manquée",
  AUTRE: "Autre",
};

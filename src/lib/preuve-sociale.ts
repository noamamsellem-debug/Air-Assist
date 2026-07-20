import { prisma } from "@/lib/prisma";

/**
 * Chiffres de réassurance affichés sur la page d'accueil.
 *
 * Règle absolue : **on n'invente aucun chiffre**. Le service démarre, et un
 * faux « 10 000 clients satisfaits » se repère et détruit la confiance qu'on
 * cherche justement à construire. Ces valeurs viennent de la base, ou ne
 * s'affichent pas.
 *
 * Deux garde-fous :
 *   1. Les dossiers de démonstration sont exclus. Le seed emploie le domaine
 *      réservé `example.com` (RFC 2606), qu'aucun passager réel n'utilise.
 *   2. En dessous de `SEUIL_AFFICHAGE` dossiers, on ne montre rien : « 3
 *      dossiers traités » dessert davantage que le silence.
 */

/** En dessous de ce volume, le bloc de compteurs reste masqué. */
export const SEUIL_AFFICHAGE = 10;

export interface StatistiquesPubliques {
  /** Dossiers réels menés à leur terme (indemnité reversée au client). */
  dossiersReverses: number;
  /** Total des indemnités effectivement obtenues auprès des compagnies, en euros. */
  montantRecupereEur: number;
}

/**
 * Renvoie `null` si le volume est insuffisant, si la base est vide, ou si elle
 * est injoignable — le bloc est alors simplement absent de la page. La page
 * d'accueil ne doit jamais échouer à cause d'un compteur décoratif : c'est
 * pourquoi toute erreur est avalée plutôt que propagée (le build de production
 * s'exécute parfois sans base accessible).
 */
export async function statistiquesPubliques(): Promise<StatistiquesPubliques | null> {
  try {
    const filtreReel = {
      supprimeLe: null,
      statut: "REVERSE" as const,
      passager: { email: { not: { endsWith: "@example.com" } } },
    };

    const [dossiersReverses, agregat] = await Promise.all([
      prisma.dossier.count({ where: filtreReel }),
      prisma.dossier.aggregate({
        where: filtreReel,
        _sum: { montantObtenu: true },
      }),
    ]);

    if (dossiersReverses < SEUIL_AFFICHAGE) return null;

    return {
      dossiersReverses,
      montantRecupereEur: Math.round(Number(agregat._sum.montantObtenu ?? 0)),
    };
  } catch {
    return null;
  }
}

/**
 * Identité légale de la société, affichée en pied de page et dans le bloc de
 * confiance. Renseignée par variables d'environnement : tant qu'elles sont
 * absentes, le bloc n'est PAS rendu — on ne publie pas un SIRET d'exemple.
 *
 * Voir `.env.example`. Les mentions légales (`/fr/mentions-legales`) restent la
 * source de vérité juridique ; ce bloc n'en est qu'un rappel visible.
 */
export interface IdentiteSociete {
  raisonSociale: string;
  formeJuridique: string;
  siret: string;
  adresse: string;
  email: string;
}

export function identiteSociete(): IdentiteSociete | null {
  const raisonSociale = process.env.SOCIETE_RAISON_SOCIALE;
  const formeJuridique = process.env.SOCIETE_FORME_JURIDIQUE;
  const siret = process.env.SOCIETE_SIRET;
  const adresse = process.env.SOCIETE_ADRESSE;
  const email = process.env.SOCIETE_EMAIL;

  // Tout ou rien : une identité partielle inspire moins confiance qu'aucune.
  if (!raisonSociale || !formeJuridique || !siret || !adresse || !email) return null;

  return { raisonSociale, formeJuridique, siret, adresse, email };
}

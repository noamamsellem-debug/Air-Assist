-- AlterEnum : nouveau statut « document manquant » (additif, non destructif).
ALTER TYPE "StatutDossier" ADD VALUE 'DOCUMENT_MANQUANT';

-- AlterTable : horodatage de la dernière relance auto (anti-doublon), nullable.
ALTER TABLE "dossier" ADD COLUMN "relance_document_le" TIMESTAMP(3);

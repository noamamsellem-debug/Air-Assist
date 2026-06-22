-- AlterEnum : nouveau sous-type de document « justificatif de frais »
-- (additif, non destructif, rétrocompatible — les valeurs existantes restent valides).
ALTER TYPE "SousTypeDocument" ADD VALUE 'JUSTIFICATIF_FRAIS';

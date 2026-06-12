-- AlterEnum : nouvelles catégories de document (les anciennes restent valides)
ALTER TYPE "TypeDocument" ADD VALUE 'PIECE_IDENTITE';
ALTER TYPE "TypeDocument" ADD VALUE 'JUSTIFICATIF_VOYAGE';
ALTER TYPE "TypeDocument" ADD VALUE 'JUSTIFICATIF_RETARD';
ALTER TYPE "TypeDocument" ADD VALUE 'AUTRE';

-- CreateEnum : sous-type de document
CREATE TYPE "SousTypeDocument" AS ENUM (
  'CNI', 'PASSEPORT', 'PERMIS_CONDUIRE', 'CARTE_SEJOUR',
  'CARTE_EMBARQUEMENT', 'CONFIRMATION_RESERVATION'
);

-- AlterTable : sous-type sur document
ALTER TABLE "document" ADD COLUMN "sous_type" "SousTypeDocument";

-- AlterTable : identité + adresse structurée du passager (nullable)
ALTER TABLE "passager"
  ADD COLUMN "civilite" TEXT,
  ADD COLUMN "date_naissance" TIMESTAMP(3),
  ADD COLUMN "nationalite" TEXT,
  ADD COLUMN "adresse_ligne1" TEXT,
  ADD COLUMN "adresse_complement" TEXT,
  ADD COLUMN "code_postal" TEXT,
  ADD COLUMN "ville" TEXT,
  ADD COLUMN "pays" TEXT;

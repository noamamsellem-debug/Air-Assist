-- CreateEnum
CREATE TYPE "TypeTrajet" AS ENUM ('DIRECT', 'CORRESPONDANCE');

-- AlterTable : trajet multi-segments (JSON) sur le dossier
ALTER TABLE "dossier"
  ADD COLUMN "type_trajet" "TypeTrajet" NOT NULL DEFAULT 'DIRECT',
  ADD COLUMN "reservation_unique" BOOLEAN,
  ADD COLUMN "segments" JSONB;

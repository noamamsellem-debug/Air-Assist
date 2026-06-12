-- CreateEnum
CREATE TYPE "RegionCompagnie" AS ENUM ('EU', 'UK', 'CH', 'EUR_OTHER', 'INTL');
CREATE TYPE "TypeCompagnie" AS ENUM ('legacy', 'lowcost', 'regional', 'leisure');

-- AlterTable : catalogue compagnies (champs facultatifs)
ALTER TABLE "compagnie"
  ADD COLUMN "code_icao" TEXT,
  ADD COLUMN "pays" TEXT,
  ADD COLUMN "region" "RegionCompagnie",
  ADD COLUMN "type" "TypeCompagnie";

-- procedure devient facultatif (renseigné via l'admin)
ALTER TABLE "compagnie" ALTER COLUMN "procedure" DROP NOT NULL;

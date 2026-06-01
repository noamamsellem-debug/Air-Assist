-- AlterEnum : nouveau type de document (pièce d'identité)
ALTER TYPE "TypeDocument" ADD VALUE 'CARTE_IDENTITE';

-- AlterTable : informations recueillies par le tunnel (toutes facultatives)
ALTER TABLE "dossier"
  ADD COLUMN "deja_contacte_compagnie" BOOLEAN,
  ADD COLUMN "description_incident" TEXT,
  ADD COLUMN "langue_communication" TEXT,
  ADD COLUMN "source_marketing" TEXT,
  ADD COLUMN "cause_perturbation" TEXT,
  ADD COLUMN "ou_achete_billet" TEXT,
  ADD COLUMN "code_parrainage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "dossier_code_parrainage_key" ON "dossier"("code_parrainage");

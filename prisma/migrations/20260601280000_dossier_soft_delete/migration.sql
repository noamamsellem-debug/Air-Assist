-- Corbeille (soft delete) des dossiers.
-- Un dossier avec "supprime_le" renseigné est dans la corbeille : exclu des vues
-- normales. La suppression définitive (DELETE + cascade) se fait via « Vider la
-- corbeille ».
ALTER TABLE "dossier" ADD COLUMN "supprime_le" TIMESTAMP(3);

CREATE INDEX "dossier_supprime_le_idx" ON "dossier"("supprime_le");

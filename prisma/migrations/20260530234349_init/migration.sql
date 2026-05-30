-- CreateEnum
CREATE TYPE "MotifVol" AS ENUM ('RETARD', 'ANNULATION', 'SURBOOKING', 'CORRESPONDANCE_MANQUEE');

-- CreateEnum
CREATE TYPE "ProcedureCompagnie" AS ENUM ('EMAIL', 'FORMULAIRE');

-- CreateEnum
CREATE TYPE "StatutDossier" AS ENUM ('NOUVEAU', 'VERIFIE', 'RECLAMATION_ENVOYEE', 'ACCUSE_RECU', 'EN_NEGOCIATION', 'ACCEPTE', 'PAYE', 'REVERSE', 'REFUSE', 'CONTENTIEUX');

-- CreateEnum
CREATE TYPE "TypeDocument" AS ENUM ('CARTE_EMBARQUEMENT', 'JUSTIFICATIF');

-- CreateEnum
CREATE TYPE "AuteurHistorique" AS ENUM ('SYSTEME', 'UTILISATEUR');

-- CreateEnum
CREATE TYPE "StatutKyc" AS ENUM ('NON_DEMARRE', 'EN_COURS', 'VALIDE', 'REFUSE');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'AGENT');

-- CreateTable
CREATE TABLE "passager" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vol" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "compagnie_texte" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "aeroport_depart" TEXT NOT NULL,
    "aeroport_arrivee" TEXT NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "motif" "MotifVol" NOT NULL,
    "duree_retard_min" INTEGER,
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compagnie" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code_iata" TEXT NOT NULL,
    "procedure" "ProcedureCompagnie" NOT NULL,
    "email_reclamation" TEXT,
    "url_formulaire" TEXT,
    "delai_moyen_reponse_jours" INTEGER,
    "auto_active" BOOLEAN NOT NULL DEFAULT false,
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compagnie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dossier" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "statut" "StatutDossier" NOT NULL DEFAULT 'NOUVEAU',
    "passager_id" TEXT NOT NULL,
    "vol_id" TEXT NOT NULL,
    "compagnie_id" TEXT NOT NULL,
    "numero_dossier_compagnie" TEXT,
    "pnr" TEXT,
    "montant_estime" DECIMAL(10,2) NOT NULL,
    "montant_obtenu" DECIMAL(10,2),
    "commission_30" DECIMAL(10,2),
    "part_client_70" DECIMAL(10,2),
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_cloture" TIMESTAMP(3),
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "type" "TypeDocument" NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "taille_octets" INTEGER NOT NULL,
    "contenu_chiffre" BYTEA NOT NULL,
    "iv" BYTEA NOT NULL,
    "auth_tag" BYTEA NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandat_consentement" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "signature_electronique" TEXT NOT NULL,
    "consentement_rgpd" BOOLEAN NOT NULL DEFAULT false,
    "horodatage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preuve" TEXT NOT NULL,
    "version_cgv_acceptee" TEXT NOT NULL,
    "consentement_revoque_le" TIMESTAMP(3),
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mandat_consentement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historique_statut" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "ancien_statut" "StatutDossier",
    "nouveau_statut" "StatutDossier" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteur" "AuteurHistorique" NOT NULL,
    "commentaire" TEXT,

    CONSTRAINT "historique_statut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiement" (
    "id" TEXT NOT NULL,
    "dossier_id" TEXT NOT NULL,
    "token_psp" TEXT NOT NULL,
    "statut_kyc_beneficiaire" "StatutKyc" NOT NULL DEFAULT 'NON_DEMARRE',
    "montant_recu_compagnie" DECIMAL(10,2),
    "part_reversee_client" DECIMAL(10,2),
    "date_encaissement" TIMESTAMP(3),
    "date_reversement" TIMESTAMP(3),
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT,
    "mot_de_passe_hash" TEXT,
    "role" "RoleUtilisateur" NOT NULL DEFAULT 'AGENT',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "cree_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maj_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "passager_email_idx" ON "passager"("email");

-- CreateIndex
CREATE INDEX "vol_numero_date_idx" ON "vol"("numero", "date");

-- CreateIndex
CREATE UNIQUE INDEX "compagnie_code_iata_key" ON "compagnie"("code_iata");

-- CreateIndex
CREATE UNIQUE INDEX "dossier_reference_key" ON "dossier"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "dossier_vol_id_key" ON "dossier"("vol_id");

-- CreateIndex
CREATE INDEX "dossier_statut_idx" ON "dossier"("statut");

-- CreateIndex
CREATE INDEX "dossier_compagnie_id_idx" ON "dossier"("compagnie_id");

-- CreateIndex
CREATE INDEX "dossier_date_creation_idx" ON "dossier"("date_creation");

-- CreateIndex
CREATE INDEX "document_dossier_id_idx" ON "document"("dossier_id");

-- CreateIndex
CREATE UNIQUE INDEX "mandat_consentement_dossier_id_key" ON "mandat_consentement"("dossier_id");

-- CreateIndex
CREATE INDEX "historique_statut_dossier_id_date_idx" ON "historique_statut"("dossier_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "paiement_dossier_id_key" ON "paiement"("dossier_id");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- AddForeignKey
ALTER TABLE "dossier" ADD CONSTRAINT "dossier_passager_id_fkey" FOREIGN KEY ("passager_id") REFERENCES "passager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossier" ADD CONSTRAINT "dossier_vol_id_fkey" FOREIGN KEY ("vol_id") REFERENCES "vol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dossier" ADD CONSTRAINT "dossier_compagnie_id_fkey" FOREIGN KEY ("compagnie_id") REFERENCES "compagnie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "dossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandat_consentement" ADD CONSTRAINT "mandat_consentement_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "dossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_statut" ADD CONSTRAINT "historique_statut_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "dossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "dossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

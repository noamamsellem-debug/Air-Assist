/**
 * Crée / met à jour UN compte back-office (rôle ADMIN), de façon sécurisée.
 *
 * Le mot de passe N'EST JAMAIS en dur ni dans le dépôt : il est lu depuis la
 * variable d'environnement ADMIN_PASSWORD, hashé en bcrypt, puis stocké. Le mot
 * de passe en clair ne transite ni par le code, ni par les logs.
 *
 * Lancement (le mot de passe ne reste pas dans l'historique shell si tu mets un
 * espace devant la commande) :
 *
 *   ADMIN_PASSWORD='TonMotDePasseFort' npm run db:seed-admin
 *
 * Pour cibler la base de PROD depuis ta machine :
 *   ADMIN_PASSWORD='…' DATABASE_URL='postgres://…prod…' npm run db:seed-admin
 *
 * Optionnel : ADMIN_EMAIL pour changer l'identifiant (défaut info@airassist.eu).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "info@airassist.eu").trim().toLowerCase();
  const motDePasse = process.env.ADMIN_PASSWORD ?? "";

  if (!motDePasse) {
    console.error(
      "❌ ADMIN_PASSWORD manquant. Relance avec :\n" +
        "   ADMIN_PASSWORD='TonMotDePasseFort' npm run db:seed-admin",
    );
    process.exit(1);
  }
  if (motDePasse.length < 12) {
    console.error("❌ Mot de passe trop court (12 caractères minimum).");
    process.exit(1);
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 12);

  const user = await prisma.utilisateur.upsert({
    where: { email },
    update: { role: "ADMIN", actif: true, motDePasseHash },
    create: { email, nom: "Administrateur", role: "ADMIN", actif: true, motDePasseHash },
  });

  console.log(`✅ Compte admin prêt : ${user.email} (rôle ${user.role}, actif ${user.actif}).`);
  console.log("   Le mot de passe est stocké HASHÉ (bcrypt). Aucun mot de passe en clair n'a été affiché ni journalisé.");
}

main()
  .catch((e) => {
    console.error("Échec du seed admin :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Bootstrap UNIQUE du premier compte admin, sans terminal.
 *
 * Sécurité (toutes conditions requises) :
 *  - désactivé tant que ADMIN_BOOTSTRAP_TOKEN n'est pas défini en variable d'env ;
 *  - le `?token=` doit correspondre exactement à ADMIN_BOOTSTRAP_TOKEN ;
 *  - le mot de passe vient de ADMIN_BOOTSTRAP_PASSWORD (≥ 12 car.), jamais du code ;
 *  - refuse de s'exécuter s'il existe déjà un compte ADMIN (donc strictement
 *    « une seule fois »).
 * Le mot de passe est stocké HASHÉ (bcrypt). À supprimer (les 2 variables d'env)
 * juste après usage.
 */
export async function GET(request: Request) {
  const tokenAttendu = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!tokenAttendu) {
    return NextResponse.json({ error: "Bootstrap désactivé." }, { status: 404 });
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token !== tokenAttendu) {
    return NextResponse.json({ error: "Jeton invalide." }, { status: 403 });
  }

  const email = (process.env.ADMIN_BOOTSTRAP_EMAIL ?? "info@airassist.eu").trim().toLowerCase();
  const motDePasse = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  if (motDePasse.length < 12) {
    return NextResponse.json(
      { error: "ADMIN_BOOTSTRAP_PASSWORD manquant ou trop court (12 caractères minimum)." },
      { status: 400 },
    );
  }

  const adminsExistants = await prisma.utilisateur.count({ where: { role: "ADMIN" } });
  if (adminsExistants > 0) {
    return NextResponse.json(
      { error: "Un compte admin existe déjà. Bootstrap refusé (déjà configuré)." },
      { status: 409 },
    );
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 12);
  const user = await prisma.utilisateur.upsert({
    where: { email },
    update: { role: "ADMIN", actif: true, motDePasseHash },
    create: { email, nom: "Administrateur", role: "ADMIN", actif: true, motDePasseHash },
  });

  return NextResponse.json({
    ok: true,
    message:
      `Compte admin créé : ${user.email} (rôle ADMIN). Connecte-toi sur /admin/login, ` +
      `puis SUPPRIME les variables ADMIN_BOOTSTRAP_TOKEN et ADMIN_BOOTSTRAP_PASSWORD dans Vercel.`,
  });
}

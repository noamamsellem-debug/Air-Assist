# Mettre Air Assist en ligne (URL publique) — pas à pas

Objectif : obtenir une **adresse web accessible** (ex. `https://air-assist.vercel.app`) en ~10 min.
Hébergement gratuit, base de données en **région UE** (RGPD).

> Tu as besoin de deux comptes gratuits : **Vercel** (héberge l'app) et **Neon** (base PostgreSQL UE).
> Les deux se créent en se connectant avec ton compte GitHub.

---

## Étape 1 — Créer la base de données (Neon, gratuit, région UE)

1. Va sur **https://neon.tech** → *Sign up* (connexion avec GitHub).
2. *Create project* → **Region : Europe (Frankfurt)**.
3. Une fois créé, copie la **Connection string** (elle ressemble à
   `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`).
   Garde-la de côté : ce sera `DATABASE_URL`.

## Étape 2 — Déployer l'application (Vercel)

1. Va sur **https://vercel.com** → *Sign up* (connexion avec GitHub).
2. *Add New… → Project* → importe le dépôt **`noamamsellem-debug/air-assist`**.
3. Avant de cliquer *Deploy*, ouvre **Environment Variables** et ajoute :

   | Nom | Valeur |
   |-----|--------|
   | `DATABASE_URL` | la *connection string* Neon de l'étape 1 |
   | `AUTH_SECRET` | une valeur secrète aléatoire (voir ci-dessous) |
   | `NEXT_PUBLIC_SITE_URL` | `https://TON-PROJET.vercel.app` (l'URL que Vercel te donnera) |
   | `ADAPTER_MODE` | `mock` |
   | `COMMISSION_RATE` | `0.30` |

   Pour générer `AUTH_SECRET`, sur ton ordinateur : `openssl rand -base64 32`
   (ou utilise n'importe quelle longue chaîne aléatoire).

4. Clique **Deploy**. Vercel exécute automatiquement `vercel-build` :
   génération du client Prisma → **migrations** → **seed** (données + comptes démo) → build.

5. À la fin, Vercel affiche ton URL. **C'est ton site en ligne.** 🎉

> Si tu changes l'URL plus tard, mets `NEXT_PUBLIC_SITE_URL` à jour et redéploie.

---

## Étape 3 — Accéder au site

- **Côté client (public)** : `https://TON-PROJET.vercel.app`
  → tu arrives sur l'accueil (redirigé vers `/fr`), avec le calculateur et le tunnel de réclamation.
- **Côté admin (CRM)** : `https://TON-PROJET.vercel.app/admin`
  → connexion avec les comptes de démo :
  - **Admin** : `admin@air-assist.example` / `admin1234`
  - **Agent** : `agent@air-assist.example` / `agent1234`

> ⚠️ Change ces mots de passe de démo avant toute utilisation réelle, et retire le bandeau
> « validation avocat » seulement après validation juridique.

---

## Notes

- Le **seed est idempotent** : il ne recrée les données de démo que si la base est vide. Pour
  réinitialiser volontairement, mets la variable `SEED_MODE=reset` puis redéploie.
- Pour brancher les **vrais prestataires** (e-mail, signature eIDAS, PSP, données de vol),
  passe les `*_PROVIDER` de `mock` à leur valeur réelle et ajoute les clés
  (voir `.env.example` et `docs/deploiement-ue.md`).
- Alternative 100 % conteneur (OVH, Scaleway, un VPS) : `docker compose up --build`
  (voir le README).

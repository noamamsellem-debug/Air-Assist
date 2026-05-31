# Déploiement (hébergement UE — cohérence RGPD)

> Le déploiement n'est pas effectué automatiquement. Ce guide décrit comment mettre Air Assist
> en production dans l'Union européenne.

## Principes
- **Toutes les données dans l'UE** : base PostgreSQL et application hébergées en région UE.
- Variables d'environnement via le gestionnaire de secrets de la plateforme (jamais commitées).
- HTTPS obligatoire, en-têtes de sécurité, sauvegardes chiffrées.

## Option A — Vercel (app) + Postgres UE managé
1. Créer un projet Vercel, région **`fra1`** (Francfort) ou autre région UE.
2. Base PostgreSQL UE : Neon (région EU), Scaleway, OVHcloud, Supabase (région EU) ou RDS eu-west.
3. Définir les variables d'environnement (voir `.env.example`) dans Vercel :
   - `DATABASE_URL`, `AUTH_SECRET`, `DOCUMENT_ENCRYPTION_KEY`, `COMMISSION_RATE`,
     `NEXT_PUBLIC_SITE_URL`, et les `*_PROVIDER` + clés des prestataires réels.
4. Build : `npm run build`. Migrations : `npm run db:deploy` (étape de release).

## Option B — Conteneur (OVHcloud / Scaleway / Clever Cloud, UE)
1. `Dockerfile` Node 20, `npm ci && npm run build`, `npm run start`.
2. Postgres managé UE rattaché par `DATABASE_URL`.
3. Lancer `prisma migrate deploy` au démarrage du conteneur de release.

## Bascule des adaptateurs en production
Passer chaque `*_PROVIDER` de `mock` à la valeur réelle et renseigner les clés :
- `EMAIL_PROVIDER` → SMTP pro / Postmark / Brevo (`EMAIL_API_KEY` / `SMTP_*`)
- `ESIGN_PROVIDER` → Yousign / Universign (eIDAS) (`ESIGN_API_KEY`)
- `PSP_PROVIDER` → Stripe Connect / Lemonway / MangoPay — **cantonnement des fonds** (`PSP_API_KEY`)
- `FLIGHTDATA_PROVIDER` → AviationStack / FlightAware (`FLIGHTDATA_API_KEY`)

Chaque adaptateur a une interface stable (`src/adapters/*`) : il suffit d'ajouter la classe
réelle dans le `switch` de la factory correspondante.

## Sécurité & RGPD à vérifier avant lancement
- `DOCUMENT_ENCRYPTION_KEY` : vraie clé 32 octets (base64), rotation documentée.
- `AUTH_SECRET` : secret fort unique.
- Accès CRM limité par rôle ; journalisation des accès activée.
- Bandeau « validation avocat » retiré seulement après validation juridique.
- Tenir le registre des traitements (`docs/registre-traitements.md`).

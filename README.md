# Air Assist

Plateforme de réclamation d'indemnités pour vols **retardés / annulés / surbookés** au
titre du règlement européen **EC 261/2004**.

Modèle économique : **commission de 30 %** sur l'indemnité obtenue (le client perçoit 70 %).
Marché France puis Europe, **multilingue** (fr / en / es).

> ⚠️ **Ne pas lancer commercialement avant validation par un avocat** (statut
> d'intermédiation, validité du mandat, encaissement/cantonnement des fonds, RGPD, CGV).

---

## État d'avancement (construction module par module)

| # | Module | État |
|---|--------|------|
| 1 | **Modèle de données + migrations + seed + tests calculs** | ✅ livré |
| 2 | Machine à états des statuts + historique | ⏳ à venir |
| 3 | Moteur d'éligibilité EC 261/2004 | ⏳ |
| 4 | Calculateur public | ⏳ |
| 5 | Tunnel d'inscription passager | ⏳ |
| 6 | CRM — fiche dossier | ⏳ |
| 7 | CRM — liste & tableau de bord | ⏳ |
| 8 | Génération semi-auto des réclamations | ⏳ |
| 9 | Adaptateurs e-mail | ⏳ |
| 10 | Pages SEO programmatiques | ⏳ |
| 11 | Adaptateur Paiement/PSP | ⏳ |

---

## Stack

- **Next.js** (App Router) + **TypeScript** *(ajouté aux modules front)*
- **PostgreSQL** via **Prisma** (ORM + migrations) — en place
- **next-intl** pour le multilingue *(module front)*
- **Tailwind CSS** *(module front)*
- **NextAuth/Auth.js** (rôles `admin` / `agent`) *(module CRM)*
- **Tests** : **Vitest** (unitaire, en place) + **Playwright** (E2E, modules front)
- **Validation** : **Zod** sur toutes les entrées
- Hébergement cible **UE** (cohérence RGPD)

---

## Installation (état actuel — module 1)

Pré-requis : Node 20+, PostgreSQL 14+.

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env
# éditez DATABASE_URL si besoin

# 3. Base de données : migration + génération du client
npm run db:migrate        # applique les migrations (crée la base si besoin)
npm run db:generate       # (re)génère le client Prisma

# 4. Données de démonstration
npm run db:seed           # 3 compagnies + 4 dossiers fictifs

# 5. Tests
npm test                  # Vitest : calculs commission / part client, références
npm run typecheck         # vérification TypeScript
```

---

## Modèle de données

Schéma complet dans [`prisma/schema.prisma`](./prisma/schema.prisma). Entités :

`Passager` · `Vol` · `Compagnie` · **`Dossier`** (centrale) · `Document` ·
`MandatConsentement` · `HistoriqueStatut` · `Paiement` · `Utilisateur` (CRM).

### Invariants de conception (importants)

- **Aucun IBAN** n'est stocké côté Air Assist. Les coordonnées bancaires vivent **chez le
  PSP** ; on ne conserve qu'un `tokenPsp` (modèle `Paiement`).
- `commission30` et `partClient70` du `Dossier` sont **dérivés** de `montantObtenu` et
  jamais saisis à la main — logique pure dans
  [`src/domain/commission.ts`](./src/domain/commission.ts). Invariant garanti et testé :
  `commission + partClient === montantObtenu` (au centime, sans dérive).
- L'historique des statuts (`HistoriqueStatut`) est **append-only**.
- La preuve du mandat (`MandatConsentement`) est conservée et **immuable** ; le
  consentement RGPD est révocable (`consentementRevoqueLe`) sans altérer la preuve.
- Les documents sont **chiffrés au repos** (champs `contenuChiffre` / `iv` / `authTag`).

### Cycle de vie du dossier (statuts)

```
Nouveau → Vérifié → Réclamation envoyée → Accusé reçu → En négociation
        → Accepté → Payé → Reversé          (+ Refusé / Contentieux)
```

La **machine à états** (module 2) n'autorisera que les transitions valides et journalisera
chaque changement dans `HistoriqueStatut`.

---

## Adaptateurs de services externes (mode `mock` par défaut)

Chaque service externe est abstrait derrière un adaptateur, avec une implémentation
`mock` qui fait tourner tout le parcours en local **sans clé API**. Le branchement réel se
fait via `.env` (voir `.env.example`) :

| Service | Variable `*_PROVIDER` | Exemples prod | Branchement |
|---------|------------------------|---------------|-------------|
| E-mail | `EMAIL_PROVIDER` | Postmark, Brevo, SMTP | clés `SMTP_*` / `EMAIL_API_KEY` |
| Signature eIDAS | `ESIGN_PROVIDER` | Yousign, Universign | `ESIGN_API_KEY` |
| Paiement / KYC | `PSP_PROVIDER` | Stripe Connect, Lemonway, MangoPay | `PSP_API_KEY` |
| Données de vol | `FLIGHTDATA_PROVIDER` | AviationStack, FlightAware | `FLIGHTDATA_API_KEY` |

> Ne mettez **jamais** de vraie clé en dur dans le code. Tout passe par `.env`
> (non commité) ; `.env.example` documente chaque variable.

---

## Déploiement (UE — RGPD)

À documenter en détail lors des modules front. Cible : hébergement **dans l'Union
européenne** (base PostgreSQL et application), pour la cohérence RGPD. Le déploiement
n'est pas effectué dans ce dépôt.

---

## Scripts

| Script | Rôle |
|--------|------|
| `npm test` | tests unitaires Vitest |
| `npm run test:watch` | Vitest en mode watch |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | applique/crée les migrations Prisma |
| `npm run db:deploy` | applique les migrations (prod) |
| `npm run db:generate` | régénère le client Prisma |
| `npm run db:seed` | données de démonstration |
| `npm run db:reset` | réinitialise la base + reseed |

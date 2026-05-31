# Air Assist

Plateforme de réclamation d'indemnités pour vols **retardés / annulés / surbookés** au
titre du règlement européen **EC 261/2004**.

Modèle économique : **commission de 30 %** sur l'indemnité obtenue (le client perçoit 70 %).
Marché France puis Europe, **multilingue** (fr / en / es, une URL par langue, `hreflang`).

> ⚠️ **Ne pas lancer commercialement avant validation par un avocat** (statut
> d'intermédiation, validité du mandat, encaissement/cantonnement des fonds, RGPD, CGV).
> Un bandeau le rappelle dans tout le CRM.

---

## Modules livrés

| # | Module | État |
|---|--------|------|
| 1 | Modèle de données + migrations + seed + tests calculs | ✅ |
| 2 | Machine à états des statuts + historique append-only | ✅ |
| 3 | Moteur d'éligibilité EC 261/2004 (fonction pure) | ✅ |
| 4 | Calculateur public (page d'accueil) | ✅ |
| 5 | Tunnel d'inscription (calcul → coordonnées → documents → mandat signé) | ✅ |
| 6 | CRM — fiche dossier (vue complète, changement de statut) | ✅ |
| 7 | CRM — liste & tableau de bord (KPIs, alertes, filtres) | ✅ |
| 8 | Génération semi-auto des réclamations (fr/en/es, validation 1 clic) | ✅ |
| 9 | Adaptateurs e-mail (envoi, réponse auto, mock en dev) | ✅ |
| 10 | Pages SEO programmatiques + sitemap + robots + Schema.org | ✅ |
| 11 | Adaptateur Paiement/PSP (KYC + reversement par token, mock) | ✅ |

Tous les services externes (PSP, signature eIDAS, e-mail, données de vol) sont derrière un
**adaptateur** avec une implémentation **mock** : tout le parcours tourne en local **sans clé API**.

---

## Stack

- **Next.js 15** (App Router) + **TypeScript** strict
- **PostgreSQL** via **Prisma** (ORM + migrations)
- **next-intl** (i18n fr/en/es, une URL par langue, `hreflang`)
- **Tailwind CSS**
- **NextAuth / Auth.js v5** (CRM, rôles `ADMIN` / `AGENT`)
- **Zod** (validation de toutes les entrées formulaires + API)
- **Vitest** (unitaire) + **Playwright** (E2E)

---

## Démarrage rapide

Pré-requis : Node 20+, PostgreSQL 14+.

```bash
npm install
cp .env.example .env          # ajustez DATABASE_URL si besoin

npm run db:migrate            # crée le schéma
npm run db:seed               # 3 compagnies, 4 dossiers, 2 comptes CRM

npm run dev                   # http://localhost:3000  → redirige vers /fr
```

**Tout le parcours passager fonctionne en local, sans clé externe** (adaptateurs en mode mock).

### Comptes CRM de démonstration

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Admin | `admin@air-assist.example` | `admin1234` |
| Agent | `agent@air-assist.example` | `agent1234` |

CRM : http://localhost:3000/admin

---

## Parcours de bout en bout

1. **Accueil `/fr`** → calculateur : n° de vol + aéroports + motif → estimation instantanée.
2. **« Lancer ma réclamation »** → tunnel : éligibilité → coordonnées → upload (chiffré) →
   **mandat + consentement RGPD signés électroniquement** → n° de dossier auto (`AA-2026-000001`).
3. **CRM** → tableau de bord (en-cours / encaissé / commission, alertes), liste filtrable,
   fiche dossier : changement de statut (transitions validées + historisées), génération de la
   réclamation (fr/en/es) avec validation humaine en un clic, suivi jusqu'au reversement.

---

## Tests

```bash
npm test          # 76 tests unitaires Vitest
npm run typecheck # TypeScript strict
npm run build     # build de production
npm run test:e2e  # Playwright (nécessite des navigateurs installés)
```

Couverture unitaire : barème & éligibilité EC 261 (cas limites, réduction 50 %), répartition
commission/part client (invariant `commission + part === montant`), machine à états
(transitions interdites), chiffrement AES-256-GCM, génération multilingue des réclamations,
distance haversine + intra-UE, sélection des adaptateurs.

---

## Modèle de données

Schéma : [`prisma/schema.prisma`](./prisma/schema.prisma).

`Passager` · `Vol` · `Compagnie` · **`Dossier`** (centrale) · `Document` · `MandatConsentement` ·
`HistoriqueStatut` · `Paiement` · `Utilisateur` (CRM).

**Invariants de conception :**
- **Aucun IBAN stocké** côté Air Assist : coordonnées bancaires chez le PSP, on ne garde qu'un
  `tokenPsp`.
- `commission30` / `partClient70` **dérivés** de `montantObtenu` (jamais saisis) —
  [`src/domain/commission.ts`](./src/domain/commission.ts), invariant testé.
- `HistoriqueStatut` **append-only** ; toute transition de statut écrit une ligne.
- Preuve du mandat **immuable** ; consentement RGPD **révocable** sans altérer la preuve.
- Documents **chiffrés au repos** (AES-256-GCM).

### Cycle de vie du dossier

```
Nouveau → Vérifié → Réclamation envoyée → Accusé reçu → En négociation
        → Accepté → Payé → Reversé          (+ Refusé / Contentieux)
```

Machine à états : [`src/domain/statut.ts`](./src/domain/statut.ts) — seules les transitions
valides sont autorisées.

---

## Adaptateurs (mode `mock` par défaut)

| Service | `*_PROVIDER` | Exemples prod | Code |
|---------|--------------|---------------|------|
| E-mail | `EMAIL_PROVIDER` | Postmark, Brevo, SMTP | `src/adapters/email.ts` |
| Signature eIDAS | `ESIGN_PROVIDER` | Yousign, Universign | `src/adapters/esign.ts` |
| Paiement / KYC | `PSP_PROVIDER` | Stripe Connect, Lemonway, MangoPay | `src/adapters/psp.ts` |
| Données de vol | `FLIGHTDATA_PROVIDER` | AviationStack, FlightAware | `src/adapters/flightdata.ts` |

Passer un provider de `mock` à sa valeur réelle et renseigner la clé associée dans `.env`
(voir `.env.example`). Chaque factory expose un `switch` où ajouter la classe réelle.
**Aucune clé n'est jamais en dur dans le code.**

---

## Juridique & RGPD (intégrés au code)

- Pages multilingues éditables : mentions légales, **confidentialité**, **CGV** (commission de
  30 % affichée clairement + droit de rétractation 14 j), cookies.
- Mandat signé électroniquement (horodatage + preuve), consentement RGPD explicite et révocable.
- Chiffrement au repos des documents, CRM protégé par rôle, `robots.txt` interdit l'indexation
  du CRM/API.
- **Registre des traitements** : structure dans [`docs/registre-traitements.md`](./docs/registre-traitements.md).
- Bandeau « validation avocat » visible dans tout le CRM.

---

## Déploiement (UE)

Guide complet : [`docs/deploiement-ue.md`](./docs/deploiement-ue.md). Cible : application **et**
base PostgreSQL hébergées dans l'UE (cohérence RGPD). Le déploiement n'est pas effectué ici.

---

## Scripts

| Script | Rôle |
|--------|------|
| `npm run dev` / `build` / `start` | serveur Next.js |
| `npm test` / `test:watch` | tests unitaires Vitest |
| `npm run test:e2e` | tests Playwright |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` / `db:deploy` | migrations Prisma |
| `npm run db:seed` / `db:reset` | données de démonstration |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Air Assist — plateforme de réclamation d'indemnités pour vols perturbés (règlement **EC 261/2004**).
Modèle : commission de 30 % sur l'indemnité obtenue. Le code, les commentaires, les noms de
variables et les messages de commit sont **en français** — s'y conformer.

## Commandes

```bash
npm run dev                 # serveur de dev (redirige / → /fr)
npm run build               # build de production
npm run typecheck           # tsc --noEmit (strict + noUncheckedIndexedAccess)
npm test                    # Vitest (tests/**/*.test.ts + src/**/*.test.ts)
npx vitest run tests/eligibilite.test.ts        # un seul fichier
npx vitest run -t "réduction 50"                # un seul cas par son nom
npm run test:e2e            # Playwright — exige un `npm run build` préalable
                            #   (webServer lance `npm run start`)

npm run db:migrate          # prisma migrate dev
npm run db:seed             # 3 compagnies, 4 dossiers, 2 comptes CRM
npm run db:reset            # reset + reseed

docker compose up --build   # PostgreSQL + migrations + seed + app, en une commande
```

CI (`.github/workflows/ci.yml`) = `typecheck` + `test` + `build` avec PostgreSQL, puis un job
e2e séparé (seed + `playwright install chromium` + build + `test:e2e`). Avant de conclure une
tâche, `npm run typecheck && npm test && npm run build` doivent être verts.

## Architecture

### Découpage en couches

- **`src/domain/`** — logique métier **pure**, sans I/O ni Prisma : `eligibilite.ts` (barème
  250/400/600 €, seuil 3 h, circonstances exceptionnelles), `commission.ts` (invariant
  `commission30 + partClient70 === montantObtenu`), `statut.ts` (machine à états), `distance.ts`
  (haversine + détection intra-UE), `money.ts`, `motif.ts`, `reference.ts` (génère les références
  `AA-2026-000123`). C'est ici que vivent les règles
  juridiques et c'est ici que les tests unitaires portent. Toute règle EC 261 nouvelle va dans
  `domain/`, jamais dans un composant ou une route.
- **`src/adapters/`** — `email.ts`, `esign.ts`, `psp.ts`, `flightdata.ts`. Chaque service externe
  est derrière une interface avec une implémentation **mock** sélectionnée par une variable
  `*_PROVIDER` (voir `.env.example`). En mode mock, tout le parcours tourne sans clé API — ne
  jamais appeler un SDK tiers directement depuis une route ou un composant, ajouter une branche
  au `switch` de la factory concernée.
- **`src/lib/`** — glue applicative : `prisma.ts` (singleton), `auth.ts` (NextAuth v5),
  `validation.ts` (tous les schémas Zod), `crypto.ts` (AES-256-GCM au repos), `seo.ts`
  (canonical/hreflang/OG), et les services orchestrant Prisma + adaptateurs
  (`dossier-service`, `depot-service`, `reclamation-service`, `email-service`, `corbeille-service`).
- **`src/data/`** — contenu statique typé (aéroports, compagnies, contenu rédactionnel SEO).
  Aucune requête DB.

### Invariants à ne pas casser

- **Aucun IBAN en base** : les coordonnées bancaires restent chez le PSP, on ne garde qu'un `tokenPsp`.
- `commission30` / `partClient70` sont **dérivés** de `montantObtenu`, jamais saisis.
- `HistoriqueStatut` est **append-only** : toute transition de statut écrit une ligne. Passer par
  la machine à états de `domain/statut.ts` (`TRANSITIONS`, `peutTransiter`, `appliquerTransition`,
  `TransitionInterditeError`) — les transitions invalides doivent rester refusées. `StatutDossier` :
  `NOUVEAU → DOCUMENT_MANQUANT → VERIFIE → RECLAMATION_ENVOYEE → ACCUSE_RECU → EN_NEGOCIATION →
  ACCEPTE → PAYE → REVERSE` (seul état terminal), plus `REFUSE` / `CONTENTIEUX`. Attention :
  `NOUVEAU` s'affiche « Soumis » dans le CRM (`LIBELLES_STATUT`).
- La preuve du mandat est **immuable** ; le consentement RGPD est révocable sans altérer la preuve
  (`MandatConsentement.consentementRevoqueLe` trace la révocation).
- Les dossiers sont **soft-deleted** (`Dossier.supprimeLe` + `corbeille-service.ts`) : filtrer
  dessus dans toute nouvelle requête de liste.
- Documents **chiffrés au repos** via `lib/crypto.ts`.
- Le bandeau « validation avocat » du layout CRM (`src/app/admin/(protected)/layout.tsx`) est
  volontaire — ne pas le retirer.

### i18n (next-intl)

`src/i18n/routing.ts` déclare **19 locales** (`localePrefix: "always"`, défaut `fr`) et
`messages/*.json` en contient une par langue. `src/middleware.ts` combine le middleware next-intl,
la canonicalisation d'origine et une table de redirections 301 des anciennes URLs SEO — l'étendre
plutôt que de créer des `redirect()` épars. Les routes `/api` et `/admin` sont **hors i18n** (CRM
en français uniquement).

Toute chaîne visible d'une page publique passe par next-intl : ajouter la clé dans **les 19**
fichiers `messages/*.json` (FR/EN/ES traduits, repli anglais ailleurs).

### Pages SEO programmatiques

**Deux générations coexistent** — identifier la bonne avant d'ajouter une page :

1. **Routes dynamiques multilingues** — `aeroports/[iata]`, `compagnies/[code]`, `blog/[slug]`.
   `generateStaticParams()` fait le produit `routing.locales × clés de données`, les métadonnées
   passent par `buildMetadata()` de `lib/seo.ts` (canonical + hreflang complet + `x-default`), et
   le JSON-LD (FAQPage/Service/Article + BreadcrumbList) est inline. Données : `AEROPORTS`,
   `COMPAGNIES_SEO`, `ARTICLES`.
2. **Pages « gabarit » enrichies, FR uniquement** — une route physique
   `src/app/[locale]/<slug>/page.tsx` de ~15 lignes qui n'orchestre rien : `dynamicParams = false`,
   `generateStaticParams()` renvoyant `[{ locale: "fr" }]`, puis délégation à un gabarit de
   `src/components/seo/` (`AeroportPage`, `CompagniePage`, `DestinationPage`, `ArticleBlog`, tous
   bâtis sur `SeoPage`). Métadonnées via `buildSeoMetadata()` : canonical `/fr/<path>` **sans
   hreflang**, délibérément, tant que les traductions n'existent pas. Le contenu unique vit dans
   `src/data/pages-*.ts` / `articles-blog.ts` sous forme de blocs typés (`Bloc` = `h2|h3|p|ul|ol`,
   rendus par `ProseBlocks`, qui parse le `**gras**` inline).

Pour ajouter une page de type 2 : entrée de données dans le `src/data/pages-*.ts` correspondant →
dossier de route reprenant le gabarit existant → vérifier que `src/app/sitemap.ts` l'inclut (il
itère sur ces tableaux, et maintient une liste `PAGES_SEO_FR` à part pour les routes FR-only).

`SITE_URL` (`lib/seo.ts`) ignore volontairement `NEXT_PUBLIC_SITE_URL` si c'est `localhost` ou un
domaine `vercel.app`, et retombe sur `https://airassist.eu` — pour ne pas indexer une preview.

### CRM / auth

NextAuth v5 en `src/lib/auth.ts` (Credentials + bcrypt sur `Utilisateur.motDePasseHash`, rejet si
`!user.actif`, session JWT, rôle `ADMIN`/`AGENT` propagé dans le token puis la session).

La protection est faite par le **layout** `src/app/admin/(protected)/layout.tsx` qui
`redirect("/admin/login")` — **pas par le middleware, qui exclut `/admin` explicitement**. Toute
nouvelle page CRM doit donc être placée sous ce groupe de routes, sinon elle est publique. Le rôle
est affiché dans l'en-tête mais il n'existe aujourd'hui **aucun gating ADMIN vs AGENT** : les
routes API ne vérifient que la présence d'une session. `robots.ts` interdit l'indexation de
`/admin` et `/api`.

### Routes API

Pas de wrapper partagé : chaque route réécrit la même séquence à la main (cf.
`src/app/api/eligibilite/route.ts`) — la reproduire à l'identique :

1. routes admin : `const session = await auth()` → **401** `{ error: "Non autorisé" }` si absente ;
2. `await request.json()` en `try/catch` → **400** `{ error: "JSON invalide" }` ;
3. `safeParse` d'un schéma Zod de `lib/validation.ts` → **422**
   `{ error: "Données invalides", details: parsed.error.flatten() }` ;
4. refus métier → **422** avec un `code` stable en majuscules (`DATE_FUTURE`, `AEROPORT_INCONNU`,
   `TRAJET_INVALIDE`, `TROP_ANCIEN`) consommé par le front ;
5. `catch` final → `console.error` + **500** `{ error: "Erreur serveur" }` ;
6. succès → `{ ok: true, ... }` ou le payload directement.

**400 est réservé au JSON malformé — un échec Zod renvoie 422**, ne pas confondre. Tous les
schémas vivent dans `lib/validation.ts`. Les `params` sont des `Promise<{...}>` (Next 15) partout.

## Design

Un skill `design-sync` (`.claude/skills/design-sync/SKILL.md`) fixe la charte : tokens Tailwind
`brand`/`accent`/`ink` (jamais de couleur en dur), classes utilitaires de `globals.css`
(`.hero-gradient`, `.section`, `.eyebrow`, `.card`, `.trust-pill`), et réutilisation des
composants partagés de `src/components/home/` avant d'en créer de nouveaux. L'invoquer avant de
créer ou moderniser une page publique.

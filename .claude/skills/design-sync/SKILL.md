---
name: design-sync
description: Système de design « Tableau des départs » d'Air Assist — identité tirée du vocabulaire aérien (affichage des départs, statuts, codes IATA). À invoquer pour créer ou moderniser une page ou un composant PUBLIC en cohérence avec le reste du site : tokens, tableau d'affichage, estimateur, cartes, typographie.
---

# Design Sync — charte visuelle Air Assist

Direction **« Tableau des départs »**. Le site énonce des statuts, il ne vend pas.
Marque = **Air Assist**. Périmètre : **pages publiques uniquement** — le CRM
(`/admin`) garde l'ancienne charte `brand` et n'est pas concerné.

## 0. Le principe qui prime sur tout

Le site est **clair**. Le tableau sombre est un **objet posé dedans** (hero,
estimateur, suivi de dossier), **jamais un fond de page**. L'audience inclut des
personnes âgées : la lisibilité passe avant l'effet.

## 1. Sémantique des couleurs (à ne pas détourner)

| Token | Sens | Emploi |
|---|---|---|
| `ambre` | **le problème** | Retard, annulation, dossier en attente. **Jamais un CTA, jamais un succès.** |
| `vol` | **l'action et la bonne nouvelle** | Boutons, liens, indemnité versée, dossier gagné. |
| `alerte` | échec ferme | Annulation confirmée, erreur de formulaire. |
| `board` | matière du tableau | Fonds sombres des objets « tableau ». |
| `ink` | texte et surfaces claires | Aucun sens métier. |

La règle qui compte : **on ne baigne pas une bonne nouvelle dans une couleur
d'avertissement**. Un montant d'indemnité, un dossier gagné, un bouton : `vol`.

`brand` / `accent` sont **réservés au CRM**. Ne pas les utiliser sur le public.
Jamais de couleur en dur — tout passe par les tokens de `tailwind.config.ts`.

## 2. Typographie

- `font-display` — **Archivo** (600/700/800). Titres uniquement, graisses lourdes,
  interlettrage resserré. Les tailles `text-display-*` portent déjà graisse et tracking.
- `font-sans` — **Inter**. Texte courant, petits corps.
- `font-mono` — **IBM Plex Mono**. Registre technique du tableau : codes IATA,
  heures, statuts, références de dossier, montants qui défilent. Les labels
  d'affichage utilisent `text-board-label` (majuscules espacées).

Chargées par `next/font` dans `src/app/[locale]/layout.tsx` → variables CSS.
Ne pas ajouter de police sans passer par `next/font`.

## 3. Classes utilitaires (`globals.css`)

- `.board` — le tableau d'affichage (objet sombre). `.on-board` sur un conteneur
  bascule l'anneau de focus en ambre pour rester visible sur fond sombre.
- `.board-row` / `.board-label` / `.board-statut` + modificateurs
  `--perturbe` (ambre) · `--encours` · `--reussi` (vert) · `--attente`.
- `.section` (rythme vertical), `.eyebrow`, `.card`, `.card-hover`.
- `.btn-primary` (vert), `.btn-secondary`, `.btn-light` (sur le tableau).
- `.input` / `.input-board`, `.label` / `.label-board`.
- `.trust-pill` / `.trust-pill-board`.
- `.prose-seo` — contenu éditorial : mesure `max-w-prose` (68ch), interlignage
  1.75, puces en tiret. C'est ~1000 mots par page, le confort prime.

## 4. Composition

- **Hero** : pas d'aplat dégradé plein écran. Le titre porte le message
  (`text-display-xl`, très resserré), la couleur est réservée à l'action.
  **Une seule action principale**, visible sans scroller.
- **Sections** : fond blanc par défaut, `bg-ink-50` pour alterner. Rythme
  `py-section`. Enchaînement : `.eyebrow` → H2 → intro `text-ink-600` → contenu.
- **Statuts** : tout ce qui est un état (dossier, vol) se rend en `.board-statut`,
  jamais en carte colorée improvisée.
- **CTA final** : `.board` pleine largeur, titre blanc, `.btn-primary`.

## 5. Motion

Trois durées : `duration-fast` (120 ms, couleurs), `duration-base` (220 ms,
élévation), `duration-slow` (420 ms, apparitions). Une seule courbe, `ease-flap`.
L'animation soignée est **celle du montant de l'estimateur** ; le reste est
discret. `prefers-reduced-motion` est neutralisé globalement dans `globals.css` —
ne pas réintroduire d'animation qui l'ignore.

## 6. Accessibilité & i18n

- Tout texte public passe par `next-intl` — ajouter la clé dans **les 19**
  fichiers `messages/*.json` (FR/EN/ES traduits, repli anglais ailleurs).
- Contraste **AA** minimum. Attention à l'ambre sur fond clair : `ambre-500` ne
  passe pas en texte sur blanc, utiliser `ambre-700` (ou l'ambre sur le tableau
  sombre, où il passe largement).
- Focus visible partout : l'anneau est défini globalement, ne pas le supprimer.
- Responsive jusqu'à **360 px**.
- Icônes décoratives en `aria-hidden`.

## 7. Process pour moderniser une page

1. Lire la page, repérer les sections.
2. Réutiliser les composants partagés avant d'en créer : `SplitFlapAmount`,
   `StatusBoard`, `Calculator`, `SectionHeading`, `TrustBar`, `HowTimeline`,
   `DisruptionCards`, et les briques SEO de `components/seo/SeoPage.tsx`.
3. Ajouter les clés i18n manquantes dans les 19 fichiers.
4. `npm run typecheck && npm test && npm run build` doit rester vert.

## 8. Interdits

- Pas de dégradé plein écran (c'est ce qu'on a quitté).
- Pas de site sombre : le tableau reste un objet.
- Pas de chiffre de réassurance inventé — les compteurs sont branchés sur des
  données réelles et **masqués tant que le volume est nul**.
- Pas de dépendance d'animation lourde.

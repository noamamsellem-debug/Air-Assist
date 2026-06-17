---
name: design-sync
description: Système de design « premium SaaS » d'Air Assist (inspiré des leaders type AirHelp, sans copie). À invoquer pour créer/moderniser une page ou un composant en cohérence visuelle avec le reste du site — gradients, cartes, badges de confiance, timeline, slider d'indemnité, typographie.
---

# Design Sync — charte visuelle Air Assist

Playbook pour garder TOUT le site cohérent et « premium SaaS ». S'inspire des
leaders du secteur (AirHelp, Compensair…) **sans copier** textes, logos ni
illustrations. Marque = **Air Assist**, ton rassurant et professionnel.

## 1. Tokens (définis dans `tailwind.config.ts`)
- `brand` : bleu principal (`brand-500 #1f6feb`, `brand-600`, `brand-900`).
- `accent` : magenta/corail pour le dégradé hero et les accents (`accent-500`).
- `ink` : gris-bleu foncé pour le texte (`slate-900`).
Ne jamais coder une couleur en dur : passer par les tokens.

## 2. Classes utilitaires (dans `globals.css`)
- `.hero-gradient` : dégradé diagonal bleu profond → bleu → magenta + voile radial. Texte blanc.
- `.section` : `mx-auto max-w-6xl px-4 py-16` (rythme vertical homogène).
- `.eyebrow` : petit label majuscule coloré au-dessus des titres de section.
- `.card` : carte blanche arrondie `rounded-2xl` + ombre douce + bord léger.
- `.card-hover` : `.card` + élévation au survol.
- `.trust-pill` : pastille blanche arrondie avec icône + texte (signaux de confiance).
- `.btn-primary` / `.btn-secondary` : boutons (déjà définis).

## 3. Règles de composition
- **Hero** : `.hero-gradient`, eyebrow + H1 très gras (`text-4xl`→`text-6xl`),
  sous-titre clair, encart de recherche/CTA en carte blanche posée sur le dégradé,
  rangée de `.trust-pill` dessous. Badge avis (étoiles) en haut.
- **Sections** : alterner fonds `bg-white` et `bg-slate-50`. Chaque section :
  `.eyebrow` → H2 (`text-3xl font-extrabold`) → intro `text-slate-600` → contenu.
- **Cartes** : `rounded-2xl`, icône en pastille colorée (`bg-brand-50 text-brand-600`),
  titre `font-semibold`, texte `text-sm text-slate-600`, stat/chiffre en bas en `font-semibold`.
- **Timeline « comment ça marche »** : noeuds numérotés reliés par une ligne verticale.
- **Slider d'indemnité** : carte dégradé bleu, gros montant `€`, piste avec graduations.
- **CTA final** : pleine largeur, fond fort ou image, titre blanc + bouton contrasté.

## 4. Accessibilité & i18n
- Tout texte passe par `next-intl` (19 langues) — jamais de texte en dur.
- Contraste AA minimum ; icônes décoratives en `aria-hidden`.
- Composants interactifs (slider, accordéon) = `"use client"`, focus visible.

## 5. Process pour moderniser une page
1. Lire la page + repérer les sections.
2. Réutiliser les composants partagés (`TrustBar`, `HowTimeline`, `DisruptionCards`,
   `CompensationSlider`, `SectionHeading`) avant d'en créer de nouveaux.
3. Ajouter les clés i18n manquantes dans les 19 fichiers `messages/*.json`
   (FR/EN/ES traduits, repli anglais pour le reste).
4. `npm run typecheck && npm run build` doit rester vert.

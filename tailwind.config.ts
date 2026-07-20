import type { Config } from "tailwindcss";

/**
 * Système de design « Tableau des départs » (direction A).
 *
 * Principe : le site est CLAIR ; le tableau sombre est un OBJET posé dedans
 * (hero, estimateur, suivi de dossier), jamais un fond de page. Cette règle
 * protège la lisibilité — l'audience inclut des personnes âgées.
 *
 * Sémantique des couleurs — à respecter strictement :
 *   • `ambre` = LE PROBLÈME (retard, annulation, dossier en attente).
 *     C'est le code couleur réel d'un tableau d'affichage. Jamais un CTA,
 *     jamais un état de succès : on ne baigne pas une bonne nouvelle dans
 *     une couleur d'avertissement.
 *   • `vol`   = L'ACTION ET LA BONNE NOUVELLE (boutons, indemnité versée,
 *     dossier gagné). Vert « embarquement ».
 *   • `alerte` = échec ferme (annulation confirmée, erreur de formulaire).
 *   • `board` / `ink` = matière et texte, aucun sens métier.
 *
 * `brand` / `accent` sont CONSERVÉS À L'IDENTIQUE : ils ne servent plus qu'au
 * CRM (/admin), hors périmètre de la refonte. Ne pas les utiliser sur le public.
 */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Le tableau : graphite profond, légèrement bleuté ────────────────
        board: {
          950: "#0B0D11",
          900: "#12151A",
          800: "#1B1F26",
          700: "#2A2F3A",
          600: "#3A4356",
        },
        // ── Texte et surfaces claires (neutre froid) ────────────────────────
        ink: {
          900: "#14171C",
          800: "#232830",
          700: "#3D444F",
          600: "#4E5766",
          500: "#667080",
          400: "#8A93A1",
          300: "#C2C8D1",
          200: "#DCE0E6",
          100: "#EBEEF2",
          50: "#F5F6F8",
        },
        // ── AMBRE : le problème, jamais l'action ────────────────────────────
        ambre: {
          700: "#8A5800",
          600: "#B87400",
          500: "#F0A500",
          400: "#FFBE33",
          100: "#FFF3D9",
        },
        // ── VERT EMBARQUEMENT : l'action et le succès ───────────────────────
        vol: {
          800: "#08512E",
          700: "#0A6B3D",
          600: "#0B7343",
          500: "#0E8F53",
          400: "#17B36A",
          100: "#E1F4E9",
        },
        // ── Échec ferme ─────────────────────────────────────────────────────
        alerte: {
          700: "#8E1B21",
          600: "#B4232B",
          500: "#D93A2B",
          100: "#FDEAE7",
        },
        // ── Legacy : réservé au CRM (/admin). Ne pas utiliser sur le public. ─
        brand: {
          50: "#eaf2ff",
          100: "#d4e4ff",
          200: "#aecbff",
          400: "#3d85ff",
          500: "#0060ff",
          600: "#0050d6",
          700: "#0040ab",
          900: "#062a6e",
          950: "#041a45",
        },
        accent: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },

      fontFamily: {
        // Archivo : grotesque dessiné pour l'affichage haute performance
        // (lignée signalétique). Réservé aux titres, en graisses lourdes.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Inter : lisibilité en petit corps et en texte long.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // IBM Plex Mono : registre technique du tableau (codes IATA, heures,
        // montants qui défilent, références de dossier).
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      fontSize: {
        // Échelle d'affichage : interlettrage resserré à mesure que le corps
        // grandit — un titre lourd doit se compacter, pas s'étaler.
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.25rem)", { lineHeight: "1.0", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        // Texte de lecture : interlignage généreux pour les pages SEO (1000 mots).
        "prose-lg": ["1.0625rem", { lineHeight: "1.75" }],
        "prose": ["1rem", { lineHeight: "1.75" }],
        // Registre « tableau » : majuscules espacées, petit corps.
        "board-label": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.16em", fontWeight: "700" }],
      },

      spacing: {
        // Rythme vertical des sections : une seule échelle, deux valeurs.
        section: "5rem",
        "section-lg": "7rem",
      },

      maxWidth: {
        // 65–75 caractères pour le texte long (confort de lecture).
        prose: "68ch",
      },

      borderRadius: {
        // Rayons resserrés : un tableau d'affichage n'est pas une bulle.
        xl: "0.625rem",
        "2xl": "0.875rem",
        "3xl": "1.25rem",
      },

      boxShadow: {
        card: "0 1px 2px 0 rgb(20 23 28 / 0.04), 0 8px 24px -12px rgb(20 23 28 / 0.16)",
        lift: "0 12px 32px -10px rgb(20 23 28 / 0.22)",
        // Le tableau est un objet posé : ombre portée nette et courte.
        board: "0 2px 4px -1px rgb(11 13 17 / 0.2), 0 18px 40px -16px rgb(11 13 17 / 0.45)",
      },

      transitionDuration: {
        // Trois durées, pas davantage.
        fast: "120ms",
        base: "220ms",
        slow: "420ms",
      },

      transitionTimingFunction: {
        // Une palette qui « tombe » : départ vif, arrivée amortie.
        flap: "cubic-bezier(0.2, 0.9, 0.25, 1)",
      },

      keyframes: {
        flapIn: {
          "0%": { transform: "rotateX(-90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
        revealUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      animation: {
        flapIn: "flapIn 220ms cubic-bezier(0.2, 0.9, 0.25, 1) both",
        revealUp: "revealUp 420ms cubic-bezier(0.2, 0.9, 0.25, 1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;

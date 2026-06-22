import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bleu de marque AirAssist : #0060FF.
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
        // Accent cyan/azur dérivé du bleu du logo (dégradé hero + touches premium).
        accent: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.18)",
        lift: "0 12px 32px -10px rgb(15 23 42 / 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

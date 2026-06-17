import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          400: "#4d8ef5",
          500: "#1f6feb",
          600: "#1858c7",
          700: "#1448a0",
          900: "#0d2a5e",
          950: "#081a3d",
        },
        // Accent magenta/corail pour le dégradé hero et les touches premium.
        accent: {
          400: "#f06aa0",
          500: "#e0457b",
          600: "#c62f63",
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

import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          500: "#1f6feb",
          600: "#1858c7",
          700: "#1448a0",
          900: "#0d2a5e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

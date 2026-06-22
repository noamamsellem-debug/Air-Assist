import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Icônes & manifeste PWA, valables pour tout le site (public localisé + CRM).
// Les pages localisées surchargent titre/description via leur generateMetadata,
// sans toucher à ces icônes.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0060FF",
};

// Layout racine « passe-plat » : chaque section (site public localisé, CRM)
// fournit ses propres balises <html>/<body> avec le bon attribut lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

import type { ReactNode } from "react";
import "./globals.css";

// Layout racine « passe-plat » : chaque section (site public localisé, CRM)
// fournit ses propres balises <html>/<body> avec le bon attribut lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

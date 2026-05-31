import type { ReactNode } from "react";
import "../globals.css";

export const metadata = {
  title: "CRM · Air Assist",
  robots: { index: false, follow: false },
};

// Section CRM (interne, non localisée) — fournit ses propres html/body.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-100">{children}</body>
    </html>
  );
}

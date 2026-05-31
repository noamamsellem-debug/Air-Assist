import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const role = (session.user as { role?: string }).role ?? "AGENT";

  return (
    <div>
      {/* Bandeau juridique obligatoire */}
      <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
        ⚠️ Ne pas lancer commercialement avant validation par un avocat (statut
        d'intermédiation, validité du mandat, encaissement/cantonnement des fonds, RGPD, CGV).
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/admin" className="font-bold text-brand-700">CRM Air Assist</Link>
            <Link href="/admin" className="text-slate-600 hover:text-brand-600">Tableau de bord</Link>
            <Link href="/admin/dossiers" className="text-slate-600 hover:text-brand-600">Dossiers</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">
              {session.user.email} · <span className="font-semibold">{role}</span>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

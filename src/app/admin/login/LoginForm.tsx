"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@air-assist.example");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setChargement(false);
    if (res?.error) {
      setErreur("Identifiants invalides.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-sm">
      <h1 className="text-xl font-bold">Connexion CRM</h1>
      <p className="mt-1 text-sm text-slate-500">Espace réservé aux agents Air Assist.</p>
      <div className="mt-4">
        <label className="label">E-mail</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mt-3">
        <label className="label">Mot de passe</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {erreur && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{erreur}</p>}
      <button className="btn-primary mt-4 w-full" disabled={chargement}>
        {chargement ? "…" : "Se connecter"}
      </button>
      <p className="mt-3 text-xs text-slate-400">
        Démo : admin@air-assist.example / admin1234
      </p>
    </form>
  );
}

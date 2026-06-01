import { auth } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";

export default async function MonComptePage() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-2xl font-bold">Mon compte</h1>
      <p className="mt-1 text-sm text-slate-500">
        Connecté en tant que <strong>{session?.user?.email}</strong>.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Changer mon mot de passe</h2>
      <div className="mt-3">
        <PasswordForm />
      </div>
    </div>
  );
}

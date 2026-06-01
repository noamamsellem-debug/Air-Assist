import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  actuel: z.string().min(1),
  nouveau: z.string().min(8, "8 caractères minimum").max(100),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit faire au moins 8 caractères." },
      { status: 422 },
    );
  }
  const user = await prisma.utilisateur.findUnique({
    where: { email: session.user.email },
  });
  if (!user?.motDePasseHash) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  }
  const ok = await bcrypt.compare(parsed.data.actuel, user.motDePasseHash);
  if (!ok) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
  }
  const hash = await bcrypt.hash(parsed.data.nouveau, 10);
  await prisma.utilisateur.update({ where: { id: user.id }, data: { motDePasseHash: hash } });
  return NextResponse.json({ ok: true });
}

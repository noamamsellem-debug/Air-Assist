/**
 * Upsert du référentiel compagnies (OpenFlights, ODbL) dans la table Compagnie.
 *
 * IDEMPOTENT et NON destructif : pour une compagnie existante, on NE TOUCHE PAS
 * à procedure / emailReclamation / autoActive (réglages métier des 99 compagnies
 * gérées). On complète seulement nom/pays/codeIcao s'ils sont vides, et on crée
 * les compagnies absentes.
 *
 * Lancement (avec DATABASE_URL configuré) :
 *   npx tsx prisma/seed-compagnies-reference.ts
 */
import { PrismaClient } from "@prisma/client";
import { COMPAGNIES_REFERENCE } from "../src/data/compagnies-reference";

const prisma = new PrismaClient();

async function main() {
  let crees = 0;
  let completes = 0;
  for (const c of COMPAGNIES_REFERENCE) {
    const existante = await prisma.compagnie.findUnique({ where: { codeIata: c.code } });
    if (!existante) {
      await prisma.compagnie.create({
        data: { nom: c.nom, codeIata: c.code, codeIcao: c.codeIcao, pays: c.pays, autoActive: false },
      });
      crees++;
      continue;
    }
    // Ne complète que les champs vides ; ne touche jamais aux réglages métier.
    const patch: { codeIcao?: string; pays?: string } = {};
    if (!existante.codeIcao && c.codeIcao) patch.codeIcao = c.codeIcao;
    if (!existante.pays && c.pays) patch.pays = c.pays;
    if (Object.keys(patch).length > 0) {
      await prisma.compagnie.update({ where: { codeIata: c.code }, data: patch });
      completes++;
    }
  }
  console.log(`Compagnies — créées : ${crees}, complétées : ${completes}, total source : ${COMPAGNIES_REFERENCE.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

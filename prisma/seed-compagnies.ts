/**
 * Peuplement du catalogue des compagnies aériennes depuis le CSV
 * `prisma/data/compagnies_europe.csv`.
 *
 * Idempotent : upsert sur `codeIata`. Relancer ne crée pas de doublon et met à
 * jour nom/icao/pays/region/type SANS toucher aux champs renseignés via l'admin
 * (emailReclamation, urlFormulaire, procedure, autoActive).
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, RegionCompagnie, TypeCompagnie } from "@prisma/client";

export interface CompagnieCsvRow {
  iata: string;
  icao: string;
  name: string;
  country: string;
  region: RegionCompagnie;
  type: TypeCompagnie;
}

const REGIONS = ["EU", "UK", "CH", "EUR_OTHER", "INTL"] as const;
const TYPES = ["legacy", "lowcost", "regional", "leisure"] as const;

/** Parse le CSV (entête : iata,icao,name,country,region,type) en lignes validées. */
export function parseCompagniesCsv(csv: string): CompagnieCsvRow[] {
  const lignes = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lignes.length < 2) throw new Error("CSV compagnies vide ou sans données.");
  const corps = lignes.slice(1); // on ignore l'entête
  const rows: CompagnieCsvRow[] = [];
  const vus = new Set<string>();

  for (const ligne of corps) {
    const champs = ligne.split(",").map((c) => c.trim());
    if (champs.length !== 6) {
      throw new Error(`Ligne CSV invalide (6 colonnes attendues) : "${ligne}"`);
    }
    const [iata = "", icao = "", name = "", country = "", region = "", type = ""] = champs;
    if (!iata) throw new Error(`Code IATA manquant : "${ligne}"`);
    if (!name) throw new Error(`Nom manquant pour ${iata}.`);
    if (vus.has(iata)) throw new Error(`Code IATA en double dans le CSV : ${iata}`);
    if (!REGIONS.includes(region as (typeof REGIONS)[number])) {
      throw new Error(`Région inconnue "${region}" pour ${iata}.`);
    }
    if (!TYPES.includes(type as (typeof TYPES)[number])) {
      throw new Error(`Type inconnu "${type}" pour ${iata}.`);
    }
    vus.add(iata);
    rows.push({
      iata,
      icao,
      name,
      country,
      region: region as RegionCompagnie,
      type: type as TypeCompagnie,
    });
  }
  return rows;
}

/** Interface minimale (testable) du client Prisma nécessaire au seed. */
export interface ClientUpsertCompagnie {
  compagnie: {
    upsert(args: {
      where: { codeIata: string };
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }): Promise<unknown>;
  };
}

/** Upsert idempotent des compagnies du CSV. Retourne le nombre de compagnies traitées. */
export async function seedCompagnies(db: ClientUpsertCompagnie, csv?: string): Promise<number> {
  const contenu =
    csv ?? fs.readFileSync(path.join(__dirname, "data", "compagnies_europe.csv"), "utf8");
  const rows = parseCompagniesCsv(contenu);
  for (const r of rows) {
    await db.compagnie.upsert({
      where: { codeIata: r.iata },
      // On ne touche PAS aux champs gérés par l'admin (email/url/procedure/autoActive).
      update: {
        nom: r.name,
        codeIcao: r.icao || null,
        pays: r.country,
        region: r.region,
        type: r.type,
      },
      create: {
        codeIata: r.iata,
        codeIcao: r.icao || null,
        nom: r.name,
        pays: r.country,
        region: r.region,
        type: r.type,
        procedure: null,
        emailReclamation: null,
        urlFormulaire: null,
        autoActive: false,
      },
    });
  }
  return rows.length;
}

// Exécution autonome : `npm run db:seed-compagnies`
if (require.main === module) {
  const prisma = new PrismaClient();
  seedCompagnies(prisma as unknown as ClientUpsertCompagnie)
    .then((n) => console.log(`✈️ Catalogue compagnies : ${n} compagnies (upsert).`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

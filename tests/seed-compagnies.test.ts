import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  parseCompagniesCsv,
  seedCompagnies,
  type ClientUpsertCompagnie,
} from "../prisma/seed-compagnies";

const CSV = fs.readFileSync(
  path.join(__dirname, "..", "prisma", "data", "compagnies_europe.csv"),
  "utf8",
);

/** Mock du client Prisma : stocke les compagnies en mémoire (clé = codeIata). */
function mockClient() {
  const store = new Map<string, Record<string, unknown>>();
  const db: ClientUpsertCompagnie = {
    compagnie: {
      async upsert({ where, update, create }) {
        const existant = store.get(where.codeIata);
        store.set(where.codeIata, existant ? { ...existant, ...update } : { ...create });
        return store.get(where.codeIata);
      },
    },
  };
  return { db, store };
}

describe("parseCompagniesCsv", () => {
  it("lit 99 compagnies depuis le CSV fourni", () => {
    expect(parseCompagniesCsv(CSV)).toHaveLength(99);
  });

  it("contient Volotea (V7) et easyJet (U2) avec le bon nom", () => {
    const rows = parseCompagniesCsv(CSV);
    expect(rows.find((r) => r.iata === "V7")?.name).toBe("Volotea");
    expect(rows.find((r) => r.iata === "U2")?.name).toBe("easyJet");
  });

  it("gère un ICAO vide (ex. T3 Eastern Airways)", () => {
    const t3 = parseCompagniesCsv(CSV).find((r) => r.iata === "T3");
    expect(t3?.name).toBe("Eastern Airways");
    expect(t3?.icao).toBe("");
  });

  it("rejette une ligne mal formée, une région inconnue et un IATA en double", () => {
    expect(() => parseCompagniesCsv("iata,icao,name,country,region,type\nAF,AFR,Air France")).toThrow();
    expect(() =>
      parseCompagniesCsv("iata,icao,name,country,region,type\nAF,AFR,Air France,France,MARS,legacy"),
    ).toThrow(/Région/);
    expect(() =>
      parseCompagniesCsv(
        "iata,icao,name,country,region,type\nAF,AFR,Air France,France,EU,legacy\nAF,AFR,Air France,France,EU,legacy",
      ),
    ).toThrow(/double/);
  });
});

describe("seedCompagnies (idempotent)", () => {
  it("insère 99 compagnies", async () => {
    const { db, store } = mockClient();
    const n = await seedCompagnies(db, CSV);
    expect(n).toBe(99);
    expect(store.size).toBe(99);
  });

  it("relancer le seed ne crée pas de doublon", async () => {
    const { db, store } = mockClient();
    await seedCompagnies(db, CSV);
    await seedCompagnies(db, CSV);
    await seedCompagnies(db, CSV);
    expect(store.size).toBe(99);
  });

  it("Volotea (V7) et easyJet (U2) sont bien présents avec le bon nom", async () => {
    const { db, store } = mockClient();
    await seedCompagnies(db, CSV);
    expect(store.get("V7")?.nom).toBe("Volotea");
    expect(store.get("U2")?.nom).toBe("easyJet");
  });

  it("laisse procedure/email/autoActive non renseignés à la création", async () => {
    const { db, store } = mockClient();
    await seedCompagnies(db, CSV);
    const v7 = store.get("V7")!;
    expect(v7.procedure).toBeNull();
    expect(v7.emailReclamation).toBeNull();
    expect(v7.autoActive).toBe(false);
  });
});

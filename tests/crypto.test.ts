import { describe, it, expect } from "vitest";
import { chiffrerDocument, dechiffrerDocument, chiffrementConfigure } from "@/lib/crypto";

describe("chiffrement des documents (AES-256-GCM)", () => {
  it("chiffre puis déchiffre à l'identique", () => {
    const clair = Buffer.from("Carte d'embarquement — PNR ABC123", "utf8");
    const chiffre = chiffrerDocument(clair);
    expect(chiffre.contenuChiffre.equals(clair)).toBe(false); // bien chiffré
    const dechiffre = dechiffrerDocument(chiffre);
    expect(dechiffre.equals(clair)).toBe(true);
  });

  it("produit un IV différent à chaque appel", () => {
    const clair = Buffer.from("x");
    const a = chiffrerDocument(clair);
    const b = chiffrerDocument(clair);
    expect(a.iv.equals(b.iv)).toBe(false);
  });

  it("échoue au déchiffrement si l'authTag est altéré", () => {
    const chiffre = chiffrerDocument(Buffer.from("données sensibles"));
    chiffre.authTag[0] = (chiffre.authTag[0] ?? 0) ^ 0xff;
    expect(() => dechiffrerDocument(chiffre)).toThrow();
  });

  it("utilise une vraie clé de 32 octets si fournie", () => {
    const key = Buffer.alloc(32, 7).toString("base64");
    const env = { DOCUMENT_ENCRYPTION_KEY: key };
    expect(chiffrementConfigure(env)).toBe(true);
    const chiffre = chiffrerDocument(Buffer.from("secret"), env);
    expect(dechiffrerDocument(chiffre, env).toString()).toBe("secret");
  });

  it("rejette une clé de longueur invalide", () => {
    const env = { DOCUMENT_ENCRYPTION_KEY: Buffer.alloc(10).toString("base64") };
    expect(() => chiffrerDocument(Buffer.from("x"), env)).toThrow(/32 octets/);
  });

  it("repli dev : pas de clé configurée", () => {
    expect(chiffrementConfigure({})).toBe(false);
  });
});

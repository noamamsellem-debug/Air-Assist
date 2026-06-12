import { describe, it, expect } from "vitest";
import {
  normaliserPhoton,
  normaliserBan,
  PhotonAddressProvider,
  BanAddressProvider,
  getAddressProvider,
} from "@/lib/address";

/** Petite fabrique de Response mockée. */
function reponse(json: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => json } as unknown as Response;
}

const PHOTON_JSON = {
  features: [
    {
      properties: {
        housenumber: "8",
        street: "Boulevard du Port",
        postcode: "80000",
        city: "Amiens",
        country: "France",
        countrycode: "FR",
      },
    },
    {
      // Hors zone (US) → doit être filtré.
      properties: { name: "Main Street", city: "Springfield", country: "United States", countrycode: "US" },
    },
  ],
};

describe("normaliserPhoton", () => {
  it("mappe les champs et restreint aux pays UE/EEE+UK+CH", () => {
    const r = normaliserPhoton(PHOTON_JSON);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({
      ligne1: "8 Boulevard du Port",
      codePostal: "80000",
      ville: "Amiens",
      pays: "France",
      codePays: "FR",
    });
  });

  it("renvoie [] sur une entrée vide ou invalide", () => {
    expect(normaliserPhoton(null)).toEqual([]);
    expect(normaliserPhoton({})).toEqual([]);
  });
});

describe("normaliserBan", () => {
  it("mappe les champs BAN (France)", () => {
    const r = normaliserBan({
      features: [{ properties: { name: "8 Boulevard du Port", postcode: "80000", city: "Amiens", label: "8 Boulevard du Port 80000 Amiens" } }],
    });
    expect(r[0]).toMatchObject({ ligne1: "8 Boulevard du Port", codePostal: "80000", ville: "Amiens", pays: "France", codePays: "FR" });
  });
});

describe("PhotonAddressProvider", () => {
  it("renvoie des suggestions sur une requête valide", async () => {
    const provider = new PhotonAddressProvider(async () => reponse(PHOTON_JSON));
    const r = await provider.search("8 boulevard du port", "fr");
    expect(r).toHaveLength(1);
    expect(r[0]!.ville).toBe("Amiens");
  });

  it("ne requête pas pour une saisie trop courte (< 3 caractères)", async () => {
    let appele = false;
    const provider = new PhotonAddressProvider(async () => {
      appele = true;
      return reponse(PHOTON_JSON);
    });
    expect(await provider.search("ab", "fr")).toEqual([]);
    expect(appele).toBe(false);
  });

  it("propage l'erreur réseau (le proxy bascule alors en repli manuel)", async () => {
    const provider = new PhotonAddressProvider(async () => {
      throw new Error("network down");
    });
    await expect(provider.search("amiens", "fr")).rejects.toThrow(/network/);
  });

  it("lève sur une réponse HTTP non-OK", async () => {
    const provider = new PhotonAddressProvider(async () => reponse({}, false, 503));
    await expect(provider.search("amiens", "fr")).rejects.toThrow(/503/);
  });
});

describe("getAddressProvider", () => {
  it("Photon par défaut, BAN sur demande", () => {
    expect(getAddressProvider({}).nom).toBe("photon");
    expect(getAddressProvider({ ADDRESS_PROVIDER: "ban" })).toBeInstanceOf(BanAddressProvider);
    expect(getAddressProvider({ ADDRESS_PROVIDER: "inconnu" }).nom).toBe("photon");
  });
});

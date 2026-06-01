import { test, expect } from "@playwright/test";

test.describe("Parcours public", () => {
  test("le calculateur estime une indemnité et mène au tunnel", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Remplir le calculateur (CDG -> JFK, retard 200 min).
    await page.getByLabel("Numéro de vol").fill("AF1234");
    await page.getByLabel("Date du vol").fill("2026-03-12");
    await page.getByLabel("Aéroport de départ").selectOption("CDG");
    await page.getByLabel("Aéroport d'arrivée").selectOption("JFK");
    await page.getByLabel("Que s'est-il passé ?").selectOption("RETARD");
    await page.getByLabel("Retard à l'arrivée (minutes)").fill("200");
    await page.getByRole("button", { name: "Estimer mon indemnité" }).click();

    // Résultat éligible visible.
    await expect(page.getByText("Bonne nouvelle")).toBeVisible();

    // CTA vers le tunnel.
    await page.getByRole("button", { name: /Lancer ma réclamation/ }).click();
    await expect(page).toHaveURL(/\/fr\/reclamation/);
    await expect(page.getByRole("heading", { name: "Votre réclamation" })).toBeVisible();
  });

  test("le CRM est protégé (redirection vers login)", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Connexion CRM" })).toBeVisible();
  });

  test("la langue bascule en anglais", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Flight delayed, cancelled or overbooked?")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Parcours public", () => {
  test("l'estimateur affiche un montant en direct et mène au tunnel", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Trajet CDG → JFK via l'autocomplétion (plus de <select>).
    await page.getByLabel("Aéroport de départ").fill("Paris");
    await page.getByRole("button", { name: /CDG/ }).first().click();
    await page.getByLabel("Aéroport d'arrivée").fill("New York");
    await page.getByRole("button", { name: /JFK/ }).first().click();

    // Le trajet seul suffit à afficher un montant potentiel : c'est le cœur
    // du nouvel estimateur, le montant ne dépend d'aucune soumission.
    await expect(page.getByText("Vous pourriez récupérer jusqu'à")).toBeVisible();

    // Le CTA reste inactif tant que le palier de retard n'est pas choisi.
    const cta = page.getByRole("button", { name: /Lancer ma réclamation/ });
    await expect(cta).toBeDisabled();

    // Retard > 4 h → éligible, montant plein (600 € sur CDG-JFK).
    await page.getByRole("button", { name: "Plus de 4 h" }).click();
    await expect(page.getByText("Vous pourriez récupérer", { exact: true })).toBeVisible();
    await expect(page.getByText("Indemnisable")).toBeVisible();

    await expect(cta).toBeEnabled();
    await cta.click();
    await expect(page).toHaveURL(/\/fr\/reclamation/);
    await expect(page.getByRole("heading", { name: "Votre réclamation" })).toBeVisible();
  });

  test("un retard de moins de 3 h n'ouvre pas droit à indemnité", async ({ page }) => {
    await page.goto("/fr");
    await page.getByLabel("Aéroport de départ").fill("Paris");
    await page.getByRole("button", { name: /CDG/ }).first().click();
    await page.getByLabel("Aéroport d'arrivée").fill("Barcelone");
    await page.getByRole("button", { name: /BCN/ }).first().click();
    await page.getByRole("button", { name: "Moins de 3 heures" }).click();

    await expect(page.getByText("Non indemnisable")).toBeVisible();
    await expect(page.getByRole("button", { name: /Lancer ma réclamation/ })).toBeDisabled();
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

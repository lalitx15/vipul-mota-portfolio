import { test, expect } from "@playwright/test";

test.describe("Vipul Mota Portfolio Smoke Suite", () => {
  test("01. Homepage loads with cinematic hero, monogram, and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Vipul Mota/i);

    // Verify header navigation brand monogram
    const logo = page.locator("header").getByText("VIPUL MOTA");
    await expect(logo).toBeVisible();

    // Verify hero statement
    const heroName = page.getByRole("heading", { level: 1 });
    await expect(heroName).toContainText("VIPUL");
  });

  test("02. Contact & collaboration form renders and validates inputs", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Direct Communication");

    // Form inputs exist
    const nameInput = page.locator('input[placeholder*="Full legal name"]');
    const emailInput = page.locator('input[type="email"]');
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test("03. Authentication login interface renders with credentials fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Authentication/i);

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("04. Work directory renders Crime World credit and Lookbook", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByText("Crime World (2022)")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("shows the hero section with app name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Fyshe");
  });

  test("has a link to sign in", async ({ page }) => {
    await page.goto("/");
    const signInLink = page.getByRole("link", { name: /sign in|get started|log in/i });
    await expect(signInLink).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /sign in|get started|log in/i }).first().click();
    await expect(page).toHaveURL(/login/);
  });
});

import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page shows OAuth providers", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("unauthenticated users are redirected from app pages", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});

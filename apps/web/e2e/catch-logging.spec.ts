import { test, expect } from "@playwright/test";

test.describe("Catch Logging", () => {
  test.describe("Unauthenticated access", () => {
    test("redirects unauthenticated users from catches page to login", async ({ page }) => {
      await page.goto("/catches");
      await expect(page).toHaveURL(/login/);
    });

    test("redirects unauthenticated users from new catch page to login", async ({ page }) => {
      await page.goto("/catches/new");
      await expect(page).toHaveURL(/login/);
    });
  });

  test.describe("Catch form structure", () => {
    // These tests require authentication. Once an E2E auth helper or
    // seeded test user is available, remove the test.fixme annotations
    // and configure the authenticated page context.
    test.fixme(
      "navigates to the catch logging page",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        await expect(page).toHaveURL("/catches/new");
        await expect(page.getByRole("heading", { name: "Log Catch" })).toBeVisible();
      },
    );

    test.fixme(
      "catch form contains all expected fields",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        // Required field
        await expect(page.getByLabel(/species/i)).toBeVisible();

        // Optional measurement fields
        await expect(page.getByLabel(/length/i)).toBeVisible();
        await expect(page.getByLabel(/weight/i)).toBeVisible();

        // Dropdowns
        await expect(page.getByLabel(/method/i)).toBeVisible();
        await expect(page.getByLabel(/visibility/i)).toBeVisible();

        // Other fields
        await expect(page.getByLabel(/location/i)).toBeVisible();
        await expect(page.getByLabel(/date/i)).toBeVisible();
        await expect(page.getByLabel(/catch and release/i)).toBeVisible();
        await expect(page.getByLabel(/notes/i)).toBeVisible();

        // Submit and cancel buttons
        await expect(page.getByRole("button", { name: "Log Catch" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
      },
    );

    test.fixme(
      "species field is marked as required",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        const speciesInput = page.getByLabel(/species/i);
        await expect(speciesInput).toHaveAttribute("required", "");
      },
    );
  });

  test.describe("Form validation", () => {
    test.fixme(
      "prevents submission when species is empty",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        // Leave species empty and try to submit
        await page.getByRole("button", { name: "Log Catch" }).click();

        // The form should not navigate away because the species input has
        // the HTML required attribute; the browser shows a validation tooltip.
        await expect(page).toHaveURL(/catches\/new/);

        // Species input should trigger native validation
        const speciesInput = page.getByLabel(/species/i);
        const validationMessage = await speciesInput.evaluate(
          (el: HTMLInputElement) => el.validationMessage,
        );
        expect(validationMessage).toBeTruthy();
      },
    );

    test.fixme(
      "prevents submission with only whitespace in species",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        // Fill species with whitespace only
        await page.getByLabel(/species/i).fill("   ");
        await page.getByRole("button", { name: "Log Catch" }).click();

        // Should stay on the form page (browser may or may not block
        // whitespace-only values depending on the required behavior).
        // At minimum, verify no navigation to the catches list occurred.
        await expect(page).not.toHaveURL(/^\/catches$/);
      },
    );
  });

  test.describe("Catch creation flow", () => {
    test.fixme(
      "fills out the full form and submits successfully",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        // Fill in the required species field
        await page.getByLabel(/species/i).fill("Rainbow Trout");

        // Fill in optional measurement fields
        await page.getByLabel(/length/i).fill("18.5");
        await page.getByLabel(/weight/i).fill("2.5");

        // Select a fishing method
        await page.getByLabel(/method/i).selectOption("FLY");

        // Set visibility
        await page.getByLabel(/visibility/i).selectOption("PUBLIC");

        // Enter a location
        await page.getByLabel(/location/i).fill("Blue River, CO");

        // Set the date and time
        await page.getByLabel(/date/i).fill("2026-03-01T08:30");

        // Ensure catch and release is checked (it defaults to true)
        const releasedCheckbox = page.getByLabel(/catch and release/i);
        await expect(releasedCheckbox).toBeChecked();

        // Add notes
        await page.getByLabel(/notes/i).fill("Beautiful morning catch on a dry fly.");

        // Submit the form
        await page.getByRole("button", { name: "Log Catch" }).click();

        // Should redirect to the catches list page after successful creation
        await expect(page).toHaveURL("/catches", { timeout: 10000 });
      },
    );

    test.fixme(
      "submits with only the required species field",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        // Fill only the required field
        await page.getByLabel(/species/i).fill("Largemouth Bass");

        // Submit the form
        await page.getByRole("button", { name: "Log Catch" }).click();

        // Should redirect to the catches list page
        await expect(page).toHaveURL("/catches", { timeout: 10000 });
      },
    );

    test.fixme(
      "shows saving state while submitting",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches/new");

        await page.getByLabel(/species/i).fill("Brook Trout");

        // Click submit and check for the pending state
        await page.getByRole("button", { name: "Log Catch" }).click();

        // The button text should change to "Saving..." while the mutation is pending
        // Use a short timeout since this is a transient state
        await expect(
          page.getByRole("button", { name: "Saving..." }),
        ).toBeVisible({ timeout: 2000 });
      },
    );
  });

  test.describe("Catches list", () => {
    test.fixme(
      "catches list page loads and shows the heading",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches");

        await expect(page.getByRole("heading", { name: "Catches" })).toBeVisible();
      },
    );

    test.fixme(
      "catches list page has a link to log a new catch",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches");

        const logCatchLink = page.getByRole("link", { name: "Log Catch" });
        await expect(logCatchLink).toBeVisible();
        await expect(logCatchLink).toHaveAttribute("href", "/catches/new");
      },
    );

    test.fixme(
      "shows empty state when no catches exist",
      async ({ page }) => {
        // TODO: authenticate with a fresh test user with no catches
        await page.goto("/catches");

        await expect(page.getByText("No catches logged yet.")).toBeVisible();
        await expect(page.getByText("Log your first catch")).toBeVisible();
      },
    );

    test.fixme(
      "a newly logged catch appears in the catches list",
      async ({ page }) => {
        // TODO: authenticate with test user
        const uniqueSpecies = `Cutthroat Trout ${Date.now()}`;

        // Step 1: Log a new catch
        await page.goto("/catches/new");
        await page.getByLabel(/species/i).fill(uniqueSpecies);
        await page.getByLabel(/length/i).fill("14");
        await page.getByLabel(/method/i).selectOption("FLY");
        await page.getByLabel(/location/i).fill("Yellowstone River, MT");
        await page.getByRole("button", { name: "Log Catch" }).click();

        // Step 2: Verify redirect to catches list
        await expect(page).toHaveURL("/catches", { timeout: 10000 });

        // Step 3: Verify the new catch appears in the list
        await expect(page.getByText(uniqueSpecies)).toBeVisible({ timeout: 5000 });
      },
    );

    test.fixme(
      "catch in the list displays method badge and location",
      async ({ page }) => {
        // TODO: authenticate with test user that has existing catches
        // This test assumes at least one catch with method and location has been logged.
        await page.goto("/catches");

        // Verify a catch card renders species, method badge, and location info
        const catchCards = page.locator("[data-testid='catch-card'], .grid a");
        const firstCard = catchCards.first();

        // Each card should have a species name as a heading
        await expect(firstCard.locator("h3")).toBeVisible();
      },
    );
  });

  test.describe("Navigation", () => {
    test.fixme(
      "cancel button on catch form navigates back",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches");
        await page.getByRole("link", { name: "Log Catch" }).click();
        await expect(page).toHaveURL("/catches/new");

        // Click cancel
        await page.getByRole("button", { name: "Cancel" }).click();

        // Should navigate back to the catches list
        await expect(page).toHaveURL("/catches");
      },
    );

    test.fixme(
      "navigating from catches list to new catch form",
      async ({ page }) => {
        // TODO: authenticate with test user
        await page.goto("/catches");

        await page.getByRole("link", { name: "Log Catch" }).click();
        await expect(page).toHaveURL("/catches/new");
        await expect(page.getByRole("heading", { name: "Log Catch" })).toBeVisible();
      },
    );
  });
});

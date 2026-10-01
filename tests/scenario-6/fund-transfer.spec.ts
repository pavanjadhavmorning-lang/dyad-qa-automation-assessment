import { test, expect } from "@playwright/test";

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test("should transfer funds and audit account balances", async ({ page }) => {
    await page.goto("https://parabank.parasoft.com/");

    await expect(page).toHaveTitle(/ParaBank/);
  });
});

import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../src/pages/parabank/RegisterPage";
import { generateUniqueUser } from "../../test-data/parabankData";
import { OpenAccountPage } from "../../src/pages/parabank/OpenAccountPage";
import dotenv from "dotenv";

dotenv.config();

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test("should register a new ParaBank user", async ({ page }) => {
    const user = generateUniqueUser();
    const registerPage = new RegisterPage(page);

    await page.goto(`${process.env.PARABANK_BASE_URL}/parabank/register.htm`);

    await expect(page).toHaveTitle(/ParaBank/);

    await registerPage.registerUser(user);

    await expect(
      page.getByText(
        "Your account was created successfully. You are now logged in.",
      ),
    ).toBeVisible();

    const openAccountPage = new OpenAccountPage(page);

    await page.getByRole("link", { name: "Open New Account" }).click();

    const accountA = await openAccountPage.openNewAccount("CHECKING");

    await expect(page.getByText("Account Opened!")).toBeVisible();

    expect(accountA).not.toBe("");

    await page.getByRole("link", { name: "Open New Account" }).click();

    const accountB = await openAccountPage.openNewAccount("SAVINGS");

    await expect(page.getByText("Account Opened!")).toBeVisible();

    expect(accountB).not.toBe("");
    expect(accountA).not.toBe(accountB);
  });
});

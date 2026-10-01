import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../src/pages/parabank/RegisterPage";
import { OpenAccountPage } from "../../src/pages/parabank/OpenAccountPage";
import { AccountOverviewPage } from "../../src/pages/parabank/AccountOverviewPage";
import { generateUniqueUser } from "../../test-data/parabankData";
import dotenv from "dotenv";

dotenv.config();

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test("should register user, create two accounts and capture balances", async ({
    page,
  }) => {
    const user = generateUniqueUser();

    const registerPage = new RegisterPage(page);
    const openAccountPage = new OpenAccountPage(page);
    const accountOverviewPage = new AccountOverviewPage(page);

    await page.goto(`${process.env.PARABANK_BASE_URL}/parabank/register.htm`);

    await expect(page).toHaveTitle(/ParaBank/);

    await registerPage.registerUser(user);

    await expect(
      page.getByText(
        "Your account was created successfully. You are now logged in.",
      ),
    ).toBeVisible();

    await page.getByRole("link", { name: "Open New Account" }).click();

    const accountA = await openAccountPage.openNewAccount("CHECKING");

    await expect(page.getByText("Account Opened!")).toBeVisible();
    expect(accountA).not.toBe("");

    await page.getByRole("link", { name: "Open New Account" }).click();

    const accountB = await openAccountPage.openNewAccount("SAVINGS");

    await expect(page.getByText("Account Opened!")).toBeVisible();
    expect(accountB).not.toBe("");

    expect(accountA).not.toBe(accountB);

    await page.getByRole("link", { name: "Accounts Overview" }).click();

    const balanceA = await accountOverviewPage.getBalance(accountA);
    const balanceB = await accountOverviewPage.getBalance(accountB);

    expect(balanceA).toBeGreaterThanOrEqual(0);
    expect(balanceB).toBeGreaterThanOrEqual(0);

    expect(Number.isFinite(balanceA)).toBe(true);
    expect(Number.isFinite(balanceB)).toBe(true);

    //await page.pause();
  });
});

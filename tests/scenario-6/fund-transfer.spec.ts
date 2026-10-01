import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../src/pages/parabank/RegisterPage";
import { OpenAccountPage } from "../../src/pages/parabank/OpenAccountPage";
import { AccountOverviewPage } from "../../src/pages/parabank/AccountOverviewPage";
import { TransferFundsPage } from "../../src/pages/parabank/TransferFundsPage";
import { generateUniqueUser } from "../../test-data/parabankData";
import dotenv from "dotenv";

dotenv.config();

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test("should register user, create two accounts, transfer funds and audit balances", async ({
    page,
  }) => {
    const user = generateUniqueUser();
    const transferAmount = 50;

    const registerPage = new RegisterPage(page);
    const openAccountPage = new OpenAccountPage(page);
    const accountOverviewPage = new AccountOverviewPage(page);
    const transferFundsPage = new TransferFundsPage(page);

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

    const balanceABefore = await accountOverviewPage.getBalance(accountA);
    const balanceBBefore = await accountOverviewPage.getBalance(accountB);

    expect(balanceABefore).toBeGreaterThanOrEqual(0);
    expect(balanceBBefore).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(balanceABefore)).toBe(true);
    expect(Number.isFinite(balanceBBefore)).toBe(true);

    expect(balanceABefore).toBeGreaterThanOrEqual(transferAmount);

    await page.getByRole("link", { name: "Transfer Funds" }).click();

    await transferFundsPage.transferFunds(transferAmount, accountA, accountB);

    await expect(page.getByText(/Transfer Complete/i)).toBeVisible();

    await page.getByRole("link", { name: "Accounts Overview" }).click();

    const balanceAAfter = await accountOverviewPage.getBalance(accountA);
    const balanceBAfter = await accountOverviewPage.getBalance(accountB);

    expect(balanceAAfter).toBe(balanceABefore - transferAmount);
    expect(balanceBAfter).toBe(balanceBBefore + transferAmount);
  });
});

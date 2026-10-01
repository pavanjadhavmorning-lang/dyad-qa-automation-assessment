import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../src/pages/parabank/RegisterPage";
import { OpenAccountPage } from "../../src/pages/parabank/OpenAccountPage";
import { AccountOverviewPage } from "../../src/pages/parabank/AccountOverviewPage";
import { TransferFundsPage } from "../../src/pages/parabank/TransferFundsPage";
import { TransactionPage } from "../../src/pages/parabank/TransactionPage";
import { generateUniqueUser } from "../../test-data/parabankData";
import dotenv from "dotenv";

dotenv.config();

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test("should register user, create two accounts, transfer funds and audit balances", async ({
    page,
  }) => {
    const user = generateUniqueUser();
    const transferAmount = 50;

    const today = new Date();

    const expectedTransactionDate = [
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
      today.getFullYear(),
    ].join("-");

    const registerPage = new RegisterPage(page);
    const openAccountPage = new OpenAccountPage(page);
    const accountOverviewPage = new AccountOverviewPage(page);
    const transferFundsPage = new TransferFundsPage(page);
    const transactionPage = new TransactionPage(page);

    await page.goto(`${process.env.PARABANK_BASE_URL}/parabank/register.htm`);

    await expect(page).toHaveTitle(/ParaBank/);

    await registerPage.registerUser(user);

    await expect(
      page.getByText(
        "Your account was created successfully. You are now logged in.",
      ),
    ).toBeVisible();

    await openAccountPage.open();

    const accountA = await openAccountPage.openNewAccount("CHECKING");

    await expect(page.getByText("Account Opened!")).toBeVisible();
    expect(accountA).not.toBe("");

    await openAccountPage.open();

    const accountB = await openAccountPage.openNewAccount("SAVINGS");

    await expect(page.getByText("Account Opened!")).toBeVisible();
    expect(accountB).not.toBe("");

    expect(accountA).not.toBe(accountB);

    await accountOverviewPage.open();

    const balanceABefore = await accountOverviewPage.getBalance(accountA);
    const balanceBBefore = await accountOverviewPage.getBalance(accountB);

    expect(balanceABefore).toBeGreaterThanOrEqual(0);
    expect(balanceBBefore).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(balanceABefore)).toBe(true);
    expect(Number.isFinite(balanceBBefore)).toBe(true);
    expect(balanceABefore).toBeGreaterThanOrEqual(transferAmount);

    await transferFundsPage.open();

    await transferFundsPage.transferFunds(transferAmount, accountA, accountB);

    await transferFundsPage.verifyTransferComplete();

    await accountOverviewPage.open();

    const balanceAAfter = await accountOverviewPage.getBalance(accountA);
    const balanceBAfter = await accountOverviewPage.getBalance(accountB);

    expect(balanceAAfter).toBe(balanceABefore - transferAmount);
    expect(balanceBAfter).toBe(balanceBBefore + transferAmount);

    await transactionPage.open();

    await transactionPage.verifyPageLoaded();

    await transactionPage.selectAccount(accountA);

    await transactionPage.searchByAmount(transferAmount);

    const accountATransaction = await transactionPage.getTransactionRow();

    expect(accountATransaction.description).toBe("Funds Transfer Sent");
    expect(accountATransaction.debit).toBe("$50.00");
    expect(accountATransaction.credit).toBe("");
    expect(accountATransaction.date).toBe(expectedTransactionDate);

    const accountATransferCount =
      await transactionPage.getMatchingTransferCount(
        "Funds Transfer Sent",
        "$50.00",
        expectedTransactionDate,
      );

    expect(accountATransferCount).toBe(1);

    await transactionPage.open();

    await transactionPage.verifyPageLoaded();

    await transactionPage.selectAccount(accountB);

    await transactionPage.searchByAmount(transferAmount);

    const accountBTransaction = await transactionPage.getTransactionRow();

    expect(accountBTransaction.description).toBe("Funds Transfer Received");
    expect(accountBTransaction.debit).toBe("");
    expect(accountBTransaction.credit).toBe("$50.00");
    expect(accountBTransaction.date).toBe(expectedTransactionDate);

    const accountBTransferCount =
      await transactionPage.getMatchingTransferCount(
        "Funds Transfer Received",
        "$50.00",
        expectedTransactionDate,
      );

    expect(accountBTransferCount).toBe(1);

    //await page.pause();
  });
});

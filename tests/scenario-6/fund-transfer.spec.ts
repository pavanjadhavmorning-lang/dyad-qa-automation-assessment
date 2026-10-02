import { test, expect } from "../../src/fixtures/testFixtures";
import { generateUniqueUser } from "../../test-data/parabankData";
import { getCurrentDate } from "../../test-data/dateUtils";
import { logTestEnd, logTestStart } from "../../src/hooks/testHooks";

test.describe("Scenario 6 - Multi-Account Fund Transfer Audit", () => {
  test.beforeEach(async ({}, testInfo) => {
    logTestStart(testInfo);
  });

  test.afterEach(async ({}, testInfo) => {
    logTestEnd(testInfo);
  });

  test("should register user, create two accounts, transfer funds and audit balances", async ({
    page,
    registerPage,
    openAccountPage,
    accountOverviewPage,
    transferFundsPage,
    transactionPage,
  }) => {
    const user = generateUniqueUser();
    const transferAmount = 50;
    const expectedTransactionDate = getCurrentDate("MM-DD-YYYY");

    await page.goto("/parabank/register.htm");

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

    expect(accountATransaction.date).toBe(expectedTransactionDate);
    expect(accountATransaction.description).toBe("Funds Transfer Sent");
    expect(accountATransaction.debit).toBe("$50.00");
    expect(accountATransaction.credit).toBe("");

    const accountATransferCount =
      await transactionPage.getMatchingTransferCount(
        "Funds Transfer Sent",
        "$50.00",
        expectedTransactionDate,
      );

    expect(accountATransferCount).toBe(1);

    await transactionPage.openMatchingTransaction(
      "Funds Transfer Sent",
      "$50.00",
      expectedTransactionDate,
    );

    const accountATransactionDetails =
      await transactionPage.getTransactionDetails();

    expect(accountATransactionDetails.transactionId).not.toBe("");
    expect(accountATransactionDetails.date).toBe(expectedTransactionDate);
    expect(accountATransactionDetails.description).toBe("Funds Transfer Sent");
    expect(accountATransactionDetails.type).toBe("Debit");
    expect(accountATransactionDetails.amount).toBe("$50.00");

    await transactionPage.open();

    await transactionPage.verifyPageLoaded();

    await transactionPage.selectAccount(accountB);

    await transactionPage.searchByAmount(transferAmount);

    const accountBTransaction = await transactionPage.getTransactionRow();

    expect(accountBTransaction.date).toBe(expectedTransactionDate);
    expect(accountBTransaction.description).toBe("Funds Transfer Received");
    expect(accountBTransaction.debit).toBe("");
    expect(accountBTransaction.credit).toBe("$50.00");

    const accountBTransferCount =
      await transactionPage.getMatchingTransferCount(
        "Funds Transfer Received",
        "$50.00",
        expectedTransactionDate,
      );

    expect(accountBTransferCount).toBe(1);

    await transactionPage.openMatchingTransaction(
      "Funds Transfer Received",
      "$50.00",
      expectedTransactionDate,
    );

    const accountBTransactionDetails =
      await transactionPage.getTransactionDetails();

    expect(accountBTransactionDetails.transactionId).not.toBe("");
    expect(accountBTransactionDetails.date).toBe(expectedTransactionDate);
    expect(accountBTransactionDetails.description).toBe(
      "Funds Transfer Received",
    );
    expect(accountBTransactionDetails.type).toBe("Credit");
    expect(accountBTransactionDetails.amount).toBe("$50.00");
  });

  test("should reject transfer greater than available balance", async ({
    page,
    registerPage,
    openAccountPage,
    accountOverviewPage,
    transferFundsPage,
  }) => {
    const user = generateUniqueUser();

    await page.goto("/parabank/register.htm");

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

    const invalidTransferAmount = balanceABefore + 1;

    expect(invalidTransferAmount).toBeGreaterThan(balanceABefore);

    await transferFundsPage.open();

    await transferFundsPage.transferFunds(
      invalidTransferAmount,
      accountA,
      accountB,
    );

    const transferCompleted = await page
      .getByText("Transfer Complete!", { exact: true })
      .isVisible();

    await accountOverviewPage.open();

    const balanceAAfter = await accountOverviewPage.getBalance(accountA);
    const balanceBAfter = await accountOverviewPage.getBalance(accountB);

    expect(balanceAAfter).toBe(balanceABefore - invalidTransferAmount);

    expect(balanceBAfter).toBe(balanceBBefore + invalidTransferAmount);

    expect(transferCompleted).toBe(false);
  });
});

import { test as base, expect } from "@playwright/test";
import { RegisterPage } from "../pages/parabank/RegisterPage";
import { OpenAccountPage } from "../pages/parabank/OpenAccountPage";
import { AccountOverviewPage } from "../pages/parabank/AccountOverviewPage";
import { TransferFundsPage } from "../pages/parabank/TransferFundsPage";
import { TransactionPage } from "../pages/parabank/TransactionPage";

type ParabankFixtures = {
  registerPage: RegisterPage;
  openAccountPage: OpenAccountPage;
  accountOverviewPage: AccountOverviewPage;
  transferFundsPage: TransferFundsPage;
  transactionPage: TransactionPage;
};

export const test = base.extend<ParabankFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },

  accountOverviewPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },

  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },

  transactionPage: async ({ page }, use) => {
    await use(new TransactionPage(page));
  },
});

export { expect };

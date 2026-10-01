import { Page } from "@playwright/test";

export class TransactionPage {
  private readonly findTransactionsLink;
  private readonly findTransactionsHeading;
  private readonly accountSelect;

  constructor(private readonly page: Page) {
    this.findTransactionsLink = page.getByRole("link", {
      name: "Find Transactions",
    });
    this.findTransactionsHeading = page.getByRole("heading", {
      name: "Find Transactions",
    });
    this.accountSelect = page.locator("#accountId");
  }

  async open(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  async verifyPageLoaded(): Promise<void> {
    await this.findTransactionsHeading.waitFor({ state: "visible" });
  }

  async selectAccount(accountNumber: string): Promise<void> {
    await this.accountSelect.selectOption(accountNumber);
  }
}

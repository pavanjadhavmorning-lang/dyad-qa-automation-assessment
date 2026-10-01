import { Page } from "@playwright/test";

export class TransactionPage {
  private readonly findTransactionsLink;
  private readonly findTransactionsHeading;
  private readonly accountSelect;
  private readonly amountInput;
  private readonly findByAmountButton;
  private readonly transactionTable;

  constructor(private readonly page: Page) {
    this.findTransactionsLink = page.getByRole("link", {
      name: "Find Transactions",
    });
    this.findTransactionsHeading = page.getByRole("heading", {
      name: "Find Transactions",
    });
    this.accountSelect = page.locator("#accountId");
    this.amountInput = page.locator("#amount");
    this.findByAmountButton = page.locator("#findByAmount");
    this.transactionTable = page.locator("#transactionTable");
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

  async searchByAmount(amount: number): Promise<void> {
    await this.amountInput.fill(amount.toString());
    await this.findByAmountButton.click();
    await this.transactionTable.waitFor({ state: "visible" });
  }

  async getTransactionRow(): Promise<{
    date: string;
    description: string;
    debit: string;
    credit: string;
  }> {
    const row = this.transactionTable.locator("tbody tr").first();
    const cells = row.locator("td");

    return {
      date: (await cells.nth(0).textContent())?.trim() ?? "",
      description: (await cells.nth(1).textContent())?.trim() ?? "",
      debit: (await cells.nth(2).textContent())?.trim() ?? "",
      credit: (await cells.nth(3).textContent())?.trim() ?? "",
    };
  }

  async getTransactionCount(): Promise<number> {
    return this.transactionTable.locator("tbody tr").count();
  }

  async getMatchingTransferCount(
    description: string,
    amount: string,
    date: string,
  ): Promise<number> {
    const rows = this.transactionTable.locator("tbody tr");

    const rowCount = await rows.count();
    let matchingCount = 0;

    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator("td");

      const rowDate = (await cells.nth(0).textContent())?.trim() ?? "";
      const rowDescription = (await cells.nth(1).textContent())?.trim() ?? "";
      const rowDebit = (await cells.nth(2).textContent())?.trim() ?? "";
      const rowCredit = (await cells.nth(3).textContent())?.trim() ?? "";

      const rowAmount = rowDebit || rowCredit;

      if (
        rowDate === date &&
        rowDescription === description &&
        rowAmount === amount
      ) {
        matchingCount++;
      }
    }

    return matchingCount;
  }
}

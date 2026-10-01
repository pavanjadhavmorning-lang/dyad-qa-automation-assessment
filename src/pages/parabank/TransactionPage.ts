import { Page, expect } from "@playwright/test";

export class TransactionPage {
  private readonly findTransactionsLink;
  private readonly findTransactionsHeading;
  private readonly accountSelect;
  private readonly amountInput;
  private readonly findByAmountButton;
  private readonly transactionTable;
  private readonly transactionDetailsHeading;
  private readonly transactionId;
  private readonly transactionDate;
  private readonly transactionDescription;
  private readonly transactionType;
  private readonly transactionAmount;

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

    this.transactionDetailsHeading = page.getByRole("heading", {
      name: "Transaction Details",
    });
    this.transactionId = page.getByText("Transaction ID:");
    this.transactionDate = page.getByText("Date:");
    this.transactionDescription = page.getByText("Description:");
    this.transactionType = page.getByText("Type:");
    this.transactionAmount = page.getByText("Amount:");
  }

  async open(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  async verifyPageLoaded(): Promise<void> {
    await this.findTransactionsHeading.waitFor({ state: "visible" });
  }

  async selectAccount(accountNumber: string): Promise<void> {
    await this.accountSelect.selectOption({ label: accountNumber });
    await expect(this.accountSelect).toHaveValue(accountNumber);
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

  async openMatchingTransaction(
    description: string,
    amount: string,
    date: string,
  ): Promise<void> {
    const rows = this.transactionTable.locator("tbody tr");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator("td");

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
        await cells.nth(1).getByRole("link").click();
        await this.transactionDetailsHeading.waitFor({ state: "visible" });
        return;
      }
    }

    throw new Error(
      `Transaction not found: ${description}, ${amount}, ${date}`,
    );
  }

  async getTransactionDetails(): Promise<{
    transactionId: string;
    date: string;
    description: string;
    type: string;
    amount: string;
  }> {
    await this.transactionDetailsHeading.waitFor({ state: "visible" });

    const getDetailValue = async (label: string): Promise<string> => {
      const labelCell = this.page
        .locator("td")
        .filter({
          hasText: label,
        })
        .first();

      return (
        (
          await labelCell
            .locator("xpath=following-sibling::td[1]")
            .textContent()
        )?.trim() ?? ""
      );
    };

    return {
      transactionId: await getDetailValue("Transaction ID:"),
      date: await getDetailValue("Date:"),
      description: await getDetailValue("Description:"),
      type: await getDetailValue("Type:"),
      amount: await getDetailValue("Amount:"),
    };
  }
}

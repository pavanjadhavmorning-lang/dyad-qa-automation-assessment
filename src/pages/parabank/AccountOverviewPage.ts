import { Page } from "@playwright/test";

export class AccountOverviewPage {
  private readonly accountOverviewLink;
  private readonly accountTable;

  constructor(private readonly page: Page) {
    this.accountOverviewLink = page.getByRole("link", {
      name: "Accounts Overview",
    });
    this.accountTable = page.locator("#accountTable");
  }

  async open(): Promise<void> {
    await this.accountOverviewLink.click();
  }

  async getBalance(accountNumber: string): Promise<number> {
    const accountRow = this.accountTable.locator("tbody tr").filter({
      has: this.page.getByRole("link", { name: accountNumber }),
    });

    const balanceText = await accountRow.locator("td").nth(1).textContent();

    if (!balanceText) {
      throw new Error(`Balance not found for account ${accountNumber}`);
    }

    return Number(balanceText.replace("$", "").replace(",", "").trim());
  }
}

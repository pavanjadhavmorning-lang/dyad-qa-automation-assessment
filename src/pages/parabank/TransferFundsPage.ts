import { Page } from "@playwright/test";

export class TransferFundsPage {
  private readonly amount;
  private readonly fromAccount;
  private readonly toAccount;
  private readonly transferButton;

  constructor(private readonly page: Page) {
    this.amount = page.locator("#amount");
    this.fromAccount = page.locator("#fromAccountId");
    this.toAccount = page.locator("#toAccountId");
    this.transferButton = page.locator('input[value="Transfer"]');
  }

  async transferFunds(
    amount: number,
    fromAccount: string,
    toAccount: string,
  ): Promise<void> {
    await this.amount.fill(amount.toString());
    await this.fromAccount.selectOption(fromAccount);
    await this.toAccount.selectOption(toAccount);
    await this.transferButton.click();
  }
}

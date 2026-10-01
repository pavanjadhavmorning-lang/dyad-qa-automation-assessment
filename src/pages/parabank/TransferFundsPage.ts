import { Page, expect } from "@playwright/test";

export class TransferFundsPage {
  private readonly transferFundsLink;
  private readonly transferCompleteMessage;
  private readonly amount;
  private readonly fromAccount;
  private readonly toAccount;
  private readonly transferButton;

  constructor(private readonly page: Page) {
    this.transferFundsLink = page.getByRole("link", {
      name: "Transfer Funds",
    });
    this.transferCompleteMessage = page.getByText(/Transfer Complete/i);
    this.amount = page.locator("#amount");
    this.fromAccount = page.locator("#fromAccountId");
    this.toAccount = page.locator("#toAccountId");
    this.transferButton = page.locator('input[value="Transfer"]');
  }

  async open(): Promise<void> {
    await this.transferFundsLink.click();
  }

  async transferFunds(
    amount: number,
    fromAccount: string,
    toAccount: string,
  ): Promise<void> {
    await this.amount.fill(amount.toString());

    await this.fromAccount.selectOption({ label: fromAccount });
    await expect(this.fromAccount).toHaveValue(fromAccount);

    await this.toAccount.selectOption({ label: toAccount });
    await expect(this.toAccount).toHaveValue(toAccount);

    await this.transferButton.click();
  }

  async verifyTransferComplete(): Promise<void> {
    await this.transferCompleteMessage.waitFor({ state: "visible" });
  }
}

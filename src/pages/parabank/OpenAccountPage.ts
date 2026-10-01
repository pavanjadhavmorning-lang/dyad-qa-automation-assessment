import { Page } from "@playwright/test";

export class OpenAccountPage {
  private readonly accountType;
  private readonly fromAccount;
  private readonly openAccountButton;
  private readonly newAccountNumber;

  constructor(private readonly page: Page) {
    this.accountType = page.locator("#type");
    this.fromAccount = page.locator("#fromAccountId");
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.newAccountNumber = page.locator('a[href*="activity.htm?id="]');
  }

  async openNewAccount(accountType: "CHECKING" | "SAVINGS"): Promise<string> {
    await this.accountType.selectOption(accountType);

    await this.fromAccount.selectOption({
      index: 0,
    });

    await this.openAccountButton.click();

    await this.newAccountNumber.waitFor({ state: "visible" });

    return (await this.newAccountNumber.textContent())?.trim() ?? "";
  }
}

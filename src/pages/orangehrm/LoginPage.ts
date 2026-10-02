import { Page, expect } from "@playwright/test";

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly dashboardHeading;
  private readonly userDropdown;
  private readonly logoutLink;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('input[name="username"]');

    this.passwordInput = page.locator('input[name="password"]');

    this.loginButton = page.getByRole("button", {
      name: "Login",
    });

    this.dashboardHeading = page.getByRole("heading", {
      name: "Dashboard",
    });

    this.userDropdown = page.locator(".oxd-userdropdown-tab");

    this.logoutLink = page.locator(".oxd-userdropdown-link").filter({
      hasText: /^Logout$/,
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();

    await expect(this.logoutLink).toBeVisible();

    await this.logoutLink.click();

    await expect(this.usernameInput).toBeVisible();
  }
}

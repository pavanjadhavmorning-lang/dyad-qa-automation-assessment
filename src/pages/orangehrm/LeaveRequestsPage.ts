import { Page, expect } from "@playwright/test";

export class LeaveRequestsPage {
  private readonly leaveMenu;
  private readonly leaveListLink;
  private readonly employeeNameInput;
  private readonly resetButton;
  private readonly searchButton;
  private readonly leaveRows;

  constructor(private readonly page: Page) {
    this.leaveMenu = page.getByRole("link", {
      name: "Leave",
      exact: true,
    });

    this.leaveListLink = page.getByRole("link", {
      name: "Leave List",
      exact: true,
    });

    this.employeeNameInput = page.getByPlaceholder("Type for hints...");

    this.resetButton = page.getByRole("button", {
      name: "Reset",
      exact: true,
    });

    this.searchButton = page.getByRole("button", {
      name: "Search",
      exact: true,
    });

    this.leaveRows = page.locator(".oxd-table-body .oxd-table-row");
  }

  async openLeaveList(): Promise<void> {
    await this.leaveMenu.click();

    await expect(this.leaveListLink).toBeVisible();

    await this.leaveListLink.click();

    await expect(
      this.page.getByRole("heading", {
        name: "Leave List",
      }),
    ).toBeVisible();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    const normalizedEmployeeName = employeeName.replace(/\s+/g, " ").trim();

    await this.employeeNameInput.fill(normalizedEmployeeName);

    const suggestion = this.page.locator(".oxd-autocomplete-option").filter({
      hasText: normalizedEmployeeName,
    });

    await expect(suggestion.first()).toBeVisible();

    await suggestion.first().click();

    const selectedEmployeeName = await this.employeeNameInput.inputValue();

    expect(selectedEmployeeName.replace(/\s+/g, " ").trim()).toBe(
      normalizedEmployeeName,
    );

    await this.searchButton.click();

    await expect(this.leaveRows.first()).toBeVisible();
  }

  async approveLeaveRequest(
    fromDate: string,
    leaveType: string,
    comments: string,
    employeeName: string,
  ): Promise<void> {
    const matchingRow = this.leaveRows
      .filter({ hasText: fromDate })
      .filter({ hasText: leaveType })
      .filter({ hasText: comments });

    await expect(matchingRow).toHaveCount(1);

    await expect(matchingRow).toContainText("Pending Approval");

    const approveButton = matchingRow
      .locator("button.oxd-button--success")
      .filter({
        hasText: /^Approve$/,
      });

    await expect(approveButton).toBeVisible();

    await expect(approveButton).toBeEnabled();

    await approveButton.scrollIntoViewIfNeeded();

    await approveButton.click({
      force: true,
    });

    await this.page.waitForLoadState("domcontentloaded").catch(() => {});

    await this.resetButton.click();

    await this.searchEmployee(employeeName);

    const updatedRow = this.leaveRows
      .filter({ hasText: fromDate })
      .filter({ hasText: leaveType })
      .filter({ hasText: comments });

    await expect(updatedRow).toHaveCount(1);

    await expect(updatedRow).toContainText("Scheduled");
  }
}

import { Page, expect } from "@playwright/test";

export class LeavePage {
  private readonly leaveMenu;
  private readonly applyLeaveLink;
  private readonly leaveTypeDropdown;
  private readonly fromDateInput;
  private readonly toDateInput;
  private readonly fromDateCalendar;
  private readonly toDateCalendar;
  private readonly durationDropdown;
  private readonly commentsInput;
  private readonly applyButton;
  private readonly successToast;

  constructor(private readonly page: Page) {
    this.leaveMenu = page.getByRole("link", {
      name: "Leave",
      exact: true,
    });

    this.applyLeaveLink = page.getByRole("link", {
      name: "Apply",
      exact: true,
    });

    this.leaveTypeDropdown = page
      .locator("label")
      .filter({ hasText: "Leave Type" })
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator(".oxd-select-text");

    this.fromDateInput = page
      .locator("label")
      .filter({ hasText: "From Date" })
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator("input");

    this.toDateInput = page
      .locator("label")
      .filter({ hasText: "To Date" })
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator("input");

    this.fromDateCalendar = page.locator(".oxd-icon.bi-calendar").first();

    this.toDateCalendar = page.locator(".oxd-icon.bi-calendar").nth(1);

    this.durationDropdown = page
      .locator("label")
      .filter({ hasText: "Duration" })
      .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
      .locator(".oxd-select-text");

    this.commentsInput = page.locator("textarea");

    this.applyButton = page.getByRole("button", {
      name: "Apply",
      exact: true,
    });

    this.successToast = page.getByText("Successfully Saved", {
      exact: true,
    });
  }

  async openApplyLeave(): Promise<void> {
    await this.leaveMenu.click();

    await expect(this.applyLeaveLink).toBeVisible();

    await this.applyLeaveLink.click();

    await expect(
      this.page.getByRole("heading", {
        name: "Apply Leave",
      }),
    ).toBeVisible();
  }

  async selectLeaveType(leaveType: string): Promise<void> {
    await this.leaveTypeDropdown.click();

    const option = this.page.getByText(leaveType, {
      exact: true,
    });

    await expect(option).toBeVisible();

    await option.click();

    await expect(this.leaveTypeDropdown).toContainText(leaveType);
  }

  async selectDates(fromDate: string, toDate: string): Promise<void> {
    const [, fromDay] = fromDate.split("-").map(Number);

    const [, toDay] = toDate.split("-").map(Number);

    await this.fromDateCalendar.click();

    await expect(this.page.locator(".oxd-calendar-date").first()).toBeVisible();

    await this.selectCalendarDay(fromDay);

    await expect(this.fromDateInput).toHaveValue(fromDate);

    await this.toDateCalendar.click();

    await expect(this.page.locator(".oxd-calendar-date").first()).toBeVisible();

    await this.selectCalendarDay(toDay);

    await expect(this.toDateInput).toHaveValue(toDate);

    await expect(this.durationDropdown).toBeVisible();
  }

  private async selectCalendarDay(day: number): Promise<void> {
    const dayOption = this.page
      .locator(".oxd-calendar-date")
      .filter({
        hasText: new RegExp(`^${day}$`),
      })
      .first();

    await expect(dayOption).toBeVisible();

    await dayOption.click();
  }

  async selectDuration(duration: string): Promise<void> {
    await this.durationDropdown.click();

    const option = this.page.getByText(duration, {
      exact: true,
    });

    await expect(option).toBeVisible();

    await option.click();

    await expect(this.durationDropdown).toContainText(duration);
  }

  async enterComments(reason: string): Promise<void> {
    await this.commentsInput.fill(reason);

    await expect(this.commentsInput).toHaveValue(reason);
  }

  async applyLeave(): Promise<void> {
    await expect(this.applyButton).toBeEnabled();

    await this.applyButton.click();

    await expect(this.successToast).toBeVisible();

    await expect(this.successToast).toHaveText("Successfully Saved");
  }
}

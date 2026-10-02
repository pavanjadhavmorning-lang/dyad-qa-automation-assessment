import { Page, expect } from "@playwright/test";

export type LeaveRange = {
  fromDate: string;
  toDate: string;
};

export class MyLeavePage {
  private readonly leaveMenu;
  private readonly myLeaveLink;
  private readonly leaveRows;

  constructor(private readonly page: Page) {
    this.leaveMenu = page.getByRole("link", {
      name: "Leave",
      exact: true,
    });

    this.myLeaveLink = page.getByRole("link", {
      name: "My Leave",
      exact: true,
    });

    this.leaveRows = page.locator(".oxd-table-body .oxd-table-row");
  }

  async openMyLeave(): Promise<void> {
    await this.leaveMenu.click();

    await expect(this.myLeaveLink).toBeVisible();

    await this.myLeaveLink.click();

    await expect(this.page.getByText(/Records Found/)).toBeVisible();
  }

  async getExistingLeaveRanges(): Promise<LeaveRange[]> {
    const count = await this.leaveRows.count();

    const leaveRanges: LeaveRange[] = [];

    for (let index = 0; index < count; index++) {
      const dateCell = this.leaveRows
        .nth(index)
        .locator(".oxd-table-cell")
        .nth(1);

      const dateText = (await dateCell.innerText()).trim();

      const match = dateText.match(
        /(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/,
      );

      if (match) {
        leaveRanges.push({
          fromDate: match[1],
          toDate: match[2],
        });
      }
    }

    return leaveRanges;
  }
}

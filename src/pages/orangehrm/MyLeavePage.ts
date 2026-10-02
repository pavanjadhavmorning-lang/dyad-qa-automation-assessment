import { Page, expect } from "@playwright/test";

export type LeaveRequestDetails = {
  date: string;
  employeeName: string;
  leaveType: string;
  numberOfDays: string;
  status: string;
  comments: string;
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

  async getExistingLeaveRanges(): Promise<
    Array<{
      fromDate: string;
      toDate: string;
    }>
  > {
    const count = await this.leaveRows.count();

    const leaveRanges: Array<{
      fromDate: string;
      toDate: string;
    }> = [];

    for (let index = 0; index < count; index++) {
      const dateCell = this.leaveRows
        .nth(index)
        .locator(".oxd-table-cell")
        .nth(1);

      const dateText = (await dateCell.innerText()).trim();

      const match = dateText.match(/(\d{4}-\d{2}-\d{2})/);

      if (match) {
        leaveRanges.push({
          fromDate: match[1],
          toDate: match[1],
        });
      }
    }

    return leaveRanges;
  }

  async getLeaveRequestDetails(
    fromDate: string,
    leaveType: string,
    comments: string,
  ): Promise<LeaveRequestDetails> {
    const matchingRows = this.leaveRows
      .filter({ hasText: fromDate })
      .filter({ hasText: leaveType })
      .filter({ hasText: comments });

    await expect(matchingRows).toHaveCount(1);

    const row = matchingRows.first();

    const cells = row.locator(".oxd-table-cell");

    const date = (await cells.nth(1).innerText()).trim();

    const employeeName = (await cells.nth(2).innerText())
      .replace(/\s+/g, " ")
      .trim();

    const actualLeaveType = (await cells.nth(3).innerText()).trim();

    const numberOfDays = (await cells.nth(5).innerText()).trim();

    const status = (await cells.nth(6).innerText()).trim();

    const actualComments = (await cells.nth(7).innerText()).trim();

    expect(date).toContain(fromDate);
    expect(employeeName).toBeTruthy();
    expect(actualLeaveType).toContain(leaveType);
    expect(numberOfDays).toBeTruthy();
    expect(status).toBeTruthy();
    expect(actualComments).toBe(comments);

    return {
      date,
      employeeName,
      leaveType: actualLeaveType,
      numberOfDays,
      status,
      comments: actualComments,
    };
  }

  async openLeaveDetails(
    fromDate: string,
    leaveType: string,
    comments: string,
  ): Promise<void> {
    const matchingRows = this.leaveRows
      .filter({ hasText: fromDate })
      .filter({ hasText: leaveType })
      .filter({ hasText: comments });

    await expect(matchingRows).toHaveCount(1);

    const row = matchingRows.first();

    const actionsButton = row.getByRole("button");

    await expect(actionsButton).toBeVisible();

    await actionsButton.click();

    const viewLeaveDetails = this.page.getByText("View Leave Details", {
      exact: true,
    });

    await expect(viewLeaveDetails).toBeVisible();

    await viewLeaveDetails.click();
  }
}

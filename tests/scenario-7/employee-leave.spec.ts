import { test, expect } from "../../src/fixtures/testFixtures";
import { LoginPage } from "../../src/pages/orangehrm/LoginPage";
import { LeavePage } from "../../src/pages/orangehrm/LeavePage";
import { MyLeavePage } from "../../src/pages/orangehrm/MyLeavePage";
import { getFutureLeaveDates } from "../../test-data/orangeHrmDateUtils";
import { logTestEnd, logTestStart } from "../../src/hooks/testHooks";

test.describe("Scenario 7 - Employee Leave Approval", () => {
  test.beforeEach(async ({}, testInfo) => {
    logTestStart(testInfo);
  });

  test.afterEach(async ({}, testInfo) => {
    logTestEnd(testInfo);
  });

  test("should allow the employee to apply for future leave", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const leavePage = new LeavePage(page);
    const myLeavePage = new MyLeavePage(page);

    const username = process.env.ORANGEHRM_EMPLOYEE_USERNAME;

    const password = process.env.ORANGEHRM_EMPLOYEE_PASSWORD;

    expect(username).toBeTruthy();
    expect(password).toBeTruthy();

    await page.goto(process.env.ORANGEHRM_BASE_URL!);

    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.login(username!, password!);

    await loginPage.verifyDashboardLoaded();

    await myLeavePage.openMyLeave();

    const existingLeaves = await myLeavePage.getExistingLeaveRanges();

    const { fromDate, toDate } = getFutureLeaveDates(existingLeaves);

    await leavePage.openApplyLeave();

    await leavePage.selectLeaveType("CAN - Bereavement");

    await leavePage.selectDates(fromDate, toDate);

    await leavePage.selectDuration("Half Day - Morning");

    const comments = `Personal work ${Date.now()}`;

    await leavePage.enterComments(comments);

    await leavePage.applyLeave();

    await myLeavePage.openMyLeave();

    const leaveRequest = await myLeavePage.getLeaveRequestDetails(
      fromDate,
      "CAN - Bereavement",
      comments,
    );

    expect(leaveRequest.date).toContain(fromDate);

    expect(leaveRequest.leaveType).toContain("CAN - Bereavement");

    expect(leaveRequest.comments).toBe(comments);
  });
});

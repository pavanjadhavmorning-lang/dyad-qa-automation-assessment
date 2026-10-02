import { test, expect } from "../../src/fixtures/testFixtures";
import { LoginPage } from "../../src/pages/orangehrm/LoginPage";
import { LeavePage } from "../../src/pages/orangehrm/LeavePage";
import { MyLeavePage } from "../../src/pages/orangehrm/MyLeavePage";
import { LeaveRequestsPage } from "../../src/pages/orangehrm/LeaveRequestsPage";
import { getFutureLeaveDates } from "../../test-data/orangeHrmDateUtils";
import { logTestEnd, logTestStart } from "../../src/hooks/testHooks";

test.describe("Scenario 7 - Employee Leave Approval", () => {
  test.beforeEach(async ({}, testInfo) => {
    logTestStart(testInfo);
  });

  test.afterEach(async ({}, testInfo) => {
    logTestEnd(testInfo);
  });

  test("should allow the employee to apply for future leave and get it approved", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const leavePage = new LeavePage(page);
    const myLeavePage = new MyLeavePage(page);
    const leaveRequestsPage = new LeaveRequestsPage(page);

    const employeeUsername = process.env.ORANGEHRM_EMPLOYEE_USERNAME;

    const employeePassword = process.env.ORANGEHRM_EMPLOYEE_PASSWORD;

    const adminUsername = process.env.ORANGEHRM_ADMIN_USERNAME;

    const adminPassword = process.env.ORANGEHRM_ADMIN_PASSWORD;

    expect(employeeUsername).toBeTruthy();
    expect(employeePassword).toBeTruthy();
    expect(adminUsername).toBeTruthy();
    expect(adminPassword).toBeTruthy();

    await page.goto(process.env.ORANGEHRM_BASE_URL!);

    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.login(employeeUsername!, employeePassword!);

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

    expect(leaveRequest.employeeName).toBeTruthy();

    expect(leaveRequest.leaveType).toContain("CAN - Bereavement");

    expect(leaveRequest.numberOfDays).toBeTruthy();

    expect(leaveRequest.status).toBeTruthy();

    expect(leaveRequest.comments).toBe(comments);

    await loginPage.logout();

    await loginPage.login(adminUsername!, adminPassword!);

    await loginPage.verifyDashboardLoaded();

    await leaveRequestsPage.openLeaveList();

    await leaveRequestsPage.searchEmployee(leaveRequest.employeeName);

    await leaveRequestsPage.approveLeaveRequest(
      fromDate,
      "CAN - Bereavement",
      comments,
      leaveRequest.employeeName,
    );

    await loginPage.logout();

    await loginPage.login(employeeUsername!, employeePassword!);

    await loginPage.verifyDashboardLoaded();

    await myLeavePage.openMyLeave();

    const approvedLeaveRequest = await myLeavePage.getLeaveRequestDetails(
      fromDate,
      "CAN - Bereavement",
      comments,
    );

    expect(approvedLeaveRequest.date).toContain(fromDate);

    expect(approvedLeaveRequest.comments).toBe(comments);

    expect(approvedLeaveRequest.status).toBe("Scheduled");
  });
});

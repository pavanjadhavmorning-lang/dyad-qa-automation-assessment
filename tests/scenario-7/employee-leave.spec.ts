import { test, expect } from "../../src/fixtures/testFixtures";
import { LoginPage } from "../../src/pages/orangehrm/LoginPage";
import { logTestEnd, logTestStart } from "../../src/hooks/testHooks";

test.describe("Scenario 7 - Employee Leave Approval", () => {
  test.beforeEach(async ({}, testInfo) => {
    logTestStart(testInfo);
  });

  test.afterEach(async ({}, testInfo) => {
    logTestEnd(testInfo);
  });

  test("should allow the employee to login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const username = process.env.ORANGEHRM_EMPLOYEE_USERNAME;
    const password = process.env.ORANGEHRM_EMPLOYEE_PASSWORD;

    expect(username).toBeTruthy();
    expect(password).toBeTruthy();

    await page.goto(process.env.ORANGEHRM_BASE_URL!);

    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.login(username!, password!);

    await expect(page).toHaveURL(/\/dashboard\//);

    await loginPage.verifyDashboardLoaded();
  });
});

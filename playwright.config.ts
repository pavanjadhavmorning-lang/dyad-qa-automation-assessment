import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Run tests sequentially because both scenarios involve
  // user/account state and role-based workflows.
  fullyParallel: false,

  // Fail if test.only is accidentally committed.
  forbidOnly: !!process.env.CI,

  // No automatic retries during development.
  // We want to see and fix genuine failures.
  retries: 0,

  // One worker keeps execution predictable.
  workers: 1,

  // Test execution reports.
  reporter: [["list"], ["html", { open: "never" }]],

  // Global test timeout.
  timeout: 120000,

  // Assertion timeout.
  expect: {
    timeout: 15000,
  },

  use: {
    // Capture useful debugging information on failure.
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",

    // Browser configuration.
    ...devices["Desktop Chrome"],

    // We can use page.goto() with absolute URLs for each application.
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});

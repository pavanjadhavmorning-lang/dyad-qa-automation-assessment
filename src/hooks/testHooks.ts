import { TestInfo } from "@playwright/test";

export function logTestStart(testInfo: TestInfo): void {
  console.log(`Starting test: ${testInfo.title}`);
}

export function logTestEnd(testInfo: TestInfo): void {
  console.log(`Finished test: ${testInfo.title} - ${testInfo.status}`);
}

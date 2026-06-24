// playwright.global-setup.ts
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Navigate to the app and wait for the sidebar to appear
  await page.goto('http://localhost:3000');
  // Increase timeout to allow app initialization
  await page.waitForSelector('aside', { timeout: 60000, state: 'visible' });
  await browser.close();
}

import { chromium, type FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseURL = config.projects[0].use.baseURL;

  if (!baseURL) {
    throw new Error('baseURL is not configured');
  }

  await page.goto(baseURL);

  await page.waitForSelector('aside', {
    timeout: 60000,
    state: 'visible',
  });

  await browser.close();
}
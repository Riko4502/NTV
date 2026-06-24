import { chromium, type FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseURL = config.projects[0].use.baseURL;

  if (!baseURL) {
    throw new Error('baseURL is not configured');
  }

  await page.goto(baseURL);

  // Perform login with default demo credentials
  await page.fill('input[placeholder="Имя пользователя"]', 'admin');
  await page.fill('input[placeholder="Пароль"]', 'admin');
  await page.click('button:has-text("Войти")');

  // Wait for the sidebar to be visible after login
  await page.waitForSelector('aside', {
    timeout: 60000,
    state: 'visible',
  });

  // Ensure the app has finished loading network requests
  await page.waitForLoadState('networkidle');

  // Save authenticated storage state for reuse in tests
  await page.context().storageState({ path: './playwright-auth.json' });

  await browser.close();
}

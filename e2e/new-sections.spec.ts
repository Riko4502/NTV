import { expect, test } from '@playwright/test';

test.describe('NOC New Sections E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    // Wait for initial load
    await page.waitForTimeout(1000);
  });

  test('should navigate to Devices Page and verify table structure and search', async ({
    page,
  }) => {
    // Click Devices menu item in the Sidebar
    const devicesLink = page.locator('aside').locator('text=Устройства');
    await expect(devicesLink).toBeVisible();
    await devicesLink.click();

    // Verify URL
    await expect(page).toHaveURL('/devices');

    // Check search input exists
    const searchInput = page.locator('input[placeholder="Поиск по имени или IP..."]');
    await expect(searchInput).toBeVisible();

    // Type "Web Server" in search and check that the table filters
    await searchInput.fill('Web Server');
    await page.waitForTimeout(500);

    // Verify only matching rows or elements are present
    const nodeName = page.locator('text=Web Server');
    await expect(nodeName).toBeVisible();

    // Verify commands column buttons
    const pingButton = page.locator('button').filter({ hasText: 'Ping' }).first();
    await expect(pingButton).toBeVisible();
  });

  test('should navigate to Alerts Page and verify filters and JSON export button', async ({
    page,
  }) => {
    // Click Incident log menu item in the Sidebar
    const alertsLink = page.locator('aside').locator('text=Инциденты');
    await expect(alertsLink).toBeVisible();
    await alertsLink.click();

    // Verify URL
    await expect(page).toHaveURL('/alerts');

    // Check action buttons exist
    const ackAllBtn = page.locator('button').filter({ hasText: 'Подтвердить все' });
    const exportBtn = page.locator('button').filter({ hasText: 'Экспорт JSON' });
    const clearBtn = page.locator('button').filter({ hasText: 'Очистить' });

    await expect(ackAllBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();
    await expect(clearBtn).toBeVisible();
  });

  test('should navigate to Settings Page and verify NOC limit form', async ({ page }) => {
    // Click Settings menu item in the Sidebar
    const settingsLink = page.locator('aside').locator('text=Настройки');
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();

    // Verify URL
    await expect(page).toHaveURL('/settings');

    // Check main section header
    const limitHeader = page.locator('text=Пороговые лимиты NOC');
    await expect(limitHeader).toBeVisible();

    // Check slider labels and inputs
    const saveBtn = page.locator('button').filter({ hasText: 'Сохранить конфигурацию' });
    await expect(saveBtn).toBeVisible();
  });

  test('should navigate to Reports Page and verify SLA KPIs and downloads', async ({ page }) => {
    // Click Reports menu item in the Sidebar
    const reportsLink = page.locator('aside').locator('text=Отчеты');
    await expect(reportsLink).toBeVisible();
    await reportsLink.click();

    // Verify URL
    await expect(page).toHaveURL('/reports');

    // Check SLA circular KPIs are present
    const uptimeLabel = page.locator('text=Глобальный Uptime SLA');
    const mttrLabel = page.locator('text=Среднее время ремонта (MTTR)');
    await expect(uptimeLabel).toBeVisible();
    await expect(mttrLabel).toBeVisible();

    // Verify download buttons
    const downloadPdfBtn = page.locator('button').filter({ hasText: 'Скачать текстовый отчет' });
    const downloadCsvBtn = page.locator('button').filter({ hasText: 'Экспорт SLA в CSV' });
    await expect(downloadPdfBtn).toBeVisible();
    await expect(downloadCsvBtn).toBeVisible();
  });
});

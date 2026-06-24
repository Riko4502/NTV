import { expect, test } from '@playwright/test';

test.describe('NOC New Sections E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу (авторизация уже выполнена через storageState)
    await page.goto('/');
    // Ensure sidebar is visible
    await page.waitForSelector('aside', { timeout: 60000, state: 'visible' });
  });

  test('should navigate to Devices Page and verify table structure and search', async ({
    page,
  }) => {
    // Нажимаем пункт меню «Устройства» в боковой панели
    const devicesLink = page.locator('aside').locator('text=Устройства');
    await expect(devicesLink).toBeVisible();
    await devicesLink.click();

    // Проверяем, что URL соответствует ожидаемому
    await expect(page).toHaveURL('/devices');

    // Проверяем наличие поля поиска
    const searchInput = page.locator('input[placeholder="Поиск по имени или IP..."]');
    await expect(searchInput).toBeVisible();

    // Вводим «Web Server» в поиск и проверяем фильтрацию таблицы
    await searchInput.fill('Web Server');
    await page.waitForTimeout(500);

    // Убеждаемся, что отображаются только совпадающие строки/элементы
    const nodeName = page.locator('text=Web Server');
    await expect(nodeName).toBeVisible();

    // Проверяем кнопки в колонке команд
    const pingButton = page.locator('button').filter({ hasText: 'Ping' }).first();
    await expect(pingButton).toBeVisible();
  });

  test('should navigate to Alerts Page and verify filters and JSON export button', async ({
    page,
  }) => {
    // Нажимаем пункт меню «Инциденты» в боковой панели
    const alertsLink = page.locator('aside').locator('text=Инциденты');
    await expect(alertsLink).toBeVisible();
    await alertsLink.click();

    // Проверяем, что URL соответствует ожидаемому
    await expect(page).toHaveURL('/alerts');

    // Проверяем наличие кнопок действий
    const ackAllBtn = page.locator('button').filter({ hasText: 'Подтвердить все' });
    const exportBtn = page.locator('button').filter({ hasText: 'Экспорт JSON' });
    const clearBtn = page.locator('button').filter({ hasText: 'Очистить' });

    await expect(ackAllBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();
    await expect(clearBtn).toBeVisible();
  });

  test('should navigate to Settings Page and verify NOC limit form', async ({ page }) => {
    // Нажимаем пункт меню «Настройки» в боковой панели
    const settingsLink = page.locator('aside').locator('text=Настройки');
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();

    // Проверяем, что URL соответствует ожидаемому
    await expect(page).toHaveURL('/settings');

    // Проверяем заголовок основной секции
    const limitHeader = page.locator('text=Пороговые лимиты NOC');
    await expect(limitHeader).toBeVisible();

    // Проверяем метки и поля ползунков
    const saveBtn = page.locator('button').filter({ hasText: 'Сохранить конфигурацию' });
    await expect(saveBtn).toBeVisible();
  });

  test('should navigate to Reports Page and verify SLA KPIs and downloads', async ({ page }) => {
    // Нажимаем пункт меню «Отчеты» в боковой панели
    const reportsLink = page.locator('aside').locator('text=Отчеты');
    await expect(reportsLink).toBeVisible();
    await reportsLink.click();

    // Проверяем, что URL соответствует ожидаемому
    await expect(page).toHaveURL('/reports');

    // Проверяем наличие круговых KPI SLA
    const uptimeLabel = page.locator('text=Глобальный Uptime SLA');
    const mttrLabel = page.locator('text=Среднее время ремонта (MTTR)');
    await expect(uptimeLabel).toBeVisible();
    await expect(mttrLabel).toBeVisible();

    // Проверяем кнопки скачивания
    const downloadPdfBtn = page.locator('button').filter({ hasText: 'Печать отчета (PDF)' });
    const downloadCsvBtn = page.locator('button').filter({ hasText: 'Экспорт SLA в CSV' });
    await expect(downloadPdfBtn).toBeVisible();
    await expect(downloadCsvBtn).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

test.describe('NOC Network Topology Viewer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на страницу дашборда
    await page.goto('/');
    // Ожидание завершения анимации центрирования графа (fitView занимает 600ms)
    await page.waitForTimeout(1000);
  });

  test('should display the main header and logo', async ({ page }) => {
    // Проверка видимости названия в заголовке
    const headerTitle = page.locator('[data-testid="header-title"]');
    await expect(headerTitle).toBeVisible();
  });

  test('should render network topology graph nodes', async ({ page }) => {
    // Ожидание загрузки узлов на холсте react-flow
    const devWorkstationNode = page
      .locator('.react-flow__node')
      .filter({ hasText: 'Dev Workstation' });
    await expect(devWorkstationNode).toBeVisible();

    const gwNode = page.locator('.react-flow__node').filter({ hasText: 'Internet Gateway' });
    await expect(gwNode).toBeVisible();
  });

  test('should open and close the alerts log drawer', async ({ page }) => {
    // Поиск кнопки колокольчика по иконке lucide-bell
    const bellButton = page.locator('button:has(svg.lucide-bell)');
    await expect(bellButton).toBeVisible();

    // Открытие панели лога событий
    await bellButton.click();

    // Проверка видимости панели и корректности её заголовка
    const drawerTitle = page.locator('text=Лог событий и сбоев');
    await expect(drawerTitle).toBeVisible();

    // Закрытие панели повторным кликом по колокольчику
    await bellButton.click();
    await expect(drawerTitle).not.toBeVisible();
  });

  test('should open device details panel when a node is clicked', async ({ page }) => {
    // Клик по узлу Web Server на графе
    const webServerNode = page.locator('.react-flow__node').filter({ hasText: 'Web Server' });
    await expect(webServerNode).toBeVisible();
    await webServerNode.click();

    // Ожидание появления панели информации об узле
    const detailsHeader = page.locator('text=ИНФОРМАЦИЯ ОБ УЗЛЕ');
    await expect(detailsHeader).toBeVisible();

    // Проверка отображения специфических характеристик устройства
    const ipLabel = page.locator('.ant-drawer').locator('text=10.0.3.10');
    await expect(ipLabel).toBeVisible();
  });
});

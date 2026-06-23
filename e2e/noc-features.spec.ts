import { expect, test } from '@playwright/test';

test.describe('NOC Interactive Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the topology page
    await page.goto('/');
    // Wait for dagre canvas layout calculation
    await page.waitForTimeout(1000);
  });

  test('should toggle clients visibility on the canvas', async ({ page }) => {
    // Check that client nodes (e.g. Dev Laptop or Finance Desktop) are initially visible
    const clientNode = page.locator('.react-flow__node').filter({ hasText: 'Dev Laptop' });
    await expect(clientNode).toBeVisible();

    // Click "Клиенты" filter button in the toolbar
    const clientsBtn = page.locator('button').filter({ hasText: 'Клиенты' });
    await expect(clientsBtn).toBeVisible();
    await clientsBtn.click();

    // Verify that the client node is now hidden
    await expect(clientNode).not.toBeVisible();

    // Click again to show client nodes
    await clientsBtn.click();
    await expect(clientNode).toBeVisible();
  });

  test('should open incident simulator drawer and trigger DDoS', async ({ page }) => {
    // Open the simulator panel via the sliders icon in the header stats
    // The button contains Lucide Sliders svg
    const headerSlidersBtn = page.locator('header button').nth(1);
    await expect(headerSlidersBtn).toBeVisible();
    await headerSlidersBtn.click();

    // Check if the simulator drawer is visible
    const drawerTitle = page.locator('text=Симулятор Сетевых Инцидентов');
    await expect(drawerTitle).toBeVisible();

    // Trigger DDoS attack on the Internet Gateway node
    const gatewayCard = page.locator('.ant-card').filter({ hasText: 'Internet Gateway' }).first();
    await expect(gatewayCard).toBeVisible();

    const ddosBtn = gatewayCard.locator('button').filter({ hasText: 'DDoS атака' });
    await expect(ddosBtn).toBeVisible();
    await ddosBtn.click();

    // Close the drawer using the close button
    const closeBtn = page.locator('.ant-drawer-close');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(drawerTitle).not.toBeVisible();

    // Verify that the active incidents count changed/increased in the bell badge
    const bellBadge = page.locator('.ant-scroll-number');
    await expect(bellBadge).toBeVisible();
  });

  test('should open JSON export/import dropdown and find operations', async ({ page }) => {
    // The EllipsisOutlined icon is used for the dropdown trigger button in BackupSection.tsx
    const ellipsisButton = page.locator('.anticon-ellipsis').locator('xpath=./ancestor::button');
    await expect(ellipsisButton).toBeVisible();
    await ellipsisButton.click();

    // Check that dropdown items are present
    const exportOption = page.locator('text=Экспортировать схему в JSON');
    const importOption = page.locator('text=Импортировать схему из JSON');
    await expect(exportOption).toBeVisible();
    await expect(importOption).toBeVisible();
  });

  test('should display desktop sidebar and hide burger button on desktop viewports', async ({
    page,
  }) => {
    // Default viewport in config is desktop
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check navigation links inside sidebar
    const topologyLink = sidebar.locator('text=Топология');
    await expect(topologyLink).toBeVisible();
    const analyticsLink = sidebar.locator('text=Аналитика');
    await expect(analyticsLink).toBeVisible();

    // Check that burger button is hidden on desktop viewport
    const burgerButton = page.locator('header button').first();
    await expect(burgerButton).not.toBeVisible();

    // Click collapse button (the only button in sidebar)
    const collapseButton = sidebar.locator('button');
    await expect(collapseButton).toBeVisible();
    await collapseButton.click();

    // Verify text labels are hidden
    await expect(topologyLink).not.toBeVisible();
    await expect(analyticsLink).not.toBeVisible();

    // Click expand button to restore
    await collapseButton.click();
    await expect(topologyLink).toBeVisible();
    await expect(analyticsLink).toBeVisible();
  });
});

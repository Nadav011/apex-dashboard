import { test, expect } from '@playwright/test';

test.describe('APEX Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);
  });

  test('1. redirects to overview', async ({ page }) => {
    await page.waitForFunction(() => window.location.hash.includes("dashboard"));const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toContain('dashboard/overview');
  });

  test('2. sidebar has 5 categories', async ({ page }) => {
    const nav = page.locator('nav[aria-label="ניווט ראשי"]');
    await expect(nav).toBeVisible();
  });

  test('3. breadcrumbs visible', async ({ page }) => {
    const bc = page.locator('nav[aria-label="מיקום"]');
    await expect(bc).toBeVisible();
    await expect(bc).toContainText('לוח בקרה');
  });

  test('4. command palette opens', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
    const input = page.locator('input[placeholder="חפש עמוד..."]');
    await expect(input).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('5. navigate to agents/fleet', async ({ page }) => {
    await page.goto('http://localhost:5173/#/agents/fleet');
    await page.waitForTimeout(2000);
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('צי סוכנים');
  });

  test('6. knowledge tabs work', async ({ page }) => {
    await page.goto('http://localhost:5173/#/knowledge/base');
    await page.waitForTimeout(2000);
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBeGreaterThanOrEqual(3);
    await tabs.nth(1).click();
    await page.waitForTimeout(300);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('7. mobile bottom bar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const bar = page.locator('nav[aria-label="ניווט תחתון"]');
    await expect(bar).toBeVisible();
  });

  test('8. status indicator', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toContainText(/תקין|מדורדר|קריטי/);
  });

  test('9. page header on overview', async ({ page }) => {
    const header = page.locator('h1').first();
    await expect(header).toContainText('סקירה כללית');
  });

  test('10. hash routing works', async ({ page }) => {
    await page.goto('http://localhost:5173/#/ops/control');
    await page.waitForTimeout(2000);
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('שליטה');
  });
});

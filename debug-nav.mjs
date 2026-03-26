/**
 * Debug script: dumps full nav structure and tests all click strategies
 */
import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Dump full sidebar/nav HTML structure
  console.log('=== NAV/SIDEBAR HTML DUMP ===');
  const navEls = await page.locator('nav, aside, .sidebar, [role="navigation"]').all();
  for (const el of navEls) {
    const html = await el.innerHTML();
    console.log(html.substring(0, 3000));
    console.log('---');
  }

  // Dump ALL buttons on the page
  console.log('\n=== ALL BUTTONS ===');
  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].innerText().catch(() => '?');
    const cls = await buttons[i].getAttribute('class').catch(() => '');
    const vis = await buttons[i].isVisible().catch(() => false);
    console.log(`  [${i}] visible=${vis} class="${cls?.substring(0,50)}" text="${text?.trim().substring(0,40)}"`);
  }

  // Dump ALL links
  console.log('\n=== ALL LINKS ===');
  const links = await page.locator('a').all();
  for (let i = 0; i < links.length; i++) {
    const text = await links[i].innerText().catch(() => '?');
    const href = await links[i].getAttribute('href').catch(() => '');
    console.log(`  [${i}] href="${href}" text="${text?.trim().substring(0,40)}"`);
  }

  // Dump ALL clickable LI items
  console.log('\n=== ALL LI ITEMS ===');
  const lis = await page.locator('li').all();
  for (let i = 0; i < Math.min(lis.length, 30); i++) {
    const text = await lis[i].innerText().catch(() => '?');
    const vis = await lis[i].isVisible().catch(() => false);
    console.log(`  [${i}] visible=${vis} text="${text?.trim().substring(0,60)}"`);
  }

  // Check page full text
  console.log('\n=== FULL PAGE TEXT (first 500 chars) ===');
  const bodyText = await page.locator('body').innerText();
  console.log(bodyText.substring(0, 500));

  // Try to find "שליטה" specifically
  console.log('\n=== SEARCHING FOR "שליטה" ===');
  const allEls = await page.locator('body *').all();
  for (const el of allEls) {
    const text = await el.innerText().catch(() => '');
    if (text.trim() === 'שליטה') {
      const tag = await el.evaluate(e => e.tagName);
      const cls = await el.getAttribute('class').catch(() => '');
      const vis = await el.isVisible().catch(() => false);
      console.log(`  Found "שליטה": tag=${tag}, vis=${vis}, class="${cls}"`);
    }
  }

  // Check for "CI/CD"
  console.log('\n=== SEARCHING FOR "CI/CD" ===');
  const ciEls = await page.getByText('CI/CD').all();
  for (const el of ciEls) {
    const tag = await el.evaluate(e => e.tagName);
    const cls = await el.getAttribute('class').catch(() => '');
    const vis = await el.isVisible().catch(() => false);
    console.log(`  Found "CI/CD": tag=${tag}, vis=${vis}, class="${cls}"`);
  }

  await browser.close();
})();

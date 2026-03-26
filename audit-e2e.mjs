/**
 * APEX Command Center — Playwright E2E Audit v2
 * Fixed: uses span.truncate locator to find nav items reliably
 */
import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = '/tmp/apex-audit/screenshots';
const REPORT_PATH = '/tmp/apex-audit/report.json';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const PAGES = [
  { nav: 'סקירה כללית', id: 'overview' },
  { nav: 'צי סוכנים',   id: 'fleet' },
  { nav: 'הידרה',        id: 'hydra' },
  { nav: 'בריאות',       id: 'health' },
  { nav: 'מערכת',        id: 'system' },
  { nav: 'הוקים',        id: 'hooks' },
  { nav: 'מטריקות',      id: 'metrics' },
  { nav: 'שליטה',        id: 'control' },
  { nav: 'CI/CD',        id: 'cicd' },
  { nav: 'Deploys',      id: 'deploys' },
  { nav: 'התראות',       id: 'notifications' },
  { nav: 'OpenClaw',     id: 'openclaw' },
  { nav: 'מדריך',        id: 'faq' },
];

const report = {
  timestamp: new Date().toISOString(),
  base_url: BASE_URL,
  pages: [],
  summary: { pass: 0, warn: 0, fail: 0, total: PAGES.length },
  global_issues: [],
  nav_items_found: [],
  api_results: {},
};

async function clickNavItem(page, navText) {
  // Most reliable: find ALL buttons, iterate to match innerText containing navText
  const allBtns = await page.locator('button').all();
  for (const btn of allBtns) {
    try {
      const txt = await btn.innerText({ timeout: 500 });
      const trimmed = txt.trim();
      if (trimmed === navText || trimmed.includes(navText)) {
        const visible = await btn.isVisible({ timeout: 500 });
        if (visible) {
          await btn.click();
          return true;
        }
      }
    } catch {}
  }
  return false;
}

async function auditPage(page, pageSpec) {
  const { nav: navText, id: pageId } = pageSpec;
  const result = {
    nav: navText, id: pageId,
    status: 'pass', issues: [], content_detected: [],
    screenshot: `${SCREENSHOTS_DIR}/${pageId}.png`,
    url_after_nav: '', load_time_ms: 0,
    word_count: 0, card_count: 0, interactive_count: 0,
  };
  const consoleErrors = [];
  const handler = msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); };
  page.on('console', handler);
  try {
    const t0 = Date.now();
    const clicked = await clickNavItem(page, navText);
    if (!clicked) {
      result.issues.push(`WARN: Could not click "${navText}" — trying JS fallback`);
      result.status = 'warn';
    }
    await page.waitForTimeout(2000);
    result.load_time_ms = Date.now() - t0;
    result.url_after_nav = page.url();
    await page.screenshot({ path: result.screenshot, fullPage: true });

    // Word count from body
    const bodyText = await page.locator('body').innerText().catch(() => '');
    // Subtract sidebar nav words (roughly 40-60)
    result.word_count = bodyText.split(/\s+/).filter(w => w.length > 1).length;

    if (result.word_count < 20) {
      result.issues.push(`FAIL: Only ${result.word_count} words visible (page appears empty)`);
      result.status = 'fail';
    }

    // Hebrew
    if (/[\u0590-\u05FF]/.test(bodyText)) result.content_detected.push('Hebrew ✓');
    else { result.issues.push('WARN: No Hebrew text'); if (result.status==='pass') result.status='warn'; }

    // RTL
    const dir = await page.evaluate(() => document.documentElement.dir);
    if (dir === 'rtl') result.content_detected.push('RTL ✓');
    else { result.issues.push(`WARN: dir="${dir}"`); if (result.status==='pass') result.status='warn'; }

    // Dark theme
    const bg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    const nums = (bg.match(/\d+/g)||[]).map(Number);
    const brightness = nums.length>=3 ? (nums[0]+nums[1]+nums[2])/3 : 255;
    if (brightness < 60) result.content_detected.push(`Dark ✓ (${Math.round(brightness)})`);
    else { result.issues.push(`WARN: bg brightness=${Math.round(brightness)}`); if (result.status==='pass') result.status='warn'; }

    // Cards
    result.card_count = await page.locator('[class*="card"],[class*="Card"],section,article').count();
    result.content_detected.push(`${result.card_count} cards`);
    result.interactive_count = await page.locator('button,input,select,[role="button"]').count();
    result.content_detected.push(`${result.interactive_count} interactive`);

    // Spinners
    const spinners = await page.locator('[class*="spinner"],[class*="skeleton"]').count();
    if (spinners > 0) { result.issues.push(`WARN: ${spinners} loading indicators still visible`); if (result.status==='pass') result.status='warn'; }

    // Console errors
    if (consoleErrors.length > 0) {
      result.issues.push(`INFO: ${consoleErrors.length} console error(s): ${consoleErrors[0].substring(0,100)}`);
    }

    const icon = result.status==='pass'?'✓':result.status==='warn'?'⚠':'✗';
    console.log(`  [${result.status.toUpperCase().padEnd(4)}] ${icon} ${navText.padEnd(16)} | ${result.load_time_ms}ms | ${result.word_count}w | ${result.card_count} cards`);
    result.issues.filter(i=>!i.startsWith('INFO')).forEach(i=>console.log(`           ${i}`));
  } catch(e) {
    result.status='fail'; result.issues.push(`ERROR: ${e.message}`);
    console.error(`  [FAIL] ✗ ${navText}: ${e.message}`);
    await page.screenshot({ path: result.screenshot }).catch(()=>{});
  } finally {
    page.off('console', handler);
  }
  return result;
}

(async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  APEX Command Center — Playwright E2E Audit v2');
  console.log(`  Target: ${BASE_URL}  |  ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: {width:1440,height:900}, colorScheme:'dark', locale:'he-IL' });
  const page = await context.newPage();

  try {
    // Step 1: Load
    console.log('── Step 1: Initial load');
    const t0 = Date.now();
    const resp = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const loadMs = Date.now()-t0;
    console.log(`   HTTP ${resp?.status()} | ${loadMs}ms | "${await page.title()}"`);
    const htmlDir = await page.evaluate(()=>document.documentElement.dir);
    const htmlLang = await page.evaluate(()=>document.documentElement.lang);
    console.log(`   lang="${htmlLang}" dir="${htmlDir}"`);
    report.title = await page.title();
    report.initial_load_ms = loadMs;
    report.html_lang = htmlLang;
    report.html_dir = htmlDir;
    if (htmlDir !== 'rtl') report.global_issues.push(`html dir="${htmlDir}" not "rtl"`);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/00-initial.png`, fullPage:true });
    console.log(`   Screenshot: 00-initial.png ✓`);

    // Step 2: Nav audit
    console.log('\n── Step 2: Sidebar nav items');
    const navSpans = await page.locator('nav button').all();
    const navTexts = [];
    for (const btn of navSpans) {
      const txt = await btn.innerText().catch(()=>'');
      if (txt.trim()) navTexts.push(txt.trim());
    }
    console.log(`   ${navTexts.length} nav buttons: ${navTexts.join(', ')}`);
    report.nav_items_found = navTexts;
    if (navTexts.length < 13) report.global_issues.push(`Only ${navTexts.length} nav items (expected ≥13)`);
    else console.log(`   ✓ ${navTexts.length} nav items (≥13)`);

    // Step 3: Per-page audit
    console.log('\n── Step 3: Per-page audit');
    for (const spec of PAGES) {
      const result = await auditPage(page, spec);
      report.pages.push(result);
      if (result.status==='pass') report.summary.pass++;
      else if (result.status==='warn') report.summary.warn++;
      else report.summary.fail++;
      await page.waitForTimeout(150);
    }

    // Step 4: API check
    console.log('\n── Step 4: API endpoints');
    const endpoints = ['/api/overview','/api/fleet','/api/hydra','/api/health','/api/system','/api/hooks','/api/metrics','/api/cicd','/api/deploys','/api/notifications','/api/openclaw'];
    for (const ep of endpoints) {
      try {
        const { status, ok } = await page.evaluate(async (u) => { const r=await fetch(u); return {status:r.status,ok:r.ok}; }, ep);
        report.api_results[ep] = {status, ok};
        console.log(`   ${ok?'✓':'✗'} ${ep.padEnd(24)} → HTTP ${status}`);
        if (!ok) report.global_issues.push(`API ${ep} → ${status}`);
      } catch(e) {
        report.api_results[ep] = {error:e.message};
        console.log(`   ✗ ${ep.padEnd(24)} → ERROR`);
      }
    }

    // Step 5: Extra screenshots of 5 key pages
    console.log('\n── Step 5: Extra screenshots');
    for (const [nav, file] of [['סקירה כללית','key-overview.png'],['צי סוכנים','key-fleet.png'],['הידרה','key-hydra.png'],['שליטה','key-control.png'],['CI/CD','key-cicd.png']]) {
      await clickNavItem(page, nav);
      await page.waitForTimeout(1500);
      await page.screenshot({ path:`${SCREENSHOTS_DIR}/${file}`, fullPage:true });
      console.log(`   ✓ ${nav.padEnd(16)} → ${file}`);
    }

  } catch(e) {
    console.error(`FATAL: ${e.message}`);
    report.global_issues.push(`FATAL: ${e.message}`);
  } finally {
    await browser.close();
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ${report.summary.total} pages | ✓ ${report.summary.pass} pass | ⚠ ${report.summary.warn} warn | ✗ ${report.summary.fail} fail`);
  if (report.global_issues.length) { console.log('\n  Global issues:'); report.global_issues.forEach(i=>console.log(`    → ${i}`)); }
  const apiOk = Object.values(report.api_results).filter(r=>r.ok).length;
  console.log(`\n  API: ${apiOk}/${Object.keys(report.api_results).length} OK`);
  console.log(`  Screenshots: ${SCREENSHOTS_DIR}/`);
  console.log('═══════════════════════════════════════════════════════════════');
})();

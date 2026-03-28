import { chromium } from "playwright";

const PAGES = [
  "overview","fleet","projects","agent-guide","hydra","dispatch-guide",
  "health","system","hardware","sync","hooks","rules-explorer","hooks-deep",
  "metrics","logs","control","automation","gsd-guide","cicd","ci-templates",
  "testing","bundles","deploys","domains","notifications","openclaw",
  "skills-guide","architecture","memory-guide","mcp-guide","security-guide","faq"
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:5173", { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(2000);

let pass = 0, fail = 0;
const issues = [];

for (const key of PAGES) {
  await page.evaluate((k) => window.__navigate?.(k), key);
  await page.waitForTimeout(400);

  const text = await page.evaluate(() => {
    const el = document.querySelector(".animate-fade-in") || document.querySelector("main") || document.body;
    return el.innerText || "";
  });
  
  const words = text.split(/\s+/).filter(Boolean).length;
  const loading = text.trim() === "טוען..." || (words < 5 && text.includes("טוען"));
  const empty = words < 3;
  
  if (loading || empty) {
    console.log(`❌ ${key.padEnd(20)} ${loading ? "LOADING" : "EMPTY"} (${words} words)`);
    issues.push(key);
    fail++;
  } else {
    console.log(`✅ ${key.padEnd(20)} OK (${words} words)`);
    pass++;
  }
}

console.log(`\n=== ${pass}/${PAGES.length} PASS | ${fail} FAIL ===`);
if (issues.length) console.log("Issues:", issues.join(", "));

await browser.close();
process.exit(fail > 0 ? 1 : 0);

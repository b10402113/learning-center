#!/usr/bin/env node
/** Multi-subject smoke test: subject switcher, lazy loading, deep link. */
import { chromium } from "playwright-core";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

const exe = path.join(
  os.homedir(),
  "Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
);
const BASE = process.env.BASE_URL || "http://localhost:4173";
const OUT = path.join(process.cwd(), "shots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: fs.existsSync(exe) ? exe : undefined,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

// 1. Default load → system-design
await page.goto(BASE, { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/8-subject-default.png` });

// 2. Switch subject via the select
await page.selectOption("nav select", "aws-v3");
await page.waitForSelector("text=AWS account and IAM", { timeout: 5000 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/9-subject-aws.png` });
console.log("hash after switch:", await page.evaluate(() => location.hash));

// 3. Open a content-written AWS node
await page.getByRole("button", { name: /AWS account and IAM/ }).first().click();
await page.waitForTimeout(300);
const readMore = page.getByText("閱讀更多 Read more");
if (await readMore.count()) {
  await readMore.first().click();
  await page.waitForTimeout(300);
}
await page.screenshot({ path: `${OUT}/10-aws-node-lesson.png` });

// 4. Deep link directly to a subject/node
await page.goto(`${BASE}/#/design-pattern/introduction`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/11-deeplink-design-pattern.png` });
console.log("deeplink hash:", await page.evaluate(() => location.hash));

// 5. Mobile drawer still works with switcher
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.getByLabel("開啟選單").click();
await mobile.waitForTimeout(350);
await mobile.screenshot({ path: `${OUT}/12-mobile-switcher.png` });
mobile.on("pageerror", (e) => errors.push(e.message));
await mobile.close();

if (errors.length) console.error("PAGE ERRORS:", errors);
else console.log("✔ no page errors");
await browser.close();
console.log(`✔ Screenshots saved to ${OUT}`);

#!/usr/bin/env node
/** Multi-subject smoke test: subject index, lazy loading, deep link. */
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

// 1. Default load → subject index
await page.goto(BASE, { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/8-subject-index.png` });

// 2. Open a subject by clicking its card
await page.getByRole("link", { name: /background agents/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/9-subject-background-agents.png` });
console.log("hash after card:", await page.evaluate(() => location.hash));

// 3. Open the first node
await page.getByRole("button", { name: /Background agent 是什麼/ }).first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/10-node-detail.png` });

// 4. Deep link directly to a subject/node
await page.goto(`${BASE}/#/agent-harness/what-a-harness-is`, {
  waitUntil: "networkidle",
});
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/11-deeplink-agent-harness.png` });
console.log("deeplink hash:", await page.evaluate(() => location.hash));

// 5. Mobile: index cards and the drawer's "all subjects" link
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.screenshot({ path: `${OUT}/12-mobile-index.png` });
await mobile.getByRole("link", { name: /agent harness/ }).first().click();
await mobile.waitForTimeout(600);
await mobile.getByLabel("開啟選單").click();
await mobile.waitForTimeout(350);
await mobile.screenshot({ path: `${OUT}/13-mobile-drawer.png` });
mobile.on("pageerror", (e) => errors.push(e.message));
await mobile.close();

if (errors.length) console.error("PAGE ERRORS:", errors);
else console.log("✔ no page errors");
await browser.close();
console.log(`✔ Screenshots saved to ${OUT}`);

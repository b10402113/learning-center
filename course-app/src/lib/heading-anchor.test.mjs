import test from "node:test";
import assert from "node:assert/strict";
import {
  extractHeadings,
  headingText,
  slugifyHeading,
  uniqueSlug,
} from "./heading-anchor.mjs";

test("slugifyHeading keeps CJK and normalises punctuation", () => {
  assert.equal(slugifyHeading("什麼是 Agent Harness？"), "什麼是-agent-harness");
  assert.equal(slugifyHeading("  多餘的   空白  "), "多餘的-空白");
  assert.equal(slugifyHeading("！？。"), "section");
  assert.equal(slugifyHeading("Step 2：資料流"), "step-2-資料流");
});

test("uniqueSlug numbers repeated headings", () => {
  const seen = new Map();
  assert.equal(uniqueSlug("agent", seen), "agent");
  assert.equal(uniqueSlug("agent", seen), "agent-2");
  assert.equal(uniqueSlug("agent", seen), "agent-3");
});

test("headingText strips inline Markdown", () => {
  assert.equal(headingText("**重點**與 `code`"), "重點與 code");
  assert.equal(headingText("[連結](https://example.com)"), "連結");
  assert.equal(headingText("[[agent|代理人]] 與 [[tool]]"), "代理人 與 tool");
  assert.equal(headingText("~~刪除~~"), "刪除");
});

test("extractHeadings keeps h2/h3, skips h1/h4 and fenced code", () => {
  const markdown = [
    "# 文章標題",
    "",
    "## 第一段",
    "",
    "```md",
    "## 程式碼裡的標題",
    "```",
    "",
    "### 子段 *斜體*",
    "",
    "#### 太深了",
    "",
    "## 第一段",
  ].join("\n");

  assert.deepEqual(extractHeadings(markdown), [
    { depth: 2, text: "第一段", id: "第一段" },
    { depth: 3, text: "子段 斜體", id: "子段-斜體" },
    { depth: 2, text: "第一段", id: "第一段-2" },
  ]);
});

test("extractHeadings ignores an unclosed heading and empty text", () => {
  assert.deepEqual(extractHeadings("##\n##   \n## 有內容"), [
    { depth: 2, text: "有內容", id: "有內容" },
  ]);
});

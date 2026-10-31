import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { protectArticle, runPolish, sha256, validatePolishedArticle } from "./polish-article.mjs";

process.env.TEXT_API_KEY = "test-key-0123456789abcdef";
process.env.TEXT_MODEL = "test-model";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const ARTICLE = `# First step

這是一段奇怪的文字。

<!--image:1-->

<!-- source: sources/demo/a.txt#L1-L2 -->

\`\`\`ts
const a = 1;
\`\`\`

請參考 [文件](https://example.com)。
`;

function articlePath(root, step = "one") {
  return join(root, "learn/demo/nodes/alpha", `${step}.md`);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "polish-article-"));
  write(
    root,
    "learn/demo/nodes/alpha.md",
    `---
id: alpha
title: "Alpha"
subject: demo
tier: 1
order: 1
status: written
goal: "Test node."
prerequisites: []
steps:
  - id: one
    title: "First step"
    purpose: "Explain the first thing."
    sources:
      - "[[sources/demo/a.txt#L1-L2]]"
created: 2026-10-22
updated: 2026-10-22
---

# Alpha
`,
  );
  write(root, "learn/demo/nodes/alpha/one.md", ARTICLE);
  write(root, "learn/demo/output/image-plans/alpha/one.json", "[]\n");
  write(root, "learn/demo/nodes/alpha/one.quiz.json", '{"quiz-generated":true,"questions":[]}\n');
  return root;
}

function fetchEcho(transform = (text) => text) {
  const calls = [];
  const fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    const user = body.messages.find((message) => message.role === "user").content;
    calls.push(user);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        id: "resp_1",
        choices: [{ message: { role: "assistant", content: transform(user) }, finish_reason: "stop" }],
      }),
    };
  };
  return { fetch, calls };
}

test("protectArticle masks structure and restores it unchanged", () => {
  const { text, restore } = protectArticle(ARTICLE);
  assert.ok(text.includes("{{POLISH_KEEP_0}}"));
  assert.ok(!text.includes("<!--image:1-->"));
  assert.ok(!text.includes("const a = 1;"));
  assert.ok(!text.includes("[文件](https://example.com)"));
  assert.equal(restore(text), ARTICLE);
  assert.doesNotThrow(() => validatePolishedArticle({ original: ARTICLE, next: restore(text) }));
});

test("changes the prose, keeps the structure, and records the hash", async () => {
  const root = fixture();
  const { fetch } = fetchEcho((text) => text.replace("奇怪的", "不順的"));
  const report = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: fetch });

  assert.equal(report.steps.length, 1);
  assert.equal(report.steps[0].status, "polished");
  assert.equal(report.steps[0].changed, true);
  const article = readFileSync(articlePath(root), "utf8");
  assert.match(article, /不順的文字/);
  assert.match(article, /<!--image:1-->/);
  assert.match(article, /const a = 1;/);
  assert.match(article, /^# First step$/m);
  assert.equal(existsSync(join(root, "learn/demo/nodes/alpha/one.quiz.json")), false);

  const record = JSON.parse(readFileSync(join(root, "learn/demo/output/polished/alpha/one.json"), "utf8"));
  assert.equal(record.article_sha256, sha256(article));
  assert.equal(record.changed, true);
  assert.equal(record.model, "test-model");
});

test("a second run skips a step whose record still matches", async () => {
  const root = fixture();
  const first = fetchEcho((text) => text.replace("奇怪的", "不順的"));
  await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: first.fetch });

  const second = fetchEcho(() => {
    throw new Error("model should not be called");
  });
  const report = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: second.fetch });
  assert.equal(report.skipped.length, 1);
  assert.equal(report.skipped[0].status, "skipped-record");
  assert.equal(second.calls.length, 0);
});

test("a broken result retries once, then fails without touching the article", async () => {
  const root = fixture();
  const before = readFileSync(articlePath(root), "utf8");
  const { fetch, calls } = fetchEcho((text) => text.replace(/\{\{POLISH_KEEP_\d+\}\}/g, ""));
  const report = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: fetch });

  assert.equal(calls.length, 2);
  assert.equal(report.failed.length, 1);
  assert.equal(report.failed[0].status, "failed");
  assert.match(report.failed[0].error, /H1|marker|code/i);
  assert.equal(readFileSync(articlePath(root), "utf8"), before);
  assert.equal(existsSync(join(root, "learn/demo/output/polished/alpha/one.json")), false);
});

test("an API failure records the step as failed instead of throwing", async () => {
  const root = fixture();
  const before = readFileSync(articlePath(root), "utf8");
  const fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({ error: { message: "invalid api key" } }),
  });
  const report = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: fetch });
  assert.equal(report.failed.length, 1);
  assert.match(report.failed[0].error, /401/);
  assert.equal(readFileSync(articlePath(root), "utf8"), before);
});

test("steps without a plan or without markers are skipped", async () => {
  const root = fixture();
  rmSync(join(root, "learn/demo/output/image-plans/alpha/one.json"));
  const { fetch, calls } = fetchEcho();
  const report = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: fetch });
  assert.equal(report.skipped[0].status, "skipped-no-plan");
  assert.equal(calls.length, 0);

  write(root, "learn/demo/output/image-plans/alpha/one.json", "[]\n");
  write(root, "learn/demo/nodes/alpha/one.md", "# First step\n\n沒有圖片標記的段落。\n");
  const second = await runPolish({ root, subject: "demo", node: "alpha", fetchImpl: fetch });
  assert.equal(second.skipped[0].status, "skipped-not-published");
});

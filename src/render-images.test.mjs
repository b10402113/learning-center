import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { renderImages } from "./render-images.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const plan = [
  { index: 1, heading: "First idea", anchor: "PLAN_ONLY_ONE", prompt: "draw the first idea" },
  { index: 2, heading: "Second idea", anchor: "PLAN_ONLY_TWO", prompt: "draw the second idea" },
];

const articleWithMarkers = `# Step One

Opening line.

<!--image:1-->

## Second idea

More prose.

<!--image:2-->
`;

function fixture(t, { article = articleWithMarkers, imagePlan = plan, body = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "render-images-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "prompts/image.txt", "Make one flat explainer figure.\n");
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: written
goal: "Explain one thing."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`);
  write(root, "learn/test/nodes/n1/s1.md", body ? article : "# Step One\n");
  if (imagePlan) {
    write(root, "learn/test/output/image-plans/n1/s1.json", JSON.stringify(imagePlan));
  }
  return root;
}

function deps(root, { failOn = null } = {}) {
  const calls = [];
  return {
    calls,
    root,
    imageTemplate: "Make one flat explainer figure.\n",
    generateImage: async ({ prompt, index }) => {
      calls.push({ prompt, index });
      if (index === failOn) throw new Error(`image ${index} failed`);
      return Buffer.from(`image-${index}`);
    },
    writeImage: async (target, bytes) => {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, bytes);
    },
  };
}

function article(root) {
  return readFileSync(join(root, "learn/test/nodes/n1/s1.md"), "utf8");
}

test("render turns markers into uncaptioned image lines and uses the plan prompt", async (t) => {
  const root = fixture(t);
  const d = deps(root);
  const report = await renderImages({ subject: "test", node: "n1" }, d);

  assert.equal(report.steps[0].status, "rendered");
  assert.equal(report.steps[0].markers, 2);
  assert.deepEqual(report.steps[0].images.map((image) => image.reused), [false, false]);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-2.webp")), true);

  const body = article(root);
  assert.match(body, /!\[第 1 段配圖\]\(\.\/s1-assets\/image-1\.webp\)/);
  assert.match(body, /!\[第 2 段配圖\]\(\.\/s1-assets\/image-2\.webp\)/);
  assert.doesNotMatch(body, /<!--image:/);
  assert.doesNotMatch(body, /\*AI 生成示意圖\*/);
  assert.equal(d.calls.length, 2);
  assert.match(d.calls[0].prompt, /FOCUS: draw the first idea/);
  assert.match(d.calls[1].prompt, /SECTION: Second idea/);
  assert.doesNotMatch(d.calls[0].prompt, /PLAN_ONLY_ONE/);
});

test("a second run reuses images without calling the model and leaves the article alone", async (t) => {
  const root = fixture(t);
  await renderImages({ subject: "test", node: "n1" }, deps(root));
  const before = article(root);
  const d = deps(root);
  const report = await renderImages({ subject: "test", node: "n1" }, d);

  assert.equal(report.steps[0].status, "already-rendered");
  assert.equal(report.steps[0].images.every((image) => image.reused), true);
  assert.equal(d.calls.length, 0);
  assert.equal(article(root), before);
});

test("--force repaints existing image files without moving image lines", async (t) => {
  const root = fixture(t);
  await renderImages({ subject: "test", node: "n1" }, deps(root));
  const before = article(root);
  const d = deps(root);
  const report = await renderImages({ subject: "test", node: "n1", force: true }, d);

  assert.equal(report.steps[0].status, "rendered");
  assert.equal(report.steps[0].markers, 0);
  assert.equal(d.calls.length, 2);
  assert.deepEqual(report.steps[0].images.map((image) => image.reused), [false, false]);
  assert.equal(article(root), before);
  assert.equal(readFileSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp"), "utf8"), "image-1");
});

test("--force repaints marker-backed images and keeps the same image line positions", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", "old-1");
  write(root, "learn/test/nodes/n1/s1-assets/image-2.webp", "old-2");
  const d = deps(root);
  const report = await renderImages({ subject: "test", node: "n1", force: true }, d);

  assert.equal(report.steps[0].status, "rendered");
  assert.equal(d.calls.length, 2);
  assert.match(article(root), /image-1\.webp[\s\S]*image-2\.webp/);
});

test("reuses existing figures and fills only the missing ones", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", "image-1");
  const d = deps(root);
  const report = await renderImages({ subject: "test", node: "n1" }, d);

  assert.equal(report.steps[0].status, "rendered");
  assert.deepEqual(report.steps[0].images.map((image) => [image.index, image.reused]), [
    [1, true],
    [2, false],
  ]);
  assert.deepEqual(d.calls.map((call) => call.index), [2]);
});

test("a marker count mismatch fails without touching the article", async (t) => {
  const root = fixture(t, {
    article: "# Step One\n\nOne.\n\n<!--image:1-->\n\nTwo.\n",
  });
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root));
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /do not match the plan/);
  assert.match(article(root), /<!--image:1-->/);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets")), false);
});

test("out-of-order markers fail without touching the article", async (t) => {
  const root = fixture(t, {
    article: "# Step One\n\nOne.\n\n<!--image:2-->\n\nTwo.\n\n<!--image:1-->\n",
  });
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root));
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /out of order/);
  assert.match(article(root), /<!--image:2-->/);
});

test("a step with no plan is skipped", async (t) => {
  const root = fixture(t, { imagePlan: null });
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root));
  assert.equal(report.steps[0].status, "no-plan");
});

test("a plan without markers or image lines fails as no-markers", async (t) => {
  const root = fixture(t, { article: "# Step One\n\nJust prose.\n" });
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root));
  assert.equal(report.steps[0].status, "no-markers");
  assert.equal(article(root), "# Step One\n\nJust prose.\n");
});

test("a single image failure keeps the markers and keeps the images already written", async (t) => {
  const root = fixture(t);
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root, { failOn: 2 }));
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /image 2 failed/);
  assert.match(article(root), /<!--image:1-->/);
  assert.match(article(root), /<!--image:2-->/);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-2.webp")), false);
});

test("a step without an article body is skipped", async (t) => {
  const root = fixture(t, { body: false });
  const report = await renderImages({ subject: "test", node: "n1" }, deps(root));
  assert.equal(report.steps[0].status, "no-article");
});

function recordFor(text) {
  return {
    humanized_at: "2026-10-27T00:00:00.000Z",
    article_sha256: createHash("sha256").update(text).digest("hex"),
    plan_sha256: "plan-hash",
    changed: true,
    summary: "kept",
  };
}

test("rendering refreshes a matching humanize record so the article stays skipped", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/humanized/n1/s1.json", JSON.stringify(recordFor(article(root))));
  await renderImages({ subject: "test", node: "n1" }, deps(root));

  const record = JSON.parse(readFileSync(join(root, "learn/test/output/humanized/n1/s1.json"), "utf8"));
  assert.equal(record.article_sha256, createHash("sha256").update(article(root)).digest("hex"));
  assert.equal(record.plan_sha256, "plan-hash");
});

test("rendering leaves a stale humanize record alone", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/humanized/n1/s1.json", JSON.stringify({ ...recordFor("old"), article_sha256: "stale" }));
  await renderImages({ subject: "test", node: "n1" }, deps(root));

  const record = JSON.parse(readFileSync(join(root, "learn/test/output/humanized/n1/s1.json"), "utf8"));
  assert.equal(record.article_sha256, "stale");
});

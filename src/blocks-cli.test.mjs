import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  blockIdsForNode,
  composeBlocks,
  imageBlocks,
  markBlocks,
  polishBlocks,
  prepareBlocks,
  publishBlocks,
  renderBlocks,
  writeConcept,
} from "./blocks-cli.mjs";

const SECTIONS = ["定義", "為什麼重要", "如何運作", "例子", "邊界與常見誤解", "進階"];
const NOTES = `${Array.from({ length: 20 }, (_, index) => `source line ${index + 1}`).join("\n")}\n`;

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

function blockFile({ body = "", status = "draft", author = null } = {}) {
  const authorLine = author ? `author: ${author}\n` : "";
  return `---
id: tool-calling
title: "Tool Calling（工具呼叫）"
label: "Tool Calling"
subject: test
type: concept
status: ${status}
summary: "模型輸出工具呼叫，harness 執行後把結果餵回模型。"
aliases: []
prerequisites: []
related: []
${authorLine}sources:
  - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-11-06
updated: 2026-11-06
---

${body}`;
}

function fullBody(sections = SECTIONS, title = "Tool Calling（工具呼叫）") {
  return `# ${title}\n\n${sections.map((section) => `## ${section}\n\nText.`).join("\n\n")}\n`;
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "blocks-cli-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "sources/test/notes.txt", NOTES);
  write(root, "learn/test/blocks/tool-calling.md", blockFile());
  return root;
}

test("prepare writes a material bundle from the block sources", (t) => {
  const root = fixture(t);
  const [result] = prepareBlocks({ root, subject: "test", ids: ["tool-calling"] });
  assert.equal(result.status, "ready");
  const material = JSON.parse(read(root, "learn/test/output/blocks/tool-calling/material.json"));
  assert.equal(material.title, "Tool Calling（工具呼叫）");
  assert.equal(material.type, "concept");
  assert.equal(material.sources.length, 1);
  assert.match(material.sources[0].text, /source line 1\b/);
});

test("compose writes a body whose H1 is the block title", async (t) => {
  const root = fixture(t);
  prepareBlocks({ root, subject: "test", ids: ["tool-calling"] });
  const results = await composeBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    deps: {
      prompt: "prompt",
      model: "fake-model",
      generateText: async () => `# Wrong Title\n\n${SECTIONS.map((s) => `## ${s}\n\nText.`).join("\n\n")}\n`,
    },
  });
  assert.equal(results[0].status, "composed");
  const original = read(root, "learn/test/output/blocks/tool-calling/original.md");
  assert.ok(original.startsWith("# Tool Calling（工具呼叫）\n"));
  const record = JSON.parse(read(root, "learn/test/output/blocks/tool-calling/compose.json"));
  assert.equal(record.model, "fake-model");
});

test("compose skips an existing body unless forced", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  prepareBlocks({ root, subject: "test", ids: ["tool-calling"] });
  const skipped = await composeBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    deps: { prompt: "p", generateText: async () => { throw new Error("should not be called"); } },
  });
  assert.equal(skipped[0].status, "skipped");

  const forced = await composeBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    force: true,
    deps: { prompt: "p", model: "m", generateText: async () => fullBody() },
  });
  assert.equal(forced[0].status, "composed");
});

test("compose refuses a reviewed block", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ status: "reviewed" }));
  prepareBlocks({ root, subject: "test", ids: ["tool-calling"] });
  const results = await composeBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    force: true,
    deps: { prompt: "p", generateText: async () => fullBody() },
  });
  assert.equal(results[0].status, "failed");
  assert.match(results[0].error, /reviewed/);
});

test("mark uses the existing body and needs a one-item plan", (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  const noPlan = markBlocks({ root, subject: "test", ids: ["tool-calling"] });
  assert.equal(noPlan[0].status, "failed");

  write(root, "learn/test/blocks/tool-calling.plan.json", JSON.stringify([{ prompt: "hero" }]));
  const marked = markBlocks({ root, subject: "test", ids: ["tool-calling"] });
  assert.equal(marked[0].status, "marked");
  assert.match(read(root, "learn/test/output/blocks/tool-calling/original.md"), /# Tool Calling（工具呼叫）\n\n<!--image:1-->\n\n## 定義/);

  assert.equal(markBlocks({ root, subject: "test", ids: ["tool-calling"] })[0].status, "marked");
});

test("publish writes the body back and records the compose model", (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  write(root, "learn/test/output/blocks/tool-calling/original.md", fullBody());
  write(
    root,
    "learn/test/output/blocks/tool-calling/compose.json",
    JSON.stringify({ model: "fake-model", status: "composed" }),
  );
  const [result] = publishBlocks({ root, subject: "test", ids: ["tool-calling"] });
  assert.equal(result.status, "published");
  const published = read(root, "learn/test/blocks/tool-calling.md");
  assert.match(published, /^# Tool Calling/m);
  assert.ok(published.includes("author: fake-model"));
  assert.ok(published.includes("## 進階"));
  assert.ok(published.includes("created: 2026-11-06"));
  assert.ok(!published.includes("T00:00:00.000Z"));

  const reviewed = fixture(t);
  write(reviewed, "learn/test/blocks/tool-calling.md", blockFile({ status: "reviewed", body: fullBody() }));
  write(reviewed, "learn/test/output/blocks/tool-calling/original.md", fullBody());
  assert.equal(publishBlocks({ root: reviewed, subject: "test", ids: ["tool-calling"] })[0].status, "failed");
});

test("render turns the marker into one webp and reuses it afterwards", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: "# Tool Calling（工具呼叫）\n\n<!--image:1-->\n\n## 定義\n\nText.\n" }));
  write(root, "learn/test/blocks/tool-calling.plan.json", JSON.stringify([{ heading: "定義", prompt: "hero" }]));

  const calls = [];
  const deps = {
    imageTemplate: "template",
    generateImage: async (input) => {
      calls.push(input);
      return Buffer.from("image");
    },
    writeImage: async (target, bytes) => {
      write(root, target.slice(root.length + 1), bytes);
    },
  };

  const first = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(first[0].status, "rendered");
  assert.equal(calls.length, 1);
  assert.match(calls[0].prompt, /SECTION: 定義/);
  assert.match(calls[0].prompt, /FOCUS: hero/);
  assert.match(read(root, "learn/test/blocks/tool-calling.md"), /!\[概念示意圖\]\(\.\/tool-calling-assets\/image-1\.webp\)/);

  const second = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(second[0].status, "already-rendered");
  assert.equal(calls.length, 1);

  const forced = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], force: true, deps });
  assert.equal(forced[0].status, "rendered");
  assert.equal(calls.length, 2);
});

test("render regenerates a missing image and inserts the line when absent", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  write(root, "learn/test/blocks/tool-calling.plan.json", JSON.stringify([{ prompt: "hero" }]));
  let calls = 0;
  const deps = {
    imageTemplate: "t",
    generateImage: async () => {
      calls += 1;
      return Buffer.from("image");
    },
    writeImage: async (target, bytes) => write(root, target.slice(root.length + 1), bytes),
  };
  const [first] = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(first.status, "rendered");
  assert.match(read(root, "learn/test/blocks/tool-calling.md"), /!\[概念示意圖\]\(\.\/tool-calling-assets\/image-1\.webp\)/);
  assert.match(read(root, "learn/test/blocks/tool-calling.md"), /# Tool Calling（工具呼叫）\n\n!\[概念示意圖\]/);

  rmSync(join(root, "learn/test/blocks/tool-calling-assets"), { recursive: true, force: true });
  const [second] = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(second.status, "rendered");
  assert.equal(calls, 2);
  const lines = read(root, "learn/test/blocks/tool-calling.md").match(/!\[概念示意圖\]/g) ?? [];
  assert.equal(lines.length, 1);
});

test("render refuses a reviewed block without force", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ status: "reviewed", body: fullBody() }));
  write(root, "learn/test/blocks/tool-calling.plan.json", JSON.stringify([{ prompt: "hero" }]));
  const deps = { imageTemplate: "t", generateImage: async () => Buffer.from("x"), writeImage: async () => {} };
  const [result] = await renderBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(result.status, "failed");
  assert.match(result.error, /reviewed/);
});

test("polish keeps the six sections and falls back to a copy on a broken rewrite", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/blocks/tool-calling/original.md", fullBody());

  const ok = await polishBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    deps: { polishText: async (text) => text.replace(/Text\./g, "更白話的說明。") },
  });
  assert.equal(ok[0].status, "polished");
  assert.match(read(root, "learn/test/output/blocks/tool-calling/polish.md"), /更白話的說明/);

  const broken = await polishBlocks({
    root,
    subject: "test",
    ids: ["tool-calling"],
    deps: { polishText: async (text) => text.replace("## 定義", "## 定義與範圍") },
  });
  assert.equal(broken[0].status, "copied");
  assert.equal(broken[0].fallback, true);
  assert.equal(read(root, "learn/test/output/blocks/tool-calling/polish.md"), fullBody());
});

function writeFixture(t) {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: written
goal: "Do one thing."
digests: []
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-11-06
updated: 2026-11-06
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`,
  );
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nTool calling means the model emits a call and the harness runs it.\n");
  write(
    root,
    "learn/test/output/blocks/n1.audit.json",
    JSON.stringify(
      {
        node: "n1",
        concepts: [
          {
            slug: "tool-calling",
            label: "Tool Calling",
            type: "concept",
            summary: "模型輸出工具呼叫，harness 執行後把結果餵回模型。",
            steps: ["s1"],
            sources: ["[[sources/test/notes.txt#L1-L10]]"],
            match: { kind: "new" },
          },
        ],
      },
      null,
      2,
    ),
  );
  rmSync(join(root, "learn/test/blocks/tool-calling.md"), { force: true });
  return root;
}

test("write reads related step articles and creates the block without material", async (t) => {
  const root = writeFixture(t);
  const calls = [];
  const result = await writeConcept({
    root,
    subject: "test",
    node: "n1",
    block: "tool-calling",
    deps: {
      prompt: "ELI5 prompt",
      model: "fake-model",
      generateText: async (input) => {
        calls.push(input);
        return fullBody();
      },
    },
  });
  assert.equal(result.status, "composed");
  assert.equal(calls.length, 1);
  assert.match(calls[0].user, /Tool calling means the model emits a call/);
  assert.doesNotMatch(calls[0].user, /material/);
  assert.match(read(root, "learn/test/blocks/tool-calling.md"), /^# Tool Calling$/m);
  assert.match(read(root, "learn/test/nodes/n1.md"), /blocks:\n      - tool-calling/);
});

test("write reuses an existing block and only links the step", async (t) => {
  const root = writeFixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  const result = await writeConcept({
    root,
    subject: "test",
    node: "n1",
    block: "tool-calling",
    deps: { generateText: async () => { throw new Error("should not compose"); } },
  });
  assert.equal(result.status, "linked");
  assert.match(read(root, "learn/test/nodes/n1.md"), /blocks:\n      - tool-calling/);
});

test("image sends the concept markdown to the provider and places one figure", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/blocks/tool-calling.md", blockFile({ body: fullBody() }));
  const calls = [];
  const deps = {
    imageTemplate: "IMAGES FROM CONCEPT",
    generateImage: async (input) => {
      calls.push(input);
      return Buffer.from("image");
    },
    writeImage: async (target, bytes) => write(root, target.slice(root.length + 1), bytes),
  };
  const [first] = await imageBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(first.status, "rendered");
  assert.match(calls[0].prompt, /IMAGES FROM CONCEPT/);
  assert.match(calls[0].prompt, /## 定義/);
  assert.match(read(root, "learn/test/blocks/tool-calling.md"), /!\[概念示意圖\]\(\.\/tool-calling-assets\/image-1\.webp\)/);

  const [second] = await imageBlocks({ root, subject: "test", ids: ["tool-calling"], deps });
  assert.equal(second.status, "already-rendered");
  assert.equal(calls.length, 1);
});

test("image runs up to maxParallel blocks at once, three by default", async (t) => {
  const root = fixture(t);
  const ids = ["b1", "b2", "b3", "b4", "b5"];
  for (const id of ids) {
    const sections = fullBody().split("\n").slice(2).join("\n");
    write(
      root,
      `learn/test/blocks/${id}.md`,
      `---
id: ${id}
title: "${id}"
label: "${id}"
subject: test
type: concept
status: draft
summary: "x."
sources:
  - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-11-06
updated: 2026-11-06
---

# ${id}

${sections}
`,
    );
  }

  let active = 0;
  let peak = 0;
  const deps = {
    imageTemplate: "t",
    generateImage: async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
      return Buffer.from("image");
    },
    writeImage: async (target, bytes) => write(root, target.slice(root.length + 1), bytes),
  };

  const results = await imageBlocks({ root, subject: "test", ids, deps });
  assert.equal(results.length, 5);
  assert.ok(results.every((result) => result.status === "rendered"));
  assert.equal(peak, 3);

  active = 0;
  peak = 0;
  const limited = await imageBlocks({ root, subject: "test", ids, maxParallel: 2, force: true, deps });
  assert.equal(limited.length, 5);
  assert.equal(peak, 2);
});

test("blockIdsForNode collects the existing blocks linked from its steps", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
status: written
steps:
  - id: s1
    blocks:
      - tool-calling
      - missing-block
  - id: s2
    blocks:
      - tool-calling
---

# Node One
`,
  );
  assert.deepEqual(blockIdsForNode(root, "test", "n1"), ["tool-calling"]);
});

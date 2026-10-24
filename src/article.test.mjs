import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { runChecks } from "../scripts/verify.mjs";
import {
  buildArticleMessages,
  countArticleCharacters,
  expectedImageCount,
  insertImageMarkers,
  normalizeArticleText,
  normalizeImagePlan,
  readStepSlices,
  replaceImageMarkers,
  runArticle,
  runImages,
} from "./article.mjs";

const NOTES = Array.from({ length: 20 }, (_, index) => `source line ${index + 1}`).join("\n") + "\n";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "article-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  write(root, "sources/test/notes.txt", NOTES);
  write(root, "learn/test/digests/notes.md", `---
source: sources/test/notes.txt
source_type: text
source_lines: 20
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Notes for the fixture.

# L2 detail

- \`#L1-L10\` — first half
- \`#L11-L20\` — second half
`);
  write(root, "learn/test/ROADMAP.md", `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`);
  write(root, "prompts/article.txt", "Write one article from the given sources.");
  write(root, "prompts/image.txt", "Draw one flat explainer figure.");
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Explain the thing."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
  - id: s2
    title: "Step Two"
    purpose: "Explain another thing."
    sources:
      - "[[sources/test/notes.txt#L11-L20]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
2. [Step Two](n1/s2.md)
`);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n");
  write(root, "learn/test/nodes/n1/s2.md", "# Step Two\n");
  return root;
}

function article(title, body = "") {
  return `# ${title}

Opening from a reader's situation.

## A Section

${body || "The body explains the thing with enough detail to be useful."}

<!-- derived -->
\`\`\`js
const answer = 42;
\`\`\`

See [[sources/test/notes.txt#L1-L10]] for the source.
`;
}

test("counts Traditional Chinese characters and ignores fenced code", () => {
  const markdown = `# 標題\n\n${"字".repeat(100)}\n\n\`\`\`js\nconst 字 = 1;\n\`\`\`\n`;
  assert.equal(countArticleCharacters(markdown), 102);
});

test("existing generated images do not change the image count", () => {
  const prose = "# 標題\n\n" + "字".repeat(895) + "\n";
  const withImage =
    prose +
    "\n![第 1 段配圖](./s1-assets/image-1.webp)\n*AI 生成示意圖*\n";
  assert.equal(expectedImageCount(prose), 1);
  assert.equal(expectedImageCount(withImage), 1);
});

test("chooses the image count from the article length", () => {
  assert.equal(expectedImageCount("字".repeat(899)), 1);
  assert.equal(expectedImageCount("字".repeat(900)), 2);
  assert.equal(expectedImageCount("字".repeat(1499)), 2);
  assert.equal(expectedImageCount("字".repeat(1500)), 3);
  assert.equal(expectedImageCount("字".repeat(2100)), 4);
  assert.equal(expectedImageCount("字".repeat(2700)), 5);
});

test("reads line-addressed source slices", (t) => {
  const root = fixture(t);
  const slices = readStepSlices(root, {
    id: "s1",
    sources: ["[[sources/test/notes.txt#L1-L3]]"],
  });
  assert.deepEqual(slices, [
    {
      path: "sources/test/notes.txt",
      locator: "#L1-L3",
      text: "source line 1\nsource line 2\nsource line 3",
    },
  ]);
});

test("refuses to cite a PDF", (t) => {
  const root = fixture(t);
  write(root, "sources/test/paper.pdf", "%PDF-1.4\n");
  assert.throws(
    () =>
      readStepSlices(root, {
        id: "s1",
        sources: ["[[sources/test/paper.pdf#L1-L2]]"],
      }),
    /PDF/,
  );
});

test("builds one system prompt and one JSON user message", () => {
  const messages = buildArticleMessages({
    prompt: "SYSTEM",
    entry: { title: "Step One", purpose: "Explain one thing." },
    slices: [{ path: "sources/test/notes.txt", locator: "#L1-L2", text: "a\nb" }],
  });
  assert.equal(messages.system, "SYSTEM");
  const payload = JSON.parse(messages.user);
  assert.equal(payload.title, "Step One");
  assert.equal(payload.purpose, "Explain one thing.");
  assert.equal(payload.sources[0].locator, "#L1-L2");
});

test("normalizes a model response to one H1 equal to the title", () => {
  assert.equal(
    normalizeArticleText("Some prose.\n", "Step One"),
    "# Step One\n\nSome prose.\n",
  );
  assert.equal(
    normalizeArticleText("# Wrong\n\nSome prose.\n", "Step One"),
    "# Step One\n\nSome prose.\n",
  );
});

test("generates one text call per missing article and skips existing bodies", async (t) => {
  const root = fixture(t);
  const calls = [];
  const generated = await runArticle(
    { subject: "test", node: "n1" },
    {
      root,
      generateText: async ({ user }) => {
        calls.push(JSON.parse(user).title);
        return "Some prose.\n";
      },
    },
  );

  assert.deepEqual(
    generated.steps.map((step) => step.status),
    ["generated", "generated"],
  );
  assert.deepEqual(calls, ["Step One", "Step Two"]);
  assert.equal(read(root, "learn/test/nodes/n1/s1.md"), "# Step One\n\nSome prose.\n");
  assert.match(read(root, "learn/test/nodes/n1.md"), /^status: written$/m);

  const second = await runArticle(
    { subject: "test", node: "n1" },
    { root, generateText: async () => assert.fail("must not call the model") },
  );
  assert.deepEqual(
    second.steps.map((step) => step.status),
    ["skipped", "skipped"],
  );
});

test("--force regenerates an existing article and --step scopes the run", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", article("Step One"));

  const result = await runArticle(
    { subject: "test", node: "n1", step: "s1", force: true },
    { root, generateText: async () => "Fresh prose.\n" },
  );

  assert.deepEqual(result.steps, [
    { id: "s1", title: "Step One", status: "generated", path: "learn/test/nodes/n1/s1.md" },
  ]);
  assert.match(read(root, "learn/test/nodes/n1/s1.md"), /Fresh prose/);
  assert.equal(read(root, "learn/test/nodes/n1/s2.md"), "# Step Two\n");
});

test("normalizes an image plan to exactly the requested count", () => {
  const plan = normalizeImagePlan(
    JSON.stringify([
      { heading: "A", anchor: "one", prompt: "first" },
      { heading: "B", anchor: "two", prompt: "second" },
    ]),
    2,
  );
  assert.deepEqual(plan.map((item) => item.index), [1, 2]);
  assert.equal(normalizeImagePlan([{ prompt: "only" }], 2).length, 2);
  assert.equal(normalizeImagePlan([{ heading: "## Section" }], 1)[0].heading, "Section");
  assert.throws(() => normalizeImagePlan("not json", 1), /JSON/);
});

test("inserts markers after the anchored paragraph and replaces them with figures", () => {
  const markdown = `# Title

First paragraph has an anchor sentence.

Second paragraph is here.

Third paragraph is here.
`;
  const marked = insertImageMarkers(markdown, [
    { index: 1, heading: "", anchor: "anchor sentence", prompt: "first" },
    { index: 2, heading: "", anchor: "Second paragraph", prompt: "second" },
  ]);
  assert.match(marked, /anchor sentence\.\n\n<!--image:1-->/);
  assert.match(marked, /Second paragraph is here\.\n\n<!--image:2-->/);

  const final = replaceImageMarkers(marked, "s1");
  assert.match(final, /!\[第 1 段配圖\]\(\.\/s1-assets\/image-1\.webp\)\n\*AI 生成示意圖\*/);
  assert.match(final, /!\[第 2 段配圖\]\(\.\/s1-assets\/image-2\.webp\)\n\*AI 生成示意圖\*/);
});

test("image mode plans and generates once, then reuses on a second run", async (t) => {
  const root = fixture(t);
  const prose = `# Step One\n\n${"字".repeat(905)}\n\nSecond paragraph anchor.\n`;
  write(root, "learn/test/nodes/n1/s1.md", prose);

  let planCalls = 0;
  let imageCalls = 0;
  const deps = {
    planImages: async () => {
      planCalls += 1;
      return [
        { heading: "", anchor: "字".repeat(20), prompt: "first" },
        { heading: "", anchor: "Second paragraph anchor.", prompt: "second" },
      ];
    },
    generateImage: async ({ prompt }) => {
      imageCalls += 1;
      return Buffer.from(`image:${prompt}`);
    },
    writeImage: async (target, bytes) => {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, bytes);
    },
  };

  const first = await runImages(
    { subject: "test", node: "n1", step: "s1" },
    { root, ...deps },
  );
  assert.equal(first.steps[0].status, "generated");
  assert.equal(first.steps[0].images.length, 2);
  assert.equal(planCalls, 1);
  assert.equal(imageCalls, 2);
  const written = read(root, "learn/test/nodes/n1/s1.md");
  assert.match(written, /image-1\.webp/);
  assert.match(written, /image-2\.webp/);

  const second = await runImages(
    { subject: "test", node: "n1", step: "s1" },
    {
      root,
      planImages: async () => assert.fail("must not replan"),
      generateImage: async () => assert.fail("must not regenerate"),
      writeImage: async () => assert.fail("must not rewrite"),
    },
  );
  assert.equal(second.steps[0].status, "reused");
  assert.equal(second.steps[0].images.length, 2);

  await runImages(
    { subject: "test", node: "n1", step: "s1", force: true },
    { root, ...deps },
  );
  assert.equal(planCalls, 1);
  assert.equal(imageCalls, 4);
});

test("image plans can be reviewed before any image is generated", async (t) => {
  const root = fixture(t);
  const prose = `# Step One\n\n${"字".repeat(905)}\n\nSecond paragraph anchor.\n`;
  write(root, "learn/test/nodes/n1/s1.md", prose);
  const planFile = "learn/test/output/image-plans/n1/s1.json";

  let planCalls = 0;
  const planned = await runImages(
    { subject: "test", node: "n1", step: "s1", planOnly: true },
    {
      root,
      planImages: async () => {
        planCalls += 1;
        return [
          { heading: "", anchor: "字".repeat(20), prompt: "first" },
          { heading: "", anchor: "Second paragraph anchor.", prompt: "second" },
        ];
      },
    },
  );
  assert.equal(planned.steps[0].status, "planned");
  assert.equal(planned.steps[0].plan.length, 2);
  assert.equal(planned.steps[0].file, planFile);
  assert.equal(planCalls, 1);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), false);
  assert.equal(read(root, "learn/test/nodes/n1/s1.md"), prose);

  const reviewed = JSON.parse(read(root, planFile));
  reviewed[1].prompt = "edited prompt";
  write(root, planFile, JSON.stringify(reviewed));

  const prompts = [];
  const generated = await runImages(
    { subject: "test", node: "n1", step: "s1" },
    {
      root,
      planImages: async () => assert.fail("must reuse the reviewed plan"),
      generateImage: async ({ prompt }) => {
        prompts.push(prompt);
        return Buffer.from("image");
      },
      writeImage: async (target, bytes) => {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, bytes);
      },
    },
  );
  assert.equal(generated.steps[0].status, "generated");
  assert.equal(prompts.length, 2);
  assert.match(prompts[1], /edited prompt/);
  assert.equal(read(root, planFile), JSON.stringify(reviewed));

  await runImages(
    { subject: "test", node: "n1", step: "s1", planOnly: true, force: true },
    {
      root,
      planImages: async () => {
        planCalls += 1;
        return [{ prompt: "fresh" }];
      },
    },
  );
  assert.equal(planCalls, 2);
});

test("image mode reuses an existing image file", async (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", `# Step One\n\n${"字".repeat(905)}\n\nSecond paragraph anchor.\n`);
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", "existing");

  let imageCalls = 0;
  await runImages(
    { subject: "test", node: "n1", step: "s1" },
    {
      root,
      planImages: async () => [
        { anchor: "字".repeat(20), prompt: "first" },
        { anchor: "Second paragraph anchor.", prompt: "second" },
      ],
      generateImage: async () => {
        imageCalls += 1;
        return Buffer.from("new");
      },
      writeImage: async (target, bytes) => {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, bytes);
      },
    },
  );

  assert.equal(imageCalls, 1);
  assert.equal(read(root, "learn/test/nodes/n1/s1-assets/image-1.webp"), "existing");
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-2.webp")), true);
});

test("image mode does nothing for an unwritten step", async (t) => {
  const root = fixture(t);
  const result = await runImages(
    { subject: "test", node: "n1", step: "s1" },
    {
      root,
      planImages: async () => assert.fail("must not plan"),
      generateImage: async () => assert.fail("must not generate"),
      writeImage: async () => assert.fail("must not write"),
    },
  );
  assert.equal(result.steps[0].status, "no-article");
});

function webpBytes() {
  return Buffer.concat([Buffer.from("RIFF"), Buffer.from([16, 0, 0, 0]), Buffer.from("WEBP"), Buffer.from("VP8 ")]);
}

test("generated articles and images pass verify", async (t) => {
  const root = fixture(t);
  await runArticle(
    { subject: "test", node: "n1" },
    {
      root,
      generateText: async ({ user }) => {
        const { title } = JSON.parse(user);
        return article(title);
      },
    },
  );

  await runImages(
    { subject: "test", node: "n1" },
    {
      root,
      planImages: async () => [{ anchor: "Opening from a reader's situation.", prompt: "one figure" }],
      generateImage: async () => webpBytes(),
      writeImage: async (target, bytes) => {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, bytes);
      },
    },
  );

  const result = runChecks({ root, subject: "test" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

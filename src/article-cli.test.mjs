import assert from "node:assert/strict";
import { execFile, execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const CLI = resolve("src/article-cli.mjs");
const execFileAsync = promisify(execFile);

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "article-cli-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "prompts/article.txt", "# System\n\nWrite the article.\n");
  write(root, "sources/test/notes.txt", `${Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n")}\n`);
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Explain one thing."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "First step."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
  - id: s2
    title: "Step Two"
    purpose: "Second step."
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
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nExisting body.\n");
  write(root, "learn/test/nodes/n1/s2.md", "# Step Two\n");
  return root;
}

test("prepare asks publishers for markers only and reports skipped steps without image state", (t) => {
  const root = fixture(t);
  const report = JSON.parse(
    execFileSync(
      process.execPath,
      [CLI, "prepare", "--subject", "test", "--node", "n1", "--root", root],
      { encoding: "utf8" },
    ),
  );
  assert.equal(report.steps.length, 1);
  const [step] = report.steps;
  assert.equal(step.id, "s2");
  assert.equal(report.nodeFile, join(root, "learn/test/nodes/n1.md"));
  assert.equal(report.teachingPlan, join(root, "learn/test/output/n1/teaching-plan.md"));
  assert.match(step.composeCommand, /article-cli\.mjs compose/);
  assert.match(step.markCommand, /article-cli\.mjs mark/);
  assert.doesNotMatch(step.polishCommand, /--copy/);
  assert.equal(step.material, "learn/test/output/n1/s2/material.json");
  assert.equal(step.original, "learn/test/output/n1/s2/original.md");
  assert.equal(step.polish, "learn/test/output/n1/s2/polish.md");
  assert.equal(step.plan, "learn/test/nodes/n1/s2.plan.json");
  assert.deepEqual(report.skipped, [
    {
      id: "s1",
      title: "Step One",
      purpose: "First step.",
      status: "skipped",
      path: "learn/test/nodes/n1/s1.md",
      article: join(root, "learn/test/nodes/n1/s1.md"),
    },
  ]);
});

test("prepare --skip-polish asks for a copy draft instead of a polish call", (t) => {
  const root = fixture(t);
  const report = JSON.parse(
    execFileSync(
      process.execPath,
      [CLI, "prepare", "--subject", "test", "--node", "n1", "--skip-polish", "--root", root],
      { encoding: "utf8" },
    ),
  );
  const [step] = report.steps;
  assert.match(step.polishCommand, /polish-article\.mjs draft/);
  assert.match(step.polishCommand, / --copy$/);
  assert.match(step.composeCommand, /article-cli\.mjs compose/);
});

test("render accepts --step and --max-parallel and skips a step with no plan", (t) => {
  const root = fixture(t);
  const run = spawnSync(
    process.execPath,
    [
      CLI,
      "render",
      "--subject",
      "test",
      "--node",
      "n1",
      "--step",
      "s1",
      "--max-parallel",
      "3",
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.mode, "render");
  assert.equal(report.steps.length, 1);
  assert.equal(report.steps[0].id, "s1");
  assert.equal(report.steps[0].status, "no-plan");
});

test("prepare --force clears stale run metadata and the original but keeps the plan", (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/n1/s1/original.md", "# Old\n");
  write(root, "learn/test/output/n1/s1/polish.md", "# Old\n");
  write(root, "learn/test/output/n1/s1/result.json", "{}");
  write(root, "learn/test/output/n1/s1/compose.json", "{}");
  write(root, "learn/test/nodes/n1/s1.plan.json", "[]");
  execFileSync(
    process.execPath,
    [CLI, "prepare", "--subject", "test", "--node", "n1", "--step", "s1", "--force", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/original.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/polish.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/result.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/compose.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/material.json")), true);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1.plan.json")), true);
});

test("mark inserts <!--image:N--> markers from the plan into original.md", (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/n1/s2/original.md", "# Step Two\n\n第一段。\n\n第二段。\n");
  write(
    root,
    "learn/test/nodes/n1/s2.plan.json",
    JSON.stringify([
      { heading: "", prompt: "概念示意一" },
      { heading: "", prompt: "概念示意二" },
    ]),
  );
  const run = spawnSync(
    process.execPath,
    [CLI, "mark", "--subject", "test", "--node", "n1", "--step", "s2", "--root", root],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.mode, "mark");
  assert.equal(report.steps[0].status, "marked");
  assert.equal(report.steps[0].markers, 2);
  const body = readFileSync(join(root, "learn/test/output/n1/s2/original.md"), "utf8");
  assert.match(body, /<!--image:1-->/);
  assert.match(body, /<!--image:2-->/);
});

test("mark fails when original.md is missing", (t) => {
  const root = fixture(t);
  const run = spawnSync(
    process.execPath,
    [CLI, "mark", "--subject", "test", "--node", "n1", "--step", "s2", "--root", root],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /run compose first/);
});

test("compose rejects material without curated text before calling the model", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/output/n1/s2/material.json",
    JSON.stringify({
      subject: "test",
      node: "n1",
      step: "s2",
      title: "Step Two",
      purpose: "Second step.",
      sources: [{ path: "sources/test/notes.txt", locator: "#L11-L20" }],
    }),
  );
  const run = spawnSync(
    process.execPath,
    [CLI, "compose", "--subject", "test", "--node", "n1", "--step", "s2", "--root", root],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /no curated text/);
});

test("compose replaces code placeholders with verbatim code and provenance", async (t) => {
  const root = fixture(t);
  write(root, "sources/test/loop.mjs", "export function loop() { return 1; }\n");
  write(
    root,
    "learn/test/output/n1/s2/material.json",
    JSON.stringify({
      subject: "test",
      node: "n1",
      step: "s2",
      title: "Step Two",
      purpose: "Second step.",
      sources: [
        {
          path: "sources/test/loop.mjs",
          locator: "#L1-L1",
          type: "code",
          language: "javascript",
          text: "export function loop() { return 1; }",
        },
      ],
    }),
  );

  let calls = 0;
  const server = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      calls += 1;
      const payload = JSON.parse(JSON.parse(body).messages.at(-1).content);
      assert.equal(payload.sources[0].placeholder, "{{ARTICLE_CODE_1}}");
      response.setHeader("content-type", "application/json");
      response.end(
        JSON.stringify({
          choices: [
            {
              message: {
                role: "assistant",
                content: "# Step Two\n\nBefore.\n\n{{ARTICLE_CODE_1}}\n\nAfter.\n",
              },
              finish_reason: "stop",
            },
          ],
        }),
      );
    });
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  t.after(() => new Promise((resolveClose) => server.close(resolveClose)));
  const { port } = server.address();

  const { stdout } = await execFileAsync(
    process.execPath,
    [CLI, "compose", "--subject", "test", "--node", "n1", "--step", "s2", "--root", root],
    {
      env: {
        ...process.env,
        TEXT_API_KEY: "test-key",
        TEXT_BASE_URL: `http://127.0.0.1:${port}/v1`,
        TEXT_MODEL: "test-model",
      },
    },
  );
  const report = JSON.parse(stdout);
  assert.equal(report.steps[0].status, "composed");
  assert.equal(calls, 1);

  const original = readFileSync(join(root, "learn/test/output/n1/s2/original.md"), "utf8");
  assert.match(original, /<!-- source: sources\/test\/loop\.mjs#L1-L1 -->/);
  assert.match(original, /```javascript\nexport function loop\(\) \{ return 1; \}\n```/);
  assert.doesNotMatch(original, /\{\{ARTICLE_CODE/);

  const compose = JSON.parse(readFileSync(join(root, "learn/test/output/n1/s2/compose.json"), "utf8"));
  assert.equal(compose.model, "test-model");
  assert.match(compose.composed_at, /^\d{4}-\d{2}-\d{2}T/);
});

test("compose keeps a salvageable draft when the model drops every placeholder", async (t) => {
  const root = fixture(t);
  write(root, "sources/test/loop.mjs", "export function loop() { return 1; }\n");
  write(
    root,
    "learn/test/output/n1/s2/material.json",
    JSON.stringify({
      subject: "test",
      node: "n1",
      step: "s2",
      title: "Step Two",
      purpose: "Second step.",
      sources: [
        {
          path: "sources/test/loop.mjs",
          locator: "#L1-L1",
          type: "code",
          language: "javascript",
          text: "export function loop() { return 1; }",
        },
      ],
    }),
  );

  const calls = [];
  const server = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const payload = JSON.parse(JSON.parse(body).messages.at(-1).content);
      calls.push(payload);
      response.setHeader("content-type", "application/json");
      response.end(
        JSON.stringify({
          choices: [
            {
              message: { role: "assistant", content: "# Step Two\n\nBefore.\n\nAfter.\n" },
              finish_reason: "stop",
            },
          ],
        }),
      );
    });
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  t.after(() => new Promise((resolveClose) => server.close(resolveClose)));
  const { port } = server.address();

  const { stdout } = await execFileAsync(
    process.execPath,
    [CLI, "compose", "--subject", "test", "--node", "n1", "--step", "s2", "--root", root],
    {
      env: {
        ...process.env,
        TEXT_API_KEY: "test-key",
        TEXT_BASE_URL: `http://127.0.0.1:${port}/v1`,
        TEXT_MODEL: "test-model",
      },
    },
  );
  const report = JSON.parse(stdout);
  assert.equal(report.steps[0].status, "draft");
  assert.equal(report.steps[0].retries, 2);
  assert.equal(report.steps[0].missing.length, 1);
  assert.equal(report.steps[0].missing[0].placeholder, "{{ARTICLE_CODE_1}}");
  assert.equal(calls.length, 3);
  assert.equal(calls[1].retry.missing_placeholders[0], "{{ARTICLE_CODE_1}}");
  assert.match(calls[1].retry.draft, /Before\./);

  const original = readFileSync(join(root, "learn/test/output/n1/s2/original.md"), "utf8");
  assert.match(original, /# Step Two/);
  assert.match(original, /Before\./);
  assert.doesNotMatch(original, /\{\{ARTICLE_CODE/);

  const compose = JSON.parse(readFileSync(join(root, "learn/test/output/n1/s2/compose.json"), "utf8"));
  assert.equal(compose.status, "draft");
  assert.equal(compose.missing[0].placeholder, "{{ARTICLE_CODE_1}}");
});

test("compose rejects material over the char cap before calling the model", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/output/n1/s2/material.json",
    JSON.stringify({
      subject: "test",
      node: "n1",
      step: "s2",
      title: "Step Two",
      purpose: "Second step.",
      sources: [{ path: "sources/test/notes.txt", locator: "#L11-L20", text: "x".repeat(50) }],
    }),
  );
  const run = spawnSync(
    process.execPath,
    [CLI, "compose", "--subject", "test", "--node", "n1", "--step", "s2", "--max-chars", "40", "--root", root],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.steps[0].status, "failed");
  assert.match(report.steps[0].error, /over the 40 limit/);
});

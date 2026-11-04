import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const CLI = resolve("src/article-cli.mjs");

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
  write(root, "learn/test/nodes/n1/s1.plan.json", "[]");
  execFileSync(
    process.execPath,
    [CLI, "prepare", "--subject", "test", "--node", "n1", "--step", "s1", "--force", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/original.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/polish.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/result.json")), false);
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

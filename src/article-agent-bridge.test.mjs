import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  MAX_STEP_IMAGES,
  REPO_IMAGE_STYLE,
  assertPlanAnchors,
  buildBrief,
  buildRequest,
  jobFiles,
  normalizeStepPlan,
  readStepPlan,
} from "./article-agent-bridge.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "bridge-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "prompts/image.txt", "Make one figure.\n");
  return root;
}

const entry = { id: "s1", title: "Step One", purpose: "Explain one thing." };

test("jobFiles points the plan at the shared image-plans path", () => {
  const files = jobFiles("/repo", { subject: "test", node: "n1", step: "s1" });
  assert.equal(files.plan, "/repo/learn/test/output/image-plans/n1/s1.json");
  assert.equal(files.legacyPlan, "/repo/learn/test/output/jobs/test-n1-s1.plan.json");
});

test("readStepPlan reads the shared image plan and validates anchors", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/output/image-plans/n1/s1.json",
    JSON.stringify([{ heading: "A", anchor: "one  sentence", prompt: "draw it" }]),
  );
  const plan = readStepPlan(root, { subject: "test", node: "n1", step: "s1" }, "one sentence.");
  assert.equal(plan.length, 1);
  assert.equal(plan[0].index, 1);
  assert.throws(
    () => readStepPlan(root, { subject: "test", node: "n1", step: "s1" }, "Another sentence."),
    /not verbatim/,
  );
});

test("buildBrief keeps the step purpose and drops node neighbours", () => {
  const brief = buildBrief(entry, { hasCode: true });
  assert.match(brief, /Explain one thing/);
  assert.match(brief, /<!--code:N-->/);
  assert.doesNotMatch(brief, /上一課|下一課|第 1\//);
});

test("normalizeStepPlan accepts 1-5 items and numbers them", () => {
  const plan = normalizeStepPlan([
    { heading: "A", anchor: "one sentence", prompt: "draw it" },
    { anchor: "another", prompt: "draw that" },
  ]);
  assert.deepEqual(plan, [
    { index: 1, heading: "A", anchor: "one sentence", prompt: "draw it" },
    { index: 2, heading: "", anchor: "another", prompt: "draw that" },
  ]);
});

test("normalizeStepPlan rejects empty, oversized and malformed plans", () => {
  assert.throws(() => normalizeStepPlan([]), /1-5 items/);
  assert.throws(
    () => normalizeStepPlan(Array.from({ length: MAX_STEP_IMAGES + 1 }, () => ({ anchor: "a", prompt: "p" }))),
    /1-5 items/,
  );
  assert.throws(() => normalizeStepPlan([{ prompt: "p" }]), /non-empty anchor/);
  assert.throws(() => normalizeStepPlan([{ anchor: "a" }]), /non-empty prompt/);
  assert.throws(() => normalizeStepPlan("not json"), SyntaxError);
});

test("assertPlanAnchors matches after normalizing whitespace", () => {
  const plan = normalizeStepPlan([{ anchor: "the  quick\nbrown fox", prompt: "p" }]);
  assert.doesNotThrow(() => assertPlanAnchors(plan, "Before the quick brown fox jumps."));
  assert.throws(() => assertPlanAnchors(plan, "Before the slow fox jumps."), /not verbatim/);
});

test("readStepPlan fails when the publisher wrote no plan", (t) => {
  const root = fixture(t);
  assert.throws(
    () => readStepPlan(root, { subject: "test", node: "n1", step: "s1" }, "# One"),
    /image plan not found/,
  );
});

test("buildRequest carries the plan, repo style and repo image template", (t) => {
  const root = fixture(t);
  const files = jobFiles(root, { subject: "test", node: "n1", step: "s1" });
  const request = buildRequest(root, {
    subject: "test",
    files,
    entry,
    plan: normalizeStepPlan([{ anchor: "a sentence", prompt: "draw it" }]),
    hasCode: false,
  });
  assert.equal(request.articleFile, files.protected);
  assert.equal(request.imagePlan.length, 1);
  assert.equal(request.imagePlan[0].anchor, "a sentence");
  assert.equal(request.imageStyle, REPO_IMAGE_STYLE);
  assert.equal(request.imageTemplate, readFileSync(join(root, "prompts/image.txt"), "utf8"));
  assert.equal(request.outputRoot, join(root, "learn/test/output"));
});

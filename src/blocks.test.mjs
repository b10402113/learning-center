import assert from "node:assert/strict";
import test from "node:test";
import {
  BLOCK_SECTIONS,
  blockImageProblems,
  computeCoverage,
  detectDrift,
  findPrerequisiteCycles,
  insertBlockImageMarker,
  normalizeBlockPlan,
  replaceBlockImageMarker,
  validateAudit,
  validateBlockFrontmatter,
  validateBlockRelations,
  validateBlockSections,
  validateInlineLinks,
} from "./blocks.mjs";

function block(overrides = {}) {
  const { body = "", ...fields } = overrides;
  const data = {
    id: "tool-calling",
    title: "Tool Calling（工具呼叫）",
    label: "Tool Calling",
    subject: "test",
    type: "concept",
    status: "draft",
    summary: "模型要求執行外部工具的流程。",
    aliases: [],
    prerequisites: [],
    related: [],
    sources: ["[[sources/test/notes.txt#L1-L10]]"],
    ...fields,
  };
  return {
    id: data.id,
    file: `learn/test/blocks/${data.id}.md`,
    path: `/tmp/learn/test/blocks/${data.id}.md`,
    error: null,
    body,
    data,
  };
}

function ids(failures) {
  return failures.map((failure) => failure.checkId);
}

test("a valid block frontmatter passes", () => {
  assert.deepEqual(validateBlockFrontmatter(block(), "test", new Set(["tool-calling"])), []);
});

test("a block id must equal its filename and stay kebab-case", () => {
  const mismatched = { ...block(), id: "tool-calling", data: { ...block().data, id: "other" } };
  assert.ok(ids(validateBlockFrontmatter(mismatched, "test")).includes("block-id-filename"));
  assert.ok(ids(validateBlockFrontmatter(block({ id: "Tool_Calling" }), "test")).includes("block-slug"));
});

test("a block subject must match its folder", () => {
  assert.ok(ids(validateBlockFrontmatter(block({ subject: "other" }), "test")).includes("block-subject"));
});

test("type and status are fixed enums", () => {
  assert.ok(ids(validateBlockFrontmatter(block({ type: "essay" }), "test")).includes("block-type"));
  assert.ok(ids(validateBlockFrontmatter(block({ status: "done" }), "test")).includes("block-status"));
});

test("a slug field, when present, must be kebab-case", () => {
  assert.ok(
    ids(validateBlockFrontmatter(block({ slug: "Tool Calling" }), "test")).includes("block-slug"),
  );
  assert.ok(
    !ids(validateBlockFrontmatter(block({ slug: "tool-calling" }), "test")).includes("block-slug"),
  );
});

test("a label must reject sentence punctuation", () => {
  for (const label of ["先固定輸出 schema 讓模型可驗證。", "如何避免模型亂回答？", "有依據的草稿。"]) {
    assert.ok(ids(validateBlockFrontmatter(block({ label }), "test")).includes("block-label"), label);
  }
});

test("a label that starts like a sentence is rejected even without punctuation", () => {
  for (const label of ["先固定輸出 schema 讓模型可驗證", "如何避免模型亂回答"]) {
    assert.ok(ids(validateBlockFrontmatter(block({ label }), "test")).includes("block-label"), label);
  }
  assert.ok(
    !ids(validateBlockFrontmatter(block({ label: "Single Responsibility Principle" }), "test")).includes(
      "block-label",
    ),
  );
});

test("a label must stay short and must not end with punctuation", () => {
  assert.ok(
    ids(validateBlockFrontmatter(block({ label: "目".repeat(41) }), "test")).includes("block-label"),
  );
  assert.ok(ids(validateBlockFrontmatter(block({ label: "Tool Calling." }), "test")).includes("block-label"));
});

test("a summary is required, stays within the limit, and is one sentence", () => {
  assert.ok(ids(validateBlockFrontmatter(block({ summary: "" }), "test")).includes("block-summary"));
  assert.ok(
    ids(validateBlockFrontmatter(block({ summary: "字".repeat(121) }), "test")).includes("block-summary"),
  );
  assert.ok(
    ids(validateBlockFrontmatter(block({ summary: "第一句。第二句。" }), "test")).includes("block-summary"),
  );
  assert.ok(
    !ids(validateBlockFrontmatter(block({ summary: "第一句，含逗號與分號；仍然是同一句。" }), "test")).includes(
      "block-summary",
    ),
  );
});

test("aliases must be kebab-case and may not collide with a block id", () => {
  assert.ok(
    ids(validateBlockFrontmatter(block({ aliases: "tool" }), "test")).includes("block-alias-type"),
  );
  assert.ok(
    ids(validateBlockFrontmatter(block({ aliases: ["Tool_Call"] }), "test")).includes("block-alias-type"),
  );
  assert.ok(
    ids(validateBlockFrontmatter(block({ aliases: ["other"] }), "test", new Set(["other"]))).includes(
      "block-alias-conflict",
    ),
  );
});

test("required sections depend on the block type", () => {
  const body = BLOCK_SECTIONS.concept.map((section) => `## ${section}\n\nText.`).join("\n\n");
  assert.deepEqual(validateBlockSections({ ...block(), body }), []);
  const missing = body.replace(`## ${BLOCK_SECTIONS.concept[2]}\n\nText.\n\n`, "");
  assert.deepEqual(ids(validateBlockSections({ ...block(), body: missing })), ["block-section"]);

  const procedure = BLOCK_SECTIONS.procedure.map((section) => `## ${section}\n\nText.`).join("\n\n");
  assert.deepEqual(
    validateBlockSections({ ...block({ type: "procedure" }), body: procedure }),
    [],
  );
  assert.ok(validateBlockSections({ ...block({ type: "procedure" }), body }).length > 0);
});

test("required sections keep their order and extra sections may follow", () => {
  const sections = BLOCK_SECTIONS.concept;
  const reordered = [sections[1], sections[0], ...sections.slice(2)]
    .map((section) => `## ${section}\n\nText.`)
    .join("\n\n");
  assert.deepEqual(ids(validateBlockSections({ ...block(), body: reordered })), ["block-section"]);

  const withExtra = [...sections, "延伸閱讀"].map((section) => `## ${section}\n\nText.`).join("\n\n");
  assert.deepEqual(validateBlockSections({ ...block(), body: withExtra }), []);
});

test("relations must resolve, stay inside the subject, and avoid self", () => {
  const blocks = [
    block(),
    block({ id: "agent", prerequisites: ["missing"] }),
    block({ id: "loop", prerequisites: ["learn/test/blocks/agent.md"] }),
  ];
  const checkIds = ids(validateBlockRelations(blocks));
  assert.ok(checkIds.includes("block-prerequisite-missing"));

  assert.ok(
    ids(validateBlockFrontmatter(block({ id: "harness", related: ["harness"] }), "test")).includes(
      "block-related-self",
    ),
  );
  assert.ok(
    ids(validateBlockFrontmatter(block({ id: "loop", prerequisites: ["learn/test/blocks/a.md"] }), "test")).includes(
      "block-prerequisite-subject",
    ),
  );
});

test("prerequisite cycles are named", () => {
  const blocks = [
    block({ id: "a", prerequisites: ["b"] }),
    block({ id: "b", prerequisites: ["a"] }),
  ];
  assert.deepEqual([...findPrerequisiteCycles(blocks)].sort(), ["a", "b"]);
  assert.ok(validateBlockRelations(blocks).some((failure) => failure.checkId === "block-prerequisite-cycle"));
});

test("inline block links must resolve", () => {
  const blocks = [block({ body: "See [[agent]] and [[harness|the harness]]." })];
  assert.ok(validateInlineLinks(blocks).some((failure) => failure.checkId === "block-inline-link"));
  const resolved = [block({ id: "agent" }), block({ id: "harness" }), block({ body: "See [[agent]]." })];
  assert.deepEqual(validateInlineLinks(resolved), []);
});

test("coverage follows the spec formula", () => {
  const coverage = {
    steps: {
      "n1/a": {
        concepts: [
          { slug: "tool-calling", label: "Tool Calling", block: "tool-calling" },
          { slug: "structured-output", label: "Structured Output", block: "structured-output" },
          { slug: "grounded-generation", label: "Grounded Generation", block: null },
        ],
      },
      "n1/b": {
        concepts: [
          { slug: "tool-calling", label: "Tool Calling", block: "tool-calling" },
          { slug: "classification", label: "Classification", block: null },
        ],
      },
    },
  };
  const stats = computeCoverage(coverage);
  assert.equal(stats.pairs, 5);
  assert.equal(stats.coveredPairs, 3);
  assert.equal(stats.stepCoverage, 0.6);
  assert.equal(stats.concepts, 4);
  assert.equal(stats.coveredConcepts, 2);
  assert.equal(stats.courseCoverage, 0.5);
  assert.equal(stats.blockCount, 2);
  assert.equal(stats.projectedBlocks, 4);
  assert.equal(stats.reuseFactor, 1.25);
  assert.deepEqual(
    stats.uncovered.map((concept) => concept.slug).sort(),
    ["classification", "grounded-generation"],
  );
});

test("projected blocks deducts a block that covers several concepts", () => {
  const stats = computeCoverage({
    steps: {
      "n1/a": {
        concepts: [
          { slug: "tcp", label: "TCP", block: "tcp-vs-udp" },
          { slug: "udp", label: "UDP", block: "tcp-vs-udp" },
          { slug: "grounded", label: "Grounded", block: null },
        ],
      },
    },
  });
  assert.equal(stats.concepts, 3);
  assert.equal(stats.blockCount, 1);
  assert.equal(stats.projectedBlocks, 2);
});

test("coverage deduplicates a repeated slug inside one step", () => {
  const stats = computeCoverage({
    steps: {
      "n1/a": {
        concepts: [
          { slug: "tool-calling", label: "Tool Calling", block: "tool-calling" },
          { slug: "tool-calling", label: "Tool Calling", block: "tool-calling" },
        ],
      },
    },
  });
  assert.equal(stats.pairs, 1);
  assert.equal(stats.reuseFactor, 1);
});

test("drift reports stale steps, uncovered concepts, orphans, and dropped sources", () => {
  const blocks = [
    block({ updated: "2026-01-01" }),
    block({ id: "orphan", label: "Orphan", updated: "2026-01-01" }),
  ];
  const steps = [
    {
      key: "n1/a",
      blocks: ["tool-calling"],
      sources: ["[[sources/test/other.txt#L1-L2]]"],
      updated: "2026-02-01",
    },
  ];
  const coverage = {
    steps: {
      "n1/a": { concepts: [{ slug: "grounded", label: "Grounded", block: null }] },
    },
  };
  const drifts = detectDrift({ blocks, steps, coverage });
  const kinds = drifts.map((drift) => drift.kind);
  assert.ok(kinds.includes("stale-step"));
  assert.ok(kinds.includes("source-not-referenced"));
  assert.ok(kinds.includes("orphan-block"));
  assert.ok(kinds.includes("uncovered-concept"));
});

test("drift is empty when a step and block agree", () => {
  const blocks = [block({ updated: "2026-02-01" })];
  const steps = [
    { key: "n1/a", blocks: ["tool-calling"], sources: ["[[sources/test/notes.txt#L1-L10]]"], updated: "2026-01-01" },
  ];
  const coverage = {
    steps: { "n1/a": { concepts: [{ slug: "tool-calling", label: "Tool Calling", block: "tool-calling" }] } },
  };
  assert.deepEqual(detectDrift({ blocks, steps, coverage }), []);
});

function auditFixture(concepts, { node = "n1", steps = { s1: { concepts } } } = {}) {
  return { node, steps };
}

function auditContext(overrides = {}) {
  return {
    subject: "test",
    nodes: new Map([["n1", { status: "written", steps: new Map([["s1", {}]]) }]]),
    blocks: [block({ id: "existing-block", label: "Existing Block", aliases: ["tool-invocation"] })],
    eligibleSteps: new Set(["n1/s1"]),
    ...overrides,
  };
}

const validConcept = {
  slug: "tool-calling",
  label: "Tool Calling",
  sources: ["[[sources/test/notes.txt#L1-L10]]"],
  match: { kind: "new" },
  note: "",
};

test("a valid audit passes", () => {
  const audit = auditFixture([validConcept, { ...validConcept, slug: "agent", label: "Agent" }, { ...validConcept, slug: "loop", label: "Loop" }]);
  assert.deepEqual(validateAudit(audit, auditContext()), { failures: [], warnings: [] });
});

test("an audit must name a written node and its own steps", () => {
  const audit = auditFixture([validConcept]);
  assert.ok(
    validateAudit({ ...audit, node: "missing" }, auditContext()).failures.some(
      (failure) => failure.checkId === "audit-node-unknown",
    ),
  );
  assert.ok(
    validateAudit(audit, auditContext({ eligibleSteps: new Set(["n1/other"]) })).failures.some(
      (failure) => failure.checkId === "audit-step-not-eligible",
    ),
  );
  assert.ok(
    validateAudit({ ...audit, steps: { missing: { concepts: [validConcept] } } }, auditContext()).failures.some(
      (failure) => failure.checkId === "audit-step-unknown",
    ),
  );
});

test("audit concepts check slug, label, sources, and match kind", () => {
  const bad = [
    { ...validConcept, slug: "Tool Calling" },
    { ...validConcept, label: "如何避免模型亂回答" },
    { ...validConcept, sources: [] },
    { ...validConcept, sources: ["notes.txt"] },
    { ...validConcept, match: { kind: "maybe" } },
  ];
  const result = validateAudit(auditFixture(bad), auditContext());
  const checkIds = result.failures.map((failure) => failure.checkId);
  assert.ok(checkIds.includes("audit-concept-slug"));
  assert.ok(checkIds.includes("audit-concept-label"));
  assert.ok(checkIds.includes("audit-concept-sources"));
  assert.ok(checkIds.includes("audit-match-kind"));
});

test("a reuse or merge candidate must point at an existing block or alias", () => {
  const audit = auditFixture([
    { ...validConcept, match: { kind: "reuse", block: "tool-invocation" } },
    { ...validConcept, slug: "agent", label: "Agent", match: { kind: "merge" } },
    { ...validConcept, slug: "loop", label: "Loop", match: { kind: "reuse", block: "missing" } },
  ]);
  const checkIds = validateAudit(audit, auditContext()).failures.map((failure) => failure.checkId);
  assert.equal(checkIds.filter((id) => id === "audit-match-block").length, 2);
});

test("short steps need a note, and more than six concepts is an overflow warning", () => {
  const short = validateAudit(auditFixture([validConcept]), auditContext());
  assert.ok(short.warnings.some((warning) => warning.checkId === "audit-concept-short"));
  const noted = validateAudit(
    { ...auditFixture([validConcept]), steps: { s1: { concepts: [validConcept], note: "很短的一步。" } } },
    auditContext(),
  );
  assert.ok(!noted.warnings.some((warning) => warning.checkId === "audit-concept-short"));

  const many = Array.from({ length: 7 }, (_, index) => ({
    ...validConcept,
    slug: `concept-${index}`,
    label: `Concept ${index}`,
  }));
  assert.ok(
    validateAudit(auditFixture(many), auditContext()).warnings.some(
      (warning) => warning.checkId === "audit-concept-overflow",
    ),
  );
});

test("duplicate slugs fail and a new slug that already exists warns", () => {
  const result = validateAudit(
    auditFixture([
      validConcept,
      validConcept,
      { ...validConcept, slug: "existing-block", label: "Existing Block" },
    ]),
    auditContext(),
  );
  assert.ok(result.failures.some((failure) => failure.checkId === "audit-concept-duplicate"));
  assert.ok(result.warnings.some((warning) => warning.checkId === "audit-new-existing"));
});

test("a new candidate dedupes against aliases and normalized labels", () => {
  const concept = { ...validConcept, slug: "other-name", label: "Existing Block" };
  const byLabel = validateAudit(auditFixture([validConcept, concept, { ...validConcept, slug: "agent", label: "Agent" }]), auditContext());
  assert.ok(
    byLabel.warnings.some(
      (warning) => warning.checkId === "audit-new-existing" && warning.message.includes("label matches"),
    ),
  );

  const byAlias = validateAudit(
    auditFixture([
      validConcept,
      { ...validConcept, slug: "tool-invocation", label: "Tool Invocation" },
      { ...validConcept, slug: "agent", label: "Agent" },
    ]),
    auditContext(),
  );
  assert.ok(
    byAlias.warnings.some(
      (warning) => warning.checkId === "audit-new-existing" && warning.message.includes("alias"),
    ),
  );
});

test("an H1-only draft block is a skeleton, but a started body needs every section", () => {
  const skeleton = { ...block(), body: "# Tool Calling（工具呼叫）\n" };
  assert.deepEqual(validateBlockSections(skeleton), []);

  const partial = { ...block(), body: "# Tool Calling（工具呼叫）\n\n## 定義\n\nText.\n" };
  assert.ok(ids(validateBlockSections(partial)).includes("block-section"));
});

test("a block image plan takes exactly one prompt", () => {
  assert.deepEqual(normalizeBlockPlan([{ heading: "定義", prompt: "畫出工具呼叫的流程" }]), [
    { index: 1, heading: "定義", prompt: "畫出工具呼叫的流程" },
  ]);
  assert.deepEqual(normalizeBlockPlan('[{"prompt":"hero"}]'), [
    { index: 1, heading: "", prompt: "hero" },
  ]);
  assert.throws(() => normalizeBlockPlan([]), /exactly 1/);
  assert.throws(() => normalizeBlockPlan([{ prompt: "a" }, { prompt: "b" }]), /exactly 1/);
  assert.throws(() => normalizeBlockPlan([{ heading: "定義" }]), /non-empty prompt/);
  assert.throws(() => normalizeBlockPlan("not json"), /JSON array/);
});

test("the block image marker sits between the H1 and the first section", () => {
  const body = "## 定義\n\nText.\n\n## 例子\n\nMore.\n";
  assert.equal(
    insertBlockImageMarker(`# Tool Calling\n\n${body}`),
    "# Tool Calling\n\n<!--image:1-->\n\n## 定義\n\nText.\n\n## 例子\n\nMore.\n",
  );
  const already = "# Tool Calling\n\n<!--image:1-->\n\n## 定義\n\nText.\n";
  assert.equal(insertBlockImageMarker(already), already);
  assert.throws(() => insertBlockImageMarker("## 定義\n\nText.\n"), /H1/);
});

test("block image layout accepts a marker or an image, never both, and only after the H1", () => {
  const ok = "# T\n\n<!--image:1-->\n\n## 定義\n\nText.\n";
  assert.deepEqual(blockImageProblems(ok, "t"), []);

  const rendered = "# T\n\n![概念示意圖](./t-assets/image-1.webp)\n\n## 定義\n\nText.\n";
  assert.deepEqual(blockImageProblems(rendered, "t"), []);

  const both = "# T\n\n<!--image:1-->\n\n![概念示意圖](./t-assets/image-1.webp)\n\n## 定義\n";
  assert.ok(ids(blockImageProblems(both, "t")).includes("block-image-state"));

  const after = "# T\n\n## 定義\n\nText.\n\n<!--image:1-->\n";
  assert.ok(ids(blockImageProblems(after, "t")).includes("block-image-position"));

  const two = "# T\n\n<!--image:1-->\n\n<!--image:2-->\n\n## 定義\n";
  assert.ok(ids(blockImageProblems(two, "t")).includes("block-image-count"));

  const wrong = "# T\n\n![x](./other-assets/image-1.webp)\n\n## 定義\n";
  assert.ok(ids(blockImageProblems(wrong, "t")).includes("block-image-location"));

  const none = "# T\n\n## 定義\n\nText.\n";
  assert.deepEqual(blockImageProblems(none, "t"), []);
});

test("a rendered block image is rewritten without a caption", () => {
  assert.equal(
    replaceBlockImageMarker("# T\n\n<!--image:1-->\n", "t"),
    "# T\n\n![概念示意圖](./t-assets/image-1.webp)\n",
  );
});

test("a block author, when present, is a non-empty string", () => {
  assert.deepEqual(validateBlockFrontmatter(block({ author: "gpt-x" }), "test", new Set(["tool-calling"])), []);
  assert.ok(ids(validateBlockFrontmatter(block({ author: "  " }), "test", new Set(["tool-calling"]))).includes("block-author"));
  assert.ok(ids(validateBlockFrontmatter(block({ author: 3 }), "test", new Set(["tool-calling"]))).includes("block-author"));
});

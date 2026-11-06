import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { runChecks } from "./verify.mjs";

const NOTES = `${Array.from({ length: 20 }, (_, index) => `source line ${index + 1}`).join("\n")}\n`;

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "verify-fixture-"));
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
  write(
    root,
    "learn/test/ROADMAP.md",
    `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`,
  );
  write(root, "learn/test/nodes/n1.md", nodeFile());
  write(root, "learn/test/nodes/n1/s1.md", `# Step One

Opening line.

<!-- derived -->
\`\`\`js
const answer = 42;
\`\`\`

Closing line.
`);

  return root;
}

function nodeFile({ steps = defaultSteps(), body = defaultBody() } = {}) {
  return `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
digests:
  - notes.md
steps:
${steps}created: 2026-10-22
updated: 2026-10-22
---

${body}`;
}

function defaultSteps() {
  return `  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
`;
}

function defaultBody() {
  return `# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`;
}

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

function update(root, relative, from, to) {
  const current = read(root, relative);
  assert.ok(current.includes(from), `fixture is missing ${from}`);
  write(root, relative, current.replace(from, to));
}

function setRoadmap(root, entries) {
  const lines = entries
    .map(({ id, tier = 1 }, index) => `1. **[Node ${id}](${`nodes/${id}.md`})**`)
    .join("\n");
  write(
    root,
    "learn/test/ROADMAP.md",
    `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

${lines}
`,
  );
}

function writeDraftNode(root, { id, tier = 1, order = 1, prerequisites = [] }) {
  write(
    root,
    `learn/test/nodes/${id}.md`,
    `---
id: ${id}
title: "Node ${id}"
subject: test
tier: ${tier}
order: ${order}
status: draft
goal: "Do ${id}."
digests: []
prerequisites:${prerequisites.length === 0 ? " []" : ""}
${prerequisites.map((p) => `  - "${p}"`).join("\n")}
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Node ${id}

## Lesson

A short lesson.

## Steps
`,
  );
}

function addCodebaseDigest(root) {
  write(root, "sources/test/code/main.js", `${Array.from({ length: 20 }, (_, index) => `// line ${index + 1}`).join("\n")}\n`);
  write(
    root,
    "learn/test/digests/code.md",
    `---
source: sources/test/code
source_type: codebase
source_lines: 20
language: JavaScript
file_count: 1
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Main module.

# L2 detail

- \`#L1-L20\` — main module
`,
  );
}

function splitFixture(t) {
  const root = mkdtempSync(join(tmpdir(), "verify-split-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  write(root, "sources/test/book.txt", "line 1\nline 2\nline 3\nline 4\nline 5\nline 6\n");
  write(root, "sources/test/book.1.part.txt", "line 1\nline 2\nline 3\n");
  write(root, "sources/test/book.2.part.txt", "line 4\nline 5\nline 6\n");
  write(
    root,
    "sources/test/book.parts.json",
    `${JSON.stringify(
      {
        text: "sources/test/book.txt",
        total_lines: 6,
        parts: [
          { part: 1, file: "book.1.part.txt", start: 1, end: 3, lines: 3 },
          { part: 2, file: "book.2.part.txt", start: 4, end: 6, lines: 3 },
        ],
      },
      null,
      2,
    )}\n`,
  );
  for (const part of [1, 2]) {
    write(
      root,
      `learn/test/digests/book.${part}.part.md`,
      `---
source: sources/test/book.${part}.part.txt
source_type: text
source_lines: 3
part: ${part}
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Part ${part}.

# L2 detail

- \`#L1-L3\` — part ${part}
`,
    );
  }
  write(
    root,
    "learn/test/ROADMAP.md",
    `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`,
  );
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
digests:
  - book.1.part.md
  - book.2.part.md
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/book.1.part.txt#L1-L2]]"
      - "[[sources/test/book.2.part.txt#L2-L3]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`,
  );
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nOpening line.\n");
  return root;
}

function failures(root, options = {}) {
  return runChecks({ root, subject: "test", ...options }).failures.map((failure) => failure.checkId);
}

test("a valid Markdown subject passes", (t) => {
  const root = fixture(t);
  const result = runChecks({ root, subject: "test" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

test("roadmap node links must resolve", (t) => {
  const root = fixture(t);
  update(root, "learn/test/ROADMAP.md", "(nodes/n1.md)", "(nodes/missing.md)");
  assert.ok(failures(root).includes("roadmap-link"));
});

test("every node must be listed in the roadmap", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n2.md",
    `---
id: n2
title: "Node Two"
subject: test
tier: 1
order: 2
status: draft
goal: "Plan another thing."
prerequisites: []
digests: []
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Node Two

## Lesson

Planned.
`,
  );
  assert.ok(failures(root).includes("roadmap-node-orphan"));
});

test("a draft node with no steps is accepted", (t) => {
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
status: draft
goal: "Do one thing."
digests:
  - notes.md
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

Planned.
`,
  );
  rmSync(join(root, "learn/test/nodes/n1"), { recursive: true, force: true });
  assert.deepEqual(failures(root), []);
});

test("node frontmatter must include every required key", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "goal: \"Do one thing.\"\n", "");
  assert.ok(failures(root).includes("fm-required"));
});

test("node id must equal its filename", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "id: n1", "id: other");
  assert.ok(failures(root).includes("id-filename"));
});

test("node subject must match the subject argument", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "subject: test", "subject: other");
  assert.ok(failures(root).includes("fm-subject"));
});

test("node status must be a legal value", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "status: confirmed", "status: probed");
  assert.ok(failures(root).includes("fm-status"));
});

test("steps may not declare deps, type, or order", (t) => {
  for (const key of ["deps", "type", "order"]) {
    const root = fixture(t);
    const steps = defaultSteps().replace(
      "    sources:\n",
      key === "deps" ? "    deps:\n      - other\n    sources:\n" : `    ${key}: ${key === "type" ? "concept" : "1"}\n    sources:\n`,
    );
    write(root, "learn/test/nodes/n1.md", nodeFile({ steps }));
    assert.ok(failures(root).includes("steps-flat"), `${key} should be rejected`);
  }
});

test("each step entry needs id, purpose, and sources", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "    purpose: \"Explain one thing.\"\n", "");
  assert.ok(failures(root).includes("step-entry"));
});

test("a step author is optional but must be a non-empty string when present", (t) => {
  const invalid = fixture(t);
  update(
    invalid,
    "learn/test/nodes/n1.md",
    '    purpose: "Explain one thing."\n',
    '    purpose: "Explain one thing."\n    author: ""\n',
  );
  assert.ok(failures(invalid).includes("step-author"));

  const valid = fixture(t);
  update(
    valid,
    "learn/test/nodes/n1.md",
    '    purpose: "Explain one thing."\n',
    '    purpose: "Explain one thing."\n    author: "test-model"\n',
  );
  assert.ok(!failures(valid).includes("step-author"));
});

function prerequisiteFixture(t, nodes) {
  const root = fixture(t);
  for (const node of nodes) writeDraftNode(root, node);
  setRoadmap(root, nodes.map(({ id, tier }) => ({ id, tier })));
  return root;
}

test("prerequisites must be a list of node paths", (t) => {
  const root = prerequisiteFixture(t, [{ id: "n1" }]);
  update(root, "learn/test/nodes/n1.md", "prerequisites: []", 'prerequisites: "learn/test/nodes/n1.md"');
  assert.ok(failures(root).includes("prerequisites-type"));

  const malformed = prerequisiteFixture(t, [{ id: "n1" }]);
  update(
    malformed,
    "learn/test/nodes/n1.md",
    "prerequisites: []",
    "prerequisites:\n  - n1",
  );
  assert.ok(failures(malformed).includes("prerequisite-path"));
});

test("prerequisites must point at an existing node in the same subject", (t) => {
  const missing = prerequisiteFixture(t, [
    { id: "n1" },
    { id: "n2", prerequisites: ["learn/test/nodes/nope.md"] },
  ]);
  assert.ok(failures(missing).includes("prerequisite-missing"));

  const otherSubject = prerequisiteFixture(t, [
    { id: "n1" },
    { id: "n2", prerequisites: ["learn/other/nodes/n1.md"] },
  ]);
  assert.ok(failures(otherSubject).includes("prerequisite-subject"));
});

test("a node cannot require itself", (t) => {
  const root = prerequisiteFixture(t, [
    { id: "n1", prerequisites: ["learn/test/nodes/n1.md"] },
  ]);
  assert.ok(failures(root).includes("prerequisite-self"));
});

test("prerequisite cycles are rejected", (t) => {
  const root = prerequisiteFixture(t, [
    { id: "n1", prerequisites: ["learn/test/nodes/n2.md"] },
    { id: "n2", prerequisites: ["learn/test/nodes/n1.md"] },
  ]);
  assert.ok(failures(root).includes("prerequisite-cycle"));
});

test("a prerequisite may not come from a later tier", (t) => {
  const root = prerequisiteFixture(t, [
    { id: "n1", tier: 2, prerequisites: ["learn/test/nodes/n2.md"] },
    { id: "n2", tier: 3 },
  ]);
  assert.ok(failures(root).includes("prerequisite-tier"));

  const sameTier = prerequisiteFixture(t, [
    { id: "n1", tier: 2, prerequisites: ["learn/test/nodes/n2.md"] },
    { id: "n2", tier: 2 },
  ]);
  assert.ok(!failures(sameTier).includes("prerequisite-tier"));
});

test("an earlier-tier prerequisite chain passes", (t) => {
  const root = prerequisiteFixture(t, [
    { id: "n1" },
    { id: "n2", tier: 2, prerequisites: ["learn/test/nodes/n1.md"] },
    { id: "n3", tier: 3, prerequisites: ["learn/test/nodes/n2.md"] },
  ]);
  assert.ok(!failures(root).some((id) => id.startsWith("prerequisite")));
});

test("a step purpose is one sentence", (t) => {
  for (const purpose of [
    "Explain one thing。Then explain another。",
    "Explain one thing. Then explain another.",
  ]) {
    const root = fixture(t);
    update(root, "learn/test/nodes/n1.md", 'purpose: "Explain one thing."', `purpose: "${purpose}"`);
    assert.ok(failures(root).includes("step-purpose"), purpose);
  }
});

test("a step purpose allows dots inside names", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", 'purpose: "Explain one thing."', 'purpose: "Run the Node.js loop."');
  assert.ok(!failures(root).includes("step-purpose"));
});

test("a step purpose must be a single line of text", (t) => {
  const root = fixture(t);
  update(
    root,
    "learn/test/nodes/n1.md",
    'purpose: "Explain one thing."',
    "purpose: |\n      First line.\n      Second line.",
  );
  assert.ok(failures(root).includes("step-purpose"));
});

test("a non-string step purpose is rejected", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", 'purpose: "Explain one thing."', "purpose: 42");
  assert.ok(failures(root).includes("step-purpose"));
});

test("a step purpose must stay short", (t) => {
  const root = fixture(t);
  update(
    root,
    "learn/test/nodes/n1.md",
    'purpose: "Explain one thing."',
    `purpose: "${"目".repeat(121)}"`,
  );
  assert.ok(failures(root).includes("step-purpose"));
});

test("every step entry has an article", (t) => {
  const root = fixture(t);
  rmSync(join(root, "learn/test/nodes/n1/s1.md"));
  assert.ok(failures(root).includes("step-article-missing"));
});

test("an H1-only article skeleton is accepted", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n");
  assert.deepEqual(failures(root), []);
});

test("a planned step may omit title and use an empty skeleton", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1.md",
    nodeFile({
      steps: defaultSteps().replace('    title: "Step One"\n', ""),
      body: defaultBody().replace("1. [Step One](n1/s1.md)", "1. [s1](n1/s1.md)"),
    }),
  );
  write(root, "learn/test/nodes/n1/s1.md", "");
  assert.deepEqual(failures(root), []);
});

test("an article body requires publish to write the title back", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1.md",
    nodeFile({
      steps: defaultSteps().replace('    title: "Step One"\n', ""),
      body: defaultBody().replace("1. [Step One](n1/s1.md)", "1. [s1](n1/s1.md)"),
    }),
  );
  assert.ok(failures(root).includes("step-title-missing"));
});

test("every article belongs to a step entry", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/extra.md", "# Extra\n");
  assert.ok(failures(root).includes("step-orphan"));
});

test("the article H1 must equal the step title", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1/s1.md", "# Step One", "# Another Title");
  assert.ok(failures(root).includes("step-h1"));
});

test("the ## Steps list must match frontmatter order and titles", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "1. [Step One](n1/s1.md)", "1. [Different](n1/s1.md)");
  assert.ok(failures(root).includes("node-steps-list"));
});

test("the ## Steps list is required when the node has steps", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1.md", nodeFile({ body: "# Node One\n\n## Lesson\n\nNo list.\n" }));
  assert.ok(failures(root).includes("node-steps-list"));
});

test("source locators must use #Lx-Ly", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "#L1-L10", "#introduction");
  assert.ok(failures(root).includes("src-locator-format"));
});

test("source files must exist", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "sources/test/notes.txt", "sources/test/missing.txt");
  assert.ok(failures(root).includes("src-path"));
});

test("source ranges must stay inside the file", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "#L1-L10", "#L16-L25");
  assert.ok(failures(root).includes("src-range"));
});

test("source ranges must not be empty", (t) => {
  const root = fixture(t);
  write(root, "sources/test/notes.txt", NOTES.split("\n").map((line, index) => (index === 4 || index === 5 ? "" : line)).join("\n"));
  update(root, "learn/test/nodes/n1.md", "#L1-L10", "#L5-L6");
  assert.ok(failures(root).includes("src-slice-empty"));
});

test("source citations may not point at a PDF", (t) => {
  const root = fixture(t);
  write(root, "sources/test/paper.pdf", "%PDF-1.4\n");
  update(root, "learn/test/nodes/n1.md", "sources/test/notes.txt", "sources/test/paper.pdf");
  assert.ok(failures(root).includes("src-pdf"));
});

test("sources need a digest", (t) => {
  const root = fixture(t);
  rmSync(join(root, "learn/test/digests/notes.md"));
  assert.ok(failures(root).includes("src-digest-missing"));
});

test("source citations must fall inside the digest line map", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "- `#L11-L20` — second half\n", "");
  update(root, "learn/test/nodes/n1.md", "#L1-L10", "#L11-L20");
  assert.ok(failures(root).includes("src-digest-range"));
});

test("digest source_lines must match the source file", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "source_lines: 20", "source_lines: 99");
  assert.ok(failures(root).includes("digest-source-lines"));
});

test("digests must carry an L2 line map", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "- `#L1-L10` — first half\n- `#L11-L20` — second half\n", "");
  assert.ok(failures(root).includes("digest-l2-empty"));
});

test("digests may not use slug locators", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/digests/notes.md",
    `${read(root, "learn/test/digests/notes.md")}\n- Locator: \`[[sources/test/notes.txt#introduction]]\`\n`,
  );
  assert.ok(failures(root).includes("digest-locator"));
});

test("digests must cite the extracted text, not a PDF", (t) => {
  const root = fixture(t);
  write(root, "sources/test/paper.pdf", "%PDF-1.4\n");
  update(root, "learn/test/digests/notes.md", "sources/test/notes.txt", "sources/test/paper.pdf");
  assert.ok(failures(root).includes("digest-source-pdf"));
});

test("code blocks need source or derived provenance", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1/s1.md", "<!-- derived -->\n", "");
  assert.ok(failures(root).includes("code-provenance"));
});

test("code blocks accept a source comment", (t) => {
  const root = fixture(t);
  update(
    root,
    "learn/test/nodes/n1/s1.md",
    "<!-- derived -->",
    "<!-- source: sources/test/notes.txt#L1-L2 -->",
  );
  assert.deepEqual(failures(root), []);
});

test("the learned tree may not contain .mdx files", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/legacy.mdx", "# Old\n");
  assert.ok(failures(root).includes("no-mdx"));
});

test("article links must resolve", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", `${read(root, "learn/test/nodes/n1/s1.md")}\n[missing](./missing.md)\n`);
  assert.ok(failures(root).includes("link"));
});

test("node step links must resolve", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "(n1/s1.md)", "(n1/missing.md)");
  const ids = failures(root);
  assert.ok(ids.includes("node-step-link"));
  assert.ok(ids.includes("node-steps-list"));
});

test("node steps must be an array", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", `steps:\n${defaultSteps()}`, "steps: nope\n");
  assert.ok(failures(root).includes("steps-array"));
});

test("a confirmed node needs at least one step", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", `steps:\n${defaultSteps()}`, "steps: []\n");
  assert.ok(failures(root).includes("steps-empty"));
});

test("step ids are unique", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1.md", nodeFile({ steps: `${defaultSteps()}${defaultSteps()}` }));
  assert.ok(failures(root).includes("steps-duplicate"));
});

test("digest frontmatter must include every required key", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "source_type: text\n", "");
  assert.ok(failures(root).includes("digest-fm"));
});

test("digest status must be a legal value", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: done");
  assert.ok(failures(root).includes("digest-status"));
});

test("digest source must exist", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "sources/test/notes.txt", "sources/test/missing.txt");
  assert.ok(failures(root).includes("digest-source"));
});

test("digest line ranges must be valid", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "- `#L1-L10` — first half", "- `#L10-L5` — backwards");
  assert.ok(failures(root).includes("digest-range"));
});

test("source citations must use the wiki-link format", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "[[sources/test/notes.txt#L1-L10]]", "sources/test/notes.txt#L1-L10");
  assert.ok(failures(root).includes("src-format"));
});

test("malformed YAML is reported, not thrown", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", 'title: "Node One"', "title: [unclosed");
  assert.ok(failures(root).includes("fm-parse"));
});

test("a step folder needs a node container", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/ghost/s1.md", "# Ghost\n");
  assert.ok(failures(root).includes("node-container-missing"));
});

test("a missing node is reported", (t) => {
  const root = fixture(t);
  assert.ok(failures(root, { node: "missing" }).includes("node-missing"));
});

test("a source provenance comment must resolve", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1/s1.md",
    `# Step One

<!-- source: sources/test/missing.txt#L1-L2 -->
\`\`\`js
const answer = 42;
\`\`\`
`,
  );
  assert.ok(failures(root).includes("code-provenance"));
});

test("--node scopes step failures to one node", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n2.md",
    `---
id: n2
title: "Node Two"
subject: test
tier: 1
order: 2
status: confirmed
goal: "Do another thing."
digests:
  - notes.md
steps:
  - id: s2
    title: "Step Two"
    purpose: "Explain another thing."
    sources:
      - "[[sources/test/notes.txt#L11-L20]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node Two

## Lesson

Another lesson.

## Steps

1. [Step Two](n2/s2.md)
`,
  );
  write(root, "learn/test/nodes/n2/s2.md", "# Wrong Heading\n");
  assert.ok(failures(root).includes("step-h1"));
  assert.ok(!failures(root, { node: "n1" }).includes("step-h1"));
});


function articleWithQuiz(quiz) {
  return `# Step One

Opening line.

<!-- derived -->
\`\`\`js
const answer = 42;
\`\`\`

\`\`\`quiz
${typeof quiz === "string" ? quiz : JSON.stringify(quiz)}
\`\`\`
`;
}

function validQuiz(overrides = {}) {
  return {
    question: "What is the answer?",
    options: ["41", "42", "43"],
    answer: 1,
    explain: "The fixture says so.",
    ...overrides,
  };
}

test("a valid quiz block passes", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz(validQuiz()));
  assert.deepEqual(failures(root), []);
});

test("a quiz block must contain valid JSON", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz("{not json"));
  assert.ok(failures(root).includes("quiz-json"));
});

test("a quiz question must be non-empty", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz(validQuiz({ question: " " })));
  assert.ok(failures(root).includes("quiz-json"));
});

test("a quiz needs between two and five options", (t) => {
  for (const options of [["only"], ["1", "2", "3", "4", "5", "6"]]) {
    const root = fixture(t);
    write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz(validQuiz({ options })));
    assert.ok(failures(root).includes("quiz-options"), JSON.stringify(options));
  }
});

test("a quiz answer must be a 0-based index in range", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz(validQuiz({ answer: 3 })));
  assert.ok(failures(root).includes("quiz-answer"));
});

test("a quiz needs a non-empty explanation", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", articleWithQuiz(validQuiz({ explain: " " })));
  assert.ok(failures(root).includes("quiz-explain"));
});

function validQuizFile(questions = [
  validQuiz({ question: "Question one?" }),
  validQuiz({ question: "Question two?" }),
  validQuiz({ question: "Question three?" }),
]) {
  return { "quiz-generated": true, questions };
}

function writeQuizFile(root, payload, step = "s1") {
  write(
    root,
    `learn/test/nodes/n1/${step}.quiz.json`,
    typeof payload === "string" ? payload : JSON.stringify(payload),
  );
}

test("a valid quiz sidecar passes", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile());
  assert.deepEqual(failures(root), []);
});

test("a quiz sidecar must contain valid JSON", (t) => {
  const root = fixture(t);
  writeQuizFile(root, "{not json");
  assert.ok(failures(root).includes("quiz-file-json"));
});

test("a quiz sidecar must be a JSON object", (t) => {
  const root = fixture(t);
  writeQuizFile(root, []);
  assert.ok(failures(root).includes("quiz-file-json"));
});

test("a quiz sidecar needs the generated marker", (t) => {
  for (const payload of [
    { questions: validQuizFile().questions },
    { ...validQuizFile(), "quiz-generated": false },
  ]) {
    const root = fixture(t);
    writeQuizFile(root, payload);
    assert.ok(failures(root).includes("quiz-file-marker"));
  }
});

test("a quiz sidecar needs three to eight questions", (t) => {
  for (const count of [2, 9]) {
    const root = fixture(t);
    const questions = Array.from({ length: count }, (_, index) =>
      validQuiz({ question: `Question ${index + 1}?` }),
    );
    writeQuizFile(root, validQuizFile(questions));
    assert.ok(failures(root).includes("quiz-file-count"), `count ${count}`);
  }
});

test("a quiz sidecar may not exceed the article's question ceiling", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile([
    validQuiz({ question: "Question one?" }),
    validQuiz({ question: "Question two?" }),
    validQuiz({ question: "Question three?" }),
    validQuiz({ question: "Question four?" }),
  ]));
  assert.ok(failures(root).includes("quiz-file-count"));
});

test("a quiz sidecar question must be non-empty", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile([
    validQuiz({ question: " " }),
    validQuiz(),
    validQuiz(),
  ]));
  assert.ok(failures(root).includes("quiz-file-question"));
});

test("a quiz sidecar needs two to five options", (t) => {
  for (const options of [["only"], ["1", "2", "3", "4", "5", "6"]]) {
    const root = fixture(t);
    writeQuizFile(root, validQuizFile([
      validQuiz({ options }),
      validQuiz(),
      validQuiz(),
    ]));
    assert.ok(failures(root).includes("quiz-file-options"), JSON.stringify(options));
  }
});

test("a quiz sidecar answer must be an index in range", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile([
    validQuiz({ answer: 3 }),
    validQuiz(),
    validQuiz(),
  ]));
  assert.ok(failures(root).includes("quiz-file-answer"));
});

test("a quiz sidecar needs a non-empty explanation", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile([
    validQuiz({ explain: " " }),
    validQuiz(),
    validQuiz(),
  ]));
  assert.ok(failures(root).includes("quiz-file-explain"));
});

test("a quiz sidecar needs a matching step article", (t) => {
  const root = fixture(t);
  writeQuizFile(root, validQuizFile(), "missing-step");
  assert.ok(failures(root).includes("quiz-orphan"));
});

function webpBytes() {
  return Buffer.concat([Buffer.from("RIFF"), Buffer.from([16, 0, 0, 0]), Buffer.from("WEBP"), Buffer.from("VP8 ")]);
}

test("a referenced WebP image must exist", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\n![配圖](./s1-assets/image-1.webp)\n");
  assert.ok(failures(root).includes("image-missing"));
});

test("a referenced image must be a valid WebP file", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\n![配圖](./s1-assets/image-1.webp)\n");
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", "not-a-webp");
  assert.ok(failures(root).includes("image-format"));
});

test("a referenced image must be WebP by extension", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\n![配圖](./s1-assets/image-1.png)\n");
  write(root, "learn/test/nodes/n1/s1-assets/image-1.png", webpBytes());
  assert.ok(failures(root).includes("image-format"));
});

test("images must live in the step asset folder", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\n![配圖](./image-1.webp)\n");
  write(root, "learn/test/nodes/n1/image-1.webp", webpBytes());
  assert.ok(failures(root).includes("image-location"));
});

test("a valid referenced image passes", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1/s1.md",
    "# Step One\n\nOpening line.\n\n![第 1 段配圖](./s1-assets/image-1.webp)\n*AI 生成示意圖*\n",
  );
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", webpBytes());
  assert.deepEqual(failures(root), []);
});

test("assets not referenced by the article are orphans", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1-assets/image-2.webp", webpBytes());
  assert.ok(failures(root).includes("image-orphan"));
});

test("an asset folder without a step is an orphan", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/ghost-assets/image-1.webp", webpBytes());
  assert.ok(failures(root).includes("image-orphan"));
});

test("an image plan beside the node is accepted", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1/s1.plan.json",
    JSON.stringify([{ heading: "A", prompt: "draw it" }]),
  );
  assert.deepEqual(failures(root), []);
});

test("an image plan must be a 1-5 item array with prompts", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.plan.json", JSON.stringify([{ heading: "A" }]));
  assert.ok(failures(root).includes("image-plan"));

  write(root, "learn/test/nodes/n1/s1.plan.json", "not json");
  assert.ok(failures(root).includes("image-plan"));
});

test("an image plan without a step entry is an orphan", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/n1/ghost.plan.json",
    JSON.stringify([{ heading: "A", prompt: "draw it" }]),
  );
  assert.ok(failures(root).includes("image-plan-orphan"));
});

test("a text digest may point at a codebase digest it supplements", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - code.md#L1-L20");
  assert.ok(!failures(root).some((check) => check.startsWith("digest-supplement")));
});

test("a step may cite a file inside a codebase digest's directory", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(
    root,
    "learn/test/nodes/n1.md",
    '"[[sources/test/notes.txt#L1-L10]]"',
    '"[[sources/test/notes.txt#L1-L10]]"\n      - "[[sources/test/code/main.js#L1-L20]]"',
  );
  update(root, "learn/test/nodes/n1.md", "  - notes.md\n", "  - notes.md\n  - code.md\n");
  assert.deepEqual(failures(root), []);
});

test("supplements must name an existing digest", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - missing.md#L1");
  assert.ok(failures(root).includes("digest-supplement-missing"));
});

test("supplements must target a codebase or image digest", (t) => {
  const root = fixture(t);
  write(root, "sources/test/other.txt", NOTES);
  write(
    root,
    "learn/test/digests/other.md",
    `---
source: sources/test/other.txt
source_type: text
source_lines: 20
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Other notes.

# L2 detail

- \`#L1-L20\` — other notes
`,
  );
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - other.md#L1");
  assert.ok(failures(root).includes("digest-supplement-type"));
});

test("only text digests may declare supplements", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(root, "learn/test/digests/code.md", "status: absorbed", "status: absorbed\nsupplements:\n  - notes.md#L1");
  assert.ok(failures(root).includes("digest-supplements"));
});

test("a digest cannot supplement itself", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - notes.md#L1");
  assert.ok(failures(root).includes("digest-supplements"));
});

test("supplements need an L1 or L2 locator", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - code.md");
  assert.ok(failures(root).includes("digest-supplements"));
});

test("supplement L2 ranges must stay inside the digest line map", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - code.md#L21-L30");
  assert.ok(failures(root).includes("digest-supplement-range"));
});

test("an image supplement takes the digest's L1", (t) => {
  const root = fixture(t);
  write(root, "sources/test/shot.png", "not-a-real-png");
  write(
    root,
    "learn/test/digests/shot.md",
    `---
source: sources/test/shot.png
source_type: image
source_lines: 0
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- A screenshot of the workflow.

# L2 detail

- \`sources/test/shot.png\` — the workflow screen
`,
  );
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: absorbed\nsupplements:\n  - shot.md#L1");
  assert.ok(!failures(root).some((check) => check.startsWith("digest-supplement")));
});

test("a node may only declare digests that exist", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "  - notes.md\n", "  - missing.md\n");
  assert.ok(failures(root).includes("node-digest-unknown"));
});

test("a node may only declare absorbed digests", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: pending");
  assert.ok(failures(root).includes("node-digest-status"));
});

test("a step source must come from a declared digest", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "digests:\n  - notes.md\n", "digests: []\n");
  assert.ok(failures(root).includes("node-digest-undeclared"));
});

test("a confirmed node may not declare a digest no step cites", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(root, "learn/test/nodes/n1.md", "  - notes.md\n", "  - notes.md\n  - code.md\n");
  assert.ok(failures(root).includes("node-digest-unused"));
});

test("a draft node may declare digests its future steps will cite", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "status: confirmed", "status: draft");
  assert.ok(!failures(root).includes("node-digest-unused"));
});

test("a skipped digest needs a reason", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: skipped");
  assert.ok(failures(root).includes("digest-skip-reason"));
});

test("an absorbed digest must belong to a node", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/digests/spare.md",
    `---
source: sources/test/notes.txt
source_type: text
source_lines: 20
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Spare notes.

# L2 detail

- \`#L1-L20\` — spare notes
`,
  );
  assert.ok(failures(root).includes("digest-unreferenced"));
});

test("a pending digest fails the subject check but not a node check", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/digests/later.md",
    `---
source: sources/test/notes.txt
source_type: text
source_lines: 20
status: pending
absorbed_at: ""
---

# L1 overview

- Later notes.

# L2 detail

- \`#L1-L20\` — later notes
`,
  );
  assert.ok(failures(root).includes("digest-pending"));
  assert.ok(!failures(root, { node: "n1" }).includes("digest-pending"));
});

test("a skipped digest may not be declared by a node", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "status: absorbed", "status: skipped\nskip_reason: \"Not needed.\"");
  assert.ok(failures(root).includes("node-digest-status"));
});

test("a supplement inherits its parent digest's skip", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(
    root,
    "learn/test/digests/notes.md",
    "status: absorbed",
    "status: skipped\nskip_reason: \"Only the prose matters.\"\nsupplements:\n  - code.md#L1-L20",
  );
  assert.ok(failures(root).includes("digest-supplement-status"));
});

test("an absorbed supplement needs no node of its own", (t) => {
  const root = fixture(t);
  addCodebaseDigest(root);
  update(
    root,
    "learn/test/digests/notes.md",
    "status: absorbed",
    "status: absorbed\nsupplements:\n  - code.md#L1-L20",
  );
  assert.ok(!failures(root).includes("digest-unreferenced"));
});

test("a source split into parts with one digest per part passes", (t) => {
  const root = splitFixture(t);
  const result = runChecks({ root, subject: "test" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

test("a parts manifest gap fails", (t) => {
  const root = splitFixture(t);
  update(root, "sources/test/book.parts.json", '"start": 4', '"start": 5');
  assert.ok(failures(root).includes("source-parts-coverage"));
});

test("a part file's line count must match the manifest", (t) => {
  const root = splitFixture(t);
  write(root, "sources/test/book.2.part.txt", "line 4\nline 5\n");
  assert.ok(failures(root).includes("source-parts-lines"));
});

test("a digest must cite its part file, not the unsplit source", (t) => {
  const root = splitFixture(t);
  update(root, "learn/test/digests/book.1.part.md", "source: sources/test/book.1.part.txt", "source: sources/test/book.txt");
  assert.ok(failures(root).includes("digest-source-split"));
});

test("two digests may not claim the same part", (t) => {
  const root = splitFixture(t);
  write(
    root,
    "learn/test/digests/book.extra.md",
    `---
source: sources/test/book.1.part.txt
source_type: text
source_lines: 3
part: 1
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Extra.

# L2 detail

- \`#L1-L3\` — extra
`,
  );
  assert.ok(failures(root).includes("source-parts-digest-duplicate"));
});

test("every part needs a digest", (t) => {
  const root = splitFixture(t);
  rmSync(join(root, "learn/test/digests/book.2.part.md"));
  assert.ok(failures(root).includes("source-parts-digest-missing"));
});

test("a digest's part number must match the manifest", (t) => {
  const root = splitFixture(t);
  update(root, "learn/test/digests/book.2.part.md", "part: 2", "part: 1");
  assert.ok(failures(root).includes("source-parts-digest-part"));
});

test("a missing part file fails", (t) => {
  const root = splitFixture(t);
  rmSync(join(root, "sources/test/book.2.part.txt"));
  assert.ok(failures(root).includes("source-parts-file"));
});


test("a digest L2 range must use the #Lx-Ly form", (t) => {
  const root = fixture(t);
  update(root, "learn/test/digests/notes.md", "- `#L1-L10`", "- `#L1-10`");
  assert.ok(failures(root).includes("digest-locator"));
});

test("a digest L2 range with a malformed end fails", (t) => {
  const root = splitFixture(t);
  update(root, "learn/test/digests/book.1.part.md", "- `#L1-L3`", "- `#L1-3`");
  assert.ok(failures(root).includes("digest-locator"));
});


function mutateManifest(root, mutate) {
  const path = join(root, "sources/test/book.parts.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  mutate(data);
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

test("a malformed parts manifest is reported", (t) => {
  const root = splitFixture(t);
  write(root, "sources/test/book.parts.json", "{ not json\n");
  assert.ok(failures(root).includes("source-parts-json"));
});

test("a parts manifest must point under its subject", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.text = "sources/other/book.txt";
  });
  assert.ok(failures(root).includes("source-parts-text"));
});

test("a parts manifest total must match the original", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.total_lines = 7;
  });
  assert.ok(failures(root).includes("source-parts-total"));
});

test("a parts manifest needs a non-empty parts list", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.parts = [];
  });
  assert.ok(failures(root).includes("source-parts-list"));
});

test("parts must be numbered in order", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.parts[1].part = 3;
  });
  assert.ok(failures(root).includes("source-parts-order"));
});

test("a part range must start at line 1 or later", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.parts[0].start = 0;
  });
  assert.ok(failures(root).includes("source-parts-range"));
});

test("overlapping parts fail", (t) => {
  const root = splitFixture(t);
  mutateManifest(root, (data) => {
    data.parts[1].start = 3;
  });
  assert.ok(failures(root).includes("source-parts-coverage"));
});

function newLayoutFixture(t) {
  const root = mkdtempSync(join(tmpdir(), "verify-layout-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const notes = `${Array.from({ length: 20 }, (_, index) => `course line ${index + 1}`).join("\n")}\n`;
  const extra = `${Array.from({ length: 10 }, (_, index) => `extra line ${index + 1}`).join("\n")}\n`;
  write(root, "sources/test/20261022/course/notes.txt", notes);
  write(root, "sources/test/20261022/supplement/extra.txt", extra);
  write(root, "sources/test/20261022/raw/lesson.srt", "1\n00:00:01,000 --> 00:00:02,000\nhi\n");
  write(
    root,
    "learn/test/MEMORY.md",
    `---
subject: test
language: zh-Hant
source_layout: course-supplement
created: 2026-10-22
updated: 2026-10-22
---

# MEMORY — test
`,
  );
  write(
    root,
    "learn/test/digests/notes.md",
    `---
source: sources/test/20261022/course/notes.txt
source_type: text
source_lines: 20
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Notes.

# L2 detail

- \`#L1-L10\` — first half
- \`#L11-L20\` — second half
`,
  );
  write(
    root,
    "learn/test/digests/extra.md",
    `---
source: sources/test/20261022/supplement/extra.txt
source_type: text
source_lines: 10
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Extra.

# L2 detail

- \`#L1-L10\` — all of it
`,
  );
  write(
    root,
    "learn/test/ROADMAP.md",
    `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`,
  );
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
digests:
  - notes.md
  - extra.md
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/20261022/course/notes.txt#L1-L10]]"
      - "[[sources/test/20261022/supplement/extra.txt#L1-L5]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`,
  );
  write(
    root,
    "learn/test/nodes/n1/s1.md",
    `# Step One

Opening line.

Closing line.
`,
  );
  return root;
}

test("a course-supplement subject passes when every step cites course text", (t) => {
  const root = newLayoutFixture(t);
  const result = runChecks({ root, subject: "test" });
  assert.equal(result.failures.length, 0, JSON.stringify(result.failures));
});

test("a step without a course source fails", (t) => {
  const root = newLayoutFixture(t);
  update(
    root,
    "learn/test/nodes/n1.md",
    `      - "[[sources/test/20261022/course/notes.txt#L1-L10]]"\n`,
    "",
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "src-course-missing"));
});

test("a source outside the three role folders fails", (t) => {
  const root = newLayoutFixture(t);
  write(root, "sources/test/20261022/stray.txt", "stray\n");
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "source-layout"));
});

test("citing a raw source fails", (t) => {
  const root = newLayoutFixture(t);
  update(
    root,
    "learn/test/nodes/n1.md",
    `      - "[[sources/test/20261022/course/notes.txt#L1-L10]]"`,
    `      - "[[sources/test/20261022/raw/lesson.srt#L1-L2]]"`,
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "src-raw"));
});

test("a role-aware parts manifest resolves parts in course and supplement", (t) => {
  const root = mkdtempSync(join(tmpdir(), "verify-parts-role-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const course = `${Array.from({ length: 10 }, (_, index) => `course ${index + 1}`).join("\n")}\n`;
  const extra = `${Array.from({ length: 10 }, (_, index) => `extra ${index + 1}`).join("\n")}\n`;
  write(root, "sources/test/20261022/course/book.1.part.txt", course);
  write(root, "sources/test/20261022/supplement/book.2.part.txt", extra);
  write(
    root,
    "sources/test/20261022/raw/book.parts.json",
    JSON.stringify({
      text: "sources/test/20261022/book.txt",
      total_lines: 20,
      parts: [
        { part: 1, file: "book.1.part.txt", role: "course", start: 1, end: 10, lines: 10 },
        { part: 2, file: "book.2.part.txt", role: "supplement", start: 11, end: 20, lines: 10 },
      ],
    }),
  );
  write(
    root,
    "learn/test/MEMORY.md",
    `---
subject: test
language: zh-Hant
source_layout: course-supplement
created: 2026-10-22
updated: 2026-10-22
---

# MEMORY — test
`,
  );
  write(
    root,
    "learn/test/digests/book.1.part.md",
    `---
source: sources/test/20261022/course/book.1.part.txt
source_type: text
source_lines: 10
part: 1
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Course part.

# L2 detail

- \`#L1-L10\` — all of it
`,
  );
  write(
    root,
    "learn/test/digests/book.2.part.md",
    `---
source: sources/test/20261022/supplement/book.2.part.txt
source_type: text
source_lines: 10
part: 2
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Supplement part.

# L2 detail

- \`#L1-L10\` — all of it
`,
  );
  write(
    root,
    "learn/test/ROADMAP.md",
    `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`,
  );
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
digests:
  - book.1.part.md
  - book.2.part.md
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain the course part."
    sources:
      - "[[sources/test/20261022/course/book.1.part.txt#L1-L10]]"
  - id: s2
    title: "Step Two"
    purpose: "Reuse the course part and add the supplement."
    sources:
      - "[[sources/test/20261022/course/book.1.part.txt#L1-L1]]"
      - "[[sources/test/20261022/supplement/book.2.part.txt#L1-L10]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
2. [Step Two](n1/s2.md)
`,
  );
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nBody one.\n");
  write(root, "learn/test/nodes/n1/s2.md", "# Step Two\n\nBody two.\n");

  const result = runChecks({ root, subject: "test" });
  assert.equal(result.failures.length, 0, JSON.stringify(result.failures));
});

test("a course-supplement subject with no course text fails", (t) => {
  const root = newLayoutFixture(t);
  rmSync(join(root, "sources/test/20261022/course/notes.txt"));
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "source-layout-no-course"));
});

test("an unknown source_layout marker fails", (t) => {
  const root = newLayoutFixture(t);
  update(root, "learn/test/MEMORY.md", "source_layout: course-supplement", "source_layout: course-supplment");
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "source-layout-marker"));
});

test("a split part without a role fails in a course-supplement subject", (t) => {
  const root = mkdtempSync(join(tmpdir(), "verify-parts-norole-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "sources/test/20261022/course/notes.txt", "course text\n");
  write(root, "sources/test/20261022/course/book.1.part.txt", "part one\n");
  write(
    root,
    "sources/test/20261022/raw/book.parts.json",
    JSON.stringify({
      text: "sources/test/20261022/course/book.txt",
      total_lines: 1,
      parts: [{ part: 1, file: "book.1.part.txt", start: 1, end: 1, lines: 1 }],
    }),
  );
  write(
    root,
    "learn/test/MEMORY.md",
    `---
subject: test
language: zh-Hant
source_layout: course-supplement
created: 2026-10-22
updated: 2026-10-22
---

# MEMORY — test
`,
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "source-parts-role"));
});

test("a digest pointing at a raw source fails", (t) => {
  const root = newLayoutFixture(t);
  write(
    root,
    "learn/test/digests/raw.md",
    `---
source: sources/test/20261022/raw/lesson.srt
source_type: text
source_lines: 3
status: skipped
skip_reason: "not taught"
---

# L1 overview

- Raw.

# L2 detail

- \`#L1-L3\` — all of it
`,
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "digest-source-raw"));
});

test("a digest outside a role folder fails", (t) => {
  const root = newLayoutFixture(t);
  write(root, "sources/test/20261022/stray.txt", "stray\n");
  write(
    root,
    "learn/test/digests/stray.md",
    `---
source: sources/test/20261022/stray.txt
source_type: text
source_lines: 1
status: skipped
skip_reason: "not taught"
---

# L1 overview

- Stray.

# L2 detail

- \`#L1-L1\` — all of it
`,
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "digest-source-layout"));
});

test("a parts manifest outside raw fails in a course-supplement subject", (t) => {
  const root = mkdtempSync(join(tmpdir(), "verify-parts-location-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "sources/test/20261022/course/notes.txt", "course text\n");
  write(root, "sources/test/20261022/course/book.1.part.txt", "part one\n");
  write(
    root,
    "sources/test/20261022/course/book.parts.json",
    JSON.stringify({
      text: "sources/test/20261022/course/book.txt",
      total_lines: 1,
      parts: [{ part: 1, file: "book.1.part.txt", role: "course", start: 1, end: 1, lines: 1 }],
    }),
  );
  write(
    root,
    "learn/test/MEMORY.md",
    `---
subject: test
language: zh-Hant
source_layout: course-supplement
created: 2026-10-22
updated: 2026-10-22
---

# MEMORY — test
`,
  );
  const result = runChecks({ root, subject: "test" });
  assert.ok(result.failures.some((failure) => failure.checkId === "source-parts-location"));
});

const CONCEPT_SECTIONS = ["定義", "為什麼重要", "如何運作", "例子", "邊界與常見誤解", "進階"];

function blockMarkdown({
  id = "tool-calling",
  title = "Tool Calling",
  label = "Tool Calling",
  subject = "test",
  type = "concept",
  status = "draft",
  summary = "模型要求執行外部工具的流程。",
  aliases = [],
  prerequisites = [],
  related = [],
  sources = ["[[sources/test/notes.txt#L1-L10]]"],
  sections = CONCEPT_SECTIONS,
  extra = "",
} = {}) {
  const list = (entries) => (entries.length === 0 ? " []" : `\n${entries.map((entry) => `  - ${entry}`).join("\n")}`);
  const frontmatter = `---
id: ${id}
title: "${title}"
label: "${label}"
subject: ${subject}
type: ${type}
status: ${status}
summary: "${summary}"
aliases:${list(aliases)}
prerequisites:${list(prerequisites)}
related:${list(related)}
sources:
${sources.map((source) => `  - "${source}"`).join("\n")}
created: 2026-11-06
updated: 2026-11-06
---

# ${title}

`;
  const body = sections.map((section) => `## ${section}\n\nText.`).join("\n\n");
  return `${frontmatter}${body}${extra ? `\n\n${extra}` : ""}\n`;
}

function addBlock(root, options = {}) {
  const id = options.id ?? "tool-calling";
  write(root, `learn/test/blocks/${id}.md`, blockMarkdown({ ...options, id }));
  return id;
}

function linkStepBlock(root, id = "tool-calling") {
  update(root, "learn/test/nodes/n1.md", "status: confirmed", "status: written");
  update(
    root,
    "learn/test/nodes/n1.md",
    '      - "[[sources/test/notes.txt#L1-L10]]"\n',
    `      - "[[sources/test/notes.txt#L1-L10]]"\n    blocks:\n      - ${id}\n`,
  );
}

function coverageJson(concepts, steps = { "n1/s1": { concepts } }) {
  return JSON.stringify({ subject: "test", generatedAt: "2026-11-06", steps }, null, 2);
}

function addCoverage(root, concepts, steps) {
  write(root, "learn/test/blocks/coverage.json", coverageJson(concepts, steps));
}

function coveredConcept(overrides = {}) {
  return {
    slug: "tool-calling",
    label: "Tool Calling",
    sources: ["[[sources/test/notes.txt#L1-L10]]"],
    block: "tool-calling",
    note: "",
    ...overrides,
  };
}

function blockFixture(t, options = {}) {
  const root = fixture(t);
  const id = addBlock(root, options);
  linkStepBlock(root, id);
  addCoverage(root, [coveredConcept({ slug: id, block: id, label: options.label ?? "Tool Calling" })]);
  return root;
}

test("a valid block linked to a step passes", (t) => {
  const root = blockFixture(t);
  const result = runChecks({ root, subject: "test" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

test("block labels may not be sentences", (t) => {
  const root = blockFixture(t, { label: "先固定輸出 schema 讓模型可驗證。" });
  assert.ok(failures(root).includes("block-label"));
});

test("block labels stay short", (t) => {
  const root = blockFixture(t, { label: "目".repeat(41) });
  assert.ok(failures(root).includes("block-label"));
});

test("block type and status are fixed enums", (t) => {
  const badType = blockFixture(t, { type: "essay" });
  assert.ok(failures(badType).includes("block-type"));

  const badStatus = blockFixture(t, { status: "done" });
  assert.ok(failures(badStatus).includes("block-status"));
});

test("block id must equal the filename and stay kebab-case", (t) => {
  const root = fixture(t);
  addBlock(root, { id: "Tool_Calling" });
  assert.ok(failures(root).includes("block-slug"));
});

test("block summary is required and bounded", (t) => {
  const empty = blockFixture(t, { summary: "" });
  assert.ok(failures(empty).includes("block-summary"));

  const long = blockFixture(t, { summary: "字".repeat(121) });
  assert.ok(failures(long).includes("block-summary"));
});

test("each block type needs its required sections", (t) => {
  const root = fixture(t);
  addBlock(root, { sections: CONCEPT_SECTIONS.filter((section) => section !== "例子") });
  assert.ok(failures(root).includes("block-section"));
});

test("block sources need at least one valid locator", (t) => {
  const none = fixture(t);
  addBlock(none, { sources: [] });
  assert.ok(failures(none).includes("block-sources-empty"));

  const bad = fixture(t);
  addBlock(bad, { sources: ["[[sources/test/notes.txt#introduction]]"] });
  assert.ok(failures(bad).includes("src-locator-format"));

  const outside = fixture(t);
  update(outside, "learn/test/digests/notes.md", "- `#L11-L20` — second half\n", "");
  addBlock(outside, { sources: ["[[sources/test/notes.txt#L11-L20]]"] });
  assert.ok(failures(outside).includes("src-digest-range"));
});

test("block prerequisites and related entries must resolve", (t) => {
  const root = fixture(t);
  addBlock(root, { prerequisites: ["missing"], related: ["also-missing"] });
  const ids = failures(root);
  assert.ok(ids.includes("block-prerequisite-missing"));
  assert.ok(ids.includes("block-related-missing"));
});

test("block prerequisite cycles are rejected", (t) => {
  const root = fixture(t);
  addBlock(root, { id: "a", prerequisites: ["b"] });
  addBlock(root, { id: "b", prerequisites: ["a"] });
  assert.ok(failures(root).includes("block-prerequisite-cycle"));
});

test("inline block links must resolve", (t) => {
  const root = blockFixture(t, { extra: "See [[missing-block]]." });
  assert.ok(failures(root).includes("block-inline-link"));
});

test("block aliases may not collide with another block", (t) => {
  const root = fixture(t);
  addBlock(root, { id: "agent" });
  addBlock(root, { id: "tool-calling", aliases: ["agent"] });
  assert.ok(failures(root).includes("block-alias-conflict"));
});

test("step blocks must exist and stay unique", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "status: confirmed", "status: written");
  update(
    root,
    "learn/test/nodes/n1.md",
    '      - "[[sources/test/notes.txt#L1-L10]]"\n',
    '      - "[[sources/test/notes.txt#L1-L10]]"\n    blocks:\n      - missing\n      - missing\n',
  );
  const ids = failures(root);
  assert.ok(ids.includes("step-block-missing"));
  assert.ok(ids.includes("step-block-duplicate"));
});

test("a subject with blocks needs coverage.json", (t) => {
  const root = fixture(t);
  addBlock(root);
  assert.ok(failures(root).includes("coverage-missing"));
});

test("coverage concept blocks must exist", (t) => {
  const root = blockFixture(t);
  addCoverage(root, [coveredConcept({ block: "missing" })]);
  assert.ok(failures(root).includes("coverage-block-missing"));
});

test("a covered concept must appear in the step blocks list", (t) => {
  const root = fixture(t);
  addBlock(root);
  update(
    root,
    "learn/test/nodes/n1.md",
    "status: confirmed",
    "status: written",
  );
  addCoverage(root, [coveredConcept()]);
  assert.ok(failures(root).includes("coverage-step-blocks"));
});

test("coverage keys must point at written steps", (t) => {
  const root = blockFixture(t);
  addCoverage(root, [coveredConcept()], {
    "n1/s1": { concepts: [coveredConcept()] },
    "n1/ghost": { concepts: [] },
  });
  assert.ok(failures(root).includes("coverage-step"));
});

test("coverage slugs are unique within a step", (t) => {
  const root = blockFixture(t);
  addCoverage(root, [coveredConcept(), coveredConcept()]);
  assert.ok(failures(root).includes("coverage-slug-duplicate"));
});

test("coverage concepts need an explicit block field", (t) => {
  const root = blockFixture(t);
  const concept = coveredConcept();
  delete concept.block;
  addCoverage(root, [concept]);
  assert.ok(failures(root).includes("coverage-block-field"));
});

test("coverage must be valid JSON", (t) => {
  const root = blockFixture(t);
  write(root, "learn/test/blocks/coverage.json", "{not json");
  assert.ok(failures(root).includes("coverage-json"));
});

test("a step block without a coverage concept is rejected", (t) => {
  const root = fixture(t);
  addBlock(root);
  linkStepBlock(root);
  addCoverage(root, []);
  assert.ok(failures(root).includes("coverage-step-block-uncovered"));
});

test("coverage subject must match the folder", (t) => {
  const root = blockFixture(t);
  write(
    root,
    "learn/test/blocks/coverage.json",
    JSON.stringify({ subject: "other", generatedAt: "2026-11-06", steps: {} }),
  );
  assert.ok(failures(root).includes("coverage-subject"));
});


test("block frontmatter failures are named", (t) => {
  const badYaml = fixture(t);
  write(badYaml, "learn/test/blocks/tool-calling.md", "---\nid: [unclosed\n---\n");
  assert.ok(failures(badYaml).includes("block-fm-parse"));

  const mismatchedId = fixture(t);
  addBlock(mismatchedId);
  update(mismatchedId, "learn/test/blocks/tool-calling.md", "id: tool-calling", "id: other");
  assert.ok(failures(mismatchedId).includes("block-id-filename"));

  const wrongSubject = blockFixture(t, { subject: "other" });
  assert.ok(failures(wrongSubject).includes("block-subject"));

  const noTitle = blockFixture(t, { title: "" });
  assert.ok(failures(noTitle).includes("block-title"));
});

test("block alias failures are named", (t) => {
  const badType = fixture(t);
  addBlock(badType);
  update(badType, "learn/test/blocks/tool-calling.md", "aliases: []", 'aliases: "tool"');
  assert.ok(failures(badType).includes("block-alias-type"));

  const duplicate = fixture(t);
  addBlock(duplicate, { aliases: ["tool", "tool"] });
  assert.ok(failures(duplicate).includes("block-alias-duplicate"));
});

test("block relation failures are named", (t) => {
  const badType = fixture(t);
  addBlock(badType);
  update(badType, "learn/test/blocks/tool-calling.md", "prerequisites: []", 'prerequisites: "agent"');
  assert.ok(failures(badType).includes("block-prerequisite-type"));

  const badRelatedType = fixture(t);
  addBlock(badRelatedType);
  update(badRelatedType, "learn/test/blocks/tool-calling.md", "related: []", 'related: "agent"');
  assert.ok(failures(badRelatedType).includes("block-related-type"));

  const badSubject = fixture(t);
  addBlock(badSubject, { prerequisites: ["learn/test/blocks/a.md"] });
  assert.ok(failures(badSubject).includes("block-prerequisite-subject"));

  const duplicate = fixture(t);
  addBlock(duplicate, { id: "a" });
  addBlock(duplicate, { id: "tool-calling", prerequisites: ["a", "a"] });
  assert.ok(failures(duplicate).includes("block-prerequisite-duplicate"));

  const self = fixture(t);
  addBlock(self, { related: ["tool-calling"] });
  assert.ok(failures(self).includes("block-related-self"));

  const prerequisiteSelf = fixture(t);
  addBlock(prerequisiteSelf, { prerequisites: ["tool-calling"] });
  assert.ok(failures(prerequisiteSelf).includes("block-prerequisite-self"));

  const relatedSubject = fixture(t);
  addBlock(relatedSubject, { related: ["learn/test/blocks/a.md"] });
  assert.ok(failures(relatedSubject).includes("block-related-subject"));

  const relatedDuplicate = fixture(t);
  addBlock(relatedDuplicate, { id: "a" });
  addBlock(relatedDuplicate, { id: "tool-calling", related: ["a", "a"] });
  assert.ok(failures(relatedDuplicate).includes("block-related-duplicate"));
});

test("block sources must be a list", (t) => {
  const root = fixture(t);
  addBlock(root);
  update(
    root,
    "learn/test/blocks/tool-calling.md",
    'sources:\n  - "[[sources/test/notes.txt#L1-L10]]"',
    'sources: "[[sources/test/notes.txt#L1-L10]]"',
  );
  assert.ok(failures(root).includes("block-sources-type"));
});

test("step blocks must be a list of ids", (t) => {
  const badType = fixture(t);
  update(badType, "learn/test/nodes/n1.md", "status: confirmed", "status: written");
  update(
    badType,
    "learn/test/nodes/n1.md",
    '      - "[[sources/test/notes.txt#L1-L10]]"\n',
    '      - "[[sources/test/notes.txt#L1-L10]]"\n    blocks: tool-calling\n',
  );
  assert.ok(failures(badType).includes("step-blocks-type"));

  const badId = fixture(t);
  update(badId, "learn/test/nodes/n1.md", "status: confirmed", "status: written");
  update(
    badId,
    "learn/test/nodes/n1.md",
    '      - "[[sources/test/notes.txt#L1-L10]]"\n',
    '      - "[[sources/test/notes.txt#L1-L10]]"\n    blocks:\n      - Tool_Calling\n',
  );
  assert.ok(failures(badId).includes("step-block-id"));
});

test("coverage structure failures are named", (t) => {
  const noSteps = blockFixture(t);
  write(noSteps, "learn/test/blocks/coverage.json", JSON.stringify({ subject: "test" }));
  assert.ok(failures(noSteps).includes("coverage-steps"));

  const noConcepts = blockFixture(t);
  write(
    noConcepts,
    "learn/test/blocks/coverage.json",
    JSON.stringify({ subject: "test", steps: { "n1/s1": {} } }),
  );
  assert.ok(failures(noConcepts).includes("coverage-concepts"));

  const badSlug = blockFixture(t);
  addCoverage(badSlug, [coveredConcept({ slug: "Tool Calling" })]);
  assert.ok(failures(badSlug).includes("coverage-slug"));

  const noLabel = blockFixture(t);
  addCoverage(noLabel, [coveredConcept({ label: "" })]);
  assert.ok(failures(noLabel).includes("coverage-label"));

  const noSources = blockFixture(t);
  addCoverage(noSources, [coveredConcept({ sources: [] })]);
  assert.ok(failures(noSources).includes("coverage-sources"));

  const notWritten = blockFixture(t);
  update(notWritten, "learn/test/nodes/n1.md", "status: written", "status: confirmed");
  assert.ok(failures(notWritten).includes("coverage-step-status"));
});

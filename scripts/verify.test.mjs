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

test("each step entry needs id, title, purpose, and sources", (t) => {
  const root = fixture(t);
  update(root, "learn/test/nodes/n1.md", "    purpose: \"Explain one thing.\"\n", "");
  assert.ok(failures(root).includes("step-entry"));
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

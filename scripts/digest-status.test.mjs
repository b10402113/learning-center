import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "digest-status.mjs");

test("updating a status preserves date-only frontmatter", (t) => {
  const root = mkdtempSync(join(tmpdir(), "digest-status-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "learn/test/digests"), { recursive: true });
  writeFileSync(
    join(root, "learn/test/digests/notes.md"),
    `---
source: sources/test/notes.txt
source_lines: 20
status: pending
created: 2026-10-22
---

# L1 overview

- Notes.
`,
  );

  const run = spawnSync(process.execPath, [SCRIPT, "test", "--set", "absorbed"], { cwd: root, encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);

  const text = readFileSync(join(root, "learn/test/digests/notes.md"), "utf8");
  assert.match(text, /^status: absorbed$/m);
  assert.match(text, /^absorbed_at: '?\d{4}-\d{2}-\d{2}'?$/m);
  assert.match(text, /^created: '?2026-10-22'?$/m);
});

function digestFixture(t, { status = "absorbed", extra = "" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "digest-status-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "learn/test/digests"), { recursive: true });
  mkdirSync(join(root, "learn/test/nodes"), { recursive: true });
  writeFileSync(
    join(root, "learn/test/digests/notes.md"),
    `---
source: sources/test/notes.txt
source_lines: 20
status: ${status}
${extra}---

# L1 overview

- Notes.
`,
  );
  writeFileSync(
    join(root, "learn/test/nodes/n1.md"),
    `---
id: n1
digests:
  - notes.md
---

# Node One
`,
  );
  return root;
}

test("skipping a digest requires a reason", (t) => {
  const root = digestFixture(t);
  const run = spawnSync(process.execPath, [SCRIPT, "test", "--set", "skipped"], { cwd: root, encoding: "utf8" });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /--reason/);
  assert.match(readFileSync(join(root, "learn/test/digests/notes.md"), "utf8"), /^status: absorbed$/m);
});

test("a skipped digest records its reason and drops absorbed_at", (t) => {
  const root = digestFixture(t, { extra: "absorbed_at: 2026-10-22\n" });
  const run = spawnSync(
    process.execPath,
    [SCRIPT, "test", "--set", "skipped", "--reason", "Not needed for any node."],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  const text = readFileSync(join(root, "learn/test/digests/notes.md"), "utf8");
  assert.match(text, /^status: skipped$/m);
  assert.match(text, /^skip_reason: Not needed for any node\.$/m);
  assert.doesNotMatch(text, /^absorbed_at:/m);
});

test("the listing reports node references and coverage", (t) => {
  const root = digestFixture(t);
  const run = spawnSync(process.execPath, [SCRIPT, "test"], { cwd: root, encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /notes\s+absorbed\s+n1/);
  assert.match(run.stdout, /1 absorbed, 0 pending, 0 skipped; 0 absorbed without a node/);
});

test("a supplement shows the node that claims its parent digest", (t) => {
  const root = digestFixture(t, { extra: "supplements:\n  - code.md#L1\n" });
  writeFileSync(
    join(root, "learn/test/digests/code.md"),
    `---
source: sources/test/code
source_type: codebase
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Code.
`,
  );
  const run = spawnSync(process.execPath, [SCRIPT, "test"], { cwd: root, encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /code\s+absorbed\s+n1 \(via notes\)/);
  assert.match(run.stdout, /0 absorbed without a node/);
});

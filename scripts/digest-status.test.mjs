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

#!/usr/bin/env node
/**
 * backfill-node-digests.mjs — Derive each node's `digests` list from its step sources.
 *
 * Usage:
 *   node scripts/backfill-node-digests.mjs                       # dry run, every subject
 *   node scripts/backfill-node-digests.mjs --subject <subject>   # dry run, one subject
 *   node scripts/backfill-node-digests.mjs --write               # write the derived lists
 *   node scripts/backfill-node-digests.mjs --write --skip-unused --reason "…"
 *
 * The dry run also lists absorbed digests that no node would claim. Without
 * --skip-unused those stay absorbed and the subject check keeps failing.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import matter from "gray-matter";

const args = process.argv.slice(2);
const write = args.includes("--write");
const skipUnused = args.includes("--skip-unused");
const subjectIdx = args.indexOf("--subject");
const reasonIdx = args.indexOf("--reason");
const onlySubject = subjectIdx !== -1 ? args[subjectIdx + 1] : null;
const skipReason = reasonIdx !== -1 ? (args[reasonIdx + 1] ?? "").trim() : "";

if (skipUnused && !skipReason) {
  console.error('--skip-unused requires --reason "<why these digests are unused>"');
  process.exit(1);
}

function yamlScalar(value) {
  return /^[A-Za-z0-9._-]+$/.test(value) ? value : JSON.stringify(value);
}

function setDigests(text, names) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error("node has no frontmatter block");
  const lines = match[1].split("\n");
  const kept = [];
  let dropping = false;
  for (const line of lines) {
    if (/^digests:/.test(line)) {
      dropping = true;
      continue;
    }
    if (dropping) {
      if (/^[ \t]/.test(line)) continue;
      dropping = false;
    }
    kept.push(line);
  }
  const block = names.length === 0 ? ["digests: []"] : ["digests:", ...names.map((name) => `  - ${yamlScalar(name)}`)];
  let index = kept.findIndex((line) => /^prerequisites:/.test(line));
  if (index === -1) index = kept.findIndex((line) => /^steps:/.test(line));
  if (index === -1) index = kept.length;
  kept.splice(index, 0, ...block);
  return text.replace(match[0], `---\n${kept.join("\n")}\n---\n`);
}

function setSkipped(text, reason) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error("digest has no frontmatter block");
  const lines = match[1].split("\n");
  const kept = [];
  let dropping = false;
  for (const line of lines) {
    if (/^skip_reason:/.test(line)) {
      dropping = true;
      continue;
    }
    if (dropping) {
      if (/^[ \t]/.test(line)) continue;
      dropping = false;
    }
    if (/^status:/.test(line)) {
      kept.push("status: skipped");
      continue;
    }
    if (/^absorbed_at:/.test(line)) continue;
    kept.push(line);
  }
  const index = kept.findIndex((line) => /^status: skipped$/.test(line));
  kept.splice(index + 1, 0, `skip_reason: ${JSON.stringify(reason)}`);
  return text.replace(match[0], `---\n${kept.join("\n")}\n---\n`);
}

function listSubjects() {
  if (!existsSync("learn")) return [];
  return readdirSync("learn", { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join("learn", entry.name, "digests")))
    .map((entry) => entry.name)
    .filter((name) => !onlySubject || name === onlySubject);
}

function readDigests(subject) {
  const dir = join("learn", subject, "digests");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = matter(readFileSync(join(dir, file), "utf8"));
      return {
        name: file,
        path: join(dir, file),
        data: parsed.data,
        content: parsed.content,
      };
    });
}

function digestFor(digests, sourcePath) {
  const matches = digests.filter((digest) => {
    const source = String(digest.data.source ?? "").trim().replace(/^\.\//, "");
    if (!source) return false;
    if (source === sourcePath) return true;
    if (sourcePath.startsWith(`${source}/`)) return true;
    return basename(source).replace(/\.[^.]+$/, "") === basename(sourcePath).replace(/\.[^.]+$/, "");
  });
  return matches.map((digest) => digest.name);
}

function stepDigests(subject, steps, digests) {
  const names = new Set();
  for (const entry of Array.isArray(steps) ? steps : []) {
    for (const raw of Array.isArray(entry?.sources) ? entry.sources : []) {
      const match = String(raw).match(/\[\[\s*(sources\/[^\]#]+)/);
      if (!match) continue;
      const sourcePath = match[1].trim();
      if (!sourcePath.startsWith(`sources/${subject}/`)) continue;
      for (const name of digestFor(digests, sourcePath)) names.add(name);
    }
  }
  return [...names].sort();
}

function sameList(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

let changed = 0;
let unchanged = 0;
const claimed = new Set();

for (const subject of listSubjects()) {
  const nodesDir = join("learn", subject, "nodes");
  if (!existsSync(nodesDir)) continue;
  const digests = readDigests(subject);
  const supplementNames = new Set(
    digests.flatMap((digest) =>
      (Array.isArray(digest.data.supplements) ? digest.data.supplements : [])
        .filter((value) => typeof value === "string")
        .map((value) => basename(value.split("#")[0])),
    ),
  );
  console.log(`\n${subject}`);

  for (const file of readdirSync(nodesDir)) {
    if (!file.endsWith(".md")) continue;
    const path = join(nodesDir, file);
    const parsed = matter(readFileSync(path, "utf8"));
    const derived = stepDigests(subject, parsed.data.steps, digests);
    for (const name of derived) claimed.add(name);

    const current = Array.isArray(parsed.data.digests)
      ? parsed.data.digests.filter((value) => typeof value === "string")
      : [];
    const label = `${basename(file, extname(file))}`;

    const hasSteps = Array.isArray(parsed.data.steps) && parsed.data.steps.length > 0;
    if (!hasSteps) {
      for (const name of current) claimed.add(name);
    }

    if (Array.isArray(parsed.data.digests) && (sameList(current, derived) || (!hasSteps && current.length > 0))) {
      unchanged += 1;
      console.log(`  = ${label}: ${(hasSteps ? derived : current).length} digest(s)`);
      continue;
    }

    changed += 1;
    console.log(`  ${write ? "~" : "+"} ${label}: ${derived.join(", ") || "(none)"}`);
    if (!write) continue;

    writeFileSync(path, setDigests(readFileSync(path, "utf8"), derived));
  }

  const unused = digests.filter(
    (digest) =>
      String(digest.data.status) === "absorbed" && !claimed.has(digest.name) && !supplementNames.has(digest.name),
  );
  if (unused.length > 0) {
    console.log(`  unclaimed absorbed digests (${unused.length}):`);
    for (const digest of unused) {
      console.log(`    - ${digest.name}`);
      if (!write || !skipUnused) continue;
      writeFileSync(digest.path, setSkipped(readFileSync(digest.path, "utf8"), skipReason));
    }
  }
}

if (!write && skipUnused) console.log("\n[DRY RUN] --skip-unused would mark the unclaimed digests as skipped.");
console.log(
  `\n${write ? "Wrote" : "Would write"} ${changed} node(s); ${unchanged} already up to date.`,
);

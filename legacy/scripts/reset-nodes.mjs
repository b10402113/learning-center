#!/usr/bin/env node
// reset-nodes.mjs — reset one or more nodes back to `nodes-written` and remove
// their generated content, so /batch-nodes (or /teach with another model) can
// regenerate it.
//
// Kept:    the node container .mdx — DAG, reading order, main lesson, sources.
// Removed: every step .mdx (nodes/<node>/), the node's HTML lessons
//          (lessons/<node>/ incl. <step>-assets/), and the /to-article working
//          files (output/<node>/).
//
// Usage:
//   node scripts/reset-nodes.mjs --subject <subject> --node <id> [--node <id> ...]
//                               [--dry-run] [--json]
//
// Exit 0 = every requested node reset (or listed, with --dry-run), 1 = an error.

import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEARN_ROOT = join(REPO_ROOT, "learn");
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function parseArgs(argv) {
  const args = { subject: null, nodes: [], dryRun: false, json: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--subject") args.subject = argv[++i];
    else if (a === "--node") args.nodes.push(argv[++i]);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--json") args.json = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

const USAGE = `Usage: node scripts/reset-nodes.mjs --subject <subject> --node <id> [--node <id> ...] [--dry-run] [--json]`;

// Split a markdown file into its `---` frontmatter block and the body.
function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) throw new Error("missing frontmatter");
  const close = text.indexOf("\n---", 4);
  if (close === -1) throw new Error("unterminated frontmatter");
  const fmEnd = text.indexOf("\n", close + 1);
  return {
    fm: text.slice(4, close),
    body: fmEnd === -1 ? "" : text.slice(fmEnd + 1),
  };
}

// Rewrite the scalar `status` / `updated` lines inside a frontmatter block.
function setScalarLines(fm, values) {
  const lines = fm.split("\n");
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp(`^${key}:`);
    const idx = lines.findIndex((l) => re.test(l));
    if (idx === -1) throw new Error(`frontmatter has no \`${key}\` field`);
    lines[idx] = `${key}: ${value}`;
  }
  return lines.join("\n");
}

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(join(dir, entry.name));
    else n += 1;
  }
  return n;
}

function removeTarget(path) {
  const rel = path.replace(`${REPO_ROOT}/`, "");
  if (!existsSync(path)) return { path: rel, files: 0, removed: false };
  const isDir = statSync(path).isDirectory();
  const files = isDir ? countFiles(path) : 1;
  rmSync(path, { recursive: isDir, force: true });
  return { path: rel, files, removed: true };
}

function resetNode(subject, id, { dryRun, updated }) {
  if (!SAFE_ID.test(id) || id.includes("..")) throw new Error(`unsafe node id: ${id}`);

  const container = ["mdx", "md"].map((e) => join(LEARN_ROOT, subject, "nodes", `${id}.${e}`)).find(existsSync);
  if (!container) throw new Error(`no node container: learn/${subject}/nodes/${id}.mdx`);

  const { fm, body } = splitFrontmatter(readFileSync(container, "utf8"));
  const nextFm = setScalarLines(fm, { status: "nodes-written", updated });

  const targetPaths = [
    join(LEARN_ROOT, subject, "nodes", id),
    join(LEARN_ROOT, subject, "lessons", id),
    join(LEARN_ROOT, subject, "output", id),
  ];

  const removed = [];
  for (const p of targetPaths) {
    if (dryRun) {
      const rel = p.replace(`${REPO_ROOT}/`, "");
      removed.push(
        existsSync(p) ? { path: rel, files: countFiles(p), removed: false } : { path: rel, files: 0, removed: false },
      );
    } else {
      removed.push(removeTarget(p));
    }
  }

  if (!dryRun) writeFileSync(container, `---\n${nextFm}\n---\n${body}`, "utf8");
  return { id, container: container.replace(`${REPO_ROOT}/`, ""), status: "nodes-written", updated, removed };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`${err.message}\n${USAGE}`);
    process.exit(1);
  }
  if (args.help) {
    console.log(USAGE);
    return;
  }
  const fail = (msg) => {
    if (args.json) console.log(JSON.stringify({ subject: args.subject, error: msg }, null, 2));
    else console.error(msg);
    process.exit(1);
  };

  if (!args.subject) fail("missing --subject");
  if (!existsSync(join(LEARN_ROOT, args.subject))) fail(`subject not found: learn/${args.subject}/`);
  if (args.nodes.length === 0) fail("no --node given");

  const unique = [...new Set(args.nodes)];
  const now = new Date();
  const updated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const nodes = [];
  for (const id of unique) {
    try {
      nodes.push(resetNode(args.subject, id, { dryRun: args.dryRun, updated }));
    } catch (err) {
      fail(err.message);
    }
  }

  if (args.json) {
    console.log(JSON.stringify({ subject: args.subject, dryRun: args.dryRun, nodes }, null, 2));
    return;
  }

  const verb = args.dryRun ? "would reset" : "reset";
  for (const n of nodes) {
    const parts = n.removed.filter((r) => r.files > 0).map((r) => `${r.path} (${r.files})`);
    console.log(`${verb} ${n.id} -> nodes-written; ${parts.length ? `removed ${parts.join(", ")}` : "nothing to remove"}`);
  }
  console.log(`\n${args.dryRun ? "DRY RUN — no changes written." : "Done."} ${nodes.length} node(s).`);
  if (!args.dryRun) {
    console.log("Step files are gone; run /batch-nodes (or /nodes then /teach) to regenerate. verify.mjs will flag dag-step-exists until then.");
  }
}

main();

#!/usr/bin/env node
/**
 * digest-status.mjs — List or update digest status fields.
 *
 * Usage:
 *   node scripts/digest-status.mjs <subject>                           # list all digests, who uses them
 *   node scripts/digest-status.mjs <subject> --set absorbed            # mark all as absorbed
 *   node scripts/digest-status.mjs <subject> --set pending             # reset all to pending
 *   node scripts/digest-status.mjs <subject> --set skipped --reason "…"  # mark all as deliberately unused
 *   node scripts/digest-status.mjs <subject> --from pending --to absorbed  # only pending → absorbed
 *   node scripts/digest-status.mjs <subject> --from absorbed --to pending  # only absorbed → pending
 *
 * Frontmatter is parsed with gray-matter, the repository's single YAML parser.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import matter from "gray-matter";

const args = process.argv.slice(2);
const subject = args.find((a) => !a.startsWith("--"));
if (!subject) {
  console.error("Usage: node scripts/digest-status.mjs <subject> [options]");
  process.exit(1);
}

const digestsDir = join("learn", subject, "digests");
if (!existsSync(digestsDir)) {
  console.error(`Directory not found: ${digestsDir}`);
  process.exit(1);
}

const setIdx = args.indexOf("--set");
const fromIdx = args.indexOf("--from");
const toIdx = args.indexOf("--to");
const reasonIdx = args.indexOf("--reason");
const dryRun = args.includes("--dry-run");

const setTarget = setIdx !== -1 ? args[setIdx + 1] : null;
const fromStatus = fromIdx !== -1 ? args[fromIdx + 1] : null;
const toStatus = toIdx !== -1 ? args[toIdx + 1] : null;
const skipReason = reasonIdx !== -1 ? (args[reasonIdx + 1] ?? "").trim() : "";

if ((setTarget === "skipped" || toStatus === "skipped") && !skipReason) {
  console.error('--set skipped / --to skipped requires --reason "<why it is not used>"');
  process.exit(1);
}

if (setTarget && (fromStatus || toStatus)) {
  console.error("--set cannot be combined with --from/--to");
  process.exit(1);
}
if (fromStatus && !toStatus) {
  console.error("--from requires --to");
  process.exit(1);
}

const files = readdirSync(digestsDir).filter(
  (file) => file.endsWith(".md") && !file.endsWith(".part.md"),
);

if (files.length === 0) {
  console.log(`No digests found in ${digestsDir}`);
  process.exit(0);
}

const nodeRefs = new Map();
const nodesDir = join("learn", subject, "nodes");
if (existsSync(nodesDir)) {
  for (const file of readdirSync(nodesDir)) {
    if (!file.endsWith(".md")) continue;
    const parsed = matter(readFileSync(join(nodesDir, file), "utf-8"));
    const nodeId = parsed.data.id || basename(file, ".md");
    const declared = Array.isArray(parsed.data.digests) ? parsed.data.digests : [];
    for (const name of declared) {
      if (typeof name !== "string" || !name.trim()) continue;
      const key = name.trim();
      if (!nodeRefs.has(key)) nodeRefs.set(key, []);
      nodeRefs.get(key).push(nodeId);
    }
  }
}

const supplementParents = new Map();

let updated = 0;
let skipped = 0;
const results = [];

function normalizeDates(data) {
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) data[key] = value.toISOString().slice(0, 10);
  }
}

for (const file of files) {
  const filePath = join(digestsDir, file);
  const parsed = matter(readFileSync(filePath, "utf-8"));
  normalizeDates(parsed.data);
  const stem = basename(file, ".md");
  const currentStatus = parsed.data.status || "pending";
  for (const raw of Array.isArray(parsed.data.supplements) ? parsed.data.supplements : []) {
    if (typeof raw !== "string") continue;
    const supplement = basename(raw.trim().replace(/^\.\//, "").split("#")[0], ".md");
    if (!supplement) continue;
    const key = `${supplement}.md`;
    if (!supplementParents.has(key)) supplementParents.set(key, []);
    supplementParents.get(key).push(stem);
  }

  if (!setTarget && !fromStatus) {
    results.push({
      stem,
      status: currentStatus,
      reason: String(parsed.data.skip_reason ?? "").trim(),
      nodes: nodeRefs.get(file) || [],
    });
    continue;
  }

  let newStatus = null;
  if (setTarget) {
    if (currentStatus !== setTarget) newStatus = setTarget;
  } else if (currentStatus === fromStatus) {
    newStatus = toStatus;
  }

  if (newStatus) {
    parsed.data.status = newStatus;
    if (newStatus === "absorbed") {
      parsed.data.absorbed_at = new Date().toISOString().slice(0, 10);
      delete parsed.data.skip_reason;
    } else {
      delete parsed.data.absorbed_at;
    }
    if (newStatus === "skipped") parsed.data.skip_reason = skipReason;
    else delete parsed.data.skip_reason;
    if (!dryRun) writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
    updated += 1;
    results.push({ stem, status: `${currentStatus} → ${newStatus}` });
  } else {
    skipped += 1;
    results.push({ stem, status: currentStatus });
  }
}

if (!setTarget && !fromStatus) {
  for (const result of results) {
    if (result.nodes.length > 0) continue;
    const parents = supplementParents.get(`${result.stem}.md`) || [];
    const inherited = [...new Set(parents.flatMap((parent) => nodeRefs.get(`${parent}.md`) || []))];
    if (inherited.length > 0) {
      result.nodes = inherited;
      result.via = parents.join(", ");
    }
  }

  console.log(`\nDigests in ${digestsDir}:\n`);
  const maxLen = Math.max(...results.map((result) => result.stem.length));
  const maxStatus = Math.max(...results.map((result) => String(result.status).length));
  for (const result of results) {
    const icon = result.status === "absorbed" ? "✓" : result.status === "pending" ? "○" : "–";
    const nodes = result.nodes.length > 0 ? result.nodes.join(", ") : "—";
    const via = result.via ? ` (via ${result.via})` : "";
    const reason = result.reason ? `  [${result.reason}]` : "";
    console.log(
      `  ${icon} ${result.stem.padEnd(maxLen + 2)} ${String(result.status).padEnd(maxStatus + 2)} ${nodes}${via}${reason}`,
    );
  }

  const count = (status) => results.filter((result) => result.status === status).length;
  const orphaned = results.filter((result) => result.status === "absorbed" && result.nodes.length === 0).length;
  console.log(
    `\nTotal: ${results.length} digests — ${count("absorbed")} absorbed, ${count("pending")} pending, ${count("skipped")} skipped; ${orphaned} absorbed without a node`,
  );
} else {
  for (const result of results) {
    if (result.status.includes("→")) console.log(`  ${result.stem}: ${result.status}`);
  }
  console.log(`\n${dryRun ? "[DRY RUN] " : ""}Updated: ${updated}, Skipped: ${skipped}`);
}

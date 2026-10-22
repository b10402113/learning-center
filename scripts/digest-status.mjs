#!/usr/bin/env node
/**
 * digest-status.mjs — List or update digest status fields.
 *
 * Usage:
 *   node scripts/digest-status.mjs <subject>                           # list all digests
 *   node scripts/digest-status.mjs <subject> --set absorbed            # mark all as absorbed
 *   node scripts/digest-status.mjs <subject> --set pending             # reset all to pending
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
const dryRun = args.includes("--dry-run");

const setTarget = setIdx !== -1 ? args[setIdx + 1] : null;
const fromStatus = fromIdx !== -1 ? args[fromIdx + 1] : null;
const toStatus = toIdx !== -1 ? args[toIdx + 1] : null;

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

  if (!setTarget && !fromStatus) {
    results.push({ stem, status: currentStatus });
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
    } else {
      delete parsed.data.absorbed_at;
    }
    if (!dryRun) writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
    updated += 1;
    results.push({ stem, status: `${currentStatus} → ${newStatus}` });
  } else {
    skipped += 1;
    results.push({ stem, status: currentStatus });
  }
}

if (!setTarget && !fromStatus) {
  console.log(`\nDigests in ${digestsDir}:\n`);
  const maxLen = Math.max(...results.map((result) => result.stem.length));
  for (const result of results) {
    const icon = result.status === "absorbed" ? "✓" : result.status === "pending" ? "○" : "?";
    console.log(`  ${icon} ${result.stem.padEnd(maxLen + 2)} ${result.status}`);
  }
  console.log(`\nTotal: ${results.length} digests`);
} else {
  for (const result of results) {
    if (result.status.includes("→")) console.log(`  ${result.stem}: ${result.status}`);
  }
  console.log(`\n${dryRun ? "[DRY RUN] " : ""}Updated: ${updated}, Skipped: ${skipped}`);
}

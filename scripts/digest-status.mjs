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
 * Handles digests that lack the status field (treats them as pending).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

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

// Parse flags
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

// Collect digest files
const files = readdirSync(digestsDir).filter(
  (f) => f.endsWith(".md") && !f.endsWith(".part.md")
);

if (files.length === 0) {
  console.log(`No digests found in ${digestsDir}`);
  process.exit(0);
}

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, body: content };
  const yaml = match[1];
  const body = content.slice(match[0].length);
  const data = {};
  let currentKey = null;
  let inArray = false;

  for (const line of yaml.split("\n")) {
    const kvMatch = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === "" || val === "[]") {
        // could be start of array on next lines
        data[currentKey] = [];
        inArray = true;
      } else if (val.startsWith("[")) {
        data[currentKey] = JSON.parse(val);
        inArray = false;
      } else {
        data[currentKey] = val;
        inArray = false;
      }
    } else if (inArray && currentKey && line.match(/^\s+-\s+(.*)$/)) {
      const itemMatch = line.match(/^\s+-\s+(.*)$/);
      if (itemMatch) data[currentKey].push(itemMatch[1]);
    }
  }
  return { data, body };
}

function buildFrontmatter(data, body) {
  const lines = ["---"];
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of val) lines.push(`  - ${item}`);
      }
    } else {
      lines.push(`${key}: ${val}`);
    }
  }
  lines.push("---");
  return lines.join("\n") + body;
}

// Process
let updated = 0;
let skipped = 0;
const results = [];

for (const file of files) {
  const filePath = join(digestsDir, file);
  const content = readFileSync(filePath, "utf-8");
  const { data, body } = parseFrontmatter(content);
  const stem = basename(file, ".md");
  const currentStatus = data.status || "pending";

  // List mode
  if (!setTarget && !fromStatus) {
    results.push({ stem, status: currentStatus });
    continue;
  }

  // Determine target status
  let newStatus = null;
  if (setTarget) {
    if (currentStatus !== setTarget) newStatus = setTarget;
  } else if (fromStatus && toStatus) {
    if (currentStatus === fromStatus) newStatus = toStatus;
  }

  if (newStatus) {
    data.status = newStatus;
    if (newStatus === "absorbed") {
      data.absorbed_at = new Date().toISOString().slice(0, 10);
    } else {
      delete data.absorbed_at;
    }
    if (!dryRun) {
      writeFileSync(filePath, buildFrontmatter(data, body));
    }
    updated++;
    results.push({ stem, status: `${currentStatus} → ${newStatus}` });
  } else {
    skipped++;
    results.push({ stem, status: currentStatus });
  }
}

// Output
if (!setTarget && !fromStatus) {
  // List mode — table
  console.log(`\nDigests in ${digestsDir}:\n`);
  const maxLen = Math.max(...results.map((r) => r.stem.length));
  for (const r of results) {
    const icon = r.status === "absorbed" ? "✓" : r.status === "pending" ? "○" : "?";
    console.log(`  ${icon} ${r.stem.padEnd(maxLen + 2)} ${r.status}`);
  }
  console.log(`\nTotal: ${results.length} digests`);
} else {
  // Update mode — summary
  for (const r of results) {
    if (r.status.includes("→")) {
      console.log(`  ${r.stem}: ${r.status}`);
    }
  }
  console.log(
    `\n${dryRun ? "[DRY RUN] " : ""}Updated: ${updated}, Skipped: ${skipped}`
  );
}

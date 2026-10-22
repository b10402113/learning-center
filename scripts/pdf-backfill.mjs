#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function findPdfs(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findPdfs(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) out.push(full);
  }
  return out;
}

export function backfillPdfs({ root = REPO_ROOT, subject, pdftotext = "pdftotext", dryRun = false }) {
  const subjectDir = join(root, "sources", subject);
  const pdfs = findPdfs(subjectDir).sort();
  const result = { extracted: [], skipped: [], failed: [], wouldExtract: [] };

  for (const pdf of pdfs) {
    const txt = pdf.replace(/\.pdf$/i, ".txt");
    if (existsSync(txt)) {
      result.skipped.push(pdf);
      continue;
    }
    if (dryRun) {
      result.wouldExtract.push(pdf);
      continue;
    }

    mkdirSync(dirname(txt), { recursive: true });
    const temporary = `${txt}.tmp-${process.pid}`;
    const run = spawnSync(pdftotext, [pdf, temporary], { encoding: "utf8" });
    if (run.error || run.status !== 0) {
      rmSync(temporary, { force: true });
      result.failed.push({
        pdf,
        error: run.error ? run.error.message : (run.stderr || "").trim() || `pdftotext exited ${run.status}`,
      });
      continue;
    }

    renameSync(temporary, txt);
    result.extracted.push(txt);
  }

  return result;
}

function usage() {
  console.error("usage: node scripts/pdf-backfill.mjs --subject <subject> [--dry-run] [--json]");
}

function main(argv) {
  const args = argv.slice(2);
  let subject = null;
  let dryRun = false;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--subject" && index + 1 < args.length) subject = args[++index];
    else if (args[index] === "--dry-run") dryRun = true;
    else if (args[index] === "--json") json = true;
    else if (!args[index].startsWith("--") && !subject) subject = args[index];
  }

  if (!subject) {
    usage();
    process.exit(2);
  }
  if (!existsSync(join(REPO_ROOT, "sources", subject))) {
    console.error(`unknown subject: ${subject}`);
    process.exit(2);
  }

  const result = backfillPdfs({ root: REPO_ROOT, subject, dryRun });

  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    console.log(
      `PDF backfill ${subject}: ${result.extracted.length} extracted, ${result.skipped.length} skipped, ${result.failed.length} failed${dryRun ? `, ${result.wouldExtract.length} would extract` : ""}`,
    );
    for (const path of result.extracted) console.log(`  extracted ${path}`);
    for (const path of result.wouldExtract) console.log(`  would extract ${path}`);
    for (const failure of result.failed) console.log(`  failed ${failure.pdf}: ${failure.error}`);
  }

  process.exit(result.failed.length > 0 ? 1 : 0);
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const USAGE =
  "Usage: node scripts/coverage-audit.mjs --subject <subject> [--threshold <percent>] [--min-gap <lines>] [--json]";

function parseArgs(argv) {
  const opts = { threshold: 80, minGap: 8, json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--subject") opts.subject = argv[++i];
    else if (arg === "--threshold") opts.threshold = Number(argv[++i]);
    else if (arg === "--min-gap") opts.minGap = Number(argv[++i]);
    else if (arg === "--json") opts.json = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}\n${USAGE}`);
  }
  if (!opts.subject) throw new Error(`Missing --subject\n${USAGE}`);
  if (!Number.isFinite(opts.threshold) || opts.threshold < 0 || opts.threshold > 100) {
    throw new Error("--threshold must be a number between 0 and 100");
  }
  if (!Number.isFinite(opts.minGap) || opts.minGap < 1) {
    throw new Error("--min-gap must be a positive integer");
  }
  return opts;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

function countLines(content) {
  if (!content) return 0;
  const lines = content.split("\n").length;
  return content.endsWith("\n") ? lines - 1 : lines;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function discoverCourseFiles(subjectRoot) {
  const roots = [];
  const direct = path.join(subjectRoot, "course");
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) roots.push(direct);

  for (const entry of fs.readdirSync(subjectRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (["course", "supplement", "raw"].includes(entry.name)) continue;
    const nested = path.join(subjectRoot, entry.name, "course");
    if (fs.existsSync(nested) && fs.statSync(nested).isDirectory()) roots.push(nested);
  }

  const files = [];
  for (const root of roots) {
    for (const full of walk(root, (file) => file.endsWith(".txt"))) {
      files.push({ full, rel: toPosix(path.relative(subjectRoot, full)) });
    }
  }

  if (files.length === 0) {
    for (const full of walk(subjectRoot, (file) => file.endsWith(".txt"))) {
      const rel = toPosix(path.relative(subjectRoot, full));
      if (!rel.includes("/")) files.push({ full, rel });
    }
  }

  return files.sort((a, b) => a.rel.localeCompare(b.rel, undefined, { numeric: true }));
}

function collectCitations(nodesDir, subject) {
  const esc = escapeRegExp(subject);
  const patterns = [
    new RegExp(`\\[\\[sources/${esc}/([^#\\]]+)#L(\\d+)(?:-L(\\d+))?\\]\\]`, "g"),
    new RegExp(`<!--\\s*source:\\s*sources/${esc}/([^#\\s]+)#L(\\d+)(?:-L(\\d+))?\\s*-->`, "g"),
  ];

  const ranges = new Map();
  const add = (rel, start, end) => {
    const a = Number(start);
    const b = Number(end || start);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return;
    const key = rel.replaceAll("\\", "/");
    if (!ranges.has(key)) ranges.set(key, []);
    ranges.get(key).push([Math.min(a, b), Math.max(a, b)]);
  };

  for (const file of walk(nodesDir, (f) => f.endsWith(".md"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text))) add(match[1], match[2], match[3]);
    }
  }
  return ranges;
}

function gapRuns(total, coveredSet, minGap) {
  const gaps = [];
  let start = null;
  for (let line = 1; line <= total; line++) {
    if (!coveredSet.has(line)) {
      if (start === null) start = line;
    } else if (start !== null) {
      if (line - start >= minGap) gaps.push([start, line - 1]);
      start = null;
    }
  }
  if (start !== null && total - start + 1 >= minGap) gaps.push([start, total]);
  return gaps;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  const subjectRoot = path.join(root, "sources", opts.subject);
  const nodesDir = path.join(root, "learn", opts.subject, "nodes");

  if (!fs.existsSync(subjectRoot)) throw new Error(`No source folder: ${subjectRoot}`);
  if (!fs.existsSync(nodesDir)) throw new Error(`No nodes folder: ${nodesDir}`);

  const courseFiles = discoverCourseFiles(subjectRoot);
  if (courseFiles.length === 0) throw new Error(`No course .txt files under ${subjectRoot}`);

  const citationRanges = collectCitations(nodesDir, opts.subject);
  const byRel = new Map(courseFiles.map((file) => [file.rel, file]));
  const unmatched = [...citationRanges.keys()]
    .filter((rel) => !byRel.has(rel) && (rel.includes("/course/") || rel.startsWith("course/")))
    .sort();

  let totalLines = 0;
  let totalCovered = 0;
  const files = [];

  for (const file of courseFiles) {
    const content = fs.readFileSync(file.full, "utf8");
    const lines = countLines(content);
    const covered = new Set();
    for (const [a, b] of citationRanges.get(file.rel) || []) {
      for (let line = Math.max(1, a); line <= Math.min(lines, b); line++) covered.add(line);
    }
    totalLines += lines;
    totalCovered += covered.size;
    files.push({
      file: file.rel,
      path: toPosix(path.relative(root, file.full)),
      lines,
      covered: covered.size,
      pct: lines === 0 ? 100 : (covered.size / lines) * 100,
      ranges: (citationRanges.get(file.rel) || []).length,
      gaps: gapRuns(lines, covered, opts.minGap),
    });
  }

  const totalPct = totalLines === 0 ? 100 : (totalCovered / totalLines) * 100;
  const pass = totalPct >= opts.threshold;
  const sorted = [...files].sort((a, b) => a.pct - b.pct || a.file.localeCompare(b.file));

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          subject: opts.subject,
          threshold: opts.threshold,
          minGap: opts.minGap,
          pass,
          total: { lines: totalLines, covered: totalCovered, pct: totalPct },
          files: sorted,
          unmatched,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`Coverage audit — ${opts.subject}`);
    console.log(`Course files: ${courseFiles.length}   Threshold: ${opts.threshold}%   Min gap: ${opts.minGap} lines`);
    console.log("");
    console.log(`${totalPct.toFixed(1).padStart(5)}%  ${String(totalCovered).padStart(5)}/${String(totalLines).padEnd(5)}  TOTAL`);
    console.log("");
    for (const file of sorted) {
      console.log(
        `${file.pct.toFixed(1).padStart(5)}%  ${String(file.covered).padStart(5)}/${String(file.lines).padEnd(5)}  ${file.file}`,
      );
    }
    const withGaps = sorted.filter((file) => file.gaps.length > 0);
    if (withGaps.length > 0) {
      console.log("");
      console.log(`Uncovered runs >= ${opts.minGap} lines`);
      for (const file of withGaps) {
        console.log(`\n${file.file}`);
        for (const [a, b] of file.gaps) console.log(`  L${a}-L${b}  (${b - a + 1} lines)`);
      }
    }
    if (unmatched.length > 0) {
      console.log("");
      console.log("Citations that do not match a course file");
      for (const rel of unmatched) console.log(`  ${rel}`);
    }
    console.log("");
    console.log(pass ? `PASS (${totalPct.toFixed(1)}% >= ${opts.threshold}%)` : `FAIL (${totalPct.toFixed(1)}% < ${opts.threshold}%)`);
  }

  process.exit(pass ? 0 : 1);
}

main();

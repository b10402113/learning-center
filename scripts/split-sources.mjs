#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const LONG_SOURCE_LINES = 3000;
export const LONG_SOURCE_BYTES = 250 * 1024;
export const MIN_CHUNK_LINES = 200;
export const MAX_CHUNK_LINES = 2000;
export const TARGET_CHUNK_LINES = 1500;

const CHAPTER_HEADING = /^\s{0,3}(?:#{1,2}\s+)?(?:chapter|part|book)\s+(?:\d+|[ivxlcdm]+)(?:\s*$|[.:]\s*|\s+[A-Z])/i;
const FRONT_BACK_HEADING =
  /^\s{0,3}(?:#{1,2}\s+)?(?:preface|foreword|contents|table of contents|acknowledgments|about the authors|references|bibliography|index|appendix)\b/i;
const MARKDOWN_HEADING = /^\s{0,3}(#{1,6})\s+\S/;
const NUMBERED_HEADING = /^\s{0,3}\d+(?:\.\d+){1,3}\.?\s+[A-Z][A-Za-z0-9 ,/&()'’\-]{3,}$/;
const UPPER_HEADING = /^[A-Z0-9][A-Z0-9\s&,'’\-–—:()/.]{2,80}$/;

export function splitLines(text) {
  const normalized = String(text).replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

export function sourceStats(text) {
  const lines = splitLines(text);
  return { lines: lines.length, bytes: Buffer.byteLength(String(text), "utf8") };
}

export function isLongSource({ lines, bytes }) {
  return lines > LONG_SOURCE_LINES || bytes > LONG_SOURCE_BYTES;
}

function hasLetter(line) {
  return /[A-Za-z]/.test(line);
}

function headingLevel(line) {
  const text = String(line).trim();
  if (!text) return 0;

  const markdown = text.match(MARKDOWN_HEADING);
  if (markdown) return markdown[1].length === 1 ? 1 : 2;

  if (CHAPTER_HEADING.test(text) || FRONT_BACK_HEADING.test(text)) return 1;
  if (NUMBERED_HEADING.test(text)) return 2;

  if (UPPER_HEADING.test(text) && hasLetter(text)) {
    const letters = text.replace(/[^A-Za-z]/g, "");
    if (letters.length >= 3 && !/[.!?]$/.test(text)) return 2;
  }

  return 0;
}

function findHeadings(lines) {
  const headings = [];
  let inCodeFence = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;
    const level = headingLevel(line);
    if (level > 0) headings.push({ index, level });
  }
  return headings;
}

function paragraphStarts(lines, from, to) {
  const starts = [];
  for (let index = from + 1; index < to; index += 1) {
    if (lines[index].trim() && !lines[index - 1].trim()) starts.push(index);
  }
  return starts;
}

function nearestCandidate(candidates, desired, min, max) {
  let best = null;
  for (const candidate of candidates) {
    if (candidate < min || candidate > max) continue;
    if (best === null || Math.abs(candidate - desired) < Math.abs(best - desired)) best = candidate;
  }
  return best;
}

function chunkStartsForSpan({ lines, start, end, sectionStarts }) {
  const length = end - start;
  if (length <= MAX_CHUNK_LINES) return [start];

  const count = Math.ceil(length / MAX_CHUNK_LINES);
  const starts = [start];
  const paragraphs = paragraphStarts(lines, start, end);
  for (let part = 1; part < count; part += 1) {
    const desired = start + Math.round((length * part) / count);
    const previous = starts[starts.length - 1];
    const remaining = count - part;
    const min = Math.max(previous + MIN_CHUNK_LINES, end - remaining * MAX_CHUNK_LINES);
    const max = Math.min(previous + MAX_CHUNK_LINES, end - remaining * MIN_CHUNK_LINES);
    let cut = min <= max ? nearestCandidate(sectionStarts, desired, min, max) : null;
    if (cut === null && min <= max) cut = nearestCandidate(paragraphs, desired, min, max);
    if (cut === null || cut <= previous) cut = desired;
    if (cut > previous && cut < end) starts.push(cut);
  }
  return starts;
}

function paragraphChunks(lines) {
  const starts = [0];
  const total = lines.length;
  const paragraphs = paragraphStarts(lines, 0, total);
  while (starts[starts.length - 1] < total) {
    const last = starts[starts.length - 1];
    const desired = last + TARGET_CHUNK_LINES;
    if (desired >= total) break;
    const min = last + MIN_CHUNK_LINES;
    const max = Math.min(last + MAX_CHUNK_LINES, total - MIN_CHUNK_LINES);
    const cut = nearestCandidate(paragraphs, desired, min, max);
    starts.push(cut === null ? desired : cut);
  }
  return starts;
}

function toPartList(lines, starts) {
  const total = lines.length;
  const parts = [];
  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index] + 1;
    const end = index + 1 < starts.length ? starts[index + 1] : total;
    if (end < start) throw new Error(`invalid chunk boundary at line ${start}`);
    const heading = lines.slice(start - 1, end).find((line) => line.trim()) ?? "";
    parts.push({
      part: index + 1,
      start,
      end,
      lines: end - start + 1,
      heading: heading.trim().slice(0, 80),
    });
  }
  return parts;
}

function normaliseBoundaries(boundaries, total) {
  if (!Array.isArray(boundaries) || boundaries.length === 0) throw new Error("boundaries must be a non-empty array");
  const starts = boundaries.map((value) => Number(value));
  if (!starts.every((value) => Number.isInteger(value) && value >= 1)) {
    throw new Error("boundaries must be positive integers");
  }
  if (starts[0] !== 1) throw new Error("boundaries must start at line 1");
  for (let index = 1; index < starts.length; index += 1) {
    if (starts[index] <= starts[index - 1]) throw new Error("boundaries must be strictly increasing");
  }
  if (starts[starts.length - 1] > total) throw new Error("boundaries exceed the source line count");
  return starts.map((value) => value - 1);
}

export function planChunks(text, { boundaries = null } = {}) {
  const lines = splitLines(text);
  if (lines.length === 0) throw new Error("source is empty");

  let starts;
  if (boundaries) {
    starts = normaliseBoundaries(boundaries, lines.length);
  } else {
    const headings = findHeadings(lines);
    const chapterStarts = headings.filter((heading) => heading.level === 1).map((heading) => heading.index);
    if (chapterStarts.length === 0) {
      starts = paragraphChunks(lines);
    } else {
      if (chapterStarts[0] !== 0) chapterStarts.unshift(0);
      const bounds = [...chapterStarts, lines.length];
      const lengths = chapterStarts.map((_, index) => bounds[index + 1] - bounds[index]);
      const groupStarts = [0];
      for (let index = 1; index < chapterStarts.length; index += 1) {
        const previousSmall = lengths[index - 1] < MIN_CHUNK_LINES;
        const currentSmall = lengths[index] < MIN_CHUNK_LINES;
        const isLast = index === chapterStarts.length - 1;
        if (previousSmall) continue;
        if (currentSmall && isLast) continue;
        groupStarts.push(chapterStarts[index]);
      }
      groupStarts.push(lines.length);
      starts = [];
      for (let index = 0; index + 1 < groupStarts.length; index += 1) {
        const start = groupStarts[index];
        const end = groupStarts[index + 1];
        const sectionStarts = headings
          .filter((heading) => heading.level === 2 && heading.index > start && heading.index < end)
          .map((heading) => heading.index);
        starts.push(...chunkStartsForSpan({ lines, start, end, sectionStarts }));
      }
      if (starts.length === 0 || starts[0] !== 0) starts.unshift(0);
    }
  }

  const parts = toPartList(lines, starts);
  const sum = parts.reduce((total, part) => total + part.lines, 0);
  if (parts[0].start !== 1 || parts[parts.length - 1].end !== lines.length || sum !== lines.length) {
    throw new Error("chunk boundaries do not tile the source");
  }
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index].start !== parts[index - 1].end + 1) throw new Error("chunk boundaries have a gap or overlap");
  }
  return { lines, parts };
}

export function planSource({ root = REPO_ROOT, path, boundaries = null }) {
  const text = readFileSync(path, "utf8");
  const stats = sourceStats(text);
  const rel = relative(root, path).split("\\").join("/");
  const stem = basename(path).replace(/\.txt$/i, "");
  const plan = {
    path,
    rel,
    stem,
    text,
    totalLines: stats.lines,
    bytes: stats.bytes,
    long: isLongSource(stats),
    manifestRel: `${dirname(rel)}/${stem}.parts.json`.replace(/^\.\//, ""),
    parts: [],
  };
  if (!plan.long) return plan;

  const { lines, parts } = planChunks(text, { boundaries });
  plan.lines = lines;
  const directory = dirname(rel);
  plan.parts = parts.map((part) => ({
    ...part,
    file: `${stem}.${part.part}.part.txt`,
    rel: `${directory}/${stem}.${part.part}.part.txt`,
  }));
  return plan;
}

function walkTextSources(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkTextSources(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".txt") && !/\.\d+\.part\.txt$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

export function planSources({ root = REPO_ROOT, subject, boundaries = null }) {
  const subjectDir = join(root, "sources", subject);
  if (!existsSync(subjectDir)) throw new Error(`unknown subject: ${subject}`);
  return walkTextSources(subjectDir)
    .sort()
    .map((path) => planSource({ root, path, boundaries }));
}

export function renderTable(plans) {
  const lines = [];
  const long = plans.filter((plan) => plan.long);
  if (long.length === 0) {
    lines.push("No source exceeds the split threshold (>3000 lines or >250 KB).");
    return `${lines.join("\n")}\n`;
  }
  for (const plan of long) {
    lines.push(`${plan.rel} — ${plan.totalLines} lines, ${plan.parts.length} part(s)`);
    lines.push("  part  original lines   file lines  target file  first line");
    for (const part of plan.parts) {
      lines.push(
        `  ${String(part.part).padStart(4)}  ${String(`${part.start}-${part.end}`).padEnd(14)}  ${String(part.lines).padStart(10)}  ${part.rel}  ${part.heading}`,
      );
    }
  }
  return `${lines.join("\n")}\n`;
}

function writeParts({ root, plan }) {
  const directory = dirname(plan.path);
  const manifestPath = join(root, plan.manifestRel);

  const existing = plan.parts.filter((part) => existsSync(join(directory, part.file)));
  if (existing.length === plan.parts.length && existsSync(manifestPath)) {
    return { written: [], skipped: true };
  }
  if (existing.length > 0 || existsSync(manifestPath)) {
    throw new Error(`refusing to overwrite existing parts for ${plan.rel}`);
  }

  const written = [];
  try {
    for (const part of plan.parts) {
      const target = join(directory, part.file);
      const content = `${plan.lines.slice(part.start - 1, part.end).join("\n")}\n`;
      writeFileSync(target, content);
      written.push(target);
      const actual = sourceStats(content).lines;
      if (actual !== part.lines) {
        throw new Error(`${part.rel} wrote ${actual} lines, expected ${part.lines}`);
      }
    }

    const manifest = {
      text: plan.rel,
      total_lines: plan.totalLines,
      parts: plan.parts.map((part) => ({
        part: part.part,
        file: part.file,
        start: part.start,
        end: part.end,
        lines: part.lines,
      })),
    };
    mkdirSync(dirname(manifestPath), { recursive: true });
    const temporary = `${manifestPath}.tmp-${process.pid}`;
    writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
    renameSync(temporary, manifestPath);

    rmSync(plan.path);
    return { written, skipped: false, manifest: manifestPath, deleted: plan.path };
  } catch (error) {
    for (const path of written) rmSync(path, { force: true });
    rmSync(manifestPath, { force: true });
    throw error;
  }
}

export function applySplit({ root = REPO_ROOT, subject, boundaries = null }) {
  const plans = planSources({ root, subject, boundaries });
  const result = { written: [], skipped: [], failed: [], plans };
  for (const plan of plans) {
    if (!plan.long) {
      result.skipped.push({ source: plan.rel, reason: "short" });
      continue;
    }
    try {
      const outcome = writeParts({ root, plan });
      if (outcome.skipped) result.skipped.push({ source: plan.rel, reason: "parts-exist" });
      else result.written.push({ source: plan.rel, parts: plan.parts.length, deleted: outcome.deleted });
    } catch (error) {
      result.failed.push({ source: plan.rel, error: error.message });
    }
  }
  return result;
}

function readBoundaries(path) {
  if (!path) return null;
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.boundaries)) return parsed.boundaries;
  throw new Error("boundaries file must be a JSON array or { boundaries: [...] }");
}

function usage() {
  console.error(
    "usage: node scripts/split-sources.mjs --subject <subject> (--dry-run | --apply) [--boundaries <file>] [--root <dir>] [--json]",
  );
}

function main(argv) {
  const args = argv.slice(2);
  let subject = null;
  let root = REPO_ROOT;
  let dryRun = false;
  let apply = false;
  let json = false;
  let boundaryPath = null;

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--subject" && index + 1 < args.length) subject = args[++index];
    else if (args[index] === "--root" && index + 1 < args.length) root = resolve(args[++index]);
    else if (args[index] === "--dry-run") dryRun = true;
    else if (args[index] === "--apply") apply = true;
    else if (args[index] === "--json") json = true;
    else if (args[index] === "--boundaries" && index + 1 < args.length) boundaryPath = args[++index];
    else if (!args[index].startsWith("--") && !subject) subject = args[index];
  }

  if (!subject || (dryRun && apply)) {
    usage();
    process.exit(2);
  }
  if (!dryRun && !apply) dryRun = true;

  let boundaries;
  try {
    boundaries = readBoundaries(boundaryPath);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  try {
    if (dryRun) {
      const plans = planSources({ root, subject, boundaries });
      if (json) {
        const portable = plans.map(({ text, lines, ...plan }) => plan);
        process.stdout.write(`${JSON.stringify(portable, null, 2)}\n`);
      } else {
        process.stdout.write(renderTable(plans));
      }
      process.exit(0);
    }

    const result = applySplit({ root, subject, boundaries });
    if (json) {
      process.stdout.write(`${JSON.stringify({ ...result, plans: undefined }, null, 2)}\n`);
    } else {
      console.log(
        `split-sources ${subject}: ${result.written.length} applied, ${result.skipped.length} skipped, ${result.failed.length} failed`,
      );
      for (const item of result.written) console.log(`  split ${item.source} into ${item.parts} part(s)`);
      for (const item of result.skipped) console.log(`  skipped ${item.source} (${item.reason})`);
      for (const item of result.failed) console.log(`  failed ${item.source}: ${item.error}`);
    }
    process.exit(result.failed.length > 0 ? 1 : 0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

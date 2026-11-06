#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { countArticleCharacters } from "../src/article.mjs";
import { normalizeStepPlan } from "../src/article-agent-bridge.mjs";
import { maxQuestionsFor, validateQuizPayload } from "../src/quiz.mjs";
import { CITABLE_ROLES, courseCharacterCount, nodeBaseline, parseSourceRole } from "../src/source-layout.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED_NODE_STATUS = new Set(["draft", "confirmed", "written"]);
const ALLOWED_DIGEST_STATUS = new Set(["pending", "absorbed", "skipped"]);
const NODE_FM = [
  "id",
  "title",
  "subject",
  "tier",
  "order",
  "status",
  "goal",
  "digests",
  "steps",
  "created",
  "updated",
];
const STEP_ENTRY_KEYS = ["id", "purpose", "sources"];
const FORBIDDEN_STEP_KEYS = ["deps", "type", "order"];
const DERIVED_COMMENT = /^<!--\s*derived\s*-->$/;
const SOURCE_COMMENT = /^<!--\s*source:\s*sources\/.+#L\d+(?:-L\d+)?\s*-->$/;
const MAX_PURPOSE_CHARS = 120;
const CJK_SENTENCE_END = /[。！？]/;
const ASCII_SENTENCE_BOUNDARY = /[.!?](?=\s+\S)/;
const QUIZ_MIN_OPTIONS = 2;
const QUIZ_MAX_OPTIONS = 5;

class Report {
  constructor() {
    this.failures = [];
    this.flags = [];
  }

  fail(file, line, checkId, message) {
    this.failures.push({ file: file ?? "", line: line ?? 0, checkId, message });
  }

  flag(file, checkId, message) {
    this.flags.push({ file: file ?? "", checkId, message });
  }

  get hasFailures() {
    return this.failures.length > 0;
  }
}

const markdownCache = new Map();

function readMarkdown(path) {
  if (markdownCache.has(path)) return markdownCache.get(path);
  let result;
  try {
    const { data, content } = matter(readFileSync(path, "utf8"));
    result = { data, body: content };
  } catch (error) {
    result = { data: {}, body: "", error: error.message };
  }
  markdownCache.set(path, result);
  return result;
}

function rel(root, path) {
  return path.slice(root.length + 1);
}

function countLines(text) {
  if (!text) return 0;
  return (text.match(/\n/g) || []).length;
}

function countSourceLines(text) {
  if (!text) return 0;
  return countLines(text) + (text.endsWith("\n") ? 0 : 1);
}

function lineSlice(text, start, end) {
  const lines = text.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines.slice(start - 1, end);
}

function isTextSource(file) {
  return ![".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".zip"].includes(extname(file).toLowerCase());
}

function walkFiles(dir, predicate, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, predicate, out);
    else if (entry.isFile() && predicate(entry.name)) out.push(full);
  }
  return out;
}

function scanSubject(root, subject) {
  const subjectDir = join(root, "learn", subject);
  const nodesDir = join(subjectDir, "nodes");

  const nodes = existsSync(nodesDir)
    ? readdirSync(nodesDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => ({
          id: entry.name.replace(/\.md$/, ""),
          name: entry.name,
          path: join(nodesDir, entry.name),
        }))
    : [];

  const steps = [];
  const quizFiles = [];
  if (existsSync(nodesDir)) {
    for (const entry of readdirSync(nodesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const stepDir = join(nodesDir, entry.name);
      for (const file of readdirSync(stepDir, { withFileTypes: true })) {
        if (!file.isFile()) continue;
        if (file.name.endsWith(".md")) {
          steps.push({
            nodeId: entry.name,
            id: file.name.replace(/\.md$/, ""),
            name: file.name,
            path: join(stepDir, file.name),
          });
        } else if (file.name.endsWith(".quiz.json")) {
          quizFiles.push({
            nodeId: entry.name,
            id: file.name.slice(0, -".quiz.json".length),
            name: file.name,
            path: join(stepDir, file.name),
          });
        }
      }
    }
  }

  const digestsDir = join(subjectDir, "digests");
  const digests = existsSync(digestsDir)
    ? readdirSync(digestsDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => ({ name: entry.name, path: join(digestsDir, entry.name) }))
    : [];

  const sourcesRoot = join(root, "sources", subject);
  const sources = walkFiles(sourcesRoot, () => true).map((path) => ({
    path,
    rel: path.slice(sourcesRoot.length + 1),
  }));
  const sourceByRel = new Map(sources.map((source) => [source.rel, source]));
  const manifests = sources
    .filter((source) => source.rel.endsWith(".parts.json"))
    .map((source) => ({ path: source.path, rel: source.rel }));

  return { subjectDir, nodesDir, nodes, steps, quizFiles, digests, sources, sourceByRel, manifests };
}

function parseSourceLink(link) {
  const match = String(link).match(/^\[\[\s*(sources\/[^\]#]+?)(?:\s*#\s*([^\]]+?))?\s*\]\]$/);
  if (!match) return null;
  return { path: match[1].trim(), locator: (match[2] || "").trim() };
}

function parseLocator(locator) {
  const match = String(locator).match(/^L(\d+)(?:-L(\d+))?$/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : start;
  return { start, end };
}

function mergeRanges(ranges) {
  const sorted = ranges.map((range) => ({ ...range })).sort((a, b) => a.start - b.start);
  const merged = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end + 1) last.end = Math.max(last.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

function covers(ranges, start, end) {
  return mergeRanges(ranges).some((range) => range.start <= start && range.end >= end);
}

function digestFor(index, sourcePath) {
  if (index.has(sourcePath)) return index.get(sourcePath);
  let match = null;
  let length = 0;
  for (const [key, value] of index) {
    if (sourcePath.startsWith(`${key}/`) && key.length > length) {
      match = value;
      length = key.length;
    }
  }
  return match;
}

function buildDigestIndex(report, root, subject, scan) {
  const index = new Map();
  const meta = [];

  for (const digest of scan.digests) {
    const file = rel(root, digest.path);
    const parsed = readMarkdown(digest.path);
    if (parsed.error) {
      report.fail(file, 1, "fm-parse", `invalid YAML frontmatter: ${parsed.error}`);
      continue;
    }
    const { data, body } = parsed;

    for (const key of ["source", "source_type", "source_lines", "status"]) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        report.fail(file, 1, "digest-fm", `missing required frontmatter key: ${key}`);
      }
    }
    if (data.status && !ALLOWED_DIGEST_STATUS.has(String(data.status))) {
      report.fail(file, 1, "digest-status", `invalid digest status: ${data.status}`);
    }
    if (String(data.status) === "skipped" && !String(data.skip_reason ?? "").trim()) {
      report.fail(file, 1, "digest-skip-reason", "a skipped digest needs a non-empty skip_reason");
    }

    for (const match of body.matchAll(/\[\[\s*sources\/[^\]]*#([^\]]+?)\s*\]\]/g)) {
      if (!parseLocator(match[1].trim())) {
        report.fail(file, 0, "digest-locator", `locator "#${match[1].trim()}" must be #Lx or #Lx-Ly`);
      }
    }

    for (const match of body.matchAll(/^\s*[-*]\s+`?#L\d+-\d+/gm)) {
      report.fail(file, 0, "digest-locator", `locator "${match[0].trim()}" must be #Lx or #Lx-Ly`);
    }

    const ranges = [];
    for (const match of body.matchAll(/^\s*[-*]\s+`?#L(\d+)(?:-L(\d+))?/gm)) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : start;
      if (start < 1 || end < start) {
        report.fail(file, 0, "digest-range", `invalid line range #L${start}-L${end}`);
        continue;
      }
      ranges.push({ start, end });
    }
    if (ranges.length === 0 && data.source_type !== "image") {
      report.fail(file, 0, "digest-l2-empty", "digest has no L2 line-number map");
    }

    let sourceKey = null;
    if (typeof data.source === "string" && data.source.trim()) {
      const source = resolveDigestSource(root, subject, scan, data.source.trim());
      if (!source) {
        report.fail(file, 1, "digest-source", `digest source "${data.source}" not found under sources/${subject}/`);
      } else {
        sourceKey = `sources/${subject}/${source.rel}`;
        if (extname(source.rel).toLowerCase() === ".pdf") {
          report.fail(file, 1, "digest-source-pdf", "digest must cite extracted .txt, not a PDF");
        } else if (data.source_lines !== undefined) {
          const declared = Number(data.source_lines);
          if (!Number.isFinite(declared)) {
            report.fail(file, 1, "digest-source-lines", `source_lines "${data.source_lines}" is not a number`);
          } else if (source.directory) {
            for (const range of ranges) {
              if (range.end > declared) {
                report.fail(file, 0, "digest-range", `#L${range.start}-L${range.end} exceeds source_lines ${declared}`);
              }
            }
          } else if (isTextSource(source.rel)) {
            const actual = countLines(readFileSync(source.path, "utf8"));
            if (declared !== actual) {
              report.fail(
                file,
                1,
                "digest-source-lines",
                `source_lines ${data.source_lines} does not match ${actual} lines in ${source.rel}`,
              );
            }
            for (const range of ranges) {
              if (range.end > actual) {
                report.fail(file, 0, "digest-range", `#L${range.start}-L${range.end} exceeds ${actual} source lines`);
              }
            }
          }
        }
      }
    }

    meta.push({ file, name: digest.name, data, ranges, sourceKey });

    if (!sourceKey) continue;
    const entry = index.get(sourceKey) || { ranges: [], names: new Set(), rangesByName: new Map() };
    entry.ranges.push(...ranges);
    entry.names.add(digest.name);
    entry.rangesByName.set(digest.name, ranges);
    index.set(sourceKey, entry);
  }

  const byName = new Map(meta.map((entry) => [entry.name, entry]));
  const supplementNames = new Set();
  for (const entry of meta) {
    const supplements = entry.data.supplements;
    if (supplements === undefined || supplements === null) continue;
    if (!Array.isArray(supplements)) {
      report.fail(entry.file, 1, "digest-supplements", "supplements must be a list of digest filenames");
      continue;
    }
    if (entry.data.source_type !== "text") {
      report.fail(entry.file, 1, "digest-supplements", "only text digests may declare supplements");
      continue;
    }
    for (const raw of supplements) {
      const value = typeof raw === "string" ? raw.trim().replace(/^\.\//, "") : "";
      const hash = value.lastIndexOf("#");
      const name = hash === -1 ? value : value.slice(0, hash);
      const locator = hash === -1 ? "" : value.slice(hash + 1).trim();
      if (!name || !locator) {
        report.fail(entry.file, 1, "digest-supplements", "supplements entries must be <digest>.md#L1 or <digest>.md#Lx-Ly");
        continue;
      }
      if (name === entry.name) {
        report.fail(entry.file, 1, "digest-supplements", "a digest cannot supplement itself");
        continue;
      }
      const target = byName.get(name);
      supplementNames.add(name);
      if (!target) {
        report.fail(entry.file, 1, "digest-supplement-missing", `supplements entry "${name}" is not a digest in this subject`);
        continue;
      }
      if (!["codebase", "image"].includes(String(target.data.source_type))) {
        report.fail(entry.file, 1, "digest-supplement-type", `supplements entry "${name}" must be a codebase or image digest`);
        continue;
      }
      if (String(entry.data.status) === "skipped" && String(target.data.status) !== "skipped") {
        report.fail(
          target.file,
          1,
          "digest-supplement-status",
          `"${name}" supplements a skipped digest and must also be skipped`,
        );
      }
      if (locator === "L1") continue;
      const range = parseLocator(locator);
      if (!range) {
        report.fail(entry.file, 1, "digest-supplements", `supplements locator "#${locator}" must be #L1 or #Lx-Ly`);
        continue;
      }
      if (String(target.data.source_type) !== "codebase") {
        report.fail(entry.file, 1, "digest-supplement-type", `supplements entry "${name}" needs #L1; an image digest has no L2 range`);
        continue;
      }
      if (!covers(target.ranges, range.start, range.end)) {
        report.fail(
          entry.file,
          1,
          "digest-supplement-range",
          `supplements range #${locator} falls outside ${name}'s L2 line map`,
        );
      }
    }
  }

  return { index, meta, supplementNames, byName };
}

function resolveDigestSource(root, subject, scan, raw) {
  const clean = raw.replace(/^\.\//, "");
  if (clean.startsWith(`sources/${subject}/`)) {
    const sourceRel = clean.slice(`sources/${subject}/`.length);
    const direct = scan.sourceByRel.get(sourceRel);
    if (direct) return direct;
    const full = join(root, clean);
    if (existsSync(full) && statSync(full).isDirectory()) {
      return { path: full, rel: sourceRel, directory: true };
    }
  }
  if (clean.startsWith("sources/")) {
    return null;
  }
  const stem = clean.replace(/\.[^.]+$/, "");
  const matches = scan.sources.filter((source) => {
    const sourceStem = basename(source.rel).replace(/\.[^.]+$/, "");
    return source.rel === clean || sourceStem === stem;
  });
  return matches.length === 1 ? matches[0] : null;
}

function normalizeSourceRef(root, subject, raw) {
  const clean = String(raw).replace(/^\.\//, "").split("\\").join("/");
  const prefix = `sources/${subject}/`;
  if (clean.startsWith(prefix)) return clean.slice(prefix.length);
  if (clean.startsWith("sources/")) return null;
  if (isAbsolute(clean)) {
    const suffix = relative(join(root, "sources", subject), clean).split("\\").join("/");
    if (suffix && !suffix.startsWith("..")) return suffix;
  }
  return null;
}

function readSourceLayout(root, subject) {
  const file = join(root, "learn", subject, "MEMORY.md");
  if (!existsSync(file)) return null;
  const { data } = readMarkdown(file);
  return typeof data.source_layout === "string" ? data.source_layout.trim() : null;
}

function checkSourceParts(report, root, subject, scan, digestInfo, layout) {
  if (scan.manifests.length === 0) return;

  for (const manifest of scan.manifests) {
    const file = rel(root, manifest.path);
    let data;
    try {
      data = JSON.parse(readFileSync(manifest.path, "utf8"));
    } catch (error) {
      report.fail(file, 1, "source-parts-json", `invalid parts manifest: ${error.message}`);
      continue;
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      report.fail(file, 1, "source-parts-json", "parts manifest must be a JSON object");
      continue;
    }
    if (typeof data.text !== "string" || !data.text.trim()) {
      report.fail(file, 1, "source-parts-text", "parts manifest needs a text path");
      continue;
    }
    const textRel = normalizeSourceRef(root, subject, data.text.trim());
    if (!textRel) {
      report.fail(file, 1, "source-parts-text", `parts manifest text "${data.text}" is not under sources/${subject}/`);
      continue;
    }
    const total = Number(data.total_lines);
    if (!Number.isInteger(total) || total < 1) {
      report.fail(file, 1, "source-parts-total", "parts manifest total_lines must be a positive integer");
      continue;
    }
    if (!Array.isArray(data.parts) || data.parts.length === 0) {
      report.fail(file, 1, "source-parts-list", "parts manifest needs a non-empty parts list");
      continue;
    }

    const original = join(root, "sources", subject, textRel);
    if (existsSync(original)) {
      const actual = countSourceLines(readFileSync(original, "utf8"));
      if (actual !== total) {
        report.fail(file, 1, "source-parts-total", `total_lines ${total} does not match ${actual} lines in ${textRel}`);
      }
    }

    const directory = dirname(textRel).split("\\").join("/");
    const directoryKey = directory === "." ? "" : `${directory}/`;
    const manifestRel = relative(join(root, "sources", subject), manifest.path).split("\\").join("/");
    const datedParts = manifestRel.split("/");
    const datedIndex = datedParts.findIndex((part) => /^\d{8}$/.test(part));
    const datedRel = datedIndex === -1 ? directory : datedParts.slice(0, datedIndex + 1).join("/");
    if (layout === "course-supplement" && parseSourceRole(`sources/${subject}/${manifestRel}`) !== "raw") {
      report.fail(file, 0, "source-parts-location", "a parts manifest must live under raw/ in a course-supplement subject");
    }
    const partBySourceKey = new Map();
    const digestBySourceKey = new Map();
    let previousEnd = 0;
    let sum = 0;
    let valid = true;

    for (const [index, part] of data.parts.entries()) {
      if (!part || typeof part !== "object" || Array.isArray(part)) {
        report.fail(file, 0, "source-parts-list", `parts[${index}] must be an object`);
        valid = false;
        continue;
      }
      if (part.part !== index + 1) {
        report.fail(file, 0, "source-parts-order", `parts[${index}].part must be ${index + 1}`);
        valid = false;
      }
      if (typeof part.file !== "string" || !part.file || basename(part.file) !== part.file) {
        report.fail(file, 0, "source-parts-file", `parts[${index}].file must be a filename`);
        valid = false;
        continue;
      }
      const role = part.role === undefined ? null : String(part.role);
      if (role !== null && !CITABLE_ROLES.includes(role)) {
        report.fail(file, 0, "source-parts-role", `parts[${index}].role must be course or supplement`);
        valid = false;
        continue;
      }
      if (layout === "course-supplement" && role === null) {
        report.fail(file, 0, "source-parts-role", `parts[${index}] needs a role in a course-supplement subject`);
        valid = false;
        continue;
      }
      const start = Number(part.start);
      const end = Number(part.end);
      const lines = Number(part.lines);
      if (![start, end, lines].every((value) => Number.isInteger(value)) || start < 1 || end < start) {
        report.fail(file, 0, "source-parts-range", `parts[${index}] has an invalid line range`);
        valid = false;
        continue;
      }
      if (lines !== end - start + 1) {
        report.fail(file, 0, "source-parts-lines", `parts[${index}].lines must equal ${end - start + 1}`);
        valid = false;
      }
      if (start !== previousEnd + 1) {
        report.fail(
          file,
          0,
          "source-parts-coverage",
          start === previousEnd ? `parts[${index}] overlaps the previous part` : `parts[${index}] leaves a gap before line ${start}`,
        );
        valid = false;
      }
      previousEnd = end;
      sum += lines;

      const partPath = role
        ? join(root, "sources", subject, datedRel, role, part.file)
        : join(root, "sources", subject, directory, part.file);
      if (!existsSync(partPath)) {
        report.fail(file, 0, "source-parts-file", `parts[${index}] file "${part.file}" does not exist`);
        valid = false;
        continue;
      }
      const actual = countLines(readFileSync(partPath, "utf8"));
      if (actual !== lines) {
        report.fail(file, 0, "source-parts-lines", `parts[${index}] ${part.file} has ${actual} lines, manifest says ${lines}`);
        valid = false;
      }

      const key = role
        ? `sources/${subject}/${datedRel}/${role}/${part.file}`
        : `sources/${subject}/${directoryKey}${part.file}`;
      partBySourceKey.set(key, part.part);
      digestBySourceKey.set(key, []);
    }

    if (previousEnd !== total || sum !== total) {
      report.fail(
        file,
        0,
        "source-parts-coverage",
        `parts cover lines 1-${previousEnd} (${sum} lines), manifest says ${total}`,
      );
      valid = false;
    }

    for (const entry of digestInfo.meta) {
      if (typeof entry.data.source !== "string") continue;
      const digestSource = normalizeSourceRef(root, subject, entry.data.source.trim());
      if (!digestSource) continue;
      if (digestSource === textRel) {
        report.fail(
          entry.file,
          1,
          "digest-source-split",
          `digest must cite a part file, not the unsplit source ${data.text}`,
        );
        continue;
      }
      const key = `sources/${subject}/${digestSource}`;
      if (partBySourceKey.has(key)) digestBySourceKey.get(key).push(entry);
    }

    if (!valid) continue;

    for (const [key, partNumber] of partBySourceKey) {
      const entries = digestBySourceKey.get(key) || [];
      if (entries.length === 0) {
        report.fail(file, 0, "source-parts-digest-missing", `part ${partNumber} (${key}) has no digest part`);
      } else if (entries.length > 1) {
        report.fail(
          file,
          0,
          "source-parts-digest-duplicate",
          `part ${partNumber} (${key}) is claimed by ${entries.length} digests`,
        );
      }
      for (const entry of entries) {
        if (entry.data.part !== undefined && Number(entry.data.part) !== partNumber) {
          report.fail(
            entry.file,
            1,
            "source-parts-digest-part",
            `digest part ${entry.data.part} does not match manifest part ${partNumber}`,
          );
        }
      }
    }
  }
}

function checkNoMdx(report, root, subject = null) {
  const learnRoot = subject ? join(root, "learn", subject) : join(root, "learn");
  for (const path of walkFiles(learnRoot, (name) => name.endsWith(".mdx"))) {
    report.fail(rel(root, path), 0, "no-mdx", "the Markdown course tree must not contain .mdx files");
  }
}

function checkProvenanceSource(report, root, file, line, marker) {
  const comment = marker.slice(4, -3).trim();
  const reference = comment.slice("source:".length).trim();
  const hash = reference.lastIndexOf("#");
  if (hash === -1) {
    report.fail(file, line, "code-provenance", `source comment "${reference}" has no #Lx-Ly locator`);
    return;
  }
  const path = reference.slice(0, hash);
  const locator = parseLocator(reference.slice(hash + 1));
  const full = join(root, path);
  if (!existsSync(full)) {
    report.fail(file, line, "code-provenance", `source comment path "${path}" does not exist`);
    return;
  }
  if (!locator) {
    report.fail(file, line, "code-provenance", `source comment locator "#${reference.slice(hash + 1)}" must be #Lx or #Lx-Ly`);
    return;
  }
  const text = readFileSync(full, "utf8");
  const total = countLines(text);
  if (locator.start < 1 || locator.end < locator.start || locator.end > total) {
    report.fail(file, line, "code-provenance", `source comment range #L${locator.start}-L${locator.end} is outside 1-${total}`);
    return;
  }
  if (!lineSlice(text, locator.start, locator.end).join("\n").trim()) {
    report.fail(file, line, "code-provenance", `source comment range #L${locator.start}-L${locator.end} is empty`);
  }
}

function checkCodeProvenance(report, root, file, body) {
  const lines = body.split("\n");

  for (const block of fencedBlocks(body)) {
    if (block.lang === "quiz") continue;

    let previous = block.line - 2;
    while (previous >= 0 && lines[previous].trim() === "") previous -= 1;
    const marker = previous >= 0 ? lines[previous].trim() : "";
    if (DERIVED_COMMENT.test(marker)) continue;
    if (SOURCE_COMMENT.test(marker)) {
      checkProvenanceSource(report, root, file, block.line, marker);
    } else {
      report.fail(
        file,
        block.line,
        "code-provenance",
        "code block must be preceded by <!-- source: sources/...#Lx-Ly --> or <!-- derived -->",
      );
    }
  }
}

function fencedBlocks(body) {
  const blocks = [];
  const lines = body.split("\n");
  let fence = null;
  let start = 0;
  let content = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*(`{3,}|~{3,})\s*([^\s`]*)/);
    if (!fence) {
      if (!match) continue;
      fence = { marker: match[1], lang: match[2] || "" };
      start = index + 1;
      content = [];
    } else if (line.trim().startsWith(fence.marker)) {
      blocks.push({ lang: fence.lang, line: start, content: content.join("\n") });
      fence = null;
    } else {
      content.push(line);
    }
  }

  return blocks;
}

function checkQuizBlocks(report, file, body) {
  for (const block of fencedBlocks(body)) {
    if (block.lang !== "quiz") continue;

    let quiz;
    try {
      quiz = JSON.parse(block.content);
    } catch {
      report.fail(file, block.line, "quiz-json", "quiz block must contain valid JSON");
      continue;
    }
    if (!quiz || typeof quiz !== "object" || Array.isArray(quiz)) {
      report.fail(file, block.line, "quiz-json", "quiz block must be a JSON object");
      continue;
    }
    if (typeof quiz.question !== "string" || quiz.question.trim() === "") {
      report.fail(file, block.line, "quiz-json", "quiz.question must be a non-empty string");
    }

    const options = quiz.options;
    if (
      !Array.isArray(options) ||
      options.length < QUIZ_MIN_OPTIONS ||
      options.length > QUIZ_MAX_OPTIONS
    ) {
      report.fail(
        file,
        block.line,
        "quiz-options",
        `quiz.options must be an array of ${QUIZ_MIN_OPTIONS}-${QUIZ_MAX_OPTIONS} strings`,
      );
    } else if (!options.every((option) => typeof option === "string" && option.trim() !== "")) {
      report.fail(file, block.line, "quiz-options", "quiz.options must all be non-empty strings");
    }

    const optionCount = Array.isArray(options) ? options.length : 0;
    if (!Number.isInteger(quiz.answer) || quiz.answer < 0 || quiz.answer >= optionCount) {
      report.fail(
        file,
        block.line,
        "quiz-answer",
        `quiz.answer must be a 0-based index below ${optionCount}`,
      );
    }
    if (typeof quiz.explain !== "string" || quiz.explain.trim() === "") {
      report.fail(file, block.line, "quiz-explain", "quiz.explain must be a non-empty string");
    }
  }
}

function checkQuizFile(report, root, quiz, articleKeys, stepEntries, stepsByKey) {
  const file = rel(root, quiz.path);
  const key = `${quiz.nodeId}/${quiz.id}`;
  if (!articleKeys.has(key) || !stepEntries.has(key)) {
    report.fail(
      file,
      1,
      "quiz-orphan",
      "quiz file has no matching step article in the node plan",
    );
    return;
  }

  let payload;
  try {
    payload = JSON.parse(readFileSync(quiz.path, "utf8"));
  } catch {
    report.fail(file, 1, "quiz-file-json", "quiz file must contain valid JSON");
    return;
  }

  const step = stepsByKey.get(key);
  const article = step ? readMarkdown(step.path) : { body: "" };
  const maxQuestions = maxQuestionsFor(countArticleCharacters(article.body));

  for (const error of validateQuizPayload(payload, { maxQuestions })) {
    report.fail(file, 1, error.checkId, error.message);
  }
}

function stripCode(body) {
  const withoutFences = body.replace(/^(\s*)(`{3,}|~{3,})[\s\S]*?^\s*\2[^\n]*$/gm, "");
  return withoutFences.replace(/`[^`\n]*`/g, "");
}

function checkLinks(report, root, file, body, baseDir) {
  for (const match of stripCode(body).matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || target.startsWith("//")) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;
    const full = clean.startsWith("/") ? join(root, clean) : resolve(baseDir, clean);
    if (!existsSync(full)) {
      report.fail(file, 0, "link", `link target "${target}" does not exist`);
    }
  }
}

function parseStepsSection(body) {
  const heading = body.match(/^##\s+Steps\s*$/m);
  if (!heading) return null;
  const rest = body.slice(heading.index + heading[0].length);
  const next = rest.match(/^##\s/m);
  const section = next ? rest.slice(0, next.index) : rest;
  const items = [];
  for (const match of section.matchAll(
    /^\s*(?:\d+\.|[-*])\s+\[([^\]]+)\]\(([^)]+)\)\s*(?:$|[—–-]\s*.*$)/gm,
  )) {
    items.push({ title: match[1].trim(), target: match[2].trim() });
  }
  return items;
}

function checkStepPurpose(report, file, index, purpose) {
  if (typeof purpose !== "string") {
    report.fail(file, 1, "step-purpose", `steps[${index}].purpose must be a string`);
    return;
  }
  const text = purpose.trim();
  if (!text) return;
  if (text.includes("\n")) {
    report.fail(file, 1, "step-purpose", `steps[${index}].purpose must be a single line`);
    return;
  }
  const characters = Array.from(text).length;
  if (characters > MAX_PURPOSE_CHARS) {
    report.fail(
      file,
      1,
      "step-purpose",
      `steps[${index}].purpose is ${characters} characters; keep it to ${MAX_PURPOSE_CHARS} or fewer`,
    );
  }
  const withoutTrailing = text.replace(/[。！？!?]+$/, "");
  if (CJK_SENTENCE_END.test(withoutTrailing) || ASCII_SENTENCE_BOUNDARY.test(withoutTrailing)) {
    report.fail(file, 1, "step-purpose", `steps[${index}].purpose must be one sentence, not a summary`);
  }
}

function checkRoadmap(report, root, subject, scan, enforceOrphans) {
  const roadmapPath = join(root, "learn", subject, "ROADMAP.md");
  const file = rel(root, roadmapPath);
  const parsed = readMarkdown(roadmapPath);
  if (parsed.error) {
    report.fail(file, 1, "fm-parse", `invalid YAML frontmatter: ${parsed.error}`);
    return;
  }

  const linked = new Set();
  for (const match of parsed.body.matchAll(/(?<!!)\[[^\]]*\]\((nodes\/[^)\s]+?\.md)\)/g)) {
    const target = match[1];
    linked.add(basename(target).replace(/\.md$/, ""));
    const full = resolve(dirname(roadmapPath), target);
    if (!existsSync(full)) {
      report.fail(file, 0, "roadmap-link", `node link "${target}" does not exist`);
    }
  }

  if (!enforceOrphans) return;
  for (const node of scan.nodes) {
    if (!linked.has(node.id)) {
      report.fail(rel(root, node.path), 0, "roadmap-node-orphan", `node "${node.id}" is not linked from ROADMAP.md`);
    }
  }
}

const PREREQUISITE_PATH = /^learn\/([^/]+)\/nodes\/([^/]+)\.md$/;

/**
 * Validate the node-level prerequisite DAG. `prerequisites` holds node paths
 * (`learn/<subject>/nodes/<id>.md`) and must stay inside the subject, point at
 * a real node, avoid self/cycles, and never point at a later tier.
 */
function checkPrerequisites(report, root, subject, scan, onlyNode) {
  const meta = new Map();
  for (const node of scan.nodes) {
    const parsed = readMarkdown(node.path);
    if (parsed.error) continue;
    meta.set(node.id, { data: parsed.data || {}, file: rel(root, node.path) });
  }

  const graph = new Map();
  for (const [id, { data, file }] of meta) {
    const reportThis = !onlyNode || onlyNode === id;
    const raw = data.prerequisites;
    const deps = [];
    graph.set(id, deps);
    if (raw === undefined || raw === null) continue;
    if (!Array.isArray(raw)) {
      if (reportThis) {
        report.fail(file, 1, "prerequisites-type", "prerequisites must be a list of node paths");
      }
      continue;
    }
    for (const [index, entry] of raw.entries()) {
      if (typeof entry !== "string" || !entry.trim()) {
        if (reportThis) {
          report.fail(file, 1, "prerequisite-path", `prerequisites[${index}] must be a node path`);
        }
        continue;
      }
      const match = entry.trim().match(PREREQUISITE_PATH);
      if (!match) {
        if (reportThis) {
          report.fail(
            file,
            1,
            "prerequisite-path",
            `prerequisites[${index}] "${entry}" must look like learn/${subject}/nodes/<node>.md`,
          );
        }
        continue;
      }
      const [, targetSubject, targetId] = match;
      if (targetSubject !== subject) {
        if (reportThis) {
          report.fail(
            file,
            1,
            "prerequisite-subject",
            `prerequisite "${entry}" belongs to subject "${targetSubject}", not "${subject}"`,
          );
        }
        continue;
      }
      if (targetId === id) {
        if (reportThis) {
          report.fail(file, 1, "prerequisite-self", `nodes can only require other nodes, not "${id}" itself`);
        }
        continue;
      }
      if (!meta.has(targetId)) {
        if (reportThis) {
          report.fail(file, 1, "prerequisite-missing", `prerequisite "${entry}" does not exist`);
        }
        continue;
      }
      const ownTier = Number(data.tier);
      const targetTier = Number(meta.get(targetId).data.tier);
      if (Number.isFinite(ownTier) && Number.isFinite(targetTier) && targetTier > ownTier) {
        if (reportThis) {
          report.fail(
            file,
            1,
            "prerequisite-tier",
            `prerequisite "${targetId}" is tier ${targetTier}, later than this tier ${ownTier}`,
          );
        }
      }
      deps.push(targetId);
    }
  }

  for (const id of graph.keys()) {
    const stack = [...(graph.get(id) || [])];
    const seen = new Set();
    let cyclic = false;
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === id) {
        cyclic = true;
        break;
      }
      if (seen.has(current)) continue;
      seen.add(current);
      for (const next of graph.get(current) || []) stack.push(next);
    }
    if (!cyclic) continue;
    if (onlyNode && onlyNode !== id) continue;
    report.fail(
      meta.get(id).file,
      0,
      "prerequisite-cycle",
      `node "${id}" is part of a prerequisite cycle`,
    );
  }
}

function checkNode(report, root, subject, scan, digestInfo, node, stepIndex, nodeDigests, layout) {
  const file = rel(root, node.path);
  const parsed = readMarkdown(node.path);
  if (parsed.error) {
    report.fail(file, 1, "fm-parse", `invalid YAML frontmatter: ${parsed.error}`);
    return;
  }
  const { data, body } = parsed;

  for (const key of NODE_FM) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      report.fail(file, 1, "fm-required", `missing required frontmatter key: ${key}`);
    }
  }
  if (data.id !== node.id) {
    report.fail(file, 1, "id-filename", `frontmatter id "${data.id}" does not match filename "${node.id}"`);
  }
  if (data.subject !== undefined && data.subject !== subject) {
    report.fail(file, 1, "fm-subject", `frontmatter subject "${data.subject}" does not match "${subject}"`);
  }
  if (data.status !== undefined && !ALLOWED_NODE_STATUS.has(String(data.status))) {
    report.fail(file, 1, "fm-status", `invalid status: ${data.status}`);
  }
  if (!Array.isArray(data.steps)) {
    report.fail(file, 1, "steps-array", "frontmatter steps must be an array");
    return;
  }
  if (data.steps.length === 0 && data.status !== "draft") {
    report.fail(file, 1, "steps-empty", "a confirmed or written node needs at least one step");
  }

  const seen = new Set();
  const usedDigests = new Set();
  for (const [index, entry] of data.steps.entries()) {
    if (!entry || typeof entry !== "object") {
      report.fail(file, 1, "step-entry", `steps[${index}] must be an object`);
      continue;
    }
    for (const key of STEP_ENTRY_KEYS) {
      if (entry[key] === undefined || entry[key] === null || entry[key] === "") {
        report.fail(file, 1, "step-entry", `steps[${index}] missing "${key}"`);
      }
    }
    if (entry.title !== undefined && entry.title !== null && entry.title !== "") {
      if (typeof entry.title !== "string" || !entry.title.trim()) {
        report.fail(file, 1, "step-entry", `steps[${index}].title must be a non-empty string when present`);
      }
    }
    if (entry.author !== undefined && entry.author !== null) {
      if (typeof entry.author !== "string" || !entry.author.trim()) {
        report.fail(file, 1, "step-author", `steps[${index}].author must be a non-empty string when present`);
      }
    }
    for (const key of FORBIDDEN_STEP_KEYS) {
      if (entry[key] !== undefined) {
        report.fail(file, 1, "steps-flat", `steps[${index}] must not declare "${key}"`);
      }
    }
    checkStepPurpose(report, file, index, entry.purpose);
    if (!entry.id) continue;
    if (seen.has(entry.id)) {
      report.fail(file, 1, "steps-duplicate", `duplicate step id "${entry.id}"`);
    }
    seen.add(entry.id);

    const article = join(scan.nodesDir, node.id, `${entry.id}.md`);
    if (!existsSync(article)) {
      report.fail(file, 1, "step-article-missing", `step "${entry.id}" has no article at ${rel(root, article)}`);
    }
    let courseSources = 0;
    for (const [sourceIndex, source] of (Array.isArray(entry.sources) ? entry.sources : []).entries()) {
      checkSourceRef(report, root, subject, scan, digestInfo, file, source, `steps[${index}].sources[${sourceIndex}]`);
      for (const name of digestNamesForSource(digestInfo, source)) usedDigests.add(name);
      if (layout === "course-supplement") {
        const parsed = parseSourceLink(source);
        const role = parsed ? parseSourceRole(parsed.path) : null;
        if (role === "raw") {
          report.fail(file, 1, "src-raw", `steps[${index}].sources[${sourceIndex}] cites a raw source`);
        } else if (role === "course") {
          courseSources += 1;
        }
      }
    }
    if (layout === "course-supplement" && courseSources === 0) {
      report.fail(
        file,
        1,
        "src-course-missing",
        `step "${entry.id}" must cite at least one course source`,
      );
    }
    if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
      report.flag(file, "sources-empty", `step "${entry.id}" has no sources`);
    }
  }

  checkNodeDigests(report, file, node, data, digestInfo, usedDigests, nodeDigests);

  for (const step of stepIndex.byNode.get(node.id) || []) {
    if (!seen.has(step.id)) {
      report.fail(rel(root, step.path), 0, "step-orphan", `article has no entry in ${node.name} steps`);
    }
  }

  const nodeStepDir = join(scan.nodesDir, node.id);
  if (existsSync(nodeStepDir)) {
    for (const entry of readdirSync(nodeStepDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.endsWith("-assets")) continue;
      const stepId = entry.name.slice(0, -"-assets".length);
      if (!seen.has(stepId)) {
        report.fail(
          rel(root, join(nodeStepDir, entry.name)),
          0,
          "image-orphan",
          `asset folder has no step "${stepId}"`,
        );
      }
    }
    for (const name of readdirSync(nodeStepDir)) {
      if (!name.endsWith(".plan.json")) continue;
      const stepId = name.slice(0, -".plan.json".length);
      const planPath = join(nodeStepDir, name);
      const planFile = rel(root, planPath);
      if (!seen.has(stepId)) {
        report.fail(planFile, 0, "image-plan-orphan", `image plan has no step "${stepId}"`);
        continue;
      }
      try {
        normalizeStepPlan(readFileSync(planPath, "utf8"));
      } catch (error) {
        report.fail(planFile, 0, "image-plan", error?.message ?? "invalid image plan");
      }
    }
  }

  const items = parseStepsSection(body);
  const expected = data.steps.filter((entry) => entry && entry.id);
  if (!items && expected.length > 0) {
    report.fail(file, 0, "node-steps-list", "node must have a ## Steps section");
  } else if (items) {
    if (items.length !== expected.length) {
      report.fail(file, 0, "node-steps-list", `## Steps lists ${items.length} article(s), frontmatter has ${expected.length}`);
    }
    for (const [index, item] of items.entries()) {
      const entry = expected[index];
      if (!entry) continue;
      if (item.title !== (entry.title || entry.id)) {
        report.fail(file, 0, "node-steps-list", `## Steps[${index}] title "${item.title}" != "${entry.title || entry.id}"`);
      }
      const targetPath = resolve(dirname(node.path), item.target.split("#")[0]);
      const expectedPath = resolve(scan.nodesDir, node.id, `${entry.id}.md`);
      if (targetPath !== expectedPath) {
        report.fail(
          file,
          0,
          "node-steps-list",
          `## Steps[${index}] must link nodes/${node.id}/${entry.id}.md, got "${item.target}"`,
        );
      }
      if (!existsSync(targetPath)) {
        report.fail(file, 0, "node-step-link", `## Steps[${index}] link "${item.target}" does not resolve`);
      }
    }
  }

  checkLinks(report, root, file, body, dirname(node.path));
  checkCodeProvenance(report, root, file, body);
}

function digestNamesForSource(digestInfo, raw) {
  const parsed = parseSourceLink(raw);
  if (!parsed) return [];
  const entry = digestFor(digestInfo.index, parsed.path);
  if (!entry) return [];
  const locator = parseLocator(parsed.locator);
  if (!locator) return [...entry.names];
  const covering = [...entry.names].filter((name) =>
    covers(entry.rangesByName.get(name) || [], locator.start, locator.end),
  );
  if (covering.length > 0) return covering;
  return [...entry.names].filter((name) =>
    (entry.rangesByName.get(name) || []).some((range) => range.start <= locator.end && range.end >= locator.start),
  );
}

function checkNodeDigests(report, file, node, data, digestInfo, usedDigests, nodeDigests) {
  const declared = new Set();
  const raw = data.digests;
  if (raw !== undefined && raw !== null) {
    if (!Array.isArray(raw)) {
      report.fail(file, 1, "node-digests-array", "frontmatter digests must be an array of digest filenames");
    } else {
      for (const [index, value] of raw.entries()) {
        const name = typeof value === "string" ? value.trim() : "";
        if (!name || !name.endsWith(".md") || name.includes("/")) {
          report.fail(file, 1, "node-digests-format", `digests[${index}] must be a digest filename like "notes.md"`);
          continue;
        }
        if (declared.has(name)) {
          report.fail(file, 1, "node-digests-duplicate", `duplicate digest "${name}"`);
          continue;
        }
        const target = digestInfo.byName.get(name);
        if (!target) {
          report.fail(file, 1, "node-digest-unknown", `digests[${index}] "${name}" is not a digest in this subject`);
          continue;
        }
        if (String(target.data.status) !== "absorbed") {
          report.fail(
            file,
            1,
            "node-digest-status",
            `digests[${index}] "${name}" must be absorbed, not ${target.data.status}`,
          );
        }
        declared.add(name);
      }
    }
  }

  for (const name of usedDigests) {
    if (!declared.has(name)) {
      report.fail(file, 1, "node-digest-undeclared", `step sources use digest "${name}" but the node does not declare it`);
    }
  }

  if (data.status !== "draft") {
    for (const name of declared) {
      if (!usedDigests.has(name)) {
        report.fail(file, 1, "node-digest-unused", `node declares digest "${name}" but no step cites it`);
      }
    }
  }

  nodeDigests.set(node.id, declared);
}

function checkDigestCoverage(report, digestInfo, nodeDigests) {
  const referenced = new Set();
  for (const names of nodeDigests.values()) {
    for (const name of names) referenced.add(name);
  }

  for (const entry of digestInfo.meta) {
    const status = String(entry.data.status);
    if (status === "pending") {
      report.fail(
        entry.file,
        1,
        "digest-pending",
        "digest is still pending; run /absorb for this subject or mark it skipped with a skip_reason",
      );
      continue;
    }
    if (status !== "absorbed") continue;
    if (digestInfo.supplementNames.has(entry.name)) continue;
    if (!referenced.has(entry.name)) {
      report.fail(
        entry.file,
        1,
        "digest-unreferenced",
        "absorbed digest is not listed in any node's digests; declare it on a node or mark it skipped with a skip_reason",
      );
    }
  }
}

function checkSourceRef(report, root, subject, scan, digestInfo, file, raw, label) {
  const parsed = parseSourceLink(raw);
  if (!parsed) {
    report.fail(file, 1, "src-format", `${label} must be [[sources/${subject}/<file>#Lx-Ly]]`);
    return;
  }
  const prefix = `sources/${subject}/`;
  if (!parsed.path.startsWith(prefix)) {
    report.fail(file, 1, "src-path", `${label} subject does not match "${subject}"`);
    return;
  }
  const sourceRel = parsed.path.slice(prefix.length);
  const source = scan.sourceByRel.get(sourceRel);
  if (!source) {
    report.fail(file, 1, "src-path", `${label} source file "${sourceRel}" not found`);
    return;
  }
  if (extname(sourceRel).toLowerCase() === ".pdf") {
    report.fail(file, 1, "src-pdf", `${label} must cite extracted text, not a PDF`);
    return;
  }
  const locator = parseLocator(parsed.locator);
  if (!locator) {
    report.fail(file, 1, "src-locator-format", `${label} locator "#${parsed.locator}" must be #Lx or #Lx-Ly`);
    return;
  }
  const text = readFileSync(source.path, "utf8");
  const total = countLines(text);
  if (locator.start < 1 || locator.end < locator.start || locator.end > total) {
    report.fail(
      file,
      1,
      "src-range",
      `${label} range #L${locator.start}-L${locator.end} is outside 1-${total}`,
    );
    return;
  }
  const slice = lineSlice(text, locator.start, locator.end).join("\n").trim();
  if (!slice) {
    report.fail(file, 1, "src-slice-empty", `${label} range #L${locator.start}-L${locator.end} is empty`);
  }
  const digest = digestFor(digestInfo.index, parsed.path);
  if (!digest) {
    report.fail(file, 1, "src-digest-missing", `${label} has no digest for ${parsed.path}`);
  } else if (!covers(digest.ranges, locator.start, locator.end)) {
    report.fail(
      file,
      1,
      "src-digest-range",
      `${label} range #L${locator.start}-L${locator.end} falls outside the digest line map`,
    );
  }
}

function checkImages(report, root, file, body, step) {
  const stepDir = dirname(step.path);
  const assetsDir = join(stepDir, `${step.id}-assets`);
  const referenced = new Set();

  for (const match of stripCode(body).matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;

    const full = clean.startsWith("/") ? join(root, clean) : resolve(stepDir, clean);
    referenced.add(full);

    const inside = relative(assetsDir, full);
    if (inside === "" || inside.startsWith("..") || isAbsolute(inside)) {
      report.fail(
        file,
        0,
        "image-location",
        `image "${target}" must live under nodes/${step.nodeId}/${step.id}-assets/`,
      );
    }
    if (!existsSync(full)) {
      report.fail(file, 0, "image-missing", `image "${target}" does not exist`);
      continue;
    }
    if (extname(full).toLowerCase() !== ".webp") {
      report.fail(file, 0, "image-format", `image "${target}" must be a .webp file`);
      continue;
    }
    const header = readFileSync(full).subarray(0, 12);
    if (header.subarray(0, 4).toString("ascii") !== "RIFF" || header.subarray(8, 12).toString("ascii") !== "WEBP") {
      report.fail(file, 0, "image-format", `image "${target}" is not a valid WebP file`);
    }
  }

  if (!existsSync(assetsDir)) return;
  for (const entry of readdirSync(assetsDir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;
    const full = join(assetsDir, entry.name);
    if (!referenced.has(full)) {
      report.fail(
        rel(root, full),
        0,
        "image-orphan",
        `asset is not referenced by nodes/${step.nodeId}/${step.id}.md`,
      );
    }
  }
}

function checkArticle(report, root, entry, step) {
  const file = rel(root, step.path);
  const parsed = readMarkdown(step.path);
  if (parsed.error) {
    report.fail(file, 1, "fm-parse", `invalid YAML frontmatter: ${parsed.error}`);
    return;
  }
  const { body } = parsed;

  if (entry) {
    const first = body.split("\n").find((line) => line.trim() !== "");
    if (entry.title) {
      const expected = `# ${entry.title}`;
      if (!first || first.trim() !== expected) {
        report.fail(file, 1, "step-h1", `first heading must be "${expected}"`);
      }
    } else {
      const withoutH1 = body.replace(/^\s*#\s+[^\n]*\n?/, "").trim();
      if (withoutH1) {
        report.fail(
          file,
          1,
          "step-title-missing",
          `article has a body but steps[].title is missing; publish must write the H1 back to the node`,
        );
      }
    }
  }

  checkLinks(report, root, file, body, dirname(step.path));
  checkCodeProvenance(report, root, file, body);
  checkQuizBlocks(report, file, body);
  checkImages(report, root, file, body, step);
}

function checkSourceLayout(report, root, subject, scan, digestInfo, layout) {
  if (!layout) return;
  if (layout !== "course-supplement") {
    report.fail(
      `learn/${subject}/MEMORY.md`,
      1,
      "source-layout-marker",
      `unknown source_layout "${layout}"; use "course-supplement"`,
    );
    return;
  }
  if (courseCharacterCount(root, subject) === 0) {
    report.fail(
      `sources/${subject}`,
      0,
      "source-layout-no-course",
      "a course-supplement subject needs at least one course text file",
    );
  }
  for (const source of scan.sources) {
    const path = `sources/${subject}/${source.rel}`;
    if (!parseSourceRole(path)) {
      report.fail(
        rel(root, source.path),
        0,
        "source-layout",
        "source must live under course/, supplement/, or raw/ inside a dated folder",
      );
    }
  }
  for (const entry of digestInfo.meta) {
    if (typeof entry.data.source !== "string" || !entry.data.source.trim()) continue;
    const role = parseSourceRole(entry.data.source);
    if (role === "raw") {
      report.fail(entry.file, 1, "digest-source-raw", "a digest cannot point at a raw source");
    } else if (!role) {
      report.fail(entry.file, 1, "digest-source-layout", "digest source must live under course/ or supplement/");
    }
  }
}

function checkNodeCount(report, root, subject, scan, layout) {
  let target;
  if (layout === "course-supplement") {
    target = nodeBaseline(courseCharacterCount(root, subject));
  } else {
    let totalLines = 0;
    const counted = new Set();
    for (const file of scan.digests) {
      const { data } = readMarkdown(file.path);
      const key = data.source || file.path;
      if (typeof data.source_lines === "number" && !counted.has(key)) {
        counted.add(key);
        totalLines += data.source_lines;
      }
    }
    target = Math.max(3, Math.min(30, Math.round(totalLines / 1100)));
  }
  const actual = scan.nodes.length;
  if (target > 0) {
    const deviation = (actual - target) / target;
    if (Math.abs(deviation) > 0.4) {
      report.flag(
        `learn/${subject}`,
        "lint-node-count",
        `node count ${actual} deviates ${(deviation * 100).toFixed(0)}% from baseline ${target} (±40%)`,
      );
    }
  }
}

export function runChecks({ root = REPO_ROOT, subject, node = null }) {
  markdownCache.clear();
  const scan = scanSubject(root, subject);
  const report = new Report();
  const stepIndex = {
    byNode: new Map(),
  };
  for (const step of scan.steps) {
    if (!stepIndex.byNode.has(step.nodeId)) stepIndex.byNode.set(step.nodeId, []);
    stepIndex.byNode.get(step.nodeId).push(step);
  }

  const layout = readSourceLayout(root, subject);
  checkNoMdx(report, root, node ? subject : null);
  const digestInfo = buildDigestIndex(report, root, subject, scan);
  checkSourceParts(report, root, subject, scan, digestInfo, layout);
  checkSourceLayout(report, root, subject, scan, digestInfo, layout);
  const nodeDigests = new Map();

  const nodesById = new Map(scan.nodes.map((item) => [item.id, item]));
  for (const nodeId of stepIndex.byNode.keys()) {
    if (!nodesById.has(nodeId)) {
      report.fail(
        `learn/${subject}/nodes/${nodeId}`,
        0,
        "node-container-missing",
        `step folder "${nodeId}" has no node container at learn/${subject}/nodes/${nodeId}.md`,
      );
    }
  }

  const stepEntries = new Map();
  for (const item of scan.nodes) {
    const parsed = readMarkdown(item.path);
    if (parsed.error) continue;
    for (const entry of Array.isArray(parsed.data.steps) ? parsed.data.steps : []) {
      if (entry && entry.id) stepEntries.set(`${item.id}/${entry.id}`, entry);
    }
  }
  const stepsByKey = new Map(scan.steps.map((step) => [`${step.nodeId}/${step.id}`, step]));
  const articleKeys = new Set(stepsByKey.keys());
  const quizNodes = node ? new Set([node]) : new Set(scan.quizFiles.map((quiz) => quiz.nodeId));
  for (const quiz of scan.quizFiles) {
    if (!quizNodes.has(quiz.nodeId)) continue;
    checkQuizFile(report, root, quiz, articleKeys, stepEntries, stepsByKey);
  }

  const targets = node ? [nodesById.get(node)].filter(Boolean) : scan.nodes;
  if (node && !nodesById.has(node)) {
    report.fail("", 0, "node-missing", `node "${node}" not found under nodes/`);
  }

  checkRoadmap(report, root, subject, scan, !node);
  checkPrerequisites(report, root, subject, scan, node);

  for (const item of targets) {
    checkNode(report, root, subject, scan, digestInfo, item, stepIndex, nodeDigests, layout);
  }

  if (!node) checkDigestCoverage(report, digestInfo, nodeDigests);

  const articleNodes = node ? new Set([node]) : new Set(scan.nodes.map((item) => item.id));
  for (const step of scan.steps) {
    if (!articleNodes.has(step.nodeId)) continue;
    const entry = stepEntries.get(`${step.nodeId}/${step.id}`) || null;
    checkArticle(report, root, entry, step);
  }

  if (!node) checkNodeCount(report, root, subject, scan, layout);

  return {
    subject,
    ...(node ? { node } : {}),
    counts: { nodes: targets.length, steps: scan.steps.length, digests: scan.digests.length },
    failures: report.failures,
    flags: report.flags,
    pass: !report.hasFailures,
  };
}

function usage() {
  console.error("usage: node scripts/verify.mjs (--node <subject>/<node-id> | --subject <subject>) [--root <dir>] [--json]");
}

function parseArgs(argv) {
  const options = { subject: null, node: null, root: REPO_ROOT, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--node" && index + 1 < argv.length) {
      const value = argv[++index];
      const slash = value.indexOf("/");
      if (slash === -1) return null;
      options.subject = value.slice(0, slash);
      options.node = value.slice(slash + 1);
    } else if (argv[index] === "--subject" && index + 1 < argv.length) {
      options.subject = argv[++index];
    } else if (argv[index] === "--root" && index + 1 < argv.length) {
      options.root = resolve(argv[++index]);
    } else if (argv[index] === "--json") {
      options.json = true;
    }
  }
  return options;
}

function main(argv) {
  const options = parseArgs(argv.slice(2));
  if (!options || !options.subject) {
    usage();
    process.exit(2);
  }
  if (!existsSync(join(options.root, "learn", options.subject))) {
    console.error(`unknown subject: ${options.subject}`);
    process.exit(2);
  }

  const result = runChecks(options);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exit(result.pass ? 0 : 1);
  }

  const failedFiles = new Set(result.failures.map((failure) => failure.file).filter(Boolean));
  const flaggedFiles = new Set(result.flags.map((flag) => flag.file).filter(Boolean));
  console.log(
    `SUMMARY: ${result.counts.nodes} node(s), ${result.counts.steps} step(s), ${result.counts.digests} digest(s) checked; ${result.failures.length} failure(s) in ${failedFiles.size} file(s), ${result.flags.length} flag(s) in ${flaggedFiles.size} file(s); exit ${result.pass ? 0 : 1}`,
  );

  if (result.failures.length > 0) {
    console.log("\nFAILURES:");
    for (const failure of result.failures) {
      const location = failure.file ? `${failure.file}${failure.line ? `:${failure.line}` : ""}` : "<root>";
      console.log(`  [${failure.checkId}] ${location} — ${failure.message}`);
    }
  }
  if (result.flags.length > 0) {
    console.log("\nFLAGS:");
    for (const flag of result.flags) {
      console.log(`  [${flag.checkId}] ${flag.file || "<root>"} — ${flag.message}`);
    }
  }
  console.log(result.pass ? "\n✓ PASS" : "\n✗ FAILED");
  process.exit(result.pass ? 0 : 1);
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

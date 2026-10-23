#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED_NODE_STATUS = new Set(["draft", "confirmed", "written"]);
const ALLOWED_DIGEST_STATUS = new Set(["pending", "absorbed"]);
const NODE_FM = ["id", "title", "subject", "tier", "order", "status", "goal", "steps", "created", "updated"];
const STEP_ENTRY_KEYS = ["id", "title", "purpose", "sources"];
const FORBIDDEN_STEP_KEYS = ["deps", "type", "order"];
const DERIVED_COMMENT = /^<!--\s*derived\s*-->$/;
const SOURCE_COMMENT = /^<!--\s*source:\s*sources\/.+#L\d+(?:-L\d+)?\s*-->$/;
const MAX_PURPOSE_CHARS = 120;
const CJK_SENTENCE_END = /[。！？]/;
const ASCII_SENTENCE_BOUNDARY = /[.!?](?=\s+\S)/;

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
  if (existsSync(nodesDir)) {
    for (const entry of readdirSync(nodesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const stepDir = join(nodesDir, entry.name);
      for (const file of readdirSync(stepDir, { withFileTypes: true })) {
        if (!file.isFile() || !file.name.endsWith(".md")) continue;
        steps.push({
          nodeId: entry.name,
          id: file.name.replace(/\.md$/, ""),
          name: file.name,
          path: join(stepDir, file.name),
        });
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

  return { subjectDir, nodesDir, nodes, steps, digests, sources, sourceByRel };
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

    for (const match of body.matchAll(/\[\[\s*sources\/[^\]]*#([^\]]+?)\s*\]\]/g)) {
      if (!parseLocator(match[1].trim())) {
        report.fail(file, 0, "digest-locator", `locator "#${match[1].trim()}" must be #Lx or #Lx-Ly`);
      }
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

    if (!sourceKey) continue;
    const entry = index.get(sourceKey) || { ranges: [] };
    entry.ranges.push(...ranges);
    index.set(sourceKey, entry);
  }

  return index;
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
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*(`{3,}|~{3,})\s*([^\s`]*)/);
    if (!fence) {
      if (!match) continue;
      fence = { marker: match[1], lang: match[2] };
      if (fence.lang === "quiz") continue;

      let previous = index - 1;
      while (previous >= 0 && lines[previous].trim() === "") previous -= 1;
      const marker = previous >= 0 ? lines[previous].trim() : "";
      if (DERIVED_COMMENT.test(marker)) continue;
      if (SOURCE_COMMENT.test(marker)) {
        checkProvenanceSource(report, root, file, index + 1, marker);
      } else {
        report.fail(
          file,
          index + 1,
          "code-provenance",
          "code block must be preceded by <!-- source: sources/...#Lx-Ly --> or <!-- derived -->",
        );
      }
    } else if (line.trim().startsWith(fence.marker)) {
      fence = null;
    }
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

function checkNode(report, root, subject, scan, digestIndex, node, stepIndex) {
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
    for (const [sourceIndex, source] of (Array.isArray(entry.sources) ? entry.sources : []).entries()) {
      checkSourceRef(report, root, subject, scan, digestIndex, file, source, `steps[${index}].sources[${sourceIndex}]`);
    }
    if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
      report.flag(file, "sources-empty", `step "${entry.id}" has no sources`);
    }
  }

  for (const step of stepIndex.byNode.get(node.id) || []) {
    if (!seen.has(step.id)) {
      report.fail(rel(root, step.path), 0, "step-orphan", `article has no entry in ${node.name} steps`);
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
      if (item.title !== entry.title) {
        report.fail(file, 0, "node-steps-list", `## Steps[${index}] title "${item.title}" != "${entry.title}"`);
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

function checkSourceRef(report, root, subject, scan, digestIndex, file, raw, label) {
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
  const digest = digestFor(digestIndex, parsed.path);
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
    const expected = `# ${entry.title}`;
    if (!first || first.trim() !== expected) {
      report.fail(file, 1, "step-h1", `first heading must be "${expected}"`);
    }
  }

  checkLinks(report, root, file, body, dirname(step.path));
  checkCodeProvenance(report, root, file, body);
}

function checkNodeCount(report, subject, scan) {
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
  const target = Math.max(3, Math.min(30, Math.round(totalLines / 1100)));
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

  checkNoMdx(report, root, node ? subject : null);
  const digestIndex = buildDigestIndex(report, root, subject, scan);

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
  const targets = node ? [nodesById.get(node)].filter(Boolean) : scan.nodes;
  if (node && !nodesById.has(node)) {
    report.fail("", 0, "node-missing", `node "${node}" not found under nodes/`);
  }

  checkRoadmap(report, root, subject, scan, !node);

  for (const item of targets) {
    checkNode(report, root, subject, scan, digestIndex, item, stepIndex);
  }

  const articleNodes = node ? new Set([node]) : new Set(scan.nodes.map((item) => item.id));
  for (const step of scan.steps) {
    if (!articleNodes.has(step.nodeId)) continue;
    const entry = stepEntries.get(`${step.nodeId}/${step.id}`) || null;
    checkArticle(report, root, entry, step);
  }

  if (!node) checkNodeCount(report, subject, scan);

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

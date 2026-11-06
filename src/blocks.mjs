import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";

export const BLOCK_TYPES = ["concept", "procedure", "principle", "contrast"];
export const BLOCK_STATUSES = ["draft", "reviewed"];
export const BLOCK_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const BLOCK_LABEL_MAX = 40;
export const BLOCK_SUMMARY_MAX = 120;

export const BLOCK_SECTIONS = {
  concept: ["定義", "為什麼重要", "如何運作", "例子", "邊界與常見誤解", "進階"],
  procedure: ["問題", "前置條件", "步驟", "例子", "失敗模式", "進階"],
  principle: ["主張", "為什麼成立", "適用範圍", "反例", "進階"],
  contrast: ["A 是什麼", "B 是什麼", "關鍵差異", "何時用哪個", "進階"],
};

const SENTENCE_PUNCTUATION = /[。！？；?!;]/;
const SENTENCE_START = /^(?:如何|為什麼|怎麼|是否|先|請|把|讓|避免|需要)/;
const TRAILING_PUNCTUATION = /[.。！？；;,，、]$/;
const INLINE_LINK = /\[\[([^\]]+)\]\]/g;
const SOURCE_LINK = /^\[\[\s*(sources\/[^\]#]+?)(?:\s*#\s*([^\]]+?))?\s*\]\]$/;

export function asDateString(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  return null;
}

export function characterCount(value) {
  return Array.from(String(value ?? "")).length;
}

export function sourceLinkPath(raw) {
  if (typeof raw !== "string") return null;
  const match = raw.match(SOURCE_LINK);
  return match ? match[1].trim() : null;
}

export function collectInlineBlockLinks(body) {
  const links = [];
  for (const match of String(body ?? "").matchAll(INLINE_LINK)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith("sources/")) continue;
    const id = raw.split("|")[0].trim();
    if (id) links.push(id);
  }
  return links;
}

export function blockHeadings(body) {
  return [...String(body ?? "").matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1].trim());
}

export function blockPath(root, subject, id) {
  return join(root, "learn", subject, "blocks", `${id}.md`);
}

export function blocksDir(root, subject) {
  return join(root, "learn", subject, "blocks");
}

export function coveragePath(root, subject) {
  return join(blocksDir(root, subject), "coverage.json");
}

/**
 * Read every block Markdown file for a subject. A parse error is kept on the
 * record so validateBlock can report it instead of throwing.
 */
export function loadBlocks(root, subject) {
  const dir = blocksDir(root, subject);
  if (!existsSync(dir)) {
    return { dir, hasBlocksDir: false, blocks: [] };
  }
  const files = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const blocks = files.map((name) => {
    const id = basename(name, ".md");
    const path = join(dir, name);
    const file = `learn/${subject}/blocks/${name}`;
    try {
      const parsed = matter(readFileSync(path, "utf8"));
      return { id, name, path, file, data: parsed.data ?? {}, body: parsed.content ?? "", error: null };
    } catch (error) {
      return { id, name, path, file, data: {}, body: "", error: error.message };
    }
  });
  return { dir, hasBlocksDir: true, blocks };
}

export function validateBlockFrontmatter(block, subject, blockIds = new Set()) {
  const failures = [];
  const fail = (checkId, message) => failures.push({ checkId, message, line: 1 });

  if (block.error) {
    fail("block-fm-parse", `invalid YAML frontmatter: ${block.error}`);
    return failures;
  }
  const data = block.data ?? {};

  if (data.id !== block.id) {
    fail("block-id-filename", `frontmatter id "${data.id}" does not match filename "${block.id}"`);
  }
  if (data.subject !== subject) {
    fail("block-subject", `frontmatter subject "${data.subject}" does not match "${subject}"`);
  }
  if (!BLOCK_SLUG.test(block.id)) {
    fail("block-slug", `block id "${block.id}" must be kebab-case (${BLOCK_SLUG})`);
  }
  if (data.slug !== undefined && data.slug !== null) {
    if (typeof data.slug !== "string" || !BLOCK_SLUG.test(data.slug.trim())) {
      fail("block-slug", `slug "${data.slug}" must be kebab-case (${BLOCK_SLUG})`);
    }
  }
  if (!BLOCK_TYPES.includes(String(data.type))) {
    fail("block-type", `type "${data.type}" must be one of ${BLOCK_TYPES.join(", ")}`);
  }
  if (!BLOCK_STATUSES.includes(String(data.status))) {
    fail("block-status", `status "${data.status}" must be one of ${BLOCK_STATUSES.join(", ")}`);
  }
  if (typeof data.title !== "string" || !data.title.trim()) {
    fail("block-title", "title is required and must be a non-empty string");
  }

  if (typeof data.label !== "string" || !data.label.trim()) {
    fail("block-label", "label is required and must be a noun or proper noun");
  } else {
    const label = data.label.trim();
    const length = characterCount(label);
    if (length > BLOCK_LABEL_MAX) {
      fail("block-label", `label is ${length} characters; keep it to ${BLOCK_LABEL_MAX} or fewer`);
    }
    if (label.includes("\n")) {
      fail("block-label", "label must be a single line");
    }
    if (SENTENCE_PUNCTUATION.test(label)) {
      fail("block-label", `label "${label}" looks like a sentence; move the explanation to summary`);
    }
    if (SENTENCE_START.test(label)) {
      fail("block-label", `label "${label}" starts like a sentence; use a noun or proper noun`);
    }
    if (label.trim().split(/\s+/).length > 4) {
      fail("block-label", `label "${label}" has too many words; keep it to 1–4`);
    }
    if (TRAILING_PUNCTUATION.test(label)) {
      fail("block-label", `label "${label}" must not end with sentence punctuation`);
    }
  }

  if (typeof data.summary !== "string" || !data.summary.trim()) {
    fail("block-summary", "summary is required and must be one sentence");
  } else {
    const summary = data.summary.trim();
    const length = characterCount(summary);
    if (length > BLOCK_SUMMARY_MAX) {
      fail("block-summary", `summary is ${length} characters; keep it to ${BLOCK_SUMMARY_MAX} or fewer`);
    }
    if (summary.includes("\n")) {
      fail("block-summary", "summary must be a single line");
    }
  }

  if (data.aliases !== undefined && data.aliases !== null) {
    if (!Array.isArray(data.aliases)) {
      fail("block-alias-type", "aliases must be a list of block ids");
    } else {
      const seen = new Set();
      for (const [index, raw] of data.aliases.entries()) {
        const alias = typeof raw === "string" ? raw.trim() : "";
        if (!alias || !BLOCK_SLUG.test(alias)) {
          fail("block-alias-type", `aliases[${index}] "${raw}" must be a kebab-case block id`);
          continue;
        }
        if (seen.has(alias)) {
          fail("block-alias-duplicate", `duplicate alias "${alias}"`);
          continue;
        }
        seen.add(alias);
        if (blockIds.has(alias)) {
          fail("block-alias-conflict", `alias "${alias}" conflicts with an existing block id`);
        }
      }
    }
  }

  for (const kind of ["prerequisites", "related"]) {
    const name = kind === "prerequisites" ? "prerequisite" : "related";
    const value = data[kind];
    if (value === undefined || value === null) continue;
    if (!Array.isArray(value)) {
      fail(`block-${name}-type`, `${kind} must be a list of block ids`);
      continue;
    }
    const seen = new Set();
    for (const [index, raw] of value.entries()) {
      const id = typeof raw === "string" ? raw.trim() : "";
      if (!id) {
        fail(`block-${name}-type`, `${kind}[${index}] must be a non-empty block id`);
        continue;
      }
      if (id.includes("/") || id.startsWith("learn/")) {
        fail(`block-${name}-subject`, `${kind}[${index}] "${id}" must be a bare block id in the same subject`);
        continue;
      }
      if (seen.has(id)) {
        fail(`block-${name}-duplicate`, `duplicate ${kind} entry "${id}"`);
        continue;
      }
      seen.add(id);
      if (id === block.id) {
        fail(`block-${name}-self`, `a block cannot list itself in ${kind}`);
      }
    }
  }

  if (data.sources !== undefined && data.sources !== null && !Array.isArray(data.sources)) {
    fail("block-sources-type", "sources must be a list of source links");
  }

  return failures;
}

export function validateBlockSections(block) {
  if (block.error) return [];
  const type = String(block.data?.type);
  const required = BLOCK_SECTIONS[type];
  if (!required) return [];
  const headings = new Set(blockHeadings(block.body));
  return required
    .filter((section) => !headings.has(section))
    .map((section) => ({
      checkId: "block-section",
      message: `a ${type} block needs a "## ${section}" section`,
      line: 1,
    }));
}

function prerequisiteGraph(blocks) {
  const graph = new Map();
  for (const block of blocks) {
    const value = block.data?.prerequisites;
    graph.set(
      block.id,
      Array.isArray(value)
        ? value.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean)
        : [],
    );
  }
  return graph;
}

export function findPrerequisiteCycles(blocks) {
  const graph = prerequisiteGraph(blocks);
  const state = new Map();
  const stack = [];
  const cyclic = new Set();

  function visit(id) {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      const at = stack.indexOf(id);
      for (const node of stack.slice(at < 0 ? 0 : at)) cyclic.add(node);
      return;
    }
    state.set(id, 1);
    stack.push(id);
    for (const next of graph.get(id) ?? []) visit(next);
    stack.pop();
    state.set(id, 2);
  }

  for (const id of graph.keys()) visit(id);
  return cyclic;
}

export function validateBlockRelations(blocks) {
  const failures = [];
  const ids = new Set(blocks.map((block) => block.id));
  for (const block of blocks) {
    for (const raw of Array.isArray(block.data?.prerequisites) ? block.data.prerequisites : []) {
      const id = typeof raw === "string" ? raw.trim() : "";
      if (!id || id === block.id || id.includes("/")) continue;
      if (!ids.has(id)) {
        failures.push({
          file: block.file,
          checkId: "block-prerequisite-missing",
          message: `prerequisite "${id}" does not exist in this subject`,
          line: 1,
        });
      }
    }
    for (const raw of Array.isArray(block.data?.related) ? block.data.related : []) {
      const id = typeof raw === "string" ? raw.trim() : "";
      if (!id || id === block.id || id.includes("/")) continue;
      if (!ids.has(id)) {
        failures.push({
          file: block.file,
          checkId: "block-related-missing",
          message: `related block "${id}" does not exist in this subject`,
          line: 1,
        });
      }
    }
  }

  for (const id of findPrerequisiteCycles(blocks)) {
    const block = blocks.find((entry) => entry.id === id);
    failures.push({
      file: block?.file ?? "",
      checkId: "block-prerequisite-cycle",
      message: `block "${id}" is part of a prerequisite cycle`,
      line: 1,
    });
  }
  return failures;
}

export function validateInlineLinks(blocks) {
  const failures = [];
  const ids = new Set(blocks.map((block) => block.id));
  for (const block of blocks) {
    for (const id of collectInlineBlockLinks(block.body)) {
      if (!ids.has(id)) {
        failures.push({
          file: block.file,
          checkId: "block-inline-link",
          message: `inline link [[${id}]] does not resolve to a block in this subject`,
          line: 0,
        });
      }
    }
  }
  return failures;
}

export function conceptPairs(coverage) {
  const pairs = [];
  const steps = coverage && typeof coverage === "object" ? coverage.steps : {};
  for (const [key, step] of Object.entries(steps ?? {})) {
    const seen = new Set();
    const concepts = Array.isArray(step?.concepts) ? step.concepts : [];
    for (const concept of concepts) {
      const slug = typeof concept?.slug === "string" ? concept.slug.trim() : "";
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      pairs.push({
        step: key,
        slug,
        label: typeof concept.label === "string" ? concept.label : slug,
        block: typeof concept.block === "string" && concept.block.trim() ? concept.block.trim() : null,
      });
    }
  }
  return pairs;
}

export function computeCoverage(coverage) {
  const pairs = conceptPairs(coverage);
  const distinct = new Map();
  const blocks = new Set();
  const blockConcepts = new Map();
  let coveredPairs = 0;

  for (const pair of pairs) {
    if (pair.block) {
      coveredPairs += 1;
      blocks.add(pair.block);
      const slugs = blockConcepts.get(pair.block) ?? new Set();
      slugs.add(pair.slug);
      blockConcepts.set(pair.block, slugs);
    }
    const entry = distinct.get(pair.slug) ?? { slug: pair.slug, label: pair.label, covered: false };
    if (pair.label) entry.label = pair.label;
    entry.covered = entry.covered || Boolean(pair.block);
    distinct.set(pair.slug, entry);
  }

  const concepts = [...distinct.values()];
  const coveredConcepts = concepts.filter((concept) => concept.covered);
  const totalPairs = pairs.length;
  const totalConcepts = concepts.length;
  const saved = [...blockConcepts.values()].reduce((sum, slugs) => sum + Math.max(0, slugs.size - 1), 0);

  return {
    pairs: totalPairs,
    coveredPairs,
    stepCoverage: totalPairs === 0 ? 1 : coveredPairs / totalPairs,
    concepts: totalConcepts,
    coveredConcepts: coveredConcepts.length,
    courseCoverage: totalConcepts === 0 ? 1 : coveredConcepts.length / totalConcepts,
    blockCount: blocks.size,
    projectedBlocks: Math.max(0, totalConcepts - saved),
    reuseFactor: totalConcepts === 0 ? 0 : totalPairs / totalConcepts,
    uncovered: concepts.filter((concept) => !concept.covered),
  };
}

function stepSources(step) {
  const raw = Array.isArray(step?.sources) ? step.sources : [];
  return raw.map((entry) => sourceLinkPath(entry)).filter(Boolean);
}

function blockSources(block) {
  const raw = Array.isArray(block?.data?.sources) ? block.data.sources : [];
  return raw.map((entry) => sourceLinkPath(entry)).filter(Boolean);
}

/**
 * Report drift without rewriting anything. `steps` entries look like
 * { key, blocks, sources, updated } where updated is a YYYY-MM-DD string.
 */
export function detectDrift({ blocks = [], steps = [], coverage = null } = {}) {
  const drifts = [];
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const used = new Set();

  for (const step of steps) {
    const stepBlocks = Array.isArray(step.blocks) ? step.blocks : [];
    for (const id of stepBlocks) used.add(id);
    const sources = stepSources(step);
    for (const id of stepBlocks) {
      const block = byId.get(id);
      if (!block) continue;
      const blockDate = asDateString(block.data?.updated) ?? asDateString(block.data?.created);
      if (step.updated && blockDate && step.updated > blockDate) {
        drifts.push({
          kind: "stale-step",
          step: step.key,
          block: id,
          message: `step ${step.key} (${step.updated}) is newer than block ${id} (${blockDate})`,
        });
      }
      const referenced = blockSources(block);
      if (referenced.length > 0 && sources.length > 0 && !referenced.some((path) => sources.includes(path))) {
        drifts.push({
          kind: "source-not-referenced",
          step: step.key,
          block: id,
          message: `block ${id} cites ${referenced.join(", ")}, which step ${step.key} no longer cites`,
        });
      }
    }
  }

  for (const block of blocks) {
    if (!used.has(block.id)) {
      drifts.push({
        kind: "orphan-block",
        block: block.id,
        message: `block ${block.id} is not used by any step`,
      });
    }
  }

  for (const pair of conceptPairs(coverage)) {
    if (!pair.block) {
      drifts.push({
        kind: "uncovered-concept",
        step: pair.step,
        slug: pair.slug,
        message: `step ${pair.step} has no block for concept "${pair.label}" (${pair.slug})`,
      });
    }
  }

  for (const failure of validateBlockRelations(blocks)) {
    const kind = failure.checkId === "block-prerequisite-cycle" ? "prerequisite-cycle" : "broken-relation";
    drifts.push({ kind, block: null, message: failure.message });
  }

  return drifts;
}

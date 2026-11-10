import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";

export const BLOCK_TYPES = ["concept", "procedure", "principle", "contrast"];
export const BLOCK_STATUSES = ["draft", "reviewed"];
export const BLOCK_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const BLOCK_LABEL_MAX = 40;
export const BLOCK_SUMMARY_MAX = 120;
export const AUDIT_MATCH_KINDS = ["new", "reuse", "merge", "fuzzy"];

export const MAX_BLOCK_IMAGES = 1;

export const BLOCK_SECTIONS = {
  concept: ["定義", "為什麼重要", "如何運作", "例子", "邊界與常見誤解", "進階"],
  procedure: ["問題", "前置條件", "步驟", "例子", "失敗模式", "進階"],
  principle: ["主張", "為什麼成立", "適用範圍", "反例", "進階"],
  contrast: ["A 是什麼", "B 是什麼", "關鍵差異", "何時用哪個", "進階"],
};

const SENTENCE_PUNCTUATION = /[。！？；?!;]/;
const SENTENCE_START = /^(?:如何|為什麼|怎麼|是否|先|請|把|讓|避免|需要)/;
const SENTENCE_END = /[。！？!?]/;
const TRAILING_PUNCTUATION = /[.。！？；;,，、]$/;
const BLOCK_MARKER = /^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm;
const IMAGE_LINK = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
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

/**
 * A block label names a knowledge point: a noun or proper noun, never a
 * sentence. Returns one message per broken rule so verify and the audit
 * checker can share the same wording.
 */
export function labelProblems(label) {
  if (typeof label !== "string" || !label.trim()) {
    return ["label is required and must be a noun or proper noun"];
  }
  const value = label.trim();
  const problems = [];
  const length = characterCount(value);
  if (length > BLOCK_LABEL_MAX) {
    problems.push(`label is ${length} characters; keep it to ${BLOCK_LABEL_MAX} or fewer`);
  }
  if (value.includes("\n")) problems.push("label must be a single line");
  if (SENTENCE_PUNCTUATION.test(value)) {
    problems.push(`label "${value}" looks like a sentence; move the explanation to summary`);
  }
  if (SENTENCE_START.test(value)) {
    problems.push(`label "${value}" starts like a sentence; use a noun or proper noun`);
  }
  if (value.trim().split(/\s+/).length > 4) {
    problems.push(`label "${value}" has too many words; keep it to 1–4`);
  }
  if (TRAILING_PUNCTUATION.test(value)) {
    problems.push(`label "${value}" must not end with sentence punctuation`);
  }
  return problems;
}

/**
 * A summary is the one place a full sentence belongs, and only one. Returns
 * one message per broken rule so verify and the audit checker share wording.
 */
function summaryProblems(summary) {
  if (typeof summary !== "string" || !summary.trim()) {
    return ["summary is required and must be one sentence"];
  }
  const value = summary.trim();
  const problems = [];
  const length = characterCount(value);
  if (length > BLOCK_SUMMARY_MAX) {
    problems.push(`summary is ${length} characters; keep it to ${BLOCK_SUMMARY_MAX} or fewer`);
  }
  if (value.includes("\n")) {
    problems.push("summary must be a single line");
  }
  const withoutClosingQuotes = value.replace(/[」』”’"')]+$/u, "");
  const withoutFinalStop = SENTENCE_END.test(withoutClosingQuotes)
    ? withoutClosingQuotes.slice(0, -1)
    : withoutClosingQuotes;
  if (SENTENCE_END.test(withoutFinalStop)) {
    problems.push("summary must be one sentence; move extra sentences into the body");
  }
  return problems;
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

export function blockPlanPath(root, subject, id) {
  return join(blocksDir(root, subject), `${id}.plan.json`);
}

export function blockAssetsDir(root, subject, id) {
  return join(blocksDir(root, subject), `${id}-assets`);
}

export function blockImageLink(id, index = 1) {
  return `./${id}-assets/image-${index}.webp`;
}

/**
 * A block shows exactly one hero figure. The plan is a one-item array so it
 * can be hand-edited and rerendered with --force.
 */
export function normalizeBlockPlan(raw) {
  let parsed = raw;
  if (typeof raw === "string") {
    const text = String(raw).replace(/^```(?:json)?[ \t]*$/gm, "").trim();
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end <= start) throw new Error("block image plan must be a JSON array");
    try {
      parsed = JSON.parse(text.slice(start, end + 1));
    } catch {
      throw new Error("block image plan must be a JSON array");
    }
  }
  if (!Array.isArray(parsed)) throw new Error("block image plan must be a JSON array");
  if (parsed.length !== MAX_BLOCK_IMAGES) {
    throw new Error(`block image plan must have exactly ${MAX_BLOCK_IMAGES} item, got ${parsed.length}`);
  }
  const item = parsed[0];
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error("block image plan item 1 must be an object");
  }
  if (item.anchor !== undefined && item.anchor !== null && String(item.anchor).trim()) {
    throw new Error("block image plan does not take an anchor; the figure always follows the H1");
  }
  const prompt = String(item.prompt ?? "").trim();
  if (!prompt) throw new Error("block image plan item 1 needs a non-empty prompt");
  const heading = String(item.heading ?? "").trim().replace(/^#{1,6}[ \t]+/, "");
  return [{ index: 1, heading, prompt }];
}

/**
 * Put the <!--image:1--> marker between the H1 and the first `##` section.
 * Idempotent: an existing marker is left alone.
 */
export function insertBlockImageMarker(markdown) {
  const text = String(markdown).replace(/\r\n/g, "\n").trimEnd();
  if (/^[ \t]*<!--\s*image:\d+\s*-->[ \t]*$/m.test(text)) return `${text}\n`;
  const lines = text.split("\n");
  const h1 = lines.findIndex((line) => /^#\s+\S/.test(line));
  if (h1 === -1) throw new Error("block body needs an H1 before the image marker can be placed");
  let section = lines.findIndex((line, index) => index > h1 && /^##\s+/.test(line));
  if (section === -1) section = lines.length;
  const before = lines.slice(0, section);
  while (before.length > 0 && before[before.length - 1].trim() === "") before.pop();
  const after = lines.slice(section);
  const out = [...before, "", "<!--image:1-->", "", ...after].join("\n").trimEnd();
  return `${out}\n`;
}

export function replaceBlockImageMarker(markdown, id) {
  return String(markdown)
    .replace(BLOCK_MARKER, (_, index) => `![概念示意圖](${blockImageLink(id, Number(index))})`)
    .trimEnd() + "\n";
}

function stripFences(text) {
  return String(text).replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[^\n]*$/gm, "");
}

/**
 * Layout rules for a block figure: at most one marker or one image, placed
 * between the H1 and the first section, and the image must be the block's own
 * `-assets/image-1.webp`.
 */
export function blockImageProblems(body, id) {
  const problems = [];
  const text = stripFences(body ?? "");
  const figures = [...text.matchAll(new RegExp(BLOCK_MARKER.source, "gm"))].length +
    [...text.matchAll(IMAGE_LINK)].length;
  const h1 = text.match(/^#\s+\S.*$/m);
  if (!h1) {
    return figures === 0
      ? []
      : [{ checkId: "block-image-position", message: "a block needs an H1 before its figure", line: 1 }];
  }
  const h1End = h1.index + h1[0].length;
  const section = text.match(/^##\s+\S.*$/m);
  const sectionStart = section ? section.index : text.length;

  const markers = [...text.matchAll(/^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm)].map((match) => ({
    kind: "marker",
    at: match.index,
    index: Number(match[1]),
  }));
  const images = [...text.matchAll(IMAGE_LINK)]
    .filter((match) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(match[1]))
    .map((match) => ({ kind: "image", at: match.index, src: match[1].trim() }));

  const total = markers.length + images.length;
  if (total === 0) return [];
  if (total > 1) {
    problems.push({
      checkId: "block-image-count",
      message: `a block shows exactly one figure; found ${total} markers/images`,
      line: 1,
    });
  }
  if (markers.length > 0 && images.length > 0) {
    problems.push({
      checkId: "block-image-state",
      message: "a block has both an unrendered marker and a rendered image; render once",
      line: 1,
    });
  }
  for (const token of [...markers, ...images]) {
    if (token.at < h1End || token.at >= sectionStart) {
      problems.push({
        checkId: "block-image-position",
        message: "the block figure must sit after the H1 and before the first ## section",
        line: 1,
      });
      break;
    }
  }
  for (const image of images) {
    const expected = blockImageLink(id, 1);
    if (image.src !== expected) {
      problems.push({
        checkId: "block-image-location",
        message: `a block image must be "${expected}", found "${image.src}"`,
        line: 1,
      });
    }
  }
  return problems;
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
      const parsed = matter(readFileSync(path, "utf8"), {});
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

  for (const message of labelProblems(data.label)) {
    fail("block-label", message);
  }

  for (const message of summaryProblems(data.summary)) {
    fail("block-summary", message);
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

  if (data.author !== undefined && data.author !== null) {
    if (typeof data.author !== "string" || !data.author.trim()) {
      fail("block-author", "author must be a non-empty string when present");
    }
  }

  return failures;
}

export function validateBlockSections(block) {
  if (block.error) return [];
  const type = String(block.data?.type);
  const required = BLOCK_SECTIONS[type];
  if (!required) return [];
  const headings = blockHeadings(block.body);
  const draft = String(block.data?.status) === "draft";
  if (headings.length === 0 && draft && /^#\s+\S/m.test(String(block.body))) return [];
  const missing = required
    .filter((section) => !headings.includes(section))
    .map((section) => ({
      checkId: "block-section",
      message: `a ${type} block needs a "## ${section}" section`,
      line: 1,
    }));
  if (missing.length > 0) return missing;
  const positions = required.map((section) => headings.indexOf(section));
  const inOrder = positions.every((position, index) => index === 0 || position > positions[index - 1]);
  if (!inOrder) {
    return [
      {
        checkId: "block-section",
        message: `a ${type} block must keep its required sections in this order: ${required.join(" / ")}`,
        line: 1,
      },
    ];
  }
  return [];
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

export function aliasMap(blocks) {
  const aliases = new Map();
  for (const block of blocks) {
    for (const raw of Array.isArray(block.data?.aliases) ? block.data.aliases : []) {
      if (typeof raw === "string" && raw.trim()) aliases.set(raw.trim(), block.id);
    }
  }
  return aliases;
}

/**
 * Flatten an audit into one list of concepts. The current shape stores one
 * shared list per node (`{ node, concepts: [...] }`); the legacy shape stored
 * a list per step (`{ node, steps: { <step>: { concepts } } }`). Both are
 * accepted so old audits still build coverage.
 */
export function auditConcepts(audit) {
  if (!audit || typeof audit !== "object" || Array.isArray(audit)) return [];
  if (Array.isArray(audit.concepts)) {
    return audit.concepts.map((concept) => ({
      ...concept,
      steps: Array.isArray(concept?.steps)
        ? concept.steps
            .map((step) => (typeof step === "string" ? step.trim() : ""))
            .filter(Boolean)
        : [],
    }));
  }
  const out = [];
  if (audit.steps && typeof audit.steps === "object" && !Array.isArray(audit.steps)) {
    for (const [stepId, payload] of Object.entries(audit.steps)) {
      for (const concept of Array.isArray(payload?.concepts) ? payload.concepts : []) {
        out.push({
          ...concept,
          steps: [stepId],
          note:
            typeof concept?.note === "string" && concept.note.trim()
              ? concept.note
              : typeof payload?.note === "string"
                ? payload.note
                : "",
        });
      }
    }
  }
  return out;
}

/**
 * A label's comparable form for dedupe: case-folded, without a parenthetical
 * translation, whitespace, or ordinary punctuation. Symbols that change the
 * term itself (`@`, `^`, `+`, `#`) are kept so pass@k and pass^k stay distinct.
 */
export function normalizeTerm(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[（(][^）)]*[）)]/g, "")
    .toLowerCase()
    .replace(/[\s\-_,，。.：:；;！!？?'"「」『』（）()]+/g, "");
}

/**
 * Check one node's audit file before its candidates become blocks. A failure
 * blocks the write phase; a warning (short step, overflow, already-existing
 * "new" slug) is shown to the learner but does not stop the run.
 *
 * `eligibleSteps` is a Set of "<node>/<step>" keys for steps that are written,
 * in the node plan, and have an article body. When it is empty the eligibility
 * check is skipped, which keeps this function usable on its own.
 */
export function validateAudit(
  audit,
  { subject, nodes = new Map(), blocks = [], eligibleSteps = new Set() } = {},
) {
  const failures = [];
  const warnings = [];
  const fail = (checkId, message, detail = {}) => failures.push({ checkId, message, ...detail });
  const warn = (checkId, message, detail = {}) => warnings.push({ checkId, message, ...detail });

  if (!audit || typeof audit !== "object" || Array.isArray(audit)) {
    fail("audit-object", "audit must be a JSON object");
    return { failures, warnings };
  }
  const nodeId = typeof audit.node === "string" ? audit.node.trim() : "";
  if (!nodeId) {
    fail("audit-node", "audit.node is required");
    return { failures, warnings };
  }
  const node = nodes.get(nodeId);
  if (!node) fail("audit-node-unknown", `audit.node "${nodeId}" is not a node in ${subject}`);
  else if (node.status !== "written") {
    fail("audit-node-status", `audit.node "${nodeId}" is ${node.status}, not written`);
  }
  const ids = new Set(blocks.map((block) => block.id));
  const aliases = aliasMap(blocks);
  const labels = new Map(
    blocks.map((block) => [normalizeTerm(block.data?.label ?? block.id), block.id]),
  );

  if (Array.isArray(audit.concepts)) {
    const concepts = audit.concepts;
    if (concepts.length === 0) {
      fail("audit-concepts-empty", `audit for "${nodeId}" needs at least one shared concept`);
    }
    if (concepts.length > 5) {
      warn(
        "audit-concepts-overflow",
        `audit for "${nodeId}" has ${concepts.length} concepts; a node links at most five blocks`,
      );
    }

    const seen = new Set();
    for (const [index, concept] of concepts.entries()) {
      const label = `concepts[${index}]`;
      const slug = typeof concept?.slug === "string" ? concept.slug.trim() : "";
      if (!slug || !BLOCK_SLUG.test(slug)) {
        fail("audit-concept-slug", `${label}.slug must be kebab-case`, { slug });
      } else if (seen.has(slug)) {
        fail("audit-concept-duplicate", `audit repeats concept "${slug}"`, { slug });
      } else {
        seen.add(slug);
      }
      for (const message of labelProblems(concept?.label)) {
        fail("audit-concept-label", `${label}: ${message}`, { slug });
      }

      const stepIds = Array.isArray(concept?.steps) ? concept.steps : [];
      if (stepIds.length === 0) {
        fail("audit-concept-steps", `${label} needs at least one related step`, { slug });
      }
      const stepSources = new Set();
      const seenSteps = new Set();
      for (const rawStep of stepIds) {
        const stepId = typeof rawStep === "string" ? rawStep.trim() : "";
        if (!stepId) {
          fail("audit-concept-steps", `${label}.steps must contain non-empty step ids`, { slug });
          continue;
        }
        if (seenSteps.has(stepId)) {
          fail("audit-concept-steps", `${label}.steps repeats "${stepId}"`, { slug });
          continue;
        }
        seenSteps.add(stepId);
        const key = `${nodeId}/${stepId}`;
        if (node && !node.steps.has(stepId)) {
          fail("audit-step-unknown", `${key} is not a step of node "${nodeId}"`, { step: key, slug });
        }
        if (eligibleSteps.size > 0 && !eligibleSteps.has(key)) {
          fail("audit-step-not-eligible", `${key} is not a written step with an article body`, {
            step: key,
            slug,
          });
        }
        const step = node?.steps?.get?.(stepId);
        for (const rawSource of Array.isArray(step?.sources) ? step.sources : []) {
          const path = sourceLinkPath(rawSource);
          if (path) stepSources.add(path);
        }
      }

      const type = concept?.type;
      if (type !== undefined && type !== null && !BLOCK_TYPES.includes(String(type))) {
        fail("audit-concept-type", `${label}.type must be one of ${BLOCK_TYPES.join(", ")}`, { slug });
      }
      for (const message of summaryProblems(concept?.summary)) {
        fail("audit-concept-summary", `${label}: ${message}`, { slug });
      }

      const sources = Array.isArray(concept?.sources) ? concept.sources : [];
      if (sources.length === 0) {
        fail("audit-concept-sources", `${label} needs at least one source link`, { slug });
      } else {
        for (const [sourceIndex, source] of sources.entries()) {
          const path = sourceLinkPath(source);
          if (!path) {
            fail(
              "audit-concept-sources",
              `${label}.sources[${sourceIndex}] must be a [[sources/...#Lx-Ly]] link`,
              { slug },
            );
          } else if (stepSources.size > 0 && !stepSources.has(path)) {
            fail(
              "audit-concept-sources",
              `${label}.sources[${sourceIndex}] cites ${path}, which its steps do not cite`,
              { slug },
            );
          }
        }
      }

      const kind = concept?.match?.kind;
      if (!AUDIT_MATCH_KINDS.includes(kind)) {
        fail(
          "audit-match-kind",
          `${label}.match.kind must be one of ${AUDIT_MATCH_KINDS.join(", ")}`,
          { slug },
        );
        continue;
      }
      if (kind === "reuse" || kind === "merge") {
        const target = typeof concept?.match?.block === "string" ? concept.match.block.trim() : "";
        if (!target) {
          fail("audit-match-block", `${label} is a ${kind} candidate but names no block`, { slug });
        } else if (!ids.has(target) && !aliases.has(target)) {
          fail("audit-match-block", `${label} points at unknown block "${target}"`, { slug });
        }
      }
      if (kind === "new" && slug) {
        if (ids.has(slug)) {
          fail(
            "audit-new-existing",
            `${label} is marked new but block "${slug}" already exists; reuse it`,
            { slug },
          );
        } else if (aliases.has(slug)) {
          fail(
            "audit-new-existing",
            `${label} is marked new but "${slug}" is an alias of block "${aliases.get(slug)}"; reuse it`,
            { slug },
          );
        } else {
          const normalized = normalizeTerm(concept?.label);
          const existing = normalized ? labels.get(normalized) : null;
          if (existing && existing !== slug) {
            fail(
              "audit-new-existing",
              `${label} is marked new but its label matches block "${existing}"; reuse or merge it`,
              { slug },
            );
          }
        }
      }
    }
    return { failures, warnings };
  }

  if (!audit.steps || typeof audit.steps !== "object" || Array.isArray(audit.steps)) {
    fail("audit-steps", `audit for "${nodeId}" needs a concepts array or a legacy steps object`);
    return { failures, warnings };
  }

  for (const [stepId, payload] of Object.entries(audit.steps)) {
    const key = `${nodeId}/${stepId}`;
    if (node && !node.steps.has(stepId)) {
      fail("audit-step-unknown", `${key} is not a step of node "${nodeId}"`, { step: key });
    }
    if (eligibleSteps.size > 0 && !eligibleSteps.has(key)) {
      fail("audit-step-not-eligible", `${key} is not a written step with an article body`, { step: key });
    }
    const concepts = Array.isArray(payload?.concepts) ? payload.concepts : [];
    if (concepts.length === 0) {
      fail("audit-concepts-empty", `${key} needs at least one concept`, { step: key });
    }
    const note = typeof payload?.note === "string" ? payload.note.trim() : "";
    if (concepts.length > 0 && concepts.length < 3 && !note) {
      warn("audit-concept-short", `${key} has ${concepts.length} concept(s); add a note explaining why`, {
        step: key,
      });
    }
    if (concepts.length > 6) {
      warn("audit-concept-overflow", `${key} has ${concepts.length} concepts; keep the six strongest`, {
        step: key,
      });
    }

    const seen = new Set();
    for (const [index, concept] of concepts.entries()) {
      const label = `${key}.concepts[${index}]`;
      const slug = typeof concept?.slug === "string" ? concept.slug.trim() : "";
      if (!slug || !BLOCK_SLUG.test(slug)) {
        fail("audit-concept-slug", `${label}.slug must be kebab-case`, { step: key, slug });
      } else if (seen.has(slug)) {
        fail("audit-concept-duplicate", `${key} repeats concept "${slug}"`, { step: key, slug });
      } else {
        seen.add(slug);
      }
      for (const message of labelProblems(concept?.label)) {
        fail("audit-concept-label", `${label}: ${message}`, { step: key, slug });
      }
      const sources = Array.isArray(concept?.sources) ? concept.sources : [];
      if (sources.length === 0) {
        fail("audit-concept-sources", `${label} needs at least one source link`, { step: key, slug });
      } else {
        for (const [sourceIndex, source] of sources.entries()) {
          if (!sourceLinkPath(source)) {
            fail(
              "audit-concept-sources",
              `${label}.sources[${sourceIndex}] must be a [[sources/...#Lx-Ly]] link`,
              { step: key, slug },
            );
          }
        }
      }

      const kind = concept?.match?.kind;
      if (!AUDIT_MATCH_KINDS.includes(kind)) {
        fail(
          "audit-match-kind",
          `${label}.match.kind must be one of ${AUDIT_MATCH_KINDS.join(", ")}`,
          { step: key, slug },
        );
        continue;
      }
      if (kind === "reuse" || kind === "merge") {
        const target = typeof concept?.match?.block === "string" ? concept.match.block.trim() : "";
        if (!target) {
          fail("audit-match-block", `${label} is a ${kind} candidate but names no block`, { step: key, slug });
        } else if (!ids.has(target) && !aliases.has(target)) {
          fail("audit-match-block", `${label} points at unknown block "${target}"`, { step: key, slug });
        }
      }
      if (kind === "new" && slug) {
        if (ids.has(slug)) {
          fail(
            "audit-new-existing",
            `${label} is marked new but block "${slug}" already exists; reuse it`,
            { step: key, slug },
          );
        } else if (aliases.has(slug)) {
          fail(
            "audit-new-existing",
            `${label} is marked new but "${slug}" is an alias of block "${aliases.get(slug)}"; reuse it`,
            { step: key, slug },
          );
        } else {
          const normalized = normalizeTerm(concept?.label);
          const existing = normalized ? labels.get(normalized) : null;
          if (existing && existing !== slug) {
            fail(
              "audit-new-existing",
              `${label} is marked new but its label matches block "${existing}"; reuse or merge it`,
              { step: key, slug },
            );
          }
        }
      }
    }
  }

  return { failures, warnings };
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
  const usage = new Map();

  for (const step of steps) {
    const stepBlocks = Array.isArray(step.blocks) ? step.blocks : [];
    for (const id of stepBlocks) {
      used.add(id);
      const entries = usage.get(id) ?? [];
      entries.push({ key: step.key, sources: stepSources(step) });
      usage.set(id, entries);
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
    }
  }

  for (const [id, entries] of usage) {
    const block = byId.get(id);
    if (!block) continue;
    const referenced = blockSources(block);
    if (referenced.length === 0) continue;
    const cited = entries.some((entry) =>
      entry.sources.some((path) => referenced.includes(path)),
    );
    if (!cited) {
      const keys = entries.map((entry) => entry.key);
      drifts.push({
        kind: "source-not-referenced",
        step: keys.length === 1 ? keys[0] : null,
        block: id,
        message: `block ${id} cites ${referenced.join(", ")}, which none of its steps (${keys.join(", ")}) cites`,
      });
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

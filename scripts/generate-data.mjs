import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEARN_ROOT = join(REPO_ROOT, "learn");
const OUT = join(REPO_ROOT, "knowledge-map", "src", "data", "graph.json");

const STATUS_ORDER = ["draft", "confirmed", "nodes-written", "content-written", "edges-written"];
const ALLOWED_STATUS = new Set(STATUS_ORDER);

export function coerce(value) {
  const trimmed = value.trim();
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export function unquote(value) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}

function indentOf(line) {
  return line.length - line.trimStart().length;
}

function nextNonEmptyIndex(lines, from) {
  for (let i = from; i < lines.length; i++) {
    if (lines[i].trim()) return i;
  }
  return -1;
}

// Parse the nested block that follows a `key:` / `- key:` line. `keyIndent` is
// the indentation of that owner line. A list (`- item` lines) may sit at the
// same indentation (legacy flat style) or deeper; a deeper mapping becomes the
// value; otherwise the value is an empty list. Returns the parsed value and the
// next unconsumed index.
function parseNestedValue(lines, from, keyIndent) {
  const next = nextNonEmptyIndex(lines, from);
  if (next !== -1) {
    const ind = indentOf(lines[next]);
    if (ind >= keyIndent && lines[next].trim().startsWith("-")) {
      const list = parseList(lines, next);
      return { value: list.value, next: list.next };
    }
    if (ind > keyIndent) {
      const mapping = parseMapping(lines, next);
      return { value: mapping.value, next: mapping.next };
    }
  }
  return { value: [], next: from };
}

// Parse a sequence of `key: value` / `key:` entries at a fixed indentation
// level. Nested lists (`- item` lines) and nested mappings (deeper keys) are
// parsed recursively. Returns the parsed object and the next unconsumed index.
function parseMapping(lines, start) {
  const value = {};
  const baseIndent = indentOf(lines[start]);
  let i = start;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind < baseIndent || line.trim().startsWith("-")) break;
    if (ind > baseIndent) {
      i++;
      continue;
    }
    const kv = line.trim().match(/^([\w-]+):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const rest = kv[2].trim();
    if (rest === "") {
      const nested = parseNestedValue(lines, i + 1, ind);
      value[key] = nested.value;
      i = nested.next;
      continue;
    }
    if (rest === "[]") {
      value[key] = [];
    } else {
      value[key] = coerce(unquote(rest));
    }
    i++;
  }
  return { value, next: i };
}

// Parse a sequence of `- item` lines at a fixed indentation level. Items may
// be scalars or objects (`- key: value` with deeper sibling keys / nested
// lists). Returns the parsed array and the next unconsumed index.
function parseList(lines, start) {
  const value = [];
  const baseIndent = indentOf(lines[start]);
  let i = start;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind < baseIndent) break;
    if (ind > baseIndent) {
      i++;
      continue;
    }
    const item = line.trim().match(/^-\s+(.*)$/);
    if (!item) break;
    const content = item[1].trim();
    const itemKv = content.match(/^([\w-]+):\s*(.*)$/);
    if (itemKv) {
      const obj = {};
      const key = itemKv[1];
      const rest = itemKv[2].trim();
      if (rest === "") {
        const nested = parseNestedValue(lines, i + 1, ind);
        obj[key] = nested.value;
        i = nested.next;
      } else if (rest === "[]") {
        obj[key] = [];
        i++;
      } else {
        obj[key] = coerce(unquote(rest));
        i++;
      }
      const next = nextNonEmptyIndex(lines, i);
      if (next !== -1 && indentOf(lines[next]) > baseIndent) {
        const mapping = parseMapping(lines, next);
        Object.assign(obj, mapping.value);
        i = mapping.next;
      }
      value.push(obj);
      continue;
    }
    value.push(coerce(unquote(content)));
    i++;
  }
  return { value, next: i };
}

export function parseFrontmatter(md) {
  const data = {};
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  let body = md;
  if (match) {
    body = md.slice(match[0].length);
    const lines = match[1].split("\n");
    let idx = 0;
    while (idx < lines.length) {
      const line = lines[idx].trimEnd();
      if (!line.trim() || indentOf(lines[idx]) > 0 || line.trim().startsWith("-")) {
        idx++;
        continue;
      }
      const { value, next } = parseMapping(lines, idx);
      Object.assign(data, value);
      idx = next;
    }
  }
  return { data, body };
}

export function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  const tokens = [];
  let out = text.replace(/`([^`]+)`/g, (_m, code) => {
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    tokens.push(`<a href="${escapeHtml(url)}">${renderInline(label)}</a>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, label) => {
    if (target.startsWith("sources/")) {
      tokens.push(`<span class="source-ref">${escapeHtml(target)}</span>`);
    } else {
      const text = label || target.split("/").pop();
      tokens.push(
        `<a class="wikilink" data-target="${escapeHtml(target)}">${renderInline(text)}</a>`,
      );
    }
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, (_m, inner) => {
    tokens.push(`<strong>${renderInline(inner)}</strong>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, (_m, pre, inner) => {
    tokens.push(`${pre}<em>${renderInline(inner)}</em>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = escapeHtml(out).replace(/\u0000(\d+)\u0000/g, (_m, i) => tokens[Number(i)]);
  return out;
}

export function renderMarkdown(md) {
  const lines = md.split("\n");
  const out = [];
  let para = [];
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${renderInline(para.join(" "))}</p>`);
      para = [];
    }
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      flushPara();
      i++;
      continue;
    }
    if (line.trim().startsWith("```")) {
      flushPara();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre class="code-block"><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      const buf = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote><p>${renderInline(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem) {
      flushPara();
      out.push("<ul>");
      while (i < lines.length) {
        const m = lines[i].match(/^\s*-\s+(.*)$/);
        if (!m) break;
        out.push(`<li>${renderInline(m[1])}</li>`);
        i++;
        if (i < lines.length && /^\s+-\s+/.test(lines[i])) {
          out.push("<ul>");
          while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
            const nested = lines[i].match(/^\s*-\s+(.*)$/);
            out.push(`<li>${renderInline(nested[1])}</li>`);
            i++;
          }
          out.push("</ul>");
        }
      }
      out.push("</ul>");
      continue;
    }
    const orderedItem = line.match(/^\d+\.\s+(.*)$/);
    if (orderedItem) {
      flushPara();
      out.push("<ol>");
      while (i < lines.length) {
        const m = lines[i].match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        out.push(`<li>${renderInline(m[1])}</li>`);
        i++;
      }
      out.push("</ol>");
      continue;
    }
    para.push(line);
    i++;
  }
  flushPara();
  return out.join("\n");
}

export function renderSourcesSection(sources) {
  if (!sources || sources.length === 0) return "";
  const items = sources.map((s) => `<li>${renderInline(String(s))}</li>`).join("\n");
  return `\n<h2>Sources</h2>\n<ul>\n${items}\n</ul>\n`;
}

function stripSubjectPrefix(value) {
  return String(value).split("/").pop();
}

function normalizeQuestions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((q) => ({
    question: String(q.question ?? ""),
    options: Array.isArray(q.options) ? q.options.map((o) => String(o)) : [],
    answer: Number(q.answer) || 0,
  }));
}

function extractElementLinks(body, subject) {
  const links = new Set();
  const re = new RegExp(
    `\\[\\[learn\\/${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/elements\\/([^\\]|]+)`,
    "g",
  );
  let m;
  while ((m = re.exec(body)) !== null) {
    links.add(m[1]);
  }
  return [...links];
}

// Extract element links from one named `## Heading` section of a body. `headings`
// may list localized variants of the same section name; only Connections and
// Deep dive are guaranteed to stay English, other section names render in the
// subject's `MEMORY.md` language.
function extractSectionElementLinks(body, subject, headings) {
  const names = Array.isArray(headings) ? headings : [headings];
  const pattern = names
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const re = new RegExp(`^##\\s+(?:${pattern})\\s*$`, "m");
  const match = body.match(re);
  if (!match) return [];
  const rest = body.slice(match.index + match[0].length);
  const nextHeading = rest.match(/^##\s/m);
  const section = nextHeading ? rest.slice(0, nextHeading.index) : rest;
  return extractElementLinks(section, subject);
}

function parseTiers(roadmap) {
  const tiers = [];
  for (const line of roadmap.split("\n")) {
    const m = line.match(/^#{1,6}\s*Tier\s+(\d+)\s+[—-]\s+(.+)$/);
    if (m) {
      tiers.push({ tier: Number(m[1]), title: m[2].trim() });
    }
  }
  return tiers;
}

function prepareById(prepareFiles) {
  const map = new Map();
  for (const [key, content] of Object.entries(prepareFiles ?? {})) {
    const m = key.match(/^prepares\/(.+)\.md$/);
    if (m) map.set(m[1], content);
  }
  return map;
}

const ELEMENT_TYPES = new Set(["article", "video", "question"]);

export function buildSubjectGraph({ subject, roadmap, nodeFiles, elementFiles, edgeFiles, prepareFiles }) {
  const prepares = prepareById(prepareFiles);
  const nodes = [];
  const nodePrereqById = new Map();
  for (const content of Object.values(nodeFiles)) {
    const { data, body } = parseFrontmatter(content);
    if (!data.id) continue;
    const html = renderMarkdown(body);
    const hasSourcesHeading = /^##\s+Sources\s*$/m.test(body);
    const sourcesSection = hasSourcesHeading ? "" : renderSourcesSection(data.sources);
    const prepareContent = prepares.get(data.id);
    const prepareHtml = prepareContent ? renderMarkdown(parseFrontmatter(prepareContent).body) : null;
    nodePrereqById.set(data.id, (data.prerequisites ?? []).map(stripSubjectPrefix));
    nodes.push({
      id: data.id,
      title: data.title ?? data.id,
      tier: Number(data.tier) || 1,
      order: Number(data.order) || 0,
      duration: data.duration ?? "",
      goal: data.goal ?? "",
      status: ALLOWED_STATUS.has(data.status) ? data.status : "draft",
      taughtElementIds: (data.elements ?? []).map(stripSubjectPrefix),
      sources: data.sources ?? [],
      contentHtml: html,
      fullArticleHtml: html + sourcesSection,
      prepareHtml,
      hasPrepare: prepareHtml !== null,
    });
  }
  nodes.sort((a, b) => a.tier - b.tier || a.order - b.order);

  const elements = {};
  for (const content of Object.values(elementFiles)) {
    const { data, body } = parseFrontmatter(content);
    if (!data.id) continue;
    const type = ELEMENT_TYPES.has(data.type) ? data.type : "article";
    elements[data.id] = {
      id: data.id,
      title: data.title ?? data.id,
      tier: Number(data.tier) || 1,
      order: Number(data.order) || 0,
      type,
      taughtByNodes: (data.nodes ?? []).map(stripSubjectPrefix),
      sources: data.sources ?? [],
      bodyHtml: renderMarkdown(body),
      connections: extractElementLinks(body, subject),
      prerequisiteIds: extractSectionElementLinks(body, subject, [
        "Prerequisites",
        "前置知識",
        "我需要先知道什麼？",
      ]),
      ...(type === "video" ? { videoUrl: data.videoUrl ?? "" } : {}),
      ...(type === "question" ? { questions: normalizeQuestions(data.questions) } : {}),
    };
  }

  const tierTitleById = new Map(parseTiers(roadmap).map((t) => [t.tier, t.title]));
  const byTier = new Map();
  for (const n of nodes) {
    if (!byTier.has(n.tier)) byTier.set(n.tier, []);
    byTier.get(n.tier).push(n.id);
  }
  const tiers = [...byTier.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([tier, nodeIds]) => ({
      tier,
      title: tierTitleById.get(tier) ?? `Tier ${tier}`,
      nodeIds,
    }));

  const elementToNodes = new Map();
  for (const n of nodes) {
    for (const elementId of n.taughtElementIds) {
      if (!elementToNodes.has(elementId)) elementToNodes.set(elementId, []);
      elementToNodes.get(elementId).push(n);
    }
  }

  const edges = [];
  const seen = new Set();
  const pushEdge = (from, to, kind, label) => {
    if (from === to) return;
    const key = `${from}\u0000${to}\u0000${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push(label ? { from, to, kind, label } : { from, to, kind });
  };

  for (let i = 0; i + 1 < nodes.length; i++) {
    pushEdge(nodes[i].id, nodes[i + 1].id, "spine");
  }

  for (const teachingNodes of elementToNodes.values()) {
    for (let i = 0; i < teachingNodes.length; i++) {
      for (let j = i + 1; j < teachingNodes.length; j++) {
        pushEdge(teachingNodes[i].id, teachingNodes[j].id, "shared-concept");
      }
    }
  }

  for (const content of Object.values(edgeFiles)) {
    const { data } = parseFrontmatter(content);
    if (!data.from || !data.to) continue;
    const fromElement = stripSubjectPrefix(data.from);
    const toElement = stripSubjectPrefix(data.to);
    const fromNodes = elementToNodes.get(fromElement) ?? [];
    const toNodes = elementToNodes.get(toElement) ?? [];
    for (const fn of fromNodes) {
      for (const tn of toNodes) {
        pushEdge(fn.id, tn.id, "explicit", data.title);
      }
    }
  }

  edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.kind.localeCompare(b.kind));

  const elementsList = Object.values(elements);
  for (const n of nodes) {
    const related = new Set();
    for (const elementId of n.taughtElementIds) {
      const element = elements[elementId];
      if (!element) continue;
      for (const c of element.connections) related.add(c);
      for (const other of elementsList) {
        if (other.connections.includes(elementId)) related.add(other.id);
      }
    }
    for (const elementId of n.taughtElementIds) related.delete(elementId);
    n.relatedElementIds = [...related].sort();

    const frontmatterPrereqs = nodePrereqById.get(n.id) ?? [];
    const merged = new Map();
    for (const id of frontmatterPrereqs) merged.set(id, "frontmatter");
    for (const id of n.relatedElementIds) {
      if (!merged.has(id)) merged.set(id, "derived");
    }
    const sorted = [...merged.entries()].sort(([a], [b]) => a.localeCompare(b));
    n.prerequisiteIds = sorted.map(([id]) => id);
    n.prerequisiteSources = Object.fromEntries(sorted);
  }

  return {
    subject,
    tiers,
    nodes,
    elements,
    edges,
  };
}

export function scanSubject(subject, learnRoot) {
  const sub = join(learnRoot, subject);
  const read = (rel) => readFileSync(join(sub, rel), "utf8");
  const list = (dir) => {
    const dirPath = join(sub, dir);
    if (!existsSync(dirPath)) return {};
    return Object.fromEntries(
      readdirSync(dirPath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => [`${dir}/${e.name}`, read(`${dir}/${e.name}`)]),
    );
  };
  return {
    roadmap: read("ROADMAP.md"),
    nodeFiles: list("nodes"),
    elementFiles: list("elements"),
    edgeFiles: list("edges"),
    prepareFiles: list("prepares"),
  };
}

export function loadAllSubjects(learnRoot) {
  const subjects = readdirSync(learnRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(learnRoot, e.name, "ROADMAP.md")))
    .map((e) => e.name)
    .sort();
  return subjects.map((subject) => {
    const scanned = scanSubject(subject, learnRoot);
    return buildSubjectGraph({
      subject,
      roadmap: scanned.roadmap,
      nodeFiles: scanned.nodeFiles,
      elementFiles: scanned.elementFiles,
      edgeFiles: scanned.edgeFiles,
      prepareFiles: scanned.prepareFiles,
    });
  });
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  const graphs = loadAllSubjects(LEARN_ROOT);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(graphs, null, 2)}\n`);
  console.log(`wrote ${OUT} (${graphs.length} subjects)`);
}

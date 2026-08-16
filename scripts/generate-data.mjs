import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEARN_ROOT = join(REPO_ROOT, "learn");
const OUT = join(REPO_ROOT, "knowledge-map", "src", "data", "graph.json");

const STATUS_ORDER = ["draft", "confirmed", "nodes-written", "content-written", "edges-written"];
const ALLOWED_STATUS = new Set(STATUS_ORDER);
const ELEMENT_TYPES = new Set(["article", "video", "question"]);

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

// Extract element links from one named `## Heading` section of a body. Node
// and element templates guarantee "Connections" and "Deep dive" stay in
// English, but the prerequisites section may use localized headings, so accept
// a list of candidates and use whichever is present.
function extractSectionElementLinks(body, subject, headings) {
  for (const heading of headings) {
    const re = new RegExp(`^##\\s+${heading}\\s*$`, "m");
    const match = body.match(re);
    if (!match) continue;
    const rest = body.slice(match.index + match[0].length);
    const nextHeading = rest.match(/^##\s/m);
    const section = nextHeading ? rest.slice(0, nextHeading.index) : rest;
    const links = extractElementLinks(section, subject);
    if (links.length > 0) return links;
  }
  return [];
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

function normalizeStepDag(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => ({
      id: String(s?.id ?? ""),
      order: Number(s?.order) || 0,
      deps: Array.isArray(s?.deps) ? s.deps.map((d) => String(d)) : [],
    }))
    .filter((s) => s.id);
}

export function buildSubjectGraph({ subject, roadmap, nodeFiles, elementFiles, edgeFiles, stepFiles = {} }) {
  const nodes = [];
  const nodePrereqById = new Map();
  const nodeStepDag = new Map();
  for (const content of Object.values(nodeFiles)) {
    const { data } = parseFrontmatter(content);
    if (!data.id) continue;
    nodePrereqById.set(data.id, (data.prerequisites ?? []).map(stripSubjectPrefix));
    nodeStepDag.set(data.id, normalizeStepDag(data.steps));
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
    });
  }
  nodes.sort((a, b) => a.tier - b.tier || a.order - b.order);

  const steps = {};
  for (const [relPath, content] of Object.entries(stepFiles)) {
    const { data } = parseFrontmatter(content);
    const parts = relPath.split("/");
    const nodeId = parts[1];
    const fileName = parts[parts.length - 1];
    const stepId = String(data.id ?? "").trim() || fileName.replace(/\.(md|mdx)$/, "");
    if (!stepId || !nodeId) continue;
    const dag = nodeStepDag.get(nodeId)?.find((s) => s.id === stepId);
    const qualifiedId = `${nodeId}/${stepId}`;
    steps[qualifiedId] = {
      id: qualifiedId,
      stepId,
      nodeId,
      title: data.title ?? stepId,
      order: dag?.order ?? (Number(data.order) || 0),
      deps: (dag?.deps ?? []).map((d) => `${nodeId}/${d}`),
      teaches: (data.teaches ?? []).map(stripSubjectPrefix),
      sources: data.sources ?? [],
    };
  }

  const elementToSteps = new Map();
  for (const step of Object.values(steps)) {
    for (const elementId of step.teaches) {
      if (!elementToSteps.has(elementId)) elementToSteps.set(elementId, []);
      elementToSteps.get(elementId).push(step.id);
    }
  }

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
      taughtBySteps: elementToSteps.get(data.id) ?? [],
      deprecated: type === "question",
      sources: data.sources ?? [],
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

  for (const step of Object.values(steps)) {
    for (const dep of step.deps) {
      pushEdge(dep, step.id, "step-dep");
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
    n.prerequisiteIds = [...merged.keys()].sort();
    n.prerequisiteSources = Object.fromEntries(
      [...merged.entries()].sort(([a], [b]) => a.localeCompare(b)),
    );
  }

  return {
    subject,
    tiers,
    nodes,
    steps,
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
        .filter((e) => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".mdx")))
        .map((e) => [`${dir}/${e.name}`, read(`${dir}/${e.name}`)]),
    );
  };
  const listSteps = () => {
    const nodesDir = join(sub, "nodes");
    if (!existsSync(nodesDir)) return {};
    const steps = {};
    for (const nodeEntry of readdirSync(nodesDir, { withFileTypes: true })) {
      if (!nodeEntry.isDirectory()) continue;
      const stepDir = join(nodesDir, nodeEntry.name);
      for (const f of readdirSync(stepDir, { withFileTypes: true })) {
        if (f.isFile() && (f.name.endsWith(".md") || f.name.endsWith(".mdx"))) {
          steps[`nodes/${nodeEntry.name}/${f.name}`] = readFileSync(join(stepDir, f.name), "utf8");
        }
      }
    }
    return steps;
  };
  return {
    roadmap: read("ROADMAP.md"),
    nodeFiles: list("nodes"),
    elementFiles: list("elements"),
    edgeFiles: list("edges"),
    stepFiles: listSteps(),
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
      stepFiles: scanned.stepFiles,
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

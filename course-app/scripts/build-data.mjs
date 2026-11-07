#!/usr/bin/env node
/**
 * build-data.mjs — Scans every subject under learn/ and generates JSON data
 * for the React course app:
 *
 *   src/data/subjects.json        ← index of all subjects
 *   src/data/subjects/<id>.json   ← one course per subject
 *   public/nodes/<subject>/...    ← step image assets (copied)
 *
 * Node and step content is Markdown. Steps are read in the order they appear
 * in the node's `steps` frontmatter array; no ordering fields are consulted.
 *
 * Usage: node scripts/build-data.mjs [--subject system-design]   (filter to one)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { countArticleCharacters } from "../../src/article.mjs";
import { extractHeadings } from "../src/lib/heading-anchor.mjs";
import { maxQuestionsFor, validateQuizPayload } from "../../src/quiz.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const LEARN_ROOT = path.join(REPO_ROOT, "learn");

// Display names for known subjects; falls back to the subject id.
const SUBJECT_TITLES = {
  "system-design": "系統設計",
};

// ---------- helpers ----------
/** Convert wiki-links to readable plain text. */
function cleanWikilinks(md) {
  return String(md)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, (_, p) =>
      p.split("/").pop().replace(/\.md.*$/, "")
    );
}

/** Split a Markdown body into { heading -> content } sections (## level). */
function splitSections(body) {
  const sections = {};
  let current = "_intro";
  sections[current] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^##\s+(.*)$/);
    if (m) {
      current = m[1].trim();
      sections[current] = [];
    } else {
      sections[current].push(line);
    }
  }
  return Object.fromEntries(
    Object.entries(sections).map(([k, v]) => [k, v.join("\n").trim()])
  );
}

function section(body, name) {
  return splitSections(body)[name] || "";
}

/** Parse a source wiki-link into a readable label + raw target. */
function parseSource(link) {
  const raw = String(link).replace(/^\[\[|\]\]$/g, "");
  const hashAt = raw.indexOf("#");
  const target = hashAt === -1 ? raw : raw.slice(0, hashAt);
  const locator = hashAt === -1 ? "" : raw.slice(hashAt);
  const name = target.split("/").pop();
  return {
    label: `${name}${locator}`,
    file: target,
    locator,
    name,
    lines: locator.replace(/^#/, "") || "全文",
  };
}

/** Normalize a frontmatter date to `YYYY-MM-DD` so dates sort as strings. */
function normalizeDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function readMarkdown(file) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data, body: content };
}

function slugFromHref(href) {
  const clean = String(href)
    .split("#")[0]
    .split("?")[0]
    .replace(/\.md$/, "");
  const parts = clean.split("/").filter(Boolean);
  const nodesAt = parts.lastIndexOf("nodes");
  if (nodesAt !== -1 && parts[nodesAt + 1]) return parts[nodesAt + 1];
  return parts[parts.length - 1] || clean;
}

/** Parse tiers and node ids from a ROADMAP's `### Tier N — name` sections. */
function parseRoadmap(body) {
  const tiers = [];
  const nodes = new Map();
  let currentTier = null;

  for (const line of body.split("\n")) {
    const tier = line.match(/^###\s+Tier\s+(\d+)\s*[—–-]\s*(.+)$/);
    if (tier) {
      currentTier = { tier: Number(tier[1]), name: tier[2].trim(), nodeIds: [] };
      tiers.push(currentTier);
      continue;
    }

    const md = line.match(/^\d+\.\s+\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/);
    const wiki = line.match(/^\d+\.\s+\*\*\[\[([^\]|]+)\|([^\]]+)\]\]\*\*/);
    const entry = md
      ? { title: md[1].trim(), href: md[2] }
      : wiki
        ? { title: wiki[2].trim(), href: wiki[1] }
        : null;
    if (entry && currentTier) {
      const id = slugFromHref(entry.href);
      currentTier.nodeIds.push(id);
      nodes.set(id, { title: entry.title });
    }
  }

  return { tiers, nodes };
}

/** An article counts as written only when it has prose beyond its H1 skeleton. */
function hasArticleBody(markdown) {
  const lines = String(markdown).split("\n");
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") index += 1;
  if (index < lines.length && /^#\s+/.test(lines[index])) index += 1;
  return lines.slice(index).join("\n").trim().length > 0;
}

function readQuizzes({ nodesDir, nodeId, stepId, characters }) {
  const file = path.join(nodesDir, nodeId, `${stepId}.quiz.json`);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return [];

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.warn(
      `⚠ Skipped ${path.relative(REPO_ROOT, file)}: ${error.message}`,
    );
    return [];
  }

  const errors = validateQuizPayload(payload, {
    maxQuestions: maxQuestionsFor(characters),
  });
  if (errors.length > 0) {
    console.warn(
      `⚠ Skipped ${path.relative(REPO_ROOT, file)}: ${errors[0].message}`,
    );
    return [];
  }

  return payload.questions.map(({ question, options, answer, explain }) => ({
    question,
    options,
    answer,
    explain,
  }));
}

function readStep({ nodesDir, nodeId, entry, order }) {
  const spec = entry && typeof entry === "object" ? entry : { id: entry };
  const file = path.join(nodesDir, nodeId, `${spec.id}.md`);
  const step = {
    id: spec.id,
    order,
    title: spec.title || spec.id,
    purpose: spec.purpose || "",
    author: spec.author || null,
    sources: (spec.sources || []).map(parseSource),
    blocks: Array.isArray(spec.blocks)
      ? spec.blocks.map((id) => String(id).trim()).filter(Boolean)
      : [],
    articleMd: "",
    headings: [],
    hasContent: false,
    quizzes: [],
  };

  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const { body } = readMarkdown(file);
    step.articleMd = body.trim();
    step.hasContent = hasArticleBody(step.articleMd);
    step.headings = extractHeadings(step.articleMd);
    if (!spec.title) {
      const heading = step.articleMd.split("\n").find((line) => /^#\s+/.test(line));
      if (heading) step.title = heading.replace(/^#\s+/, "").trim();
    }
    if (step.hasContent) {
      step.quizzes = readQuizzes({
        nodesDir,
        nodeId,
        stepId: spec.id,
        characters: countArticleCharacters(step.articleMd),
      });
    }
  }

  return step;
}

function idList(value) {
  return Array.isArray(value)
    ? value.map((id) => String(id).trim()).filter(Boolean)
    : [];
}

/** Read `blocks/*.md` as summaries plus their Markdown body. */
function readBlocks(subjectDir) {
  const dir = path.join(subjectDir, "blocks");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const id = name.replace(/\.md$/, "");
      const { frontmatter: fm, body } = readMarkdown(path.join(dir, name));
      return {
        id,
        title: fm.title || id,
        label: fm.label || fm.title || id,
        summary: fm.summary || "",
        type: fm.type || "concept",
        status: fm.status || "draft",
        aliases: idList(fm.aliases),
        prerequisites: idList(fm.prerequisites),
        related: idList(fm.related),
        sources: (Array.isArray(fm.sources) ? fm.sources : []).map(parseSource),
        bodyMd: body.trim(),
      };
    });
}

/**
 * Derive the summary objects, edges, per-block step usage and backlinks the
 * viewer needs. The full article body stays in the per-block files.
 */
function buildBlockGraph({ blocks, nodes }) {
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const usage = new Map(blocks.map((block) => [block.id, []]));
  const backlinks = new Map(blocks.map((block) => [block.id, []]));

  for (const node of nodes) {
    for (const step of node.steps) {
      const ids = step.blocks;
      for (const id of ids) {
        if (!byId.has(id)) continue;
        usage.get(id).push({
          nodeId: node.id,
          nodeTitle: node.title,
          stepId: step.id,
          stepTitle: step.title,
        });
      }
    }
  }

  const relatedById = new Map(
    blocks.map((block) => [block.id, new Set()])
  );
  for (const block of blocks) {
    for (const id of block.related) {
      if (!byId.has(id) || id === block.id) continue;
      relatedById.get(block.id).add(id);
      relatedById.get(id).add(block.id);
    }
  }
  for (const block of blocks) {
    block.related = [...relatedById.get(block.id)].sort();
  }

  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (from, to, kind) => {
    if (!byId.has(from) || !byId.has(to) || from === to) return;
    const key = `${from}->${to}:${kind}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, kind });
  };

  for (const block of blocks) {
    for (const id of block.prerequisites) {
      addEdge(block.id, id, "prerequisite");
      if (byId.has(id)) {
        backlinks.get(id).push({
          id: block.id,
          title: block.title,
          kind: "prerequisite",
        });
      }
    }
    for (const id of block.related) {
      if (!byId.has(id)) continue;
      const [from, to] = [block.id, id].sort();
      addEdge(from, to, "related");
      backlinks.get(id).push({
        id: block.id,
        title: block.title,
        kind: "related",
      });
    }
  }

  for (const [id, list] of backlinks) {
    const seen = new Set();
    backlinks.set(
      id,
      list
        .filter((entry) => {
          const key = `${entry.id}|${entry.kind}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort(
          (a, b) => a.id.localeCompare(b.id) || a.kind.localeCompare(b.kind)
        )
    );
  }

  const summaries = new Map(
    blocks.map((block) => [
      block.id,
      {
        id: block.id,
        title: block.title,
        summary: block.summary,
        type: block.type,
        status: block.status,
        prerequisites: [...block.prerequisites],
        related: [...block.related],
        steps: usage.get(block.id).map(
          (step) => `${step.nodeId}/${step.stepId}`
        ),
      },
    ])
  );

  return { summaries, edges, usage, backlinks };
}

/** Write one JSON file per block; the subject JSON never carries block prose. */
function writeBlockFiles({ appRoot, subject, blocks, graph }) {
  const dir = path.join(appRoot, "src", "data", "blocks", subject);
  fs.rmSync(dir, { recursive: true, force: true });
  if (blocks.length === 0) return;
  fs.mkdirSync(dir, { recursive: true });

  for (const block of blocks) {
    const payload = {
      id: block.id,
      title: block.title,
      label: block.label,
      summary: block.summary,
      type: block.type,
      status: block.status,
      aliases: block.aliases,
      prerequisites: block.prerequisites,
      related: block.related,
      sources: block.sources,
      bodyMd: block.bodyMd,
      steps: graph.usage.get(block.id),
      backlinks: graph.backlinks.get(block.id),
    };
    fs.writeFileSync(
      path.join(dir, `${block.id}.json`),
      JSON.stringify(payload)
    );
  }
}

/** Copy `nodes/<node>/<step>-assets/` into the app's public directory. */
function copyStepAssets({ nodesDir, nodeId, steps, appRoot, subject }) {
  const destSubject = path.join(appRoot, "public", "nodes", subject);
  const destNode = path.join(destSubject, nodeId);
  fs.rmSync(destNode, { recursive: true, force: true });

  for (const step of steps) {
    const assetsDir = path.join(nodesDir, nodeId, `${step.id}-assets`);
    if (!fs.existsSync(assetsDir)) continue;
    fs.cpSync(assetsDir, path.join(destNode, `${step.id}-assets`), {
      recursive: true,
    });
  }
}

/** Build the course object for one subject. Returns null if unusable. */
export function buildSubject(
  subject,
  { learnRoot = LEARN_ROOT, appRoot = APP_ROOT } = {}
) {
  const subjectDir = path.join(learnRoot, subject);
  const roadmapFile = path.join(subjectDir, "ROADMAP.md");
  if (!fs.existsSync(roadmapFile)) return null;

  const roadmap = readMarkdown(roadmapFile);
  const roadmapBody = roadmap.body;
  const roadmapUpdated = normalizeDate(roadmap.frontmatter.updated);
  const { tiers, nodes: roadmapNodes } = parseRoadmap(roadmapBody);

  const nodesDir = path.join(subjectDir, "nodes");
  const nodeFiles = fs.existsSync(nodesDir)
    ? fs
        .readdirSync(nodesDir)
        .filter(
          (f) =>
            f.endsWith(".md") &&
            fs.statSync(path.join(nodesDir, f)).isFile()
        )
    : [];

  const nodesById = new Map();

  for (const file of nodeFiles) {
    const nodeId = file.replace(/\.md$/, "");
    const { frontmatter: fm, body } = readMarkdown(path.join(nodesDir, file));
    const dag = Array.isArray(fm.steps) ? fm.steps : [];
    const steps = dag.map((entry, index) =>
      readStep({ nodesDir, nodeId, entry, order: index + 1 })
    );

    copyStepAssets({ nodesDir, nodeId, steps, appRoot, subject });

    nodesById.set(nodeId, {
      id: nodeId,
      title: fm.title || roadmapNodes.get(nodeId)?.title || nodeId,
      tier: fm.tier,
      order: fm.order,
      goal: fm.goal || "",
      prerequisites: fm.prerequisites || [],
      lessonIntro: cleanWikilinks(section(body, "Lesson")),
      updated: normalizeDate(fm.updated),
      steps,
    });
  }

  // Resolve prerequisite paths to node ids in this subject, dropping dangling
  // edges and duplicates. `prerequisites` stays as the raw frontmatter value.
  for (const node of nodesById.values()) {
    const seen = new Set();
    node.requires = (Array.isArray(node.prerequisites) ? node.prerequisites : [])
      .map((entry) => String(entry).split("/").pop().replace(/\.md$/, ""))
      .filter((id) => {
        if (id === node.id || !nodesById.has(id) || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
  }

  const orderedNodes = [];
  for (const tier of tiers) {
    for (const id of tier.nodeIds) {
      const node = nodesById.get(id);
      if (node && !orderedNodes.includes(node)) orderedNodes.push(node);
    }
  }
  for (const [, node] of nodesById) {
    if (!orderedNodes.includes(node)) orderedNodes.push(node);
  }

  const blocks = readBlocks(subjectDir);
  const graph = buildBlockGraph({ blocks, nodes: orderedNodes });
  for (const node of orderedNodes) {
    for (const step of node.steps) {
      step.blocks = step.blocks
        .map((id) => graph.summaries.get(id))
        .filter(Boolean);
    }
  }
  writeBlockFiles({ appRoot, subject, blocks, graph });

  const goal = section(roadmapBody, "Goal");
  const updated =
    [roadmapUpdated, ...[...nodesById.values()].map((node) => node.updated)]
      .filter(Boolean)
      .sort()
      .pop() || null;

  return {
    subject,
    title: SUBJECT_TITLES[subject] || subject.replace(/-/g, " "),
    language: "zh-Hant",
    goal,
    updated,
    tiers: tiers.map(({ tier, name }) => ({ tier, name })),
    blocks: blocks.map((block) => graph.summaries.get(block.id)),
    blockEdges: graph.edges,
    nodes: orderedNodes.map((node, index) => ({
      ...node,
      globalOrder: index + 1,
      totalNodes: orderedNodes.length,
    })),
  };
}

/** List subject ids that have a ROADMAP.md. */
export function discoverSubjects(learnRoot = LEARN_ROOT) {
  if (!fs.existsSync(learnRoot)) return [];
  return fs
    .readdirSync(learnRoot, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        fs.existsSync(path.join(learnRoot, d.name, "ROADMAP.md"))
    )
    .map((d) => d.name)
    .sort();
}

// ---------- CLI ----------
function main() {
  const argIdx = process.argv.indexOf("--subject");
  const only = argIdx > -1 ? process.argv[argIdx + 1] : null;

  const allSubjects = discoverSubjects(LEARN_ROOT);
  const targets = only ? allSubjects.filter((s) => s === only) : allSubjects;
  if (targets.length === 0) {
    console.error(
      `No subjects found in ${LEARN_ROOT}${only ? ` matching ${only}` : ""}`
    );
    process.exit(1);
  }

  const outDir = path.join(APP_ROOT, "src", "data", "subjects");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.rmSync(path.join(APP_ROOT, "src", "data", "blocks"), {
    recursive: true,
    force: true,
  });
  fs.rmSync(path.join(APP_ROOT, "public", "lessons"), {
    recursive: true,
    force: true,
  });

  const index = [];

  for (const subject of targets) {
    const course = buildSubject(subject);
    if (!course) {
      console.warn(`⚠ Skipped ${subject} (no ROADMAP.md)`);
      continue;
    }
    fs.writeFileSync(
      path.join(outDir, `${subject}.json`),
      JSON.stringify(course)
    );

    index.push({
      id: subject,
      title: course.title,
      nodes: course.nodes.length,
      steps: course.nodes.reduce((acc, n) => acc + n.steps.length, 0),
      updated: course.updated,
      goal: course.goal,
    });

    console.log(
      `✔ ${subject.padEnd(36)} ${String(course.nodes.length).padStart(3)} nodes, ${String(course.nodes.reduce((acc, n) => acc + n.steps.length, 0)).padStart(3)} steps`
    );
  }

  fs.writeFileSync(
    path.join(APP_ROOT, "src", "data", "subjects.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), subjects: index })
  );

  console.log(`✔ ${index.length} subjects → src/data/`);
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) main();

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
    sources: (spec.sources || []).map(parseSource),
    articleMd: "",
    hasContent: false,
    quizzes: [],
  };

  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const { body } = readMarkdown(file);
    step.articleMd = body.trim();
    step.hasContent = hasArticleBody(step.articleMd);
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
      steps,
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

  const goal = section(roadmapBody, "Goal");

  return {
    subject,
    title: SUBJECT_TITLES[subject] || subject.replace(/-/g, " "),
    language: "zh-Hant",
    goal,
    tiers: tiers.map(({ tier, name }) => ({ tier, name })),
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

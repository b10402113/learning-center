#!/usr/bin/env node
/**
 * build-data.mjs — Scans every subject under learn/ and generates JSON data
 * for the React course app:
 *
 *   src/data/subjects.json        ← index of all subjects
 *   src/data/subjects/<id>.json   ← one course per subject
 *   public/lessons/<subject>/     ← rendered lesson HTML pages (copied)
 *
 * Usage: node scripts/build-data.mjs [--subject system-design]   (filter to one)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const LEARN_ROOT = path.join(REPO_ROOT, "learn");

// ---------- CLI ----------
const argIdx = process.argv.indexOf("--subject");
const ONLY = argIdx > -1 ? process.argv[argIdx + 1] : null;

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
      p.split("/").pop().replace(/\.html.*$/, "")
    );
}

/** Strip JSX comments and trim whitespace-only lines. */
function stripJsxComments(md) {
  return String(md)
    .split("\n")
    .filter((l) => !/^\s*\{\/\*[\s\S]*?\*\/\}\s*$/.test(l))
    .join("\n");
}

/** Split an mdx body into { heading -> content } sections (## level). */
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

/** Extract a `<LearningGoal>...</LearningGoal>` block if present. */
function extractLearningGoalComponent(body) {
  const m = body.match(/<LearningGoal>\s*([\s\S]*?)\s*<\/LearningGoal>/);
  return m ? m[1].trim() : null;
}

/** Parse a source wiki-link into a readable label + raw target. */
function parseSource(link) {
  const raw = String(link).replace(/^\[\[|\]\]$/g, "");
  const label = cleanWikilinks(`[[${raw}]]`);
  return { label, target: raw };
}

function readMdx(file) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data, body: content };
}

/** Build the course object for one subject. Returns null if unusable. */
function buildSubject(subject) {
  const LEARN_DIR = path.join(LEARN_ROOT, subject);
  const roadmapFile = path.join(LEARN_DIR, "ROADMAP.md");
  if (!fs.existsSync(roadmapFile)) return null;

  // ---------- ROADMAP ----------
  const roadmap = readMdx(roadmapFile);
  const roadmapBody = stripJsxComments(roadmap.body);

  const goalMatch = roadmapBody.match(/^##\s+Goal\s*\n+([\s\S]*?)(?=\n##\s|$)/m);
  const subjectGoal = goalMatch ? goalMatch[1].trim() : "";

  const tiers = [];
  const roadmapNodes = {};
  let currentTier = null;
  for (const line of roadmapBody.split("\n")) {
    const t = line.match(/^###\s+Tier\s+(\d+)\s*[—–-]\s*(.+)$/);
    if (t) {
      currentTier = { tier: Number(t[1]), name: t[2].trim(), nodeIds: [] };
      tiers.push(currentTier);
      continue;
    }
    const n = line.match(/^\d+\.\s+\*\*\[\[([^\]|]+)\|([^\]]+)\]\]\*\*/);
    if (n && currentTier) {
      const nodeId = n[1].trim().split("/").pop();
      currentTier.nodeIds.push(nodeId);
      roadmapNodes[nodeId] = { title: n[2].trim() };
    }
  }

  // ---------- Nodes + Steps ----------
  const nodesDir = path.join(LEARN_DIR, "nodes");
  const nodeFiles = fs.existsSync(nodesDir)
    ? fs
        .readdirSync(nodesDir)
        .filter(
          (f) => f.endsWith(".mdx") && fs.statSync(path.join(nodesDir, f)).isFile()
        )
    : [];

  const nodesById = new Map();

  for (const file of nodeFiles) {
    const nodeId = file.replace(/\.mdx$/, "");
    const { frontmatter: fm, body } = readMdx(path.join(nodesDir, file));
    const cleanedBody = stripJsxComments(body);
    const sections = splitSections(cleanedBody);

    const dagSteps = Array.isArray(fm.steps) ? fm.steps : [];

    const lessonIntroRaw =
      sections["Lesson"] !== undefined &&
      !/^\{\//.test(sections["Lesson"]) &&
      sections["Lesson"].length > 0
        ? cleanWikilinks(sections["Lesson"])
        : "";

    const steps = [];
    for (const s of dagSteps) {
      const stepId = typeof s === "object" ? s.id : s;
      const order =
        typeof s === "object" && s.order ? s.order : steps.length + 1;
      const deps =
        typeof s === "object" && Array.isArray(s.deps) ? s.deps : [];
      const stepFile = path.join(nodesDir, nodeId, `${stepId}.mdx`);
      const step = {
        id: stepId,
        order,
        deps,
        title: stepId,
        learningGoal: "",
        lessonMd: "",
        sources: [],
        coursePage: null, // "<subject>/<file>.html" under public/lessons/
        hasContent: false,
      };

      if (fs.existsSync(stepFile)) {
        const sf = readMdx(stepFile);
        const sb = stripJsxComments(sf.body);
        const ss = splitSections(sb);

        step.title =
          sf.frontmatter.title ||
          sb.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
          stepId;

        step.learningGoal =
          extractLearningGoalComponent(sb) ||
          cleanWikilinks(ss["Learning goal"] || "");

        step.lessonMd = cleanWikilinks(ss["Lesson"] || "");

        const courseLink = (ss["Course"] || "").match(
          /\(([^)]*lessons\/[^)]+\.html)\)/
        );
        if (courseLink) {
          step.coursePage = `${subject}/${path.basename(courseLink[1])}`;
        }

        step.sources = (sf.frontmatter.sources || []).map(parseSource);
        step.hasContent = step.lessonMd.length > 0;
      }
      steps.push(step);
    }
    steps.sort((a, b) => a.order - b.order);

    nodesById.set(nodeId, {
      id: nodeId,
      title: fm.title || roadmapNodes[nodeId]?.title || nodeId,
      tier: fm.tier,
      order: fm.order,
      status: fm.status || "draft",
      goal: fm.goal || "",
      sources: (fm.sources || []).map(parseSource),
      prerequisites: fm.prerequisites || [],
      lessonIntro: lessonIntroRaw,
      steps,
    });
  }

  const orderedNodes = [];
  for (const tier of tiers) {
    for (const id of tier.nodeIds) {
      const node = nodesById.get(id);
      if (node) orderedNodes.push(node);
    }
  }
  for (const [, node] of nodesById) {
    if (!orderedNodes.includes(node)) orderedNodes.push(node);
  }

  // ---------- Copy rendered lessons into public/ ----------
  const lessonsSrc = path.join(LEARN_DIR, "lessons");
  const lessonsDst = path.join(APP_ROOT, "public", "lessons", subject);
  if (fs.existsSync(lessonsSrc)) {
    fs.rmSync(lessonsDst, { recursive: true, force: true });
    fs.cpSync(lessonsSrc, lessonsDst, { recursive: true });
  }

  return {
    subject,
    title: SUBJECT_TITLES[subject] || subject.replace(/-/g, " "),
    language: "zh-Hant",
    goal: subjectGoal,
    tiers: tiers.map(({ tier, name }) => ({ tier, name })),
    nodes: orderedNodes.map((n) => ({
      ...n,
      globalOrder: orderedNodes.indexOf(n) + 1,
      totalNodes: orderedNodes.length,
    })),
  };
}

// ---------- Discover subjects ----------
const allSubjects = fs
  .readdirSync(LEARN_ROOT, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      fs.existsSync(path.join(LEARN_ROOT, d.name, "ROADMAP.md"))
  )
  .map((d) => d.name)
  .sort();

// system-design first (most complete), rest alphabetical
allSubjects.sort((a, b) => {
  if (a === "system-design") return -1;
  if (b === "system-design") return 1;
  return a.localeCompare(b);
});

const targets = ONLY ? allSubjects.filter((s) => s === ONLY) : allSubjects;
if (targets.length === 0) {
  console.error(`No subjects found in ${LEARN_ROOT}${ONLY ? ` matching ${ONLY}` : ""}`);
  process.exit(1);
}

// ---------- Build all ----------
const outDir = path.join(APP_ROOT, "src", "data", "subjects");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const index = [];
let writtenStepsTotal = 0;

for (const subject of targets) {
  const course = buildSubject(subject);
  if (!course) {
    console.warn(`⚠ Skipped ${subject} (no ROADMAP.md)`);
    continue;
  }
  const writtenSteps = course.nodes.reduce(
    (acc, n) => acc + n.steps.filter((s) => s.hasContent).length,
    0
  );
  writtenStepsTotal += writtenSteps;

  const file = path.join(outDir, `${subject}.json`);
  fs.writeFileSync(file, JSON.stringify(course)); // compact — smaller bundle

  index.push({
    id: subject,
    title: course.title,
    nodes: course.nodes.length,
    writtenSteps,
    totalSteps: course.nodes.reduce((acc, n) => acc + n.steps.length, 0),
    goal: course.goal,
  });

  console.log(
    `✔ ${subject.padEnd(36)} ${String(course.nodes.length).padStart(3)} nodes, ${String(writtenSteps).padStart(3)} written steps`
  );
}

fs.writeFileSync(
  path.join(APP_ROOT, "src", "data", "subjects.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), subjects: index })
);

console.log(
  `✔ ${index.length} subjects → src/data/ (${writtenStepsTotal} written steps total)`
);

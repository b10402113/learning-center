import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { inferSourceLanguage, inferSourceType } from "./source-material.mjs";

export const ARTICLE_AGENT_DIR = "article-agent";
export const MAX_STEP_IMAGES = 5;
export const REPO_IMAGE_STYLE =
  "暖白色背景（#FAF8F5）、炭灰色線條圖示（#34383F）、亮橘色重點（#FF7A1A）、淡橘色標籤框（#FFF0DE）、深灰色文字（#333333）；平面向量、乾淨留白，不使用漸層或照片。";

const PROVENANCE = /^<!--\s*(?:source:\s*sources\/\S+\s*|derived\s*)-->$/;
const PLACEHOLDER = /<!--code:(\d+)-->/g;

export function articleAgentRoot(root) {
  return join(root, ARTICLE_AGENT_DIR);
}

export function outputDir(root, subject) {
  return join(root, "learn", subject, "output");
}

export function nodeOutputDir(root, subject, node) {
  return join(outputDir(root, subject), node);
}

export function stepDir(root, { subject, node, step }) {
  return join(nodeOutputDir(root, subject, node), step);
}

export function stepPlanPath(root, { subject, node, step }) {
  return join(root, "learn", subject, "nodes", node, `${step}.plan.json`);
}

export function teachingPlanPath(root, subject, node) {
  return join(nodeOutputDir(root, subject, node), "teaching-plan.md");
}

export function stepSlug(subject, node, step) {
  return `${subject}-${node}-${step}`;
}

export function jobFiles(root, { subject, node, step }) {
  const dir = stepDir(root, { subject, node, step });
  return {
    slug: stepSlug(subject, node, step),
    dir,
    material: join(dir, "material.json"),
    original: join(dir, "original.md"),
    polish: join(dir, "polish.md"),
    humanized: join(dir, "humanized.md"),
    humanizedPlan: join(dir, "humanized.plan.json"),
    plan: stepPlanPath(root, { subject, node, step }),
    protected: join(dir, "protected.md"),
    blocks: join(dir, "blocks.json"),
    request: join(dir, "request.json"),
    result: join(dir, "result.json"),
    compose: join(dir, "compose.json"),
    translated: join(dir, "translated.md"),
  };
}

export function prepareFile(root, subject, node) {
  return join(nodeOutputDir(root, subject, node), "prepare.json");
}

export function polishedRecordPath(root, { subject, node, step }) {
  return join(outputDir(root, subject), "polished", node, `${step}.json`);
}

export function buildBrief(entry, context = {}) {
  const { hasCode = false, mode = "rewrite" } = context;
  const lines =
    mode === "translate"
      ? [
          "把原稿忠實翻成台灣繁體中文；保留事實、數字、引述、段落順序與結構，不要新增或刪除內容。",
          `這一課要讓讀者：${entry.purpose}`,
        ]
      : [
          `改寫成清楚、自然、好讀的繁體中文文章；保留原稿的事實、觀點與段落順序，不要新增事實或引述。`,
          `這一課要讓讀者：${entry.purpose}`,
        ];
  if (hasCode) {
    lines.push(
      "文中若出現 <!--code:N--> 這種標記，原樣保留在原本位置，不要改寫、刪除或移動。",
    );
  }
  return lines.join("\n");
}

const normalizeSpace = (text) => String(text ?? "").replace(/\s+/g, " ").trim();

export function normalizeStepPlan(raw) {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!Array.isArray(parsed)) throw new Error("image plan must be a JSON array");
  if (parsed.length < 1 || parsed.length > MAX_STEP_IMAGES) {
    throw new Error(`image plan must have 1-${MAX_STEP_IMAGES} items, got ${parsed.length}`);
  }
  return parsed.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`image plan item ${index + 1} must be an object`);
    }
    const anchor = String(item.anchor ?? "").trim();
    const prompt = String(item.prompt ?? "").trim();
    if (!prompt) throw new Error(`image plan item ${index + 1} needs a non-empty prompt`);
    return {
      index: index + 1,
      heading: String(item.heading ?? "").trim(),
      anchor: anchor || undefined,
      prompt,
    };
  });
}

export function assertPlanAnchors(plan, original) {
  const text = normalizeSpace(original);
  for (const item of plan) {
    if (!item.anchor) continue;
    if (!text.includes(normalizeSpace(item.anchor))) {
      throw new Error(`image plan item ${item.index} anchor is not verbatim in the original: ${item.anchor}`);
    }
  }
  return plan;
}

export function readStepPlan(root, { subject, node, step }, original) {
  const files = jobFiles(root, { subject, node, step });
  const raw = readJson(files.plan);
  if (raw == null) {
    throw new Error(`image plan not found: ${relative(root, files.plan)}`);
  }
  const plan = normalizeStepPlan(raw);
  return original ? assertPlanAnchors(plan, original) : plan;
}

export function buildRequest(root, { subject, files, entry, plan = null, hasCode, markersOnly = false, mode = "rewrite" }) {
  const request = {
    mode,
    articleFile: files.protected,
    brief: buildBrief(entry, { hasCode, mode }),
    outputRoot: outputDir(root, subject),
  };
  if (plan) {
    request.imagePlan = plan.map(({ heading, anchor, prompt }) => ({ heading, anchor, prompt }));
    request.imageStyle = REPO_IMAGE_STYLE;
    request.imageTemplate = readFileSync(join(root, "prompts", "image.txt"), "utf8");
  }
  if (markersOnly) request.markersOnly = true;
  return request;
}

export function writeMaterial(root, { subject, node, entry, slices }) {
  const files = jobFiles(root, { subject, node, step: entry.id });
  mkdirSync(files.dir, { recursive: true });
  const items = slices.map(({ path, locator, role }) => {
    const type = inferSourceType(path);
    const source = { path, locator, type };
    if (role) source.role = role;
    if (type === "code") {
      const language = inferSourceLanguage(path);
      if (language) source.language = language;
    }
    return source;
  });
  const material = {
    subject,
    node,
    step: entry.id,
    title: entry.title ?? null,
    purpose: entry.purpose,
  };
  if (items.some((item) => item.role)) {
    const raw = items.filter((item) => item.role === "raw");
    if (raw.length > 0) {
      throw new Error(`step ${entry.id} cites raw sources: ${raw.map((item) => item.path).join(", ")}`);
    }
    material.course = items.filter((item) => item.role === "course").map(({ role, ...item }) => item);
    material.supplement = items
      .filter((item) => item.role === "supplement" || !item.role)
      .map(({ role, ...item }) => item);
  } else {
    material.sources = items.map(({ role, ...item }) => item);
  }
  writeFileSync(files.material, JSON.stringify(material, null, 2) + "\n");
  return { files, material };
}

export function protectCode(markdown) {
  const lines = String(markdown ?? "").split("\n");
  const blocks = [];
  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!PROVENANCE.test(lines[index].trim())) {
      out.push(lines[index]);
      continue;
    }
    let cursor = index;
    while (cursor + 1 < lines.length && lines[cursor + 1].trim() === "") cursor += 1;
    const fence = (lines[cursor + 1] ?? "").match(/^\s*(`{3,}|~{3,})/);
    if (!fence) {
      out.push(lines[index]);
      continue;
    }
    const marker = fence[1][0];
    const width = fence[1].length;
    const closing = new RegExp(`^\\s*\\${marker}{${width},}\\s*$`);
    let end = cursor + 2;
    while (end < lines.length && !closing.test(lines[end])) end += 1;
    if (end >= lines.length) {
      out.push(lines[index]);
      continue;
    }
    blocks.push(lines.slice(index, end + 1).join("\n"));
    out.push(`<!--code:${blocks.length}-->`);
    index = end;
  }
  return { text: out.join("\n"), blocks };
}

export function restoreCode(markdown, blocks) {
  const list = Array.isArray(blocks) ? blocks : [];
  const missing = [];
  const text = String(markdown ?? "").replace(PLACEHOLDER, (match, raw) => {
    const block = list[Number(raw) - 1];
    if (block === undefined) {
      missing.push(raw);
      return match;
    }
    return block;
  });
  if (missing.length) {
    throw new Error(`rewrite dropped code placeholders: ${[...new Set(missing)].join(", ")}`);
  }
  return text;
}

export function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function writeJson(file, data) {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

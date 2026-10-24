import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const ARTICLE_AGENT_DIR = "article-agent";

const PROVENANCE = /^<!--\s*(?:source:\s*sources\/\S+\s*|derived\s*)-->$/;
const PLACEHOLDER = /<!--code:(\d+)-->/g;

export function articleAgentRoot(root) {
  return join(root, ARTICLE_AGENT_DIR);
}

export function outputDir(root, subject) {
  return join(root, "learn", subject, "output");
}

export function jobsDir(root, subject) {
  return join(outputDir(root, subject), "jobs");
}

export function materialsDir(root, subject) {
  return join(outputDir(root, subject), "materials");
}

export function stepSlug(subject, node, step) {
  return `${subject}-${node}-${step}`;
}

export function jobFiles(root, { subject, node, step }) {
  const slug = stepSlug(subject, node, step);
  const dir = jobsDir(root, subject);
  return {
    slug,
    dir,
    material: join(materialsDir(root, subject), `${slug}.json`),
    original: join(dir, `${slug}.original.md`),
    protected: join(dir, `${slug}.protected.md`),
    blocks: join(dir, `${slug}.blocks.json`),
    request: join(dir, `${slug}.request.json`),
    result: join(dir, `${slug}.result.json`),
  };
}

export function prepareFile(root, subject, node) {
  return join(jobsDir(root, subject), `${subject}-${node}.prepare.json`);
}

export function buildBrief(entry, context = {}) {
  const { hasCode = false, nodeTitle = null, index = null, total = null, previous = null, next = null } = context;
  const lines = [
    `改寫成清楚、自然、好讀的繁體中文文章；保留原稿的事實、觀點與段落順序，不要新增事實或引述。`,
    `這一課要讓讀者：${entry.purpose}`,
  ];
  if (nodeTitle && index && total) {
    const neighbours = [previous ? `上一課是「${previous}」` : "這是第一課", next ? `下一課是「${next}」` : "這是最後一課"];
    lines.push(
      `這一課是《${nodeTitle}》的第 ${index}/${total} 課，${neighbours.join("，")}。原稿承接前後課的句子，照原樣保留。`,
    );
  }
  if (hasCode) {
    lines.push(
      "文中若出現 <!--code:N--> 這種標記，原樣保留在原本位置，不要改寫、刪除或移動。",
    );
  }
  return lines.join("\n");
}

export function writeMaterial(root, { subject, node, entry, slices }) {
  const files = jobFiles(root, { subject, node, step: entry.id });
  mkdirSync(files.dir, { recursive: true });
  mkdirSync(materialsDir(root, subject), { recursive: true });
  const material = {
    subject,
    node,
    step: entry.id,
    title: entry.title,
    purpose: entry.purpose,
    sources: slices,
  };
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

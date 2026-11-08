#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { parseArgs } from "node:util";
import matter from "gray-matter";
import { hasArticleBody, readStepSlices } from "./article.mjs";
import {
  blockAssetsDir,
  blockImageLink,
  blockPlanPath,
  blocksDir,
  insertBlockImageMarker,
  normalizeBlockPlan,
  replaceBlockImageMarker,
  validateBlockSections,
} from "./blocks.mjs";
import { protectArticle, validatePolishedArticle } from "./polish-article.mjs";
import {
  buildComposeSources,
  composeSourcePayload,
  inferSourceLanguage,
  inferSourceType,
  materialSources,
  missingPlaceholders,
  restoreComposeSources,
  salvageComposeSources,
} from "./source-material.mjs";
import { REPO_IMAGE_STYLE, readJson, writeJson } from "./article-agent-bridge.mjs";
import { buildRenderPrompt, parseMarkers } from "./render-images.mjs";
import {
  createTextClient,
  httpStatus,
  isRetryable,
  loadEnv,
  resolveTextModel,
  responseError,
  textContent,
  withRetry,
} from "./llm.mjs";
import {
  imageGenerator,
  resolveImageModel,
  resolveImageProvider,
  writeWebp,
} from "./image-provider.mjs";

const usage = `Usage:
  node src/blocks-cli.mjs prepare --subject <s> --block <id> [--force]
  node src/blocks-cli.mjs compose --subject <s> --block <id> [--force]
  node src/blocks-cli.mjs mark    --subject <s> --block <id>
  node src/blocks-cli.mjs polish  --subject <s> --block <id> [--copy]
  node src/blocks-cli.mjs render  --subject <s> --block <id> [--force]
  node src/blocks-cli.mjs publish --subject <s> --block <id>
  node src/blocks-cli.mjs article --subject <s> (--block <id> | --all-drafts) [--images] [--force]

A block is one standalone knowledge point. This CLI writes its six-section
body with the text model, places one hero figure after the H1, and publishes
the body back to learn/<subject>/blocks/<id>.md. It never touches a reviewed
block's prose.`;

export function blockFiles(root, subject, id) {
  const dir = join(root, "learn", subject, "output", "blocks", id);
  return {
    dir,
    material: join(dir, "material.json"),
    original: join(dir, "original.md"),
    polish: join(dir, "polish.md"),
    compose: join(dir, "compose.json"),
    plan: blockPlanPath(root, subject, id),
    block: join(blocksDir(root, subject), `${id}.md`),
    assets: blockAssetsDir(root, subject, id),
    image: join(blockAssetsDir(root, subject, id), "image-1.webp"),
  };
}

export function readBlock(root, subject, id) {
  const path = join(blocksDir(root, subject), `${id}.md`);
  if (!existsSync(path)) throw new Error(`block not found: learn/${subject}/blocks/${id}.md`);
  const parsed = matter(readFileSync(path, "utf8"));
  return {
    id,
    path,
    file: `learn/${subject}/blocks/${id}.md`,
    data: parsed.data ?? {},
    body: parsed.content ?? "",
  };
}

function blockIdsOnDisk(root, subject) {
  const dir = blocksDir(root, subject);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.slice(0, -".md".length))
    .sort();
}

export function selectBlockIds(root, subject, { block = null, allDrafts = false } = {}) {
  if (block) {
    return [readBlock(root, subject, block).id];
  }
  if (!allDrafts) throw new Error(`--block or --all-drafts is required\n\n${usage}`);
  return blockIdsOnDisk(root, subject).filter((id) => {
    const entry = readBlock(root, subject, id);
    return String(entry.data?.status) === "draft";
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isReviewed(entry) {
  return String(entry.data?.status) === "reviewed";
}

function sectionHeading(body) {
  const match = String(body).match(/^##\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function paragraphUnderH1(body) {
  const lines = String(body).replace(/\r\n/g, "\n").split("\n");
  const h1 = lines.findIndex((line) => /^#\s+\S/.test(line));
  if (h1 === -1) return "";
  const rest = lines.slice(h1 + 1).join("\n").split(/^##\s+/m)[0];
  return rest.trim();
}

function normalizeBlockBody(text, title) {
  let body = String(text ?? "").replace(/\r\n/g, "\n").trim();
  const firstLine = body.split("\n")[0] ?? "";
  if (/^#\s+/.test(firstLine)) {
    body = [ `# ${title}`, ...body.split("\n").slice(1) ].join("\n");
  } else {
    body = `# ${title}\n\n${body}`;
  }
  return `${body.replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

export function buildBlockMaterial(root, subject, entry) {
  const sources = Array.isArray(entry.data?.sources) ? entry.data.sources : [];
  const slices = readStepSlices(root, { id: entry.id, sources }).map((slice) => {
    const type = inferSourceType(slice.path);
    const item = { path: slice.path, locator: slice.locator, type, text: slice.text };
    if (slice.role) item.role = slice.role;
    if (type === "code") {
      const language = inferSourceLanguage(slice.path);
      if (language) item.language = language;
    }
    return item;
  });
  return {
    subject,
    block: entry.id,
    title: entry.data?.title ?? entry.id,
    label: entry.data?.label ?? entry.data?.title ?? entry.id,
    type: entry.data?.type ?? "concept",
    summary: entry.data?.summary ?? "",
    sources: slices,
  };
}

export function prepareBlocks({ root, subject, ids, force = false }) {
  return ids.map((id) => {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    try {
      const material = buildBlockMaterial(root, subject, entry);
      mkdirSync(files.dir, { recursive: true });
      if (force) {
        for (const key of ["original", "polish", "compose"]) rmSync(files[key], { force: true });
      }
      writeJson(files.material, material);
      return { id, status: "ready", material: relative(root, files.material) };
    } catch (error) {
      return { id, status: "failed", error: error?.message ?? String(error) };
    }
  });
}

export async function composeBlocks({ root, subject, ids, force = false, deps = {} }) {
  const prompt = deps.prompt ?? readFileSync(join(root, "prompts", "block-article.txt"), "utf8");
  const cap = deps.maxChars ?? Number(process.env.ARTICLE_MAX_MATERIAL_CHARS ?? 120000);
  const model = deps.model ?? "block-model";
  const results = [];

  for (const id of ids) {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    if (isReviewed(entry)) {
      results.push({ id, status: "failed", error: "block is reviewed; only render --force may change a reviewed block" });
      continue;
    }
    if (!force && hasArticleBody(entry.body)) {
      results.push({ id, status: "skipped", reason: "block already has a body; pass --force to rewrite it" });
      continue;
    }
    const material = readJson(files.material);
    if (!material) {
      results.push({ id, status: "failed", error: "material.json not found; run prepare first" });
      continue;
    }
    const curated = materialSources(material).filter(
      (source) => source && typeof source.text === "string" && source.text.trim(),
    );
    if (curated.length === 0) {
      results.push({ id, status: "failed", error: "material.json has no curated text" });
      continue;
    }
    const materialChars = curated.reduce((sum, source) => sum + source.text.length, 0);
    if (materialChars > cap) {
      results.push({
        id,
        status: "failed",
        error: `material is ${materialChars} chars, over the ${cap} limit`,
      });
      continue;
    }
    let sources;
    try {
      sources = buildComposeSources(curated);
    } catch (error) {
      results.push({ id, status: "failed", error: error?.message ?? String(error) });
      continue;
    }

    const payload = {
      title: material.title ?? entry.data?.title ?? id,
      label: material.label ?? entry.data?.label ?? id,
      type: material.type ?? entry.data?.type ?? "concept",
      summary: material.summary ?? entry.data?.summary ?? "",
      sources: composeSourcePayload(sources),
    };

    let body = null;
    let draft = null;
    let lastError = null;
    let missing = [];
    for (let attempt = 0; attempt < 3 && !body; attempt += 1) {
      let text;
      try {
        text = await deps.generateText({
          system: prompt,
          user: JSON.stringify(
            attempt > 0 && draft
              ? {
                  ...payload,
                  retry: {
                    draft,
                    previous_error: lastError?.message ?? null,
                    missing_placeholders: missing.map((source) => source.placeholder),
                    instruction: missing.length
                      ? "保留 draft 的內容，只在適合的位置各用單獨一行輸出 missing_placeholders 列出的 placeholder。"
                      : "保留 draft 的內容，只修正格式問題。",
                  },
                }
              : payload,
            null,
            2,
          ),
        });
      } catch (error) {
        lastError = error;
        break;
      }
      const normalized = normalizeBlockBody(text, payload.title);
      draft = normalized;
      if (!hasArticleBody(normalized)) {
        lastError = new Error("model returned no block body");
        continue;
      }
      try {
        body = restoreComposeSources(normalized, sources);
      } catch (error) {
        lastError = error;
        missing = missingPlaceholders(normalized, sources);
      }
    }

    if (!body) {
      const salvaged = salvageComposeSources(draft ?? "", sources);
      if (!draft || !hasArticleBody(salvaged.text)) {
        results.push({ id, status: "failed", error: lastError?.message ?? "model returned no body" });
        continue;
      }
      mkdirSync(files.dir, { recursive: true });
      writeFileSync(files.original, salvaged.text);
      writeJson(files.compose, {
        model,
        composed_at: new Date().toISOString(),
        status: "draft",
        missing: salvaged.missing,
        error: lastError?.message ?? null,
      });
      results.push({
        id,
        status: "draft",
        article: relative(root, files.original),
        model,
        missing: salvaged.missing,
      });
      continue;
    }

    mkdirSync(files.dir, { recursive: true });
    writeFileSync(files.original, body);
    writeJson(files.compose, { model, composed_at: new Date().toISOString(), status: "composed" });
    results.push({ id, status: "composed", article: relative(root, files.original), model });
  }

  return results;
}

export function markBlocks({ root, subject, ids }) {
  return ids.map((id) => {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    let body;
    if (existsSync(files.original) && hasArticleBody(readFileSync(files.original, "utf8"))) {
      body = readFileSync(files.original, "utf8");
    } else {
      body = entry.body;
      mkdirSync(files.dir, { recursive: true });
      writeFileSync(files.original, body);
    }
    try {
      normalizeBlockPlan(readJson(files.plan));
    } catch (error) {
      return { id, status: "failed", error: `image plan not ready: ${error?.message ?? error}` };
    }
    try {
      const marked = insertBlockImageMarker(body);
      writeFileSync(files.original, marked);
      return { id, status: "marked", markers: 1 };
    } catch (error) {
      return { id, status: "failed", error: error?.message ?? String(error) };
    }
  });
}

function writeFrontmatterBody(entry, body, data) {
  const source = readFileSync(entry.path, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`${entry.file} has no frontmatter`);
  let front = match[1];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    const line = `${key}: ${value}`;
    const pattern = new RegExp(`^${key}:.*$`, "m");
    if (pattern.test(front)) front = front.replace(pattern, line);
    else front = `${front.replace(/\s+$/, "")}\n${line}`;
  }
  const normalized = String(body).replace(/\r\n/g, "\n").trimEnd();
  writeFileSync(entry.path, `---\n${front}\n---\n\n${normalized}\n`);
}

const BLOCK_POLISH_NOTE =
  "只潤飾散文：不得新增、刪除、改名或重排任何 ## 章節，不得改動 H1、圖片行、marker 或程式碼。";

export async function polishBlocks({ root, subject, ids, instruction = null, copy = false, deps = {} }) {
  const polishText =
    deps.polishText ??
    (async (text) => {
      const { polishArticle } = await import("./polish.mjs");
      const result = await polishArticle(
        {
          articleText: text,
          promptFile: "prompts/polish.txt",
          instruction: [BLOCK_POLISH_NOTE, instruction].filter(Boolean).join("\n\n"),
          save: false,
        },
        root,
      );
      return result.text;
    });

  const results = [];
  for (const id of ids) {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    if (isReviewed(entry)) {
      results.push({ id, status: "failed", error: "block is reviewed; its prose is never rewritten" });
      continue;
    }
    if (!existsSync(files.original) || !hasArticleBody(readFileSync(files.original, "utf8"))) {
      results.push({ id, status: "failed", error: "original.md missing or empty; run compose first" });
      continue;
    }
    const original = readFileSync(files.original, "utf8");
    if (copy) {
      writeFileSync(files.polish, original);
      results.push({ id, status: "copied", article: relative(root, files.polish) });
      continue;
    }

    let next = null;
    let error = null;
    try {
      const protectedText = protectArticle(original);
      const text = await polishText(protectedText.text);
      next = protectedText.restore(text);
      validatePolishedArticle({ original, next });
      const failures = validateBlockSections({
        data: { type: entry.data?.type, status: entry.data?.status },
        body: next,
      });
      if (failures.length > 0) throw new Error(failures[0].message);
      if (!next.endsWith("\n")) next = `${next}\n`;
    } catch (caught) {
      error = caught?.message ?? String(caught);
      next = null;
    }

    if (next) {
      writeFileSync(files.polish, next);
      results.push({ id, status: "polished", changed: next !== original, article: relative(root, files.polish) });
      continue;
    }
    writeFileSync(files.polish, original);
    results.push({ id, status: "copied", fallback: true, error, article: relative(root, files.polish) });
  }
  return results;
}

export function publishBlocks({ root, subject, ids, deps = {} }) {
  return ids.map((id) => {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    if (isReviewed(entry)) {
      return { id, status: "failed", error: "block is reviewed; only render --force may change a reviewed block" };
    }
    const source = existsSync(files.polish)
      ? files.polish
      : existsSync(files.original)
        ? files.original
        : null;
    if (!source) {
      return { id, status: "failed", error: "no original.md or polish.md; run compose first" };
    }
    const body = readFileSync(source, "utf8");
    if (!hasArticleBody(body)) {
      return { id, status: "failed", error: `${relative(root, source)} has no body` };
    }
    const record = readJson(files.compose);
    const author = record?.model ?? entry.data?.author ?? null;
    const data = { updated: today() };
    if (author) data.author = author;
    try {
      writeFrontmatterBody(entry, body, data);
      return { id, status: "published", path: entry.file, author };
    } catch (error) {
      return { id, status: "failed", error: error?.message ?? String(error) };
    }
  });
}

export async function renderBlocks({ root, subject, ids, force = false, deps = {} }) {
  if (typeof deps.generateImage !== "function") throw new Error("generateImage dependency is required");
  const writeImage =
    deps.writeImage ??
    (async (target, bytes) => {
      await writeWebp(target, bytes);
    });
  const template = deps.imageTemplate ?? readFileSync(join(root, "prompts", "block-image.txt"), "utf8");
  const style = deps.imageStyle ?? REPO_IMAGE_STYLE;
  const results = [];

  for (const id of ids) {
    const entry = readBlock(root, subject, id);
    const files = blockFiles(root, subject, id);
    if (!existsSync(files.plan)) {
      results.push({ id, status: "failed", error: "image plan not found; write blocks/<id>.plan.json first" });
      continue;
    }
    let plan;
    try {
      plan = normalizeBlockPlan(readJson(files.plan));
    } catch (error) {
      results.push({ id, status: "failed", error: error?.message ?? String(error) });
      continue;
    }

    const markers = parseMarkers(entry.body);
    const hasImage = entry.body.includes(blockImageLink(id, 1));
    if (isReviewed(entry) && !force) {
      results.push({ id, status: "failed", error: "block is reviewed; pass --force to rerender its figure" });
      continue;
    }
    if (isReviewed(entry) && !hasImage) {
      results.push({ id, status: "failed", error: "a reviewed block has no rendered figure; fix its body by hand" });
      continue;
    }
    if (!force && hasImage && markers.length === 0 && existsSync(files.image)) {
      results.push({ id, status: "already-rendered", image: blockImageLink(id, 1), reused: true });
      continue;
    }

    const item = plan[0];
    try {
      const bytes = await deps.generateImage({
        prompt: buildRenderPrompt({
          template,
          style,
          heading: item.heading || sectionHeading(entry.body),
          focus: item.prompt,
          paragraph: paragraphUnderH1(entry.body),
        }),
        block: { id, title: entry.data?.title ?? id },
        index: 1,
      });
      if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
        throw new Error(`no image returned for block ${id}`);
      }
      await writeImage(files.image, bytes);
    } catch (error) {
      results.push({ id, status: "failed", error: error?.message ?? String(error) });
      continue;
    }

    if (!isReviewed(entry) && markers.length > 0) {
      writeFrontmatterBody(entry, replaceBlockImageMarker(entry.body, id), {});
    } else if (!isReviewed(entry) && !hasImage) {
      writeFrontmatterBody(entry, replaceBlockImageMarker(insertBlockImageMarker(entry.body), id), {});
    }
    results.push({
      id,
      status: "rendered",
      image: blockImageLink(id, 1),
      file: relative(root, files.image),
      reused: false,
    });
  }

  return results;
}

export function createDeps(root) {
  let clientPromise = null;
  const client = () => {
    clientPromise ??= createTextClient();
    return clientPromise;
  };
  const model = resolveTextModel();
  const imageModel = resolveImageModel();
  const provider = resolveImageProvider();
  const generateImageBytes = imageGenerator();
  return {
    root,
    model,
    imageModel,
    provider,
    generateText: async ({ system, user }) => {
      const response = await (await client()).chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });
      const error = responseError(response);
      if (error) throw error;
      return textContent(response).replace(/\r\n/g, "\n");
    },
    generateImage: ({ prompt }) =>
      withRetry(
        async () => {
          const bytes = await generateImageBytes({
            prompt,
            model: imageModel,
            size: process.env.IMAGE_SIZE || "4:3",
            resolution: process.env.IMAGE_RESOLUTION || "1K",
            quality: process.env.IMAGE_QUALITY || "medium",
          });
          if (!Buffer.isBuffer(bytes) || bytes.length === 0) throw new Error("image provider returned no bytes");
          return bytes;
        },
        { attempts: 3, baseDelayMs: 5000, retryOn: (error) => isRetryable(error) && !httpStatus(error) },
      ),
    writeImage: (target, bytes) => {
      mkdirSync(dirname(target), { recursive: true });
      return writeWebp(target, bytes);
    },
  };
}

function requireSubject(values) {
  if (!values.subject) throw new Error(`--subject is required\n\n${usage}`);
}

export async function main(argv = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      subject: { type: "string" },
      block: { type: "string" },
      "all-drafts": { type: "boolean" },
      copy: { type: "boolean" },
      force: { type: "boolean" },
      images: { type: "boolean" },
      root: { type: "string" },
    },
  });
  const mode = positionals[0] ?? "article";
  if (!["prepare", "compose", "mark", "polish", "render", "publish", "article"].includes(mode)) {
    throw new Error(`unknown command "${mode}"\n\n${usage}`);
  }
  requireSubject(values);
  loadEnv();
  const root = values.root ? join(process.cwd(), values.root) : process.cwd();
  const subject = values.subject;
  const ids = selectBlockIds(root, subject, {
    block: values.block ?? null,
    allDrafts: Boolean(values["all-drafts"]),
  });

  let report;
  switch (mode) {
    case "prepare":
      report = { mode, subject, blocks: prepareBlocks({ root, subject, ids, force: Boolean(values.force) }) };
      break;
    case "compose": {
      const deps = createDeps(root);
      report = {
        mode,
        subject,
        blocks: await composeBlocks({
          root,
          subject,
          ids,
          force: Boolean(values.force),
          deps: { ...deps, prompt: readFileSync(join(root, "prompts", "block-article.txt"), "utf8") },
        }),
      };
      break;
    }
    case "mark":
      report = { mode, subject, blocks: markBlocks({ root, subject, ids }) };
      break;
    case "polish":
      report = {
        mode,
        subject,
        blocks: await polishBlocks({ root, subject, ids, copy: Boolean(values.copy) }),
      };
      break;
    case "render": {
      const deps = createDeps(root);
      report = {
        mode,
        subject,
        blocks: await renderBlocks({ root, subject, ids, force: Boolean(values.force), deps }),
      };
      break;
    }
    case "publish":
      report = { mode, subject, blocks: publishBlocks({ root, subject, ids }) };
      break;
    default: {
      const deps = createDeps(root);
      const prepared = prepareBlocks({ root, subject, ids, force: Boolean(values.force) });
      const composed = await composeBlocks({
        root,
        subject,
        ids,
        force: Boolean(values.force),
        deps: { ...deps, prompt: readFileSync(join(root, "prompts", "block-article.txt"), "utf8") },
      });
      const plannable = ids.filter((id) => existsSync(blockFiles(root, subject, id).plan));
      const marked = markBlocks({ root, subject, ids: plannable });
      const polished = await polishBlocks({ root, subject, ids: plannable });
      const published = publishBlocks({ root, subject, ids });
      const rendered = values.images
        ? await renderBlocks({ root, subject, ids: plannable, force: Boolean(values.force), deps })
        : [];
      report = { mode, subject, prepared, composed, marked, polished, published, rendered };
      break;
    }
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error?.stack ?? error}\n`);
    process.exitCode = 1;
  });
}

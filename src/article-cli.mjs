#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  hasArticleBody,
  insertImageMarkers,
  normalizeArticleText,
  readNode,
  readStepSlices,
  runArticle,
  runImages,
  selectSteps,
} from "./article.mjs";
import {
  jobFiles,
  prepareFile,
  readJson,
  readStepPlan,
  teachingPlanPath,
  writeJson,
  writeMaterial,
} from "./article-agent-bridge.mjs";
import { runChecks } from "../scripts/verify.mjs";
import { publishArticles } from "../scripts/publish-article.mjs";
import { renderImages } from "./render-images.mjs";
import {
  buildComposeSources,
  composeSourcePayload,
  materialSources,
  missingPlaceholders,
  restoreComposeSources,
  salvageComposeSources,
} from "./source-material.mjs";
import {
  createTextClient,
  httpStatus,
  isRetryable,
  loadEnv,
  responseError,
  resolveTextModel,
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
  node src/article-cli.mjs prepare --subject <s> --node <n> [--step <id>] [--force] [--skip-polish] [--root <dir>]
  node src/article-cli.mjs compose --subject <s> --node <n> [--step <id>] [--max-chars <n>] [--root <dir>]
  node src/article-cli.mjs mark    --subject <s> --node <n> [--step <id>] [--root <dir>]
  node src/article-cli.mjs publish --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]
  node src/article-cli.mjs render  --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>] [--root <dir>]
  node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images] [--max-parallel <n>] [--root <dir>]  (deprecated)
  node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--plan-only] [--root <dir>]  (deprecated)

prepare  writes one material bundle per missing step and lists the publisher job
         (material, original, polish, plan, composeCommand, markCommand, polishCommand,
         titleCommand). The publisher curates the material, then compose calls the
         text model once to write original.md, and mark inserts the <!--image:N-->
         markers from the publisher's plan.
         --skip-polish hands over a polishCommand that carries --copy, so the
         publisher's original becomes polish.md unchanged and the plan stays as written.
   compose  reads the publisher's curated material.json (sources with type and text)
         and calls the text model once to write output/<node>/<step>/original.md — no
         image markers. The model chooses the H1 from the step's purpose; no title is
         passed in. Code sources become placeholders that the CLI replaces with a
         fenced excerpt (long blocks keep the head and tail, middle elided as ...)
         and formula sources become display math. It enforces an input size
         cap (ARTICLE_MAX_MATERIAL_CHARS, default 120000) and retries when the model
         returns an empty body, no H1, or drops a placeholder.
mark     reads original.md and the publisher's <step>.plan.json, inserts the
         <!--image:N--> markers, and writes original.md back. It never calls a model.
publish  writes polished steps into learn/ without touching figures,
         marks the node written, and runs verify.
render   turns <!--image:N--> markers into WebP figures and image lines. It only
         reads the publisher's plan; it never plans, rewrites prose, or reads
         anchors. Existing figures are reused unless --force is given.
article  legacy engine (deprecated): writes one article per step with a single
         text request, optionally generating figures.
image    legacy engine (deprecated): plans and generates WebP figures for
         articles that already exist.
         --plan-only writes the plan to learn/<subject>/nodes/<node>/<step>.plan.json
         and generates nothing; the next image run reuses that plan. --force with
         --plan-only rebuilds the plan; without it, --force regenerates images.
Default behaviour skips existing articles and reuses existing images.`;

function prepareArticles({ root, subject, node: nodeId, step = null, force = false, skipPolish = false }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const order = node.steps.map((entry) => entry.id);
  const steps = [];
  const skipped = [];
  for (const entry of entries) {
    const target = join(root, "learn", subject, "nodes", nodeId, `${entry.id}.md`);
    const shown = relative(root, target);
    const existing = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (!force && hasArticleBody(existing)) {
      skipped.push({
        id: entry.id,
        title: entry.title,
        purpose: entry.purpose,
        status: "skipped",
        path: shown,
        article: target,
      });
      continue;
    }
    const slices = readStepSlices(root, entry);
    if (force) {
      const existingFiles = jobFiles(root, { subject, node: nodeId, step: entry.id });
      for (const key of ["original", "polish", "result", "compose", "blocks", "request", "protected", "translated"]) {
        rmSync(existingFiles[key], { force: true });
      }
    }
    const { files } = writeMaterial(root, { subject, node: nodeId, entry, slices });
    const index = order.indexOf(entry.id);
    steps.push({
      id: entry.id,
      purpose: entry.purpose,
      status: "ready",
      index: index + 1,
      total: order.length,
      material: relative(root, files.material),
      original: relative(root, files.original),
      polish: relative(root, files.polish),
      plan: relative(root, files.plan),
      composeCommand:
        `node src/article-cli.mjs compose --subject ${subject} --node ${nodeId} --step ${entry.id}`,
      markCommand:
        `node src/article-cli.mjs mark --subject ${subject} --node ${nodeId} --step ${entry.id}`,
      polishCommand:
        `node scripts/polish-article.mjs draft --subject ${subject} --node ${nodeId} --step ${entry.id}` +
        (skipPolish ? " --copy" : ""),
      titleCommand: `node "${resolve(root, "scripts/set-step-title.mjs")}" --root "${resolve(root)}" --subject ${subject} --node ${nodeId} --step ${entry.id} --from "${resolve(root, files.polish)}"`,
    });
  }
  const skippedIds = new Set(skipped.map((entry) => entry.id));
  const prepared = [...new Set([...(readJson(prepareFile(root, subject, nodeId))?.steps ?? []), ...steps.map((entry) => entry.id)])]
    .filter((id) => !skippedIds.has(id));
  writeJson(prepareFile(root, subject, nodeId), {
    subject,
    node: nodeId,
    preparedAt: new Date().toISOString(),
    steps: prepared,
  });
  return {
    mode: "prepare",
    subject,
    node: nodeId,
    nodeFile: join(root, "learn", subject, "nodes", `${nodeId}.md`),
    teachingPlan: teachingPlanPath(root, subject, nodeId),
    nodeTitle: node.title,
    nodeGoal: node.goal ?? null,
    steps,
    skipped,
  };
}

async function composeArticles({ root, subject, node: nodeId, step = null, maxChars = null }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const prompt = readFileSync(join(root, "prompts", "article.txt"), "utf8");
  const cap = maxChars ?? Number(process.env.ARTICLE_MAX_MATERIAL_CHARS ?? 120000);
  const model = resolveTextModel();
  const results = [];
  const pending = [];
  for (const entry of entries) {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const material = readJson(files.material);
    if (!material) {
      results.push({
        id: entry.id,
        status: "failed",
        error: "material.json not found; run prepare and the publisher first",
      });
      continue;
    }
    const sources = materialSources(material);
    const curated = sources.filter((source) => source && typeof source.text === "string" && source.text.trim());
    if (curated.length === 0) {
      results.push({
        id: entry.id,
        status: "failed",
        error: "material.json has no curated text; run the publisher curation first",
      });
      continue;
    }
    const materialChars = curated.reduce((sum, source) => sum + source.text.length, 0);
    if (materialChars > cap) {
      results.push({
        id: entry.id,
        status: "failed",
        materialChars,
        limit: cap,
        error: `material is ${materialChars} chars, over the ${cap} limit; curate a smaller selection`,
      });
      continue;
    }
    let preparedSources;
    try {
      preparedSources = buildComposeSources(curated);
    } catch (error) {
      results.push({
        id: entry.id,
        status: "failed",
        error: error?.message ?? error,
      });
      continue;
    }
    pending.push({
      entry,
      files,
      sources: preparedSources,
      materialChars,
      purpose: material.purpose ?? entry.purpose,
    });
  }
  if (pending.length === 0) {
    return { mode: "compose", subject, node: nodeId, steps: results };
  }
  const client = await createTextClient();
  const maxAttempts = 3;
  for (const { entry, files, sources, materialChars, purpose } of pending) {
    let article = null;
    let draft = null;
    let retries = 0;
    let lastError = null;
    let missing = [];
    for (let attempt = 0; attempt < maxAttempts && !article; attempt += 1) {
      retries = attempt;
      const retry =
        attempt > 0 && draft
          ? {
              draft,
              previous_error: lastError?.message ?? null,
              missing_placeholders: missing.map((source) => source.placeholder),
              instruction: missing.length
                ? "保留 draft 的內容，只在適合的位置各用單獨一行輸出 missing_placeholders 列出的 placeholder。"
                : "保留 draft 的內容，依 previous_error 修正格式問題（例如 placeholder 只能在獨立一行出現一次、不能放進 code fence）。",
            }
          : null;
      let response;
      try {
        response = await withRetry(
          async () => {
            const result = await client.chat.completions.create({
              model,
              messages: [
                { role: "system", content: prompt },
                {
                  role: "user",
                  content: JSON.stringify(
                    {
                      purpose,
                      sources: composeSourcePayload(sources),
                      ...(retry ? { retry } : {}),
                    },
                    null,
                    2,
                  ),
                },
              ],
            });
            const error = responseError(result);
            if (error) throw error;
            return textContent(result).replace(/\r\n/g, "\n");
          },
          { attempts: 2, retryOn: (error) => !httpStatus(error) },
        );
      } catch (error) {
        lastError = error;
        break;
      }
      let normalized;
      try {
        normalized = normalizeArticleText(response, null);
      } catch (error) {
        lastError = error;
        continue;
      }
      if (!hasArticleBody(normalized)) {
        lastError = new Error("model returned no article body");
        continue;
      }
      draft = normalized;
      try {
        article = restoreComposeSources(normalized, sources);
      } catch (error) {
        lastError = error;
        missing = missingPlaceholders(normalized, sources);
      }
    }
    if (!article) {
      const salvaged = salvageComposeSources(draft ?? "", sources);
      if (!draft || !hasArticleBody(salvaged.text)) {
        results.push({
          id: entry.id,
          title: entry.title ?? null,
          status: "failed",
          retries,
          error: lastError?.message ?? "model returned no article body after retries",
        });
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
        id: entry.id,
        title: entry.title ?? null,
        status: "draft",
        article: relative(root, files.original),
        model,
        materialChars,
        retries,
        missing: salvaged.missing,
        error: lastError?.message ?? null,
      });
      continue;
    }
    mkdirSync(files.dir, { recursive: true });
    writeFileSync(files.original, article);
    writeJson(files.compose, { model, composed_at: new Date().toISOString(), status: "composed" });
    results.push({
      id: entry.id,
      title: entry.title ?? null,
      status: "composed",
      article: relative(root, files.original),
      model,
      materialChars,
      retries,
    });
  }
  return { mode: "compose", subject, node: nodeId, steps: results };
}

function markArticles({ root, subject, node: nodeId, step = null }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const results = [];
  for (const entry of entries) {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    if (!existsSync(files.original) || !hasArticleBody(readFileSync(files.original, "utf8"))) {
      results.push({
        id: entry.id,
        status: "failed",
        error: "original.md missing or empty; run compose first",
      });
      continue;
    }
    const original = readFileSync(files.original, "utf8");
    let plan;
    try {
      plan = readStepPlan(root, { subject, node: nodeId, step: entry.id }, original);
    } catch (error) {
      results.push({ id: entry.id, status: "failed", error: error?.message ?? error });
      continue;
    }
    writeFileSync(files.original, insertImageMarkers(original, plan));
    results.push({ id: entry.id, status: "marked", markers: plan.length, planLength: plan.length });
  }
  return { mode: "mark", subject, node: nodeId, steps: results };
}

function requireSubjectNode(values) {
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
}

function createDeps(root) {
  const textModel = resolveTextModel();
  const imageModel = resolveImageModel();
  const provider = resolveImageProvider();
  const generateImageBytes = imageGenerator();
  let clientPromise = null;
  const client = () => {
    clientPromise ??= createTextClient();
    return clientPromise;
  };
  const chat = async (system, user) =>
    withRetry(
      async () => {
        const response = await (await client()).chat.completions.create({
          model: textModel,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        });
        const error = responseError(response);
        if (error) throw error;
        return textContent(response).replace(/\r\n/g, "\n");
      },
      { attempts: 2, retryOn: (error) => !httpStatus(error) },
    );

  return {
    root,
    generateText: ({ system, user }) => chat(system, user),
    planImages: async ({ step, article, count }) => {
      const system = readFileSync(join(root, "prompts", "image-plan.txt"), "utf8");
      return chat(
        system,
        JSON.stringify({ title: step.title ?? step.id, count, article }, null, 2),
      );
    },
    generateImage: ({ prompt }) =>
      withRetry(
        () =>
          generateImageBytes({
            prompt,
            model: imageModel,
            size: process.env.IMAGE_SIZE || "4:3",
            resolution: process.env.IMAGE_RESOLUTION || "1K",
            quality: process.env.IMAGE_QUALITY || "medium",
          }),
        {
          attempts: 3,
          baseDelayMs: 5000,
          retryOn: (error) => isRetryable(error) && !httpStatus(error),
        },
      ),
    writeImage: (target, bytes) => writeWebp(target, bytes),
    imageProvider: provider,
    textModel,
    imageModel,
  };
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      force: { type: "boolean", default: false },
      "skip-polish": { type: "boolean", default: false },
      images: { type: "boolean", default: false },
      "plan-only": { type: "boolean", default: false },
      "max-parallel": { type: "string" },
      "max-chars": { type: "string" },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const mode = positionals[0];
  if (!mode || values.help || mode === "help") {
    console.log(usage);
    return;
  }
  if (!["article", "image", "prepare", "compose", "mark", "publish", "render"].includes(mode)) {
    throw new Error(`unknown mode: ${mode}\n\n${usage}`);
  }
  requireSubjectNode(values);

  const root = resolve(values.root || process.cwd());
  loadEnv(root);

  const target = {
    subject: values.subject,
    node: values.node,
    step: values.step || null,
    force: values.force,
    skipPolish: values["skip-polish"],
    planOnly: values["plan-only"],
    root,
  };

  if (mode === "prepare") {
    console.log(JSON.stringify(prepareArticles(target), null, 2));
    return;
  }
  if (mode === "compose") {
    const report = await composeArticles({
      root,
      subject: values.subject,
      node: values.node,
      step: values.step || null,
      maxChars: values["max-chars"] ? Number(values["max-chars"]) : null,
    });
    console.log(JSON.stringify(report, null, 2));
    if (report.steps.some((step) => step.status === "failed")) process.exitCode = 1;
    return;
  }
  if (mode === "mark") {
    const report = markArticles({ root, subject: values.subject, node: values.node, step: values.step || null });
    console.log(JSON.stringify(report, null, 2));
    if (report.steps.some((step) => step.status === "failed")) process.exitCode = 1;
    return;
  }
  if (mode === "publish") {
    const report = await publishArticles(target);
    console.log(JSON.stringify(report, null, 2));
    if (!report.verify.pass) process.exitCode = 1;
    return;
  }

  const deps = createDeps(root);

  if (mode === "render") {
    const result = await renderImages(
      { ...target, maxParallel: Number(values["max-parallel"] || 3) },
      deps,
    );
    const verify = runChecks({ root, subject: values.subject, node: values.node });
    const report = {
      mode,
      subject: values.subject,
      node: values.node,
      imageProvider: deps.imageProvider,
      imageModel: deps.imageModel,
      steps: result.steps,
      verify: { pass: verify.pass, failures: verify.failures },
    };
    console.log(JSON.stringify(report, null, 2));
    if (!verify.pass) process.exitCode = 1;
    if (result.steps.some((step) => step.status === "failed" || step.status === "no-markers")) {
      process.exitCode = 1;
    }
    return;
  }

  const result =
    mode === "article"
      ? await runArticle(
          { ...target, maxParallel: Number(values["max-parallel"] || 2) },
          deps,
        )
      : await runImages(target, deps);
  const imageSteps =
    mode === "article" && values.images ? (await runImages(target, deps)).steps : null;

  const verify = runChecks({ root, subject: values.subject, node: values.node });
  const report = {
    mode,
    subject: values.subject,
    node: values.node,
    textModel: deps.textModel,
    ...(mode === "image" ? { imageProvider: deps.imageProvider, imageModel: deps.imageModel } : {}),
    steps: result.steps,
    ...(imageSteps ? { imageSteps } : {}),
    verify: { pass: verify.pass, failures: verify.failures },
  };
  console.log(JSON.stringify(report, null, 2));
  if (!verify.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});

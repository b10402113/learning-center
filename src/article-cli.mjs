#!/usr/bin/env node
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  hasArticleBody,
  readNode,
  readStepSlices,
  runArticle,
  runImages,
  selectSteps,
} from "./article.mjs";
import {
  prepareFile,
  readJson,
  writeJson,
  writeMaterial,
} from "./article-agent-bridge.mjs";
import { runChecks } from "../scripts/verify.mjs";
import { publishArticles } from "../scripts/publish-article.mjs";
import { renderImages } from "./render-images.mjs";
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
  node src/article-cli.mjs prepare --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]
  node src/article-cli.mjs publish --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]
  node src/article-cli.mjs render  --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>] [--root <dir>]
  node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images] [--max-parallel <n>] [--root <dir>]  (deprecated)
  node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--plan-only] [--root <dir>]  (deprecated)

prepare  writes one material bundle per missing step and lists the publisher job
         (material, original, plan, command). The command uses --markers-only, so
         the article keeps <!--image:N--> markers instead of generating figures.
publish  writes completed marker-only runs into learn/ without touching figures,
         marks the node written, and runs verify.
render   turns <!--image:N--> markers into WebP figures and image lines. It only
         reads the publisher's plan; it never plans, rewrites prose, or reads
         anchors. Existing figures are reused unless --force is given.
article  legacy engine (deprecated): writes one article per step with a single
         text request, optionally generating figures.
image    legacy engine (deprecated): plans and generates WebP figures for
         articles that already exist.
         --plan-only writes the plan to learn/<subject>/output/image-plans/ and
         generates nothing; the next image run reuses that plan. --force with
         --plan-only rebuilds the plan; without it, --force regenerates images.
Default behaviour skips existing articles and reuses existing images.`;

function prepareArticles({ root, subject, node: nodeId, step = null, force = false }) {
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
      skipped.push({ id: entry.id, title: entry.title, status: "skipped", path: shown });
      continue;
    }
    const slices = readStepSlices(root, entry);
    const { files } = writeMaterial(root, { subject, node: nodeId, entry, slices });
    if (force) {
      for (const key of ["original", "plan", "legacyPlan", "protected", "blocks", "request", "result"]) {
        rmSync(files[key], { force: true });
      }
    }
    const index = order.indexOf(entry.id);
    steps.push({
      id: entry.id,
      title: entry.title,
      purpose: entry.purpose,
      status: "ready",
      index: index + 1,
      total: order.length,
      material: resolve(root, files.material),
      original: resolve(root, files.original),
      plan: resolve(root, files.plan),
      command: `node "${resolve(root, "scripts/run-article-agent.mjs")}" --root "${resolve(root)}" --subject ${subject} --node ${nodeId} --step ${entry.id} --markers-only`,
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
    root: resolve(root),
    subject,
    node: nodeId,
    nodeTitle: node.title,
    nodeGoal: node.goal ?? null,
    steps,
    skipped,
  };
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
        JSON.stringify({ title: step.title, count, article }, null, 2),
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
      images: { type: "boolean", default: false },
      "plan-only": { type: "boolean", default: false },
      "max-parallel": { type: "string" },
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
  if (!["article", "image", "prepare", "publish", "render"].includes(mode)) {
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
    planOnly: values["plan-only"],
    root,
  };

  if (mode === "prepare") {
    console.log(JSON.stringify(prepareArticles(target), null, 2));
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

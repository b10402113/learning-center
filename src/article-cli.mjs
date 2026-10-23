#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { runArticle, runImages } from "./article.mjs";
import { runChecks } from "../scripts/verify.mjs";
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
  node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images] [--max-parallel <n>] [--root <dir>]
  node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]

article  writes one Markdown article per missing step (one text request each).
         Add --images to plan and generate figures in the same run.
image    plans and generates WebP figures for articles that already exist.
Default behaviour skips existing articles and reuses existing images.`;

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
  if (!["article", "image"].includes(mode)) throw new Error(`unknown mode: ${mode}\n\n${usage}`);
  requireSubjectNode(values);

  const root = resolve(values.root || process.cwd());
  loadEnv(root);
  const deps = createDeps(root);
  const target = {
    subject: values.subject,
    node: values.node,
    step: values.step || null,
    force: values.force,
    root,
  };

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

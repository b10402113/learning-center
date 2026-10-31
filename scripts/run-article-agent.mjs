#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { insertImageMarkers, readNode } from "../src/article.mjs";
import {
  articleAgentRoot,
  buildRequest,
  jobFiles,
  protectCode,
  readJson,
  readStepPlan,
  writeJson,
} from "../src/article-agent-bridge.mjs";
import { createTextClient, loadEnv, resolveTextModel } from "../src/llm.mjs";
import {
  needsChinese,
  planText,
  translateArticle,
  translatePlan,
  validateTranslatedArticle,
} from "../src/translate.mjs";

const usage = `Usage:
  node scripts/run-article-agent.mjs --subject <s> --node <n> --step <id> [--mode direct|translate|rewrite] [--markers-only] [--no-images] [--root <dir>]

Runs one step through the article pipeline. It protects the code blocks and reads
the publisher's image plan first.

--mode direct (default) inserts the <!--image:N--> markers at the plan anchors and
leaves the prose exactly as the publisher wrote it. No text model is called.

--mode translate is legacy: it translates a non-Chinese original into Traditional
Chinese with prompts/translate.txt. The pipeline never uses it.

--mode rewrite keeps the old behaviour: article-agent rewrites the original,
inserts the markers, and stops after them.

Both modes stop after the markers when --markers-only is set, so no image model
is called.`;

const PARTIAL = /partial files: (.+)$/m;

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      mode: { type: "string", default: "direct" },
      "no-images": { type: "boolean", default: false },
      "markers-only": { type: "boolean", default: false },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  for (const key of ["subject", "node", "step"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
  const mode = values.mode;
  if (!["direct", "translate", "rewrite"].includes(mode)) {
    throw new Error(`unknown --mode: ${mode} (use direct, translate, or rewrite)\n\n${usage}`);
  }

  const root = resolve(values.root || process.cwd());
  loadEnv(root);
  const node = readNode(root, values.subject, values.node);
  const entry = node.steps.find((step) => step && step.id === values.step);
  if (!entry) throw new Error(`step "${values.step}" is not in node ${values.node}`);

  const files = jobFiles(root, { subject: values.subject, node: values.node, step: entry.id });
  mkdirSync(files.dir, { recursive: true });
  if (!existsSync(files.original)) {
    throw new Error(`original article not found: ${relative(root, files.original)}`);
  }

  const markersOnly = values["markers-only"];
  if (markersOnly && !existsSync(files.plan)) {
    throw new Error("--markers-only requires an image plan");
  }
  const original = readFileSync(files.original, "utf8");
  const plan =
    values["no-images"] && !markersOnly
      ? null
      : readStepPlan(root, { subject: values.subject, node: values.node, step: entry.id }, original);
  const { text, blocks } = protectCode(original);
  writeJson(files.blocks, blocks);

  const context = {
    root,
    subject: values.subject,
    files,
    entry,
    plan,
    markersOnly,
    protectedText: text,
    blocks,
  };
  if (mode === "rewrite") {
    runRewrite(context);
  } else if (mode === "direct") {
    runDirect(context);
  } else {
    await runTranslate(context);
  }
}

function runDirect({ root, files, entry, plan, markersOnly, protectedText }) {
  if (plan) {
    for (const item of plan) {
      if (!protectedText.includes(item.anchor)) {
        throw new Error(`image plan item ${item.index} anchor is not in the unprotected prose: ${item.anchor}`);
      }
    }
  }
  const article = plan ? insertImageMarkers(protectedText, plan) : `${protectedText.trimEnd()}\n`;
  writeFileSync(files.protected, article);
  writeJson(files.request, {
    mode: "direct",
    title: entry.title ?? null,
    articleFile: relative(root, files.protected),
    plan: plan ?? null,
    markersOnly: Boolean(markersOnly),
  });
  writeFileSync(files.marked, article.endsWith("\n") ? article : `${article}\n`);
  const verdict = {
    status: "completed",
    outputDir: files.dir,
    article: files.marked,
    images: [],
    textModel: null,
    textRequests: 0,
    imageRequests: 0,
    markersOnly: Boolean(markersOnly),
    error: null,
  };
  writeJson(files.result, verdict);
  console.log(JSON.stringify(verdict, null, 2));
}

function runRewrite({ root, subject, files, entry, plan, markersOnly, protectedText, blocks }) {
  writeFileSync(files.protected, protectedText);
  writeJson(
    files.request,
    buildRequest(root, {
      subject,
      files,
      entry,
      plan,
      hasCode: blocks.length > 0,
      markersOnly,
      mode: "rewrite",
    }),
  );

  const agentRoot = articleAgentRoot(root);
  let stdout = "";
  let stderr = "";
  try {
    stdout = execFileSync(process.execPath, ["src/cli.mjs", relative(agentRoot, files.request)], {
      cwd: agentRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
  } catch (error) {
    stdout = error.stdout?.toString?.() ?? "";
    stderr = error.stderr?.toString?.() ?? error.message;
  }

  const verdict = describeRun(stdout, stderr);
  writeJson(files.result, verdict);
  console.log(JSON.stringify(verdict, null, 2));
  if (verdict.status !== "completed") process.exitCode = 1;
}

async function runTranslate({ root, files, entry, plan, markersOnly, protectedText }) {
  const model = resolveTextModel();
  let textRequests = 0;
  let article = null;
  try {
    if (plan) {
      for (const item of plan) {
        if (!protectedText.includes(item.anchor)) {
          throw new Error(`image plan item ${item.index} anchor is not in the unprotected prose: ${item.anchor}`);
        }
      }
    }
    const prepared = plan ? insertImageMarkers(protectedText, plan) : `${protectedText.trimEnd()}\n`;
    writeFileSync(files.protected, prepared);

    const translatePlanNeeded = Boolean(plan) && needsChinese(planText(plan));
    const translateArticleNeeded = needsChinese(prepared);
    writeJson(files.request, {
      mode: "translate",
      title: entry.title ?? null,
      articleFile: relative(root, files.protected),
      plan: plan ?? null,
      markersOnly: Boolean(markersOnly),
    });

    article = prepared;
    if (translateArticleNeeded || translatePlanNeeded) {
      const client = await createTextClient();
      if (translateArticleNeeded) {
        const system = readFileSync(join(root, "prompts", "translate.txt"), "utf8");
        article = await translateArticle({
          client,
          model,
          system,
          article: prepared,
          validate: (text) => validateTranslatedArticle({ before: prepared, after: text }),
        });
        textRequests += 1;
      }
      if (translatePlanNeeded) {
        const system = readFileSync(join(root, "prompts", "translate-plan.txt"), "utf8");
        writeJson(files.plan, await translatePlan({ client, model, system, plan }));
        textRequests += 1;
      }
    }
    writeFileSync(files.translated, article.endsWith("\n") ? article : `${article}\n`);
  } catch (error) {
    const failed = {
      status: "failed",
      outputDir: files.dir,
      article: null,
      images: [],
      textModel: model,
      textRequests,
      imageRequests: 0,
      markersOnly: Boolean(markersOnly),
      error: { message: error?.message ?? String(error) },
    };
    writeJson(files.result, failed);
    console.log(JSON.stringify(failed, null, 2));
    process.exitCode = 1;
    return;
  }

  const verdict = {
    status: "completed",
    outputDir: files.dir,
    article: files.translated,
    images: [],
    textModel: model,
    textRequests,
    imageRequests: 0,
    markersOnly: Boolean(markersOnly),
    error: null,
  };
  writeJson(files.result, verdict);
  console.log(JSON.stringify(verdict, null, 2));
}

function describeRun(stdout, stderr) {
  let outputDir = null;
  try {
    const parsed = JSON.parse(stdout);
    if (parsed?.manifest) outputDir = parsed.manifest.replace(/\/manifest\.json$/, "");
  } catch {}
  if (!outputDir) outputDir = stderr.match(PARTIAL)?.[1]?.trim() ?? null;
  if (!outputDir) {
    return { status: "failed", outputDir: null, error: { message: stderr.trim() || "no run produced" } };
  }
  const manifest = readJson(join(outputDir, "manifest.json")) ?? {};
  return {
    status: manifest.status ?? "failed",
    outputDir,
    article: join(outputDir, "article.md"),
    images: (manifest.images ?? []).map((image) => join(outputDir, "assets", image.filename)),
    textModel: manifest.textModel ?? null,
    textRequests: manifest.textRequests ?? 0,
    imageRequests: manifest.imageRequests ?? 0,
    markersOnly: manifest.markersOnly ?? false,
    error: manifest.error ?? (stderr.trim() ? { message: stderr.trim() } : null),
  };
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});

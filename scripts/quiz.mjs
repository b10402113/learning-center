#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  countArticleCharacters,
  hasArticleBody,
  readNode,
  selectSteps,
} from "../src/article.mjs";
import {
  QUIZ_MIN_QUESTIONS,
  formatQuizPayload,
  maxQuestionsFor,
  normalizeQuizOutput,
  quizFilePath,
  quizFileRel,
  validateQuizPayload,
} from "../src/quiz.mjs";

const REPO_ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

function usage() {
  console.error(`usage:
  node scripts/quiz.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
  node scripts/quiz.mjs write   --subject <s> --node <n> --step <id> --input <file|-> [--force]
  node scripts/quiz.mjs status  --subject <s> --node <n>`);
}

function parseArgs(argv) {
  const options = {
    command: argv[0] === "--help" || argv[0] === "-h" ? "help" : argv[0] || "",
    subject: null,
    node: null,
    step: null,
    input: null,
    force: false,
    root: REPO_ROOT,
  };

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--subject" && index + 1 < argv.length) {
      options.subject = argv[++index];
    } else if (arg === "--node" && index + 1 < argv.length) {
      options.node = argv[++index];
    } else if (arg === "--step" && index + 1 < argv.length) {
      options.step = argv[++index];
    } else if (arg === "--input" && index + 1 < argv.length) {
      options.input = argv[++index];
    } else if (arg === "--root" && index + 1 < argv.length) {
      options.root = resolve(argv[++index]);
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--help" || arg === "-h") {
      options.command = "help";
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function requireTarget(options) {
  if (!options.subject || !options.node) {
    throw new Error("--subject and --node are required");
  }
}

function articlePath(root, subject, nodeId, stepId) {
  return join(root, "learn", subject, "nodes", nodeId, `${stepId}.md`);
}

function articleInfo(root, subject, nodeId, stepId) {
  const file = articlePath(root, subject, nodeId, stepId);
  if (!existsSync(file)) return { file, missing: true };
  const markdown = readFileSync(file, "utf8");
  if (!hasArticleBody(markdown)) return { file, missing: true, empty: true };
  const characters = countArticleCharacters(markdown);
  return { file, markdown, characters, missing: false };
}

function prepare(options) {
  requireTarget(options);
  const node = readNode(options.root, options.subject, options.node);
  const entries = selectSteps(node, options.step);
  const ready = [];
  const skipped = [];

  for (const entry of entries) {
    const info = articleInfo(options.root, options.subject, options.node, entry.id);
    const output = quizFilePath(options.root, options.subject, options.node, entry.id);
    const outputRel = quizFileRel(options.subject, options.node, entry.id);
    const articleRel = relative(options.root, info.file);

    if (info.missing) {
      skipped.push({
        id: entry.id,
        title: entry.title ?? entry.id,
        reason: info.empty ? "article-empty" : "article-missing",
        article: articleRel,
        output: outputRel,
      });
      continue;
    }
    if (existsSync(output) && !options.force) {
      skipped.push({
        id: entry.id,
        title: entry.title ?? entry.id,
        reason: "quiz-exists",
        article: articleRel,
        output: outputRel,
      });
      continue;
    }

    ready.push({
      id: entry.id,
      title: entry.title ?? entry.id,
      article: articleRel,
      output: outputRel,
      characters: info.characters,
      minQuestions: QUIZ_MIN_QUESTIONS,
      maxQuestions: maxQuestionsFor(info.characters),
    });
  }

  return {
    subject: options.subject,
    node: options.node,
    steps: ready,
    skipped,
  };
}

function readInput(input) {
  if (!input) throw new Error("--input is required");
  if (input === "-") return readFileSync(0, "utf8");
  const file = resolve(input);
  if (!existsSync(file)) throw new Error(`input file not found: ${input}`);
  return readFileSync(file, "utf8");
}

function write(options) {
  requireTarget(options);
  if (!options.step) throw new Error("--step is required");

  const node = readNode(options.root, options.subject, options.node);
  const [entry] = selectSteps(node, options.step);
  const info = articleInfo(options.root, options.subject, options.node, entry.id);
  const target = quizFilePath(options.root, options.subject, options.node, entry.id);
  const targetRel = quizFileRel(options.subject, options.node, entry.id);

  if (info.missing) {
    return {
      status: "failed",
      step: entry.id,
      output: targetRel,
      errors: [
        {
          checkId: "quiz-article",
          message: `article is missing or empty: ${relative(options.root, info.file)}`,
        },
      ],
    };
  }
  if (existsSync(target) && !options.force) {
    return {
      status: "failed",
      step: entry.id,
      output: targetRel,
      errors: [
        {
          checkId: "quiz-exists",
          message: `${targetRel} already exists; pass --force to overwrite`,
        },
      ],
    };
  }

  let payload;
  try {
    payload = normalizeQuizOutput(readInput(options.input));
  } catch (error) {
    return {
      status: "failed",
      step: entry.id,
      output: targetRel,
      errors: [{ checkId: "quiz-output", message: error.message }],
    };
  }

  const maxQuestions = maxQuestionsFor(info.characters);
  const errors = validateQuizPayload(payload, { maxQuestions, enforceStyle: true });
  if (errors.length > 0) {
    return {
      status: "failed",
      step: entry.id,
      output: targetRel,
      characters: info.characters,
      maxQuestions,
      errors,
    };
  }

  writeFileSync(target, formatQuizPayload(payload));
  return {
    status: "written",
    step: entry.id,
    output: targetRel,
    characters: info.characters,
    maxQuestions,
    questions: payload.questions.length,
  };
}

function status(options) {
  requireTarget(options);
  const node = readNode(options.root, options.subject, options.node);
  const steps = node.steps.map((entry) => {
    const info = articleInfo(options.root, options.subject, options.node, entry.id);
    const file = quizFilePath(options.root, options.subject, options.node, entry.id);
    const outputRel = quizFileRel(options.subject, options.node, entry.id);
    const row = {
      id: entry.id,
      title: entry.title ?? entry.id,
      article: relative(options.root, info.file),
      characters: info.missing ? 0 : info.characters,
      minQuestions: QUIZ_MIN_QUESTIONS,
      maxQuestions: maxQuestionsFor(info.missing ? 0 : info.characters),
      quiz: existsSync(file) ? outputRel : null,
    };

    if (existsSync(file)) {
      try {
        const payload = JSON.parse(readFileSync(file, "utf8"));
        row.questions = Array.isArray(payload.questions) ? payload.questions.length : 0;
        row.generated = payload["quiz-generated"] === true;
      } catch {
        row.questions = 0;
        row.generated = false;
        row.invalidJson = true;
      }
    }

    return row;
  });

  return { subject: options.subject, node: options.node, steps };
}

function main(argv) {
  const options = parseArgs(argv);
  if (!options.command || options.command === "help") {
    usage();
    process.exit(options.command === "help" ? 0 : 2);
  }

  let result;
  if (options.command === "prepare") result = prepare(options);
  else if (options.command === "write") result = write(options);
  else if (options.command === "status") result = status(options);
  else throw new Error(`unknown command: ${options.command}`);

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status === "failed") process.exit(1);
}

export { prepare, status, write };

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`quiz: ${error.message}`);
    process.exit(1);
  }
}

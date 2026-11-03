#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { readNode } from "../src/article.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function listFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) listFiles(path, out);
    else out.push(path);
  }
  return out;
}

function nodeStepIds(root, subject, node) {
  return new Set(readNode(root, subject, node).steps.map((entry) => entry?.id).filter(Boolean));
}

function planMoves(root, subject) {
  const plansDir = join(root, "learn", subject, "output", "image-plans");
  const stepIds = new Map();
  return listFiles(plansDir).map((source) => {
    const rel = relative(plansDir, source).split("/");
    const file = rel.pop();
    const node = rel.join("/");
    const step = file.replace(/\.json$/, "");
    if (!stepIds.has(node)) stepIds.set(node, nodeStepIds(root, subject, node));
    return {
      source,
      node,
      step,
      stale: !stepIds.get(node).has(step),
      target: join(root, "learn", subject, "nodes", node, `${step}.plan.json`),
    };
  });
}

export function migrateArtifacts({ root = REPO_ROOT, apply = false }) {
  const learnDir = join(root, "learn");
  const subjects = existsSync(learnDir)
    ? readdirSync(learnDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((subject) => existsSync(join(learnDir, subject, "output")))
        .sort()
    : [];

  const planned = subjects.map((subject) => {
    const moves = planMoves(root, subject);
    const live = moves.filter((move) => !move.stale);
    return {
      subject,
      live,
      stale: moves.length - live.length,
      collisions: live.filter((move) => existsSync(move.target)).map((move) => move.target),
    };
  });

  if (planned.some((entry) => entry.collisions.length > 0)) {
    return {
      apply,
      subjects: planned.map((entry) => ({
        subject: entry.subject,
        moved: 0,
        stale: entry.stale,
        collisions: entry.collisions,
        outputRemoved: false,
      })),
    };
  }

  if (apply) {
    for (const entry of planned) {
      for (const move of entry.live) {
        mkdirSync(dirname(move.target), { recursive: true });
        renameSync(move.source, move.target);
      }
      rmSync(join(learnDir, entry.subject, "output"), { recursive: true, force: true });
    }
  }

  return {
    apply,
    subjects: planned.map((entry) => ({
      subject: entry.subject,
      moved: entry.live.length,
      stale: entry.stale,
      collisions: [],
      outputRemoved: apply,
    })),
  };
}

const usage = `Usage:
  node scripts/migrate-artifacts.mjs [--apply] [--root <dir>]

Moves every learn/<subject>/output/image-plans/<node>/<step>.json to
learn/<subject>/nodes/<node>/<step>.plan.json, then deletes the rest of that
subject's output/ directory. Runs as a dry run unless --apply is given.`;

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      apply: { type: "boolean", default: false },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  const report = migrateArtifacts({
    root: resolve(values.root || process.cwd()),
    apply: values.apply,
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.subjects.some((subject) => subject.collisions.length > 0)) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.message ?? error);
    process.exitCode = 1;
  });
}

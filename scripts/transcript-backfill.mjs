#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifiedTextFor } from "../src/source-layout.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SUBTITLE_EXTENSIONS = new Set([".srt", ".vtt"]);
const TIMESTAMP = /^\s*\d{1,2}:\d{2}(?::\d{2})?[.,]\d{3}\s*-->\s*\d{1,2}:\d{2}(?::\d{2})?[.,]\d{3}/;
const HEADER = /^(?:WEBVTT|NOTE|STYLE|REGION)\b/i;
const TAG = /<[^>]*>/g;
const ENTITIES = new Map([
  ["&amp;", "&"],
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&nbsp;", " "],
  ["&#39;", "'"],
  ["&quot;", '"'],
]);

function decodeEntities(text) {
  return text.replace(/&(?:amp|lt|gt|nbsp|#39|quot);/g, (entity) => ENTITIES.get(entity) ?? entity);
}

function cleanCue(text) {
  return decodeEntities(String(text).replace(TAG, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function cueTexts(content) {
  const lines = String(content).replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let current = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length) blocks.push(current);
      current = [];
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);

  const cues = [];
  for (const block of blocks) {
    if (block.length === 0) continue;
    if (HEADER.test(block[0].trim())) continue;
    const timestampIndex = block.findIndex((line) => TIMESTAMP.test(line));
    if (timestampIndex === -1) continue;
    const texts = block
      .slice(timestampIndex + 1)
      .map(cleanCue)
      .filter(Boolean);
    cues.push(...texts);
  }
  return cues;
}

function joinCueLines(texts) {
  return texts
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/([\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef])\s+(?=[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef])/g, "$1")
    .replace(/\s+([，。！？、；：」』）])/g, "$1")
    .replace(/([「『（])\s+/g, "$1")
    .trim();
}

export function cuesToText(content) {
  const cues = cueTexts(content);
  const paragraphs = [];
  let current = [];
  let length = 0;
  for (const cue of cues) {
    if (current.length > 0 && current[current.length - 1] === cue) continue;
    current.push(cue);
    length += cue.length;
    const endsSentence = /[.!?。！？]$/.test(cue);
    if (length >= 240 || (endsSentence && length >= 80)) {
      paragraphs.push(joinCueLines(current));
      current = [];
      length = 0;
    }
  }
  if (current.length) paragraphs.push(joinCueLines(current));
  const body = paragraphs.filter(Boolean).join("\n\n").trim();
  return body ? `${body}\n` : "";
}

function walkSubtitles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkSubtitles(full, out);
    else if (entry.isFile() && SUBTITLE_EXTENSIONS.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function existingTranscript(file) {
  const sibling = file.replace(/\.(?:srt|vtt)$/i, ".txt");
  if (existsSync(sibling)) return sibling;
  return classifiedTextFor(file);
}

export function backfillTranscripts({ root = REPO_ROOT, subject, dryRun = false }) {
  const subjectDir = join(root, "sources", subject);
  const files = walkSubtitles(subjectDir).sort();
  const result = { written: [], wouldWrite: [], skipped: [], failed: [] };
  for (const file of files) {
    const existing = existingTranscript(file);
    if (existing) {
      result.skipped.push({ file, existing });
      continue;
    }
    if (dryRun) {
      result.wouldWrite.push(file);
      continue;
    }
    try {
      const text = cuesToText(readFileSync(file, "utf8"));
      if (!text.trim()) {
        result.failed.push({ file, error: "subtitle has no cue text" });
        continue;
      }
      const target = file.replace(/\.(?:srt|vtt)$/i, ".txt");
      mkdirSync(dirname(target), { recursive: true });
      const temporary = `${target}.tmp-${process.pid}`;
      writeFileSync(temporary, text);
      renameSync(temporary, target);
      result.written.push(target);
    } catch (error) {
      result.failed.push({ file, error: error?.message ?? String(error) });
    }
  }
  return result;
}

function usage() {
  console.error("usage: node scripts/transcript-backfill.mjs --subject <subject> [--dry-run] [--json]");
}

function main(argv) {
  const args = argv.slice(2);
  let subject = null;
  let dryRun = false;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--subject" && index + 1 < args.length) subject = args[++index];
    else if (args[index] === "--dry-run") dryRun = true;
    else if (args[index] === "--json") json = true;
    else if (!args[index].startsWith("--") && !subject) subject = args[index];
  }
  if (!subject) {
    usage();
    process.exit(2);
  }
  if (!existsSync(join(REPO_ROOT, "sources", subject))) {
    console.error(`unknown subject: ${subject}`);
    process.exit(2);
  }
  const result = backfillTranscripts({ root: REPO_ROOT, subject, dryRun });
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    console.log(
      `Transcript backfill ${subject}: ${result.written.length} written, ${result.skipped.length} skipped, ${result.failed.length} failed${dryRun ? `, ${result.wouldWrite.length} would write` : ""}`,
    );
    for (const path of result.written) console.log(`  wrote ${path}`);
    for (const path of result.wouldWrite) console.log(`  would write ${path}`);
    for (const path of result.failed) console.log(`  failed ${path.file}: ${path.error}`);
  }
  process.exit(result.failed.length > 0 ? 1 : 0);
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

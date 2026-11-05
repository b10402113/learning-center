import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

export const SOURCE_ROLES = ["course", "supplement", "raw"];
export const CITABLE_ROLES = ["course", "supplement"];
export const COURSE_CHARS_PER_NODE = 30000;

const ROLE_SEGMENT = /(?:^|\/)(\d{8})\/(course|supplement|raw)(?:\/|$)/;
const NON_TEXT = new Set([".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".zip", ".srt", ".vtt"]);

function isCourseText(file) {
  return !NON_TEXT.has(extname(file).toLowerCase());
}

export function parseSourceRole(path) {
  const normalized = String(path ?? "").replace(/\\/g, "/");
  const match = normalized.match(ROLE_SEGMENT);
  return match ? match[2] : null;
}

export function countCharacters(text) {
  return Array.from(String(text ?? "").replace(/\s/g, "")).length;
}

export function nodeBaseline(courseCharacters) {
  return Math.max(3, Math.min(30, Math.round(Number(courseCharacters) / COURSE_CHARS_PER_NODE)));
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

export function courseTextFiles(root, subject) {
  const subjectDir = join(root, "sources", subject);
  if (!existsSync(subjectDir)) return [];
  const files = [];
  for (const entry of readdirSync(subjectDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const courseDir = join(subjectDir, entry.name, "course");
    for (const file of walkFiles(courseDir)) {
      if (isCourseText(file)) files.push(file);
    }
  }
  return files;
}

export function courseCharacterCount(root, subject) {
  return courseTextFiles(root, subject).reduce(
    (total, file) => total + countCharacters(readFileSync(file, "utf8")),
    0,
  );
}

export function datedFolder(file) {
  let dir = dirname(file);
  while (dir && dir !== dirname(dir)) {
    if (/^\d{8}$/.test(basename(dir))) return dir;
    dir = dirname(dir);
  }
  return null;
}

export function classifiedTextFor(file) {
  const dated = datedFolder(file);
  if (!dated) return null;
  const stem = basename(file).replace(/\.(?:srt|vtt|pdf|txt)$/i, "");
  for (const role of CITABLE_ROLES) {
    const dir = join(dated, role);
    if (!existsSync(dir)) continue;
    const names = readdirSync(dir);
    if (names.includes(`${stem}.txt`)) return join(dir, `${stem}.txt`);
    const part = names.find((name) => name.startsWith(`${stem}.`) && /\.part\.txt$/i.test(name));
    if (part) return join(dir, part);
  }
  return null;
}

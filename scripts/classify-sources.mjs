#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CITABLE_ROLES, SOURCE_ROLES, datedFolder } from "../src/source-layout.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_EXTENSIONS = new Set([".srt", ".vtt", ".pdf"]);
const DATE_FOLDER = /^\d{8}$/;

function isPartsManifest(name) {
  return name.toLowerCase().endsWith(".parts.json");
}

export function defaultRole(path) {
  const name = basename(path);
  const ext = extname(name).toLowerCase();
  if (isPartsManifest(name) || RAW_EXTENSIONS.has(ext)) return "raw";
  if (ext === ".txt") return "course";
  return "supplement";
}

function normalizeMap(raw) {
  if (raw === null || raw === undefined) return {};
  if (typeof raw !== "object" || Array.isArray(raw)) throw new Error("role map must be a JSON object");
  const map = {};
  for (const [key, value] of Object.entries(raw)) {
    const role = String(value ?? "").trim().toLowerCase();
    if (!SOURCE_ROLES.includes(role)) {
      throw new Error(`role for "${key}" must be one of ${SOURCE_ROLES.join(", ")}`);
    }
    map[String(key).replace(/\\/g, "/").replace(/^\.\//, "")] = role;
  }
  return map;
}

function mappedRole(map, relativePath) {
  if (Object.prototype.hasOwnProperty.call(map, relativePath)) return map[relativePath];
  if (relativePath.startsWith("raw/")) {
    const stripped = relativePath.slice("raw/".length);
    if (Object.prototype.hasOwnProperty.call(map, stripped)) return map[stripped];
  }
  return null;
}

function dateFolders(subjectDir) {
  if (!existsSync(subjectDir)) return [];
  return readdirSync(subjectDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && DATE_FOLDER.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function entriesIn(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => ({
      name: entry.name,
      directory: entry.isDirectory(),
      path: join(directory, entry.name),
    }));
}

function candidatesFor(datedDir, map) {
  const candidates = [];
  for (const entry of entriesIn(datedDir)) {
    if (SOURCE_ROLES.includes(entry.name) && entry.directory) continue;
    const role = mappedRole(map, entry.name) ?? defaultRole(entry.name);
    candidates.push({
      relative: entry.name,
      source: entry.path,
      directory: entry.directory,
      role,
      reason: mappedRole(map, entry.name) ? "map" : `default:${extname(entry.name).toLowerCase() || "directory"}`,
    });
  }

  const rawDir = join(datedDir, "raw");
  if (existsSync(rawDir)) {
    for (const entry of entriesIn(rawDir)) {
      if (entry.directory) continue;
      const relative = `raw/${entry.name}`;
      const mapped = mappedRole(map, relative);
      const role = mapped ?? defaultRole(entry.name);
      if (role === "raw") continue;
      candidates.push({
        relative,
        source: entry.path,
        directory: false,
        role,
        reason: mapped ? "map" : "raw-text",
      });
    }
  }
  return candidates;
}

function walkRelative(dir, base = "", out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const relative = base ? `${base}/${entry.name}` : entry.name;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkRelative(full, relative, out);
    else out.push(relative);
  }
  return out;
}

function hasRawOriginals(dir) {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (hasRawOriginals(full)) return true;
    } else if (isPartsManifest(entry.name) || RAW_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function planClassification({ root = REPO_ROOT, subject, map = {} }) {
  const subjectDir = join(root, "sources", subject);
  if (!existsSync(subjectDir)) throw new Error(`unknown subject: ${subject}`);
  const roleMap = normalizeMap(map);
  const moves = [];
  const warnings = [];
  for (const date of dateFolders(subjectDir)) {
    const datedDir = join(subjectDir, date);
    for (const candidate of candidatesFor(datedDir, roleMap)) {
      const fileName = candidate.relative.startsWith("raw/")
        ? candidate.relative.slice("raw/".length)
        : candidate.relative;
      if (candidate.directory && candidate.role !== "raw" && hasRawOriginals(candidate.source)) {
        for (const file of walkRelative(candidate.source)) {
          const relative = `${candidate.relative}/${file}`;
          const mapped = mappedRole(map, relative);
          const role = mapped ?? defaultRole(file);
          moves.push({
            date,
            relative,
            role,
            reason: mapped ? "map" : `default:${extname(file).toLowerCase()}`,
            source: join(candidate.source, file),
            target: join(datedDir, role, relative),
          });
        }
        continue;
      }
      const target = join(datedDir, candidate.role, fileName);
      moves.push({
        date,
        relative: candidate.relative,
        role: candidate.role,
        reason: candidate.reason,
        source: candidate.source,
        target,
      });
    }
  }
  return { subject, moves, warnings };
}

function walkManifests(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkManifests(full, out);
    else if (entry.name.toLowerCase().endsWith(".parts.json")) out.push(full);
  }
  return out;
}

function roleForPart(root, subject, date, fileName, applied) {
  const moved = applied.find(
    (move) => move.date === date && (basename(move.source) === fileName || basename(move.target) === fileName),
  );
  if (moved) return moved.role;
  for (const role of CITABLE_ROLES) {
    if (existsSync(join(root, "sources", subject, date, role, fileName))) return role;
  }
  return null;
}

function updateManifestRoles({ root, subject, applied }) {
  for (const path of walkManifests(join(root, "sources", subject))) {
    const date = basename(datedFolder(path) ?? "");
    if (!date) continue;
    try {
      const manifest = JSON.parse(readFileSync(path, "utf8"));
      if (!Array.isArray(manifest.parts)) continue;
      let changed = false;
      for (const part of manifest.parts) {
        if (!part || typeof part.file !== "string") continue;
        const role = roleForPart(root, subject, date, part.file, applied);
        if (role && part.role !== role) {
          part.role = role;
          changed = true;
        }
      }
      if (changed) {
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
      }
    } catch {
      // A malformed manifest is reported by verify; classification stays best effort.
    }
  }
}

export function applyClassification({ root = REPO_ROOT, subject, map = {} }) {
  const plan = planClassification({ root, subject, map });
  const applied = [];
  const failed = [];
  for (const move of plan.moves) {
    if (existsSync(move.target)) {
      failed.push({ ...move, error: `target already exists: ${move.target}` });
      continue;
    }
    try {
      mkdirSync(dirname(move.target), { recursive: true });
      renameSync(move.source, move.target);
      applied.push(move);
    } catch (error) {
      failed.push({ ...move, error: error?.message ?? String(error) });
    }
  }
  updateManifestRoles({ root, subject, applied });
  return { ...plan, applied, failed };
}

function readMapFile(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function usage() {
  console.error(
    "usage: node scripts/classify-sources.mjs --subject <subject> [--map <file>] [--apply] [--json]",
  );
}

function main(argv) {
  const args = argv.slice(2);
  let subject = null;
  let mapPath = null;
  let apply = false;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--subject" && index + 1 < args.length) subject = args[++index];
    else if (args[index] === "--map" && index + 1 < args.length) mapPath = args[++index];
    else if (args[index] === "--apply") apply = true;
    else if (args[index] === "--json") json = true;
    else if (!args[index].startsWith("--") && !subject) subject = args[index];
  }
  if (!subject) {
    usage();
    process.exit(2);
  }
  let map = {};
  try {
    if (mapPath) map = readMapFile(mapPath);
  } catch (error) {
    console.error(`cannot read role map: ${error.message}`);
    process.exit(2);
  }

  let result;
  try {
    result = apply ? applyClassification({ root: REPO_ROOT, subject, map }) : planClassification({ root: REPO_ROOT, subject, map });
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    const moves = apply ? result.applied : result.moves;
    console.log(`Source classification ${subject}: ${moves.length} ${apply ? "moved" : "planned"}`);
    for (const move of moves) console.log(`  ${move.role.padEnd(10)} ${move.relative} -> ${move.role}/${basename(move.target)} (${move.reason})`);
    for (const warning of result.warnings ?? []) console.log(`  warning ${warning.relative}: ${warning.warning}`);
    for (const failure of result.failed ?? []) console.log(`  failed ${failure.relative}: ${failure.error}`);
  }
  process.exit((result.failed?.length ?? 0) > 0 ? 1 : 0);
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

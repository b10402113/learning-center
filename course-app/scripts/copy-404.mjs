#!/usr/bin/env node
/**
 * GitHub Pages has no rewrite rules. Copying `index.html` to `404.html` lets a
 * direct hit on `/learning-center/<subject>/<node>` boot the app, which then
 * reads the pathname and renders the right route.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "index.html");
const fallback = path.join(dist, "404.html");

if (!fs.existsSync(index)) {
  console.error("dist/index.html is missing; run vite build first");
  process.exit(1);
}

fs.copyFileSync(index, fallback);
console.log("✔ dist/404.html");

import fs from "node:fs";
import path from "node:path";
import { kinds, parseDocument, validateLibrary } from "./schema.mjs";

export const contentRoot = path.join(process.cwd(), "content");
export const categoryNames = {
  "ai-development": "AI 開發",
  "agent-harness": "Agent 工程",
  "context-engineering": "Context 工程",
};
export function readLibrary(root = contentRoot) {
  return Object.fromEntries(
    kinds.map((kind) => [
      kind,
      fs
        .readdirSync(path.join(root, kind))
        .filter((f) => f.endsWith(".md"))
        .map((file) =>
          parseDocument(
            fs.readFileSync(path.join(root, kind, file), "utf8"),
            file.slice(0, -3),
            kind,
          ),
        ),
    ]),
  );
}
export function publishedLibrary() {
  const library = readLibrary();
  const errors = validateLibrary(library);
  if (errors.length) throw new Error(errors.join("\n"));
  return Object.fromEntries(
    kinds.map((kind) => [
      kind,
      library[kind]
        .filter((d) => d.status === "published")
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
        ),
    ]),
  );
}
export function publicDocument(doc) {
  const { raw, source, ...data } = doc;
  return { ...data, body: data.body.replace(/<!--[\s\S]*?-->\s*/g, "") };
}
export function hrefFor(doc) {
  return `/${doc.kind}/${doc.slug}/`;
}
export function readingMinutes(body) {
  return Math.max(
    1,
    Math.ceil(
      body.replace(/<!--[\s\S]*?-->/g, "").replace(/\s/g, "").length / 450,
    ),
  );
}
export function categoryLabel(slug) {
  return categoryNames[slug] || slug;
}
export function resolveRoadmap(roadmap, library) {
  return roadmap.stages.map((stage) => ({
    ...stage,
    items: stage.items.map((item) => ({
      ...item,
      document: publicDocument(
        library[item.type === "article" ? "articles" : "blocks"].find(
          (doc) => doc.slug === item.ref,
        ),
      ),
    })),
  }));
}

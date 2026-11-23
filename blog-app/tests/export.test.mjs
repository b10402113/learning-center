import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { publishedLibrary } from "../lib/content.mjs";
const built = fs.existsSync("out/index.html");
test(
  "static export has crawlable article text, canonical, social cards and schema",
  { skip: !built },
  () => {
    const { articles } = publishedLibrary();
    for (const article of articles) {
      const html = fs.readFileSync(
        `out/articles/${article.slug}/index.html`,
        "utf8",
      );
      assert.ok(html.includes(article.title));
      assert.ok(html.includes('rel="canonical"'));
      assert.ok(html.includes('property="og:image"'));
      assert.ok(html.includes("BlogPosting"));
      assert.ok(html.includes("BreadcrumbList"));
      assert.ok(html.includes("<h2"));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.ok(!html.includes("source: sources/"));
    }
  },
);
test(
  "all rendered internal links and local images resolve to exported files",
  { skip: !built },
  () => {
    const files = fs
      .readdirSync("out", { recursive: true })
      .filter((f) => f.endsWith(".html"));
    const missing = [];
    for (const file of files) {
      const html = fs.readFileSync(path.join("out", file), "utf8");
      for (const match of html.matchAll(
        /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
      )) {
        const url = decodeURIComponent(match[1].replaceAll("&amp;", "&"));
        if (url.startsWith("//")) continue;
        const target = path.join("out", url);
        if (!fs.existsSync(target) && !fs.existsSync(target + "/index.html"))
          missing.push(`${file} -> ${url}`);
      }
    }
    assert.deepEqual([...new Set(missing)], []);
  },
);
test(
  "public build excludes editor write endpoints and sitemap excludes studio",
  { skip: !built },
  () => {
    assert.ok(!fs.existsSync("out/__studio"));
    assert.ok(!fs.readFileSync("out/sitemap.xml", "utf8").includes("/studio/"));
    assert.ok(
      fs.readFileSync("out/studio/index.html", "utf8").includes("noindex"),
    );
    assert.ok(
      !fs.readFileSync("out/index.html", "utf8").includes("內容編輯器"),
    );
  },
);

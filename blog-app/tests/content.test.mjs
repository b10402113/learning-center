import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import {
  parseDocument,
  serializeDocument,
  validateLibrary,
} from "../lib/schema.mjs";
import {
  readLibrary,
  publishedLibrary,
  publicDocument,
} from "../lib/content.mjs";
import {
  saveDocument,
  revisionFor,
  saveImage,
  createStudioServer,
} from "../scripts/studio-server.mjs";
const document = {
  kind: "articles",
  slug: "hello",
  title: "第一篇文章",
  description: "測試摘要",
  status: "published",
  date: "2026-11-18",
  category: "ai-development",
  body: "# 第一篇文章\n\n## 觀念\n\n內文。",
};
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "block-blog-"));
  for (const dir of ["articles", "blocks", "roadmaps"])
    fs.mkdirSync(path.join(root, dir));
  const raw = serializeDocument(document);
  fs.writeFileSync(path.join(root, "articles/hello.md"), raw);
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, raw };
}
test("Markdown round trip preserves code, Chinese and metadata", () => {
  const doc = {
    ...document,
    body:
      document.body + '\n\n<!-- derived -->\n```js\nconst value = "中文";\n```',
  };
  const parsed = parseDocument(serializeDocument(doc), "hello", "articles");
  assert.equal(parsed.body, doc.body);
  assert.equal(parsed.title, doc.title);
  assert.equal(parsed.date, doc.date);
});
test("real library and public projection validate; raw source metadata is excluded by projection", () => {
  const library = readLibrary();
  assert.deepEqual(validateLibrary(library), []);
  assert.ok(publishedLibrary().articles.length >= 6);
});
test("roadmaps reject missing references, drafts, cycles, forward edges and duplicate IDs", () => {
  const base = {
    ...document,
    kind: "roadmaps",
    slug: "map",
    stages: [
      {
        id: "start",
        title: "起點",
        items: [{ id: "one", type: "article", ref: "hello", requires: [] }],
      },
    ],
  };
  const library = { articles: [document], blocks: [], roadmaps: [base] };
  assert.deepEqual(validateLibrary(library), []);
  for (const items of [
    [{ id: "one", type: "article", ref: "missing" }],
    [{ id: "one", type: "article", ref: "hello", requires: ["one"] }],
    [
      { id: "one", type: "article", ref: "hello", requires: ["two"] },
      { id: "two", type: "article", ref: "hello" },
    ],
    [
      { id: "one", type: "article", ref: "hello" },
      { id: "one", type: "article", ref: "hello" },
    ],
  ])
    assert.ok(
      validateLibrary({
        ...library,
        roadmaps: [
          { ...base, stages: [{ id: "start", title: "起點", items }] },
        ],
      }).length,
    );
  assert.ok(
    validateLibrary({
      ...library,
      articles: [{ ...document, status: "draft" }],
    }).some((e) => e.includes("草稿")),
  );
});
test("atomic save and optimistic locking protect files from stale editors", (t) => {
  const { root, raw } = fixture(t);
  const next = serializeDocument({ ...document, title: "新標題" });
  const result = saveDocument({
    root,
    kind: "articles",
    slug: "hello",
    raw: next,
    revision: revisionFor(raw),
  });
  assert.equal(result.title, "新標題");
  assert.equal(
    fs.readFileSync(path.join(root, "articles/hello.md"), "utf8"),
    next,
  );
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "hello",
        raw,
        revision: revisionFor(raw),
      }),
    { status: 409 },
  );
  assert.equal(
    fs.readFileSync(path.join(root, "articles/hello.md"), "utf8"),
    next,
  );
});
test("invalid saves leave official files untouched and cannot traverse directories", (t) => {
  const { root, raw } = fixture(t);
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "../escape",
        raw,
        revision: null,
      }),
    { status: 400 },
  );
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "hello",
        raw: "---\ntitle: [broken\n---\ntext",
        revision: revisionFor(raw),
      }),
    { status: 400 },
  );
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "hello",
        raw: serializeDocument({ ...document, status: "oops" }),
        revision: revisionFor(raw),
      }),
    { status: 422 },
  );
  assert.equal(
    fs.readFileSync(path.join(root, "articles/hello.md"), "utf8"),
    raw,
  );
  assert.deepEqual(fs.readdirSync(path.join(root, "articles")), ["hello.md"]);
});
test("creating a draft cannot overwrite an existing article and draft content stays separate", (t) => {
  const { root, raw } = fixture(t);
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "hello",
        raw,
        revision: null,
      }),
    { status: 409 },
  );
  saveDocument({
    root,
    kind: "articles",
    slug: "draft-post",
    raw: serializeDocument({ ...document, status: "draft" }),
    revision: null,
  });
  const library = readLibrary(root);
  assert.equal(
    library.articles.filter((d) => d.status === "published").length,
    1,
  );
  assert.equal(
    library.articles.find((d) => d.slug === "draft-post").status,
    "draft",
  );
});
test("symbolic links cannot redirect a write outside the content directory", (t) => {
  const { root, raw } = fixture(t);
  fs.symlinkSync(
    path.join(root, "articles/hello.md"),
    path.join(root, "articles/linked.md"),
  );
  assert.throws(
    () =>
      saveDocument({
        root,
        kind: "articles",
        slug: "linked",
        raw,
        revision: revisionFor(raw),
      }),
    { status: 400 },
  );
});
test("public projection strips raw frontmatter, source paths and editorial comments", () => {
  const doc = publicDocument({
    ...document,
    raw: "private metadata",
    source: "learn/private.md",
    body: "## Text\n\n<!-- source: sources/course.txt#L1-L5 -->\n```js\nconst x = 1;\n```",
  });
  assert.equal(doc.source, undefined);
  assert.equal(doc.raw, undefined);
  assert.ok(!doc.body.includes("sources/"));
  assert.ok(doc.body.includes("const x = 1;"));
});
test("malformed roadmap arrays and impossible dates return useful validation errors", () => {
  for (const stages of [
    [null],
    [{ id: "phase", title: "Phase", items: [null] }],
  ]) {
    assert.ok(
      validateLibrary({
        articles: [document],
        blocks: [],
        roadmaps: [{ ...document, slug: "map", stages }],
      }).length,
    );
  }
  assert.ok(
    validateLibrary({
      articles: [{ ...document, date: "2026-02-30" }],
      blocks: [],
      roadmaps: [],
    }).length,
  );
});
test("image uploads use content-derived names, reject HTML/SVG and deduplicate", (t) => {
  const { root } = fixture(t);
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=",
    "base64",
  );
  const result = saveImage(png, root);
  assert.ok(result.url.match(/^\/uploads\/[a-f0-9]+\.png$/));
  assert.deepEqual(saveImage(png, root), result);
  assert.deepEqual(fs.readFileSync(path.join(root, result.url)), png);
  assert.equal(fs.readdirSync(path.join(root, "uploads")).length, 1);
  assert.throws(
    () => saveImage(Buffer.from('<svg onload="alert(1)"/>'), root),
    { status: 422 },
  );
  assert.throws(() => saveImage(Buffer.alloc(8 * 1024 * 1024 + 1), root), {
    status: 422,
  });
});

test("local editor rejects foreign hosts and origins before accepting writes", async (t) => {
  const { root, raw } = fixture(t);
  const server = createStudioServer({ root, publicRoot: root });
  const request = (origin, host = "127.0.0.1:3211") =>
    new Promise((resolve) => {
      const req = Readable.from([
        Buffer.from(
          JSON.stringify({
            kind: "articles",
            slug: "hello",
            raw,
            revision: revisionFor(raw),
          }),
        ),
      ]);
      Object.assign(req, {
        method: "POST",
        url: "/save",
        headers: { host, origin, "content-type": "application/json" },
      });
      let status;
      server.emit("request", req, {
        writeHead(code) {
          status = code;
        },
        end(body) {
          resolve({ status, body: JSON.parse(body) });
        },
      });
    });
  assert.equal((await request("https://foreign.example")).status, 403);
  assert.equal(
    (await request("http://127.0.0.1:3001", "foreign.example:3211")).status,
    403,
  );
  assert.equal((await request(undefined)).status, 403);
  assert.equal((await request("http://127.0.0.1:3001")).status, 200);
});

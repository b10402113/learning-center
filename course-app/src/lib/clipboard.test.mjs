import assert from "node:assert/strict";
import test from "node:test";
import { articleForClipboard } from "./clipboard.mjs";

const BASE = "/learning-center/nodes/demo/node-a/";
const ORIGIN = "https://example.com/learn/";

test("keeps the H1 title and drops the body's own heading", () => {
  assert.equal(
    articleForClipboard("# Original H1\n\nBody text.\n", {
      title: "Chosen Title",
    }),
    "# Chosen Title\n\nBody text."
  );
});

test("resolves step-relative image links to absolute URLs", () => {
  assert.equal(
    articleForClipboard(
      "# T\n\n![第 1 段配圖](./step-a-assets/image-1.webp)\n",
      { title: "T", assetBase: BASE, origin: ORIGIN }
    ),
    `# T\n\n![第 1 段配圖](https://example.com${BASE}step-a-assets/image-1.webp)`
  );
});

test("leaves absolute images alone and adds a title when missing", () => {
  assert.equal(
    articleForClipboard("![x](https://cdn.test/a.png)", {
      title: "T",
      assetBase: BASE,
      origin: ORIGIN,
    }),
    "# T\n\n![x](https://cdn.test/a.png)"
  );
});

test("returns the body alone when there is no title", () => {
  assert.equal(articleForClipboard("## Section\n\nText."), "## Section\n\nText.");
});

test("handles empty input", () => {
  assert.equal(articleForClipboard(undefined, { title: "T" }), "# T");
});

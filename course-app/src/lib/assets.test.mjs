import assert from "node:assert/strict";
import test from "node:test";
import { resolveSrc } from "./assets.mjs";

test("resolves a step-relative image against the public asset base", () => {
  assert.equal(
    resolveSrc(
      "./step-one-assets/image-1.webp",
      "/learning-center/nodes/demo/node-a/"
    ),
    "http://localhost/learning-center/nodes/demo/node-a/step-one-assets/image-1.webp"
  );
});

test("leaves absolute, root-relative, anchor, and external URLs alone", () => {
  const base = "/learning-center/nodes/demo/node-a/";
  assert.equal(resolveSrc("https://example.com/a.png", base), "https://example.com/a.png");
  assert.equal(resolveSrc("/assets/a.png", base), "/assets/a.png");
  assert.equal(resolveSrc("#section", base), "#section");
  assert.equal(resolveSrc("data:image/png;base64,abc", base), "data:image/png;base64,abc");
});

test("returns the source unchanged when there is no base", () => {
  assert.equal(resolveSrc("./a.png", ""), "./a.png");
});

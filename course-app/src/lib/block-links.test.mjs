import assert from "node:assert/strict";
import test from "node:test";
import { replaceBlockLinks } from "./block-links.mjs";
import { pathForBlock } from "./route.mjs";

test("turns a wiki link into an in-app block link", () => {
  assert.equal(
    replaceBlockLinks("詳見 [[agent]]。", "demo"),
    `詳見 [agent](${pathForBlock("demo", "agent")})。`
  );
});

test("keeps the display label of a piped wiki link", () => {
  assert.equal(
    replaceBlockLinks("[[agent|Agent（代理）]]", "demo"),
    `[Agent（代理）](${pathForBlock("demo", "agent")})`
  );
});

test("leaves an unknown wiki link literal", () => {
  assert.equal(
    replaceBlockLinks("[[not-a-block]]", "demo", ["agent"]),
    "[[not-a-block]]"
  );
});

test("leaves source wiki links untouched", () => {
  const link = "[[sources/demo/course/source.txt#L1-L10]]";
  assert.equal(replaceBlockLinks(link, "demo"), link);
});

test("leaves wiki links inside code fences and inline code untouched", () => {
  const markdown = [
    "See [[agent]].",
    "",
    "```js",
    "const label = '[[tool]]';",
    "```",
    "",
    "Inline `[[workflow]]` stays literal.",
  ].join("\n");
  assert.equal(
    replaceBlockLinks(markdown, "demo"),
    [
      `See [agent](${pathForBlock("demo", "agent")}).`,
      "",
      "```js",
      "const label = '[[tool]]';",
      "```",
      "",
      "Inline `[[workflow]]` stays literal.",
    ].join("\n")
  );
});

test("returns the original text when there is no subject", () => {
  assert.equal(replaceBlockLinks("[[agent]]", null), "[[agent]]");
});

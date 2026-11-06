import assert from "node:assert/strict";
import test from "node:test";
import {
  buildComposeSources,
  composeSourcePayload,
  condenseCode,
  inferSourceLanguage,
  inferSourceType,
  materialSources,
  missingPlaceholders,
  normalizeSourceType,
  restoreComposeSources,
  salvageComposeSources,
} from "./source-material.mjs";

test("infers code sources and their language from the extension", () => {
  assert.equal(inferSourceType("sources/test/loop.mjs"), "code");
  assert.equal(inferSourceLanguage("sources/test/loop.mjs"), "javascript");
  assert.equal(inferSourceType("sources/test/notes.txt"), "article");
  assert.equal(inferSourceLanguage("sources/test/notes.txt"), "");
});

test("normalizes source types and rejects unknown values", () => {
  assert.equal(normalizeSourceType(undefined), "article");
  assert.equal(normalizeSourceType(" Code "), "code");
  assert.equal(normalizeSourceType("formula"), "formula");
  assert.throws(() => normalizeSourceType("snippet"), /must be one of/);
});

test("assigns placeholders only to code and formula sources", () => {
  const sources = buildComposeSources([
    { path: "sources/test/notes.txt", locator: "#L1-L2", type: "article", text: "Prose." },
    {
      path: "sources/test/loop.mjs",
      locator: "#L3-L4",
      type: "code",
      language: "javascript",
      text: "const a = 1;",
    },
    { path: "sources/test/math.txt", locator: "#L5-L5", type: "formula", text: "a^2 + b^2" },
  ]);

  assert.equal(sources[0].placeholder, undefined);
  assert.equal(sources[1].placeholder, "{{ARTICLE_CODE_2}}");
  assert.equal(sources[1].language, "javascript");
  assert.equal(sources[2].placeholder, "{{ARTICLE_FORMULA_3}}");

  const payload = composeSourcePayload(sources);
  assert.equal(payload[1].placeholder, "{{ARTICLE_CODE_2}}");
  assert.equal(payload[2].placeholder, "{{ARTICLE_FORMULA_3}}");
});

test("code sources need a path and locator for provenance", () => {
  assert.throws(
    () =>
      buildComposeSources([
        { path: "", locator: "#L1-L2", type: "code", text: "const a = 1;" },
      ]),
    /needs both path and locator/,
  );
});

test("restores code verbatim with a fence longer than any backtick run", () => {
  const sources = buildComposeSources([
    {
      path: "sources/test/loop.mjs",
      locator: "#L3-L4",
      type: "code",
      language: "javascript",
      text: "const fence = ```;",
    },
  ]);
  const markdown = "# Title\n\nBefore.\n\n{{ARTICLE_CODE_1}}\n\nAfter.\n";
  const restored = restoreComposeSources(markdown, sources);

  assert.match(restored, /<!-- source: sources\/test\/loop\.mjs#L3-L4 -->/);
  assert.match(restored, /````javascript\nconst fence = ```;\n````/);
  assert.match(restored, /Before\.\n\n<!-- source:/);
  assert.match(restored, /```;\n````\n\nAfter\./);
});

test("condenses long code to a head, an ellipsis, and a tail", () => {
  const text = Array.from({ length: 40 }, (_, index) => `line ${index + 1};`).join("\n");
  const short = condenseCode(text, 12);
  const lines = short.split("\n");

  assert.equal(lines.length, 12);
  assert.equal(lines[0], "line 1;");
  assert.equal(lines[7], "...");
  assert.equal(lines.at(-1), "line 40;");
  assert.doesNotMatch(short, /line 20;/);
});

test("leaves code at or under the limit untouched", () => {
  const text = "const a = 1;\nconst b = 2;";
  assert.equal(condenseCode(text, 24), text);
});

test("restores a formula placeholder as display math", () => {
  const sources = buildComposeSources([
    { path: "sources/test/math.txt", locator: "#L5-L5", type: "formula", text: "a^2 + b^2" },
  ]);
  const restored = restoreComposeSources("# Title\n\n{{ARTICLE_FORMULA_1}}\n", sources);
  assert.match(restored, /\$\$\na\^2 \+ b\^2\n\$\$/);
});

test("rejects a missing or duplicated placeholder", () => {
  const sources = buildComposeSources([
    { path: "sources/test/loop.mjs", locator: "#L1-L2", type: "code", text: "const a = 1;" },
  ]);
  assert.throws(() => restoreComposeSources("# Title\n\nNo token.\n", sources), /did not use/);
  assert.throws(
    () => restoreComposeSources("# Title\n\n{{ARTICLE_CODE_1}}\n\n{{ARTICLE_CODE_1}}\n", sources),
    /more than once/,
  );
  assert.throws(
    () => restoreComposeSources("# Title\n\n```\n{{ARTICLE_CODE_1}}\n```\n", sources),
    /inside a code fence/,
  );
});

test("salvages a draft by restoring used placeholders and reporting the missing ones", () => {
  const sources = buildComposeSources([
    { path: "sources/test/a.mjs", locator: "#L1-L1", type: "code", text: "const a = 1;" },
    { path: "sources/test/b.mjs", locator: "#L2-L2", type: "code", text: "const b = 2;" },
  ]);
  const draft = "# Title\n\nBefore.\n\n{{ARTICLE_CODE_2}}\n\nAfter.\n";
  const { text, missing } = salvageComposeSources(draft, sources);

  assert.match(text, /<!-- source: sources\/test\/b\.mjs#L2-L2 -->/);
  assert.match(text, /```javascript\nconst b = 2;\n```/);
  assert.doesNotMatch(text, /\{\{ARTICLE_CODE/);
  assert.equal(missing.length, 1);
  assert.equal(missing[0].placeholder, "{{ARTICLE_CODE_1}}");
  assert.equal(missing[0].path, "sources/test/a.mjs");
  assert.deepEqual(
    missingPlaceholders(draft, sources).map((source) => source.placeholder),
    ["{{ARTICLE_CODE_1}}"],
  );
});

test("salvage strips duplicated and inline placeholder tokens", () => {
  const sources = buildComposeSources([
    { path: "sources/test/a.mjs", locator: "#L1-L1", type: "code", text: "const a = 1;" },
  ]);
  const draft = "# Title\n\nInline {{ARTICLE_CODE_1}} stays.\n\n{{ARTICLE_CODE_1}}\n\n{{ARTICLE_CODE_1}}\n";
  const { text, missing } = salvageComposeSources(draft, sources);

  assert.equal(missing.length, 0);
  assert.doesNotMatch(text, /\{\{ARTICLE_CODE/);
  assert.match(text, /Inline stays\./);
});

test("leaves an article with no placeholders unchanged", () => {
  const sources = buildComposeSources([
    { path: "sources/test/notes.txt", locator: "#L1-L2", type: "article", text: "Prose." },
  ]);
  const markdown = "# Title\n\nProse.\n";
  assert.equal(restoreComposeSources(markdown, sources), markdown);
});

test("materialSources prefers course and supplement arrays", () => {
  const sources = materialSources({
    course: [{ path: "sources/test/a.txt", locator: "#L1-L2", text: "a" }],
    supplement: [{ path: "sources/test/b.txt", locator: "#L3-L4", text: "b" }],
    sources: [{ path: "sources/test/legacy.txt", locator: "#L5-L6", text: "c" }],
  });
  assert.deepEqual(sources.map((source) => source.role), ["course", "supplement"]);
  assert.deepEqual(sources.map((source) => source.path), ["sources/test/a.txt", "sources/test/b.txt"]);
});

test("materialSources falls back to the legacy sources array", () => {
  const sources = materialSources({ sources: [{ path: "sources/test/a.txt", locator: "#L1-L2", text: "a" }] });
  assert.equal(sources.length, 1);
  assert.equal(sources[0].role, undefined);
});

test("compose payload carries the source role", () => {
  const prepared = buildComposeSources([
    { path: "sources/test/a.txt", locator: "#L1-L2", type: "article", role: "course", text: "a" },
    { path: "sources/test/b.txt", locator: "#L3-L4", type: "article", role: "supplement", text: "b" },
  ]);
  assert.deepEqual(composeSourcePayload(prepared).map((source) => source.role), ["course", "supplement"]);
});

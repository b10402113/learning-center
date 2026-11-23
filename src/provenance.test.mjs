import assert from "node:assert/strict";
import test from "node:test";
import { addDerivedProvenance, isProvenanceLine, unprovenancedBlocks } from "./provenance.mjs";

test("a bare fenced block has no provenance", () => {
  const body = "# T\n\n說明：\n\n```bash\nnpm run reset\n```\n";
  assert.deepEqual(unprovenancedBlocks(body), [{ line: 5, lang: "bash" }]);
});

test("a source or derived comment above the fence satisfies provenance", () => {
  const sourced = "# T\n\n<!-- source: sources/a/b/c.txt#L1-L2 -->\n\n```ts\nconst a = 1;\n```\n";
  const derived = "# T\n\n<!-- derived -->\n\n```bash\nnpm test\n```\n";
  assert.deepEqual(unprovenancedBlocks(sourced), []);
  assert.deepEqual(unprovenancedBlocks(derived), []);
});

test("blank lines between the comment and the fence are still accepted", () => {
  const body = "<!-- derived -->\n\n\n```ts\nconst a = 1;\n```\n";
  assert.deepEqual(unprovenancedBlocks(body), []);
});

test("a quiz fence needs no provenance", () => {
  const body = '```quiz\n{"question":"q?"}\n```\n';
  assert.deepEqual(unprovenancedBlocks(body), []);
});

test("a source comment with a path containing spaces is provenance", () => {
  assert.equal(isProvenanceLine("<!-- source: sources/a/My Notes.txt#L3-L9 -->"), true);
});

test("a source comment without a locator is not provenance", () => {
  assert.equal(isProvenanceLine("<!-- source: sources/a/notes.txt -->"), false);
  assert.deepEqual(unprovenancedBlocks("<!-- source: sources/a/notes.txt -->\n\n```ts\nx\n```\n"), [
    { line: 3, lang: "ts" },
  ]);
});

test("addDerivedProvenance inserts one comment above each bare fence", () => {
  const body = "# T\n\n```bash\na\n```\n\n中間。\n\n```ts\nb\n```\n";
  const { text, added } = addDerivedProvenance(body);
  assert.equal(added, 2);
  assert.equal(
    text,
    "# T\n\n<!-- derived -->\n\n```bash\na\n```\n\n中間。\n\n<!-- derived -->\n\n```ts\nb\n```\n",
  );
  assert.deepEqual(unprovenancedBlocks(text), []);
});

test("addDerivedProvenance leaves an already-cited article untouched", () => {
  const body = "<!-- source: sources/a/b.txt#L1-L1 -->\n\n```ts\nx\n```\n";
  assert.deepEqual(addDerivedProvenance(body), { text: body, added: 0 });
});

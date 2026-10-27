import assert from "node:assert/strict";
import test from "node:test";
import { rehypeHighlightPlugin } from "./highlight.mjs";

function codeTree(className, value) {
  return {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: ["language-" + className] },
            children: [{ type: "text", value }],
          },
        ],
      },
    ],
  };
}

function transform(tree) {
  const messages = [];
  const file = { message: (m) => messages.push(m) };
  rehypeHighlightPlugin[0](rehypeHighlightPlugin[1])(tree, file);
  return { tree, messages };
}

function codeOf(tree) {
  return tree.children[0].children[0];
}

function classesOf(tree) {
  return codeOf(tree).properties.className;
}

function tokenTypes(tree) {
  const found = new Set();
  const walk = (node) => {
    if (node.tagName === "span") {
      for (const c of node.properties?.className || []) found.add(c);
    }
    for (const child of node.children || []) walk(child);
  };
  walk(codeOf(tree));
  return found;
}

test("highlights a TypeScript fence with hljs token classes", () => {
  const { tree, messages } = transform(
    codeTree("ts", "const answer: number = 42;")
  );
  assert.deepEqual(messages, []);
  assert.ok(classesOf(tree).includes("hljs"));
  const tokens = tokenTypes(tree);
  assert.ok(tokens.has("hljs-keyword"));
  assert.ok(tokens.has("hljs-number"));
});

test("highlights a Python fence", () => {
  const { tree, messages } = transform(
    codeTree("python", 'def run(name: str) -> str:\n    return f"hi {name}"')
  );
  assert.deepEqual(messages, []);
  assert.ok(tokenTypes(tree).has("hljs-keyword"));
});

test("leaves a legacy quiz fence untouched", () => {
  const source = '{"question":"Q?","options":["a","b"],"answer":1}';
  const { tree, messages } = transform(codeTree("quiz", source));
  assert.deepEqual(messages, []);
  assert.deepEqual(classesOf(tree), ["language-quiz"]);
  assert.deepEqual(codeOf(tree).children, [{ type: "text", value: source }]);
});

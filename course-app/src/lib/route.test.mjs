import assert from "node:assert/strict";
import test from "node:test";
import {
  indexRoute,
  parsePath,
  pathFor,
  pathForBlock,
} from "./route.mjs";

const BASE = "/learning-center";

test("parses a step route", () => {
  assert.deepEqual(
    parsePath("/learning-center/agent-harness/what-a-harness-is/harness-is-the-product", BASE),
    {
      subjectId: "agent-harness",
      nodeId: "what-a-harness-is",
      stepId: "harness-is-the-product",
    }
  );
});

test("parses a node route without a step", () => {
  assert.deepEqual(parsePath("/learning-center/agent-harness/what-a-harness-is", BASE), {
    subjectId: "agent-harness",
    nodeId: "what-a-harness-is",
    stepId: null,
  });
});

test("parses a subject-only route", () => {
  assert.deepEqual(parsePath("/learning-center/agent-harness", BASE), {
    subjectId: "agent-harness",
    nodeId: null,
    stepId: null,
  });
});

test("treats the base path and root as the subject index", () => {
  assert.deepEqual(parsePath("/", BASE), indexRoute());
  assert.deepEqual(parsePath("/learning-center", BASE), indexRoute());
  assert.deepEqual(parsePath("/learning-center/", BASE), indexRoute());
});

test("works without a base path too", () => {
  assert.deepEqual(parsePath("/agent-harness/node/step", ""), {
    subjectId: "agent-harness",
    nodeId: "node",
    stepId: "step",
  });
});

test("tolerates a trailing slash and decodes ids", () => {
  assert.deepEqual(parsePath("/learning-center/a%20b/node%2Fone/", BASE), {
    subjectId: "a b",
    nodeId: "node/one",
    stepId: null,
  });
});

test("rejects unrelated paths", () => {
  assert.equal(parsePath("/learning-center/a/b/c/d", BASE), null);
});

test("parses one block's detail page", () => {
  assert.deepEqual(parsePath("/learning-center/demo/blocks/agent", BASE), {
    subjectId: "demo",
    nodeId: null,
    stepId: null,
    blockId: "agent",
    blockRoute: true,
  });
});

test("builds a block path", () => {
  assert.equal(
    pathForBlock("demo", "agent", BASE),
    "/learning-center/demo/blocks/agent"
  );
});

test("builds encoded paths with and without a step", () => {
  assert.equal(
    pathFor("agent-harness", "what-a-harness-is", "demo-vs-production", BASE),
    "/learning-center/agent-harness/what-a-harness-is/demo-vs-production"
  );
  assert.equal(
    pathFor("agent-harness", "what-a-harness-is", null, BASE),
    "/learning-center/agent-harness/what-a-harness-is"
  );
  assert.equal(pathFor("agent-harness", null, null, BASE), "/learning-center/agent-harness");
  assert.equal(pathFor(null, null, null, BASE), "/learning-center/");
});

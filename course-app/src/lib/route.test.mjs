import assert from "node:assert/strict";
import test from "node:test";
import { hashFor, indexRoute, parseHash } from "./route.mjs";

test("parses a step route", () => {
  assert.deepEqual(
    parseHash("#/agent-harness/what-a-harness-is/harness-is-the-product"),
    {
      subjectId: "agent-harness",
      nodeId: "what-a-harness-is",
      stepId: "harness-is-the-product",
    }
  );
});

test("parses a node route without a step", () => {
  assert.deepEqual(parseHash("#/agent-harness/what-a-harness-is"), {
    subjectId: "agent-harness",
    nodeId: "what-a-harness-is",
    stepId: null,
  });
});

test("parses a subject-only route", () => {
  assert.deepEqual(parseHash("#/agent-harness"), {
    subjectId: "agent-harness",
    nodeId: null,
    stepId: null,
  });
});

test("treats empty hashes as the subject index", () => {
  assert.deepEqual(parseHash(""), indexRoute());
  assert.deepEqual(parseHash("#"), indexRoute());
  assert.deepEqual(parseHash("#/"), indexRoute());
});

test("tolerates a trailing slash and decodes ids", () => {
  assert.deepEqual(parseHash("#/a%20b/node%2Fone/"), {
    subjectId: "a b",
    nodeId: "node/one",
    stepId: null,
  });
});

test("rejects unrelated hashes", () => {
  assert.equal(parseHash("#/a/b/c/d"), null);
  assert.equal(parseHash("#agent-harness"), null);
});

test("builds encoded routes with and without a step", () => {
  assert.equal(
    hashFor("agent-harness", "what-a-harness-is", "demo-vs-production"),
    "#/agent-harness/what-a-harness-is/demo-vs-production"
  );
  assert.equal(
    hashFor("agent-harness", "what-a-harness-is"),
    "#/agent-harness/what-a-harness-is"
  );
  assert.equal(hashFor("agent-harness"), "#/agent-harness");
  assert.equal(hashFor(null, null), "#/");
});

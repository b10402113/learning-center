import assert from "node:assert/strict";
import test from "node:test";
import { parseQuiz } from "./quiz.mjs";

const VALID = JSON.stringify({
  question: "What is a harness?",
  options: ["A prompt", "Infrastructure around the model", "A model"],
  answer: 1,
  explain: "The harness owns memory, tools, and durability.",
});

test("parses a valid quiz block", () => {
  assert.deepEqual(parseQuiz(VALID), {
    question: "What is a harness?",
    options: ["A prompt", "Infrastructure around the model", "A model"],
    answer: 1,
    explain: "The harness owns memory, tools, and durability.",
  });
});

test("rejects invalid JSON", () => {
  assert.equal(parseQuiz("{not json"), null);
});

test("rejects a bad question, options, answer, or explanation", () => {
  const cases = [
    { ...JSON.parse(VALID), question: " " },
    { ...JSON.parse(VALID), options: ["only one"] },
    { ...JSON.parse(VALID), options: ["1", "2", "3", "4", "5", "6"] },
    { ...JSON.parse(VALID), answer: 3 },
    { ...JSON.parse(VALID), answer: "1" },
    { ...JSON.parse(VALID), explain: "" },
  ];
  for (const item of cases) {
    assert.equal(parseQuiz(JSON.stringify(item)), null, JSON.stringify(item));
  }
});

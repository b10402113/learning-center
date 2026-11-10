import assert from "node:assert/strict";
import test from "node:test";
import { parseQuiz, shuffleQuiz } from "./quiz.mjs";

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

test("shuffleQuiz keeps the correct option and is deterministic", () => {
  const quiz = {
    question: "Why keep state outside the process?",
    options: ["Because crash wipes memory", "Because models are slow", "Because tools are few"],
    answer: 0,
    explain: "Crash loses in-memory state.",
  };
  const first = shuffleQuiz(quiz);
  const second = shuffleQuiz(quiz);

  assert.deepEqual(first, second);
  assert.equal(first.options[first.answer], quiz.options[quiz.answer]);
  assert.deepEqual([...first.options].sort(), [...quiz.options].sort());
});

test("shuffleQuiz uses a supplied seed so a refresh can re-randomize", () => {
  const quiz = {
    question: "Why keep state outside the process?",
    options: ["Because crash wipes memory", "Because models are slow", "Because tools are few"],
    answer: 0,
    explain: "Crash loses in-memory state.",
  };

  assert.deepEqual(shuffleQuiz(quiz, 7), shuffleQuiz(quiz, 7));
  assert.equal(shuffleQuiz(quiz, 7).options[shuffleQuiz(quiz, 7).answer], quiz.options[quiz.answer]);
  assert.equal(shuffleQuiz(quiz, 8).options[shuffleQuiz(quiz, 8).answer], quiz.options[quiz.answer]);
});

test("shuffleQuiz scatters answers that all start on the first option", () => {
  const questions = [
    "Alpha beta gamma delta",
    "One two three four",
    "Red green blue yellow",
    "North south east west",
    "Spring summer autumn winter",
    "Mercury venus earth mars",
  ].map((question, index) => ({
    question,
    options: ["first", "second", "third", "fourth"],
    answer: 0,
    explain: `Explanation ${index}.`,
  }));

  const positions = questions.map((quiz) => shuffleQuiz(quiz).answer);
  assert.ok(new Set(positions).size > 1, `positions: ${positions.join(",")}`);
  assert.ok(positions.some((position) => position !== 0));
});

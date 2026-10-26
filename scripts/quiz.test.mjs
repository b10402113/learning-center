import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { prepare, status, write } from "./quiz.mjs";

function writeFile(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "quiz-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  writeFile(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: written
goal: "Test quizzes."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources: []
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

One thing.
`,
  );
  writeFile(
    root,
    "learn/test/nodes/n1/s1.md",
    `# Step One

## 狀態

這篇文章說明狀態必須留在 process 外面，因為 crash 之後記憶體裡的東西會消失。把 messages 寫進 event log，重啟後才能接回原本的進度。

## 邊界

工具執行屬於 harness，模型只負責提出請求。工具如果直接產生副作用，重試就可能重複扣款。
`,
  );

  return root;
}

function candidate(questions) {
  return JSON.stringify({ "quiz-generated": true, questions }, null, 2);
}

function questions() {
  return [
    {
      question: "為什麼狀態不能只放在 process 記憶體？",
      options: ["因為 crash 後會消失", "因為模型太慢", "因為工具太少"],
      answer: 0,
      explain: "crash 之後記憶體裡的狀態會消失。",
    },
    {
      question: "工具執行應該屬於哪一層？",
      options: ["模型", "harness", "使用者"],
      answer: 1,
      explain: "文章說工具執行屬於 harness。",
    },
    {
      question: "工具直接產生副作用會有什麼風險？",
      options: ["重試可能重複扣款", "模型會變快", "context 會變短"],
      answer: 0,
      explain: "重試時可能把同一個副作用再做一次。",
    },
  ];
}

function options(root) {
  return { root, subject: "test", node: "n1", step: "s1" };
}

test("prepare reports the article length and question ceiling", (t) => {
  const root = fixture(t);
  const result = prepare(options(root));

  assert.equal(result.steps.length, 1);
  assert.deepEqual(result.skipped, []);
  assert.equal(result.steps[0].id, "s1");
  assert.equal(result.steps[0].minQuestions, 3);
  assert.equal(result.steps[0].maxQuestions, 3);
  assert.ok(result.steps[0].characters > 0);
  assert.match(result.steps[0].article, /learn\/test\/nodes\/n1\/s1\.md$/);
});

test("prepare skips a step whose article is missing", (t) => {
  const root = fixture(t);
  rmSync(join(root, "learn/test/nodes/n1/s1.md"));

  const result = prepare(options(root));
  assert.deepEqual(result.steps, []);
  assert.equal(result.skipped[0].reason, "article-missing");
});

test("write rejects fewer than three questions and leaves no file", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(input, candidate(questions().slice(0, 2)));

  const result = write({ ...options(root), input });
  assert.equal(result.status, "failed");
  assert.ok(result.errors.some((error) => error.checkId === "quiz-file-count"));
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1.quiz.json")), false);
});

test("write rejects a candidate marked as not generated", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(
    input,
    JSON.stringify({ "quiz-generated": false, questions: questions() }),
  );

  const result = write({ ...options(root), input });
  assert.equal(result.status, "failed");
  assert.ok(result.errors.some((error) => error.checkId === "quiz-file-marker"));
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1.quiz.json")), false);
});

test("write accepts a valid candidate and status reports it", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(input, candidate(questions()));

  const result = write({ ...options(root), input });
  assert.equal(result.status, "written");
  assert.equal(result.questions, 3);

  const file = join(root, "learn/test/nodes/n1/s1.quiz.json");
  const payload = JSON.parse(readFileSync(file, "utf8"));
  assert.equal(payload["quiz-generated"], true);
  assert.equal(payload.questions.length, 3);

  const row = status(options(root)).steps[0];
  assert.equal(row.questions, 3);
  assert.equal(row.generated, true);
});

test("write refuses to overwrite without force", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(input, candidate(questions()));

  assert.equal(write({ ...options(root), input }).status, "written");
  const blocked = write({ ...options(root), input });
  assert.equal(blocked.status, "failed");
  assert.equal(blocked.errors[0].checkId, "quiz-exists");

  const forced = write({ ...options(root), input, force: true });
  assert.equal(forced.status, "written");
});

test("prepare skips an existing quiz unless forced", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(input, candidate(questions()));
  write({ ...options(root), input });

  assert.equal(prepare(options(root)).skipped[0].reason, "quiz-exists");
  assert.equal(prepare({ ...options(root), force: true }).steps.length, 1);
});

test("write accepts a fenced JSON reply", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  writeFileSync(input, `\`\`\`json\n${candidate(questions())}\n\`\`\``);

  const result = write({ ...options(root), input });
  assert.equal(result.status, "written");
});

test("write strips inline backticks because quiz cards render plain text", (t) => {
  const root = fixture(t);
  const input = join(root, "candidate.json");
  const marked = questions();
  marked[0] = {
    ...marked[0],
    question: "為什麽 `messages` 不能只放在記憶體？",
    options: ["因為 `crash` 後會消失", "因為模型太慢", "因為工具太少"],
    explain: "`crash` 之後記憶體裡的狀態會消失。",
  };
  writeFileSync(input, candidate(marked));

  assert.equal(write({ ...options(root), input }).status, "written");
  const payload = JSON.parse(readFileSync(join(root, "learn/test/nodes/n1/s1.quiz.json"), "utf8"));
  assert.equal(payload.questions[0].question.includes("`"), false);
  assert.equal(payload.questions[0].options[0].includes("`"), false);
  assert.equal(payload.questions[0].explain.includes("`"), false);
  assert.equal(payload.questions[0].question.includes("為什麽"), false);
  assert.equal(payload.questions[0].question.includes("為什麼"), true);
});

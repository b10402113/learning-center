import { join } from "node:path";

export const QUIZ_MIN_QUESTIONS = 3;
export const QUIZ_MAX_QUESTIONS = 8;
export const QUIZ_MIN_OPTIONS = 2;
export const QUIZ_MAX_OPTIONS = 5;
export const QUIZ_CHARS_PER_QUESTION = 250;
export const QUIZ_OPTION_SLACK_CHARS = 6;
export const QUIZ_OPTION_SLACK_RATIO = 0.5;

export function quizFileRel(subject, nodeId, stepId) {
  return `learn/${subject}/nodes/${nodeId}/${stepId}.quiz.json`;
}

export function quizFilePath(root, subject, nodeId, stepId) {
  return join(root, "learn", subject, "nodes", nodeId, `${stepId}.quiz.json`);
}

export function maxQuestionsFor(characters) {
  const count = Number(characters);
  if (!Number.isFinite(count) || count <= 0) return QUIZ_MIN_QUESTIONS;
  return Math.min(
    QUIZ_MAX_QUESTIONS,
    Math.max(QUIZ_MIN_QUESTIONS, Math.round(count / QUIZ_CHARS_PER_QUESTION)),
  );
}

function optionLengths(question) {
  if (!question || !Array.isArray(question.options)) return null;
  if (!question.options.every((option) => typeof option === "string")) return null;
  if (
    !Number.isInteger(question.answer) ||
    question.answer < 0 ||
    question.answer >= question.options.length
  ) {
    return null;
  }
  return question.options.map((option) => option.length);
}

function optionShapeErrors(question, index) {
  const lengths = optionLengths(question);
  if (!lengths || lengths.length === 0) return [];

  const shortest = Math.min(...lengths);
  const longest = Math.max(...lengths);
  const slack = Math.max(
    QUIZ_OPTION_SLACK_CHARS,
    Math.round(shortest * QUIZ_OPTION_SLACK_RATIO),
  );
  if (longest <= shortest + slack) return [];

  return [
    {
      checkId: "quiz-option-length",
      message: `questions[${index}].options run ${shortest}-${longest} characters; keep every option within ${slack} characters of the shortest so length never points at the correct answer`,
    },
  ];
}

function answerSpreadErrors(questions) {
  const lengths = questions.map(optionLengths);
  if (lengths.some((item) => item === null)) return [];

  const positions = Math.min(...lengths.map((item) => item.length));
  const counts = new Map();
  for (const question of questions) {
    counts.set(question.answer, (counts.get(question.answer) ?? 0) + 1);
  }

  const errors = [];
  const perPosition = Math.ceil(questions.length / positions);
  const needed = Math.min(questions.length, positions);
  if (counts.size < needed) {
    errors.push({
      checkId: "quiz-answer-spread",
      message: `correct answers use only ${counts.size} distinct position(s) across ${questions.length} questions; rotate them over at least ${needed} positions`,
    });
  }
  for (const [position, count] of [...counts].sort((a, b) => a[0] - b[0])) {
    if (count <= perPosition) continue;
    errors.push({
      checkId: "quiz-answer-spread",
      message: `correct answers sit at position ${position} ${count} times; with ${questions.length} questions and ${positions} positions, no position may hold more than ${perPosition}`,
    });
  }
  return errors;
}

function validateQuestion(question, index) {
  const errors = [];
  const label = `questions[${index}]`;

  if (!question || typeof question !== "object" || Array.isArray(question)) {
    errors.push({
      checkId: "quiz-file-question",
      message: `${label} must be an object`,
    });
    return errors;
  }

  if (typeof question.question !== "string" || question.question.trim() === "") {
    errors.push({
      checkId: "quiz-file-question",
      message: `${label}.question must be a non-empty string`,
    });
  }

  const options = question.options;
  if (
    !Array.isArray(options) ||
    options.length < QUIZ_MIN_OPTIONS ||
    options.length > QUIZ_MAX_OPTIONS
  ) {
    errors.push({
      checkId: "quiz-file-options",
      message: `${label}.options must be an array of ${QUIZ_MIN_OPTIONS}-${QUIZ_MAX_OPTIONS} strings`,
    });
  } else if (!options.every((option) => typeof option === "string" && option.trim() !== "")) {
    errors.push({
      checkId: "quiz-file-options",
      message: `${label}.options must all be non-empty strings`,
    });
  }

  const optionCount = Array.isArray(options) ? options.length : 0;
  if (
    !Number.isInteger(question.answer) ||
    question.answer < 0 ||
    question.answer >= optionCount
  ) {
    errors.push({
      checkId: "quiz-file-answer",
      message: `${label}.answer must be a 0-based index below ${optionCount}`,
    });
  }

  if (typeof question.explain !== "string" || question.explain.trim() === "") {
    errors.push({
      checkId: "quiz-file-explain",
      message: `${label}.explain must be a non-empty string`,
    });
  }

  return errors;
}

export function validateQuizPayload(
  payload,
  { maxQuestions = QUIZ_MAX_QUESTIONS, enforceStyle = false } = {},
) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [{ checkId: "quiz-file-json", message: "quiz file must be a JSON object" }];
  }

  const errors = [];
  if (payload["quiz-generated"] !== true) {
    errors.push({
      checkId: "quiz-file-marker",
      message: 'quiz file must set "quiz-generated": true',
    });
  }

  const questions = payload.questions;
  if (!Array.isArray(questions)) {
    errors.push({
      checkId: "quiz-file-count",
      message: "quiz.questions must be an array",
    });
    return errors;
  }

  const limit = Math.max(QUIZ_MIN_QUESTIONS, Number(maxQuestions) || QUIZ_MAX_QUESTIONS);
  if (questions.length < QUIZ_MIN_QUESTIONS || questions.length > limit) {
    errors.push({
      checkId: "quiz-file-count",
      message: `quiz file needs ${QUIZ_MIN_QUESTIONS}-${limit} questions, got ${questions.length}`,
    });
  }

  for (const [index, question] of questions.entries()) {
    errors.push(...validateQuestion(question, index));
    if (enforceStyle) errors.push(...optionShapeErrors(question, index));
  }

  if (enforceStyle && questions.length >= QUIZ_MIN_QUESTIONS) {
    errors.push(...answerSpreadErrors(questions));
  }

  return errors;
}

function parseJsonCandidate(text) {
  const stripped = String(text ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  if (!stripped) throw new Error("quiz output is empty");
  try {
    return JSON.parse(stripped);
  } catch {
    throw new Error("quiz output must be valid JSON");
  }
}

export function formatQuizPayload(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function normalizeText(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/`/g, "")
    .replace(/為什麽/g, "為什麼")
    .replace(/什麽/g, "什麼")
    .trim();
}

function normalizeQuestion(question) {
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    return question;
  }
  return {
    question: normalizeText(question.question),
    options: Array.isArray(question.options)
      ? question.options.map(normalizeText)
      : question.options,
    answer: question.answer,
    explain: normalizeText(question.explain),
  };
}

export function normalizeQuizOutput(raw) {
  const parsed = typeof raw === "string" ? parseJsonCandidate(raw) : raw;

  if (Array.isArray(parsed)) {
    return { "quiz-generated": true, questions: parsed.map(normalizeQuestion) };
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("quiz output must be a JSON object or array");
  }
  if (!Array.isArray(parsed.questions)) {
    throw new Error('quiz output must contain a "questions" array');
  }

  return {
    "quiz-generated": parsed["quiz-generated"] ?? true,
    questions: parsed.questions.map(normalizeQuestion),
  };
}

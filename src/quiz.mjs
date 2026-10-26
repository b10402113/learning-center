import { join } from "node:path";

export const QUIZ_MIN_QUESTIONS = 3;
export const QUIZ_MAX_QUESTIONS = 8;
export const QUIZ_MIN_OPTIONS = 2;
export const QUIZ_MAX_OPTIONS = 5;
export const QUIZ_CHARS_PER_QUESTION = 250;

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

export function validateQuizPayload(payload, { maxQuestions = QUIZ_MAX_QUESTIONS } = {}) {
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

/**
 * Parse a `quiz` fenced block into a renderable object. Returns null when the
 * payload is malformed so the renderer can leave the article intact.
 */
export function parseQuiz(source) {
  let data;
  try {
    data = JSON.parse(String(source ?? ""));
  } catch {
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const question = typeof data.question === "string" ? data.question.trim() : "";
  if (!question) return null;

  const options = data.options;
  if (!Array.isArray(options) || options.length < 2 || options.length > 5) {
    return null;
  }
  if (!options.every((option) => typeof option === "string" && option.trim())) {
    return null;
  }
  if (!Number.isInteger(data.answer) || data.answer < 0 || data.answer >= options.length) {
    return null;
  }
  const explain = typeof data.explain === "string" ? data.explain.trim() : "";
  if (!explain) return null;

  return { question, options, answer: data.answer, explain };
}

function hashString(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle a quiz's options so the correct answer's position is not predictable
 * from the stored order. Pass a `seed` to re-randomize on every mount; without
 * one, the order is seeded by the question text and stays stable.
 */
export function shuffleQuiz(quiz, seed) {
  if (!quiz || !Array.isArray(quiz.options)) return quiz;
  if (!Number.isInteger(quiz.answer)) return quiz;
  if (quiz.answer < 0 || quiz.answer >= quiz.options.length) return quiz;

  const resolvedSeed = Number.isInteger(seed)
    ? seed >>> 0
    : hashString(`${quiz.question}\u0000${quiz.options.join("\u0000")}`);
  const random = mulberry32(resolvedSeed);
  const order = quiz.options.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }

  const options = order.map((index) => quiz.options[index]);
  return { ...quiz, options, answer: order.indexOf(quiz.answer) };
}

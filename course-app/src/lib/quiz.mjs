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

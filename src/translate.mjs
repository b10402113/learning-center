import { isRetryable, responseError, textContent, withRetry } from "./llm.mjs";

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const LATIN = /[A-Za-z]/g;
const KANA_OR_HANGUL = /[\u3040-\u30ff\uac00-\ud7af]/g;
const CODE_MARKER = /<!--code:(\d+)-->/g;
const IMAGE_MARKER = /<!--image:(\d+)-->/g;

// Common characters that only appear in Simplified Chinese. A hit only means
// "call the translator"; the prompt leaves already-Traditional text unchanged.
const SIMPLIFIED = new Set(
  "这说时会后发里过还对开关门问题学习现实际图数据网络软件视频词语读写听见觉应该种样么几头长间亲爱车马鸟鱼龙龟们为从来东书见贝页风飞".split(""),
);

function proseOf(markdown) {
  return String(markdown ?? "")
    .replace(/^```[\s\S]*?^```/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#{1,6}[ \t].*$/gm, "");
}

export function isMostlyChinese(text) {
  const prose = proseOf(text);
  if ((prose.match(KANA_OR_HANGUL) || []).length > 0) return false;
  const cjk = (prose.match(CJK) || []).length;
  const latin = (prose.match(LATIN) || []).length;
  if (cjk === 0 && latin === 0) return false;
  return cjk > latin;
}

export function hasSimplified(text) {
  for (const char of String(text ?? "")) {
    if (SIMPLIFIED.has(char)) return true;
  }
  return false;
}

export function needsChinese(text) {
  return !isMostlyChinese(text) || hasSimplified(text);
}

function markers(text, pattern) {
  return [...String(text ?? "").matchAll(pattern)].map((match) => match[1]);
}

function invalid(message) {
  const error = new Error(message);
  error.validation = true;
  return error;
}

export function validateTranslatedArticle({ before, after }) {
  const next = String(after ?? "").replace(/\r\n/g, "\n").trim();
  if (!next) throw invalid("translation is empty");

  const expectedCode = markers(before, CODE_MARKER);
  const actualCode = markers(next, CODE_MARKER);
  if (expectedCode.join(",") !== actualCode.join(",")) {
    throw invalid(
      `translation changed code placeholders: expected ${expectedCode.join(", ") || "none"}, got ${actualCode.join(", ") || "none"}`,
    );
  }

  const expectedImages = markers(before, IMAGE_MARKER);
  const actualImages = markers(next, IMAGE_MARKER);
  if (expectedImages.join(",") !== actualImages.join(",")) {
    throw invalid(
      `translation changed image markers: expected ${expectedImages.join(", ") || "none"}, got ${actualImages.join(", ") || "none"}`,
    );
  }

  const expectedHeadings = (String(before).match(/^#{2,6}[ \t]/gm) || []).length;
  const actualHeadings = (next.match(/^#{2,6}[ \t]/gm) || []).length;
  if (expectedHeadings !== actualHeadings) {
    throw invalid(`translation changed section count: expected ${expectedHeadings}, got ${actualHeadings}`);
  }

  if (!/^#\s+\S/m.test(next)) throw invalid("translation dropped the H1");
  return `${next}\n`;
}

export function parsePlanJson(text) {
  const stripped = String(text ?? "")
    .replace(/^```(?:json)?[ \t]*$/gm, "")
    .replace(/^```[ \t]*$/gm, "")
    .trim();
  const start = stripped.indexOf("[");
  const end = stripped.lastIndexOf("]");
  if (start === -1 || end <= start) throw new Error("translated plan is not a JSON array");
  return JSON.parse(stripped.slice(start, end + 1));
}

export function mergeTranslatedPlan(original, translated) {
  const items = parsePlanJson(translated);
  if (!Array.isArray(items) || items.length !== original.length) {
    throw invalid(`translated plan must keep ${original.length} items`);
  }
  return original.map((item, index) => {
    const next = items[index] && typeof items[index] === "object" ? items[index] : {};
    const heading = String(next.heading ?? "").trim();
    const prompt = String(next.prompt ?? "").trim();
    if (!heading) throw invalid(`translated plan item ${index + 1} needs a heading`);
    if (!prompt) throw invalid(`translated plan item ${index + 1} needs a prompt`);
    return { heading, anchor: item.anchor, prompt };
  });
}

const RETRY_HINT =
  "\n\n---\n\n上一次的輸出不合格。這次請務必：原文中既有的 `<!--image:N-->` 與 `<!--code:N-->` 標記原樣保留，數量與順序都不能變；`##` 標題的數量與層級也必須和原文完全相同。";

export async function translateArticle({ client, model, system, article, validate }) {
  return withRetry(
    async (attempt) => {
      const user = attempt === 1 ? article : `${article}${RETRY_HINT}`;
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });
      const error = responseError(response);
      if (error) throw error;
      const text = textContent(response).replace(/\r\n/g, "\n");
      return validate ? validate(text) : text;
    },
    { attempts: 3, retryOn: (error) => isRetryable(error) || error?.validation === true },
  );
}

export async function translatePlan({ client, model, system, plan }) {
  const payload = plan.map(({ heading, anchor, prompt }) => ({ heading, anchor, prompt }));
  return withRetry(
    async () => {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(payload, null, 2) },
        ],
      });
      const error = responseError(response);
      if (error) throw error;
      return mergeTranslatedPlan(plan, textContent(response));
    },
    { attempts: 3, retryOn: (error) => isRetryable(error) || error?.validation === true },
  );
}

export function planText(plan) {
  return plan.map(({ heading, prompt }) => `${heading}\n${prompt}`).join("\n");
}

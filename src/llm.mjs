import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Load the project-root .env no matter where the host process was started.
// Values already present in the environment take precedence over the file.
export function loadEnv(dir = REPO_ROOT) {
  try {
    const text = fsSync.readFileSync(path.join(dir, ".env"), "utf8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  } catch {
    // No .env is fine: the caller may supply every value through the environment.
  }
}

export function resolveTextModel(env = process.env) {
  return env.TEXT_MODEL || env.OPENAI_TEXT_MODEL || "gpt-6-astra";
}

export async function createTextClient(env = process.env) {
  const apiKey = env.TEXT_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Set TEXT_API_KEY");
  const { default: OpenAI } = await import("openai");
  return new OpenAI({
    apiKey,
    baseURL: env.TEXT_BASE_URL || env.OPENAI_BASE_URL || undefined,
    maxRetries: 2,
    timeout: 600000,
  });
}

export function textContent(response) {
  const candidates = [
    response?.choices?.[0]?.message?.content,
    response?.data?.choices?.[0]?.message?.content,
    response?.output_text,
    response?.data?.output_text,
  ];
  for (const content of candidates) {
    if (typeof content === "string" && content.trim()) return content;
  }
  throw new Error("Empty output or model refusal");
}

export function responseError(response) {
  const error = response?.error ?? response?.data?.error;
  const finishReason = response?.choices?.[0]?.finish_reason ?? response?.data?.choices?.[0]?.finish_reason;
  if (!error && finishReason !== "error") return undefined;
  const detail = typeof error === "string" ? error : error?.message;
  const result = new Error(detail || "Provider returned an error response");
  if (typeof error?.status === "number") result.status = error.status;
  else if (typeof error?.code === "number") result.status = error.code;
  const code = typeof error?.code === "string" ? error.code : error?.type;
  if (code) result.code = code;
  return result;
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504, 522, 524]);

export function httpStatus(error) {
  return error?.status ?? error?.response?.status;
}

export function isRetryable(error) {
  return (
    RETRYABLE_STATUS.has(httpStatus(error)) ||
    ["ECONNRESET", "ETIMEDOUT", "EPIPE", "ENOTFOUND"].includes(error?.code) ||
    error?.name === "APIConnectionTimeoutError" ||
    error?.name === "APIConnectionError"
  );
}

export async function withRetry(fn, { attempts = 3, baseDelayMs = 2000, retryOn = isRetryable } = {}) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= attempts || !retryOn(error, attempt)) throw error;
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
}

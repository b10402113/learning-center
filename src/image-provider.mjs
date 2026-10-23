import { responseError, withRetry, httpStatus, isRetryable, sleep } from "./llm.mjs";

function apiV1(baseUrl) {
  const base = String(baseUrl).replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
}

function imagesGenerationsUrl(baseUrl) {
  return `${apiV1(baseUrl)}/images/generations`;
}

function providerError(label, response, body) {
  const apiError = body?.error;
  const error = new Error(
    `${label} failed with status ${response.status}` + (apiError?.message ? `: ${apiError.message}` : ""),
  );
  error.status = response.status;
  if (apiError?.code) error.code = apiError.code;
  return error;
}

export function resolveImageProvider(env = process.env) {
  const explicit = String(env.IMAGE_PROVIDER || "").trim().toLowerCase();
  if (["evolink", "openai", "gemini"].includes(explicit)) return explicit;
  if (/^gemini/i.test(String(env.IMAGE_MODEL || "").trim())) return "gemini";
  const baseUrl = env.IMAGE_BASE_URL || env.EVOLINK_BASE_URL;
  if (!baseUrl) return "evolink";
  try {
    return /(^|\.)evolink\.ai$/i.test(new URL(baseUrl).hostname) ? "evolink" : "openai";
  } catch {
    return "evolink";
  }
}

export function resolveImageModel(env = process.env) {
  return env.IMAGE_MODEL || env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst";
}

export async function generateEvolinkImage({
  prompt,
  model,
  size,
  resolution,
  quality,
  apiKey = process.env.IMAGE_API_KEY || process.env.EVOLINK_API_KEY,
  baseUrl = process.env.IMAGE_BASE_URL || process.env.EVOLINK_BASE_URL || "https://api.evolink.ai",
  fetchImpl = globalThis.fetch,
  pollIntervalMs = Number(process.env.IMAGE_POLL_INTERVAL_MS || 5000),
  pollTimeoutMs = Number(process.env.IMAGE_POLL_TIMEOUT_MS || 600000),
} = {}) {
  if (!apiKey) throw new Error("Set IMAGE_API_KEY (or EVOLINK_API_KEY)");
  const endpoint = apiV1(baseUrl);
  const headers = { Authorization: `Bearer ${apiKey}` };
  const json = async (url, init, label) => {
    const response = await fetchImpl(url, init);
    const body = await response.json().catch(() => null);
    if (!response.ok) throw providerError(label, response, body);
    return body;
  };
  const payload = { model, prompt, n: 1 };
  if (size) payload.size = size;
  if (resolution) payload.resolution = resolution;
  if (quality) payload.quality = quality;
  // Creating a task bills the provider, so only retry when the request never
  // reached it (connection errors); an HTTP error may have already registered.
  const task = await withRetry(
    () =>
      json(
        `${endpoint}/images/generations`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        "Evolink image task creation",
      ),
    { attempts: 2, retryOn: (error) => isRetryable(error) && !httpStatus(error) },
  );
  if (!task?.id) throw new Error("Evolink response missing task id");
  const deadline = Date.now() + pollTimeoutMs;
  while (Date.now() < deadline) {
    const status = await withRetry(() =>
      json(`${endpoint}/tasks/${encodeURIComponent(task.id)}`, { headers }, "Evolink task query"),
    );
    if (status.status === "completed") {
      const url = status.results?.[0];
      if (!url) throw new Error(`Evolink task ${task.id} returned no image`);
      const download = await withRetry(async () => {
        const response = await fetchImpl(url);
        if (!response.ok) {
          const error = new Error(`Image download failed with status ${response.status}`);
          error.status = response.status;
          throw error;
        }
        return response;
      });
      return Buffer.from(await download.arrayBuffer());
    }
    if (status.status === "failed") {
      const error = new Error(
        `Evolink task ${task.id} failed` + (status.error?.message ? `: ${status.error.message}` : ""),
      );
      error.code = status.error?.code;
      throw error;
    }
    await sleep(pollIntervalMs);
  }
  throw new Error(`Evolink task ${task.id} timed out`);
}

export function responseFormatFor(model, env = process.env) {
  if (env.IMAGE_RESPONSE_FORMAT != null) {
    const value = String(env.IMAGE_RESPONSE_FORMAT).trim();
    return value || undefined;
  }
  return /^(gpt-image|dall-e|chatgpt-image)/i.test(String(model || "")) ? undefined : "b64_json";
}

export async function generateOpenAIImage({
  prompt,
  model,
  size,
  quality,
  apiKey = process.env.IMAGE_API_KEY || process.env.EVOLINK_API_KEY,
  baseUrl = process.env.IMAGE_BASE_URL || process.env.EVOLINK_BASE_URL || "https://api.openai.com",
  responseFormat = responseFormatFor(model),
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!apiKey) throw new Error("Set IMAGE_API_KEY (or EVOLINK_API_KEY)");
  const payload = { model, prompt, n: 1 };
  if (responseFormat) payload.response_format = responseFormat;
  if (size) payload.size = size;
  if (quality) payload.quality = quality;
  const response = await fetchImpl(imagesGenerationsUrl(baseUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw providerError("Image request", response, body);
  const first = body?.data?.[0];
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");
  if (first?.url) {
    const download = await fetchImpl(first.url);
    if (!download.ok) {
      const error = new Error(`Image download failed with status ${download.status}`);
      error.status = download.status;
      throw error;
    }
    return Buffer.from(await download.arrayBuffer());
  }
  throw new Error("Image response missing data[0].b64_json");
}

export async function generateGeminiImage({
  prompt,
  model,
  apiKey = process.env.IMAGE_API_KEY || process.env.EVOLINK_API_KEY,
  baseUrl = process.env.IMAGE_BASE_URL || process.env.EVOLINK_BASE_URL || "https://api.openai.com",
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!apiKey) throw new Error("Set IMAGE_API_KEY (or EVOLINK_API_KEY)");
  const response = await fetchImpl(`${apiV1(baseUrl)}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw providerError("Image request", response, body);
  const message = body?.choices?.[0]?.message ?? {};
  const parts = [];
  if (typeof message.content === "string") parts.push(message.content);
  else if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (typeof part?.text === "string") parts.push(part.text);
      if (typeof part?.image_url?.url === "string") parts.push(part.image_url.url);
      if (typeof part?.inline_data?.data === "string") {
        parts.push(`data:${part.inline_data.mime_type || "image/png"};base64,${part.inline_data.data}`);
      }
    }
  }
  for (const image of Array.isArray(message.images) ? message.images : []) {
    if (typeof image?.image_url?.url === "string") parts.push(image.image_url.url);
    if (typeof image?.data === "string") parts.push(`data:image/png;base64,${image.data}`);
  }
  const match = parts.join("\n").match(/data:image\/[a-z0-9.+-]+;base64,([a-z0-9+/=\s]+)/i);
  if (match) return Buffer.from(match[1].replace(/\s+/g, ""), "base64");
  if (typeof body?.data?.[0]?.b64_json === "string") return Buffer.from(body.data[0].b64_json, "base64");
  throw responseError(body) ?? new Error("Gemini image response missing image data");
}

export function resolveImageCompression(env = process.env) {
  return {
    quality: Number(env.IMAGE_COMPRESS_QUALITY || 80),
    maxWidth: Number(env.IMAGE_MAX_WIDTH || 1600),
  };
}

/** Compress generated bytes into WebP. A decode failure is fatal: never save a non-WebP file. */
export async function writeWebp(target, bytes, settings = resolveImageCompression()) {
  let output;
  try {
    const { default: sharp } = await import("sharp");
    let pipeline = sharp(bytes);
    if (settings.maxWidth > 0) {
      pipeline = pipeline.resize({ width: settings.maxWidth, withoutEnlargement: true });
    }
    output = await pipeline.webp({ quality: settings.quality }).toBuffer();
  } catch (error) {
    throw new Error(`failed to compress image to WebP: ${error?.message ?? error}`);
  }
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, output);
}

export function imageGenerator(env = process.env) {
  const provider = resolveImageProvider(env);
  if (provider === "gemini") return generateGeminiImage;
  if (provider === "openai") return generateOpenAIImage;
  return generateEvolinkImage;
}

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load the project-root .env no matter where the process was started.
// Values already present in the environment take precedence over the file.
function loadEnv(dir) {
  try {
    const text = fsSync.readFileSync(path.join(dir, '.env'), 'utf8');
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if (value.length >= 2
          && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))))
        value = value.slice(1, -1);
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  } catch {}
}
loadEnv(projectRoot);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504, 522, 524]);
const errorStatus = error => error?.status ?? error?.response?.status;
const isRetryable = error => RETRYABLE_STATUS.has(errorStatus(error))
  || ['ECONNRESET', 'ETIMEDOUT', 'EPIPE', 'ENOTFOUND', 'UND_ERR_CONNECT_TIMEOUT'].includes(error?.code)
  || error?.name === 'AbortError'
  || error?.name === 'TypeError';

async function withRetry(fn, { attempts = 3, baseDelayMs = 2000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= attempts || !isRetryable(error)) throw error;
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
}

function apiUrl(baseUrl) {
  if (!baseUrl) return 'https://api.openai.com/v1/chat/completions';
  const base = String(baseUrl).replace(/\/+$/, '');
  return `${base.endsWith('/v1') ? base : `${base}/v1`}/chat/completions`;
}

// OpenAI-compatible gateways answer in several shapes. Flatten them to text.
function contentText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content))
    return content.map(part => typeof part === 'string' ? part : part?.text ?? '').join('');
  return undefined;
}
export function responseText(response) {
  const candidates = [
    response?.choices?.[0]?.message?.content,
    response?.data?.choices?.[0]?.message?.content,
    response?.output_text,
    response?.data?.output_text,
    response?.output?.[0]?.content?.[0]?.text,
    response?.data?.output?.[0]?.content?.[0]?.text
  ];
  for (const candidate of candidates) {
    const text = contentText(candidate);
    if (typeof text === 'string' && text.trim()) return text;
  }
  return undefined;
}

// Some gateways return HTTP 200 with an error inside the body.
export function responseError(response) {
  const error = response?.error ?? response?.data?.error;
  const finishReason = response?.choices?.[0]?.finish_reason ?? response?.data?.choices?.[0]?.finish_reason;
  if (!error && finishReason !== 'error' && finishReason !== 'content_filter') return undefined;
  const detail = typeof error === 'string' ? error : error?.message;
  const result = new Error(detail || `Provider returned ${finishReason || 'an error'} response`);
  if (typeof error?.status === 'number') result.status = error.status;
  const code = typeof error?.code === 'string' ? error.code : error?.type;
  if (code) result.code = code;
  return result;
}

// Models sometimes wrap the whole answer in one Markdown fence even when told
// not to. Only unwrap when it is the single fence around the whole answer, so
// an article that legitimately contains a code block is left alone.
export function unwrapFence(text) {
  const trimmed = text.trim();
  const fence = '```';
  if (!trimmed.startsWith(fence) || !trimmed.endsWith(fence)) return text;
  if (trimmed.split(fence).length !== 3) return text;
  const newline = trimmed.indexOf('\n');
  if (newline === -1) return text;
  const body = trimmed.slice(newline + 1, -fence.length);
  return body.replace(/\n$/, '');
}

const clean = text => unwrapFence(text.replace(/\r\n/g, '\n')).trim();

export function slugifyTopic(text) {
  const heading = String(text ?? '').match(/^#{1,6}[ \t]+(.+?)[ \t]*$/m)?.[1];
  const topic = (heading || String(text ?? '').split('\n').find(line => line.trim()) || 'article')
    .replace(/[\\/:*?"<>|#`*_~[\]()]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return topic || 'article';
}

function outputDirName(article) {
  const date = new Date();
  const pad = n => String(n).padStart(2, '0');
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
    + `_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  return `polish_${stamp}_${slugifyTopic(article)}`;
}

function redact(message, secrets) {
  let text = typeof message === 'string' ? message : String(message ?? '');
  for (const secret of secrets)
    if (typeof secret === 'string' && secret.trim().length >= 16) text = text.split(secret).join('[redacted]');
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > 400 ? `${text.slice(0, 400)}…` : text;
}

/**
 * Polish one article with one LLM call.
 *
 * @param {object} args
 * @param {string} [args.articleText]  the article to polish
 * @param {string} [args.articleFile]  or a path to read it from
 * @param {string} [args.instruction]  optional extra editing instruction
 * @param {string} [args.outputRoot]   where to save run files (default ./output)
 * @param {boolean} [args.save]        write original.md/polished.md/manifest.json (default true)
 * @param {string} [args.outFile]      also write the polished text here
 * @returns {Promise<{text: string, article: string|null, manifest: string|null}>}
 */
export async function polishArticle(args, root = process.cwd(), injected = {}) {
  if (typeof args?.articleText !== 'string') args = { ...args, articleText: '' };
  if (!args.articleText.trim() && args.articleFile) {
    const file = path.isAbsolute(args.articleFile) ? args.articleFile : path.resolve(root, args.articleFile);
    args.articleText = await fs.readFile(file, 'utf8');
  }
  if (!args.articleText.trim()) throw new Error('請提供文章（articleText 或 articleFile）');
  if (Buffer.byteLength(args.articleText, 'utf8') > 200000) throw new Error('文章超過 200000 bytes 上限');

  const apiKey = process.env.TEXT_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('請在 .env 設定 TEXT_API_KEY');
  const model = process.env.TEXT_MODEL || process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.TEXT_BASE_URL || process.env.OPENAI_BASE_URL || '';
  const temperature = Number(process.env.POLISH_TEMPERATURE ?? 0.3);
  const timeoutMs = Number(process.env.POLISH_TIMEOUT_MS || 600000);

  const system = (await fs.readFile(path.join(projectRoot, 'prompts/polish.txt'), 'utf8'))
    + (args.instruction?.trim() ? `\n\n## 本次額外要求\n\n${args.instruction.trim()}\n` : '');

  const fetchImpl = injected.fetch || globalThis.fetch;
  const manifest = {
    status: 'running',
    model,
    baseUrl: baseUrl || 'https://api.openai.com/v1',
    startedAt: new Date().toISOString(),
    textRequests: 0,
    usage: null,
    error: null
  };

  let out = null;
  let save = () => Promise.resolve();
  if (args.save !== false) {
    const outputRoot = path.resolve(args.outputRoot || path.join(projectRoot, 'output'));
    await fs.mkdir(outputRoot, { recursive: true });
    const base = outputDirName(args.articleText);
    out = path.join(outputRoot, base);
    for (let n = 2; await fs.stat(out).catch(() => null); n++) out = path.join(outputRoot, `${base}-${n}`);
    await fs.mkdir(out, { recursive: true });
    save = (name, data) => fs.writeFile(path.join(out, name),
      typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    await save('original.md', args.articleText);
    await save('manifest.json', manifest);
  }

  let polished;
  try {
    polished = await withRetry(async () => {
      manifest.textRequests++;
      const response = await fetchImpl(apiUrl(baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: args.articleText }
          ]
        }),
        signal: AbortSignal.timeout(timeoutMs)
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const apiError = body?.error;
        const error = new Error(`API 回應 ${response.status}`
          + (apiError?.message ? `：${apiError.message}` : ''));
        error.status = response.status;
        if (apiError?.code) error.code = apiError.code;
        throw error;
      }
      const apiError = responseError(body);
      if (apiError) throw apiError;
      const text = responseText(body);
      if (!text) throw new Error('模型回應為空或格式無法解析');
      manifest.usage = body?.usage ?? body?.data?.usage ?? null;
      manifest.responseId = body?.id ?? body?.data?.id ?? null;
      return clean(text);
    });
    manifest.status = 'completed';
  } catch (error) {
    manifest.status = 'failed';
    manifest.error = redact(error?.message ?? error, [apiKey]);
    if (out) await save('manifest.json', manifest);
    throw error;
  }

  manifest.finishedAt = new Date().toISOString();
  let article = null;
  if (out) {
    await save('polished.md', `${polished}\n`);
    manifest.polished = path.join(out, 'polished.md');
    article = manifest.polished;
    await save('manifest.json', manifest);
  }
  if (args.outFile) {
    await fs.mkdir(path.dirname(path.resolve(args.outFile)), { recursive: true });
    await fs.writeFile(args.outFile, `${polished}\n`, 'utf8');
  }
  return { text: polished, article, manifest: out ? path.join(out, 'manifest.json') : null };
}

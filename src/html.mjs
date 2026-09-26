import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_IMAGES,
  DEFAULT_IMAGE_STYLE,
  IMAGE_MARKER_SOURCE,
  normalizeImagePlan,
  textContent,
  responseError,
  resolveImageProvider,
  generateEvolinkImage,
  generateOpenAIImage,
  loadEnv,
  withRetry,
} from './pipeline.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const ILLUSTRATION_STATES = ['none', 'planned', 'done'];
export const PENDING_CAPTION = index => `配圖 ${index} 待生成`;
export const FIGURE_CAPTION = 'AI 生成示意圖';
export const FIGURE_STYLES = `
/* Lesson figure styles (added by /to-article) */
.lesson-figure { margin: 1.5rem 0; text-align: center; }
.lesson-figure img { max-width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; }
.lesson-figure figcaption { margin-top: 0.5rem; color: var(--muted); font-size: 0.85rem; }
.lesson-figure.pending {
  padding: 2rem 1rem;
  border: 1px dashed var(--border);
  border-radius: 8px;
  background: var(--code-bg);
  color: var(--muted);
  font-size: 0.9rem;
}
`;

const markerRe = () => new RegExp(IMAGE_MARKER_SOURCE, 'gm');
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

// --- small helpers ---------------------------------------------------------

function assertSafeId(label, value) {
  const text = String(value ?? '');
  if (!text || text.includes('/') || text.includes('\\') || text === '.' || text.includes('..'))
    throw new Error(`unsafe ${label}: ${JSON.stringify(value)}`);
  return text;
}

async function readJson(file) {
  const text = await fs.readFile(file, 'utf8').catch(() => null);
  if (text == null) return undefined;
  try { return JSON.parse(text); } catch { return undefined; }
}

function sectionBody(text, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = String(text).match(new RegExp(`^##\\s+${esc}\\s*$`, 'm'));
  if (!m) return '';
  const rest = String(text).slice(m.index + m[0].length);
  const next = rest.match(/^##\s/m);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

// --- HTML parsing / cleaning ----------------------------------------------

export function decodeEntities(text) {
  return String(text)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/** Split a lesson document into the outer <html> tag, <head> inner HTML and <body> inner HTML. */
export function splitHtml(html) {
  const source = String(html);
  const htmlTag = source.match(/<html\b[^>]*>/i)?.[0] ?? '<html lang="zh-Hant">';
  const head = source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return { htmlTag, headInner: head ? head[1] : '', body: body ? body[1] : source };
}

// Balanced <div> extraction so nested divs (e.g. lesson-nav) are removed whole.
function extractDivsByClass(html, classToken) {
  const openRe = new RegExp(`<div\\b[^>]*class="[^"]*\\b${classToken}\\b[^"]*"[^>]*>`, 'i');
  const tokenSource = '<div\\b[^>]*>|<\\/div\\s*>';
  let rest = String(html);
  const elements = [];
  for (;;) {
    const open = openRe.exec(rest);
    if (!open) break;
    const tokenRe = new RegExp(tokenSource, 'gi');
    tokenRe.lastIndex = open.index + open[0].length;
    let depth = 1;
    let end = -1;
    let token;
    while ((token = tokenRe.exec(rest))) {
      depth += token[0][1] === '/' ? -1 : 1;
      if (depth === 0) { end = token.index + token[0].length; break; }
    }
    if (end === -1) break;
    elements.push(rest.slice(open.index, end));
    rest = rest.slice(0, open.index) + rest.slice(end);
  }
  return { elements, rest };
}

const QUIZ_HEADING_RE = /\s*<h2\b[^>]*>\s*(?:複習題|測驗|隨堂測驗)\s*<\/h2>\s*/gi;

/**
 * Strip the quiz, lesson-nav, footer and script from a lesson body.
 * Returns the cleaned body plus the chrome needed to reassemble it later.
 */
export function stripLessonChrome(body) {
  let html = String(body);
  const quizHeading = (html.match(QUIZ_HEADING_RE) || []).join('').trim();
  html = html.replace(QUIZ_HEADING_RE, '\n');
  const quiz = extractDivsByClass(html, 'quiz');
  html = quiz.rest;
  const nav = extractDivsByClass(html, 'lesson-nav');
  html = nav.rest;
  const footer = extractDivsByClass(html, 'footer');
  html = footer.rest;
  html = html.replace(/<script\b[\s\S]*?<\/script>\s*/gi, '\n').replace(/<script\b[^>]*\/>\s*/gi, '\n');
  html = html.replace(/\n{3,}/g, '\n\n').trim();
  return {
    cleaned: html,
    quiz: quiz.elements.join('\n'),
    nav: nav.elements[0] ?? '',
    footer: footer.elements[0] ?? '',
    quizHeading: quizHeading || '<h2>複習題</h2>',
  };
}

/** Rebuild a full HTML document from the rewritten body plus the original head and chrome. */
export function assembleLesson({ htmlTag = '<html lang="zh-Hant">', headInner = '', body, chrome = {} }) {
  const parts = [String(body).trim()];
  if (chrome.nav) parts.push(chrome.nav);
  if (chrome.quiz) {
    parts.push(chrome.quizHeading || '<h2>複習題</h2>');
    parts.push(chrome.quiz);
  }
  if (chrome.footer) parts.push(chrome.footer);
  return `<!DOCTYPE html>\n${htmlTag}\n<head>${headInner}</head>\n<body>\n\n${parts.filter(Boolean).join('\n\n')}\n\n<script src="../assets/quiz.js"></script>\n</body>\n</html>\n`;
}

export function extractCodeBlocks(html) {
  const out = [];
  for (const m of String(html).matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)) out.push(m[1]);
  return out;
}

export function extractHrefs(html) {
  const out = [];
  for (const m of String(html).matchAll(/<a\b[^>]*?\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi))
    out.push(m[2] ?? m[3] ?? '');
  return [...new Set(out)];
}

export function plainText(html) {
  return decodeEntities(String(html).replace(/<[^>]*>/g, ''));
}

/** Lightweight tag-balance check: true when every opened tag is closed. */
export function isHtmlParseable(html) {
  const source = String(html ?? '');
  if (!source.trim()) return false;
  // Mask raw-text elements so code samples containing < or > do not confuse the scan.
  const masked = source.replace(/<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, m => m.replace(/[^\n]/g, ' '));
  const stack = [];
  const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
  let match;
  while ((match = re.exec(masked))) {
    if (match[0].startsWith('<!')) continue;
    const name = match[1].toLowerCase();
    if (VOID_TAGS.has(name) || /\/>$/.test(match[0])) continue;
    if (match[0][1] === '/') {
      if (stack.pop() !== name) return false;
    } else {
      stack.push(name);
    }
  }
  return stack.length === 0;
}

// --- rewrite normalization / validation ------------------------------------

/** Accept a raw model reply and reduce it to an HTML body fragment. */
export function normalizeRewrite(raw) {
  let text = String(raw ?? '').replace(/\r\n/g, '\n').trim();
  text = text.replace(/^```[a-zA-Z0-9]*\s*\n/, '').replace(/\n?```\s*$/, '').trim();
  const body = text.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (body) return body[1].trim();
  if (/<html\b/i.test(text)) {
    const inner = text.match(/<html\b[^>]*>([\s\S]*?)<\/html>/i);
    if (inner) return inner[1].replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, '').trim();
  }
  return text;
}

/** Every marker must appear once, in plan order, as a standalone line. */
export function parseImageMarkers(rewritten, plan) {
  const matches = [...String(rewritten).matchAll(markerRe())];
  if (!matches.length) throw new Error('No image markers found in the rewritten article');
  if (matches.length !== plan.length)
    throw new Error(`Found ${matches.length} image markers but the plan has ${plan.length}`);
  matches.forEach((match, i) => {
    if (Number(match[1]) !== i + 1)
      throw new Error(`Image markers are out of order: expected <!--image:${i + 1}-->, found <!--image:${match[1]}-->`);
  });
  return matches.map((match, i) => ({ index: i + 1, position: match.index }));
}

/** Hard validation of a rewrite: HTML shape, code blocks and links. */
export function validateRewrite({ rewritten, originalBody }) {
  if (typeof rewritten !== 'string' || !rewritten.trim()) throw new Error('Rewrite was empty');
  if (!isHtmlParseable(rewritten)) throw new Error('Rewrite is not valid HTML');
  const decoded = plainText(rewritten);
  for (const block of extractCodeBlocks(originalBody)) {
    const text = plainText(block).trim();
    if (!text) continue;
    if (!rewritten.includes(block) && !decoded.includes(text))
      throw new Error('Rewrite changed a code block');
  }
  for (const href of extractHrefs(originalBody)) {
    if (!rewritten.includes(href)) throw new Error(`Rewrite dropped a link: ${href}`);
  }
  return true;
}

export function figureHtml(step, index) {
  return `<figure class="lesson-figure"><img src="./${step}-assets/image-${index}.png" alt=""><figcaption>${FIGURE_CAPTION}</figcaption></figure>`;
}

/** Replace each marker with its final figure, whose src points at the future image path. */
export function markersToFigures(rewritten, plan, step) {
  const indexes = new Set(plan.map(item => item.index));
  return String(rewritten).replace(markerRe(), (whole, digits) => {
    const n = Number(digits);
    return indexes.has(n) ? figureHtml(step, n) : whole;
  });
}

/**
 * Ensure the figure for `index` is present. Articles rewritten from now on
 * already carry the final figure; articles written by an older version carry a
 * pending placeholder, which is swapped for the final figure.
 */
export function ensureFigure(html, index, step) {
  const figure = figureHtml(step, index);
  if (html.includes(figure)) return html;
  const pending = `<figure class="lesson-figure pending">${PENDING_CAPTION(index)}</figure>`;
  if (html.includes(pending)) return html.split(pending).join(figure);
  return html;
}

// --- paths / brief / frontmatter -------------------------------------------

export function htmlPaths(root, subject, node, step) {
  const subjectRoot = path.join(root, 'learn', subject);
  const outDir = path.join(subjectRoot, 'output', node, step);
  return {
    subjectRoot,
    lesson: path.join(subjectRoot, 'lessons', node, `${step}.html`),
    sharedCss: path.join(subjectRoot, 'lessons', 'assets', 'shared.css'),
    stepFile: path.join(subjectRoot, 'nodes', node, `${step}.mdx`),
    outDir,
    original: path.join(outDir, 'original.html'),
    cleaned: path.join(outDir, 'cleaned.html'),
    planInput: path.join(outDir, 'plan.input.json'),
    plan: path.join(outDir, 'plan.json'),
    rewritten: path.join(outDir, 'rewritten.html'),
    manifest: path.join(outDir, 'manifest.json'),
    assets: path.join(outDir, 'assets'),
    imageAssets: path.join(subjectRoot, 'lessons', node, `${step}-assets`),
  };
}

export async function buildBrief(root, subject) {
  const text = await fs.readFile(path.join(root, 'learn', subject, 'MEMORY.md'), 'utf8').catch(() => '');
  const language = String(text).match(/^language:\s*(.+)$/m)?.[1]?.trim() || 'zh-Hant';
  const preferences = sectionBody(text, 'How to teach me')
    || sectionBody(text, 'Habits & constraints')
    || sectionBody(text, 'Anchors');
  return preferences ? `語言：${language}\n學習者偏好與限制：\n${preferences}` : `語言：${language}`;
}

export async function ensureLessonFigureStyles(root, subject) {
  const target = path.join(root, 'learn', subject, 'lessons', 'assets', 'shared.css');
  let css = await fs.readFile(target, 'utf8').catch(() => null);
  if (css == null) {
    css = await fs.readFile(path.join(projectRoot, '.opencode', 'skills', 'teach', 'assets', 'shared.css'), 'utf8')
      .catch(() => '');
  }
  if (!css.includes('.lesson-figure')) {
    css = `${css.replace(/\s*$/, '')}\n${FIGURE_STYLES}`;
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, css);
  }
  return target;
}

/** Write a step's `illustration` frontmatter and refresh `updated`. */
export async function setStepIllustration(root, subject, node, step, state) {
  if (!ILLUSTRATION_STATES.includes(state)) throw new Error(`invalid illustration state: ${state}`);
  const file = htmlPaths(root, subject, node, step).stepFile;
  const text = await fs.readFile(file, 'utf8').catch(() => null);
  if (text == null) return false;
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fm) return false;
  let block = fm[1];
  if (/^illustration:.*$/m.test(block)) block = block.replace(/^illustration:.*$/m, `illustration: ${state}`);
  else block = `${block.replace(/\s*$/, '')}\nillustration: ${state}`;
  const today = new Date().toISOString().slice(0, 10);
  if (/^updated:.*$/m.test(block)) block = block.replace(/^updated:.*$/m, `updated: ${today}`);
  const out = `${text.slice(0, fm.index)}---\n${block}\n---\n${text.slice(fm.index + fm[0].length)}`;
  await fs.writeFile(file, out);
  return true;
}

// --- text / image clients --------------------------------------------------

function httpStatus(error) {
  return error?.status ?? error?.response?.status;
}

function resolveTextModel() {
  return process.env.TEXT_MODEL || process.env.OPENAI_TEXT_MODEL || 'gpt-6-astra';
}

function resolveImageModel() {
  return process.env.IMAGE_MODEL || process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
}

async function createTextClient() {
  const apiKey = process.env.TEXT_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Set TEXT_API_KEY');
  const { default: OpenAI } = await import('openai');
  return new OpenAI({
    apiKey,
    baseURL: process.env.TEXT_BASE_URL || process.env.OPENAI_BASE_URL || undefined,
    maxRetries: 2,
    timeout: 600000,
  });
}

/** Read or refresh the original lesson and produce the cleaned body sent to the model. */
export async function prepareHtmlLesson(args, root = projectRoot) {
  const subject = assertSafeId('subject', args.subject);
  const node = assertSafeId('node', args.node);
  const step = assertSafeId('step', args.step);
  root = await fs.realpath(root).catch(() => projectRoot);
  try { await fs.access(path.join(root, 'prompts', 'html-rewrite.txt')); }
  catch { root = projectRoot; }
  const paths = htmlPaths(root, subject, node, step);
  await fs.mkdir(paths.outDir, { recursive: true });
  let original = await fs.readFile(paths.original, 'utf8').catch(() => null);
  if (original == null) {
    original = await fs.readFile(paths.lesson, 'utf8').catch(() => null);
    if (original == null) throw new Error(`No HTML lesson at ${path.relative(root, paths.lesson)}`);
    await fs.writeFile(paths.original, original);
  }
  const split = splitHtml(original);
  const chrome = stripLessonChrome(split.body);
  if (!chrome.cleaned) throw new Error('Lesson body is empty after removing quiz/nav/footer');
  await fs.writeFile(paths.cleaned, `${chrome.cleaned}\n`);
  return { root, paths, original, ...split, chrome };
}

/**
 * One text-model call per run: clean the original, rewrite it, and save the
 * rewrite. No image plan is involved — the calling agent reads the finished
 * article afterwards and marks where figures should go.
 */
export async function generateHtmlArticle(args, root = projectRoot, injected = {}) {
  const { root: resolved, paths, chrome } = await prepareHtmlLesson(args, root);
  const subject = assertSafeId('subject', args.subject);
  const node = assertSafeId('node', args.node);
  const step = assertSafeId('step', args.step);
  loadEnv(resolved);
  const textModel = resolveTextModel();
  const manifest = {
    status: 'running',
    mode: 'article',
    subject, node, step,
    textModel,
    textRequests: 0,
    responses: [],
    stages: { original: true, cleaned: true },
  };
  const saveManifest = () => fs.writeFile(paths.manifest, JSON.stringify(manifest, null, 2));
  try {
    const client = injected.client ?? await createTextClient();
    const systemPrompt = await fs.readFile(path.join(resolved, 'prompts', 'html-rewrite.txt'), 'utf8');
    const brief = args.brief ?? await buildBrief(resolved, subject);
    // Exactly one text call per run: a malformed reply fails hard instead of retrying.
    manifest.textRequests++;
    await saveManifest();
    const response = await client.chat.completions.create({
      model: textModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify({ brief, html: chrome.cleaned }) },
      ],
    });
    manifest.responses.push({ id: response?.data?.id ?? response?.id, usage: response?.usage ?? response?.data?.usage });
    await saveManifest();
    const apiError = responseError(response);
    if (apiError) throw apiError;
    const rewritten = normalizeRewrite(textContent(response));
    validateRewrite({ rewritten, originalBody: chrome.cleaned });
    manifest.stages.rewritten = true;
    await fs.writeFile(paths.rewritten, `${rewritten}\n`);
    manifest.status = 'completed';
    await saveManifest();
    return { rewritten: paths.rewritten, planInput: paths.planInput, manifest: paths.manifest };
  } catch (error) {
    manifest.status = 'failed';
    manifest.error = {
      name: error?.name ?? 'Error',
      status: httpStatus(error) ?? null,
      code: error?.code,
      message: String(error?.message ?? '').slice(0, 400),
    };
    await saveManifest().catch(() => {});
    throw new Error(`Article rewrite failed (${manifest.error.message}); partial files: ${paths.outDir}`, { cause: error });
  }
}

/**
 * Program-only: the agent has already inserted `<!--image:N-->` markers into
 * the rewrite and written the plan. Convert the markers to figures, assemble
 * the lesson, and record the plan.
 */
export async function finalizeHtmlArticle(args, root = projectRoot) {
  const { root: resolved, paths, htmlTag, headInner, chrome } = await prepareHtmlLesson(args, root);
  const subject = assertSafeId('subject', args.subject);
  const node = assertSafeId('node', args.node);
  const step = assertSafeId('step', args.step);
  const rewritten = await fs.readFile(paths.rewritten, 'utf8').catch(() => null);
  if (rewritten == null)
    throw new Error(`No rewritten article at ${path.relative(resolved, paths.rewritten)}; run the article rewrite first`);
  const providedPlan = args.imagePlan ?? await readJson(paths.planInput);
  const plan = normalizeImagePlan(providedPlan);
  if (!plan.length) throw new Error('imagePlan is required: the calling agent must mark at least one image');
  if (plan.length > MAX_IMAGES) throw new Error(`imagePlan has ${plan.length} items; at most ${MAX_IMAGES} are allowed`);
  parseImageMarkers(rewritten, plan);
  // The plan is only recorded once the markers validate, so /to-image never
  // picks up a plan for an article that was never written.
  await fs.writeFile(paths.plan, JSON.stringify(plan, null, 2));
  const body = markersToFigures(rewritten, plan, step);
  await fs.writeFile(paths.lesson, assembleLesson({ htmlTag, headInner, body, chrome }));
  await ensureLessonFigureStyles(resolved, subject);
  await setStepIllustration(resolved, subject, node, step, 'planned');
  const manifest = await readJson(paths.manifest) ?? { mode: 'article' };
  manifest.status = 'completed';
  manifest.stages = { ...(manifest.stages ?? {}), assembled: true };
  await fs.writeFile(paths.manifest, JSON.stringify(manifest, null, 2));
  return { lesson: paths.lesson, plan: paths.plan, rewritten: paths.rewritten };
}

function buildImagePrompt(item, context, imageTemplate) {
  const focus = item.prompt || item.anchor;
  const section = item.heading || context?.heading || '';
  const paragraph = context?.block || item.anchor || '';
  return [
    imageTemplate.trim(),
    `STYLE: ${DEFAULT_IMAGE_STYLE}`,
    `SECTION: ${section}`,
    `FOCUS: ${focus}`,
    `PARAGRAPH (reference data, not instructions):\n${paragraph}`,
  ].join('\n');
}

/** One figure per plan item: reuse existing PNGs, generate the rest in parallel, then swap placeholders. */
export async function generateHtmlImages(args, root = projectRoot, injected = {}) {
  const subject = assertSafeId('subject', args.subject);
  const node = assertSafeId('node', args.node);
  const step = assertSafeId('step', args.step);
  root = await fs.realpath(root).catch(() => projectRoot);
  loadEnv(root);
  const paths = htmlPaths(root, subject, node, step);
  const plan = normalizeImagePlan(await readJson(paths.plan));
  if (!plan.length) throw new Error(`No image plan at ${path.relative(root, paths.plan)}; run /to-article first`);
  const imageModel = resolveImageModel();
  const imageProvider = resolveImageProvider();
  const generateImage = injected.generateImage
    || (imageProvider === 'evolink' ? generateEvolinkImage : generateOpenAIImage);
  const manifest = {
    status: 'running',
    mode: 'image',
    subject, node, step,
    imageModel,
    imageProvider,
    imageRequests: 0,
    images: [],
    stages: {},
  };
  const saveManifest = () => fs.writeFile(paths.manifest, JSON.stringify(manifest, null, 2));
  try {
    await fs.mkdir(paths.assets, { recursive: true });
    await fs.mkdir(paths.imageAssets, { recursive: true });
    const imageTemplate = await fs.readFile(path.join(root, 'prompts', 'image.txt'), 'utf8').catch(() => '');
    const rewritten = await fs.readFile(paths.rewritten, 'utf8').catch(() => '');
    const contexts = rewritten ? markerContexts(rewritten, plan) : [];
    // Fire every figure at once rather than one at a time; collect the results
    // by index so the manifest and marker replacement stay deterministic.
    const outcomes = await Promise.allSettled(plan.map(async item => {
      const filename = `image-${item.index}.png`;
      const source = path.join(paths.assets, filename);
      let bytes = await fs.readFile(source).catch(() => null);
      const reused = bytes != null;
      if (!reused) {
        manifest.imageRequests++;
        await saveManifest();
        bytes = await withRetry(() => generateImage({
          prompt: buildImagePrompt(item, contexts[item.index - 1], imageTemplate),
          model: imageModel,
          size: process.env.IMAGE_SIZE || '4:3',
          resolution: process.env.IMAGE_RESOLUTION || '1K',
          quality: process.env.IMAGE_QUALITY || 'medium',
        }), { attempts: 2, baseDelayMs: 5000, retryOn: error => !httpStatus(error) });
        if (!Buffer.isBuffer(bytes) || !bytes.length) throw new Error(`No image returned for figure ${item.index}`);
        await fs.writeFile(source, bytes);
      }
      await fs.copyFile(source, path.join(paths.imageAssets, filename));
      return { index: item.index, filename, reused };
    }));
    // Wait for every job to settle before failing, so no straggler overwrites
    // the failed manifest the catch block is about to write.
    const failed = outcomes.find(outcome => outcome.status === 'rejected');
    if (failed) throw failed.reason;
    const figures = outcomes.map(outcome => outcome.value).sort((a, b) => a.index - b.index);
    manifest.images = figures;
    await saveManifest();
    let lesson = await fs.readFile(paths.lesson, 'utf8');
    for (const figure of figures) lesson = ensureFigure(lesson, figure.index, step);
    await fs.writeFile(paths.lesson, lesson);
    await setStepIllustration(root, subject, node, step, 'done');
    manifest.stages.figures = true;
    manifest.status = 'completed';
    await saveManifest();
    return { lesson: paths.lesson, images: figures.map(f => path.join(paths.imageAssets, f.filename)), manifest: paths.manifest };
  } catch (error) {
    manifest.status = 'failed';
    manifest.error = {
      name: error?.name ?? 'Error',
      status: httpStatus(error) ?? null,
      code: error?.code,
      message: String(error?.message ?? '').slice(0, 400),
    };
    await saveManifest().catch(() => {});
    throw new Error(`Image generation failed (${manifest.error.message}); partial files: ${paths.outDir}`, { cause: error });
  }
}

/** Locate the reference block and heading for each marker so the image prompt has context. */
export function markerContexts(rewritten, plan) {
  const matches = [...String(rewritten).matchAll(markerRe())];
  return matches.map((match, i) => {
    const start = i === 0 ? 0 : matches[i - 1].index + matches[i - 1][0].length;
    const blocks = String(rewritten).slice(start, match.index).split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
    const block = blocks.at(-1) ?? '';
    return { index: i + 1, heading: plan[i]?.heading ?? '', block: plainText(block).trim() };
  });
}

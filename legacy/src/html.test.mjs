import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { normalizeImagePlan } from '../../src/pipeline.mjs';
import {
  splitHtml,
  stripLessonChrome,
  assembleLesson,
  extractCodeBlocks,
  extractHrefs,
  isHtmlParseable,
  normalizeRewrite,
  parseImageMarkers,
  validateRewrite,
  markersToFigures,
  ensureFigure,
  prepareHtmlLesson,
  generateHtmlArticle,
  generateNodeArticle,
  finalizeHtmlPlan,
  generateHtmlImages,
  resolveImageCompression,
  buildBrief,
  setStepIllustration,
  resolveStepType,
  resolveStepIllustration,
  resolveNodeSteps,
  mapWithConcurrency,
  loadTypeRules,
  markerContexts,
} from './html.mjs';

const LESSON = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>測試課程</title>
<link rel="stylesheet" href="../assets/shared.css">
</head>
<body>

<h1>測試課程標題</h1>
<p class="meta">Step 1/2 · 測試節點</p>

<h2>第一節</h2>
<p>第一段文字，含有 <a href="https://example.com/doc">外部連結</a>。</p>
<pre><code>const x = 1 &lt; 2;</code></pre>

<h2>第二節</h2>
<p>第二段文字。</p>

<div class="lesson-nav">
  <div></div>
  <div><a href="./next.html">下一步</a></div>
</div>

<h2>複習題</h2>

<div class="quiz" data-question="問題？" data-correct="1" data-explain="解說">
  <button class="opt">A</button>
  <button class="opt">B</button>
</div>

<div class="footer">
  <p>測試頁尾</p>
</div>

<script src="../assets/quiz.js"></script>
</body>
</html>
`;

const PLAN = [{ heading: '第一節', anchor: '第一段文字', prompt: '第一段示意' }];

const REWRITE_NO_MARK = `<h1>測試課程標題</h1>
<p class="meta">Step 1/2 · 測試節點</p>

<h2>第一節</h2>
<p>改寫後的第一段，保留 <a href="https://example.com/doc">外部連結</a>。</p>
<pre><code>const x = 1 &lt; 2;</code></pre>

<h2>第二節</h2>
<p>改寫後的第二段。</p>
`;

const PLAN2 = [
  { heading: '第一節', anchor: '第一段文字', prompt: '第一段示意' },
  { heading: '第二節', anchor: '第二段文字', prompt: '第二段示意' },
];

// A published lesson carrying the agent's image markers, as /to-image's plan
// step leaves it: markers sit in the live lesson, which is never rebuilt.
const LESSON_MARKED = LESSON.replace('<p>第二段文字。</p>', '<p>第二段文字。</p>\n\n<!--image:1-->');
const LESSON_MARKED2 = LESSON
  .replace('<p>第一段文字，含有 <a href="https://example.com/doc">外部連結</a>。</p>', '$&\n\n<!--image:1-->')
  .replace('<p>第二段文字。</p>', '$&\n\n<!--image:2-->');

async function makeRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'html-test-'));
  await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
  const subjectRoot = path.join(root, 'learn', 'demo');
  await fs.mkdir(path.join(subjectRoot, 'nodes', 'demo-node'), { recursive: true });
  await fs.mkdir(path.join(subjectRoot, 'lessons', 'demo-node'), { recursive: true });
  await fs.mkdir(path.join(subjectRoot, 'lessons', 'assets'), { recursive: true });
  await fs.writeFile(path.join(subjectRoot, 'MEMORY.md'), '---\nsubject: demo\nlanguage: zh-Hant\n---\n\n## How to teach me\n- 先給範例再解釋\n\n## Habits & constraints\n- 喜歡短段落\n');
  await fs.writeFile(path.join(subjectRoot, 'lessons', 'assets', 'shared.css'), ':root { --border: #eee; --muted: #888; --code-bg: #f3f4f6; }\n');
  await fs.writeFile(path.join(subjectRoot, 'lessons', 'demo-node', 'step-one.html'), LESSON);
  await fs.writeFile(path.join(subjectRoot, 'nodes', 'demo-node', 'step-one.mdx'),
    '---\nid: step-one\ntitle: 測試課程\nsubject: demo\nsources:\n  - "[[sources/demo/x.txt]]"\ncreated: 2026-01-01\nupdated: 2026-01-01\n---\n\n# 測試課程\n\n## Lesson\n\n一句摘要。\n');
  return root;
}

function lessonPath(root) {
  return path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one.html');
}
function mdxPath(root) {
  return path.join(root, 'learn', 'demo', 'nodes', 'demo-node', 'step-one.mdx');
}
function outputDir(root) {
  return path.join(root, 'learn', 'demo', 'output', 'demo-node', 'step-one');
}

function textClient(content, onCall) {
  return {
    chat: {
      completions: {
        create: async request => {
          if (onCall) onCall(request);
          return { id: 'test', choices: [{ message: { content } }] };
        },
      },
    },
  };
}

async function makeBatchRoot(stepIds, { planned = [] } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'html-batch-test-'));
  await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
  const subjectRoot = path.join(root, 'learn', 'demo');
  await fs.mkdir(path.join(subjectRoot, 'nodes', 'demo-node'), { recursive: true });
  await fs.mkdir(path.join(subjectRoot, 'lessons', 'demo-node'), { recursive: true });
  await fs.mkdir(path.join(subjectRoot, 'lessons', 'assets'), { recursive: true });
  await fs.writeFile(path.join(subjectRoot, 'MEMORY.md'), '---\nsubject: demo\nlanguage: zh-Hant\n---\n');
  await fs.writeFile(path.join(subjectRoot, 'lessons', 'assets', 'shared.css'), ':root { --border: #eee; --muted: #888; --code-bg: #f3f4f6; }\n');
  const dag = stepIds.map((id, i) => `  - id: ${id}\n    order: ${i + 1}`).join('\n');
  await fs.writeFile(path.join(subjectRoot, 'nodes', 'demo-node.mdx'),
    `---\nid: demo-node\ntitle: Demo\nsubject: demo\nsteps:\n${dag}\n---\n\n# Demo\n`);
  for (const id of stepIds) {
    await fs.writeFile(path.join(subjectRoot, 'lessons', 'demo-node', `${id}.html`), LESSON.replace('Step 1/2 · 測試節點', `Step ${id}`));
    const illustration = planned.includes(id) ? '\nillustration: planned' : '';
    await fs.writeFile(path.join(subjectRoot, 'nodes', 'demo-node', `${id}.mdx`),
      `---\nid: ${id}\ntitle: 測試課程\nsubject: demo\ncreated: 2026-01-01\nupdated: 2026-01-01${illustration}\n---\n\n# 測試課程\n\n## Lesson\n\n一句摘要。\n`);
  }
  return root;
}

test('stripLessonChrome removes quiz, nav, footer and script but keeps content', () => {
  const { body } = splitHtml(LESSON);
  const { cleaned, quiz, nav, footer, quizHeading } = stripLessonChrome(body);
  assert.match(cleaned, /測試課程標題/);
  assert.match(cleaned, /class="meta"/);
  assert.match(cleaned, /https:\/\/example\.com\/doc/);
  assert.match(cleaned, /const x = 1 &lt; 2;/);
  assert.doesNotMatch(cleaned, /class="quiz"/);
  assert.doesNotMatch(cleaned, /lesson-nav/);
  assert.doesNotMatch(cleaned, /下一步/);
  assert.doesNotMatch(cleaned, /class="footer"/);
  assert.doesNotMatch(cleaned, /複習題/);
  assert.doesNotMatch(cleaned, /<script/);
  assert.match(nav, /lesson-nav/);
  assert.match(nav, /下一步/);
  assert.match(quiz, /class="quiz"/);
  assert.match(footer, /測試頁尾/);
  assert.match(quizHeading, /複習題/);
});

test('assembleLesson reattaches head, nav, quiz, footer and script', () => {
  const { htmlTag, headInner, body } = splitHtml(LESSON);
  const chrome = stripLessonChrome(body);
  const out = assembleLesson({ htmlTag, headInner, body: '<h1>新標題</h1>', chrome });
  assert.ok(out.trimStart().startsWith('<!DOCTYPE html>'));
  assert.match(out, /<link rel="stylesheet" href="\.\.\/assets\/shared\.css">/);
  assert.match(out, /<h1>新標題<\/h1>/);
  assert.match(out, /lesson-nav/);
  assert.match(out, /<div class="quiz"/);
  assert.match(out, /測試頁尾/);
  assert.match(out, /<script src="\.\.\/assets\/quiz\.js"><\/script>/);
});

test('isHtmlParseable accepts balanced HTML and rejects mismatches', () => {
  assert.equal(isHtmlParseable('<p>a</p><pre><code>a &lt; b</code></pre>'), true);
  assert.equal(isHtmlParseable('<img src="x.png"><p>ok</p>'), true);
  assert.equal(isHtmlParseable('<p>a'), false);
  assert.equal(isHtmlParseable('<div><p>x</div></p>'), false);
  assert.equal(isHtmlParseable('   '), false);
});

test('extractCodeBlocks and extractHrefs find the originals', () => {
  assert.deepEqual(extractCodeBlocks('<pre><code>a &lt; b</code></pre>'), ['<code>a &lt; b</code>']);
  assert.deepEqual(extractHrefs('<a href="https://x.test/a">x</a><a class="b" href=\'/y\'>y</a>'), ['https://x.test/a', '/y']);
});

test('normalizeRewrite strips fences and body wrappers', () => {
  assert.equal(normalizeRewrite('```html\n<p>hi</p>\n```'), '<p>hi</p>');
  assert.equal(normalizeRewrite('<html><head><title>x</title></head><body><p>hi</p></body></html>'), '<p>hi</p>');
});

test('parseImageMarkers enforces count and order', () => {
  const plan = normalizeImagePlan([{ prompt: 'a' }, { prompt: 'b' }]);
  assert.equal(parseImageMarkers('X\n\n<!--image:1-->\n\nY\n\n<!--image:2-->', plan).length, 2);
  assert.throws(() => parseImageMarkers('<p>沒有標記</p>', plan), /No image markers/);
  assert.throws(() => parseImageMarkers('X\n\n<!--image:1-->', plan), /but the plan has 2/);
  assert.throws(() => parseImageMarkers('X\n\n<!--image:2-->\n\nY\n\n<!--image:1-->', plan), /out of order/);
});

test('validateRewrite preserves code blocks and links', () => {
  const originalBody = '<p>see <a href="https://x.test/a">link</a></p>\n<pre><code>const y = 1;</code></pre>';
  const good = '<p>看 <a href="https://x.test/a">連結</a></p>\n<pre><code>const y = 1;</code></pre>';
  assert.equal(validateRewrite({ rewritten: good, originalBody }), true);
  assert.throws(() => validateRewrite({ rewritten: good.replace('const y = 1;', 'const y = 2;'), originalBody }), /code block/);
  assert.throws(() => validateRewrite({ rewritten: good.replace('https://x.test/a', 'https://x.test/b'), originalBody }), /link/);
  assert.throws(() => validateRewrite({ rewritten: '<div><p>壞</p>', originalBody }), /valid HTML/);
});

test('markers become figures pointing at the known image path', () => {
  const plan = normalizeImagePlan([{ prompt: 'a' }, { prompt: 'b' }]);
  const out = markersToFigures('A\n\n<!--image:1-->\n\nB\n\n<!--image:2-->', plan, 'my-step');
  assert.match(out, /<figure class="lesson-figure"><img src="\.\/my-step-assets\/image-1\.webp" alt=""><figcaption>AI 生成示意圖<\/figcaption><\/figure>/);
  assert.match(out, /<img src="\.\/my-step-assets\/image-2\.webp"/);
  assert.doesNotMatch(out, /pending|待生成/);
});

test('ensureFigure is idempotent and migrates an old pending placeholder', () => {
  const legacy = 'A\n\n<figure class="lesson-figure pending">配圖 1 待生成</figure>\n\nB';
  const migrated = ensureFigure(legacy, 1, 'my-step');
  assert.match(migrated, /<img src="\.\/my-step-assets\/image-1\.webp"/);
  assert.doesNotMatch(migrated, /pending|待生成/);
  assert.equal(ensureFigure(migrated, 1, 'my-step'), migrated);
});

test('markerContexts attaches each marker to its preceding block', () => {
  const plan = normalizeImagePlan([{ heading: '第一節', prompt: 'a' }, { heading: '第二節', prompt: 'b' }]);
  const contexts = markerContexts('# 標題\n\n第一段。\n\n<!--image:1-->\n\n第二段。\n\n<!--image:2-->', plan);
  assert.equal(contexts[0].block, '第一段。');
  assert.equal(contexts[1].block, '第二段。');
  assert.equal(contexts[0].heading, '第一節');
});

test('prepareHtmlLesson backs up the original and writes a cleaned body', async () => {
  const root = await makeRoot();
  try {
    const { paths, chrome } = await prepareHtmlLesson({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    assert.match(await fs.readFile(paths.original, 'utf8'), /class="quiz"/);
    assert.doesNotMatch(chrome.cleaned, /class="quiz"/);
    assert.match(await fs.readFile(paths.cleaned, 'utf8'), /第一段文字/);
    // A later run keeps the first backup even if the lesson changes.
    await fs.writeFile(lessonPath(root), '<html><body><p>POISON</p></body></html>');
    const again = await prepareHtmlLesson({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    assert.match(await fs.readFile(again.paths.original, 'utf8'), /第一段文字/);
    assert.doesNotMatch(again.chrome.cleaned, /POISON/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article: one text call writes the rewrite and publishes it as the plain article', async () => {
  const root = await makeRoot();
  try {
    let textCalls = 0;
    let imageCalls = 0;
    const client = textClient(REWRITE_NO_MARK, request => {
      textCalls++;
      const payload = JSON.parse(request.messages[1].content);
      assert.equal(payload.imagePlan, undefined);
      assert.match(payload.html, /const x = 1 &lt; 2;/);
      assert.doesNotMatch(payload.html, /class="quiz"/);
    });
    const result = await generateHtmlArticle(
      { subject: 'demo', node: 'demo-node', step: 'step-one' },
      root,
      { client, generateImage: async () => { imageCalls++; return Buffer.from('00', 'hex'); } },
    );
    assert.equal(textCalls, 1);
    assert.equal(imageCalls, 0);
    const rewritten = await fs.readFile(result.rewritten, 'utf8');
    assert.match(rewritten, /改寫後的第一段/);
    assert.match(rewritten, /const x = 1 &lt; 2;/);
    assert.doesNotMatch(rewritten, /<!--image:/);
    // The live lesson becomes the published plain article: rewrite + chrome, no figures.
    const lesson = await fs.readFile(lessonPath(root), 'utf8');
    assert.match(lesson, /改寫後的第一段/);
    assert.doesNotMatch(lesson, /第一段文字，含有/);
    assert.match(lesson, /class="quiz"/);
    assert.match(lesson, /測試頁尾/);
    assert.match(lesson, /<script src="\.\.\/assets\/quiz\.js"><\/script>/);
    assert.doesNotMatch(lesson, /<figure/);
    assert.doesNotMatch(lesson, /<!--image:/);
    assert.equal(await fs.readFile(path.join(outputDir(root), 'plan.json'), 'utf8').catch(() => null), null);
    assert.doesNotMatch(await fs.readFile(mdxPath(root), 'utf8'), /^illustration:/m);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.textRequests, 1);
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('plan: markers in the live lesson are validated, plan recorded, illustration planned', async () => {
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    const result = await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    const lesson = await fs.readFile(result.lesson, 'utf8');
    // markers stay in place as the insertion contract; the lesson is not rebuilt
    assert.match(lesson, /<!--image:1-->/);
    assert.doesNotMatch(lesson, /<figure/);
    assert.match(lesson, /class="quiz"/);
    assert.match(lesson, /測試頁尾/);
    assert.match(lesson, /<script src="\.\.\/assets\/quiz\.js"><\/script>/);
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: planned$/m);
    assert.match(await fs.readFile(path.join(root, 'learn', 'demo', 'lessons', 'assets', 'shared.css'), 'utf8'), /\.lesson-figure/);
    const plan = JSON.parse(await fs.readFile(path.join(outputDir(root), 'plan.json'), 'utf8'));
    assert.equal(plan.length, 1);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('plan: a marker/plan mismatch fails without recording a plan or touching the lesson', async () => {
  const root = await makeRoot();
  try {
    const before = await fs.readFile(lessonPath(root), 'utf8');
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    await assert.rejects(
      finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root),
      /No image markers/);
    assert.equal(await fs.readFile(lessonPath(root), 'utf8'), before);
    assert.equal(await fs.readFile(path.join(outputDir(root), 'plan.json'), 'utf8').catch(() => null), null);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article: a malformed reply fails hard without a second text call', async () => {
  const root = await makeRoot();
  try {
    let textCalls = 0;
    const client = { chat: { completions: { create: async () => {
      textCalls++;
      return { id: 'bad', choices: [{ message: { content: '   ' } }] };
    } } } };
    await assert.rejects(
      generateHtmlArticle({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root,
        { client, generateImage: async () => Buffer.from('00', 'hex') }),
      /Article rewrite failed/);
    assert.equal(textCalls, 1);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article: reruns rewrite from the saved original, not the live lesson', async () => {
  const root = await makeRoot();
  try {
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'original.html'), LESSON);
    await fs.writeFile(lessonPath(root), '<html><body><p>POISON</p></body></html>');
    let seen = '';
    await generateHtmlArticle({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root,
      { client: textClient(REWRITE_NO_MARK, request => { seen = JSON.parse(request.messages[1].content).html; }), generateImage: async () => Buffer.from('00', 'hex') });
    assert.match(seen, /第一段文字/);
    assert.doesNotMatch(seen, /POISON/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('image: swaps the plan markers for figures in place, generates missing WebP figures, never calls the text model', async () => {
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED2);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN2));
    await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    await fs.mkdir(path.join(outputDir(root), 'assets'), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'assets', 'image-1.webp'), Buffer.from('89504e47', 'hex'));
    let imageCalls = 0;
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      client: { chat: { completions: { create: async () => { throw new Error('text model must not be called'); } } } },
      generateImage: async () => { imageCalls++; return Buffer.from('89504e470d0a1a0a', 'hex'); },
    });
    assert.equal(imageCalls, 1);
    const lesson = await fs.readFile(result.lesson, 'utf8');
    assert.match(lesson, /<img src="\.\/step-one-assets\/image-1\.webp"/);
    assert.match(lesson, /<img src="\.\/step-one-assets\/image-2\.webp"/);
    assert.doesNotMatch(lesson, /<!--image:/);
    assert.doesNotMatch(lesson, /lesson-figure pending/);
    assert.match(lesson, /class="quiz"/);
    assert.match(lesson, /測試頁尾/);
    assert.equal((await fs.readdir(path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets'))).length, 2);
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: done$/m);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.imageRequests, 1);
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('image: reuses figures already published in the lesson assets dir', async () => {
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED2);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN2));
    await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    const published = path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets');
    await fs.mkdir(published, { recursive: true });
    await fs.writeFile(path.join(published, 'image-1.webp'), Buffer.from('89504e47', 'hex'));
    await fs.writeFile(path.join(published, 'image-2.webp'), Buffer.from('89504e47', 'hex'));
    let imageCalls = 0;
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      generateImage: async () => { imageCalls++; return Buffer.from('89504e470d0a1a0a', 'hex'); },
    });
    assert.equal(imageCalls, 0);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.imageRequests, 0);
    assert.ok(manifest.images.every(figure => figure.reused));
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('image: compresses newly generated figures but leaves reused ones alone', async () => {
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED2);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN2));
    await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    await fs.mkdir(path.join(outputDir(root), 'assets'), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'assets', 'image-1.webp'), Buffer.from('REUSED', 'utf8'));
    const seen = [];
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      generateImage: async () => Buffer.from('RAW-IMAGE-BYTES', 'utf8'),
      compressImage: async (bytes, settings) => {
        seen.push({ text: bytes.toString('utf8'), settings });
        return Buffer.from('WEBP-COMPRESSED', 'utf8');
      },
    });
    assert.equal(seen.length, 1);
    assert.equal(seen[0].text, 'RAW-IMAGE-BYTES');
    assert.deepEqual(seen[0].settings, { quality: 80, maxWidth: 1600 });
    const assets = path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets');
    assert.equal(await fs.readFile(path.join(assets, 'image-1.webp'), 'utf8'), 'REUSED');
    assert.equal(await fs.readFile(path.join(assets, 'image-2.webp'), 'utf8'), 'WEBP-COMPRESSED');
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.deepEqual(manifest.images.map(figure => figure.compressed), [undefined, true]);
    assert.equal(manifest.images[1].originalBytes, 'RAW-IMAGE-BYTES'.length);
    assert.equal(manifest.images[1].bytes, 'WEBP-COMPRESSED'.length);
    assert.equal(manifest.compression.quality, 80);
    assert.equal(manifest.compression.maxWidth, 1600);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('image: a real provider PNG is re-encoded to a resized WebP', async () => {
  const { default: sharp } = await import('sharp');
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    const png = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#336699' } }).png().toBuffer();
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      generateImage: async () => png,
    });
    const file = path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets', 'image-1.webp');
    const bytes = await fs.readFile(file);
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, 1600);
    assert.equal(metadata.height, 800);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.images[0].compressed, true);
    assert.equal(manifest.images[0].originalBytes, png.length);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('image: keeps the original bytes and records a warning when compression fails', async () => {
  const root = await makeRoot();
  try {
    await fs.writeFile(lessonPath(root), LESSON_MARKED);
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    await finalizeHtmlPlan({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      generateImage: async () => Buffer.from('ORIGINAL-BYTES', 'utf8'),
      compressImage: async () => { throw new Error('not an image'); },
    });
    const assets = path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets');
    assert.equal(await fs.readFile(path.join(assets, 'image-1.webp'), 'utf8'), 'ORIGINAL-BYTES');
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.images[0].compressed, false);
    assert.deepEqual(manifest.imageCompressionWarnings, [{ index: 1, error: 'not an image' }]);
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('resolveImageCompression clamps env overrides and defaults to q80/1600', async () => {
  const saved = { quality: process.env.IMAGE_COMPRESS_QUALITY, width: process.env.IMAGE_MAX_WIDTH };
  try {
    delete process.env.IMAGE_COMPRESS_QUALITY;
    delete process.env.IMAGE_MAX_WIDTH;
    assert.deepEqual(resolveImageCompression(), { quality: 80, maxWidth: 1600 });
    process.env.IMAGE_COMPRESS_QUALITY = '250';
    process.env.IMAGE_MAX_WIDTH = '0';
    assert.deepEqual(resolveImageCompression(), { quality: 100, maxWidth: 0 });
    process.env.IMAGE_COMPRESS_QUALITY = 'bogus';
    process.env.IMAGE_MAX_WIDTH = '720';
    assert.deepEqual(resolveImageCompression(), { quality: 80, maxWidth: 720 });
  } finally {
    for (const [key, value] of [['IMAGE_COMPRESS_QUALITY', saved.quality], ['IMAGE_MAX_WIDTH', saved.width]]) {
      if (value == null) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('buildBrief reads language and teaching preferences from MEMORY.md', async () => {
  const root = await makeRoot();
  try {
    const brief = await buildBrief(root, 'demo');
    assert.match(brief, /語言：zh-Hant/);
    assert.match(brief, /先給範例再解釋/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('setStepIllustration writes the requested state and refreshes updated', async () => {
  const root = await makeRoot();
  try {
    assert.equal(await setStepIllustration(root, 'demo', 'demo-node', 'step-one', 'done'), true);
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: done$/m);
    await setStepIllustration(root, 'demo', 'demo-node', 'step-one', 'planned');
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: planned$/m);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('resolveStepType reads the step type and falls back to concept for absent or invalid values', async () => {
  const root = await makeRoot();
  try {
    const mdx = await fs.readFile(mdxPath(root), 'utf8');
    assert.equal(await resolveStepType(root, 'demo', 'demo-node', 'step-one'), 'concept');
    assert.equal(await resolveStepType(root, 'demo', 'demo-node', 'missing'), 'concept');
    await fs.writeFile(mdxPath(root), mdx.replace('subject: demo', 'subject: demo\ntype: procedure'));
    assert.equal(await resolveStepType(root, 'demo', 'demo-node', 'step-one'), 'procedure');
    await fs.writeFile(mdxPath(root), mdx.replace('subject: demo', 'subject: demo\ntype: bogus'));
    assert.equal(await resolveStepType(root, 'demo', 'demo-node', 'step-one'), 'concept');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('loadTypeRules reads the type file and returns empty for unknown types or dirs', async () => {
  const root = await makeRoot();
  try {
    const typesDir = path.join(root, 'types');
    await fs.mkdir(typesDir, { recursive: true });
    await fs.writeFile(path.join(typesDir, 'procedure.md'), 'TYPE-RULES-PROCEDURE\n');
    assert.equal(await loadTypeRules(root, 'procedure', typesDir), 'TYPE-RULES-PROCEDURE');
    assert.equal(await loadTypeRules(root, 'concept', typesDir), '');
    assert.equal(await loadTypeRules(root, 'procedure', path.join(root, 'nope')), '');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article: appends the step type rules to the system prompt and records the type', async () => {
  const root = await makeRoot();
  try {
    const mdx = await fs.readFile(mdxPath(root), 'utf8');
    await fs.writeFile(mdxPath(root), mdx.replace('subject: demo', 'subject: demo\ntype: procedure'));
    const typesDir = path.join(root, 'types');
    await fs.mkdir(typesDir, { recursive: true });
    await fs.writeFile(path.join(typesDir, 'procedure.md'), 'TYPE-RULES-PROCEDURE\n');
    let systemPrompt;
    const client = textClient(REWRITE_NO_MARK, request => { systemPrompt = request.messages[0].content; });
    const result = await generateHtmlArticle(
      { subject: 'demo', node: 'demo-node', step: 'step-one', typesDir },
      root,
      { client },
    );
    assert.match(systemPrompt, /本課型別規則（type: procedure）/);
    assert.match(systemPrompt, /TYPE-RULES-PROCEDURE/);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.stepType, 'procedure');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('resolveNodeSteps returns the node DAG ids in order', async () => {
  const root = await makeBatchRoot(['first', 'second', 'third']);
  try {
    assert.deepEqual(await resolveNodeSteps(root, 'demo', 'demo-node'), ['first', 'second', 'third']);
    await assert.rejects(resolveNodeSteps(root, 'demo', 'nope'), /No node container/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('resolveStepIllustration reads the state and falls back to none', async () => {
  const root = await makeBatchRoot(['s1'], { planned: ['s1'] });
  try {
    assert.equal(await resolveStepIllustration(root, 'demo', 'demo-node', 's1'), 'planned');
    assert.equal(await resolveStepIllustration(root, 'demo', 'demo-node', 'missing'), 'none');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('mapWithConcurrency keeps at most `limit` in flight and preserves order', async () => {
  let inFlight = 0;
  let peak = 0;
  const results = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async n => {
    inFlight++;
    peak = Math.max(peak, inFlight);
    await new Promise(resolve => setTimeout(resolve, 5));
    inFlight--;
    return n * 10;
  });
  assert.equal(peak, 2);
  assert.deepEqual(results, [10, 20, 30, 40, 50]);
});

test('article-batch rewrites each step once, in DAG order, without exceeding max-parallel', async () => {
  const root = await makeBatchRoot(['s1', 's2', 's3', 's4']);
  try {
    let inFlight = 0;
    let peak = 0;
    let calls = 0;
    const client = { chat: { completions: { create: async () => {
      calls++;
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise(resolve => setTimeout(resolve, 5));
      inFlight--;
      return { id: 'test', choices: [{ message: { content: REWRITE_NO_MARK } }] };
    } } } };
    const result = await generateNodeArticle({ subject: 'demo', node: 'demo-node', maxParallel: 2 }, root, { client });
    assert.equal(calls, 4);
    assert.equal(peak, 2);
    assert.equal(result.mode, 'article-batch');
    assert.equal(result.maxParallel, 2);
    assert.deepEqual(result.counts, { rewritten: 4, failed: 0, skipped: 0 });
    assert.deepEqual(result.steps.map(s => s.step), ['s1', 's2', 's3', 's4']);
    assert.deepEqual(result.steps.map(s => s.status), ['rewritten', 'rewritten', 'rewritten', 'rewritten']);
    for (const step of result.steps) assert.match(await fs.readFile(step.rewritten, 'utf8'), /改寫後的第一段/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article-batch skips steps without HTML and, with skip-existing, already-rewritten steps', async () => {
  const root = await makeBatchRoot(['s1', 's2', 's3'], { planned: ['s2'] });
  try {
    await fs.rm(path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 's3.html'));
    const planDir = path.join(root, 'learn', 'demo', 'output', 'demo-node', 's2');
    await fs.mkdir(planDir, { recursive: true });
    await fs.writeFile(path.join(planDir, 'plan.json'), '[]');
    let calls = 0;
    const client = { chat: { completions: { create: async () => {
      calls++;
      return { id: 'test', choices: [{ message: { content: REWRITE_NO_MARK } }] };
    } } } };
    const result = await generateNodeArticle({ subject: 'demo', node: 'demo-node', skipExisting: true }, root, { client });
    assert.equal(calls, 1);
    assert.deepEqual(result.counts, { rewritten: 1, failed: 0, skipped: 2 });
    const byStep = Object.fromEntries(result.steps.map(s => [s.step, s]));
    assert.equal(byStep.s1.status, 'rewritten');
    assert.equal(byStep.s2.status, 'skipped');
    assert.equal(byStep.s2.reason, 'already-rewritten');
    assert.equal(byStep.s3.status, 'skipped');
    assert.equal(byStep.s3.reason, 'no-html');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article-batch: skip-existing also skips steps that were already rewritten', async () => {
  const root = await makeBatchRoot(['s1', 's2']);
  try {
    const rewriteDir = path.join(root, 'learn', 'demo', 'output', 'demo-node', 's1');
    await fs.mkdir(rewriteDir, { recursive: true });
    await fs.writeFile(path.join(rewriteDir, 'rewritten.html'), '<p>既有改寫稿</p>\n');
    let calls = 0;
    const client = { chat: { completions: { create: async () => {
      calls++;
      return { id: 'test', choices: [{ message: { content: REWRITE_NO_MARK } }] };
    } } } };
    const result = await generateNodeArticle({ subject: 'demo', node: 'demo-node', skipExisting: true }, root, { client });
    assert.equal(calls, 1);
    const byStep = Object.fromEntries(result.steps.map(s => [s.step, s]));
    assert.equal(byStep.s1.status, 'skipped');
    assert.equal(byStep.s1.reason, 'already-rewritten');
    assert.equal(byStep.s2.status, 'rewritten');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('article-batch: one failing step does not abort the others', async () => {
  const root = await makeBatchRoot(['good', 'bad']);
  try {
    let calls = 0;
    const client = { chat: { completions: { create: async () => {
      calls++;
      if (calls === 2) throw new Error('boom');
      return { id: 'test', choices: [{ message: { content: REWRITE_NO_MARK } }] };
    } } } };
    const result = await generateNodeArticle({ subject: 'demo', node: 'demo-node', maxParallel: 1 }, root, { client });
    assert.deepEqual(result.counts, { rewritten: 1, failed: 1, skipped: 0 });
    const byStep = Object.fromEntries(result.steps.map(s => [s.step, s]));
    assert.equal(byStep.good.status, 'rewritten');
    assert.equal(byStep.bad.status, 'failed');
    assert.match(byStep.bad.error, /Article rewrite failed/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

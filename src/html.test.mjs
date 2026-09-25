import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { normalizeImagePlan } from './pipeline.mjs';
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
  finalizeHtmlArticle,
  generateHtmlImages,
  buildBrief,
  setStepIllustration,
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

const REWRITE = `<h1>測試課程標題</h1>
<p class="meta">Step 1/2 · 測試節點</p>

<h2>第一節</h2>
<p>改寫後的第一段，保留 <a href="https://example.com/doc">外部連結</a>。</p>
<pre><code>const x = 1 &lt; 2;</code></pre>

<!--image:1-->

<h2>第二節</h2>
<p>改寫後的第二段。</p>
`;

const REWRITE_NO_MARK = `<h1>測試課程標題</h1>
<p class="meta">Step 1/2 · 測試節點</p>

<h2>第一節</h2>
<p>改寫後的第一段，保留 <a href="https://example.com/doc">外部連結</a>。</p>
<pre><code>const x = 1 &lt; 2;</code></pre>

<h2>第二節</h2>
<p>改寫後的第二段。</p>
`;

const REWRITE2 = `<h1>測試課程標題</h1>
<p class="meta">Step 1/2 · 測試節點</p>

<h2>第一節</h2>
<p>改寫後的第一段，保留 <a href="https://example.com/doc">外部連結</a>。</p>
<pre><code>const x = 1 &lt; 2;</code></pre>

<!--image:1-->

<h2>第二節</h2>
<p>改寫後的第二段。</p>

<!--image:2-->
`;

const PLAN2 = [
  { heading: '第一節', anchor: '第一段文字', prompt: '第一段示意' },
  { heading: '第二節', anchor: '第二段文字', prompt: '第二段示意' },
];

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
  assert.match(out, /<figure class="lesson-figure"><img src="\.\/my-step-assets\/image-1\.png" alt=""><figcaption>AI 生成示意圖<\/figcaption><\/figure>/);
  assert.match(out, /<img src="\.\/my-step-assets\/image-2\.png"/);
  assert.doesNotMatch(out, /pending|待生成/);
});

test('ensureFigure is idempotent and migrates an old pending placeholder', () => {
  const legacy = 'A\n\n<figure class="lesson-figure pending">配圖 1 待生成</figure>\n\nB';
  const migrated = ensureFigure(legacy, 1, 'my-step');
  assert.match(migrated, /<img src="\.\/my-step-assets\/image-1\.png"/);
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

test('article: one text call writes the rewrite without touching lesson, plan or markers', async () => {
  const root = await makeRoot();
  try {
    let textCalls = 0;
    let imageCalls = 0;
    const before = await fs.readFile(lessonPath(root), 'utf8');
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
    assert.equal(await fs.readFile(lessonPath(root), 'utf8'), before);
    assert.equal(await fs.readFile(path.join(outputDir(root), 'plan.json'), 'utf8').catch(() => null), null);
    assert.doesNotMatch(await fs.readFile(mdxPath(root), 'utf8'), /^illustration:/m);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.textRequests, 1);
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('figures: agent markers become figures, plan recorded, illustration planned', async () => {
  const root = await makeRoot();
  try {
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'rewritten.html'), REWRITE);
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    const result = await finalizeHtmlArticle({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    const lesson = await fs.readFile(result.lesson, 'utf8');
    assert.match(lesson, /<figure class="lesson-figure"><img src="\.\/step-one-assets\/image-1\.png" alt=""><figcaption>AI 生成示意圖<\/figcaption><\/figure>/);
    assert.doesNotMatch(lesson, /pending|待生成/);
    assert.match(lesson, /class="quiz"/);
    assert.match(lesson, /測試頁尾/);
    assert.match(lesson, /<script src="\.\.\/assets\/quiz\.js"><\/script>/);
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: planned$/m);
    assert.match(await fs.readFile(path.join(root, 'learn', 'demo', 'lessons', 'assets', 'shared.css'), 'utf8'), /\.lesson-figure/);
    const plan = JSON.parse(await fs.readFile(path.join(outputDir(root), 'plan.json'), 'utf8'));
    assert.equal(plan.length, 1);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('figures: a marker/plan mismatch fails without overwriting the lesson', async () => {
  const root = await makeRoot();
  try {
    const before = await fs.readFile(lessonPath(root), 'utf8');
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'rewritten.html'), REWRITE.replace('<!--image:1-->', ''));
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN));
    await assert.rejects(
      finalizeHtmlArticle({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root),
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

test('image: generates missing figures, reuses existing PNGs, never calls the text model', async () => {
  const root = await makeRoot();
  try {
    await fs.mkdir(outputDir(root), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'rewritten.html'), REWRITE2);
    await fs.writeFile(path.join(outputDir(root), 'plan.input.json'), JSON.stringify(PLAN2));
    await finalizeHtmlArticle({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root);
    await fs.mkdir(path.join(outputDir(root), 'assets'), { recursive: true });
    await fs.writeFile(path.join(outputDir(root), 'assets', 'image-1.png'), Buffer.from('89504e47', 'hex'));
    let imageCalls = 0;
    const result = await generateHtmlImages({ subject: 'demo', node: 'demo-node', step: 'step-one' }, root, {
      client: { chat: { completions: { create: async () => { throw new Error('text model must not be called'); } } } },
      generateImage: async () => { imageCalls++; return Buffer.from('89504e470d0a1a0a', 'hex'); },
    });
    assert.equal(imageCalls, 1);
    const lesson = await fs.readFile(result.lesson, 'utf8');
    assert.match(lesson, /<img src="\.\/step-one-assets\/image-1\.png"/);
    assert.match(lesson, /<img src="\.\/step-one-assets\/image-2\.png"/);
    assert.doesNotMatch(lesson, /lesson-figure pending/);
    assert.equal((await fs.readdir(path.join(root, 'learn', 'demo', 'lessons', 'demo-node', 'step-one-assets'))).length, 2);
    assert.match(await fs.readFile(mdxPath(root), 'utf8'), /^illustration: done$/m);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.imageRequests, 1);
    assert.equal(manifest.status, 'completed');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
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

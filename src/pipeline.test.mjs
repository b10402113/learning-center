import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { generateArticle, normalizeImagePlan, parseImagePlanMarkers, insertImages, generateEvolinkImage, generateOpenAIImage, resolveImageProvider, textContent, MAX_IMAGES, responseError, outputDirName, slugifyTopic } from './pipeline.mjs';

test('slugifyTopic strips path and control characters', () => {
  assert.equal(slugifyTopic('a/b\\c:d*e?f|g<h>i"j'), 'a-b-c-d-e-f-g-h-i-j');
  assert.equal(slugifyTopic('   '), 'article');
  assert.equal(slugifyTopic('x'.repeat(80)).length, 30);
});
test('outputDirName builds article_<timestamp>_<topic> from the title', () => {
  const date = new Date(2026, 8, 25, 15, 10, 30);
  assert.equal(outputDirName('# 從 FTP 到 S3\n\n內文', '改寫', date), 'article_20260925_151030_從-FTP-到-S3');
  assert.equal(outputDirName('沒有標題的一行', '改寫需求可當主題', date), 'article_20260925_151030_改寫需求可當主題');
  assert.equal(outputDirName('# ../etc/passwd', 'x', date), 'article_20260925_151030_etc-passwd');
});

test('normalizeImagePlan accepts objects or a JSON string and numbers the items', () => {
  assert.deepEqual(normalizeImagePlan([{ anchor: 'x', prompt: 'y' }]), [{ index: 1, heading: '', anchor: 'x', prompt: 'y' }]);
  assert.equal(normalizeImagePlan('[{"anchor":"x"}]')[0].index, 1);
  assert.deepEqual(normalizeImagePlan(undefined), []);
  assert.throws(() => normalizeImagePlan([{}]), /needs an anchor or a prompt/);
  assert.throws(() => normalizeImagePlan('nope'), /must be a JSON array/);
});
test('parseImagePlanMarkers maps each marker to its preceding paragraph', () => {
  const plan = normalizeImagePlan([{ anchor: 'a', prompt: 'p1' }, { heading: '第二節', anchor: 'b', prompt: 'p2' }]);
  const markdown = '# 標題\n\n## 第一節\n\n第一段文字。\n\n<!--image:1-->\n\n## 第二節\n\n第二段文字。\n\n<!--image:2-->';
  const segments = parseImagePlanMarkers(markdown, plan, 'TMPL', 'STYLE-X');
  assert.equal(segments.length, 2);
  assert.equal(segments[0].text, '第一段文字。');
  assert.equal(segments[0].heading, '第一節');
  assert.equal(segments[1].heading, '第二節');
  assert.equal(segments[0].filename, 'image-1.png');
  assert.match(segments[0].prompt, /STYLE-X/);
  assert.match(segments[0].prompt, /FOCUS: p1/);
});
test('parseImagePlanMarkers fails hard on missing or out-of-order markers', () => {
  const plan = normalizeImagePlan([{ prompt: 'p1' }, { prompt: 'p2' }]);
  assert.throws(() => parseImagePlanMarkers('沒有標記。', plan, 'T', 'S'), /no image markers/);
  assert.throws(() => parseImagePlanMarkers('只有一段。\n\n<!--image:1-->', plan, 'T', 'S'), /preserved 1 of 2/);
  assert.throws(() => parseImagePlanMarkers('第一段。\n\n<!--image:2-->\n\n第二段。\n\n<!--image:1-->', plan, 'T', 'S'), /out of order/);
});
test('insertImages replaces each marker with its local image link', () => {
  const markdown = '第一段。\n\n<!--image:1-->\n\n第二段。\n\n<!--image:2-->';
  const out = insertImages(markdown, [{ index: 1, filename: 'image-1.png' }, { index: 2, filename: 'image-2.png' }]);
  assert.match(out, /第一段。\n\n!\[第 1 段配圖\]\(\.\/assets\/image-1\.png\)/);
  assert.match(out, /第二段。\n\n!\[第 2 段配圖\]\(\.\/assets\/image-2\.png\)/);
  assert.doesNotMatch(out, /<!--image:/);
});
test('generates one image per agent-chosen marker, never more than the cap', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const paragraphs = Array.from({ length: 8 }, (_, i) => `Paragraph number ${i + 1}.`);
    const imagePlan = Array.from({ length: MAX_IMAGES }, (_, i) => ({ anchor: `Paragraph number ${i + 1}.`, prompt: `focus ${i + 1}` }));
    const body = paragraphs.map((text, i) => i < MAX_IMAGES ? `${text}\n\n<!--image:${i + 1}-->` : text).join('\n\n');
    const client = { chat: { completions: { create: async () => ({
      id: 'test', choices: [{ message: { content: `# Revised\n\n${body}` } }]
    }) } } };
    let imageCalls = 0;
    const generateImage = async () => { imageCalls++; return Buffer.from('iVBORw0KGgo=', 'base64'); };
    const result = await generateArticle({ articleText: 'Original article.', brief: 'Rewrite', imagePlan }, root, { client, generateImage });
    assert.equal(imageCalls, MAX_IMAGES);
    assert.equal(result.images.length, MAX_IMAGES);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.imageRequests, MAX_IMAGES);
    const article = await fs.readFile(result.article, 'utf8');
    assert.equal((article.match(/!\[第 \d+ 段配圖\]\(\.\/assets\/image-\d+\.png\)/g) || []).length, MAX_IMAGES);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('rewrite once, then generate each planned image, with no later text call', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const events = [];
    const imagePlan = [{ anchor: '第一句', prompt: '焦點一' }, { anchor: '第二句', prompt: '焦點二' }];
    const rewritten = '# Revised\n\nRewritten first paragraph.\n\n<!--image:1-->\n\nRewritten second paragraph.\n\n<!--image:2-->';
    const client = {
      chat: { completions: { create: async request => {
        events.push('rewrite');
        const payload = JSON.parse(request.messages[1].content);
        assert.equal(payload.original_article, 'Original article.');
        assert.equal(payload.imagePlan.length, 2);
        return { id: 'test', choices: [{ message: { content: rewritten } }] };
      } } }
    };
    const generateImage = async request => {
      events.push('image');
      assert.match(request.prompt, /Rewritten (first|second) paragraph/);
      assert.doesNotMatch(request.prompt, /Original article/);
      return Buffer.from('iVBORw0KGgo=', 'base64');
    };
    const result = await generateArticle({ articleText: 'Original article.', brief: 'Rewrite', imagePlan }, root, { client, generateImage });
    assert.deepEqual(events, ['rewrite', 'image', 'image']);
    const article = await fs.readFile(result.article, 'utf8');
    assert.match(article, /first paragraph\.\n\n!\[第 1 段配圖\]/);
    assert.match(article, /second paragraph\.\n\n!\[第 2 段配圖\]/);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.textRequests, 1);
    assert.equal(manifest.imageRequests, 2);
    assert.equal(manifest.plan.length, 2);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('generates the planned images concurrently, then restores plan order', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const imagePlan = [{ anchor: '一', prompt: 'p1' }, { anchor: '二', prompt: 'p2' }, { anchor: '三', prompt: 'p3' }];
    const rewritten = '# Revised\n\nFirst.\n\n<!--image:1-->\n\nSecond.\n\n<!--image:2-->\n\nThird.\n\n<!--image:3-->';
    const client = { chat: { completions: { create: async () => ({ id: 'test', choices: [{ message: { content: rewritten } }] }) } } };
    let inFlight = 0;
    let maxInFlight = 0;
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    // If generation were serial the first call would wait out the timeout alone,
    // so maxInFlight stays 1 and the assertion below fails instead of hanging.
    const generateImage = async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      if (inFlight === imagePlan.length) release();
      await Promise.race([gate, new Promise(resolve => setTimeout(resolve, 100))]);
      inFlight--;
      return Buffer.from('89504e470d0a1a0a', 'hex');
    };
    const result = await generateArticle({ articleText: 'Original.', brief: 'Rewrite', imagePlan }, root, { client, generateImage });
    assert.equal(maxInFlight, imagePlan.length);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.deepEqual(manifest.images.map(x => x.index), [1, 2, 3]);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('a rewrite that drops an image marker fails and keeps partial files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const imagePlan = [{ anchor: 'a', prompt: 'p1' }, { anchor: 'b', prompt: 'p2' }];
    const client = { chat: { completions: { create: async () => ({
      id: 'test', choices: [{ message: { content: '# Revised\n\nOnly paragraph.\n\n<!--image:1-->' } }]
    }) } } };
    await assert.rejects(
      generateArticle({ articleText: 'Original.', brief: 'Rewrite', imagePlan }, root,
        { client, generateImage: async () => Buffer.from('00', 'hex') }),
      /preserved 1 of 2/);
    const outputRoot = path.join(root, 'output');
    const [dir] = await fs.readdir(outputRoot);
    const manifest = JSON.parse(await fs.readFile(path.join(outputRoot, dir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.status, 'failed');
    assert.match(manifest.error.message, /preserved 1 of 2/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('rejects an image plan longer than the cap before calling any API', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const imagePlan = Array.from({ length: MAX_IMAGES + 1 }, (_, i) => ({ prompt: `focus ${i + 1}` }));
    let called = false;
    const client = { chat: { completions: { create: async () => { called = true; return {}; } } } };
    await assert.rejects(
      generateArticle({ articleText: 'Original.', brief: 'Rewrite', imagePlan }, root,
        { client, generateImage: async () => Buffer.from('00', 'hex') }),
      /at most 5/);
    assert.equal(called, false);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('evolink image: create task with bearer key, poll, then download bytes', async () => {
  const calls = [];
  const png = Buffer.from('89504e470d0a1a0a', 'hex');
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', auth: init.headers?.Authorization });
    if (url === 'https://api.evolink.ai/v1/images/generations')
      return { ok: true, json: async () => ({ id: 'task-1', status: 'pending' }) };
    if (url === 'https://api.evolink.ai/v1/tasks/task-1')
      return { ok: true, json: async () => ({ status: 'completed', results: ['https://cdn.example.com/a.png'] }) };
    if (url === 'https://cdn.example.com/a.png')
      return { ok: true, arrayBuffer: async () => png };
    throw new Error(`Unexpected request: ${url}`);
  };
  const bytes = await generateEvolinkImage({ prompt: 'A quiet room.', model: 'gpt-image-2.5-sunburst',
    apiKey: 'test-key', baseUrl: 'https://api.evolink.ai', fetchImpl, pollIntervalMs: 0 });
  assert.deepEqual(bytes, png);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].auth, 'Bearer test-key');
  assert.equal(calls[1].method, 'GET');
});
test('evolink image: surfaces a failed task', async () => {
  const fetchImpl = async url => {
    if (url.endsWith('/v1/images/generations')) return { ok: true, json: async () => ({ id: 'task-x' }) };
    return { ok: true, json: async () => ({ status: 'failed',
      error: { code: 'content_policy_violation', message: 'Content policy violation.' } }) };
  };
  await assert.rejects(
    generateEvolinkImage({ prompt: 'x', model: 'm', apiKey: 'k', fetchImpl, pollIntervalMs: 0 }),
    error => error.code === 'content_policy_violation' && /Content policy violation/.test(error.message));
});
test('evolink image: captures the provider error on HTTP failure', async () => {
  const fetchImpl = async () => ({ ok: false, status: 402, json: async () => ({ error: {
    code: 'insufficient_quota', message: 'Insufficient quota. Please top up your account.'
  } }) });
  await assert.rejects(
    generateEvolinkImage({ prompt: 'x', model: 'm', apiKey: 'k', fetchImpl }),
    error => error.status === 402 && error.code === 'insufficient_quota'
      && /Insufficient quota/.test(error.message));
});
test('openai-compatible image: decodes inline b64_json', async () => {
  const calls = [];
  const png = Buffer.from('89504e470d0a1a0a', 'hex');
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', auth: init.headers?.Authorization, body: init.body });
    return { ok: true, status: 200, json: async () => ({ data: [{ b64_json: png.toString('base64') }] }) };
  };
  const bytes = await generateOpenAIImage({ prompt: 'A quiet room.', model: 'gpt-image-2.5-flare',
    size: '4:3', quality: 'medium', apiKey: 'test-key', baseUrl: 'https://kvkks.top/v1', fetchImpl });
  assert.deepEqual(bytes, png);
  assert.equal(calls[0].url, 'https://kvkks.top/v1/images/generations');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].auth, 'Bearer test-key');
  assert.deepEqual(JSON.parse(calls[0].body), { model: 'gpt-image-2.5-flare', prompt: 'A quiet room.', n: 1, size: '4:3', quality: 'medium' });
});
test('openai-compatible image: appends /v1 when the base URL omits it', async () => {
  let url;
  const fetchImpl = async request => { url = request; return { ok: true, status: 200, json: async () => ({ data: [{ b64_json: Buffer.from('00', 'hex').toString('base64') }] }) }; };
  await generateOpenAIImage({ prompt: 'x', model: 'm', apiKey: 'k', baseUrl: 'https://kvkks.top', fetchImpl });
  assert.equal(url, 'https://kvkks.top/v1/images/generations');
});
test('openai-compatible image: falls back to downloading data[0].url', async () => {
  const png = Buffer.from('89504e470d0a1a0a', 'hex');
  const fetchImpl = async url => url === 'https://cdn.example.com/a.png'
    ? { ok: true, status: 200, arrayBuffer: async () => png }
    : { ok: true, status: 200, json: async () => ({ data: [{ url: 'https://cdn.example.com/a.png' }] }) };
  const bytes = await generateOpenAIImage({ prompt: 'x', model: 'm', apiKey: 'k', baseUrl: 'https://kvkks.top/v1', fetchImpl });
  assert.deepEqual(bytes, png);
});
test('openai-compatible image: captures the provider error on HTTP failure', async () => {
  const fetchImpl = async () => ({ ok: false, status: 401, json: async () => ({ error: {
    code: 'invalid_api_key', message: 'Invalid API key.'
  } }) });
  await assert.rejects(
    generateOpenAIImage({ prompt: 'x', model: 'm', apiKey: 'k', baseUrl: 'https://kvkks.top/v1', fetchImpl }),
    error => error.status === 401 && error.code === 'invalid_api_key' && /Invalid API key/.test(error.message));
});
test('resolveImageProvider: explicit wins, otherwise infer from host', () => {
  assert.equal(resolveImageProvider({ EVOLINK_BASE_URL: 'https://api.evolink.ai' }), 'evolink');
  assert.equal(resolveImageProvider({ EVOLINK_BASE_URL: 'https://kvkks.top/v1' }), 'openai');
  assert.equal(resolveImageProvider({ IMAGE_PROVIDER: 'evolink', IMAGE_BASE_URL: 'https://kvkks.top/v1' }), 'evolink');
  assert.equal(resolveImageProvider({ IMAGE_PROVIDER: 'openai', IMAGE_BASE_URL: 'https://api.evolink.ai' }), 'openai');
  assert.equal(resolveImageProvider({}), 'evolink');
});
test('text content: accepts standard and data-wrapped chat responses', () => {
  assert.equal(textContent({ choices: [{ message: { content: 'top' } }] }), 'top');
  assert.equal(textContent({ data: { choices: [{ message: { content: 'wrapped' } }] } }), 'wrapped');
  assert.throws(() => textContent({ choices: [{ message: { content: '   ' } }] }), /Empty output/);
});
test('text content: accepts Responses-style output', () => {
  assert.equal(textContent({ id: 'resp_1', output: [{ type: 'message', content: [{ type: 'output_text', text: 'from responses' }] }] }), 'from responses');
  assert.equal(textContent({ output_text: 'flat responses' }), 'flat responses');
  assert.equal(textContent({ data: { output: [{ content: [{ text: 'wrapped responses' }] }] } }), 'wrapped responses');
});
test('response error: surfaces a 200-wrapped provider error', () => {
  const error = responseError({ error: { code: 'insufficient_quota', message: 'Insufficient quota.', status: 402 } });
  assert.equal(error.status, 402);
  assert.equal(error.code, 'insufficient_quota');
  assert.match(error.message, /Insufficient quota/);
  assert.equal(responseError({ choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }] }), undefined);
  assert.match(responseError({ choices: [{ finish_reason: 'error' }] }).message, /error response/);
});
test('a rewrite answered with a 200 error envelope is captured', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const client = { chat: { completions: { create: async () => ({
      id: 'resp_err', error: { code: 'insufficient_quota', message: 'Insufficient quota. Please top up.', status: 402 }
    }) } } };
    await assert.rejects(
      generateArticle({ articleText: 'Original.', brief: 'Rewrite', imagePlan: [{ prompt: 'focus' }] }, root,
        { client, generateImage: async () => Buffer.from('00', 'hex') }),
      /Generation failed \(402/);
    const outputRoot = path.join(root, 'output');
    const [dir] = await fs.readdir(outputRoot);
    const manifest = JSON.parse(await fs.readFile(path.join(outputRoot, dir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.error.status, 402);
    assert.equal(manifest.error.code, 'insufficient_quota');
    assert.match(manifest.error.message, /Insufficient quota/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('rewrite retries once when the provider returns an unparsable response', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    let calls = 0;
    const client = { chat: { completions: { create: async () => {
      calls++;
      if (calls === 1) return { id: 'resp_bad', output: [] };
      return { id: 'resp_ok', output: [{ content: [{ text: '# Revised\n\nRewritten paragraph.\n\n<!--image:1-->' }] }] };
    } } } };
    const result = await generateArticle({ articleText: 'Original.', brief: 'Rewrite', imagePlan: [{ prompt: 'focus' }] }, root,
      { client, generateImage: async () => Buffer.from('89504e470d0a1a0a', 'hex') });
    assert.equal(calls, 2);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.textRequests, 2);
    assert.equal(manifest.status, 'completed');
    assert.equal(manifest.responses.at(-1).id, 'resp_ok');
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('resumeDir skips the rewrite, reloads plan.json, and reuses existing images', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const out = path.join(root, 'output', 'article-prev');
    await fs.mkdir(path.join(out, 'assets'), { recursive: true });
    await fs.writeFile(path.join(out, 'original.md'), 'Original article.');
    await fs.writeFile(path.join(out, 'plan.json'), JSON.stringify([{ anchor: 'a', prompt: 'p1' }, { anchor: 'b', prompt: 'p2' }]));
    await fs.writeFile(path.join(out, 'rewritten.md'), '# Revised\n\nParagraph one.\n\n<!--image:1-->\n\nParagraph two.\n\n<!--image:2-->');
    await fs.writeFile(path.join(out, 'assets', 'image-1.png'), Buffer.from('89504e470d0a1a0a', 'hex'));
    const events = [];
    const client = { chat: { completions: { create: async () => { events.push('rewrite'); throw new Error('should not rewrite'); } } } };
    const generateImage = async () => { events.push('image'); return Buffer.from('89504e470d0a1a0a', 'hex'); };
    const result = await generateArticle({ brief: 'Rewrite', resumeDir: 'output/article-prev' }, root, { client, generateImage });
    assert.deepEqual(events, ['image']);
    const manifest = JSON.parse(await fs.readFile(result.manifest, 'utf8'));
    assert.equal(manifest.resumed, true);
    assert.equal(manifest.textRequests, 0);
    assert.equal(manifest.imageRequests, 1);
    assert.equal(manifest.images.length, 2);
    assert.equal(manifest.images[0].reused, true);
    assert.equal(manifest.images[1].reused, false);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('a failed run persists a de-identified error message', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'article-test-'));
  try {
    await fs.cp(new URL('../prompts', import.meta.url), path.join(root, 'prompts'), { recursive: true });
    const secret = 'SUPER-SECRET-SOURCE-TEXT-DO-NOT-LEAK';
    const client = { chat: { completions: { create: async () => {
      throw Object.assign(new Error(`524 upstream said: ${secret}`), { status: 524 });
    } } } };
    await assert.rejects(
      generateArticle({ articleText: secret, brief: 'Rewrite', imagePlan: [{ prompt: 'focus' }] }, root,
        { client, generateImage: async () => Buffer.from('00', 'hex') }),
      /Generation failed \(524/);
    const outputRoot = path.join(root, 'output');
    const [dir] = await fs.readdir(outputRoot);
    const manifest = JSON.parse(await fs.readFile(path.join(outputRoot, dir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.status, 'failed');
    assert.equal(manifest.error.status, 524);
    assert.match(manifest.error.message, /\[redacted\]/);
    assert.doesNotMatch(manifest.error.message, /SUPER-SECRET/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

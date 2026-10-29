import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { polishArticle, responseText, unwrapFence } from './polish.mjs';

process.env.TEXT_API_KEY = 'test-key-0123456789abcdef';
process.env.TEXT_MODEL = 'test-model';

const ok = content => ({
  ok: true,
  status: 200,
  json: async () => ({
    id: 'resp_1',
    choices: [{ message: { role: 'assistant', content }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 10, completion_tokens: 8 }
  })
});

const failure = (status, message) => ({
  ok: false,
  status,
  json: async () => ({ error: { message, code: 'bad' } })
});

test('潤飾後回傳模型文字，並正確送出文章', async () => {
  let sent;
  const fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body), headers: init.headers };
    return ok('這是潤飾後的文章。');
  };
  const result = await polishArticle({ articleText: '這是奇怪的文章。', save: false }, process.cwd(), { fetch });
  assert.equal(result.text, '這是潤飾後的文章。');
  assert.equal(sent.body.messages[1].content, '這是奇怪的文章。');
  assert.match(sent.body.messages[0].content, /潤飾/);
  assert.equal(sent.body.model, 'test-model');
  assert.match(sent.url, /\/v1\/chat\/completions$/);
  assert.match(sent.headers.Authorization, /^Bearer test-key/);
});

test('額外指令會附加到 system prompt', async () => {
  let sent;
  const fetch = async (url, init) => {
    sent = JSON.parse(init.body);
    return ok('好');
  };
  await polishArticle({ articleText: '文章', instruction: '把「資料庫」統一成「資料庫」', save: false }, process.cwd(), { fetch });
  assert.match(sent.messages[0].content, /本次額外要求/);
  assert.match(sent.messages[0].content, /統一/);
});

test('整篇被 code fence 包住時會拆掉', async () => {
  const fetch = async () => ok('```markdown\n# 標題\n\n內容。\n```');
  const result = await polishArticle({ articleText: '# 標題\n\n內容。', save: false }, process.cwd(), { fetch });
  assert.equal(result.text, '# 標題\n\n內容。');
});

test('文章內含程式碼區塊時不會誤拆', () => {
  const article = '# 標題\n\n```js\nconst a = 1;\n```\n\n說明。';
  assert.equal(unwrapFence(article), article);
});

test('429 會重試後成功', async () => {
  let calls = 0;
  const fetch = async () => {
    calls++;
    if (calls === 1) return failure(429, 'rate limited');
    return ok('完成');
  };
  const result = await polishArticle({ articleText: '文章', save: false }, process.cwd(), { fetch });
  assert.equal(result.text, '完成');
  assert.equal(calls, 2);
});

test('401 不重試，直接報錯', async () => {
  let calls = 0;
  const fetch = async () => {
    calls++;
    return failure(401, 'invalid api key');
  };
  await assert.rejects(
    polishArticle({ articleText: '文章', save: false }, process.cwd(), { fetch }),
    /401/
  );
  assert.equal(calls, 1);
});

test('HTTP 200 但 body 有 error 會視為失敗', async () => {
  const fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ error: { message: 'upstream blew up' } })
  });
  await assert.rejects(
    polishArticle({ articleText: '文章', save: false }, process.cwd(), { fetch }),
    /upstream blew up/
  );
});

test('會保存 original.md、polished.md 與 manifest.json', async () => {
  const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'polish-'));
  const fetch = async () => ok('潤飾結果');
  const result = await polishArticle(
    { articleText: '# 我的文章\n\n原文。', outputRoot },
    process.cwd(),
    { fetch }
  );
  const dir = path.dirname(result.article);
  assert.equal(await fs.readFile(path.join(dir, 'original.md'), 'utf8'), '# 我的文章\n\n原文。');
  assert.equal((await fs.readFile(path.join(dir, 'polished.md'), 'utf8')).trim(), '潤飾結果');
  const manifest = JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'completed');
  assert.equal(manifest.textRequests, 1);
  await fs.rm(outputRoot, { recursive: true, force: true });
});

test('responseText 支援 data 包裝與 content parts', () => {
  assert.equal(responseText({ data: { choices: [{ message: { content: 'a' } }] } }), 'a');
  assert.equal(responseText({ choices: [{ message: { content: [{ type: 'text', text: 'b' }] } }] }), 'b');
  assert.equal(responseText({ output_text: 'c' }), 'c');
});

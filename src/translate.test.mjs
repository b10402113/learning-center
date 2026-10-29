import assert from "node:assert/strict";
import test from "node:test";
import {
  hasSimplified,
  isMostlyChinese,
  mergeTranslatedPlan,
  needsChinese,
  parsePlanJson,
  planText,
  validateTranslatedArticle,
} from "./translate.mjs";

const BEFORE = `# 標題

第一段文字。

<!--code:1-->

<!--image:1-->

## 小節

第二段文字。

<!--image:2-->

## 收尾

最後一段。
`;

test("isMostlyChinese separates Chinese prose from English prose", () => {
  assert.equal(isMostlyChinese("這是一篇用繁體中文寫的文章，內容有完整的句子。"), true);
  assert.equal(isMostlyChinese("This is an English sentence with enough words to count."), false);
  assert.equal(isMostlyChinese(""), false);
});

test("isMostlyChinese ignores headings, comments and fenced code", () => {
  const english = `# 中文標題\n\n<!--code:1-->\n\nThis body is English and stays English.\n`;
  assert.equal(isMostlyChinese(english), false);
});

test("isMostlyChinese does not mistake Japanese or Korean for Chinese", () => {
  assert.equal(isMostlyChinese("これは日本語の記事です。漢字もあります。"), false);
  assert.equal(isMostlyChinese("이것은 한국어 기사입니다."), false);
});

test("hasSimplified only fires for Simplified characters", () => {
  assert.equal(hasSimplified("这个功能会说时"), true);
  assert.equal(hasSimplified("這個功能會說時"), false);
});

test("needsChinese asks for a call for English and Simplified Chinese only", () => {
  assert.equal(needsChinese("This body is English."), true);
  assert.equal(needsChinese("這段文字已經是繁體中文，不需要再翻。"), false);
  assert.equal(needsChinese("这段文字是简体中文，需要转成繁体。"), true);
});

test("validateTranslatedArticle keeps the structure and placeholders", () => {
  const after = BEFORE.replace("第一段文字。", "The first paragraph.").replace("第二段文字。", "第二段。");
  assert.equal(validateTranslatedArticle({ before: BEFORE, after }), `${after.trim()}\n`);
});

test("validateTranslatedArticle fails when a code placeholder is dropped", () => {
  const after = BEFORE.replace("<!--code:1-->", "code removed");
  assert.throws(() => validateTranslatedArticle({ before: BEFORE, after }), /code placeholders/);
});

test("validateTranslatedArticle fails when image markers are reordered", () => {
  const after = BEFORE.replace("<!--image:1-->", "<!--image:TMP-->")
    .replace("<!--image:2-->", "<!--image:1-->")
    .replace("<!--image:TMP-->", "<!--image:2-->");
  assert.throws(() => validateTranslatedArticle({ before: BEFORE, after }), /image markers/);
});

test("validateTranslatedArticle fails when a section disappears", () => {
  const after = BEFORE.replace("## 收尾\n\n最後一段。\n", "");
  assert.throws(() => validateTranslatedArticle({ before: BEFORE, after }), /section count/);
});

test("validateTranslatedArticle rejects an empty translation", () => {
  assert.throws(() => validateTranslatedArticle({ before: BEFORE, after: "   " }), /empty/);
});

test("parsePlanJson accepts a fenced JSON array", () => {
  assert.deepEqual(parsePlanJson('```json\n[{"heading":"A"}]\n```'), [{ heading: "A" }]);
});

test("mergeTranslatedPlan keeps anchors and takes the translated text", () => {
  const original = [{ heading: "A", anchor: "one sentence", prompt: "draw it" }];
  const merged = mergeTranslatedPlan(original, '[{"heading":"甲","anchor":"one sentence","prompt":"畫它"}]');
  assert.deepEqual(merged, [{ heading: "甲", anchor: "one sentence", prompt: "畫它" }]);
});

test("mergeTranslatedPlan rejects a different item count", () => {
  const original = [{ heading: "A", anchor: "one sentence", prompt: "draw it" }];
  assert.throws(() => mergeTranslatedPlan(original, "[]"), /keep 1 items/);
});

test("mergeTranslatedPlan requires heading and prompt", () => {
  const original = [{ heading: "A", anchor: "one sentence", prompt: "draw it" }];
  assert.throws(
    () => mergeTranslatedPlan(original, '[{"heading":"","anchor":"one sentence","prompt":"畫"}]'),
    /needs a heading/,
  );
});

test("planText joins heading and prompt for language detection", () => {
  assert.equal(planText([{ heading: "A", prompt: "draw it" }, { heading: "B", prompt: "draw more" }]), "A\ndraw it\nB\ndraw more");
});

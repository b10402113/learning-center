#!/usr/bin/env node
// 逐字稿前置清洗：拿掉時間軸、字幕序號、cue 識別碼、標頭與空行，只留純文字。
// 支援 SRT (.srt)、WebVTT (.vtt) 與一般純文字。
// 用法：node strip-timestamps.mjs <來源檔>
// 輸出：清洗後的純文字印到 stdout（不動來源檔）。
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: strip-timestamps.mjs <file>");
  process.exit(1);
}

const TS = /^\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}(?:\s*-->.*)?$/;

const clean = (s) =>
  s
    .replace(/<[^>]*>/g, "") // VTT 行內標籤：<v 講者> <c.loud> <00:00:01.000> 等
    .replace(/^[[(]\s*\d{1,2}:\d{2}(:\d{2})?([,.]\d{1,3})?\s*[\])]\s*/, "") // 行首內嵌時間
    .trim();

const text = readFileSync(file, "utf8");
const out = [];

for (const block of text.split(/\r?\n\s*\r?\n/)) {
  const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) continue;
  if (/^WEBVTT/i.test(lines[0]) || /^NOTE\b/i.test(lines[0])) continue;

  let body = lines;
  if (lines.length >= 2 && TS.test(lines[1])) body = lines.slice(2); // [cue 識別碼] + 時間軸
  else if (TS.test(lines[0])) body = lines.slice(1); // 時間軸

  for (const line of body) {
    const cleaned = clean(line);
    if (cleaned) out.push(cleaned);
  }
}

process.stdout.write(out.join("\n") + "\n");

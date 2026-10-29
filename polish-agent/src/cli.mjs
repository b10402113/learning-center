import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { polishArticle } from './polish.mjs';

const USAGE = `用法：
  node --env-file=.env src/cli.mjs <文章檔>
  node --env-file=.env src/cli.mjs <文章檔> --out 潤飾後.md
  cat 文章.md | node --env-file=.env src/cli.mjs -
  node --env-file=.env src/cli.mjs --text "要潤飾的文章"

選項：
  -o, --out <檔案>          另外把結果寫到指定檔案
  -i, --instruction <文字>  本次額外的潤飾要求
      --no-save             不建立 output/ 執行紀錄
  -h, --help                顯示說明

潤飾後的文章會印到 stdout，其餘訊息只會出現在 stderr。`;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

let options;
let positionals;
try {
  ({ values: options, positionals } = parseArgs({
    options: {
      out: { type: 'string', short: 'o' },
      instruction: { type: 'string', short: 'i' },
      text: { type: 'string' },
      'no-save': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' }
    },
    allowPositionals: true
  }));
} catch (error) {
  console.error(error.message);
  console.error(USAGE);
  process.exit(2);
}

if (options.help) {
  console.log(USAGE);
  process.exit(0);
}

const source = positionals[0];
let articleText = options.text ?? '';
let articleFile;

if (!articleText) {
  if (source && source !== '-') articleFile = source;
  else if (source === '-' || !process.stdin.isTTY) articleText = await readStdin();
}

if (!articleText.trim() && !articleFile) {
  console.error(USAGE);
  process.exit(2);
}

try {
  const result = await polishArticle({
    articleText,
    articleFile,
    instruction: options.instruction,
    outFile: options.out,
    save: !options['no-save']
  });
  process.stdout.write(`${result.text}\n`);
  if (options.out) console.error(`已寫入 ${options.out}`);
  if (result.article) console.error(`執行紀錄：${result.article.replace(/polished\.md$/, '')}`);
} catch (error) {
  console.error(`潤飾失敗：${error.message}`);
  process.exitCode = 1;
}

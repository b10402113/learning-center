import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateArticle, generateEvolinkImage, generateOpenAIImage, resolveImageProvider, textContent } from './pipeline.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'output');

const usage = `用法: node src/test.ts <模式> [選項]

模式:
  image [提示詞...]      只測生圖（呼叫 Evolink API，輸出一張 PNG）
  text  [request.json]   只測文章改寫（呼叫文字模型，不生成圖片）
  article [request.json] 測完整文章流程（改寫 + 逐段生圖，沿用 pipeline）
  all   [request.json]   依序測 text、image、article

選項:
  --request <file>  指定請求 JSON（預設 request.example.json）
  --resume <dir>    續跑既有 output 目錄（僅 article / all）
  --model <id>      自訂文字模型 ID（覆寫 TEXT_MODEL，僅 text / all）

範例:
  node src/test.ts image "安靜的社區共讀空間，溫暖編輯插畫，無文字"
  node src/test.ts text request.example.json
  node src/test.ts text request.example.json --model google/gemini-3.8-flash
  node src/test.ts article request.example.json

注意: article / all 使用的請求 JSON 必須提供 imagePlan（1–5 項，每項含 anchor 與 prompt）；
      續跑時可省略，會沿用輸出資料夾內的 plan.json。`;

interface RequestInput {
  articleText?: string;
  articleFile?: string;
  brief: string;
  imageStyle?: string;
  imagePlan?: Array<{ heading?: string; anchor?: string; prompt?: string }>;
  resumeDir?: string;
}

const defaultArticleFile = 'materials/example.md';

interface ParsedArgs {
  mode: string;
  positional: string[];
  flags: Record<string, string>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [mode = '', ...rest] = argv;
  const flags: Record<string, string> = {};
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (token === '--request' || token === '--resume') {
      flags[token.slice(2)] = rest[++i] ?? '';
    } else if (token.startsWith('--')) {
      flags[token.slice(2)] = rest[++i] ?? '';
    } else {
      positional.push(token);
    }
  }
  return { mode, positional, flags };
}

async function loadRequest(file?: string): Promise<RequestInput> {
  const target = path.resolve(projectRoot, file || 'request.example.json');
  const parsed = JSON.parse(await fs.readFile(target, 'utf8')) as RequestInput;
  if (!parsed.brief?.trim()) throw new Error(`${target} 缺少 brief`);
  if (!parsed.articleText?.trim()) {
    const articleFile = parsed.articleFile?.trim() || defaultArticleFile;
    const articlePath = path.resolve(projectRoot, articleFile);
    parsed.articleText = await fs.readFile(articlePath, 'utf8');
    console.log(`[load] 文章來源 ${articleFile}`);
  }
  if (!parsed.articleText.trim()) throw new Error(`${target} 找不到文章內容`);
  return parsed;
}

async function testImage(promptArg?: string): Promise<void> {
  const prompt = promptArg?.trim()
    || 'Clean flat explainer infographic in Traditional Chinese: a short title, two rows of navy-blue line-art icons with pale mint-green label boxes and one line of Traditional Chinese explanation, warm off-white background';
  const model = process.env.IMAGE_MODEL || process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
  const size = process.env.IMAGE_SIZE || '4:3';
  const resolution = process.env.IMAGE_RESOLUTION || '1K';
  const quality = process.env.IMAGE_QUALITY || 'medium';
  const provider = resolveImageProvider();
  const generateImage = provider === 'evolink' ? generateEvolinkImage : generateOpenAIImage;
  console.log(`[image] provider=${provider} model=${model} size=${size} resolution=${resolution} quality=${quality}`);
  console.log(`[image] prompt=${prompt}`);
  const started = Date.now();
  const bytes = await generateImage({ prompt, model, size, resolution, quality });
  await fs.mkdir(outputRoot, { recursive: true });
  const file = path.join(outputRoot, `test-image-${Date.now()}.png`);
  await fs.writeFile(file, bytes);
  console.log(`[image] ok ${bytes.length} bytes in ${Date.now() - started}ms`);
  console.log(`[image] -> ${file}`);
}

async function createTextClient() {
  const apiKey = process.env.TEXT_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Set TEXT_API_KEY');
  const { default: OpenAI } = await import('openai');
  return new OpenAI({
    apiKey,
    baseURL: process.env.TEXT_BASE_URL || process.env.OPENAI_BASE_URL || undefined,
    maxRetries: 2,
    timeout: 600000
  });
}

async function testText(request: RequestInput, modelOverride?: string): Promise<void> {
  const rewritePrompt = await fs.readFile(path.join(projectRoot, 'prompts', 'rewrite.txt'), 'utf8');
  const model = modelOverride?.trim()
    || process.env.TEXT_MODEL || process.env.OPENAI_TEXT_MODEL || 'gpt-6-astra';
  const client = await createTextClient();
  console.log(`[text] model=${model}`);
  const started = Date.now();
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: rewritePrompt },
      { role: 'user', content: JSON.stringify({ brief: request.brief, original_article: request.articleText }) }
    ]
  } as never);
  const content = textContent(response).replace(/\r\n/g, '\n');
  await fs.mkdir(outputRoot, { recursive: true });
  const file = path.join(outputRoot, `test-text-${Date.now()}.md`);
  await fs.writeFile(file, content);
  console.log(`[text] ok ${content.length} chars in ${Date.now() - started}ms`);
  console.log(`[text] -> ${file}`);
  console.log('----- 改寫結果 -----');
  console.log(content);
  console.log('--------------------');
}

async function testArticle(request: RequestInput, resumeDir?: string): Promise<void> {
  console.log(`[article] resume=${resumeDir || '(new)'}`);
  const started = Date.now();
  const result = await generateArticle({ ...request, resumeDir }, projectRoot);
  console.log(`[article] ok in ${Date.now() - started}ms`);
  console.log(`[article] article  -> ${result.article}`);
  console.log(`[article] images   -> ${result.images.length} 張`);
  console.log(`[article] manifest -> ${result.manifest}`);
}

async function main(): Promise<void> {
  const { mode, positional, flags } = parseArgs(process.argv.slice(2));
  if (!mode || mode === 'help' || mode === '--help' || mode === '-h') {
    console.log(usage);
    return;
  }
  const requestFile = flags.request || positional[0];
  switch (mode) {
    case 'image':
      await testImage(positional.join(' '));
      break;
    case 'text':
      await testText(await loadRequest(requestFile), flags.model);
      break;
    case 'article':
      await testArticle(await loadRequest(requestFile), flags.resume);
      break;
    case 'all':
      await testText(await loadRequest(requestFile), flags.model);
      await testImage();
      await testArticle(await loadRequest(requestFile), flags.resume);
      break;
    default:
      throw new Error(`未知模式: ${mode}\n\n${usage}`);
  }
}

main().catch(error => {
  console.error(`\n[error] ${error?.message ?? error}`);
  process.exitCode = 1;
});

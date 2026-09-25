import fs from 'node:fs/promises';
import { generateArticle } from './pipeline.mjs';
const input = process.argv[2];
if (!input) throw new Error('Usage: node --env-file=.env src/cli.mjs request.json');
try {
  console.log(JSON.stringify(await generateArticle(JSON.parse(await fs.readFile(input, 'utf8')), process.cwd()), null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

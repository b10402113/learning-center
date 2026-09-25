import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { prepareHtmlLesson, generateHtmlArticle, finalizeHtmlArticle, generateHtmlImages } from './html.mjs';

const usage = `Usage:
  node src/html-cli.mjs clean   --subject <s> --node <n> --step <t> [--root <dir>]
  node src/html-cli.mjs article --subject <s> --node <n> --step <t> [--brief <text>] [--root <dir>]
  node src/html-cli.mjs figures --subject <s> --node <n> --step <t> [--plan <file>] [--root <dir>]
  node src/html-cli.mjs image   --subject <s> --node <n> --step <t> [--root <dir>]`;

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    subject: { type: 'string' },
    node: { type: 'string' },
    step: { type: 'string' },
    plan: { type: 'string' },
    brief: { type: 'string' },
    root: { type: 'string' },
  },
  allowPositionals: true,
});

const mode = positionals[0];
const root = values.root || process.cwd();
const target = { subject: values.subject, node: values.node, step: values.step };

function requireTarget() {
  for (const key of ['subject', 'node', 'step'])
    if (!target[key]) throw new Error(`--${key} is required\n\n${usage}`);
}

try {
  if (!mode || mode === 'help' || mode === '--help' || mode === '-h') {
    console.log(usage);
  } else {
    requireTarget();
    if (mode === 'clean') {
      const { paths } = await prepareHtmlLesson(target, root);
      console.log(JSON.stringify({
        mode, subject: target.subject, node: target.node, step: target.step,
        outDir: paths.outDir,
        original: paths.original,
        cleaned: paths.cleaned,
        planInput: paths.planInput,
      }, null, 2));
    } else if (mode === 'article') {
      const result = await generateHtmlArticle({ ...target, brief: values.brief }, root);
      console.log(JSON.stringify(result, null, 2));
    } else if (mode === 'figures') {
      const imagePlan = values.plan ? JSON.parse(await fs.readFile(values.plan, 'utf8')) : undefined;
      const result = await finalizeHtmlArticle({ ...target, imagePlan }, root);
      console.log(JSON.stringify(result, null, 2));
    } else if (mode === 'image') {
      const result = await generateHtmlImages(target, root);
      console.log(JSON.stringify(result, null, 2));
    } else {
      throw new Error(`unknown mode: ${mode}\n\n${usage}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

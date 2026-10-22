import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { prepareHtmlLesson, generateHtmlArticle, generateNodeArticle, finalizeHtmlPlan, generateHtmlImages } from './html.mjs';

const usage = `Usage:
  node legacy/src/html-cli.mjs clean   --subject <s> --node <n> --step <t> [--root <dir>]
  node legacy/src/html-cli.mjs article --subject <s> --node <n> --step <t> [--brief <text>] [--type <t>] [--types-dir <dir>] [--root <dir>]
  node legacy/src/html-cli.mjs article-batch --subject <s> --node <n> [--max-parallel <n>] [--skip-existing] [--brief <text>] [--types-dir <dir>] [--root <dir>]
  node legacy/src/html-cli.mjs plan    --subject <s> --node <n> --step <t> [--plan <file>] [--root <dir>]
  node legacy/src/html-cli.mjs image   --subject <s> --node <n> --step <t> [--root <dir>]`;

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    subject: { type: 'string' },
    node: { type: 'string' },
    step: { type: 'string' },
    plan: { type: 'string' },
    brief: { type: 'string' },
    type: { type: 'string' },
    'types-dir': { type: 'string' },
    'max-parallel': { type: 'string' },
    'skip-existing': { type: 'boolean' },
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

function requireSubjectNode() {
  for (const key of ['subject', 'node'])
    if (!target[key]) throw new Error(`--${key} is required\n\n${usage}`);
}

try {
  if (!mode || mode === 'help' || mode === '--help' || mode === '-h') {
    console.log(usage);
  } else {
    if (mode === 'article-batch') requireSubjectNode();
    else requireTarget();
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
      const result = await generateHtmlArticle({ ...target, brief: values.brief, type: values.type, typesDir: values['types-dir'] }, root);
      console.log(JSON.stringify(result, null, 2));
    } else if (mode === 'article-batch') {
      const result = await generateNodeArticle({
        subject: target.subject, node: target.node,
        brief: values.brief, type: values.type, typesDir: values['types-dir'],
        maxParallel: values['max-parallel'], skipExisting: values['skip-existing'],
      }, root);
      console.log(JSON.stringify(result, null, 2));
    } else if (mode === 'plan') {
      const imagePlan = values.plan ? JSON.parse(await fs.readFile(values.plan, 'utf8')) : undefined;
      const result = await finalizeHtmlPlan({ ...target, imagePlan }, root);
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

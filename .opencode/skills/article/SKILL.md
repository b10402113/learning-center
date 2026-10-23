---
name: article
description: Write one Markdown article per missing step from the node plan and source slices, then plan and generate its illustrations. Thin shell over src/article-cli.mjs; verify is the hard gate.
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--images]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--images]`.

This skill is a thin shell. It never writes prose or calls a model itself: `src/article-cli.mjs` reads the node's `steps` array, slices each step's cited source lines, makes one text request per missing article, and writes `learn/<subject>/nodes/<node>/<step>.md`. With `--images` it then plans illustrations from the finished article and writes WebP files to `learn/<subject>/nodes/<node>/<step>-assets/`.

1. **Resolve the target.** The argument is `subject/node`. Run from the repo root. Do not infer the subject or node from prose.

2. **Write the articles.**

   ```bash
   node src/article-cli.mjs article --subject <subject> --node <node>
   ```

   - Missing or H1-only articles are generated; articles with a body are skipped.
   - `--step <id>` runs a single step.
   - `--force` regenerates an article that already has a body.
   - `--max-parallel <n>` changes the article concurrency (default 2).
   - The CLI refuses a step that cites a PDF; cite the extracted `.txt`.
   - The CLI prepends `# <step title>` so the H1 always matches the node plan.

3. **Generate images only when asked.** Re-run with `--images`, or run the image mode directly:

   ```bash
   node src/article-cli.mjs image --subject <subject> --node <node>
   ```

   - The image count comes from the finished article's Traditional Chinese character count: <900 → 1, 900–1,499 → 2, 1,500–2,099 → 3, 2,100–2,699 → 4, ≥2,700 → 5.
   - One planning text call decides where the figures go; each figure is generated once and compressed to `image-N.webp`.
   - Existing images are reused. A second run with no changes makes no requests. `--force` replans and regenerates every figure.

4. **Report the result.** The CLI prints one JSON object: per-step `status` (`generated`, `skipped`, `reused`, `no-article`), and the `verify` result. Every failed verify check must be fixed before the run counts as complete.

5. **Do not hand-write articles or images.** If the output fails verify, fix the node's sources or purpose and rerun; do not patch the generated file to hide a broken citation.

Completion: every step that needed an article has one, its H1 matches the node plan, and `node scripts/verify.mjs --node <subject>/<node>` exits 0.

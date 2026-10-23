# Legacy

This directory holds the retired HTML-lesson pipeline. Nothing in the active
Markdown course flow imports from here; it is kept for reference and for
re-reading old lessons.

## Moved here

| Path | Why |
| --- | --- |
| `src/html.mjs`, `src/html-cli.mjs`, `src/html.test.mjs` | HTML lesson publish / image pipeline |
| `src/pipeline.mjs`, `src/pipeline.test.mjs`, `src/cli.mjs`, `src/test.ts` | Old Markdown rewrite + image pipeline and its manual test harness |
| `prompts/html-rewrite.txt`, `prompts/publisher.txt`, `prompts/rewrite.txt`, `prompts/image.txt` | Prompts for the retired HTML and Markdown rewrite pipelines; the image template is a copy of the active prompt so the old harness still runs |
| `.opencode/skills/teach/`, `.opencode/skills/teach-chinese/` | Interactive HTML teaching |
| `.opencode/skills/to-article/`, `.opencode/skills/to-image/` | HTML rewrite and figure generation |
| `.opencode/skills/probe/`, `.opencode/skills/tackle/` | Mastery probing and step verification |
| `.opencode/skills/batch-nodes/`, `.opencode/skills/reset-nodes/`, `.opencode/skills/sync-course/` | Skills built on the HTML/MDX pipeline |
| `.opencode/agent/teach-agent.md`, `article-agent.md`, `humanize-agent.md` | Agents for the retired pipeline |
| `scripts/generate-data.mjs`, `generate-data.d.mts` | MDX graph generator for the old viewer |
| `scripts/reset-nodes.mjs` | Removes old MDX lesson output |

Also retired with this move: `learn/**/elements/`, `learn/**/mastery.md`, and
`learn/**/output/`. Those directories were already removed from the active tree
with the old subjects; the plan intentionally does not migrate deleted `learn/`
content.

## Not moved

- `legacy/tune/` — archived transcripts, unchanged.
- The nested `article-agent/` repository — untouched by the course refactor.
- `sources/` — immutable inputs.
- `prompts/image.txt` stays in place: the Markdown article CLI reuses the same
  illustration style prompt.

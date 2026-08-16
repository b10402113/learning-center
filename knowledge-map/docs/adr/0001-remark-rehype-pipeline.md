# ADR-0001: Replace hand-rolled markdown renderer with a remark/rehype pipeline

The generator (`scripts/generate-data.mjs`) rendered lesson markdown with a bespoke
regex/string renderer. The curriculum is about to contain fenced code blocks,
math, and interactive examples, which will outgrow the bespoke renderer. We
switched to a unified remark/rehype pipeline running at generate time, producing
HTML strings into `graph.json` — the client (DetailPane) continues to consume
pre-rendered HTML via `dangerouslySetInnerHTML` with zero changes.

Considered but rejected: keeping the bespoke renderer and adding minimal
code-fence/math handling (fragile at every new content type), and rendering
markdown on the client (would ship a runtime markdown engine in the bundle).

The pipeline output passes through `rehype-sanitize` with a whitelist that
preserves `.wikilink[data-target]` and code classes.

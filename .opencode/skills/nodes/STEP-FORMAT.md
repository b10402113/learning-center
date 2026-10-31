# Step Article Format

`learn/<subject>/nodes/<node-id>/<step-id>.md` — one article. Step files live inside a subdirectory named after their node, never directly in `nodes/`. The node's `steps` array owns the step's id, purpose, and sources; the publisher owns the title and writes it into both the article's H1 and the step entry. The article has no frontmatter.

## Skeleton (written by `/nodes`)

An empty file — zero bytes, no heading.

A skeleton exists so the node's `## Steps` link resolves and verify passes. The publisher writes the H1 and the body; `/article` replaces the empty file with the full article.

## Article (written by `/article`, figures rendered by `/generate-images`)

````markdown
# <Title chosen by the publisher>

<Opening from a reader's situation — no learning-goal banner, no source commentary.>

## <Section>

<Short paragraphs in the subject's language.>

<!-- source: sources/<subject>/<file>#Lx-Ly -->
```<language>
<verbatim source code>
```

## <Section>

<...>

![第 N 段配圖](./<step-id>-assets/image-N.webp)
````

## Rules

- The first line is the H1. The publisher chooses it from a heading or phrase in the source, translated faithfully, then writes it back to the step entry; the two must match exactly. There is no frontmatter.
- The file lives at `nodes/<node-id>/<step-id>.md`; its images live at `nodes/<node-id>/<step-id>-assets/` and are referenced with a relative path.
- Before `/generate-images`, each planned figure is an `<!--image:N-->` marker on its own line, surrounded by blank lines. `/generate-images` turns each marker into the image line above, with no caption.
- Do not write a sources section, learning-goal section, or practice section; course-app aggregates sources from the node's step entries. Generated quizzes live in `<step-id>.quiz.json`, not in the article.
- Every fenced code block needs the comment directly above it: `<!-- source: sources/<subject>/<file>#Lx-Ly -->` for quoted code, or `<!-- derived -->` for code written from the prose. `quiz` blocks are data and carry no provenance comment.
- Source citations inside the article use `[[sources/<subject>/<file>#Lx-Ly]]` line ranges, never slugs and never PDFs.
- Relative Markdown links must resolve from the article's directory.

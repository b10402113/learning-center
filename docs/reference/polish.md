# Polish Template Protocol

Shared contract for the polish-template mechanism: `learn-init` lists the templates, `nodes` applies the chosen one via `polish-agent`. A **polish template** is a per-author style guide in `polish/<author-slug>/` — a tone specification in `polish.md` plus one or more **example articles** in `examples/` that show the style applied to a real lesson. The polish-agent reads both before rewriting: the spec says *how the voice works*, the examples show *what the output looks like*. Articles are always drafted directly in the subject's `language`; the template shapes the polish pass only, never the initial draft.

## Polish directory

`polish/<author-slug>/` holds one author's polish template:

- **`polish.md`** (tone specification) — the hand-written style guide: Style, Voice, Explanation moves, Style habits, Rhetorical devices, Exemplars, Negative list.
- **`examples/<title>.md`** (example articles) — full sample articles written in the style. The polish-agent reads them as the concrete target to match: the sentence rhythm, structure, and handling of terms.

The slug is kebab-case (`Justin Sung` → `justin-sung`). Commands and references use the slug. Templates are written by hand — there is no extraction skill; a template is a deliberate style description plus worked examples, not a transcription artifact.

## Tone specification format

```markdown
---
id: <author-slug>
title: <Author Display Name>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Polish template — <Author Display Name>

## Style
One or two lines: the whole style in one breath, framed as instructions to the polish-agent.

## Voice
The person or persona the rewrite should sound like.

## Explanation moves
How this voice teaches — opens, frames, refutes, lands the payoff. Behavior, not verbatim words, so the moves transfer to any output language.

## Style habits
Person, address, sentence rhythm, value vocabulary, signposting.

## Rhetorical devices
The recurring figures — contrast, ranking, hyperbole, three-part lists, reframes.

## Exemplars
- "<illustrative quote in the style>" — what it demonstrates
- ...

## Negative list
What this style never does.
```

Exemplars are illustrative style anchors, not attribution records; nothing in the template may point at transcript files.

## Example article format

`polish/<author-slug>/examples/<title>.md` — a full article written in the template's style. No frontmatter required. One article per file; add as many as the style needs. The polish-agent reads every example before rewriting and matches the target output to them: sentence rhythm, how it opens and lands, how terms are handled. Each example is a finished lesson (a phenomenon, a mechanism, a payoff), not a fragment.

## Consumption

`learn-init` auto-lists the available templates (folders under `polish/*/` that contain a `polish.md`) and writes the learner's choice into `MEMORY.md` frontmatter:

- `language` — the output language for all prose in this subject.
- `polish` — the author slug, or `none`.

Rules:

- `polish: none` (or missing) → no polish pass; the drafted article is the final article.
- `polish: <slug>` but `polish/<slug>/polish.md` missing → skip the polish pass and warn that the template must be added.
- The polish-agent reads `polish/<slug>/polish.md` **and** every `polish/<slug>/examples/*.md` before rewriting — the spec for the voice, the examples as the concrete target to match. It reads the article to understand it, then **regenerates the body from scratch** in plain language — it does not edit the draft sentence by sentence, since the draft is usually dense. It rewrites prose, not the contract — frontmatter, section headings, element links, and source citations survive the rewrite, with one exception: the frontmatter `title` is rewritten into an SEO-friendly title (keyword front-loaded, within 60 characters, describing exactly what the lesson teaches).
- A template is a styling layer: pedagogy (`MEMORY.md` "How to teach me"), source citations, the subject's `language`, and the step lesson contract are enforced regardless of the template.
- Non-English `language`: keep technical terms in English with a parenthetical translation (e.g., `B-tree（B 樹）`). The parenthetical form and gloss requirements are owned by `docs/reference/article-writing.md` (Rule 2).

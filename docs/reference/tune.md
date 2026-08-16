# Tune Reading Protocol

Shared contract for `/tune` and the skills that consume a tune (`learn-init`, `nodes`, `edges`, lint). A **tune** is one YouTuber's voice, captured as a `TUNE.md` profile derived from their transcripts. `/tune` reads transcripts once into a profile; writer skills read the profile, never the raw transcripts.

## Tune directory

`tune/<author-slug>/` holds one author's raw transcripts and their derived profile:

- **Transcripts** (immutable): `*.srt`, `*.txt`, `*.vtt` — raw inputs, never edited.
- **`TUNE.md`** (derived, editable): the voice profile. Hand edits survive via the merge lifecycle.

The author slug is kebab-case (`Justin Sung` → `justin-sung`). Commands and references use the slug.

## Analysis

Transcripts are read once by `/tune`. Empty or near-empty files are skipped with a warning. One sub-agent per transcript keeps the main context clean regardless of size.

Extraction is **language-agnostic**: describe the person's moves as *behavior* — how they open, frame, refute, land the payoff — not as the specific words they used. Only the `Exemplars` section holds verbatim text.

## TUNE.md format

```markdown
---
id: <author-slug>
title: <Author Display Name>
files:
  - path: "[[tune/<author-slug>/<transcript-file>]]"
    sha256: <sha256 of the transcript file>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# TUNE — <Author Display Name>

## Voice
One or two lines: the whole voice in one breath.

## Explanation moves
How this person teaches — opens, frames, refutes, lands the payoff. Behavior, not verbatim words, so the moves transfer to any output language.

## Style habits
Person, address, sentence rhythm, value vocabulary, signposting.

## Rhetorical devices
The recurring figures — contrast, ranking, hyperbole, three-part lists, reframes.

## Exemplars
- "<verbatim quote>" — from <transcript-file>, demonstrates <move>
- ...

## Negative list
What this voice never does.
```

The `files` list is the fingerprint: one `sha256` per transcript. `/tune` compares it against the folder and re-analyzes only new or changed files.

## Merge lifecycle

`TUNE.md` is an editable artifact, not a build product:

1. Compare the `files` hashes against the folder; identify new and changed transcripts.
2. Analyze only those, one sub-agent per transcript, in parallel; each returns style observations plus attributed exemplars.
3. Merge: preserve existing observations and hand edits; add new ones; remove an observation only when a new one contradicts it with evidence.
4. Confirm the profile with the learner — including a short voice sample — before it is used.

## Consumption

Writer skills apply a tune through `MEMORY.md` frontmatter:

- `language` — the output language for all prose in this subject.
- `tune` — the author slug, or `none`.
- `tune-scope` — `nodes` | `elements-nodes` | `all`; which artifacts get the voice.

Rules:

- `tune: none` (or missing) → plain tone, the current behavior.
- `tune: <slug>` but `tune/<slug>/TUNE.md` missing → fall back to plain tone and warn that `/tune <slug>` must run first.
- Voice is a styling layer: pedagogy (`MEMORY.md` "How to teach me"), source citations, and the 10–15 minute lesson contract are enforced regardless of the tune.
- Non-English `language`: keep technical terms in English with a parenthetical translation (e.g., `B-tree（B 樹）`). The parenthetical form and gloss requirements are owned by `docs/reference/article-writing.md` (Rule 2) — when a term needs more than a name translation, that protocol governs.
- Exemplars are references, never copy: articles are written *in the style of*, not verbatim.

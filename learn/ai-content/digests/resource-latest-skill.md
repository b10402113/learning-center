---
source: latest
source_type: codebase
source_lines: 68832
language: Python
file_count: 117
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — /latest + last30days

## Overview (L1)

- `/latest` is an agent skill that turns what people in a niche said in the last few days into up to 10 ranked content ideas, each with a working title, an angle (what you would say and show), why it matters now, a platform and a real source link.
- It researches social media, Reddit, YouTube, Hacker News, GitHub, Polymarket and the web by delegating the whole research step to the bundled `last30days` engine (v3.27.1 by Matt Van Horn, MIT, an unchanged copy), then adds its own source check, idea step, results page and taste loop.
- The learner's outcome is a short chat list plus a local, offline-friendly HTML results page they search, filter, sort (press `/` for search) and pick ideas from into a shared idea cart.
- Its signature behavior is the taste loop: picks pasted back from the page are saved to `taste.md` and shape how later runs rank and angle ideas.
- In the course it is the engine behind Module 11 - Idea Sources and its bonus lesson "How to use /latest": a machine for riding this week's news instead of guessing topics.

## Structure (L2)

### skills/latest/SKILL.md

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/latest/SKILL.md]]`
- Purpose: The /latest contract. A `YOUR DEFAULTS` block the learner edits (niche, window, ideas count, audience, output format, go-to sources, output folder, open-or-not), 9 universal rules (window is the default, run last30days as written, include the user's sources, no invented links, a company launch is not an idea, verify release dates, state unverified claims as claims, read the taste file) and a 7-step workflow (parse → research → read raw file → pick → rank → write page → present).
- Key exports: The `/latest` slash command; arguments `[topic] [--days N]`; the taste-loop step that consumes an "Idea cart:" paste.
- Dependencies: An agent that can run commands and search the web; Python 3.12+ via last30days; the sibling `last30days` skill next to `latest/`.
- Learner-relevant: Teaches the idea-generation method the whole course is built on: anchor every idea to one real, dated item and check recency before calling anything news.

### skills/latest/scripts/fill.py

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/latest/scripts/fill.py]]`
- Purpose: Writes the results page from the run's results JSON and opens it in the browser (`python scripts/fill.py <results.json> [out.html] [--no-open]`). Inlines the page data, the bundled fonts (so it works offline) and the taste-file size; validates the JSON shape and exits 1 on a broken shape.
- Key exports: `fill.py`; `--no-open` flag; `RESULTS_NO_OPEN=1` env var; the results-JSON shape (`kind: "latest" | "outliers"`, `run`, `items`).
- Dependencies: Python standard library only (3.8+).
- Learner-relevant: Shows the page-as-artifact pattern (a self-contained, offline HTML deliverable) reused across the course's skills.

### skills/latest/scripts/taste.py

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/latest/scripts/taste.py]]`
- Purpose: The only writer of `taste.md`. `add -` saves a pasted idea cart with its counts; `like -` swaps in the rewritten "What you like" list (topics, formats, sources, angles, 8 lines max); `show` prints the file. Filters picks by their `From:` skill so /latest and /outliers share one cart.
- Key exports: `taste.py add|like|show`; the `taste.md` schema (a picks log plus a "What you like" list).
- Dependencies: Python standard library only.
- Learner-relevant: Demonstrates the "teach the tool your taste" feedback loop — preferences stored as plain text the learner can read and edit.
- Learner-relevant note: No API key; works with zero keys for Reddit, YouTube (yt-dlp), Hacker News, GitHub, Polymarket and the web.

### skills/latest/references/results-page.md and assets/

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/latest/references/results-page.md]]`
- Purpose: The results JSON shape and what the page does (dark/light theme, search, filter chips by platform/source/taste, sort by rank/newest/engagement, expandable cards, a shared idea cart with "Copy for my agent" and Download .md). `assets/results.html` is the template; `assets/fonts/` bundles Outfit and Doto (SIL OFL) so the page needs no internet.
- Key exports: The results JSON contract each skill must match; the shared cart format ("Idea cart: ...").
- Dependencies: None at runtime (fonts and template are local).
- Learner-relevant: The shared page/cart is why /latest and /outliers appear as one workflow rather than two disconnected tools.

### skills/last30days/SKILL.md

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/last30days/SKILL.md]]`
- Purpose: The research engine's contract. Declares version 3.27.1, a reference-routing table (runtime, library/feed/queue, setup-wizard, discovery, research-runbook, synthesis, comparison, competitors, hiring-signals, agent-mode, recommendations, category-peers, grok-bot-x, followups, save-html-brief) and output LAWs 1-11 (badge pass-through, no invented titles, no em/en dashes, footer pass-through, no raw evidence clusters, planner + `--plan` on named entities, readable citations, weave community voice, first-party posts are first-class evidence, the three-command discovery protocol).
- Key exports: `/last30days` research command; flags like `--days`, `--agent`, `--plan`, `--diagnose`, `--discover`, `--emit=json|html|compact`, `--competitors`, `--trending`; first-run gate grep for `SETUP_COMPLETE=true`.
- Dependencies: Python 3.12+ (hard gate); optional env `SCRAPECREATORS_API_KEY`, `OPENAI_API_KEY`, `XAI_API_KEY`, `X_BEARER_TOKEN`, `OPENROUTER_API_KEY`, `PERPLEXITY_API_KEY`, `PARALLEL_API_KEY`, `BRAVE_API_KEY`, `APIFY_API_TOKEN`, `AUTH_TOKEN`, `CT0`, `BSKY_HANDLE`, `BSKY_APP_PASSWORD`, `TRUTHSOCIAL_TOKEN`, `XIAOHONGSHU_API_BASE`; binaries `node`, `python3`, optional `yt-dlp`.
- Learner-relevant: The full list of free (Reddit, YouTube, Hacker News, Polymarket, web) versus paid/login-backed (X, TikTok, Instagram, LinkedIn) sources is the practical map of where niche news actually lives.

### skills/last30days/scripts/ and references/

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/last30days/scripts/last30days.py]]`
- Purpose: The engine itself. `last30days.py` is the CLI entry point; `scripts/lib/` holds the search, enrichment, clustering, ranking, rendering and source adapters (reddit*, x_*, youtube_yt, tiktok, instagram, hackernews, github, polymarket, bluesky, truthsocial, xiaohongshu, hiring_signals, etc.). `scripts/lib/vendor/bird-search/` is a vendored MIT X search client (ignore for teaching). `references/` holds the per-mode runbooks; `agents/openai.yaml` gives host display metadata.
- Key exports: The CLI's subcommands/flags; a local SQLite library and an optional feed (`index.html`, `feed.xml`); saved `.md` briefings under `LAST30DAYS_MEMORY_DIR` (default `~/Documents/Last30Days`).
- Dependencies: See SKILL.md above; `--preflight` and `--diagnose` inspect configuration without reading cookie values.
- Learner-relevant: A worked example of a multi-source, citation-grounded research pipeline — the "ground every claim in a real link" discipline the course applies to content ideas.

## Duplicate note

`3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/robonuggets-latest/latest/skills/` is an identical copy of this toolkit (a recursive diff shows only `.DS_Store` files differ). Do not re-digest it.

---
source: outliers
source_type: codebase
source_lines: 4055
language: JavaScript
file_count: 15
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — /outliers

## Overview (L1)

- `/outliers` is an agent skill that finds posts beating their own account's normal by a multiplier (the outlier score tools like vidIQ surface): 33K views on a channel that usually gets 4K is ~8x, while 500K on a channel that always gets 500K is 1x. Raw view counts hide that; the multiplier shows it.
- It scans YouTube long videos and Shorts (via the free YouTube Data API, by keyword search and by user-picked peer channels), plus TikTok, Instagram, X and LinkedIn for peer accounts. Every hit lands in one local SQLite database that sharpens with each scan.
- Results open on a local HTML results page ranked by multiplier, with search, filters (platform, account, format, multiplier floor, taste fit), sort, expandable cards (thumbnail, the multiplier spelled out, "why it worked", "your version") and an idea cart shared with /latest.
- It learns the learner's taste from picks pasted back, tagging and angling later runs.
- In the course it powers Module 12 - Finding Outliers and its bonus lesson "How to use /outliers": the step from "what is happening" (via /latest) to "what actually worked and why."

## Structure (L2)

### SKILL.md

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/SKILL.md]]`
- Purpose: The /outliers contract: a 6-step first-run setup (Node 22.13+, YouTube key, niche in `keywords.json`, peers, other platforms, self-test), a 4-step run (scan with `--no-open` → write angles → rebuild page with `--report-only` → report top 5), the outlier definitions (`multiplier` = views ÷ median of that account's earlier posts of the same kind; `vph` = views ÷ hours), the "why the filters exist" guard table, quota math, and the taste loop.
- Key exports: The `/outliers` slash command; scan flags (`--shorts`, `--set`, `--keywords`, `--channels`, `--peers-only`, `--days`, `--report-only`, `--new-only`, `--refresh-days`, `--min-mult`, `--min-baseline`, `--min-baseline-ratio`, `--min-confidence`, `--max-subs`, `--budget`, `--searches`); social flags (`--platform`, `--peers`, `--accounts`, `--budget-usd`, `--provider`, `--dry-run`).
- Dependencies: Node.js 22.13+ (uses Node's built-in SQLite, no npm install); `YOUTUBE_API_KEY` required; `APIFY_API_TOKEN` or `SCRAPECREATORS_API_KEY` for Instagram/LinkedIn; `X_BEARER_TOKEN` optional for X; `yt-dlp` for TikTok.
- Learner-relevant: Teaches the core judgment of the module — read the pattern (repeat winners across accounts point at a format), not the video, and verify an idea is copyable before chasing it.

### env.example

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/env.example]]`
- Purpose: Documents the keys: `YOUTUBE_API_KEY` (required, free, read-only), `APIFY_API_TOKEN` and `SCRAPECREATORS_API_KEY` (optional, paid, needed for Instagram and LinkedIn; Apify covers all four platforms), `X_BEARER_TOKEN` (optional, X's own paid API).
- Key exports: The `.env` template; keys are never read from chat and only `scripts/` reads the file.
- Dependencies: Copy to `.env`; keys pasted by the learner, never into the chat.
- Learner-relevant: A concrete cost map of platform data access (free vs paid vs login-forbidden) that mirrors /latest's source list.

### scripts/scan.mjs, scripts/scan-social.mjs

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/scripts/scan.mjs]]`
- Purpose: `scan.mjs` is the YouTube scanner (keyword sets from `keywords.json` + peer channels, long vs Shorts, computes multiplier/vph, writes to the DB). `scan-social.mjs` is the TikTok/Instagram/X/LinkedIn scanner over peer accounts, with a cost guard (`--budget-usd`, default $1), 1-day skip cache, and `--dry-run` estimate. These are the only two scripts that call outside services.
- Key exports: Scanned post records with `multiplier`, `vph`, baseline, account, kind.
- Dependencies: YouTube Data API (quota: 100 searches/day + 10,000 units/day); `social.mjs` provider layer (scrapecreators | apify | xapi | ytdlp | fxtwitter); `db.mjs`, `social-db.mjs`.
- Learner-relevant: Shows how a public API plus a median baseline yields a comparable "outlier score" — and why Shorts are scored against the channel's Shorts, not its long videos.

### scripts/social.mjs, scripts/social-db.mjs

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/scripts/social.mjs]]`
- Purpose: The source layer. Every provider returns the same shape (`{ accounts: { <handle>: { posts, followers, displayName, error } } }`), tried in a per-platform order or via `--provider`. LinkedIn shows no views, so its `views` field holds engagement (reactions + comments + reposts, per `METRIC` in `social-db.mjs`).
- Key exports: Providers `scrapecreators` (Instagram/TikTok/LinkedIn), `apify` (all four), `xapi` (X), `ytdlp` (free TikTok), `fxtwitter` (free X); `METRIC`.
- Dependencies: The keys in env.example; optional `yt-dlp` binary.
- Learner-relevant: Demonstrates normalizing heterogeneous data sources behind one interface — and the free-first, paid-fallback ordering that keeps costs down.

### scripts/top.mjs, scripts/board.mjs, scripts/fill.mjs

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/scripts/top.mjs]]`
- Purpose: `top.mjs` reads only the database and returns the best outliers across platforms (`--platform all` excludes LinkedIn because it is engagement, not views; `--per-platform N` keeps the list mixed; `--json` emits a fixed shape). `board.mjs` picks the page's rows, `fill.mjs` writes `output/outliers-results.json` into `output/outliers.html` (inlining fonts) and opens it.
- Key exports: `top.mjs --json` shape `{ generated, windowDays, items: [...] }`.
- Dependencies: Node built-ins; local `assets/results.html` and fonts (Outfit/Doto, SIL OFL).
- Learner-relevant: The read-only "database then report" split keeps scanning separate from reporting and makes the compound-value idea visible (baselines improve as the DB grows).

### scripts/keywords.json, scripts/paths.mjs, scripts/taste.mjs, data/peers.example.json

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/scripts/keywords.json]]`
- Purpose: The learner's niche lives in `keywords.json` (`_niche`, `_own_channel`, `sets.default`, `sets.shorts`, `niche_terms`, skip list, `exclude_channels`), read fresh each run. `paths.mjs` holds every file location and the `OPEN_PAGE` switch. `taste.mjs` is the only writer of `taste.md` (shared cart format with /latest). `data/peers.example.json` lists accounts to watch per platform (`youtube`, `tiktok`, `instagram`, `x`, `linkedin`).
- Key exports: `keywords.json` schema; `peers.json` schema; `taste.mjs add|like`; `OPEN_PAGE`.
- Dependencies: Node built-ins; peers file is user-authored.
- Learner-relevant: This is the "choose your pond" step in code — the learner defines their niche, peers and off-limits channels that all later scanning obeys.

### references/social-sources.md

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-outliers/outliers/skills/outliers/references/social-sources.md]]`
- Purpose: Every way to get TikTok, Instagram, X and LinkedIn post data, with prices, risks and what was/wasn't tested live (Instagram/LinkedIn and paid X routes are synthetic-tested only). Documents why the tool never uses the learner's own X or LinkedIn login.
- Key exports: Provider comparison table and sourcing guidance.
- Dependencies: None at runtime (reference only).
- Learner-relevant: A worked cost/risk analysis for choosing a data source — directly reusable when the learner picks tools for their own content business.

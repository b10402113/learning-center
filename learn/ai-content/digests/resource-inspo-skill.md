---
source: inspo
source_type: codebase
source_lines: 1572
language: JavaScript
file_count: 5
status: absorbed
absorbed_at: 2026-10-15
created: 2026-10-15
updated: 2026-10-15
---

# Digest — /inspo

## Overview (L1)

- `/inspo` is an agent skill (with optional browser extension and console tab) that saves YouTube videos to the learner's own "Inspos wall" — a plain JSON library of frozen snapshots (title, channel, subscribers, views, age, duration, tags, description and the learner's note).
- The snapshot freezes the numbers at the moment of saving on purpose: what the video had when it caught the eye is the signal the learner reacted to. Saving again refreshes the numbers and keeps the note.
- Later the learner asks the agent what in their inspos fits a topic, format or mood, and the agent searches the wall (matching on meaning, not only words) and returns the best few with a reason.
- It is deliberately key-free and local: Node.js 18+ is the only must-have, and optional `yt-dlp` makes YouTube reads more robust. All three access paths (skill, extension + bridge, RUBRIC console tab) read/write the same `inspos.json`.
- In the course it is the companion to /outliers in Module 12 - Finding Outliers: save the outliers worth studying and the wall becomes the shortlist of what is working in the niche.

## Structure (L2)

### skills/inspo/SKILL.md

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/skills/inspo/SKILL.md]]`
- Purpose: The /inspo contract. Two flows — save a video (`node <folder>/scripts/add-inspo.mjs "<link>"`, several links at once, `--note "why"`, `--remove`) and find ideas (`--list [words]` prints the wall best-match first, then the agent picks 3-5 that fit by meaning and gives one line each). Also documents where the wall lives, the JSON shape and the environment settings.
- Key exports: `/inspo` slash command; helper subcommands `add` (default), `--note`, `--remove`, `--list [words]`.
- Dependencies: Node.js 18+; optional `yt-dlp` (via PATH or `YTDLP_PATH`); no API keys or accounts.
- Learner-relevant: Teaches a lightweight, judgment-optional capture habit — the helper does one script call, so it can be handed to a cheaper model, while the "pick the best 3-5 by meaning" step stays with the learner's agent.

### skills/inspo/scripts/add-inspo.mjs

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/skills/inspo/scripts/add-inspo.mjs]]`
- Purpose: The helper that does every write and read of the wall. Extracts the 11-character video id (watch, youtu.be, Shorts, embed, live URLs), reads the video's public details with yt-dlp first then YouTube's public page, freezes the snapshot, and prints one short line per video. `--list` prints the wall or word-filtered matches; `--remove` takes one off; saving an existing video refreshes and moves it to the top keeping its note.
- Key exports: The helper CLI; the wall schema `{ "inspos": [ { id, url, title, channel, subscribers, views, viewsText, published, ago, duration, tags, description, note, capturedAt } ] }` (newest first); reads `INSPOS_FILE`, `YTDLP_PATH`, `INSPO_THUMBS_DIR`.
- Dependencies: Node built-ins (`fs`, `os`, `path`, `child_process`); yt-dlp optional.
- Learner-relevant: Shows the "freeze the snapshot" design choice — the reason saved inspiration stays meaningful months later — and hand-editable, plain-JSON data as the storage format.

### skills/inspo/data/example-inspos.json

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/skills/inspo/data/example-inspos.json]]`
- Purpose: Two example entries showing the wall's shape; every view shows these "example"-tagged cards until the learner's first real save.
- Key exports: The exact per-entry field set the learner's wall uses.
- Dependencies: None.
- Learner-relevant: A concrete template for what a saved inspiration record should contain (numbers plus a personal note).

### extension/ and bridge/

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/extension/manifest.json]]`
- Purpose: A Chromium browser extension adds an Inspo toolbar button and a right-click "⭐ /inspo" menu. It cannot run scripts itself, so a tiny local server (`bridge/server.mjs`) runs the helper for it, serving the live wall at `http://127.0.0.1:5299/`. `bridge/env.example` configures `PORT`, `INSPO_HELPER`, `INSPOS_FILE`, `INSPO_PAGE`, `YTDLP_PATH`, `INSPO_THUMBS_DIR`.
- Key exports: Extension button + context menu; bridge HTTP API (`/api/health`, and the helper invocation); `env.local` settings.
- Dependencies: Node 18+; a Chromium browser; optional `pm2`/LaunchAgent/Windows Startup for always-on.
- Learner-relevant: A minimal, secure local-integration pattern (loopback-only, no CORS, POSTs from web pages refused, 10 KB body cap, one program run with a validated id) — useful whenever the learner wires a browser action to a local tool.

### rubric-inspos/

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/rubric-inspos/README.md]]`
- Purpose: An optional add-on tab that shows the Inspos wall inside the RUBRIC console: place the folder beside the console's `scaffold/`, run `node integrate.js` once (patches `server.js`/`index.html`, saves `.bak` backups, idempotent), restart the console; the tab server runs on port 5059 and forwards `/api/inspos`. It also runs standalone (`node server.js`). `env.example` sets `PORT`, `INSPOS_FILE`, optional `RUBRIC_TOKEN`.
- Key exports: The Inspos console tab; `/api/inspos` GET/POST (replace/all, add one, delete by id); the tab `manifest.json`.
- Dependencies: Node 18+, no npm packages; the RUBRIC console is optional.
- Learner-relevant: A worked example of shipping a feature as an add-on tab that patches a host app safely and reversibly, plus a shared-secret security option for a local API.

### page/inspos.html

- Locator: `[[sources/ai-content/20261015/3-Wk2 - Content Ideation/7-Module 12 - Finding Outliers/resources/robonuggets-inspo/inspo/page/inspos.html]]`
- Purpose: The wall as one standalone page for learners without the console. With the bridge running it shows the live wall at `http://127.0.0.1:5299/`; without anything running, opening the file and clicking "Open file" reads a chosen `inspos.json`. Shows the example cards until the first real save.
- Key exports: Standalone viewer with file-open; thumbnails loaded by video id from YouTube's image server.
- Dependencies: A browser; internet for thumbnails.
- Learner-relevant: The "artifact the learner owns" pattern shared with /latest and /outliers — a self-contained local page over a plain data file.

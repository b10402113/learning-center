---
source: videos.json
source_hash: f1128c9ee1471531a9c7c92510d0e829074e3ea77d11659d233f7326ae3eb672
source_lines: 842
created: 2026-08-22
updated: 2026-08-22
---

# Digest — videos.json

A lookup of 120 real YouTube videos used to seed the Vertex learning platform's lessons. Keys are lesson-like slugs (e.g. `nextjs-app-router-in-depth-file-system-routing`); each value has the YouTube `id`, video `title`, uploader `channel`, `duration` in seconds, and the `query` used to find the video. `studio/scripts/seed/resolve-videos.mjs` reads this file to attach a real, verified video URL to every seeded lesson, and `studio/scripts/ingest/` later fetches each video's captions to build the searchable `video` documents.

## Overview (L1)

- **Shape** — a flat JSON object; 120 keys, one per lesson. Each value: `{ id, title, channel, duration, query }`.
- **Topics** — exactly 12 entries per topic across ten topics: nextjs, react, typescript, building (AI apps with LLMs), retrieval (RAG), python, system (design), postgresql, devops, practical (web security).
- **Totals** — ~22.75 hours of video content; channels include Codevolution, Web Dev Simplified, ByteByteGo, KodeKloud, and others.
- **Purpose** — the concrete video inventory behind the seed; grounds lessons in real content so the demo platform, its transcript ingestion, and its search all operate on genuine, verifiable data rather than invented URLs.

## Sections (L2)

### Video metadata schema
- Locator: `[[sources/vertex-learning-platform/videos.json#schema]]`
- Summary: Each entry is a single object keyed by a lesson-slug-style id, with YouTube id, title, channel, duration (seconds), and the search query that surfaced the video.
- Key claims: Keys match the lesson ids used in `seed.ndjson`; durations vary from a few minutes to ~20 minutes (e.g. `practical-web-security-secrets-management` at 1125s).
- Learner-relevant: This is the source of truth the seed and the ingestion pipeline both consume.

### Coverage by topic
- Locator: `[[sources/vertex-learning-platform/videos.json#coverage]]`
- Summary: 120 videos evenly spread across ten curriculum topics (12 each), mirroring the ten seeded courses.
- Key claims: Queries are realistic tutorial searches (e.g. "react server components explained tutorial"), so the resulting videos are genuine instructional content that matches each lesson's claimed topic.
- Learner-relevant: Even coverage and real content are what make the seed coherent enough for the search feature to demonstrate meaningful, grounded results.

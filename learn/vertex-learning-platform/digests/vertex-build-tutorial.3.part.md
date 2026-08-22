---
source: vertex-build-tutorial
part: 3
created: 2026-08-22
updated: 2026-08-22
---

# Part 3 — Sanity studio, data model, seeding & course page

## Overview (L1)

Finishes the Sanity CLI setup and tours the files it added. Then designs the content model with AGENTS.md (course = central object; modules embedded as arrays; lessons referenced; instructors/categories as references). The AI implements the Sanity content model as a **standalone studio workspace + server-only read layer** (splitting away from the embedded studio), reviewed via PR and CodeRabbit (attack-surface scan). Next, sample content is **seeded** — both the provided exact seed (`seed.ndjson` + `videos.json`, 10 courses × 4 modules × 3 lessons = 120 real YouTube videos) and the AI-generated path — plus the Sanity API read token. Finally the **course details page** is built from the mockup and wired to Sanity data.

## Sections (L2)

### Completing Sanity setup; files the CLI added (3401-3552)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3401-3552]]
- Summary: Answers the CLI questions (TypeScript yes, embedded studio yes, default route, clean project with no predefined schema) and has project ID + dataset auto-added to `.env.local`. Tours the new files.
- Key claims: `sanity.config.ts` = main studio config (project ID, dataset, plugins, content-structure entry point); `sanity.cli.ts` = CLI tooling (deploying the studio, managing datasets); a dedicated `sanity/` folder for schemas/definitions/env/structure; a `studio` route embedding the studio inside the app (localhost:3000/studio) so you don't run a separate admin app. Test with `npm run dev`.
- Learner-relevant: Sanity's CLI wires project + dataset + embedded studio into an existing Next.js app in one step.

### Designing the data model (3553-3688)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3553-3688]]
- Summary: Reads the data section of AGENTS.md (part 8) to decide how content is structured before implementing: in a learning platform the course is the main object that connects many pieces together.
- Key claims: Course = marketing info (title, icon, description) + summary, cover image, level, price, optional popularity flag, display student count, learning outcomes, plus references to instructors, categories, and a list of modules. **Modules are embedded as document arrays inside courses** (not top-level documents — you never visit a module page alone); lessons are referenced from modules. Mental model: course = main product page, module = ordered section, lesson = learning unit, instructor = who teaches, category = what topic.
- Learner-relevant: Getting the course→module→lesson relationship right up front is what keeps catalog, course page, and search from getting messy.

### Implementing the content model: standalone studio + server read layer (3689-4140)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3689-4140]]
- Summary: Prompts the AI to implement the Sanity content model and studio (course/module/lesson/instructor/category + server-side read client + data layer). The agent reads AGENTS.md, the Sanity skills, inspects the existing scaffolding, then asks a key architectural question before writing the implementation prompt.
- Key claims: The agent surfaced that the embedded studio contradicts AGENTS.md's requirement for a **standalone studio workspace** (needed for auto updates, typegen, independent deploy) — the Sanity-recommended project structure is project → standalone Sanity studio app → separate Next.js web frontend; they moved to standalone. The dataset is private, so the **read token must stay server-side** (server-only read layer). The implementation prompt specified: which schemas (course/module/lesson/instructor/category + module/learning-outcomes/resources objects), field types, slugs & references, lesson notes as Portable Text, server-only Sanity client + fetch helpers + query files. Result: standalone `studio/` workspace with its own node_modules/env, removed the embedded studio, wrote schemas, built the server-only data layer, ran typegen. Test: `cd studio && npm run dev` → localhost:3333 (courses/lessons/instructors/categories). PR + CodeRabbit: secret scan clean; ran the initial **attack-surface scan** to map entry points (3 of 13 verified so far; deep scan comes later).
- Learner-relevant: The skill-driven agent caught a real architecture decision (embedded vs standalone studio) from the skills; private-dataset read tokens stay server-side; attack-surface mapping grows as the app grows.

### Seeding sample content (4141-4868)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:4141-4868]]
- Summary: Two ways to seed: (1) recommended — use the provided exact `seed.ndjson` (every document with references/durations) + `videos.json` (video metadata), imported via `sanity CLI import`, so the learner's data matches the video exactly for later search results; (2) let the AI generate fresh content. This is the first time the AI writes to the database, so never approve blindly.
- Key claims: Provided seed = 10 courses, each with 4 modules, each with 3 video lessons (120 lessons total), videos fetched from YouTube. For AI-generated seeding, prompt for instructors/categories/10 courses with modules and lessons on programming/development/AI, keeping durations consistent (module = sum of its lessons; course = sum of its modules). Schema only accepts YouTube/Vimeo/Bunny URLs, videos keyed one-per-unique-URL; author chose **unique real YouTube video per lesson** resolved via YouTube search queries (no YouTube data API), with Lorem Picsum images, 5 instructors / 6 categories / 10 courses / 120 lessons. Took 10-20 min (~120 YouTube fetches); the agent hand-authored the content spec, built a resolve step, an NDJSON generator reimplementing the studio's validation rules, and imported into production with deterministic IDs. Needs a **Sanity API read token** (viewer, no expiration) added to `.env.local` as `SANITY_API_READ_TOKEN` next to the Clerk vars since the dataset is private. Push + PR (CodeRabbit skipped review of pure data, as expected) → merged.
- Learner-relevant: Seeding turns an empty schema into realistic, internally consistent data fast; `npm update sanity` before run; AI writes to the DB only through an approved, reviewed prompt.

### Course details page wired to Sanity (4869-5100)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:4869-5100]]
- Summary: The next logical step: make courses openable. Prompts the agent to implement the course page from the attached UI, wired with seeded Sanity content. The agent asks a clarifying question about progress UI before writing the prompt.
- Key claims: The design shows a sticky "your progress 35% complete" bar + continue-learning CTA, but Clerk-keyed progress docs and the server route don't exist yet → keep it **presentational only** (progress tracking comes later). Breadcrumbs link to `/courses` and lesson rows to lesson pages even though those routes don't exist yet (linked anyway). Build: `courses/[slug]` server component fetching via the Sanity data layer, course hero, learning outcomes, course-content accordion with progress bar, `format.ts` for duration/counts/level/lesson labels. Test: `npm run dev`, open a course, expand a module row, click a lesson → 404 for now.
- Learner-relevant: Ask the agent to clarify ambiguous UI states (progress bar) rather than invent them; defer unimplemented routes but keep the links so later features slot in.

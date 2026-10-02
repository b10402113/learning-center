---
source: cal-ai-tutorial-master
source_type: codebase
source_lines: 1015
language: TypeScript
file_count: 7
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — cal-ai-tutorial-master (part 2)

## Overview (L1)

- `scripts/seed.ts` — Standalone TypeScript seed script that inserts one demo user and five completed meals into Postgres via Neon's HTTP driver, computing each meal's `logged_at` as a true UTC instant from local wall-clock time in the user's timezone.
- `scripts/reset-project.js` — Expo scaffold utility that interactively deletes or moves the `src/` and `scripts/` directories to `example/`, then recreates a minimal `src/app` with `index.tsx` and `_layout.tsx`.
- `drizzle/` — Hand-authored SQL Drizzle migrations plus generated JSON metadata defining the schema: enums, `users`, `meals`, FK, index, and an enum-value addition.

## Structure (L2)

### sources/mobile-app-course/20261001/cal-ai-tutorial-master/scripts/seed.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/scripts/seed.ts]]`
- Purpose: Idempotent dev seeder — upserts a fixed user by `clerk_user_id`, wipes that user's meals, then inserts five sample meals (3 today, 2 yesterday) with realistic macros.
- Key exports: None (top-level-await ESM script). Internal fixtures `USER` and `MEALS`; helper `loggedAt(dayOffset, time)`.
- Dependencies: `@neondatabase/serverless` (`neon`), `process.loadEnvFile()`, Node globals (`process.env.DATABASE_URL`, `Intl.DateTimeFormat`).
- Learner-relevant: Uses parameterized `sql` template queries (SQL-injection safe), `on conflict … do update` upserts, and timezone-correct conversion of local wall-clock times to UTC using `Intl` `longOffset` (handles DST). Run with `node --experimental-strip-types scripts/seed.ts`.

### sources/mobile-app-course/20261001/cal-ai-tutorial-master/scripts/reset-project.js

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/scripts/reset-project.js]]`
- Purpose: Developer reset tool shipped by the Expo starter; prompts whether to archive (`y`) or delete (`n`) existing `src`/`scripts`, then scaffolds a blank app.
- Key exports: None (CommonJS executable with `#!/usr/bin/env node`). Constants `indexContent`, `layoutContent`; functions `moveDirectories`, plus `rl.question` flow.
- Dependencies: Node built-ins `fs`, `path`, `readline`.
- Learner-relevant: Demonstrates template-literal file scaffolding, `fs.promises` (`mkdir`, `rename`, `rm`, `writeFile`), and interactive CLI prompts. Safe to delete once the starter is customized.

### sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/0000_foamy_shatterstar.sql

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/0000_foamy_shatterstar.sql]]`
- Purpose: Initial migration — creates the schema's enums and core tables.
- Key exports: Types `activity_level` (`sedentary|light|moderate|very`), `diet_preference` (`classic|keto|vegan|vegetarian`), `goal` (`lose|maintain|gain`), `meal_status` (`analyzing|completed|failed`), `unit_preference` (`metric|imperial`); tables `meals` (FK `user_id`, status default `analyzing`, nullable macro fields, `error_reason`, `trigger_run_id`, timestamps) and `users` (Clerk id, profile, goal/plan fields, unique `clerk_user_id`); index `meals_user_logged_at_idx` on `(user_id, logged_at DESC NULLS LAST)`.
- Dependencies: Postgres (`gen_random_uuid()`, `timestamp with time zone`, enum/btree types); Drizzle `--> statement-breakpoint` markers.
- Learner-relevant: Canonical DDL for a user/meal domain — enum-backed columns, `ON DELETE cascade` FK, and a covering index tuned for per-user chronological meal queries.

### sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/0001_narrow_bishop.sql

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/0001_narrow_bishop.sql]]`
- Purpose: Follow-up migration adding the `extra` variant to the `activity_level` enum.
- Key exports: `ALTER TYPE "public"."activity_level" ADD VALUE 'extra'`.
- Dependencies: Postgres enum `ALTER TYPE … ADD VALUE`.
- Learner-relevant: Shows incremental, additive schema evolution — extend enums rather than rewriting the initial migration.

### sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/meta/

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/meta/_journal.json]]`, `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/meta/0000_snapshot.json]]`, `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/drizzle/meta/0001_snapshot.json]]`
- Purpose: Drizzle-generated migration metadata — `_journal.json` records the ordered migration entries (tags `0000_foamy_shatterstar`, `0001_narrow_bishop`, dialect `postgresql`, breakpoints true); `0000_snapshot.json` and `0001_snapshot.json` are full machine-readable schema snapshots used to diff future migrations.
- Key exports: Journal `version`/`dialect`/`entries[]`; per-snapshot `id`, `prevId`, `version`, `dialect`, `tables`.
- Dependencies: Generated by Drizzle Kit; not hand-edited.
- Learner-relevant: Illustrates how a migration tool tracks state (journal + snapshots) so schema changes are diffable and reproducible. Generated — treat as build artifacts.

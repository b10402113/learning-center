---
source: fullstack-app-codex
source_type: codebase
source_lines: 30460
language: TypeScript
file_count: 136
part: 2
status: absorbed
absorbed_at: 2026-10-04
created: 20261004
updated: 20261004
---

# Digest — fullstack-app-codex (part 2)

## Overview (L1)

- **Repository root + scripts.** The repo is a single, eight-part live-auction demo built as **vertical slices**: each `part-N` folder is a verbatim copy of the previous part plus exactly one new capability, and every line of app code was written by the Codex CLI (`codex exec`). The root `README.md` explains the slice model, the shared PostgreSQL container, the per-part port/database table, and `npm start`; `AGENTS.md` is the persistent Codex contract (stack limits, strict types, Zod at boundaries, explicit migrations, run tests, production-minded recommendations, Mermaid diagrams with canonical emoji, headed-Edge Playwright). `scripts/workshop-db` is a tiny POSIX shell helper that creates/drops only the named `auction_part_N` database in the shared Postgres. Teaches: repo-as-agent-context and infra-in-Docker / apps-on-host workflow.
- **Part 1 — Foundation.** `part-1-foundation` proves one vertical path: React → Fastify → PostgreSQL for a health check, plus a baseline for correlation IDs, pino logs, OpenTelemetry console spans, and a hand-rolled ordered SQL migration runner. It establishes the npm-workspaces monorepo, the stable root scripts, and the minimal Vite proxy. `CODEX.md` + `codex-logs/` preserve the full Codex build/QA story. Teaches: minimalism ("build the least that demonstrates the slice"), `buildApp()` factory injection, and evidence-based self-verification.
- **Part 2 — Create auction and bid.** `part-2-create-auction-and-bid` adds the first real domain tables (`users`, `auctions`, `bids` + seeds), Zod-validated Fastify routes for listing/searching/detail/creating auctions and placing bids, and a database-backed React marketplace with persistent per-tab demo-user switching. `GRILL.md` locks the product/domain decisions pre-build; the first headed Playwright "bidding war" test is added. Teaches: explicit SQL migrations, plain-`pg` query composition (`LEFT JOIN LATERAL`), boundary validation, and grilling-before-coding.
- **Part 3 — Business rules and concurrency.** `part-3-business-rules-concurrency` turns the naive read-then-insert bid path into a serialized one: an injected application `Clock`, a short `BEGIN`/`SELECT … FOR UPDATE` per-auction transaction, re-reading the authoritative price after locking, stable machine-readable 409 conflict codes with metadata, and a frontend that refreshes on conflict, preserves the entered amount, and transitions to "Ended" on a local deadline watcher. `GRILL.md` is a two-round design interrogation with a current-state audit and Mermaid architecture. Teaches: PostgreSQL row locking, deterministic race tests, injected clocks, and typed API errors.
- **Part 4 — Realtime (Socket.IO + Redis).** `part-4-realtime-socketio-redis` adds a WebSocket-only Socket.IO server attached to the Fastify HTTP server, backed by a Redis Pub/Sub adapter so bids fan out across replicas; `auction:changed` is emitted only after the bid transaction commits, is a pure invalidation signal, and every watcher refetches authoritative state over HTTP. The browser coalesces refreshes and subscribes per-auction room. `CONTEXT.md` seeds a small ubiquitous-language glossary. Teaches: event-after-commit, rooms, socket lifecycle, refresh coalescing, and a two-window Playwright realtime test.

## Structure (L2)

### README.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/README.md]]
- Purpose: Top-level orientation for the eight-slice workshop app: describes the vertical-slice layout, the stack, the anatomy of a part (`GRILL.md`, `CODEX.md`, `codex-logs/`, app code), how to run a part, and the per-part web/API/database/port tables.
- Key exports: part table; run instructions (`npm install`, `npm start`, `npm test`); port and infra tables; `npm run db:down` / `docker compose down` lifecycle notes.
- Dependencies: documents the stack — TypeScript + ESM, React + Vite, Fastify, Zod, PostgreSQL, Redis + Socket.IO, RabbitMQ worker, OpenTelemetry + Jaeger, Docker Compose.
- Learner-relevant: The clearest statement of the "one folder per vertical slice, each a copy of the last" teaching model and how the eight capabilities stack.
- Note: The README's part table is stale relative to folder names — it lists `part-4-hidden-defect-review` and `part-5-realtime-socketio-redis`, whereas the folders are `part-3-business-rules-concurrency` and `part-4-realtime-socketio-redis`; the folder names in scope are authoritative.

### AGENTS.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/AGENTS.md]]
- Purpose: The repo-wide Codex operating contract plus a "for the curious human only" workshop section that steers agent behavior during the live demo.
- Key exports: core rules (stay in stack, scope changes to the requested part, read the part's `AGENTS.md`/`CONTEXT.md`, strict types, Zod at boundaries, explicit migrations, run the part's tests, no machine-specific setup); Mermaid emoji legend (`🌐 ⚡ ⏱️ 🔔 🐘 🔴 🐇 🔌 🔭 🧭`); Playwright-uses-headed-Edge rule; grilling limit (8–10 questions, 2 rounds); vertical-slice decomposition contract; `MY_ORIGINAL_PROMPTS.md` export format.
- Dependencies: Governing context for Codex itself; referenced by every part folder.
- Learner-relevant: Shows how a `AGENTS.md` encodes durable agent behavior — repo conventions, tooling defaults, and process gates (grill → slices → stop for browser review).

### docker-compose.yml
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/docker-compose.yml]]
- Purpose: Shared infrastructure for all parts: one PostgreSQL (host `55432`), plus Redis, RabbitMQ, and Jaeger used by later parts.
- Key exports: services `postgres` (`postgres:16-alpine`, user/pass/db `auction`, healthcheck, named volume), `redis` (`redis:7-alpine`, no persistence, `56379`), `rabbitmq` (management image, `56726`/`15676`), `jaeger` (`all-in-one:1.76.0`, OTLP HTTP `4318`, UI `16686`, CORS origins for parts 6–8).
- Dependencies: Docker Compose; consumed by `scripts/workshop-db` and each part's `redis:up`/`db:up` scripts.
- Learner-relevant: "Infra in Docker, apps on host" — the deliberate split that keeps the agent's iteration loop fast and makes stateful deps reproducible.

### scripts/workshop-db
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/scripts/workshop-db]]
- Purpose: A guarded shell helper so every part can create or drop only its own isolated database in the shared Postgres container.
- Key exports: `up <auction_part_N>` (ensure Postgres up, create DB if absent), `drop <auction_part_N>` (`dropdb --if-exists --force`); rejects any name outside `auction_part_[1-8]`.
- Dependencies: Docker Compose, `docker exec … psql/createdb/dropdb`; invoked from each part's `db:up`/`db:down` npm scripts.
- Learner-relevant: Shows isolation strategy for running eight demo databases on one Postgres, and a small safe-operations script.

### part-1-foundation/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/GRILL.md]]
- Purpose: Pre-implementation grilling for the foundation slice; five questions whose answers define the whole workshop's architecture.
- Key exports: Q1 infra-in-Docker/apps-on-host; Q2 npm-workspaces monorepo; Q3 completion evidence = one vertical health path; Q4 plain `pg` + ordered SQL migrations, no ORM; Q5 OTel baseline + correlation ID only. Includes verified-free ports.
- Dependencies: References the root compose file and the stable npm scripts.
- Learner-relevant: The template for "grill the plan, lock decisions, then prompt Codex" — choices here (no ORM, minimal telemetry) persist through every later part.

### part-1-foundation/CODEX.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/CODEX.md]]
- Purpose: The narrative record of how part 1 was built by Codex: exact invocation, verbatim prompt, condensed transcript, Codex's own final message, a Codex QA pass, and an independent (Claude Opus) browser QA.
- Key exports: the `codex exec --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check … - < part1-prompt.md` invocation; codex-cli 0.144.6 / ChatGPT auth; the verification sequence and verdicts; known limitation that Codex had no browser instance and used an HTTP fallback.
- Dependencies: References `codex-logs/part1-build.log` and `part1-qa.log`.
- Learner-relevant: Demonstrates the intended workflow — prompt with explicit verification steps, collect evidence rather than claim, then a separate context-free QA pass.

### part-1-foundation/codex-logs/ (prompts + transcripts)
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/codex-logs/part1-build.log]]
- Purpose: Complete raw transcripts of the two Codex sessions, plus the two prompts used.
- Key exports: `part1-build-prompt.md` (the ultra-minimalist foundation spec + 7-step evidence checklist), `part1-build.log` (~21.8k lines; model `gpt-5.6-sol`, reasoning `medium`, `danger-full-access`, ~132,555 tokens), `part1-qa-prompt.md` (4 observational PASS/FAIL checks), `part1-qa.log` (~409 lines, ~156,847 tokens, ends in a verdict table).
- Dependencies: Codex CLI and its browser-control plugin; the log shows Docker credential-helper diagnosis (`~/.docker/config.json`, anonymous pull) and an `app.ts` patched through many `apply_patch` iterations.
- Learner-relevant: What a real agent transcript looks like — self-verification, environment troubleshooting, repeated patch loops, and an honest "browser unavailable → HTTP fallback" instead of a false visual-verification claim.

### part-1-foundation/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/server/src/app.ts]]
- Purpose: Foundation Fastify application — health path only.
- Key exports: `buildApp()`; route `GET /api/health` (runs `SELECT 1`, returns `{ ok, db, requestId }` or 503); `onRequest` hook echoing `x-request-id`; `onClose` closing the pool.
- Dependencies: `fastify`, `pg`; reads `DATABASE_URL`; `requestIdHeader: 'x-request-id'`.
- Learner-relevant: The minimal `buildApp()`-factory + `inject()` backpressure pattern that every later part extends without changing the test seam.

### part-1-foundation/server/src/index.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/server/src/index.ts]]
- Purpose: Entrypoint that must load telemetry before the app.
- Key exports: dynamic `import('./app.js')` after `import './otel.js'`; listens on `API_PORT ?? 3101`.
- Dependencies: `./otel.js`, `./app.js`.
- Learner-relevant: The import-order trick that makes OTel auto-instrumentation load before Fastify/pg are required.

### part-1-foundation/server/src/migrate.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/server/src/migrate.ts]]
- Purpose: A ~37-line hand-rolled migration runner.
- Key exports: creates `schema_migrations`; applies `../migrations/*.sql` in filename order inside per-file `BEGIN`/`COMMIT`, records filenames, logs `N migrations applied`.
- Dependencies: `node:fs/promises`, `pg`.
- Learner-relevant: Shows what an ORM hides — ordered, transactional, idempotent SQL migrations with no framework.

### part-1-foundation/server/src/otel.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/server/src/otel.ts]]
- Purpose: One-file OpenTelemetry baseline.
- Key exports: `NodeSDK` with `serviceName: 'auction-server'`, `ConsoleSpanExporter`, `getNodeAutoInstrumentations()`.
- Dependencies: `@opentelemetry/sdk-node`, `@opentelemetry/sdk-trace-base`, `@opentelemetry/auto-instrumentations-node`.
- Learner-relevant: Telemetry as a slice — console exporter only now; a collector/Jaeger arrives later, once a trace crosses a process boundary.

### part-1-foundation/server/src/app.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/server/src/app.test.ts]]
- Purpose: The one foundation test.
- Key exports: Vitest `describe('GET /api/health')` asserting 200 and `{ ok: true, db: 'ok' }` against real Postgres.
- Dependencies: `vitest`, `buildApp()`.
- Learner-relevant: Tests hit a real database, not mocks — the pattern later parts grow into race and clock-boundary tests.

### part-1-foundation/web/src/App.tsx + catalog.ts + components/
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/web/src/App.tsx]]
- Purpose: A static, fully-styled marketplace UI (home/search/item pages) driven by a local `catalog.ts`, with hand-drawn SVG product art.
- Key exports: `App` (path-based page switch on `window.location`), `HomePage`/`SearchPage`/`ItemPage`; `catalog` + `formatCurrency`; components `ProductCard`, `ProductArt`, `SiteHeader`.
- Dependencies: React (`useEffect`), `./catalog`, `.style.css`; `ProductArtKind` union.
- Learner-relevant: Discrepancy worth noting — `CODEX.md` describes a minimal health page, but the shipped part-1 snapshot is already a full static catalog with no API calls; useful as the UI shell that part 2 wires to the API. Demonstrates category-driven illustration and client-side routing without a router library.

### part-1-foundation/package.json + web/vite.config.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/package.json]]
- Purpose: Root workspace wiring that every later part copies and re-parameterizes.
- Key exports: workspaces `server` + `web`; scripts `db:up`, `db:down`, `db:reset`, `migrate`, `dev`, `start`, `test`; Vite config with `API_PORT`/`WEB_PORT` and `/api` proxy to the API.
- Dependencies: `concurrently`; Vite dev server + proxy.
- Learner-relevant: Stable, shared commands are the interface between humans and the agent across the whole workshop.

### part-2-create-auction-and-bid/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/GRILL.md]]
- Purpose: Pre-build product/domain decisions for the create-auction-and-bid slice.
- Key exports: actors (10 seeded users, per-tab `sessionStorage` identity, no auth, sellers can't bid on own auction); auction rules (required fields, future close, UTC, category art, no specs on create); money/bidding in integer cents, $1 minimum, ended auctions reject bids; reset behavior; three delivery slices.
- Dependencies: Inherits part-1 architecture; explicitly defers simultaneous-bid locking to part 3.
- Learner-relevant: Shows scoping a slice by *deferring* a hard problem on purpose rather than pretending it's solved.

### part-2-create-auction-and-bid/server/migrations/001_marketplace.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/server/migrations/001_marketplace.sql]]
- Purpose: The first real schema + seed data, and the file that all of parts 2–4 share identically.
- Key exports: tables `users`, `auctions`, `bids` with `CHECK` constraints (slug regex, category/art enums, price > 0, length bounds, `specs` jsonb array); indexes `bids_auction_created_idx`, `auctions_ends_at_idx`; inserts 10 demo users and the 6 original auctions.
- Dependencies: PostgreSQL 16; consumed by `migrate.ts`.
- Learner-relevant: Constraint-first schema design in raw SQL; note that parts 3 and 4 add **no** new migration — the concurrency/realtime work is code-only.

### part-2-create-auction-and-bid/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/server/src/app.ts]]
- Purpose: The API grows from one health route to the full marketplace read/write surface.
- Key exports: Zod schemas (`listQuerySchema`, `slugParamsSchema`, `categorySchema`, `createAuctionSchema`, `createBidSchema`); `slugify`; `auctionSelect` (with `LEFT JOIN LATERAL` top-bid and bid-count subqueries); `toAuction`/`toBid` mappers; routes `GET /api/users`, `GET /api/auctions`, `GET /api/auctions/:slug` (with `bidHistory`), `POST /api/auctions`, `POST /api/auctions/:slug/bids`.
- Dependencies: `fastify`, `pg`, `zod`, `node:crypto` (`randomUUID`); `DATABASE_URL`.
- Learner-relevant: Boundary validation, slug generation with collision fallback, and composing authoritative current-price/bidder via a lateral join instead of denormalized columns. Bid validation here is still non-transactional (the defect part 3 fixes).

### part-2-create-auction-and-bid/server/src/app.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/server/src/app.test.ts]]
- Purpose: Integration tests over the marketplace API.
- Key exports: tests for health, 10 seeded users, list/search, detail by slug, create auction (incl. rejecting a past close time), and sequential bid validation/history; `removeTestAuction` cleanup by title.
- Dependencies: `vitest`, `pg` (direct DB setup), `buildApp()`.
- Learner-relevant: Tests create and clean up real rows with unique titles — a pattern for stateful DB tests without transactions.

### part-2-create-auction-and-bid/web/src/catalog.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/web/src/catalog.ts]]
- Purpose: Replaces the part-1 local catalog with a typed API client + money/time helpers.
- Key exports: `DemoUser`, `AuctionItem`, `Bid`, `CreateAuctionInput`; `fetchAuctions`, `fetchAuction`, `fetchUsers`, `createAuction`, `createBid`; `parseDollarsToCents`, `formatCurrency`, `formatTimeLeft`.
- Dependencies: `fetch`; consumed by `App.tsx` and components.
- Learner-relevant: Cents-integer money handling and parsing user dollar input exactly; the typed contract the UI relies on.

### part-2-create-auction-and-bid/web/src/App.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/web/src/App.tsx]]
- Purpose: Wires the static UI to the API and adds per-tab demo-user identity and bid history.
- Key exports: `useAuctionList`, `Status`; `HomePage`/`SearchPage` now fetch; `ItemPage` loads an auction, renders `BidHistory`, `SellerCard`, and `BidForm`; `App` reads/persists active user from `sessionStorage` and renders `UserSwitcher`.
- Dependencies: React state, `./catalog`, `BidForm`, `NewAuctionPage`, `UserSwitcher`.
- Learner-relevant: Loading/error states, identity without auth, and how a read path upgrades from local data to the API.

### part-2-create-auction-and-bid/web/src/components/BidForm.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/web/src/components/BidForm.tsx]]
- Purpose: The bid input form (part-2 version).
- Key exports: `BidForm({ item, activeUser, onAccepted })`; local amount/error/success state; client-side minimum check; disables when ended or seller; calls `createBid` then `onAccepted`.
- Dependencies: React, `./catalog` (`createBid`, `parseDollarsToCents`, `formatCurrency`, `formatTimeLeft`).
- Learner-relevant: Baseline form UX that part 3 hardens with typed conflict recovery.

### part-2-create-auction-and-bid/web/src/components/NewAuctionPage.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/web/src/components/NewAuctionPage.tsx]]
- Purpose: The "post an auction" form as the active user.
- Key exports: `NewAuctionPage({ activeUser })`; validates price/close-time locally; `createAuction` then redirects to the new item page; `localDateTimeValue` helper for `datetime-local`.
- Dependencies: React, `./catalog`.
- Learner-relevant: Client-side validation mirroring the server's Zod rules, and redirect-on-create navigation.

### part-2-create-auction-and-bid/web/src/components/UserSwitcher.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/web/src/components/UserSwitcher.tsx]]
- Purpose: A footer control to change the active demo user for the current tab.
- Key exports: `activeUserStorageKey = 'auction-house-active-user-id'`; `UserSwitcher({ users, activeUserId, error, onChange })`.
- Dependencies: `./catalog` (`DemoUser`).
- Learner-relevant: Simulating multi-user behavior without authentication; the storage key is reused by Playwright tests to set identity per context.

### part-2-create-auction-and-bid/playwright.config.ts + tests/bidding-war.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/tests/bidding-war.spec.ts]]
- Purpose: The first browser-level demonstration test: four headed Edge windows bid simultaneously to *reproduce* the unsynchronized-bid defect.
- Key exports: `playwright.config.ts` (testDir `tests`, `channel: msedge`, `reuseExistingServer`, baseURL `:5102`); `bidding-war.spec.ts` asserts duplicate accepted amounts can occur and logs "BIDDING WAR REPRODUCED".
- Dependencies: `@playwright/test` (msedge), `pg` for DB truth, `DATABASE_URL`.
- Learner-relevant: A test that documents a bug by asserting the bad behavior, not the good one — the setup for part 3 to flip it into a protection test.

### part-3-business-rules-concurrency/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/GRILL.md]]
- Purpose: The richest pre-build document: a current-state defect audit, inherited part-2 rules, two rounds of concurrency decisions, an agreed Mermaid architecture, and two implemented+verified slices.
- Key exports: audit of the read-then-insert race and stale frontend; Round 1 (serialize per auction, injected clock, stable error codes, local ended transition, no idempotency keys); Round 2 (short transaction + `FOR UPDATE`, re-read after lock, store accepted time, typed 409 metadata, bounded refresh retry, deterministic tests); `flowchart` architecture; slice acceptance/verification notes.
- Dependencies: Carries forward part-2 `GRILL.md`.
- Learner-relevant: A worked example of using grilling to design concurrency semantics *before* coding, including the reasoning that concurrent $103/$106 bids must leave $106 leading.

### part-3-business-rules-concurrency/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/server/src/app.ts]]
- Purpose: Makes bid acceptance authoritative and serialized.
- Key exports: `Clock`/`systemClock` types and `buildApp({ clock })`; creation-time `endsAt` check moved into the route against the injected clock; bid route wrapped in `pool.connect()` + `BEGIN` + `SELECT … FROM auctions WHERE slug=$1 FOR UPDATE`, re-reads `current_price_cents`, applies seller/ended/minimum checks, inserts with `created_at = clock.now()`, inserts `code`/`error`/`currentPriceCents`/`minimumBidCents`/`endsAt` on 409, `COMMIT`/`ROLLBACK`.
- Dependencies: `fastify`, `pg`, `zod`; injected `Clock`.
- Learner-relevant: The canonical fix pattern — lock the aggregate row, then re-validate and mutate inside one transaction — plus dependency-injecting time for deterministic boundary tests.

### part-3-business-rules-concurrency/server/src/app.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/server/src/app.test.ts]]
- Purpose: Deterministic concurrency and clock tests.
- Key exports: helpers `removeTestAuction`/`removeConcurrencyDelay`; a test that injects a PL/pgSQL `BEFORE INSERT` trigger sleeping 0.1s to force concurrent equal bids and asserts exactly one 201; a distinct-bids test asserting the highest wins and history stays strictly increasing; a clock test that uses a blocker transaction + `pg_stat_activity` to prove the clock is read after the lock, rejects at the exact deadline, and stores the injected timestamp.
- Dependencies: `vitest`, `pg` (raw SQL: triggers, `pg_blocking_pids`), `buildApp({ clock })`.
- Learner-relevant: How to make races deterministic (triggers, blocker transactions, waiting on lock events) rather than flaky.

### part-3-business-rules-concurrency/server/migrations/001_marketplace.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/server/migrations/001_marketplace.sql]]
- Purpose: Identical to part 2 — no schema change accompanies the concurrency work.
- Key exports: same `users`/`auctions`/`bids` schema and seeds (byte-identical to part 2 and 4).
- Dependencies: PostgreSQL.
- Learner-relevant: Confirms the fix is application/transaction-level, not a schema change — an important lesson about where to put invariants.

### part-3-business-rules-concurrency/web/src/catalog.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/web/src/catalog.ts]]
- Purpose: Adds typed conflict handling to the API client.
- Key exports: `BidConflictCode` union (`AUCTION_CLOSED | BID_TOO_LOW | SELLER_CANNOT_BID`), `BidConflictBody`, class `BidConflictError`; `createBid` now parses a 409 body with structured metadata and throws `BidConflictError`.
- Dependencies: `fetch`.
- Learner-relevant: Mapping machine-readable API errors to typed client errors so the UI can react differently per conflict.

### part-3-business-rules-concurrency/web/src/components/BidForm.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/web/src/components/BidForm.tsx]]
- Purpose: Stale-bid recovery on the client.
- Key exports: `refreshAuctionWithRetry(refresh, attempts=2)`; `BidForm({ item, activeUser, onRefresh })` catches `BidConflictError`, keeps the entered amount, shows the authoritative minimum, and refreshes — never resubmitting the bid.
- Dependencies: React, `./catalog`.
- Learner-relevant: "Refresh state, never auto-raise the bid" — deliberate UX policy from the grill.

### part-3-business-rules-concurrency/web/src/auctionDeadline.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/web/src/auctionDeadline.ts]]
- Purpose: A testable local deadline watcher that drives the UI to "Ended" without polling.
- Key exports: `DeadlineEnvironment` (injectable `now`/`setTimeout`/`clearTimeout`/visibility); `watchAuctionDeadline(endsAt, onTimeChange, environment)` scheduling a single capped timeout and recomputing on tab visibility.
- Dependencies: browser globals with injection seam; tested in `auctionDeadline.test.ts`.
- Learner-relevant: Making timers testable via a small environment interface and clamping to `setTimeout` max delay.

### part-3-business-rules-concurrency/tests/bidding-war.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-3-business-rules-concurrency/tests/bidding-war.spec.ts]]
- Purpose: The part-2 defect reproduction converted into a protection test.
- Key exports: renamed test "…are protected from simultaneous-bid races"; asserts exactly one of equal bids succeeds, the losing bidder's amount is preserved while its view refreshes, accepted history is strictly increasing, ended pages disable bidding, post-close bids return `AUCTION_CLOSED`, and the DB has no duplicate amounts.
- Dependencies: `@playwright/test` (msedge), `pg`.
- Learner-relevant: Turning a red "documents-the-bug" test green is the visible proof the concurrency fix works end-to-end.

### part-4-realtime-socketio-redis/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/GRILL.md]]
- Purpose: Two-round realtime design record (carries the full part-3 grill forward verbatim, then adds part-4 decisions).
- Key exports: Round 1 (update detail pages within ~1s; only detail pages; replaceable replicas + one Redis backplane; bid commands stay HTTP; Postgres authoritative when Redis is down; clients refetch to converge; no connection-status UI); Round 2 (Redis Pub/Sub adapter without packet replay, WebSocket-only, `auction:changed {slug, bidId}` as invalidation only, per-auction rooms, publish only after commit, Redis as startup dependency, refresh coalescing); Mermaid backplane architecture; two slices (live updates; reconnect convergence).
- Dependencies: References part-3 rules and the compose Redis.
- Learner-relevant: Clear-eyed scoping — realtime as an *invalidation signal* layered over the authoritative HTTP/Postgres path, with explicit out-of-scope distributed-systems protections.

### part-4-realtime-socketio-redis/CONTEXT.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/CONTEXT.md]]
- Purpose: A minimal ubiquitous-language glossary the agent reads before working.
- Key exports: definitions of **Accepted bid**, **Auction watcher**, **Authoritative auction state**, each with "avoid" synonyms.
- Dependencies: Read alongside `AGENTS.md` per the root contract.
- Learner-relevant: Shows domain-modeling-as-agent-context: pinning terminology so code and docs use the same words.

### part-4-realtime-socketio-redis/server/src/realtime.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/server/src/realtime.ts]]
- Purpose: Socket.IO server + Redis backplane factory.
- Key exports: `auctionSubscriptionSchema`; `AuctionChangedEvent`; `auctionRoom(slug)`; `AuctionRealtime` interface (`connectRedis`, `publishAuctionChanged`, `close`); `createAuctionRealtime(httpServer, logger)` — WebSocket-only, `serveClient: false`, `auction:watch` joins a validated room, `auction:changed` emits to a room, Redis pub/sub adapter via `createAdapter`.
- Dependencies: `socket.io`, `@socket.io/redis-adapter`, `redis`, `zod`, Fastify logger type.
- Learner-relevant: Validate the subscribe payload before joining a room, keep the socket read-only, and isolate rooms by auction slug.

### part-4-realtime-socketio-redis/server/src/realtime.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/server/src/realtime.test.ts]]
- Purpose: Fast, real-socket tests of the room boundary (no Redis needed).
- Key exports: `connect`/`watch` helpers; tests that `auction:changed` reaches only same-room watchers and that malformed subscriptions (`../private`) are rejected.
- Dependencies: `vitest`, `socket.io-client`, `fastify` (ephemeral port).
- Learner-relevant: Testing pub/sub semantics with real sockets on a throwaway server.

### part-4-realtime-socketio-redis/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/server/src/app.ts]]
- Purpose: Adds a publish seam to the bid route without coupling it to Socket.IO.
- Key exports: `buildApp({ clock, publishAuctionChanged = () => undefined })`; after a committed bid, best-effort `publishAuctionChanged({ slug, bidId })` wrapped in try/catch that logs but does not fail the request.
- Dependencies: `./realtime.js` (type only), plus part-3 imports.
- Learner-relevant: Event-after-commit and failure isolation — realtime degradation must never break bid acceptance.

### part-4-realtime-socketio-redis/server/src/index.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/server/src/index.ts]]
- Purpose: Wires realtime into startup with a startup dependency on Redis.
- Key exports: builds the app with a publish callback that forwards to the realtime instance, creates realtime from `app.server`, `await realtime.connectRedis(REDIS_URL ?? redis://localhost:56379)` before `app.listen`, closes realtime on app close.
- Dependencies: `./app.js`, `./realtime.js`, `./otel.js`.
- Learner-relevant: The deferred-reference trick (`let realtime` assigned before any bid can occur) and "don't listen until the backplane is connected."

### part-4-realtime-socketio-redis/web/src/liveAuction.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/web/src/liveAuction.ts]]
- Purpose: Browser-side realtime client and refresh coalescer.
- Key exports: `createRefreshCoalescer(refresh)` (one in-flight + one trailing refresh, retry after failure); `watchAuctionChanges(slug, onChanged)` (WebSocket-only socket, subscribes on connect, filters by slug, returns a cleanup that disconnects).
- Dependencies: `socket.io-client`.
- Learner-relevant: Coalescing burst invalidation into bounded HTTP refetches while treating the socket as read-only.

### part-4-realtime-socketio-redis/web/src/App.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/web/src/App.tsx]]
- Purpose: Subscribes the item page to live changes.
- Key exports: `ItemPage` now uses `useCallback(loadAuction)` + `useMemo(createRefreshCoalescer)` and `watchAuctionChanges(slug, () => refreshAuction())` in an effect with cleanup; `BidForm` receives `onRefresh={refreshAuction}`.
- Dependencies: `./liveAuction`, `./catalog`, React hooks.
- Learner-relevant: Subscription lifecycle tied to the mounted auction, and stable refresh identity via `useMemo`.

### part-4-realtime-socketio-redis/tests/realtime-bid.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/tests/realtime-bid.spec.ts]]
- Purpose: Headless two-context Edge test proving a bid in one window updates another without reload.
- Key exports: `createBidderPage` (sets `sessionStorage` identity via `addInitScript`), `openSubscribedAuction` (waits for the socket `{ ok: true }` frame), then asserts the watcher's price/bidder/count/minimum/history update.
- Dependencies: `@playwright/test` (WebSocket frames), `pg`.
- Learner-relevant: How to synchronize a browser test on a real WebSocket handshake rather than sleeping.

### part-4-realtime-socketio-redis/package.json + server/package.json + web/package.json
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/package.json]]
- Purpose: Part-4 dependency/script delta.
- Key exports: root adds `redis:up` and passes `REDIS_URL` into `dev`/`start`; server adds `socket.io`, `@socket.io/redis-adapter`, `redis` (and `socket.io-client` dev); web adds `socket.io-client`.
- Dependencies: `redis:7` Compose service on `56379`.
- Learner-relevant: The visible dependency footprint of one realtime slice.

## Notes on progression and the Codex workflow

- **Migrations do not grow across parts 2–4.** `001_marketplace.sql` is byte-identical in parts 2, 3, and 4; the concurrency and realtime capabilities are pure application code. Only part 1→2 introduces schema (none → users/auctions/bids).
- **`app.ts` grows monotonically.** part 1 health only → part 2 marketplace CRUD with Zod and lateral joins → part 3 injected `Clock` + per-auction `FOR UPDATE` transaction + typed 409 metadata → part 4 adds a `publishAuctionChanged` seam with best-effort post-commit emission. Each step reuses the same `buildApp()` injection pattern so tests stay possible.
- **The front end follows the same arc.** part 1 static local `catalog` UI → part 2 API-backed UI + demo-user switching + bid form → part 3 typed `BidConflictError`, bounded refresh retry, and an injected-environment deadline watcher → part 4 WebSocket subscription with refresh coalescing.
- **What the docs reveal about the Codex workflow.** `GRILL.md` is written *before* prompting and locks decisions (including deliberately deferred ones); `AGENTS.md` encodes durable agent constraints; `CODEX.md` + `codex-logs/` show `codex exec` run non-interactively with explicit verification checklists, models/approval/reasoning settings, self-diagnosis of environment issues (Docker creds), repeated patch iterations, and an honest fallback when browser control was unavailable. Later parts ship without `CODEX.md`/`codex-logs`, so the transcript evidence lives only in part 1; parts 2–4 encode the process result in `GRILL.md`, tests, and `CONTEXT.md`.

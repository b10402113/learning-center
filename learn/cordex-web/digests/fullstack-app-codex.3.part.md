---
source: fullstack-app-codex
source_type: codebase
source_lines: 19151
language: TypeScript
file_count: 175
part: 3
status: absorbed
absorbed_at: 2026-10-04
created: 20261004
updated: 20261004
---

# Digest — fullstack-app-codex (part 3)

## Overview (L1)

- **Part 5 — hidden defect review.** A snapshot of the Part 4 realtime app with two deliberate regressions: the bid transaction changed `FOR UPDATE` to `FOR SHARE`, and the deterministic concurrency-serialization test was deleted. The capability is unchanged (realtime bid fan-out, injected app clock, authoritative closing); the lesson is defect hunting and regression review — the bug is invisible to the passing test suite and is found by reading the diff, the lock keyword, and/or git history, then reproduced with a concurrent-bid test.
- **Part 6 — async auction close via RabbitMQ.** The app stops relying on page visits to notice a deadline: a separate Auction Close Worker polls Postgres every second, claims due auctions with `FOR UPDATE … SKIP LOCKED`, atomically records a durable `auction_closes` row plus one transactional-outbox `AuctionClosed` event, and publishes with publisher confirms. A Notification Worker consumes with manual acks, writes idempotent per-recipient deliveries once, and emits user-room Socket.IO modals. Teaches transactional outbox, at-least-once + idempotent consumption, and `SKIP LOCKED` batch claiming.
- **Part 7 — winner checkout with mock Stripe.** Adds a durable one-per-close `purchases` record, winner-only create-or-reuse hosted Checkout Session, and a signed-webhook-only paid transition. The seller sees a role-limited `Awaiting payment | Paid` projection, the winner gets retryable checkout, and a mock-process restart recovers by replacing only the lost provider Session. Teaches payment flows, replay-safe/idempotent webhooks, server-authored amounts, and provider-failure recovery.
- **Part 8 — cross-stack debugging with OpenTelemetry/Jaeger.** Instruments the winning path — bid → close → RabbitMQ publish → consume → checkout → webhook — as named business spans, persists the W3C `traceparent` on auctions/closes/outbox rows and carries it in RabbitMQ headers and the in-memory Checkout Session, with a sampling policy that renders only `auction.`/`winner.`/`mock-stripe.` roots and redacts SQL/bodies/PII. Teaches distributed tracing, context propagation across process and time boundaries, signal/noise filtering, and using Jaeger to debug a multi-service workflow.
- **`stripe-service/` — standalone Mock Stripe.** A separate loopback-only Fastify service that creates Stripe-shaped Checkout Sessions, hosts a card form (`4242…` success, `4000…0002` decline), marks provider state paid *before* webhook delivery, and redelivers the same signed event after failure. Teaches mocking an external provider, hosted-checkout UX, HMAC signing, idempotent Session reuse, and provider-side trace propagation.

## Structure (L2)

### part-5-hidden-defect-review/README.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/README.md]]
- Purpose: Describes the Part 5 run: `npm install` / `npm start` bring up shared Postgres + Redis and the isolated `auction_part_5` DB, run migrations, and start both apps (web 5105, API 3105); realtime is WebSocket-only and bids still go through the transactional HTTP endpoint.
- Key exports: run/ports narrative; `db:reset` restores ten demo users and six seeded auctions.
- Dependencies: root `docker-compose.yml` (Postgres, Redis).
- Learner-relevant: frames the snapshot as "same app as Part 4" — which is exactly why the planted regression is easy to miss without a diff.

### part-5-hidden-defect-review/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/GRILL.md]]
- Purpose: Carries forward the Part 3 concurrency contract and the Part 4 realtime design (the file's H1 still says "Part 4"). Documents the intended guarantees: per-auction row lock, app-clock closing eligibility, typed 409 conflicts, post-commit-only `auction:changed`, Socket.IO + Redis backplane, reconnect refetch.
- Key exports: current-state audit; Part 3 Rounds 1–2 decisions; Part 4 Rounds 1–2 decisions; agreed Mermaid architectures; two verified delivery slices.
- Dependencies: none (design doc).
- Learner-relevant: the written contract says bid submission "locks the auction row" and "serializes concurrent bids" — the Part 5 code no longer does, so the doc is the spec the defect violates.

### part-5-hidden-defect-review/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/app.ts]]
- Purpose: Fastify API: users, auction list/detail, create auction, and the bid transaction. Bid path does `BEGIN` → select auction → read current max → validate seller/clock/minimum → insert → `COMMIT`.
- Key exports: `buildApp({ clock, publishAuctionChanged })`, `Clock`, Zod schemas, `POST /api/auctions/:slug/bids`, `toBid`/`toAuction`.
- Dependencies: fastify, pg, zod, internal `realtime.js` type.
- Learner-relevant: **the hidden defect** — the auction row is selected `FOR SHARE` (app.ts:286) instead of `FOR UPDATE`, so two concurrent bids can both hold a read lock, both read the same max, and both insert; the regression silently reintroduces duplicate/too-low bids that Parts 3–4 had fixed.

### part-5-hidden-defect-review/server/src/app.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/app.test.ts]]
- Purpose: Vitest API tests. Versus Part 4, the `serializes concurrent bids and preserves a strictly increasing accepted history` test and its `pg_sleep` delay trigger were removed.
- Key exports: auction creation/validation, bid accept/reject, closed-auction, seller-self-bid tests (minus the concurrency test).
- Dependencies: fastify.inject, pg, zod, vitest.
- Learner-relevant: teaches that deleting the protecting test is what lets the defect ship green — a lesson in test coverage as the safety net for lock-mode changes.

### part-5-hidden-defect-review/server/src/realtime.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/realtime.ts]]
- Purpose: Socket.IO server (WebSocket-only) with a Redis Pub/Sub adapter; clients `auction:watch` a validated slug, server emits `auction:changed` to the room.
- Key exports: `createAuctionRealtime`, `auctionRoom`, `AuctionChangedEvent`, `connectRedis`, `publishAuctionChanged`.
- Dependencies: socket.io, `@socket.io/redis-adapter`, redis, zod.
- Learner-relevant: the realtime layer is correct; only the persistence/locking layer is broken — localizing the defect to the transaction.

### part-5-hidden-defect-review/server/src/index.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/index.ts]]
- Purpose: Entry point: loads `./otel.js`, builds the app with a realtime publish callback, attaches Socket.IO, requires Redis before `listen`.
- Key exports: top-level startup (no exports).
- Dependencies: internal `otel.js`, `app.js`, `realtime.js`; Redis at `redis://localhost:56379`.
- Learner-relevant: shows the "Redis is a startup dependency before listen" decision in code.

### part-5-hidden-defect-review/server/src/otel.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/otel.ts]]
- Purpose: Minimal OpenTelemetry bootstrap (`NodeSDK`, service `auction-server`, `ConsoleSpanExporter`, all auto-instrumentations) — noisy, precursor to Part 8's curated tracing.
- Key exports: side-effect `sdk.start()`.
- Dependencies: `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/sdk-trace-base`.
- Learner-relevant: contrast with Part 8 — auto-instrumentation dumps everything, motivating selective, high-signal sampling.

### part-5-hidden-defect-review/server/src/migrate.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/src/migrate.ts]]
- Purpose: Ordered SQL migration runner: a `schema_migrations` ledger, sorted `*.sql` files each applied inside `BEGIN`/`COMMIT`.
- Key exports: top-level script.
- Dependencies: `node:fs/promises`, pg.
- Learner-relevant: explicit, idempotent migrations without an ORM — the pattern reused by every later part.

### part-5-hidden-defect-review/server/migrations/001_marketplace.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/server/migrations/001_marketplace.sql]]
- Purpose: Schema + seed: `users`, `auctions` (slug, seller, category, cents, `ends_at`, specs jsonb), `bids` (FKs, amount, `created_at`), indices, ten demo users, six seeded auctions.
- Key exports: tables `users`, `auctions`, `bids`; `bids_auction_created_idx`, `auctions_ends_at_idx`.
- Dependencies: none (raw SQL).
- Learner-relevant: authoritative state lives here; the winning bid is always derived from `bids`, never from sockets — the invariant every later part preserves.

### part-5-hidden-defect-review/web/src/liveAuction.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/liveAuction.ts]]
- Purpose: Client Socket.IO watcher plus `createRefreshCoalescer` — at most one in-flight plus one trailing authoritative refetch.
- Key exports: `createRefreshCoalescer`, `watchAuctionChanges`, `AuctionChangedEvent`.
- Dependencies: socket.io-client.
- Learner-relevant: shows coalescing overlapping invalidations and refetching Postgres-authoritative state rather than trusting the event.

### part-5-hidden-defect-review/web/src/auctionDeadline.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/auctionDeadline.ts]]
- Purpose: Injects a clock/timer environment to schedule the local open→ended transition at `endsAt` and recompute on tab visibility.
- Key exports: deadline watcher factory / environment type.
- Dependencies: none (browser time injected for tests).
- Learner-relevant: frontend is a hint only; the backend clock remains authoritative at the exact boundary.

### part-5-hidden-defect-review/web/src/App.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/App.tsx]]
- Purpose: React shell: routing, active user, catalog/detail pages, Socket.IO watcher wiring, bid form, ended-state rendering.
- Key exports: `App` (default), page components inline.
- Dependencies: react, socket.io-client, internal `liveAuction`, `catalog`, components.
- Learner-relevant: the UI path that consumes `auction:changed` and reconciles to the API snapshot.

### part-5-hidden-defect-review/web/src/catalog.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/catalog.ts]]
- Purpose: Typed API client: users, auction list/detail, create auction, place bid, and client error-code handling (`BID_TOO_LOW`, `AUCTION_CLOSED`, `SELLER_CANNOT_BID`).
- Key exports: `listAuctions`, `getAuction`, `createAuction`, `placeBid`, DTO types.
- Dependencies: fetch, internal types.
- Learner-relevant: stable machine-readable conflict codes drive the stale-bid recovery UX.

### part-5-hidden-defect-review/web/src/components/BidForm.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/components/BidForm.tsx]]
- Purpose: Bid input; preserves the entered amount on conflict, refreshes authoritative state, never auto-resubmits; disables when ended.
- Key exports: `BidForm`.
- Dependencies: react, internal catalog API.
- Learner-relevant: the client half of the concurrency contract — the defect is server-side, so this behavior is unchanged.

### part-5-hidden-defect-review/web/src/components/NewAuctionPage.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/components/NewAuctionPage.tsx]]
- Purpose: Create-auction form (title, category, description, condition, location, starting price, future close time).
- Key exports: `NewAuctionPage`.
- Dependencies: react, internal catalog API.
- Learner-relevant: input boundaries mirrored by Zod on the server.

### part-5-hidden-defect-review/web/src/components/ProductArt.tsx · ProductCard.tsx · SiteHeader.tsx · UserSwitcher.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/web/src/components/]]
- Purpose: Shared UI: category illustration, catalog card, header (search/user name), and footer demo-user switcher (sessionStorage identity per tab).
- Key exports: `ProductArt`, `ProductCard`, `SiteHeader`, `UserSwitcher`.
- Dependencies: react; no auth (demo identity only).
- Learner-relevant: the deliberate "no authentication, demo user" boundary carried through all later payment work.

### part-5-hidden-defect-review/tests/realtime-bid.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/tests/realtime-bid.spec.ts]]
- Purpose: Playwright test that an accepted bid refreshes every open watcher without reload; part-5 no longer includes `bidding-war.spec.ts` (present in Part 4).
- Key exports: `test('an accepted bid refreshes every open watcher without a page reload')`.
- Dependencies: Playwright, running stack.
- Learner-relevant: the visible suite stays green despite the concurrency defect — demonstrating why E2E coverage alone is insufficient and diff review is needed.

### part-6-async-close-rabbitmq/README.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/README.md]]
- Purpose: Documents the four-process run (API 3106, web 5106, Close Worker, Notification Worker) plus shared Postgres/Redis/RabbitMQ; describes the poll→outbox→publish→consume→modal flow.
- Key exports: `npm start` process orchestration; `db:reset`.
- Dependencies: root `docker-compose.yml`.
- Learner-relevant: names the runtime topology the concurrency/idempotency design assumes.

### part-6-async-close-rabbitmq/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/GRILL.md]]
- Purpose: Adds the Part 6 design after the carried-in Part 3/4 sections: deadline is the business cutoff; close records the authoritative winner; no-bid auctions still close; at-least-once delivery with end-to-end idempotency; live-only dismissible modals; outbox atomicity; bounded `SKIP LOCKED` polling.
- Key exports: Rounds 1–2 decisions; final clarification (no DLQ/backoff); agreed Part 6 Mermaid architecture; two verified slices.
- Dependencies: none.
- Learner-relevant: the definitive spec for outbox + idempotent consumer reasoning.

### part-6-async-close-rabbitmq/docs/adr/0001-close-events-through-a-transactional-outbox.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/docs/adr/0001-close-events-through-a-transactional-outbox.md]]
- Purpose: ADR: commit the close and its `AuctionClosed` outbox row in one transaction, mark published only after RabbitMQ confirms; idempotent close/outbox/delivery/browser IDs make at-least-once safe; retries and DLQ deliberately deferred.
- Key exports: ADR 0001.
- Dependencies: none.
- Learner-relevant: the canonical statement of the DB→queue handoff problem and its minimal solution.

### part-6-async-close-rabbitmq/server/src/auctionClose.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/auctionClose.ts]]
- Purpose: `closeDueAuctions`: in one transaction, `SELECT … WHERE ends_at <= now AND NOT EXISTS close FOR UPDATE OF a SKIP LOCKED LIMIT batch`, pick the winning bid (highest, earliest tiebreak), insert `auction_closes` + one `outbox_events` row.
- Key exports: `closeDueAuctions`, `auctionClosedEventSchema`, `AuctionClosedEvent`, `ClosedAuction`.
- Dependencies: pg, zod, `node:crypto`.
- Learner-relevant: demonstrates atomic close+outbox, `SKIP LOCKED` competing-worker safety, and deriving the winner from committed bids.

### part-6-async-close-rabbitmq/server/src/outboxPublisher.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/outboxPublisher.ts]]
- Purpose: `ensureAuctionEventTopology` declares a durable direct exchange `auction.events`, durable queue `auction.notifications`, routing key `auction.closed`; `publishPendingOutbox` claims unpublished rows `FOR UPDATE SKIP LOCKED`, publishes persistent messages, `waitForConfirms`, then stamps `published_at`.
- Key exports: `auctionEventsExchange`, `auctionNotificationsQueue`, `auctionClosedRoutingKey`, `ensureAuctionEventTopology`, `publishPendingOutbox`.
- Dependencies: amqplib (`ConfirmChannel`), pg, internal `auctionClose` schema.
- Learner-relevant: minimal durable RabbitMQ topology plus publisher-confirm-before-mark-published reliability.

### part-6-async-close-rabbitmq/server/src/close-worker.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/close-worker.ts]]
- Purpose: The `⏱️` long-lived worker: opens a confirm channel, ensures topology, then loops `closeDueAuctions` → `publishPendingOutbox` every second (busy-continue when work was done), with SIGINT/SIGTERM graceful stop.
- Key exports: top-level process.
- Dependencies: amqplib, pg, internal `auctionClose`, `outboxPublisher`, `otel.js`.
- Learner-relevant: shows a polling worker's cadence, error-retry, and shutdown behavior.

### part-6-async-close-rabbitmq/server/src/notification-worker.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/notification-worker.ts]]
- Purpose: The `🔔` worker: consumes `auction.notifications` with `prefetch(10)`, validates the message boundary with Zod (acking malformed), calls `deliverAuctionOutcome`, manual `ack` on success / `nack(requeue)` on failure; emits via `@socket.io/redis-emitter` to `user:<id>` rooms.
- Key exports: top-level process.
- Dependencies: amqplib, `@socket.io/redis-emitter`, redis, pg, internal delivery + `outboxPublisher`, `realtime` `userRoom`.
- Learner-relevant: manual ack semantics and the consumer side of at-least-once idempotency.

### part-6-async-close-rabbitmq/server/src/notificationDelivery.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/notificationDelivery.ts]]
- Purpose: Builds the seller (+winner) recipient set, inserts `notification_deliveries` with `ON CONFLICT (outbox_event_id, recipient_user_id) DO NOTHING`, then emits each still-unemitted delivery with a stable `notificationId` before stamping `emitted_at`.
- Key exports: `deliverAuctionOutcome`, `OutcomeNotification`.
- Dependencies: pg, `node:crypto`, internal `auctionClose` type.
- Learner-relevant: end-to-end idempotency — one delivery per event+recipient, stable browser-visible ID survives the socket-emission crash gap.

### part-6-async-close-rabbitmq/server/src/realtime.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/realtime.ts]]
- Purpose: Extends Part 5 realtime with `user:identify` (validated user room join/leave on switch) and `publishOutcomeNotification` → `auction:closed`; keeps auction-room `auction:changed`.
- Key exports: `userRoom`, `auctionRoom`, `createAuctionRealtime`, `publishOutcomeNotification`, `OutcomeNotification`.
- Dependencies: socket.io, redis adapter, zod.
- Learner-relevant: user-targeted routing vs public auction rooms, and active-user room migration.

### part-6-async-close-rabbitmq/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/src/app.ts]]
- Purpose: API now exposes `closedAt`/`winningBid` (LEFT JOIN close + winning bid) and rejects bids on closed auctions; bid transaction restored to `FOR UPDATE OF a` (fixing the Part 5 defect).
- Key exports: `buildApp`, `toAuction` with close fields, bid endpoint with `is_closed` guard.
- Dependencies: fastify, pg, zod, internal realtime.
- Learner-relevant: shows the API surfacing authoritative close state so refreshed pages (not just modals) show the outcome, and the correct `FOR UPDATE` lock.

### part-6-async-close-rabbitmq/server/migrations/002_auction_closes_outbox.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/migrations/002_auction_closes_outbox.sql]]
- Purpose: `auction_closes` (PK `auction_id`, `winning_bid_id` UNIQUE) and `outbox_events` (uuid PK, UNIQUE `(event_type, auction_id)`, `published_at`) plus a partial pending index.
- Key exports: tables + uniqueness constraints that make one-close/one-event idempotent.
- Dependencies: none.
- Learner-relevant: database constraints as the final concurrency safeguard.

### part-6-async-close-rabbitmq/server/migrations/003_notification_deliveries.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/server/migrations/003_notification_deliveries.sql]]
- Purpose: `notification_deliveries` (uuid PK, event FK, recipient, role, `emitted_at`, UNIQUE `(outbox_event_id, recipient_user_id)`) + pending index.
- Key exports: delivery idempotency table.
- Dependencies: none.
- Learner-relevant: demonstrates the unique-key pattern that upgrades at-least-once into exactly-once logical delivery.

### part-6-async-close-rabbitmq/web/src/outcomeNotifications.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/web/src/outcomeNotifications.ts]]
- Purpose: Client: per-tab `sessionStorage` handled-ID memory, deadline-ordered queue enqueue with duplicate suppression, role-specific modal copy, and `watchOutcomeNotifications` (identify user, listen `auction:closed`).
- Key exports: `rememberOutcomeNotification`, `enqueueOutcomeNotification`, `outcomeNotificationMessage`, `watchOutcomeNotifications`, `handledOutcomeNotificationsKey`.
- Dependencies: socket.io-client, sessionStorage, Intl.
- Learner-relevant: browser-side idempotency and multi-outcome ordering to avoid repeating a modal.

### part-6-async-close-rabbitmq/web/src/components/OutcomeModal.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/web/src/components/OutcomeModal.tsx]]
- Purpose: Dismiss-required dialog showing the role-specific outcome with "Dismiss" / "View auction" and a "N more waiting" hint.
- Key exports: `OutcomeModal`.
- Dependencies: react, internal `outcomeNotifications`.
- Learner-relevant: the live-only, dismiss-required notification UX.

### part-6-async-close-rabbitmq/web/src/auctionClose.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/web/src/auctionClose.ts]]
- Purpose: `watchAuctionCloseOutcome`: at `endsAt` begins polling `refresh()` every second until the authoritative close appears (stops when `closedAt` set).
- Key exports: `watchAuctionCloseOutcome`, `AuctionCloseRefreshEnvironment`.
- Dependencies: injected clock/timer environment.
- Learner-relevant: client converges to authoritative close without continuous polling while open.

### part-6-async-close-rabbitmq/web/src/App.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/web/src/App.tsx]]
- Purpose: Adds outcome-notification queue + `OutcomeModal` rendering, close-outcome refresh, and active-user socket identification to the Part 5 shell.
- Key exports: `App`.
- Dependencies: react, internal `outcomeNotifications`, `auctionClose`, components.
- Learner-relevant: integration of live modal queue with authoritative detail-page state.

### part-6-async-close-rabbitmq/tests/auction-close.spec.ts · outcome-notification.spec.ts · bidding-war.spec.ts · realtime-bid.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/tests/]]
- Purpose: Playwright E2E: due auctions converge to winner/no-bid outcomes; a RabbitMQ close event opens exactly one modal per online session; the four-window bidding war runs against the full async stack; realtime bid fan-out.
- Key exports: the four `test(...)` scenarios above.
- Dependencies: Playwright, running API + workers + RabbitMQ + Redis.
- Learner-relevant: end-to-end verification of the worker/queue/modal workflow and the inherited concurrency protection.

### part-7-winner-checkout/README.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/README.md]]
- Purpose: Documents the added Mock Stripe process (7107), checkout flow from modal/auction page, test cards, seller limited view, polling convergence, and lost-Session recovery.
- Key exports: run/ports; test-card semantics.
- Dependencies: root compose + sibling `stripe-service/`.
- Learner-relevant: product-level statement of the payment capability and its explicit non-goals.

### part-7-winner-checkout/GRILL.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/GRILL.md]]
- Purpose: Pre-implementation interrogation: mock-Stripe issues found (double-pay, weak reuse, paid-after-webhook, no retry record, in-memory loss), settled product/integrity decisions (winner-only, server-authored amount, signed raw-body webhook, one purchase per close, pending/paid only), architecture, and both verified slices.
- Key exports: Mock Stripe issue list; settled decisions; Mermaid architecture; slice verification.
- Dependencies: none.
- Learner-relevant: the security/integrity reasoning behind a replay-safe payment integration.

### part-7-winner-checkout/server/src/payments.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/server/src/payments.ts]]
- Purpose: Stripe client boundary: Zod schemas for Checkout Session and `checkout.session.completed`; `createMockStripeClient` (create/retrieve with timeouts); `StripeSessionNotFoundError`; `verifyStripeSignature` (HMAC-SHA256 + `timingSafeEqual`).
- Key exports: `createMockStripeClient`, `verifyStripeSignature`, `stripeWebhookEventSchema`, `StripeSessionNotFoundError`, `StripeClient`.
- Dependencies: `node:crypto`, zod, fetch.
- Learner-relevant: validation at the provider boundary, constant-time signature check, and a typed "Session missing" error enabling recovery.

### part-7-winner-checkout/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/server/src/app.ts]]
- Purpose: Adds role-limited `GET /api/auctions/:slug/checkout` and winner-only `POST …/checkout` (locks auction, `INSERT … ON CONFLICT (auction_id) DO NOTHING`, reuses a live Session or replaces a missing one, server-builds title/amount/URLs), and a raw-body `POST /api/webhooks/stripe` that matches purchase/session/amount/currency then idempotently marks paid.
- Key exports: `buildApp` with `stripeClient`, `stripeWebhookSecret`, `webBaseUrl`; checkout + webhook routes; `payment_webhook_events` insert.
- Dependencies: fastify, pg, zod, internal `payments`, `realtime`.
- Learner-relevant: concurrent-click convergence, server-owned payment inputs, and webhook-only paid transition with same-event/same-session replay safety.

### part-7-winner-checkout/server/migrations/004_winner_purchases.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/server/migrations/004_winner_purchases.sql]]
- Purpose: `purchases` (uuid PK, UNIQUE `auction_id` FK to close, winning bidder, amount, `usd`, `pending|paid`, provider session/url, consistency CHECKs) and `payment_webhook_events` (uuid PK per provider event).
- Key exports: purchase + webhook-event tables with invariants.
- Dependencies: none.
- Learner-relevant: durable purchase truth and DB-enforced idempotency (`one purchase per close`).

### part-7-winner-checkout/web/src/catalog.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/web/src/catalog.ts]]
- Purpose: Adds `getPaymentState` (role projection) and `createCheckout` (sends only `{userId}`, accepts the server-owned `checkoutUrl`); payment-state types.
- Key exports: `getPaymentState`, `createCheckout`, `PaymentState`.
- Dependencies: fetch.
- Learner-relevant: the browser never supplies authoritative amount/currency — a client-side boundary check.

### part-7-winner-checkout/web/src/App.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/web/src/App.tsx]]
- Purpose: Winner-only checkout panel with loading/required/pending/awaiting_payment/paid/error states, immediate button disable, redirect to hosted checkout, and post-return authoritative polling; `checkoutFromNotification` from the modal.
- Key exports: `App` (+ checkout helpers).
- Dependencies: react, internal `catalog`, `outcomeNotifications`.
- Learner-relevant: never trust the return URL; converge to API-confirmed paid.

### part-7-winner-checkout/web/src/components/OutcomeModal.tsx
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/web/src/components/OutcomeModal.tsx]]
- Purpose: Adds a winner-only "Complete purchase" button with pending/error state to the Part 6 modal.
- Key exports: `OutcomeModal`.
- Dependencies: react, internal `outcomeNotifications`.
- Learner-relevant: checkout entry point from the outcome notification, with duplicate-click protection.

### part-7-winner-checkout/tests/winner-checkout.spec.ts · seller-payment.spec.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/tests/]]
- Purpose: Playwright: winner declines (4000), cancels, retries, then completes (4242) to an authoritative paid page; seller converges awaiting→paid while unrelated users see no payment UI.
- Key exports: the two `test(...)` scenarios.
- Dependencies: Playwright, full Part 7 stack + Mock Stripe.
- Learner-relevant: end-to-end payment happy-path and decline/retry/recovery verification.

### part-8-cross-stack-debugging/README.md
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/README.md]]
- Purpose: Documents the golden trace, its generation steps in Jaeger (`auction-api`, operation `auction.bid.accept`, continuing through close/publish/consume/checkout/mark-paid), and the signal policy (only named business ops sampled; SQL/bodies/PII redacted; identifiers retained; `traceparent` persisted on auction/close/outbox and carried in RabbitMQ headers + Checkout Session).
- Key exports: golden-trace Mermaid; signal policy; traceparent propagation contract.
- Dependencies: root compose Jaeger (16686 UI, 4318 OTLP/HTTP).
- Learner-relevant: the specification for building and reading one continuous cross-service trace.

### part-8-cross-stack-debugging/server/src/tracing.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/tracing.ts]]
- Purpose: Business-span toolkit: extract context from `traceparent`/headers, inject `traceHeaders`/`activeTraceparent`, and `withBusinessSpan(...)`/`startBusinessSpan(...)` that set attributes, record exceptions, set ERROR, and end spans.
- Key exports: `contextFromTraceparent`, `contextFromHeaders`, `traceHeaders`, `activeTraceparent`, `startBusinessSpan`, `withBusinessSpan`.
- Dependencies: `@opentelemetry/api`.
- Learner-relevant: the small manual-instrumentation API used to keep only meaningful spans.

### part-8-cross-stack-debugging/server/src/otel.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/otel.ts]]
- Purpose: Curated SDK: `BusinessRootSampler` (only `auction.`/`winner.`/`mock-stripe.` roots sampled), `RedactingExporter` (drops `pg.connect`/pool/BEGIN/COMMIT/ROLLBACK spans and strips SQL/body/url attributes), `PgInstrumentation` + `UndiciInstrumentation` with route-specific span renames.
- Key exports: side-effect `sdk.start()` + shutdown handlers.
- Dependencies: `@opentelemetry/sdk-node`, `sdk-trace-base`, `exporter-trace-otlp-http`, `instrumentation-pg`, `instrumentation-undici`.
- Learner-relevant: signal/noise engineering and PII redaction — contrasted with Part 5's autodump.

### part-8-cross-stack-debugging/server/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/app.ts]]
- Purpose: Instruments bid (`auction.bid` → `auction.bid.accept|reject` with outcome attrs), persists `traceparent` on accepted bids, and wraps `winner.checkout.start` (parented from the close's stored `traceparent`) and `winner.purchase.mark-paid` (parented from webhook headers) with business spans.
- Key exports: `buildApp`; business-span outcomes/attributes.
- Dependencies: fastify, pg, zod, internal `tracing`, `payments`, `realtime`.
- Learner-relevant: start spans from *persisted* context so a trace survives a long system wait, and name spans by business outcome instead of red errors.

### part-8-cross-stack-debugging/server/src/auctionClose.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/auctionClose.ts]]
- Purpose: Wraps each close in `auction.close` (child of the auction's stored `traceparent`), emits `traceparent` into `auction_closes` and `outbox_events`, and records winner/no-bids + message ID attributes.
- Key exports: `closeDueAuctions` (tracing-aware).
- Dependencies: pg, zod, internal `tracing`.
- Learner-relevant: propagating the winning-bid trace into the close/outbox so the message continues the same trace.

### part-8-cross-stack-debugging/server/src/outboxPublisher.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/outboxPublisher.ts]]
- Purpose: Starts an `auction.closed.publish` PRODUCER span per outbox row, injects `traceHeaders` into RabbitMQ message headers, runs confirm/update under the publish context, and ends spans on success/failure.
- Key exports: `ensureAuctionEventTopology`, `publishPendingOutbox` (tracing-aware).
- Dependencies: amqplib, pg, `@opentelemetry/api`, internal `tracing`.
- Learner-relevant: W3C context propagation across the DB→RabbitMQ boundary.

### part-8-cross-stack-debugging/server/src/notification-worker.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/src/notification-worker.ts]]
- Purpose: Wraps consumption in an `auction.closed.consume` CONSUMER span parented from `message.properties.headers`, adds `auction.outcome.emitted` events per recipient, and records `notification.delivery.count`.
- Key exports: top-level process (tracing-aware).
- Dependencies: amqplib, redis emitter, pg, `@opentelemetry/api`, internal `tracing`.
- Learner-relevant: extracting context from message headers so the consumer span joins the producer's trace.

### part-8-cross-stack-debugging/server/migrations/005_observability_trace_context.sql
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/server/migrations/005_observability_trace_context.sql]]
- Purpose: Adds nullable `traceparent` columns to `auctions`, `auction_closes`, and `outbox_events`.
- Key exports: the three `ALTER TABLE` statements.
- Dependencies: none.
- Learner-relevant: persistence is what lets a trace span process restarts and long waits.

### part-8-cross-stack-debugging/docker-compose.yml (Jaeger service)
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/docker-compose.yml]]
- Purpose: Shared infra: Postgres 55432, Redis 56379, RabbitMQ 56726/15676, and Jaeger all-in-one (UI 16686, OTLP/HTTP 4318) with CORS for the local web origins.
- Key exports: services `postgres`, `redis`, `rabbitmq`, `jaeger`; volumes.
- Dependencies: Docker Compose.
- Learner-relevant: the observability backend is just another local container.

### part-8-cross-stack-debugging/tests/ (unchanged from Part 7)
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/tests/]]
- Purpose: Same Playwright suite as Part 7 (auction-close, bidding-war, outcome-notification, realtime-bid, seller-payment, winner-checkout) to prove instrumentation didn't break behavior.
- Key exports: six `test(...)` scenarios.
- Dependencies: Playwright, full Part 8 stack.
- Learner-relevant: regression coverage protects the golden path while instrumenting.

### stripe-service/src/app.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/app.ts]]
- Purpose: Mock Stripe: Zod-validated Session creation (parameter-consistent reuse, `idempotency_error` on conflict), hosted HTML checkout form, `/attempt` (decline 4000; success 4242 marks provider paid *before* delivering the signed webhook; 502 + retry path if delivery fails; no second charge), retrieval and traceparent retention.
- Key exports: `buildStripeApp`; `publicSession`, `checkoutHtml`, `deliverCompletion`.
- Dependencies: fastify, zod, `node:crypto`, internal `tracing`.
- Learner-relevant: provider-side idempotency, "mark paid before webhook," and stable-event redelivery after failure.

### stripe-service/src/tracing.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/tracing.ts]]
- Purpose: Mirror of the app tracing helper (`mock-stripe-business` tracer, `withStripeSpan`, `activeTraceparent`, `contextFromTraceparent`).
- Key exports: `withStripeSpan`, `activeTraceparent`, `contextFromTraceparent`.
- Dependencies: `@opentelemetry/api`.
- Learner-relevant: a second service joining the same trace via persisted `traceparent`.

### stripe-service/src/otel.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/otel.ts]]
- Purpose: Service `mock-stripe` SDK with a `StripeRootSampler` (only `mock-stripe.` roots) and Undici instrumentation that names the webhook call `winner.purchase.webhook HTTP`.
- Key exports: side-effect `sdk.start()`.
- Dependencies: OTel sdk-node, exporter-otlp-http, instrumentation-undici.
- Learner-relevant: per-service sampling so the mock joins traces only when it is part of a business operation.

### stripe-service/src/index.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/index.ts]]
- Purpose: Loopback-only startup (`host: '127.0.0.1'`), port 7107, webhook URL `http://127.0.0.1:3107/api/webhooks/stripe`, secret `whsec_local_part_7`.
- Key exports: top-level process.
- Dependencies: internal `otel.js`, `app.js`.
- Learner-relevant: binds the mock to loopback (an explicitly fixed security issue) and wires the webhook target.

### stripe-service/src/app.test.ts
- Locator: [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/app.test.ts]]
- Purpose: Vitest: one recognizable open Session per Purchase; hosted page declines the decline card and keeps the Session open; success marks paid, authenticates the webhook, redirects; a completed Session is not charged twice and redelivers the same event after failure.
- Key exports: four `it(...)` scenarios.
- Dependencies: vitest, fastify.inject, fetch.
- Learner-relevant: the provider-side idempotency/recovery guarantees tested directly.

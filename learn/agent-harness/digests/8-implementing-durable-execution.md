---
source: 8-implementing-durable-execution
source_type: pdf
source_lines: 372
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 8-implementing-durable-execution

## Overview (L1)

- Installing the durable dependencies — Adds the three packages the harness now needs: `@dbos-inc/dbos-sdk`, `drizzle-orm`, and `postgres`. This section is setup only; the interesting design comes next.
- Building the Drizzle database client — A new `harness/db.ts` imports Drizzle and Postgres, reads `DATABASE_URL` from `process.env` with a sanity-check throw if missing, creates a Postgres client (`max: 5`) and exports a `db` instance that wraps it.
- Defining the event log table — A `pg_table` called `event_log` with a `seq` `bigserial` primary key (ordering, replay, de-duplication), a `jsonb` `data` column typed generically as `AgentEvent` (developer experience only — the DB sees plain JSON), and a not-null constraint.
- Runtime schema guard — An `ensureSchema` routine runs `create table if not exists event_log` through Drizzle's SQL template tags, acting as a lightweight runtime migration to avoid an error the author hit while building the course.
- Making the bus durable — The in-memory bus is moved into the harness and stripped of its stateful class. It keeps three functions: `subscribe` (adds a listener, returns a cleanup closure to avoid leaks, analogous to a `useEffect` cleanup), `emit` (builds an `AgentEvent` with a random ID and timestamp, inserts it into the event log, then notifies listeners only after the write succeeds), and `history` (selects all rows ordered by `seq`, mapping each to its `data` payload for replay).

## Sections (L2)

### installing-durable-dependencies

- Locator: `[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#installing-durable-dependencies]]`
- Summary: Runs the install command for the DBOS SDK, Drizzle ORM, and the Postgres driver, framing it as ordinary database setup that is part of the harness.
- Key claims: DBOS SDK, Drizzle ORM, and Postgres are the three dependencies; the setup is basic and not agent-specific.
- Learner-relevant: Prerequisite step that makes the rest of the durability work possible.

### drizzle-db-client

- Locator: `[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#drizzle-db-client]]`
- Summary: Creates `harness/db.ts`, imports `drizzle` from `drizzle-orm/postgres-js` and `postgres`, reads the connection string, and exports a Drizzle-wrapped client.
- Key claims: `process.env.DATABASE_URL` is how Node reads the env var; a missing connection string should throw immediately; the client uses `max: 5` since pooling is not really in play; the exported `db` is essentially an SDK for querying the database.
- Learner-relevant: Gives the minimal, reusable database-client pattern that every later persistence call relies on.

### event-log-table-schema

- Locator: `[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#event-log-table-schema]]`
- Summary: Defines the `event_log` table with `seq` (`bigserial` primary key), `data` (`jsonb`, typed as `AgentEvent`, not null), and explains each column's purpose.
- Key claims: `seq` provides sequential ordering so events can be replayed in order and de-duplicated; `jsonb` stores vanilla JSON blobs and the generic type is purely editor DX, invisible to the database; this schema pattern is common to any DB-backed app, nothing agent-specific.
- Learner-relevant: The durable substrate for the event stream and the replay mechanism the bus will use.

### runtime-schema-ensure

- Locator: `[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#runtime-schema-ensure]]`
- Summary: Adds a runtime `ensureSchema` check that issues `create table if not exists event_log` via Drizzle's tagged SQL template.
- Key claims: It is a small runtime migration, technically optional but added because the author hit an error during course development; it mirrors the Drizzle schema in raw SQL.
- Learner-relevant: Shows how to keep the database schema in sync at startup without a separate migration tool.

### durable-bus-subscribe-emit-history

- Locator: `[[sources/agent-harness/20260915/8-implementing-durable-execution.txt#durable-bus-subscribe-emit-history]]`
- Summary: Refactors the in-memory bus into the harness and makes it durable: `subscribe` tracks listeners and returns a cleanup function, `emit` persists before broadcasting, and `history` reads the ordered log for replay.
- Key claims: The stateful class is removed because no in-memory state is kept anymore; persisting first and notifying second means a server crash after the write still leaves the event available; the cleanup function prevents listener memory leaks (the `useEffect` cleanup analogy); `history` returns mapped `AgentEvent` payloads ordered by `seq`.
- Learner-relevant: The concrete "write-then-publish" bus contract and the replay API that durable workflows depend on.


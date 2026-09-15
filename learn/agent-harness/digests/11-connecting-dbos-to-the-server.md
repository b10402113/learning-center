---
source: 11-connecting-dbos-to-the-server
source_type: pdf
source_lines: 369
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 11-connecting-dbos-to-the-server

## Overview (L1)

- Explicit env loading — A new `env.ts` uses dotenv `config` pointed at the `.env` file so environment variables are loaded before the database is needed, replacing the AI SDK's implicit auto-loading.
- Server wiring and imports — The server imports DBOS, the in-house schema, the bus `subscribe`/`history` functions, `runAgentWorkflow`, and the client message type; legacy event-bus pieces are flagged for removal because a custom bus now exists.
- main() bootstrap — Everything is wrapped in an async `main` that ensures the schema (migrating if needed), calls `DBOS.setConfig` with the harness name and `DATABASE_URL`, and `DBOS.launch()`es before starting Express and WebSocket.
- Subscription and connection handling — The WebSocket server subscribes to the bus, broadcasts stringified events to every open client, and on connection registers an `on message` handler.
- Task submission and history replay — A `submit task` client message triggers `DBOS.startWorkflow(runAgentWorkflow)(...)`; outside that handler the connection replays all history events to reconnecting clients one by one.
- Server bring-up and fixes — `server.listen` moves into `main`, `main` is invoked with `.catch` error handling and `process.exit(1)`, then a live debug pass fixes camelCase (`toolCallId`, `toolName`), `turn.text` vs `texts`, and a classically shadowed `emit`.
- Durability demo — The demo kills the running server mid-generation, restarts it, reloads the browser, and the workflow picks up exactly where it left off, proving persistence replaced the old ephemeral behavior.

## Sections (L2)

### dotenv-env-loader

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#dotenv-env-loader]]`
- Summary: Explains the need for a dedicated env module now that a database exists, and creates `env.ts` invoking dotenv `config` with a path to the env file.
- Key claims: Previously the AI SDK auto-loaded environment variables; with a database in play variables must load one step earlier; the loader is deliberately minimal.
- Learner-relevant: A reusable prerequisite pattern for any server adding durable infrastructure.

### server-imports

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#server-imports]]`
- Summary: Walks through the imports the server needs — DBOS, the in-house schema, bus subscribe/history, the registered workflow, and the client message type.
- Key claims: The `runAgentWorkflow` is imported from the workflow module; the old event bus is no longer needed because a custom bus was built; some prior imports are commented out pending cleanup.
- Learner-relevant: Maps the dependency graph of the server entry point before the bootstrap logic is written.

### main-bootstrap-dbos

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#main-bootstrap-dbos]]`
- Summary: Wraps start-up in an async `main` that ensures the schema, configures DBOS (`setConfig` with name and system database URL), and launches DBOS.
- Key claims: `ensureSchema` runs/creates migrations automatically so they need not be run manually (with a caveat that production would not do this); `DBOS.setConfig` takes the app name `harness` and `process.env.DATABASE_URL`; `DBOS.launch()` starts the durable engine.
- Learner-relevant: The exact initialization sequence required to make workflows executable.

### websocket-subscribe-broadcast

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#websocket-subscribe-broadcast]]`
- Summary: Moves the Express and WebSocket setup inside `main` and wires `subscribe` so bus events are JSON-stringified and sent to every open client.
- Key claims: The subscription callback collects clients and checks `client.readyState === open` before sending; the event bus is dropped in favor of the custom bus.
- Learner-relevant: Shows the broadcast bridge from durable workflow events to live connected clients.

### connection-message-handling

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#connection-message-handling]]`
- Summary: Sets up the per-connection `on message` handler that parses incoming client messages inside a try/catch, returning harmlessly on parse failure.
- Key claims: The socket is typed `WebSocket`; messages are parsed with `rawToStream`; malformed messages are swallowed because the error is already understood.
- Learner-relevant: A defensive pattern for client-to-server message intake before dispatching by type.

### submit-task-starts-workflow

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#submit-task-starts-workflow]]`
- Summary: When a `submit task` message arrives (the user pressing enter on a new message), the handler awaits `DBOS.startWorkflow(runAgentWorkflow)` and immediately invokes the returned function with the inputs.
- Key claims: `startWorkflow` returns a function that takes the workflow arguments; it is invoked immediately in the same expression for brevity; this replaces the plain in-process call.
- Learner-relevant: The single integration point where a user action becomes a durable, resumable workflow.

### history-replay

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#history-replay]]`
- Summary: Still inside `on connection`, the server fetches all workflow history and replays it to the newly connected client event by event.
- Key claims: History comes from the bus `history` function; events are stringified and streamed one at a time rather than in one batch; this reconstructs what a reconnecting client missed.
- Learner-relevant: Explains how a refreshed or reconnected UI rebuilds state from durable history.

### listen-and-main-invocation

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#listen-and-main-invocation]]`
- Summary: `server.listen` is moved into `main`, and the file ends by calling `main().catch(...)` to log errors and exit with code 1.
- Key claims: Server listen must happen after DBOS is launched; the catch handler logs the error and exits non-zero.
- Learner-relevant: The ordering constraint between durable engine launch and HTTP listening.

### debugging-typos-shadowing

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#debugging-typos-shadowing]]`
- Summary: A live debugging pass after the TypeScript server failed: fixes non-camelCase property names, a wrong `texts`/`turn.text` reference in emits, and a shadowed `emit` variable.
- Key claims: `toolCallId` and `toolName` must be camelCase; emits must use `turn.text`; a locally declared `emit` shadowed the imported durable `emit`, so the wrong one was used — the local must be removed because emit is now imported and no longer passed into the workflow; a working reference solution lives on lesson three.
- Learner-relevant: A concrete lesson in import shadowing and the cost of a dead language server; useful as a debugging anchor.

### durability-demo

- Locator: `[[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#durability-demo]]`
- Summary: Demonstrates durability live — a task is submitted, the server is killed mid-thinking, then restarted and the browser reloaded; the workflow resumes and continues streaming on its own.
- Key claims: After restart the model saw the last message was a tool/assistant message with an unanswered call and continued generation without client help; merely reloading the browser re-established the stream from persisted state; previously this state would have vanished entirely.
- Learner-relevant: The end-to-end payoff proof that the node's step work produces a genuinely resumable agent.


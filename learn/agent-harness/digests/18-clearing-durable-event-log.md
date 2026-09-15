---
source: 18-clearing-durable-event-log
source_type: pdf
source_lines: 198
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 18-clearing-durable-event-log

## Overview (L1)

- Clearing the event log — Adds a `clearEventLog` function in `db.ts` that truncates the event log table so the durable event history can be reset for testing, then exposes it through a route.
- CORS middleware for the clear route — Because the new `/api/clear` endpoint will be called from the browser UI on a different origin, the server sets `Access-Control-Allow-Origin` so any origin passes the browser's preflight `OPTIONS` check.
- POST /api/clear route — Registers a POST route at `/api/clear` that clears the event log; the UI's existing Clear button is already wired to call it.
- Verifying compaction live — After clearing, the presenter pastes a sample task and watches the harness inspector. No startup errors occur, Clear works, and as the run proceeds the event stream shows `memory_compacted` events with summarized turn counts, context token counts, and summaries, confirming compaction fires once the limit is crossed.
- Why compaction triggers when it does — Because the check runs at the top of every loop before the LLM call, each compaction fires just under the configured limit (context was slightly above it, then is brought back down). The lesson also notes that the summary's output length can be bounded via a `maxOutputTokens` hyperparameter in the summarize call, and reviews the actual limit values (`maxContextTokens` 500, `keepContextTokens` 200).

## Sections (L2)

### clear-event-log-function

- Locator: `[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#clear-event-log-function]]`
- Summary: Adds `clearEventLog` to `db.ts`, which truncates (drops) the event log table, and imports it into the server entrypoint alongside the existing `ensureSchema`.
- Key claims: Truncating the event log resets durable state for testing; the function is a simple DB-level operation exported for reuse by the route.
- Learner-relevant: Teaches the minimal durable-state reset needed to re-run and observe agent behavior from a clean slate.

### cors-middleware

- Locator: `[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#cors-middleware]]`
- Summary: Sets up CORS because the new browser-called route crosses origins. The middleware sets `Access-Control-Allow-Origin` so any origin can pass the preflight `OPTIONS` request browsers send before the real call.
- Key claims: CORS controls which non-same-origin clients may access the server; the preflight OPTIONS check must be satisfied before the request; a simple allow-origin header is the classic Express pattern used here.
- Learner-relevant: A foundational web-server concern for exposing an agent API to a browser UI.

### clear-route

- Locator: `[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#clear-route]]`
- Summary: Registers a POST handler at `/api/clear` that clears the event log. The UI Clear button already targets this endpoint, so no UI changes are needed.
- Key claims: A single POST route exposes the clear operation; the front-end is already wired to it.
- Learner-relevant: Shows how harness operations are surfaced as HTTP endpoints for the inspector UI.

### observing-compaction

- Locator: `[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#observing-compaction]]`
- Summary: After a clean restart, Clear is invoked and a sample task is run. The inspector shows the agent working one item at a time, and eventually `memory_compacted` events appear with summarized turns (e.g. 3), context tokens (e.g. 619 / 674), and the summary — sometimes more than one compaction over a run.
- Key claims: Compaction fires repeatedly once the threshold is crossed; the event stream exposes summarized turn counts and token counts; the presenter only briefly sees a compaction in real time before finding it in the log.
- Learner-relevant: Provides the observable evidence that compaction and hydration work end to end.

### compaction-timing-and-limits

- Locator: `[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#compaction-timing-and-limits]]`
- Summary: Explains that compaction triggers just under the configured limit because the check runs at the top of each loop before the LLM call: once the flattened estimate exceeds the limit, turns are shifted until it is back under the keep threshold. Also covers bounding summary size via a `maxOutputTokens` hyperparameter in the summarize call, and confirms the configured limits (`maxContextTokens` 500, `keepContextTokens` 200).
- Key claims: Compactions cluster just below the limit by design; the summary length can be capped with a max-output-tokens parameter rather than relying on prompt pleading; the demonstrated settings are deliberately aggressive and not production-realistic.
- Learner-relevant: Builds intuition for how thresholds and output caps shape compaction frequency and summary size.

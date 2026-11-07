---
source: sources/js-mastery-engineer/20261107/course/028 - Autopsy- The Workflow Codebase.en.txt
source_type: text
source_lines: 109
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Reads the workflow-built codebase feature by feature against the vibe build's known 40 seconds and 35 cents per page load.
- Feed: ratings become a taste vector, one database call plus a vector index finds closest movies and writes a recommendations table; `getFeed` just reads that table with no model call, so page cost is near zero and speed is a Supabase read.
- AI appears only in `feedReasons`: one batched Sonnet call, not Opus or Fable, thinking off, only when taste changes or the user refreshes, never on page load; the refresh decision is named `feedStale`.
- The decision is documented in a `007.md` scope options section: cache and regenerate on profile change was chosen; compute-live is recorded as rejected with cons (multi-second Sonnet cost per load, reshuffled picks, serverless duration risk).
- Import: browser parses CSV in chunks of 100 rows, retry resumes the same import, a retry helper backs off, matching rows are upserted by movie ID so nothing is deleted and there is no window without ratings.
- A dedupe detail handles two export rows resolving to the same movie, which would otherwise fail the chunk and wedge the import forever via identical retries; it exists because an architecture acceptance criterion said imports can never lose data.
- Vibe search is a readable five-step pipeline: get taste, parse intent with a small cheap model, vector/embedding shortlist real candidates, let a mid model pick 3–5 only from the list, log and return.
- Hallucination is blocked architecturally through the movie schema, not just instruction; tests are named by acceptance-criteria number, six migrations exist, and extra lines are load-bearing — the codebase is made of decisions rather than defaults.

# L2 detail

- `#L1-L6` — Recalls the vibe build's 40 seconds and 35 cents and introduces the engineering comparison.
- `#L7-L18` — Shows the feed retrieval: ratings as a taste vector, one database call and vector index writing a recommendations table, and `getFeed` reading the table with no model call.
- `#L19-L26` — Shows the AI's small role in `feedReasons`: one batched Sonnet call with thinking off, only when taste changes or on manual refresh, never on page load.
- `#L27-L34` — Points to `feedStale` as a named decision and opens the `007.md` scope options where caching and retrieval choices were recorded.
- `#L35-L44` — Reads the chosen option (cache and regenerate on profile change) and the rejected live-compute option with its cost, stability, and serverless-duration cons.
- `#L45-L48` — Argues the vibe build did not choose wrong; nobody ever showed it the choice.
- `#L49-L60` — Shows the import flow: chunked browser parsing, resumable retry, per-chunk backoff, upsert by movie ID, and no delete window.
- `#L61-L66` — Explains the dedupe handling for two rows resolving to one movie and ties it to the "import can never lose data" acceptance criterion.
- `#L67-L78` — Describes the vibe search pipeline: taste profile, cheap-model intent parsing, embedding/vector shortlist, mid-model selection of 3–5 from the provided list, logging and return.
- `#L79-L86` — Explains that the movie schema makes hallucination impossible in the code, the difference between a rule and a guarantee.
- `#L87-L96` — Shows Vitest configured with tests named by acceptance-criteria number, unlike the other repo's zero tests.
- `#L97-L104` — Notes six migrations and argues every extra line over the vibe build is load-bearing and traces to a pre-build question.
- `#L105-L109` — Concludes the vibe codebase is made of defaults and this one of decisions, then previews asking whether the vibe build is really that bad.

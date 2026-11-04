---
source: sources/background-agent/20261105/lessons/advanced-lab/index.md
source_type: text
source_lines: 28
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - web.md#L1-L713
  - server.md#L1035-L1051
  - service.md#L1-L221
---

# L1 overview

- Capstone framing — the last two code edits are small on purpose; the engineering work is proving an action ID and a help path behave correctly when the world changes, not judging whether the report sounds convincing.
- Four trials, one fresh checkout each — `--fault feature --alerts 3 --interval-ms 1000` (alerts join one incident), `--fault release` (deny then approve, version must still match), `--fault feature --lose-next-action-response` (one effect, retry with the same action ID), `--fault dependency --recover-after-ms 45000` (answer is context, recovery must be observed).
- Three scoring dimensions — world outcome (fresh `/state` + terminal status), action trajectory (Activity, tool results, Inngest steps, no repeated mutating effect), human boundary (matching approval; a help answer authorizes nothing and certifies nothing).
- Failure attribution and model comparison — decide whether evidence, tool contract, harness policy, or event correlation should change; a prompt edit is only a candidate when boundary and evidence were already correct; repeat a trial on a second model and compare trajectories.
- Design stretch — two regions with overlapping outages: choose an incident key, a join rule, and a close/reopen rule, and place outbox durability in the service, operator API, workflow, or prompt.

# L2 detail

- `#L1-L3` — Why the capstone exists: proving behavior under a changing world is the real work, and the report's tone is not evidence.
- `#L4-L8` — Trial setup: keep agent, operator app, and Inngest running; restart only the checkout terminal per trial; keep `/activity`, `/events`, `/`, and Inngest traces open; record the run ID; predict authority before acting.
- `#L9-L14` — The four-trial table pairing each `npm run dev:checkout` command with the invariant to prove (one incident for several alerts, deny/approve with version match, single committed effect with the same action ID and a 503 retry, help answered while degraded then `health.recovered`).
- `#L15-L22` — Scoring table: World outcome / Action trajectory / Human boundary, each with a pass condition and the artifacts to show as evidence.
- `#L23-L26` — Diagnosing a failed run by layer (missing evidence, ambiguous tool contract, permissive harness, wrong event correlation) and the stretch exercise comparing two models' trajectories plus writing one automated assertion.
- `#L27-L28` — Paper design of the next version: incident key, alert-join rule, close/reopen rule, and how to preserve events if checkout crashed after changing state but before publishing an alert.

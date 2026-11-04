---
source: sources/background-agent/20261105/9-dashboard-database-schema.vtt
source_type: text
source_lines: 738
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L692-L811
  - server.md#L505-L691
  - server.md#L217-L504
---

# L1 overview

- Assignment recap — before moving on, students must walk the dashboard loop themselves: what did it predict from this state, why this tool, was the state correct, is the ordering right. If this foundational observe/decide/act loop is wrong, "nothing we do is gonna work."
- Inngest dev server exists and is underused here — a local dashboard (found later at `127.0.0.1:8288/runs`) shows functions, triggers, runs, and steps. Because the agent is currently one function with one step there is almost nothing to see; it gets valuable once the loop is split into steps.
- Schema is intentionally small — `events` stores the raw payload plus `runId`; `actions` stores action name, arguments, results; `runs` is the important one. Everything is JSON blobs in Postgres, "nothing crazy."
- Run is the unit of execution, not investigation — loosely, one dashboard row = one run. An investigation may span weeks and multiple runs; the real definition is "the agent was woken up by some event." Whether a wake-up opens a new run or appends to an existing one is a product decision (e.g. filter on upstream SEV severity) and has nothing to do with the LLM.
- The hard work is policy, not durability — deciding which actions have consequences humans must gate, which are infrastructure-level stops, how/whether mutative actions update state the agent can see, and how long/expensive the loop may run.
- Snapshot portability — this is where pause/resume gets serious: if everything that defines a run lives in the DB, a run is effectively a state machine and a later execution can resume exactly where the old one left off. Scott serializes as much as possible into state so he never has to migrate runs later.
- The cap was observable — the recorded run stopped at 8 iterations (he counts the row entries on screen), and he explains why it never escalated: `chooseAction` gets only the goal plus the current observed state, with no history of its own prior decisions.
- Inngest as an operator console — cron/scheduled actions for days-to-years, plus kick off, mock inputs, rerun, stop, inspect events, and send a test event to simulate a down service.

# L2 detail

- `#L1-L39` — Assignment framing: re-run the demo yourself and verify the framework's output — what is it predicting based on state, how did it pick this tool and why, did it have the right state, is ordering followed. Explicit warning that without a correct foundational loop nothing downstream (steps, durability) will work.
- `#L40-L73` — Why the loop matters, then the Inngest dev server tangent: Inngest ships its own local dev dashboard; he hunts for the port ("I don't know what port I put Inngest on") so he can show the run list.
- `#L74-L167` — Honest caveat: with one function containing one step the dev dashboard "is really not that useful" right now; it becomes a real tool once the work is broken into different steps. He defers it and pivots to open Q&A about the code he wrote for students.
- `#L168-L232` — Schema tour, part 1: "you'd be surprised how simple the schema is." `events` holds the data plus the associated `runId`; `actions` holds the action name and its arguments — "these are all just JSON blobs in Postgres."
- `#L233-L338` — Schema tour, part 2, `runs`: one dashboard row is a run; don't overload it as "investigation," since one investigation could take weeks across multiple runs. A run is an event-driven wake-up, and every new wake-up either kicks off a new run (unrelated event) or appends to a current one. If an upstream service already categorizes SEV-0/SEV-1 and opens incidents, you would associate rather than create; here he creates a new run for everything because no such upstream exists.
- `#L339-L441` — The actual engineering: with Inngest handling durable execution, the remaining work is judgement — which actions have consequences requiring a human gatekeeper, which are infrastructure-level, how mutative actions update state (or whether to hide state changes from the agent), plus loop-length and cost guardrails. Then the escalation: pausing/resuming needs full snapshots and portable runs — same state a week later is a new run that is "virtually the same thing."
- `#L442-L487` — Design principle: put everything that defines a run in the DB so it is a state machine — "it doesn't matter if I start a new Inngest workflow... it has the same state... it'll pick up exactly where the old one left off even though it's a new execution." He always tries to serialize as much as possible into state to avoid run-migration problems later.
- `#L488-L574` — Postmortem of the demo run: it kept going to 8 and stopped (he counts 1–7 then 8 on the dashboard). The reason it behaved sanely rather than thrashing is that `chooseAction` only receives the goal and the current observed state — no history — so given history he believes it would have escalated to "ask for help" after the second refusal to disable the feature.
- `#L575-L633` — Question round: deferring actions can be scheduled with Inngest (cron or sleeps for days/hours/weeks/months/years). A student supplies the missing port — `127.0.0.1:8288/runs` — and they open the Inngest dashboard: the app, the function, its trigger list, and the app URL.
- `#L634-L738` — Inngest runs UI: the run eventually *failed* because nothing handles what happens after 8 iterations ("it just craps out"), the step timeline, then the operator features — kick off a function, mock its inputs, rerun, stop, browse all events (the one sent by the checkout service that starts the agent), and send a test event to simulate a downed service instead of using the CLI service.

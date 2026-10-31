---
source: sources/real-agent/20261030/Spec/027 Spec → Implement Solution.en.srt
source_type: text
source_lines: 1067
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- `/to-spec` converts a Wayfinder map into a flat, agent-ready spec: user stories, implementation decisions, references, prototype branches.
- ToSpec needs no Wayfinder knowledge; it reads the decision tickets and proposes seams (module boundaries) for human approval.
- The spec is deliberate spoon-feeding: passing the map directly works, but a flattened spec makes retrieval easy and implementation reliable.
- `/to-tickets` cuts the spec into 8 tickets with an initial tracer bullet and parallel groups defined by blocking relationships.
- `/implement-spec` runs unsupervised: prototype exploration, tracer-bullet implementer, per-ticket parallel agents, merger branches, then spec and standards code review with a fix agent.
- Leftover external setup (Nock workflows) is turned into code plus a short skill; QA confirms fidelity to the prototype and that preferences actually suppress notifications.

# L2 detail

- `#L1-L56` — Kickoff: `/to-spec` on the map. ToSpec is unaware of Wayfinder but recognises heavy decision traffic and pulls everything; it proposes seams as a preview of the modules to be created, which the author approves.
- `#L57-L90` — Spec produced: "In-app notifications for Cadence", framed as users being unable to tell when something concerning them happened and having nowhere in the app to surface it.
- `#L91-L154` — Spec anatomy: 61 user stories, implementation decisions (NOC as vendor, notifications live only in NOC), notification catalog, firing services, preferences, user sync, client feed port, feed UI, references, explicit prototype branches, and the whole map compressed into spec form.
- `#L155-L176` — Why a spec instead of the raw map: flattening and spoon-feeding makes it easy for agents to find what they need.
- `#L177-L290` — `/to-tickets`: the spec is broken into many small tickets (~8, with a tracer bullet first and groups that can run in parallel), carrying the same blocking-relationship structure as the decision tickets; author trims the count by feel.
- `#L291-L312` — Context is cleared and `/implement-spec` is given the spec number; no babysitting, with an autopsy scheduled for after the run.
- `#L313-L446` — Orchestration recap: NOC prototypes explored into exploration notes, implementer and merger agents, an orchestrator that notices duplicated test files and excludes them from the Vitest config, a tracer bullet, then five tickets in parallel with branches merged as each finishes; some verification still needs a human in the browser.
- `#L447-L532` — Review loop: after all tickets merge, the code-review skill runs spec and standards reviews; it catches glossary violations (new copy uses banned words) and test-helper leaks in `seekClaimServer.ts` error messages; one fix agent closes 15 findings and leaves the 5 flagged to keep.
- `#L533-L768` — Remaining setup: the Nock workflows wizard, a deliberate context compaction at the end of the implementation phase, then research showing the Nock management API and CLI do everything the dashboard wizard does, so workflows can be written as code; captured as a ~25-line skill describing credentials, steps, and when to use it.
- `#L769-L824` — Service token created in Cadence settings and put in `.env`; `npm run nock:push-workflows` fails, and the agent debugs it itself (missing action URL) to success, illustrating hill-climbing when the agent has real feedback and can push the button.
- `#L825-L944` — QA pass: notification bell and settings, enrollments and discussion questions/replies, a question fired as one user and received by another, deep link straight to the comments, reply flow, avatars, and clear mimicry of the prototype.
- `#L945-L1067` — Preference test: disabling discussion replies suppresses the notification, proving the settings work. Closing lesson: high-fidelity prototyping where decisions mattered, low-fidelity discussion where the agent could use its own creativity.

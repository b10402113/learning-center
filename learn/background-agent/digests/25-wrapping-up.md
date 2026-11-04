---
source: sources/background-agent/20261105/25-wrapping-up.vtt
source_type: text
source_lines: 745
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L1007-L1034
  - server.md#L1052-L1066
---

# L1 overview

- Homework capstone: more human-in-the-loop control, uncertain knowledge, context and run books — and the explicit gap that evals were never covered in this class, even though they are "huge" for background agents.
- Production tradeoffs on the runtime: DBOS (persisted in your own DB instead of a separate service), Temporal, Vercel Workflows, Upstash's HTTP-based workflow — "pick your poison", all good, differing in whether steps are declared manually or inferred.
- Durable execution as the soul, not the whole system: without the runtime an agent is just a server / an API; with it, it is always listening and awake — and anything that gives an agent its own computer (Codex-in-a-box, Grokbot-style) presupposes one.
- What durable execution does not solve: the surrounding plumbing still has to be built — where events come from across GitHub, logs, Linear/Jira tasks and Slack; auth and access to email (agent-mail + Gmail forwarding rather than SMTP/IMAP); hosting a browser or a full machine (Browser Base, Browser Use, Orgo at ~$25/month).
- What you supply that the model does not: the architecture opinion — observe, predict, validate with the harness, act, repeat — a generated version would hand you "here's one way" instead of "this is the way".
- The harness is the transferable artifact: ~70% of the email integration was the same harness, and for scaling software development you would build an "employee harness" whose tools drive hosted coding agents rather than another coding agent.
- Next steps: take the notes, hand them to a coding agent, build a background agent of your own, and try to break it — then go build agents that run forever.

# L2 detail

- `#L1-L55` — Closing framing: the capstone is left undone as homework, pointed at more human-in-the-loop controls and uncertain knowledge, with the admission that evals were skipped and are essential here.
- `#L56-L138` — Tour of durable workflow alternatives: DBOS (state in a database rather than a hosted service), Temporal, Vercel Workflows, and Upstash's HTTP-based runtime that lets you stay serverless — most of them auto-convert code into steps.
- `#L139-L175` — Build-it-yourself advice: feed these notes to a coding agent, describe the background agent you want, then reason about it and try to break it; the OpenAI / Grokbot "own computer" demo is cited as the motivating case for a durable runtime.
- `#L176-L196` — The "soul" framing: a durable runtime is what keeps the agent alive and listening; without it you have a server or an API, and an agent with its own computer cannot exist.
- `#L197-L231` — Q&A: would an agent-generated version of this exercise match the hand-built one? Answer: it can research the tools and knows what a background agent is, but it would not have the opinion that observe → predict → harness-validate → act is *the* loop.
- `#L232-L330` — Continuation of that answer: an agent offers "here's one way, here's another" while the instructor's claim is "I've tried all of these, this is the way" — and with the notes in hand it could rebuild all of it anyway.
- `#L331-L370` — Q&A on the email integration mentioned earlier in the course: same harness, roughly 70% overlap, with the difference being the large amount of non-AI architecture that has to surround it.
- `#L371-L422` — Tooling direction: moving away from letting the agent watch a human inbox toward agent-mail with its own address, forwarding from a 20-year-old Gmail rule set instead of dealing with SMTP, IMAP or Gmail's API.
- `#L423-L573` — Browser / computer agents: Browser Base (formerly Director, now Agents), Browser Use, and Orgo — an actual streamable computer for the agent at about $25/month, where agents install Codex, use Slack, and generally act like people.
- `#L574-L666` — Q&A on applying the state-machine harness to scaling software development: cloud-side, non-machine-bound processes fed by GitHub events, logs, Linear/Jira tasks and Slack messages — the parts of the job that are not code generation.
- `#L667-L725` — The resulting architecture: a custom "employee harness" that writes no code itself and instead has tools/computers for interacting with hosted coding agents — and the design question of what the harness owns versus what the agent figures out.
- `#L726-L745` — Close: thanks for coming, hope you learned something new, take the skills and go build background agents that run forever.

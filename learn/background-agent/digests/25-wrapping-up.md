---
source: sources/background-agent/20261109/course/25-wrapping-up.txt
source_type: text
source_lines: 113
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Capstone and evals — the leftover capstone extends the course into human-in-the-loop controls and run books, and evals are strongly recommended for any real background agent.
- Alternative runtimes — DBOS, Temporal, Vercel Workflows, and Upstash's HTTP-based workflows are named as comparable durable-execution options with similar trade-offs.
- The runtime is the soul — a durable execution runtime is what keeps an agent awake and alive rather than a bare server, and the closing Q&A maps the same harness pattern onto scaling software development.

# L2 detail

- `#L1-L10` — introduces the optional capstone (human-in-the-loop controls, uncertain knowledge, context, run books) and stresses that evals are essential and covered in the author's other courses.
- `#L11-L21` — surveys alternative durable-execution services: DBOS, Temporal, Vercel Workflows, and Upstash's HTTP-based workflow that works with serverless.
- `#L22-L34` — encourages building your own agent with the notes and a coding agent, and frames the durable runtime as the soul that keeps the agent alive.
- `#L35-L49` — answers whether an agent could generate this architecture: it would know the tools but lack the author's opinionated observe-predict-validate-act loop.
- `#L50-L60` — compares the course architecture to the author's email integration (about 70% the same) and explains migrating from SMTP/IMAP to forwarding mail to an agent-owned inbox.
- `#L61-L88` — discusses browser agents, Browser Base's shifting product line, and Orgo, which gives an agent a full streamable computer rather than a sandbox.
- `#L89-L110` — applies the pattern to scaling software development: a custom employee harness that delegates coding to hosted coding agents, driven by GitHub, Jira, and Slack events.
- `#L111-L113` — closes the course, hoping learners take the skills forward to build background agents that run forever.

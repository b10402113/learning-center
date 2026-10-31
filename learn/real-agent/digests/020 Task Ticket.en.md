---
source: sources/real-agent/20261030/Planning/020 Task Ticket.en.srt
source_type: text
source_lines: 143
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A task ticket covers manual work that blocks a decision, here signing up for Knock and provisioning development keys.
- Task tickets carry a Wayfinder task label and are resolved by a human, not by an agent session.
- The wizard skill turns those human-only steps into an interactive bash wizard, which is far easier than juggling several signup flows.
- The wizard is model-invoked, so it can trigger from context without being called by name.
- Run Wayfinder with the ticket number to generate the wizard, then run it in a fresh terminal because it is interactive.

# L2 detail

- `#L1-L38` — Identify the task ticket by its label and unclaimed state; manual provider signup and key provisioning are annoying, especially across several services.
- `#L39-L96` — Install the wizard skill: it generates an interactive bash wizard for steps only a human can perform, such as provisioning infrastructure, credentials, or CI secrets, and walking unfamiliar dashboards.
- `#L97-L143` — Model-invoked invocation fires at the right moment; run Wayfinder with the ticket number, then execute the generated wizard in a new terminal rather than inside the agent's bash.

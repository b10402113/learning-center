---
source: sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt
source_type: text
source_lines: 848
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1052-L1066
  - web.md#L1-L713
---

# L1 overview

- HITL defined narrowly — not RLHF/training-side work; an agent is mid-task and blocked by human judgment. Chat agents already do this, but the permission prompt is bound to your machine and the loop has already ended by the time it asks.
- Approval is a harness decision, never an agent decision — the rollback-release action carries `approval` in the harness policy table, and the agent only ever sees tool *names*, so approval latency can never skew which action it picks.
- You suspend and resume the *same* loop — not a reply-then-start-over handshake; the observation that produced the action is the one you continue from.
- Inbox, not chat — there is no message history in this system; the agent drops items in your inbox and you unblock it by clearing them.
- Two kinds of inbox items — "I need help" chosen by the LLM (has to be evaluated) versus an approval produced deterministically by the harness (does not).
- Approval is not a universal safety shield — the model can still arrive at a bad proposal after reading an untrusted log line; gate mutative/write actions first, then de-risk them so you are not clearing 20 approvals a day.
- De-risking beats gating — rollback mechanisms, small blast radius, staged rollout percentages; otherwise you drift back into being a chat user and lose the productivity gain.
- Prior art to mine — Inngest HITL guide (Slack as the inbox), OpenAI autonomy-vs-manual delegation guidance, the Human-AI Collaboration delegation paper, and Agent Dojo for prompt-injection defenses.

# L2 detail

- `#L1-L47` — Lesson 4 opens: what HITL means on the inference/prompt side, not the reinforcement-learning side — "an agent is trying to do a thing, but it's blocked by human judgment."
- `#L48-L97` — Chat-agent approval ("do I have your permission to run this command") versus background-agent approval: the local one dies with your laptop, and the loop already finished before it asked.
- `#L98-L190` — The coding-agent contrast: it replies and exits the loop; here the harness suspends *inside* the loop, and the agent does not even know permission is required.
- `#L191-L295` — Why the agent is kept ignorant: knowing a tool needs approval lets it route around you ("you take too long to get back to me"); and the goal is to resume the existing loop, not start a new one.
- `#L296-L405` — Chat is the wrong interface for a background agent (no message history kept); an inbox is right — the agent puts something in it and you clear it to unblock.
- `#L406-L500` — Two inbox item types: "answer this question" (the LLM decided it needs help, already implemented as a pickable action) versus "I need an approval" (the harness hard-codes it) — one needs eval, one doesn't.
- `#L501-L542` — The Inngest human-in-the-loop guide being followed, including treating Slack as the inbox instead of building your own.
- `#L543-L608` — `rollback release` is the approval-required action; checks out the `lesson 4` branch and inspects the policy code where it already has `approval` — policies are not exposed to the agent.
- `#L609-L677` — How to decide what needs human approval: the OpenAI autonomy/delegation guide, plus the "Human AI Collaboration: The Effect of AI Delegation on Human Task Performance and Task Satisfaction" paper that led to never signalling approval to the model.
- `#L678-L742` — "Approval is not a universal safety shield": the model can still pick wrong after reading an untrusted log line; start by gating anything mutative/write, then notice 20+ approvals a day means you must make it safe to run unattended.
- `#L743-L790` — De-risking toolkit: a rollback mechanism, a blast radius small enough not to matter, or a 10%/20%/40% staged rollout — otherwise you are back to sitting and waiting on a chat agent.
- `#L791-L848` — Closing riff that work becomes clearing an inbox ("why are you doing that?", "no, not size 12, size 13"), plus the Agent Dojo research environment for evaluating prompt-injection attacks and HITL being used to hack an LLM.

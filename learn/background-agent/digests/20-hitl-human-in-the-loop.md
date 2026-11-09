---
source: sources/background-agent/20261109/course/20-hitl-human-in-the-loop.txt
source_type: text
source_lines: 121
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Defining human-in-the-loop for agents — HITL here means the agent is blocked mid-task by human judgment, not the RLHF/training sense; the human sits inside the loop and the run cannot continue until an action is taken.
- Coding agent vs. background agent — a coding agent either keeps running on your machine or replies "approve?" after the loop already ended; the background agent stays suspended in the same loop, hosted and durable.
- Inbox, not chat — because there is no message history, the right interface is an inbox of blocked tasks that the human clears to unblock agents.
- Harness-owned approval — the agent never learns which actions require approval, so it is not biased toward cheaper paths; approval decisions live in deterministic harness code.
- Scope and safety debate — approval is not a universal shield against prompt-injected evidence; prefer approving only mutating/write actions, then de-risk them so the inbox does not become a full-time job.

# L2 detail

- `#L1-L15` — Lesson 4 opening; defines HITL as the agent being blocked on human judgment (not reinforcement-learning HITL), noting chat agents already do this with "ask before running a command."
- `#L16-L25` — Contrasts a coding agent (still running locally, or already replying after the loop) with a background agent that must suspend and resume inside the same loop, hosted so it survives the laptop closing.
- `#L26-L43` — Why the harness keeps approval policy hidden from the agent (so it can't game the rule), why it must resume the same loop rather than start a new one, and why the interface is an inbox rather than chat.
- `#L44-L53` — Pitches a universal "global inbox" app where any agent from any vendor drops blocked requests; the agent works while you clear tasks that unblock it.
- `#L54-L66` — Distinguishes an agent-decided "I need help" from a harness-decided "needs approval"; both surface in the inbox, but one comes from the LLM and one from deterministic code (agent = LLM + harness).
- `#L67-L73` — Points to Inngest's human-in-the-loop guide, which uses Slack as the inbox; announces rollback release as the action this lesson gates behind approval.
- `#L74-L83` — Shows the rollback policy already carries approval; the agent only sees action names, never which ones require approval (a deliberate preference, not a hard rule).
- `#L84-L94` — Cites OpenAI's guidance on autonomous vs. manual delegation and the paper "Human AI Collaboration: The Effect of AI Delegation on Human Task Performance and Task Satisfaction," which shaped the choice to hide approval from the model.
- `#L95-L113` — Approval is not a safety shield against prompt-injected logs; suggests gating all mutating/write actions first, then de-risking them (rollback mechanisms, small blast radius, gradual rollout) so approvals don't flood the inbox.
- `#L114-L121` — Recommends the Agent Dojo research environment on dynamic prompt-injection attack/defense evaluation, including how HITL can itself be exploited.

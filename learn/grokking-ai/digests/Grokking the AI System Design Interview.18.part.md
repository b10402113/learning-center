---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.18.part.txt
source_type: text
source_lines: 1737
part: 18
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 48, Introduction: Agentic Systems — the module map. Acting differs from answering because a wrong action changes something real, so an agentic system needs three parts: the **loop** (reason/act/observe until done, escalated, or out of budget), the **runtime** holding authority (action gate, budgets, least privilege), and the **evidence loop** (traces, sandbox scenarios, autonomy ladder). Follows one late-order refund task to show that "the model chose every step, but it decided nothing about money," then lists the module's seven lessons, places them in the seven-step framework, and traces reuse from earlier modules.
- Lesson 49, What an Agent Actually Is — one test separates a workflow from an agent: **who chooses the next step, and when**. A workflow is a line fixed at design time; an agent is a cycle chosen at runtime, so it has no natural end. Covers reason/act/observe, the trajectory, the four-rung autonomy ladder, compounding errors (0.95^10 ≈ 0.60), the four budgets (steps, cost, wall clock, blast radius) with stop-summarize-escalate, and cost math showing a 15-step task costs roughly 50–100× one chat answer.
- Lesson 50, Tool Use and Function Calling — function calling is "the model proposes, the runtime decides." Argues for a few **coarse, task-shaped tools** (so policy like a $30 refund cap lives in code the model cannot skip), descriptions written as prompts, legible errors, idempotency keys on writes, timeouts and rate limits, short-lived scoped credentials, four consequence tiers, and an action gate that validates, checks policy and tier, and logs every call. Ends with the cold-food task, a hidden-instruction email that gets held, and a cheapest-first repair order for wrong tool choice.

# L2 detail

- `#L1-L24` — Lesson 48 vocabulary: workflow, tool call, runtime, the loop, trajectory, consequence tier, durable task state, sandbox, autonomy ladder.
- `#L25-L57` — Part 1 moves the running support-assistant example from answering to acting, explains why wrong actions differ from wrong answers, and lists the three new questions interviewers ask (what may it do, who checks, when does it stop).
- `#L58-L173` — Part 2 defines an agentic system through three parts — the loop, runtime authority, and the evidence loop — plus durable task state, and shows the whole map in one diagram.
- `#L174-L250` — Part 2 continues: "the model proposes, the runtime decides" on one tool call; the four consequence tiers (read, reversible write, consequential write, irreversible) with per-tier controls and least privilege; and the workflow-vs-agent test.
- `#L251-L272` — Part 2 closes with why every loop needs budgets (0.95^10 ≈ 0.60, cost growth, stuck agents), the four autonomy levels, and what an agentic system is not (a stronger model, or many agents by default).
- `#L273-L374` — Part 3 follows one late-order refund end to end: intake, order lookup, policy search, a $6.40 credit checked in code, a safe idempotent retry, the reply, and later trace review — with budgets of 12 steps, 90 seconds, $0.50, one credit.
- `#L375-L411` — Part 4 lists the module's seven lessons and the question each answers, from What an Agent Actually Is through the support-agent capstone.
- `#L412-L476` — Part 5 maps the module onto framework steps 2–7 (success, data, model, serving path, keeping it working, costs) and gives the one-sentence recognition line: "This is agentic, because the system takes actions."
- `#L477-L503` — Part 6 shows what the module reuses (shadow/canary from Module 2, velocity features from Module 3, token prices and judges from Module 4, RAG as a tool from Module 5, injection and memory from Module 6) and what reuses it (the autonomous coding agent).
- `#L504-L545` — Part 7 lists the seven mistakes the module prevents (calling everything an agent, rules in the prompt, unbounded loops, broad access, no idempotency key, grading only the final answer, full freedom at launch) and the key takeaways.
- `#L546-L559` — Lesson 49 vocabulary: autonomy, human in the loop, thrashing, routing, action space.
- `#L560-L645` — Part 1 poses two features from one support team (call summaries vs "resolve this customer's issue") and derives the workflow/agent test; also says what does not make an agent (multiple calls, tool calls, human review).
- `#L646-L689` — Part 2 explains reason/act/observe/repeat and the three loop exits, then walks the cold-food message through seven steps; defines the trajectory and why two tasks with the same reply can differ.
- `#L690-L763` — Part 3 introduces the four-rung autonomy ladder (fixed workflow, model-chosen branch, human-approved writes, bounded agent reviewed after) and notes most production agents sit in the middle, per action type.
- `#L764-L829` — Part 4 shows errors compound across chained steps (5/10/20 steps at 95% → 77%/60%/36%), why agents compound and chat does not, why confusion fails quietly, and why a bigger model is not the fix — fewer steps, checks between steps, bounded loops are.
- `#L830-L932` — Part 5 sets the four budgets (max steps, tokens/cost, wall-clock timeout, spend and blast-radius caps), the stop-summarize-escalate plan, thrashing as a signal, and the parallel to the unbounded retry loop.
- `#L933-L989` — Part 6 prices an agent task: 15 steps with a growing history costs about $0.69, roughly 55× a chat answer and 50–100× in general; checks the $0.50 cap and covers routing mechanical steps to cheap models.
- `#L990-L1122` — Part 7 gives the workflow/agent decision rule with six worked tasks, then the hybrid production norm: an agent core inside a workflow with a small action space behind an action gate.
- `#L1123-L1175` — Part 8 gives the 30-second answer plus follow-ups (bigger model, full autonomy, thrashing at step 40), common mistakes, and key takeaways.
- `#L1176-L1191` — Lesson 50 vocabulary: function calling, tool menu, schema, credential, MCP.
- `#L1192-L1279` — Part 1 defines function calling in three steps, places the action gate between model and tools, separates capability from authority, and introduces MCP as a portable tool-menu standard that does not hold permissions.
- `#L1280-L1417` — Part 2 designs the tool menu: the token cost of a 40-tool menu (~22¢ per 12-step task), why a few coarse task-shaped tools win, why a coarse refund tool is a safety property, why raw SQL access fails, and how descriptions and errors act as prompts.
- `#L1418-L1455` — Part 3 makes writes safe to retry: idempotency keys created once per logical action and recorded in the same transaction, plus a timeout and a rate limit on every tool.
- `#L1456-L1480` — Part 4 covers permissions: least privilege, the agent inheriting the user's authority and never exceeding it, the narrow service account for money, and scoped 15-minute credentials minted per task.
- `#L1481-L1632` — Part 5 sorts tools into four consequence tiers and specifies the action gate's four jobs (schema validation, policy check, tier routing, logging), what gets logged and why, and that stated reasoning is a clue rather than proof.
- `#L1633-L1675` — Part 6 runs the cold-food task through the system, including the pasted receipt with hidden instructions: the gate holds the external email for approval, so a fooled model still meets a bounded system.
- `#L1676-L1695` — Part 7 gives the cheapest-first repair order when the model picks the wrong tool: measure on the golden set, sharpen descriptions (82% → 95% in the example), merge overlapping tools, fine-tune last.
- `#L1696-L1737` — Part 8 gives the 30-second answer and follow-ups (why not SQL, double refund, hidden instructions), then common mistakes (policy in the prompt, one shared admin credential, fine-tuning first) and key takeaways.

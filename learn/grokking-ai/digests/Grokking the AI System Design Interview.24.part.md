---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.24.part.txt
source_type: text
source_lines: 1400
part: 24
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 64 · System Design of an Autonomous Coding Agent — The bounded agent loop, in code: an engineer assigns a ticket, the agent writes code, runs tests, and opens a pull request, and a person merges. Three things make it easier than most agents: verifiers already exist (compiler, tests, linter), CI has already solved the sandbox, and the pull request is a natural approval gate. Merge rate is the primary metric, with reviewer burden, CI failure rate, revert rate, and cost per task as guardrails; the design trains no model, and its data gives context, offline test cases (past tickets with hidden tests), and production labels. One frontier model plus cheap models for mechanical steps, five tools (search_code, read_file, edit_file, run_command, open_pull_request, comment_on_ticket), and prefix caching. The serving path is the heart: a throwaway container with no production credentials, one egress address, hard resource limits, and nothing leaving but a diff, which converts an agent-safety problem into a code-review problem and bounds the blast radius. Budgets (80 steps, $10, 60 minutes) end in a partial artifact, comments from approved reviewers re-enter the loop, three gates (tests, CI, human review) keep the merge human, and the loop sits at autonomy Stage 2–3.

- Lesson 65 · Critiquing a System Design — The fifth interview form: you inherit a design and must find what is wrong, in the right order, with judgment. The method has three steps — find the findings (walk the seven steps, then name the invariants that must always hold), sort by severity in five tiers (violated invariants, missing feedback loops, reliability gaps, economics, quality opportunities), and deliver in three moves (affirm what the shape gets right, attach a consequence and a fix to every finding, end with a sequenced plan). Applied to a 30,000-employee support copilot, it yields nine findings: permission filtering inside the index query, a task-shaped SQL tool with the caller's own credentials, the guardrail sandwich, a golden set, thumbs/escalation/traces, incremental sync with freshness SLOs, a fallback ladder, routing and caching, and hybrid retrieval with reranking — shipped as three blockers before rollout, three fixes in week one, three later. Two practice exercises (a leaked churn model and a "fixed" hallucinating help bot) train the same reflexes.

# L2 detail

- `#L1-L60` — Lesson 64 vocabulary (ticket, pull request, diff, CI, container, egress, allowlist, repo index, working tree, verifier, acceptance criteria), the question, and the recognition move with its three advantages.
- `#L61-L81` — Part 1: the company (400 engineers, one repo, 200 tickets a day), asynchronous work, v1 scope in and out, and why architecture-changing work is excluded.
- `#L82-L134` — Part 2: merge rate as the closest thing to a correct answer, four guardrails, why reviewer burden hides subtle errors, the one-hour target, and "never break production" made concrete.
- `#L135-L169` — Part 3: the agent's four-part context (ticket, repo-index retrieval, working tree as scratchpad, durable task state), offline past tickets with hidden tests, and online labels that arrive at different speeds.
- `#L170-L219` — Part 4: one agent with a frontier model and cheap models for mechanical steps, prefix caching, no fine-tune by default, and the five tools with the deliberately missing database and cloud access.
- `#L220-L465` — Part 5: the four sandbox rules, the thesis that safety becomes code review, blast radius, the runtime and its three budgets, the three gates with no separate CI lane for the agent, review comments re-entering the loop, partial artifacts on budget exhaustion, and one receipt ticket followed from 9:00 to 14:00.
- `#L466-L509` — Part 6: the offline suite of historical tickets with outcome and trajectory metrics, online monitoring including steps per task, and where the design sits on the autonomy ladder.
- `#L510-L614` — Part 7: the failure ledger (prompt injection from inside the repo and the three fixed stops, plausible but wrong code, a malicious dependency) and the cost ledger (about $1–10 of compute per task against a 15-minute senior review).
- `#L615-L709` — Part 8 plus levels, variations, mistakes, and takeaways: six follow-ups (specification failure, twenty tickets at once and reviewer throughput, weakened tests, a 30-minute monorepo CI, a malicious dependency, $40 per merged PR); the three levels; three variations; five mistakes; the summary.
- `#L710-L797` — Lesson 65 vocabulary, the copilot exercise (nightly full re-index, top 10 chunks, frontier model, open SQL tool on a service account), the two paths in its diagram, and the instruction to write your own critique first.
- `#L798-L817` — Part 1: why the critique form matters, and the three things the interviewer listens for — order, consequence, judgment.
- `#L818-L940` — Part 2: the three-step method — find the findings with seven step questions plus two invariants, sort into five tiers (with feedback loops above reliability), deliver in three moves; the wrong opening; and a different 45-minute split.
- `#L941-L998` — Part 3: the three sound choices to affirm (RAG family, offline/online split, personal records through a tool) and the nine findings laid on the five tiers.
- `#L999-L1065` — Part 4: tier 1 — no permission filtering on retrieval (chunk-level ACLs filtered inside the index query, failing closed, ACL fast feed), the under-scoped SQL tool (task-shaped get_my_record, identity from the session, the caller's credentials), and no injection defense (the guardrail sandwich).
- `#L1066-L1094` — Part 5: tier 2 — no evaluation of any kind (a golden set with refusal cases and permission probes, faithfulness and recall on every change) and nothing to learn from (thumbs, escalation, traces that store chunk IDs not text).
- `#L1095-L1138` — Part 6: tier 3 — the nightly full re-index (incremental, idempotent, delete-propagating with freshness SLOs) and the missing fallback ladder with per-failure rungs and alarms.
- `#L1139-L1181` — Part 7: tiers 4 and 5 — a frontier model on every query (routing, prefix caching, a public-only semantic cache, with the about $94,000-a-year arithmetic) and pure vector retrieval (hybrid plus rerank to 5 chunks).
- `#L1182-L1260` — Part 8 plus levels: the sequenced plan of three blockers before rollout, three week-one fixes, three later improvements, why the plan departs from tier order, and how to compare with your own list; mid, senior, and staff critiques.
- `#L1261-L1285` — Parts 9 and 10: the three levels in detail and three follow-ups (only one fix before launch, why not instruct the model, whether metadata filters suffice).
- `#L1286-L1400` — Part 11 plus mistakes and takeaways: the practice of deleting subsystems from a known-good design, Exercise A (a churn model with leakage, a self-inflicted loop, no holdback, no lineage, silent staleness, lost margin) and Exercise B (a hallucinating help bot where temperature zero, "do not hallucinate", and top-k 20 fix nothing and triple cost); the seven mistakes; the summary; the chapter transition to Rapid Review.

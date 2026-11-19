---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.19.part.txt
source_type: text
source_lines: 1812
part: 19
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 51, Orchestration and Multi-Agent Systems — default to **one competent agent** with good tools and a bounded context, because every extra agent multiplies cost, latency, and failure surface. Only three cases earn a second agent: context isolation, parallelism, and specialization by configuration. Presents the two production shapes (orchestrator-workers, and a pipeline with agentic stages), insists that **handoffs are contracts** (task, scoped context, tools, budget, report schema), puts task state and hierarchical budgets in a store outside the agents, and shows compounding errors moving one level up so the integration step needs its own verification pass.
- Lesson 52, Agent Memory and Context — agent memory is a **four-tier cache hierarchy**: the context window (one call), the scratchpad (one task), durable task state (survives crashes), and long-term memory (many tasks). Teaches structured compaction that keeps decisions, constraints, and failures instead of narrative prose, the push-to-pull shift that makes files beat a bigger window, resume-not-restart with stable idempotency keys, and long-term memory as a small RAG system whose writes are consequential actions and whose poisoning persists into every future task. Ends with a symptom-to-tier diagnosis table.
- Lesson 53, Evaluating Agent Trajectories — **the unit of evaluation is the trajectory, not the output**: a 4-step run and a 19-step run can both end in the same refund. Each scenario carries initial world state, success criteria, a reference trajectory, and a category label, and runs in a sandbox whose replica tools reproduce timeouts, rate limits, permission denials, and empty results. Three graders run from cheap to costly (programmatic checks, a judge validated by agreement rate, human review as the anchor), with five route metrics, cost per task on the scorecard, and a worked change that is blocked only because of per-category, recovery-rate, and cost numbers.

# L2 detail

- `#L1-L18` — Lesson 51 vocabulary: multi-agent system, orchestrator, worker, handoff, report schema, failure surface, task state store.
- `#L19-L52` — Part 1 frames a five-competitor research request and states the default: one competent agent, good task-shaped tools, bounded context — because each added agent multiplies cost, latency, and failure surface.
- `#L53-L123` — Part 2 names the only three cases that earn a second agent (context isolation, parallelism/scatter-gather, specialization by configuration) and the question to ask for each.
- `#L124-L260` — Part 3 presents the two production shapes: orchestrator-workers (decompose, delegate with scope, integrate, own the outcome, with structured findings/confidence/artifacts reports) and a pipeline with agentic stages whose stage order is fixed in code.
- `#L261-L302` — Part 4 says handoffs are contracts carrying five things (task with definition of done, scoped context, smallest tool menu, budget, report schema), shown as a concrete Competitor C contract, and notes gaps/status fields and least privilege.
- `#L303-L379` — Part 5 puts task state in an orchestrator-owned store (progress, artifacts, spent budgets) so a crashed worker is retryable, and splits one top-level budget downward with an integration reserve; a worker out of budget reports partial results.
- `#L380-L416` — Part 6 runs the research task end to end: planning, five-way fan-out, a crash and a fresh worker, a partial report, fan-in with a verification pass, and delivery; about 280,000 tokens versus roughly 9 minutes instead of 25.
- `#L417-L467` — Part 7 covers cross-agent failures: compounding errors at the handoff (five 95% workers → ~77%), harder debugging without determinism, a worked diagnosis where integration dropped a condition, and three demo patterns to reject.
- `#L468-L510` — Part 8 gives the 30-second interview answer and follow-ups (why not one agent, why not let workers chat), plus common mistakes and key takeaways.
- `#L511-L563` — Lesson 52 vocabulary, then Part 1: a 30-step delivery-time investigation shows five failures of sending the whole history, and defines memory as a tiered storage design.
- `#L564-L688` — Part 2 compares the four tiers side by side (what each holds, how long it lasts, how the model reaches it) and notes that only the context window is inside the model call; chat assistants already had two tiers.
- `#L689-L812` — Part 3 covers the context window: keep the plan and recent results verbatim, compact the rest under a token budget, the danger of lossy narrative compaction (a dropped constraint and a failed fix get repeated), structured compaction fields, and why less context is often better.
- `#L813-L847` — Part 4 covers the scratchpad: a per-task folder of plan, findings, failed attempts, and large log extracts; push becomes pull, files beat a bigger window on cost, quality, durability, and cross-agent sharing, and three safety rules.
- `#L848-L957` — Part 5 covers durable task state: a per-step record enables resume instead of restart, idempotency keys built from task and step make the repeat safe, restart differs from retry because the model may take a different path, and one record serves resume, audit, and debug.
- `#L958-L1012` — Part 6 covers long-term memory: preferences, environment facts, and past outcomes read by retrieval at task start; it must be visible, editable, and deletable; sensitive data and credentials never go in; and poisoned memory is injection with persistence.
- `#L1013-L1040` — Part 7 follows the delivery-time task through all four tiers: memory retrieval, a 40,000-row extract into the scratchpad, a logged failure, structured compaction at step 20, the 10-to-60-minute window finding, a crash-and-resume, and one approved memory write.
- `#L1041-L1128` — Part 8 diagnoses memory failures by symptom-to-tier table (repeated mistake, broken rule, worsening decisions, duplicate action, strange rule in every task) plus a worked compaction diagnosis and long-horizon test gap.
- `#L1129-L1184` — Part 9 gives the 30-second answer and follow-ups (bigger window, repeated mistake, what never goes in memory), then common mistakes and key takeaways.
- `#L1185-L1207` — Lesson 53 vocabulary: step, world state, scenario, golden trajectory, sandboxed environment, replica tool, synthetic data, trajectory judge, agreement rate.
- `#L1208-L1299` — Part 1 shows two runs on one late-order ticket (4 steps vs 19 steps, same $3 refund) and defines evaluation as grading both destination and route.
- `#L1300-L1358` — Part 2 turns the golden set into scenarios with four parts each, argues for category labels (a 93% average hides 98/90/50 per category), and says the set grows from every production incident.
- `#L1359-L1389` — Part 3 builds the sandbox: never test against production tools, replica tools must fail the way real ones do (timeouts, rate limits, permission denials, empty results), and the harness is a system to maintain, not a script.
- `#L1390-L1485` — Part 4 describes three graders in order of cost — programmatic world-state assertions and hard route rules, a rubric-based trajectory judge validated by agreement rate, and human review that anchors the judge — and how to grade when many paths are correct.
- `#L1486-L1565` — Part 5 defines five route metrics (task success by category, step efficiency, wrong-tool/deadend rates, recovery rate, refusal correctness in both directions), highlights recovery rate as the robustness discriminator, and uses a rising step count as an early warning.
- `#L1566-L1626` — Part 6 puts cost on the scorecard: per-task token math (~$0.09 per 12-step attempt, ~$0.05 typical), why success rate and cost must be read together (cheap give-ups vs expensive brute force), and the per-task budget cap as both runtime control and evaluation threshold.
- `#L1627-L1744` — Part 7 follows one model swap: 300 scenarios run three times, checks and judge and human review applied, and the change blocked because adversarial success, recovery rate, and cost per task all regress even though happy-path scores rise.
- `#L1745-L1812` — Part 8 handles the sandbox-to-production gap (real users, real tool latency, stale data) with a continuous failing-trace harvesting pipeline; Part 9 gives the 30-second answer, follow-ups, common mistakes, and key takeaways.

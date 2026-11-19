---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.20.part.txt
source_type: text
source_lines: 1371
part: 20
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 54, Evaluating and Controlling Agents — the sandbox score is evidence, not proof, so the lesson moves evaluation into production. Defines a **four-level metric stack** read bottom-up (task success rate, trajectory quality, safety metrics in both directions, online metrics), observes that trajectory quality falls before success rate, and treats a steps-per-task spike as the agent version of prediction drift. One **trace** with reasoning, tool calls, costs, and gate decisions serves forensics, dashboards, and eval-case harvesting. Autonomy is a **ladder earned per action tier** — suggest, approve, bounded auto, audited auto — with written promotion thresholds, automatic demotion, and three standing controls (budget caps, kill switches, anomaly alarms). Ends with a full incident where a partner integration change causes a refund spike.
- Lesson 55, Capstone: A Customer-Support Agent — the module's end-to-end answer on 40,000 conversations/day with a $4 human ticket baseline and refund abuse as the risk. Splits contacts three ways (intake workflow, FAQ via RAG, only active-order problems in the loop, so ~60% never touch the agent), puts the $30 cap and velocity limits inside the tools, runs the agent under the customer's own scope, bounds the loop in four currencies (12 steps, 90 s, $0.50, three consequential actions), pairs durable state with idempotency keys, defends abuse in three layers, and prices the design at $0.43–$0.71 per resolved ticket. Closes with level comparisons, follow-ups, and airline/ISP variants.

# L2 detail

- `#L1-L21` — Lesson 54 vocabulary: action tier, rubric-judge, human anchor, task success rate, trajectory quality, false-block rate, completion without takeover, trace, budget cap, anomaly alarm.
- `#L22-L48` — Part 1 asks what a passing sandbox lets the agent do with real customers, shows two runs with the same refund but 5 vs 14 steps, and separates offline evidence from the online decision.
- `#L49-L163` — Part 2 defines the four-level metric stack: Level 1 task success rate, Level 2 trajectory quality (steps, wrong-tool rate, recovery rate) as the leading indicator, Level 3 safety in both directions, and Level 4 online completion without takeover, cost per completed task, escalation rate, and action rates against the $4 baseline.
- `#L164-L179` — Part 3 describes the sandbox harness: replica tools over resettable synthetic data, seeded and adversarial scenarios, real gates and caps inside, and the warning that sandbox scores run higher than production.
- `#L180-L302` — Part 4 defines the trace (reasoning steps, tool calls with arguments and results, per-step cost, gate decisions and approvers), shows a six-entry/five-step trace, argues stated reasoning is a triage clue not proof, and gives its three uses plus steps-per-task as drift.
- `#L303-L458` — Part 5 builds the autonomy ladder: staged, per action tier, with evidence; the four stages (suggest, approve, bounded auto, audited auto); per-tier climbing speeds; a written promotion rule with named sandbox and approval thresholds; canary-style line raising; and automatic demotion on regression or incident.
- `#L459-L492` — Part 6 gives the three standing controls: budget caps as policy written in code, per-tier and whole-agent kill switches, and cohort-split anomaly alarms on action rates that cannot distinguish bug, attack, or bad prompt change.
- `#L493-L506` — Part 7 reframes controls as instrumented trust: approval logs become labeled data, shadow trajectories become the evaluation set, and gates expose failure modes cheaply.
- `#L507-L532` — Part 8 follows one incident: rising step counts after a partner integration change, a cohort refund spike, the alarm page, automatic demotion of the under-$10 tier, trace reading, cause fix, and re-earning the stage.
- `#L533-L592` — Part 9 gives the 30-second answer and follow-ups (sandbox-vs-production gap, no single metric, rubber-stamping approvers), then common mistakes and key takeaways.
- `#L593-L621` — Lesson 55 vocabulary (case state, pod, cohort) and the capstone exercise: design an agent that applies credits, reschedules, and refunds for a food-delivery app under cost and abuse pressure.
- `#L622-L648` — Part 1 frames the problem: the upgrade moves from generative to agentic, and the two numbers leadership cares about — support cost per ticket ($4 baseline) and refund abuse — pull in opposite directions; states scope.
- `#L649-L668` — Part 2 defines success: 70% completion without takeover, cost per resolved ticket under $4, safety measured in both directions, ~2 s first reply and a 90 s ceiling, and 40,000 conversations/day as roughly one every two seconds.
- `#L669-L686` — Part 3 maps the data: read/write systems and their tiers, the per-case case state and trace plus policy version, what the agent learns from, and what it must never trust.
- `#L687-L785` — Part 4 picks the shape: intake workflow, FAQ via RAG, and only active-order problems in the loop, so ~60% of contacts never reach the agent; one bounded agent on a strong model initially, with every proposed action behind the action gate.
- `#L786-L957` — Part 5 designs the serving path: the four tool tiers with per-tier controls, the $30 cap and velocity limits inside issue_refund, the customer-scoped credential, four bounds (12 steps, 90 s, $0.50, three consequential actions ≈ $45 worst case), context built from case state, durable state plus idempotency keys, and a worked case where a pod crash resumes mid-refund.
- `#L958-L1152` — Part 6 keeps it working: three abuse-defense layers (velocity signals as a read tool, caps in code, cohort alarms), the customer as the untrusted input, climbing the autonomy ladder one tier at a time with a written promotion rule, and later explainability through traces, versioned policy config, and kill switches.
- `#L1153-L1277` — Part 7 counts the costs: intake ~$80/day, FAQ ~$1,200/day, the loop ~$8,000/day, $0.43–$0.71 per resolved ticket against $19,200/day of human escalations, plus abuse losses and the $45 worst case.
- `#L1278-L1299` — Part 8 compares mid-level (cap in the prompt), senior (the full Parts 4–7 design), and staff answers (refund abuse as an adversarial economy; the ladder as governance with sign-offs).
- `#L1300-L1328` — Part 9 follow-ups: a double refund after a pod death, a customer claiming three missing orders, a regulator asking about an eleven-month-old refund, and a cost-cutting order in cheapest-first sequence.
- `#L1329-L1371` — Part 10 applies the same structure to an airline rebooking agent (time pressure reverses the economics; gating shifts to fare class and connection risk) and an ISP support agent (diagnostics become powerful reads; the truck roll becomes the costly gated action); a chapter divider closes the file.

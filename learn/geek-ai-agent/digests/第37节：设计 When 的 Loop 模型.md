---
source: 第37节：设计 When 的 Loop 模型
source_type: pdf
source_lines: 339
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第37节：设计 When 的 Loop 模型

## Overview (L1)

- Pre-implementation plan — With a clear tech plan (lesson 36), implementation is not hand-written line by line but delegated to a Loop; this lesson is the battle plan: splitting, Harness, and two runs.
- Can it be done in one shot — Theoretically yes, depending on model capability and project complexity; When's architecture is clear, module boundaries well-defined, and acceptance testable, so it could be done at once — but "can" is not "should", because teaching wants visible steps. Two runs are a teaching pace choice, not a technical limit.
- The two runs — Part 1: single-machine core path; Part 2: distributed high availability; then Step 3: three-node end-to-end integration acceptance. Each part has its own Loop document (function + tasks + Harness + acceptance) written before starting.
- Loop model flow — Read part doc → build isolated branch → loop do/test/fix → all green then hand off → human review; exit A: merge PR into the next part; exit B: unsatisfied → edit the part doc and re-run from a clean state.
- Part input — Turns a chunk of the plan into an executable Loop doc: function, interaction/timing, interfaces, params, plus boundaries (acceptance + mandatory tests, forbidden code, stop when unsure).
- Harness is the key — The loop amplifies the quality of the Harness you designed: code (structure/naming/layering/lint), security (no hardcoded secrets, dependency allowlist), acceptance (unit/integration/CI/e2e — the judge).
- Two Harness layers — Public Harness built once (security red lines, code/lint, CLAUDE.md context, CI gates); per-part Harness travels with the task card (this part's acceptance tests and specific boundary constraints).
- Part 1 · single-machine core path — Access + API, routing (Snowflake + consistent hash), Redis storage plugin, Sink delivery (HTTP/Kafka), multi-layer timing wheel; goal: one delay message received → stored in Redis → triggered on time → delivered, all auto-verifiable.
- Part 2 · distributed HA — ETCD coordination (registration/election/Watch), Master/Slave replicas + failover, Controller + rebalance, node scaling; goal: three-node cluster, Slave takes over within 10s, no message loss — hard, needs chaos/fault injection.
- Step 3 · integration — Overall Harness chains the two parts: three-node end-to-end submit → schedule → deliver, cross-node routing, observability, deployment, Web console.
- Boundary judgment — What goes to the loop (time-wheel algorithm, consistent hash, serialization, interfaces, Sink plugins) vs what humans lead (failover correctness, replica consistency, election/split-brain); the divider is verifiability.
- Roadmap & closing — Each lesson yields one Loop raw material (part doc), assembled into an overall Harness, then executed; Loop's most important piece is always the Harness.

## Sections (L2)

### one-shot-feasibility
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#one-shot-feasibility]]`
- Summary: Asks whether all of When can be run at once; the answer depends on model capability (can it hold the context/steps) and project complexity (coupling depth, verification difficulty).
- Key claims: When's difficulty is within one-shot reach — clear architecture, well-defined module boundaries, testable acceptance; but "can run once" ≠ "teaching should run once".
- Learner-relevant: The engineering-vs-pedagogy distinction that shapes the plan.

### two-runs
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#two-runs]]`
- Summary: The chosen approach fully follows the Loop model but runs twice: part 1 single-machine core path, part 2 distributed HA, part 3 integration acceptance.
- Key claims: Each part writes its own Loop doc (function + tasks + Harness + acceptance) before starting; splitting is purely for teaching/visibility — in real engineering you can merge into one run.
- Learner-relevant: The concrete execution plan for implementing When.

### loop-flow
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#loop-flow]]`
- Summary: Applies lesson 35's cycle to When: read part doc → build isolated branch → loop do/test/fix → all green hand-off → human review; failing tests loop back to do/test/fix; exits are merge or re-run.
- Key claims: Review passes → merge PR into the next part; unsatisfied → edit the part doc and re-run from a clean state.
- Learner-relevant: The operational loop the When implementation follows.

### part-input
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#part-input]]`
- Summary: Defines a part document's input (function, interaction/timing, interfaces HTTP/gRPC, params/fields/constraints) and output (acceptance criteria + mandatory decidable tests, plus forbidden code and stop-if-unsure boundaries).
- Key claims: The "desired result" must be decidable — expressible as tests so the loop knows if it is correct and when it is done; this is the core of Harness.
- Learner-relevant: The input contract for a converging loop.

### harness-core
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#harness-core]]`
- Summary: Argues Harness is the most important link — code (structure/naming/layering/lint), security (no hardcoded secrets, dependency allowlist, no privilege escalation, env-var secrets), acceptance (unit/integration/CI/e2e — the loop's judge).
- Key claims: Every loop turn asks "right? compliant? safe?" and all answers come from the Harness; a weak Harness means the loop amplifies errors at speed, so effort here pays most.
- Learner-relevant: The decisive insight that Harness quality determines loop usability.

### harness-two-layers
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#harness-two-layers]]`
- Summary: Splits Harness into public (security red lines, code/lint, CLAUDE.md context, CI gate — built once globally) and per-part (this part's acceptance tests and specific boundary constraints, written in the part doc).
- Key claims: Order matters — build the public Harness once, then let each part carry its own acceptance, so the loop runs inside a unified guardrail.
- Learner-relevant: How to organize Harness work across parts.

### part-one-single-machine
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#part-one-single-machine]]`
- Summary: Part 1 core path: access + API, routing (Snowflake + consistent hash), Redis storage plugin, Sink delivery (HTTP/Kafka), multi-layer timing wheel engine; goal: one delay message received → stored in Redis → triggered on time → delivered, auto-verifiable (delivery precision, no-loss).
- Key claims: Do it first because the core path must be right before distributed concerns; it does not touch the cluster and verifies most directly, so the loop converges most easily.
- Learner-relevant: The first concrete milestone and why.

### part-two-distributed
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#part-two-distributed]]`
- Summary: Part 2 adds cluster coordination and fault tolerance on top: ETCD coordination, Master/Slave replicas + failover, Controller + rebalance, node scaling; goal: three-node cluster, Slave takeover within 10s, no loss (correctness-focused, needs chaos/fault injection).
- Key claims: Distributed correctness is When's hardest, highest-risk part, so it gets its own run and its own acceptance design.
- Learner-relevant: The risk-heavy milestone and its separate verification approach.

### step-three-integration
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#step-three-integration]]`
- Summary: Step 3 chains part 1 + part 2 with an overall Harness: three-node end-to-end submit → schedule → deliver, cross-node routing, plus observability (Metrics/logs), deployment (docker-compose/K8s), and Web console, watching messages go pending → delivered.
- Key claims: Overall Harness design is covered in a later lesson, with loop execution and problem-solving in the deployment/observability lessons.
- Learner-relevant: The integration acceptance milestone.

### boundary-judgment
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#boundary-judgment]]`
- Summary: Draws the line: to the loop — multi-layer timing wheel algorithm, consistent hash, serialization, HTTP/gRPC interfaces, param validation, Sink plugins, Redis key design; human-led — failover correctness, Master/Slave replica consistency, election/split-brain handling.
- Key claims: The divider is verifiability: cheaply/deterministically auto-verifiable → loop; hard to verify and costly to get wrong (per the tech plan's risk section) → human decides the plan, loop only assists implementation.
- Learner-relevant: The delegation rule applied to When's modules.

### roadmap
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#roadmap]]`
- Summary: Path forward: step 1 each lesson produces one Loop raw material (gRPC interface, storage plugin, metadata selection, node cluster, timing wheel, access/routing, replica switchover, Controller, Sink...), step 2 assemble into an overall Harness, step 3 execute the loop and solve problems.
- Key claims: Next lesson previews the hardest Harness piece — the automated test acceptance system.
- Learner-relevant: How the remaining lessons build the raw materials for one big loop.

### closing
- Locator: `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#closing]]`
- Summary: When's implementation is a methodology landing: clear Spec (lesson 36) → split into part docs with acceptance → loop implements each part autonomously → human gates the high-risk points.
- Key claims: Whether it can run at once depends on model and complexity; here it splits into single-machine core path then distributed HA; each part is "clear input + decidable acceptance"; public Harness once, per-part Harness per part; Loop's most important thing is always the Harness.
- Learner-relevant: The summary thesis connecting Spec, harness, loop, and human judgment.

## Sources

- `[[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf]]`

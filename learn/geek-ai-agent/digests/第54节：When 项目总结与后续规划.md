---
source: 第54节：When 项目总结与后续规划
source_type: pdf
source_lines: 344
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第54节：When 项目总结与后续规划

## Overview (L1)

- Purpose — a closing summary deck (PPT) for the When project: what was built, the Loop Engineering methodology behind it, AI-programming takeaways, and follow-up/community plans.
- What was built — When is a production-usable distributed delayed-delivery component: cluster coordination (ETCD join/election/awareness), Master/Slave multi-replica HA with failover <10s, no message loss (write Redis first, Redis is the true source), multi-layer time wheel (O(1), seconds to 30 days, stable precision), and one-command deploy (compose/single-node/K8s).
- Six technical decisions — ETCD for coordination (cloud-native, Lease/Watch fit registration and failover); Redis for storage (fast, TTL, ubiquitous, small keys avoid big-key); multi-layer time wheel (O(1) in-memory scheduling, seconds to 30 days); Master/Slave (fast switch not strong consistency, no Raft); HTTP outside + gRPC inside; Java (mature middleware ecosystem/ops/talent).
- Hard metrics — no loss (already-persisted messages survive killing Master); 10s switch; delivery precision (P99 within threshold); big-key avoided (independent small keys, no ZSet); at-least-once (no loss, possible duplicates + downstream idempotency); one-command 3-node deploy — each backed by automated/chaotic tests as judge (echoing §38: assertions like "inject failure, N messages zero loss").
- Methodology — the real protagonist is how When was made via Loop Engineering: base (domain model + module contracts/SPI) → per-section material (function + task + Harness + acceptance) → two runs (feed material to the loop, run → surface problems → backfill material → re-run). Harness is most important; the loop amplifies the quality of the judge you designed — no trustworthy judge means the loop rapidly amplifies errors.
- AI-programming takeaways — leverage shifted from writing a prompt to designing a self-looping environment and rules; humans retreat to checkpoints (set goals/rules, watch key points, decide high-risk); divide work by verifiability (cheap-to-verify → loop; can't-afford-to-be-wrong and hard-to-verify like distributed consistency/fund safety → human-led).
- Follow-up and community — more sinks (gRPC/RocketMQ/NATS/Pulsar via SPI), auth/rate-limit, DLQ, priority queue, cross-region deploy, Operator/MCP — all outside the 3-week MVP, community-led; community path Star → claim issue → first PR → maintainer. Closing line: "verifiable goes to the loop, judgment stays with humans; When is the sample, the method is what you take away."

## Sections (L2)

### 1-做成了什么

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#做成了什么]]`
- Summary: Summarizes When's achieved capabilities.
- Key claims: cluster coordination, multi-replica HA, automatic failover <10s, no message loss (Redis as true source), multi-layer time wheel, one-command deploy; it is not a single-node toy but a clustered version with HA, which is what makes it "production-usable" and a persuasive AI-programming sample.
- Learner-relevant: A concrete definition of "production-usable" for infrastructure.

### 2-全景回顾

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#全景回顾]]`
- Summary: End-to-end path of one delayed message.
- Key claims: business → access/routing → time wheel Master/Slave → Sink delivery → downstream HTTP/Kafka, with ETCD coordinating and Redis as the true source; external HTTP, internal gRPC; messages persist to Redis before entering the in-memory time wheel; ETCD manages cluster, Redis manages data, neither reinventing wheels.
- Learner-relevant: One-glance architecture recap.

### 3-六大技术决策

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#六大技术决策]]`
- Summary: The six decisions and their tradeoffs.
- Key claims: ETCD (Lease/Watch fit), Redis (write-fast, TTL, ubiquitous, small keys), multi-layer time wheel (O(1), seconds–30 days), Master/Slave (fast switch, not strong consistency, no Raft), HTTP outside/gRPC inside, Java (ecosystem/ops/talent). Shared底色: reuse mature components, externalize state to Redis, choose by scenario not theoretical perfection — simple-enough beats complex-perfect.
- Learner-relevant: Engineering tradeoff reasoning for distributed infrastructure.

### 4-硬指标兑现

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#硬指标兑现]]`
- Summary: The verifiable assertions behind "production-usable".
- Key claims: no loss, 10s switch, delivery precision (P99), big-key avoidance (independent small keys, no ZSet), at-least-once (no loss + possible duplicates + downstream idempotency), one-command 3-node deploy; each has an automated/chaotic test as judge — acceptance states failure-mode assertions, not coverage percentages (§38).
- Learner-relevant: Writing acceptance as failure-mode assertions.

### 5-但这门课真正的主角

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#但这门课真正的主角]]`
- Summary: The real subject is not When but the way it was made.
- Key claims: the point is that enterprise middleware can be built with AI programming, 90%+ of core code AI-written; the method is designing an environment/rules that let AI loop autonomously rather than issuing instructions one by one; human energy shifts from "writing prompts" to "designing loops, designing judges, gatekeeping at key points" — execution to the loop, judgment to humans.
- Learner-relevant: Core Loop Engineering mindset.

### 6-方法论

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#方法论]]`
- Summary: Base → per-section material → two runs.
- Key claims: ① base = domain model Message + inter-module contracts (SPI), the shared vocabulary; ② per-section material = function + task + Harness + acceptance, referencing the base and interlocking; ③ two runs = feed material to the loop, run → surface problems → backfill material → re-run; prerequisite is a shared model and interfaces so each section's output is a part of the same machine.
- Learner-relevant: The reusable three-layer method for AI-driven projects.

### 7-Loop 最重要的是 Harness

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#loop-最重要的是-harness]]`
- Summary: Harness quality determines loop quality.
- Key claims: code (structure/naming/lint), security (no hardcoded secrets, least privilege, env injection), acceptance (unit/integration/CI/chaos = the loop's judge); the judge cannot be bribed — forbid the loop from editing/deleting tests, separate implementer from verifier, use CI as an external judge out of the loop's reach; without a trustworthy judge the loop rapidly amplifies errors; When's practice puts chaotic tests (kill/partition) in CI, with verifiable assertions for no-loss, 10s switch, split-brain uniqueness.
- Learner-relevant: Designing a non-bribable judge.

### 8-两次跑

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#两次跑]]`
- Summary: First run (single-node core) vs second run (full HA).
- Key claims: §46 first run = single-node core path (receive→store→route→trigger), cluster formation/election/awareness, delivery with stubs to close the loop; §53 second run = real HTTP/Kafka delivery, replicas + 10s switch, Controller rebalance/multi-node distribution, auto-deploy + SDK test + console + HA demo; each run is run → surface problems → backfill into the owning section's material (no patching) → re-run from clean state until the judge is all green — changing the input beats arguing with AI for ten rounds.
- Learner-relevant: Why "change the input, not the output" speeds up AI development.

### 9-AI 编程总结

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#ai-编程总结]]`
- Summary: Three takeaways.
- Key claims: leverage changed (from writing a good prompt to designing a self-looping environment/rules); humans retreat to checkpoints (AI executes, humans judge — set goals, rules, watch key points, approve high-risk); divide by verifiability (cheap verification → loop; hard-to-verify and expensive mistakes like distributed consistency/fund safety → human-led).
- Learner-relevant: A decision rule for what to delegate to AI.

### 10-后续规划

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#后续规划]]`
- Summary: Community-driven follow-up beyond the 3-week MVP.
- Key claims: more Sinks (gRPC/RocketMQ/NATS/Pulsar via SPI), auth + rate limiting, dead-letter queue, priority queue, cross-region deploy, Operator/MCP; all outside the MVP, advanced via GitHub community with maintainers grown from students.
- Learner-relevant: How open-source projects extend post-MVP.

### 11–12-社区推进

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#社区推进]]`
- Summary: Community participation path.
- Key claims: Star → understand project → claim an issue → first PR → become maintainer; the core is community building, finding people genuinely interested; the author continues to push it so When stays alive and cited.
- Learner-relevant: Realistic open-source contribution ladder.

### 13-收束

- Locator: `[[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#收束]]`
- Summary: Closing statement.
- Key claims: When is a production-usable distributed delayed-delivery component; it was made via base-defined contracts → per-section verifiable material → two runs with the loop implementing autonomously and humans gating high-risk points; the real lesson is the AI-programming method — design loops, design judges, and Harness always matters most; "verifiable to the loop, judgment to humans; When is the sample, the method is what you take away."
- Learner-relevant: The single memorable takeaway of the project.

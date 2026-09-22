---
source: 第53节：Loop 运行演示·联调（第二次跑·完整 HA）
source_type: pdf
source_lines: 194
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第53节：Loop 运行演示·联调（第二次跑·完整 HA）

## Overview (L1)

- Purpose — a runbook (not module material) that integrates sections 47–52 and runs the full high-availability scenario: deploy a 3-node cluster, verify HTTP/Kafka delivery, view the console, and execute a failover test.
- Design rationale — §46 verified the single-node core path; the second run adds real HA. When a spec problem surfaces, fix the corresponding task doc and re-run from a clean state (no manual patches) — switch timeout→§47, imbalance→§48, delivery failure→§49, missing observability→§50, page/API error→§51, deploy failure→§52.
- Compared with §46 — test sink → real HTTP/Kafka delivery (§49); single replica → Master/Slave + 10s switch (§47); static distribution → Controller dynamic rebalance (§48); invisible → metrics/logs/health (§50); manual start → one-command deploy (§52); no UI → queryable/operable console (§51).
- Procedure (four steps) — auto-deploy cluster (docker-compose up / kubectl apply) → verify message ops via SDK or §51 business HTTP API (submit/query/cancel + real delivery) → view console pages → verify HA failover (send 100 delayed messages, kill a Master, observe <10s takeover and zero loss).
- Success criteria — end-to-end real delivery with correct state transitions; multi-node distribution via consistent hash + cross-node forwarding; already-persisted messages all reach terminal state (duplicates allowed = at-least-once); failover <10s provable via metrics/logs; observable; deployable.
- Boundaries and outputs — produces no new module material, only integration/deploy/run/demo/revision; no extension features (more sinks, auth, DLQ, priority, cross-region, Operator, MCP); outputs an upgraded overall Harness, a reproducible full-HA run, a revision log, and the conclusion that When is a production-usable distributed delayed-delivery component.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#1-这一节做什么]]`
- Summary: One-line goal — deploy the full cluster and verify message operations, real delivery, the console, and node failover.
- Key claims: this section generates no module code but executes full acceptance: deploy → submit/query/cancel via business HTTP API or SDK → verify HTTP/Kafka downstream receives → view console → stop the Master node and check takeover within 10s; on discovering spec issues, fix the corresponding task doc (47→timeout, 48→imbalance, 49→delivery, 50→observability, 51→page, 52→deploy) and re-run.
- Learner-relevant: Anchor for "fix the input, not the output" in loop engineering.

### 2-相比第 46 节增加了哪些真实能力

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#2-相比第-46-节本次增加了哪些真实能力]]`
- Summary: Lists the capabilities newly brought into the second run.
- Key claims: test sink → real HTTP/Kafka delivery (§49); single replica → Master/Slave + 10s failover (§47); static distribution → Controller dynamic rebalance + multi-node distribution (§48); invisible → metrics/logs/health (§50); manual start → one-command deploy (§52); no UI → queryable console (§51).
- Learner-relevant: Shows how a second integration run folds in previously excluded capabilities.

### 3-跑之前要具备什么

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#3-跑之前要具备什么]]`
- Summary: Preconditions for the second run.
- Key claims: all 40–52 material produced and individually accepted; overall Harness upgraded to fold 47–52 acceptance into §46's total acceptance; CI adds chaotic tests (kill node/partition); deployment artifacts ready (§52 compose/K8s yaml); a real downstream — HTTP callback mock endpoint + a Kafka topic — replacing §46's test sink.
- Learner-relevant: Prerequisites checklist for a full-HA integration run.

### 4-怎么跑（四步）

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#4-怎么跑四步]]`
- Summary: The four-step run procedure.
- Key claims: ① auto-deploy cluster and wait for `/ready`; ② verify message ops — submit various-delay messages (HTTP sink→mock, Kafka sink→topic), query state PENDING→DELIVERING→DELIVERED, cancel a PENDING one, verify the mock endpoint and Kafka topic receive; ③ view console pages (time wheels, create time wheel → Controller assigns, messages, cluster/Controller); ④ verify HA failover — send 100 delayed messages, before expiry `docker kill` a Master, the Slave takes over within 10s, restores from Redis, `when_master_failover_total` +1, all 100 delivered (possible duplicates).
- Learner-relevant: Concrete end-to-end HA demo script.

### 5-该跑出什么（成功标准 = 完整 HA）

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#5-该跑出什么第二次跑的成功标准--完整-ha]]`
- Summary: The second run's success criteria.
- Key claims: end-to-end real delivery with correct state flow; multi-node distribution via consistent hash with working cross-node forwarding; the 100 persisted messages all reach terminal state (duplicates allowed, at-least-once); failover <10s provable by metrics/logs; observability via metrics/trace_id logs/console; deployable via compose and K8s with expected probes.
- Learner-relevant: How to define success for a distributed-system integration run.

### 6-发现问题怎么办

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#6-发现问题怎么办修订-4752-原料再跑]]`
- Summary: Revision-by-source handling like §46.
- Key claims: switch >10s / lost message → §47; imbalance / wrong decision → §48; delivery failure / wrong retry → §49; nothing visible / missing metric → §50; page/API error → §51; won't start / wrong probe → §52; revise then re-run from clean state until §5 criteria all pass.
- Learner-relevant: Maps observed failures back to owning specs.

### 7-验收（本节自动化验收 = 完整 HA 是否跑通）

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#7-验收本节自动化验收--完整-ha-是否跑通]]`
- Summary: Acceptance items for the second run.
- Key claims: one-command 3-node deploy with `/ready` all passing; SDK submit/query/cancel correct and real delivery to HTTP mock + Kafka topic; console can query/create time wheels, query/filter messages, show pending→delivered, show cluster/Controller; kill Master → <10s switch, 100 messages not lost, provable in metrics/logs/page; multi-node distribution works; all tests (including CI chaos) green; issues resolved by "revise spec + re-run", no manual patches.
- Learner-relevant: Checklist tying the second run to observable acceptance.

### 8–9-边界与产出

- Locator: `[[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#8-边界本节不做什么]]`
- Summary: Scope exclusions and outputs of the second run.
- Key claims: no new module material — only integration/deploy/run/demo/revision; no extension features (those go to the summary's roadmap, community-led); outputs are the upgraded overall Harness (folding 47–52 + CI chaos), a reproducible full-HA run record, a revision log (problem → section → change), and the conclusion that When reaches "production-usable distributed delayed-delivery component" as a citable AI-programming sample.
- Learner-relevant: A runbook that produces reusable process artifacts (revision log).

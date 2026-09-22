---
source: 第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）
source_type: pdf
source_lines: 286
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）

## Overview (L1)

- Purpose — provide three deployment forms (local dev, single-node, Kubernetes) plus a CI pipeline; §53 uses these artifacts to deploy the test cluster.
- Design rationale — three forms map to learning/demo, minimal validation (no node-level HA), and multi-node production; config is all environment variables (12-factor), When binds to no deployment style as long as ETCD/Redis endpoints are reachable; CI is the external automated acceptance that Loop cannot modify (echoing §38).
- Loop relation — module task spec: Loop produces compose/yaml/CI config + deployment docs; CI runs the slow/destructive tests (kill node/partition) that Loop must not alter.
- Dependencies — upstream: §50 `/health`, `/ready` (K8s probes), `/metrics`; module env-var config; §47/§48 chaotic tests in CI; downstream: §53 integration (auto-deploy cluster), production/demo.
- Functionality and contracts — docker-compose (ETCD+Redis+Kafka+when1/2/3), single-node low-HA, production multi-node with load balancer, K8s (Deployment replicas=3 + probes, Service, ConfigMap, Secret, optional HPA, PDB), CI stages build→unit/integration→chaos→security/lint.
- Fields and acceptance — core env vars, artifacts (compose, k8s/*.yaml, CI workflow, DEPLOY.md); acceptance includes one-command cluster up, probes correct, no plaintext secrets, CI gating.
- Boundaries, Harness, deliverables — no K8s Operator, no ETCD/Redis HA, no production dashboards/alerting; artifacts in `deploy/`; all secrets via Secret/env with `${ENV}` placeholders, plus a "no hardcoded secrets" CI scan.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: One-line goal — local dev, single-node, and Kubernetes deployment plus CI for acceptance Loop cannot modify.
- Key claims: local dev uses docker-compose for dependencies and multi-node When; single-node uses jar/Docker for functional/low-availability; production uses Kubernetes; config via env vars; CI handles build, test, security check, and merge gate.
- Learner-relevant: Anchor for 12-factor config and deployment-form tradeoffs.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies three forms, env-var config, and CI as external acceptance.
- Key claims: requirements demand three forms (learning/demo, minimal validation, multi-node production); K8s plan includes Deployment/Service/ConfigMap/Secret/probes/PDB where PDB limits concurrently stopped Pods during planned maintenance (§14); config per 12-factor (`WHEN_NODE_ID`, `WHEN_GRPC_PORT`, `WHEN_ETCD_ENDPOINTS`, `WHEN_REDIS_*`, `WHEN_TIMEWHEEL_COUNT`), sensitive values via Secret (§14.4); CI runs local fast tests plus slow/destructive tests (kill node, partition) in a protected scope; merge only when all checks pass (echoing §38).
- Learner-relevant: Why CI's protected scope makes it a credible judge.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Loop task framing and dependency edges.
- Key claims: Loop produces compose/yaml/CI config + docs; upstream §50 endpoints, module env config, §47/§48 chaos tests; downstream §53 auto-deploy, production/demo, CI as per-PR acceptance.
- Learner-relevant: Deployment artifacts as first-class deliverables consumed by the demo section.

### 5–6-功能与交互 / 接口与契约

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#6-接口--契约设计配置--制品]]`
- Summary: The three forms' composition, K8s resources, CI stages, and the core env vars.
- Key claims: docker-compose one command starts ETCD+Redis+Kafka+when1/2/3 (each with its own `WHEN_NODE_ID`/ports, pointing at dependencies) → a 3-node cluster for curl/SDK testing and demos; single-node form must document its lack of node-level HA; production multi-node spreads components across failure domains behind a load balancer; K8s Deployment replicas=3 with liveness/readiness probes, Service, ConfigMap, Secret, optional HPA, PDB (at least 2 nodes during rolling upgrade), ETCD/Redis via existing Helm charts; CI: PR → build (protoc+compile) → unit/integration → chaos → security/lint gate; core env vars listed; artifacts `docker-compose.yml`, `k8s/*.yaml`, CI workflow, `DEPLOY.md`.
- Learner-relevant: Concrete deployment topologies and CI stage contract.

### 7-字段与阶段定义

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#7-字段--阶段定义]]`
- Summary: CI stages, probes, and secret handling.
- Key claims: stages build → unit/integration → chaos/destructive → security/lint → all pass (any red blocks merge); liveness=`/health`, readiness=`/ready` (ETCD+Redis+time wheel); `WHEN_REDIS_PASSWORD` etc. via K8s Secret/env, never plaintext in yaml, images, or logs.
- Learner-relevant: Minimal viable CI gate and secret hygiene rules.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance and required tests.
- Key claims: `docker-compose up` starts the cluster which auto-forms and is curl-testable; K8s `kubectl apply` brings 3 replicas ready with not-ready Pods excluded from Service; probes work (`/ready` 503 pulls the Pod, restore adds it back); all config via env, no plaintext secrets; CI gate complete and blocking; tests: compose smoke, K8s deploy (kind/minikube), CI gate test (intentional failure/plaintext secret must be blocked).
- Learner-relevant: Testing the deployment and the CI gate itself.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, Harness constraints, deliverables.
- Key claims: no K8s Operator (community), no ETCD/Redis HA responsibility, no production dashboards/alerting; artifacts in `deploy/` with reproducible `DEPLOY.md`; multi-stage slim images, no test credentials in images; all secrets injected via Secret/env with `${ENV}` placeholders in examples; add a "no hardcoded secrets" CI scan; deliverables are compose, k8s/, CI config, DEPLOY.md, and smoke/K8s/gate tests.
- Learner-relevant: Where deployment responsibility ends (external dependencies).

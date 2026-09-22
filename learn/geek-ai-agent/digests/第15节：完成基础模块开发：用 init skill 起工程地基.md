---
source: 第15节：完成基础模块开发：用 init skill 起工程地基
source_type: pdf
source_lines: 183
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第15节：完成基础模块开发：用 init skill 起工程地基

## Overview (L1)

- Foundation first, then business — Before writing the five capabilities, stabilize the engineering foundation; a stable foundation makes every later capability faster and steadier.
- The six foundation blocks — Structured logging (SLF4J + Logback, JSON + traceId), monitoring (Actuator + Micrometer + Prometheus), HTTP server (Spring MVC + JDK 21 virtual threads), API spec (springdoc OpenAPI + unified response + global exceptions), code standards (Google format via Spotless + Alibaba P3C + Checkstyle), security checks (SpotBugs + Find Security Bugs + PMD + OWASP dependency scanning).
- Why write OryxOS's own init skill — Generic skills don't know the 9-module structure or constitution decisions and need heavy rework; an own skill encodes conventions and still lands standard tools.
- What oryxos-init does — One SKILL.md compresses 10 init steps into six phases: skeleton → logging/monitoring → HTTP/API → code standards → security → CI/verification.
- Demo — Run the skill step by step and finish with `mvn verify` all green.

## Sections (L2)

### 先起地基，再写业务
- Locator: `[[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#先起地基，再写业务]]`
- Summary: Two-phase order — first engineering foundation (logging, monitoring, HTTP, API spec, code standards, security checks), then the five capabilities.
- Key claims: a rocky foundation gets messier as you go; this step decides overall engineering quality though it produces no business output directly.
- Learner-relevant: anchors the discipline of building infrastructure before features.

### 工程地基，包含这六块
- Locator: `[[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#工程地基，包含这六块]]`
- Summary: The six concrete blocks and their tool choices (logging/monitoring/HTTP/API/code standards/security), all business-agnostic and needed by every project.
- Key claims: because these are generic and repeatable, they suit a single skill that installs them in one shot.
- Learner-relevant: a concrete enterprise-grade baseline stack.

### 为什么写 OryxOS 自己的 init skill
- Locator: `[[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#为什么写 OryxOS 自己的 init skill]]`
- Summary: Contrasts a generic skill (doesn't know the 9-module structure, constitution decisions, naming/dirs; needs rework) with an own skill (9-module skeleton, constitution alignment, standard tools, long-term team/community reuse).
- Key claims: a Skill is the right way to fixate a generic, repeatable process.
- Learner-relevant: the methodology of when to generalize a workflow into a skill.

### oryxos-init skill 做什么
- Locator: `[[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#oryxos-init skill 做什么]]`
- Summary: One SKILL.md encodes the foundation flow: skeleton → logging/monitoring → HTTP/API → code standards → security checks → CI/verification; two-layer standards (Google format + Alibaba P3C), four-piece security suite wired into mvn verify.
- Key claims: division of labor — skill installs, constitution nails down, CI enforces, Spec-Kit writes business after.
- Learner-relevant: how a skill orchestrates standard tools into a reusable bootstrap.

### 现场演示：把工程地基起好
- Locator: `[[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#现场演示：把工程地基起好]]`
- Summary: Three steps — build the 9-module skeleton (Maven multi-module + parent pom + oryxos-boot), install the foundation via the skill, achieve green `mvn verify`.
- Key claims: acceptance = /actuator/health and /prometheus work, /swagger-ui opens, standards and security checks all take effect.
- Learner-relevant: a runnable acceptance checklist for the foundation phase.

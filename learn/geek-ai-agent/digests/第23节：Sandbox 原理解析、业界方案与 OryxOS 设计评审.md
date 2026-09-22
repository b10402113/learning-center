---
source: 第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审
source_type: pdf
source_lines: 375
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审

## Overview (L1)

- 为什么需要 Sandbox — the Agent executes code/commands it decided at runtime, and multi-tenant multi-agent coexistence makes isolation a production prerequisite.
- 隔离什么 / 跷跷板 — four dimensions (filesystem, network, process/syscall, resources); isolation strength trades off against overhead, and deeper boundaries are safer.
- 四档方案 — application-layer whitelist → container → microVM → full VM/physical, with layered defense-in-depth in mature systems.
- 业界选型 — local coding agents (Claude Code), pluggable multi-backend agents (Hermes), cloud code interpreters (gVisor/E2B/Daytona); selection follows threat model.
- 学界共识 — confused deputy, AgentDojo prompt-injection benchmark, capability-based security; whitelists are only dissuasion, not confinement.
- OryxOS 设计评审 — signal-driven, interface-first `Sandbox` abstraction with a strategy object, phase-1 application-layer whitelist, microVM reverse-validation, and clear upgrade signals.

## Sections (L2)

### 一-为什么需要-sandbox

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#一-为什么需要-sandbox]]`
- Summary: Traditional software trusts the code you wrote, but Agent scenarios differ: (1) the Agent executes commands/code it generates at runtime, un-reviewed, vulnerable to prompt injection or its own destructive mistakes; (2) multi-tenant and multi-agent coexistence means tenant A's Agent must never read tenant B's data or affect its operation.
- Key claims: Sandboxing is not a nice-to-have but the precondition for an Agent to reach production; without isolation you dare not let it perform any side-effecting action and it remains a chat toy.
- Learner-relevant: Establishes the risk model that justifies the whole module.

### 二-隔离什么四个维度

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#二-隔离什么四个维度]]`
- Summary: Filesystem (no arbitrary read/write of host files, keys, config, other tenants), network (no arbitrary outbound connections, no data exfiltration, no jump-host abuse), process/syscall (no dangerous operations, privilege escalation or host impact), resources (no resource bombs eating CPU/memory/disk).
- Key claims: Every scheme covers these four dimensions at different cost/coverage.
- Learner-relevant: The lens for evaluating any sandbox technology.

### 三-隔离强度和开销跷跷板

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#三-隔离强度和开销跷跷板]]`
- Summary: Stronger isolation means more overhead and slower startup; all schemes pick a point on this line. The deeper the isolation boundary, the safer: application-layer validation weakest → container (process/OS level) middle → microVM (kernel level) stronger → physical strongest.
- Key claims: The essence of choosing a scheme is answering "how untrusted is what you run, and how much are you willing to pay for isolation".
- Learner-relevant: The core decision framing for this and the next lesson.

### 四-第一档应用层白名单

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#四-第一档应用层白名单]]`
- Summary: No real system isolation — code checks before executing (is this path allowed, is this command blacklisted, is this domain allowed). Zero infrastructure and performance overhead, simple and single-binary.
- Key claims: Its fatal weakness is dissuasion, not confinement — any uncovered bypass (command concatenation, symlinks, encoding, unlisted commands) breaks it; it stops foolish mistakes, not deliberate attacks; fine as the first layer of defense-in-depth, not as the sole production line.
- Learner-relevant: The honest limitation OryxOS must label in phase 1.

### 五-第二档容器隔离

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#五-第二档容器隔离]]`
- Summary: Linux namespaces isolate filesystem/network/process views, cgroups limit resources, seccomp restricts syscalls; each Agent or code execution runs in a trimmed isolated world. Mature ecosystem and full coverage make it the main scheme for most systems running untrusted code.
- Key claims: Its ceiling is sharing the host kernel — a kernel exploit can escape; pure containers are considered insufficient for fully untrusted code; slower startup than processes.
- Learner-relevant: The phase-2 candidate for semi-trusted and multi-tenant scenarios.

### 六-第三档-microvm

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#六-第三档-microvm]]`
- Summary: Give each sandbox its own lightweight kernel to get VM-boundary isolation at near-container speed/density — Firecracker (~100ms startup, tiny memory), Kata Containers (container-like UX on lightweight VMs), gVisor (user-space kernel).
- Key claims: It is hot in the Agent era because large-scale untrusted code (e.g. code interpreters running millions of user programs) needs strong isolation plus container-like startup and density; the trick is redesigning a minimal VMM cutting unused device emulation; it is the current gold standard, and many serious platforms evolve "container → Kata → Firecracker".
- Learner-relevant: The phase-3 target that also serves as the abstraction-neutrality reverse test.

### 七-第四档完整虚拟机与物理隔离

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#七-第四档完整虚拟机与物理隔离]]`
- Summary: Traditional VMs, dedicated physical machines and isolated networks — strongest isolation but heaviest and most expensive.
- Key claims: Used only under extreme compliance requirements (financial core, classified); most Agent systems never reach this tier.
- Learner-relevant: Completes the strength spectrum.

### 八-分层纵深防御

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#八-分层纵深防御]]`
- Summary: The four tiers form an increasing-strength evolution line, but mature systems stack multiple layers: application whitelist catches the obvious, container/microVM provides strong isolation, plus network egress control, resource quotas and full-chain audit.
- Key claims: No single layer is omnipotent; a sandbox is a combination, not a switch — even with microVM, egress control, quotas and audit remain mandatory.
- Learner-relevant: The defense-in-depth concept applied throughout OryxOS.

### 九-业界真实系统怎么选沙箱

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#九-业界真实系统怎么选沙箱]]`
- Summary: Three product classes: (1) local coding agents like Claude Code run on your trusted machine, threat = mistake + prompt injection, so tier-1 permission gates + optional tier-2 OS sandbox (macOS Seatbelt, Linux bubblewrap+seccomp+socat), no microVM; (2) Hermes Agent (NousResearch) makes isolation a pluggable terminal backend with six options (local/Docker/SSH/Singularity/Modal/Daytona); (3) cloud code interpreters (OpenAI gVisor, E2B Firecracker, Daytona gVisor, Modal GPU sandboxes) run strangers' code, so they go straight to microVM.
- Key claims: Selection is determined by "whose code you run", not by maximum strength; Hermes's security doc states the only safe boundary against a malicious LLM is the OS — in-process gates/scanners are heuristics on attacker-influenced strings; terminal-backend isolation only jails shell/file tools while code execution, MCP subprocesses and in-process plugins remain exposed — true coverage needs whole-process wrapping; OryxOS sits near the leftmost tier deliberately, matching Claude Code's threat model.
- Learner-relevant: The concrete industry anchors and the Hermes caveat about Sandbox.enforce covering only the tool-execution path.

### 十-学界与安全社区共识

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十-学界与安全社区共识]]`
- Summary: Confused deputy — the Agent holds high privileges but a low-privilege injected input tricks it into abusing them; pure whitelists/approval gates validate the request's form, not whether it was induced by tainted data. AgentDojo (ETH spylab, NeurIPS) quantifies tool-using agents' adversarial robustness against untrusted data. Capability-based security prefers granting least-privilege capability tokens over validating path strings.
- Key claims: These support "a sandbox is a combination"; even strong isolation cannot stop a legally authorized tool from doing harm under poisoned instructions, so audit (day-one) and least privilege (Profile `tools`) matter as much as isolation.
- Learner-relevant: The honest conclusion that OryxOS's tier-1 whitelist is not a security boundary — it limits misuse and the available surface.

### 十一-设计原则

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十一-设计原则]]`
- Summary: Design for multi-stage evolution from day one (otherwise strengthening isolation later means refactoring), but do not write future code now: (1) direction clear now (application → container → microVM, and the trigger signals); (2) interface designed right now (most important); (3) implementation only tier 1 now.
- Key claims: The dividing line is the interface wall — above it design now, below it only what is needed now.
- Learner-relevant: Same "direction / interface / implementation" triad as Memory.

### 十二-怎么设计这道墙

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十二-怎么设计这道墙]]`
- Summary: The interface abstracts intent ("execute this action in a controlled environment"), not implementation — no container image or VM config in the signature. Isolation requirements travel in a strategy object (allowed paths/domains, resource caps, required isolation level such as basic/container/microVM); each tier is an independent pluggable implementation.
- Key claims: Core phase has only the application-layer implementation, but the interface and strategy reserve the isolation-level dimension; adding containers later is a new implementation class responding to a level, not an interface change (open/closed principle).
- Learner-relevant: Concrete interface design for future-proofing at near-zero extra cost.

### 十三-别让接口被第一档带偏

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十三-别让接口被第一档带偏]]`
- Summary: With only one implementation, it is tempting to design the interface for it (methods like "checkPath"/"checkCommand"), which will not fit a container ("provides an isolated filesystem", not "checks"). The fix: design while thinking of the heaviest tier (microVM) and ask "can a microVM implementation fit cleanly?" If not, the interface was distorted.
- Key claims: Also remember the Hermes caveat — the interface must leave room for covering MCP subprocesses and in-process abilities, not be welded into "intercept one tool call".
- Learner-relevant: A reusable technique for validating abstraction neutrality.

### 十四-分阶段实现路线

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十四-分阶段实现路线]]`
- Summary: Core phase: application-layer whitelist (file/command/domain), zero deps, single binary — honestly documented as first-layer dissuasion, not strong isolation, so no fully untrusted code and no external multi-tenancy yet. Extension step 1: container isolation (namespaces + cgroups + seccomp, four dimensions) → semi-trusted and multi-tenant. Extension advanced: microVM (Kata/Firecracker) for fully untrusted, scaled multi-tenant. Throughout: network egress control, resource quotas, full-chain audit.
- Key claims: These companions do not vary with isolation tier — they are defense-in-depth in every tier.
- Learner-relevant: The explicit phase roadmap.

### 十五-什么信号触发升级

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十五-什么信号触发升级]]`
- Summary: Application → container when you start running relatively untrusted code/commands or need multi-tenancy. Container → microVM when running fully untrusted code (e.g. public uploads) or scaling many mutually distrusting sandboxes with both strength and density requirements.
- Key claims: Without these signals, do not upgrade; isolation strength is driven by real trust level, the same "phased restraint" principle as Memory and later the scheduler.
- Learner-relevant: The signal-driven rule restated for isolation.

### 十六-分阶段路线总览

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十六-分阶段路线总览]]`
- Summary: Table: interface layer permanent from day one (intent-expressing abstraction + strategy with isolation level, reverse-validated by microVM); core phase application whitelist; signal 1 → container; signal 2 → microVM; all phases include egress control, quotas, audit.
- Key claims: No upgrade before a signal appears.
- Learner-relevant: The roadmap the implementation lesson (24) executes.

### 十七-评审自查

- Locator: `[[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十七-评审自查]]`
- Summary: Can you explain the strength/cost seesaw and "deeper is safer"; does the `Sandbox` signature accidentally contain tier-1 words, and can microVM fit it; did you honestly label the whitelist as dissuasion not confinement; can you recite the two upgrade signals; do you understand defense-in-depth (microVM still needs egress control and audit).
- Key claims: If any answer is "everyone uses containers/microVM", the thinking is incomplete.
- Learner-relevant: A retrievable review checklist before coding.

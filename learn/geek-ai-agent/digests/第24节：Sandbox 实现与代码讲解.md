---
source: 第24节：Sandbox 实现与代码讲解
source_type: pdf
source_lines: 472
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第24节：Sandbox 实现与代码讲解

## Overview (L1)

- 这节要做什么 — build the interface from lesson 23, fill it with the whitelist implementation, and wire it into the existing `read_file`/`write_file`/`shell`/`http_get`/`http_post` tools.
- 动手前先拆任务 — define interface/values first, implement `WhitelistSandbox`, wire into Tools, confirm failure path reuse, self-check neutrality.
- 代码怎么写 — `Sandbox` + `SandboxAction` + `ActionType` + `SandboxViolationException`, three `@ConfigurationProperties`, `WhitelistSandbox` with three private checks, and one-line `enforce` insertions.
- 验收 harness — three check groups "allow + reject + bypass", plus wiring regressions proving real IO does not happen.
- 做完怎么验 — real-chain integration, interface-neutrality self-check, config boundary documentation, existing tests green.

## Sections (L2)

### 一-这一节要做什么

- Locator: `[[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#一-这一节要做什么]]`
- Summary: Build the wall, put the whitelist implementation behind it, and connect it into the existing Tools. Explicitly not doing: container/microVM implementations and changing `ToolExecutor`'s audit logic (already has a failure path; a Sandbox rejection is an ordinary tool failure).
- Key claims: Sandbox violation is just a normal `RuntimeException` from the Tool, so it reuses the existing `success=false` tool audit path.
- Learner-relevant: Scopes the lesson to the smallest useful increment.

### 二-动手前先拆任务

- Locator: `[[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#二-动手前先拆任务]]`
- Summary: Ordered task breakdown: (1) define `Sandbox`, `SandboxAction`, `ActionType`, `SandboxViolationException` and freeze them; (2) write `WhitelistSandbox` for file path/shell command/HTTP domain checks reading `file.allowed_paths`, `shell.allowed_commands`, `http.allowed_domains`; (3) insert `sandbox.enforce(...)` at the start of each Tool's execute; (4) confirm failure path needs no new code; (5) self-check neutrality by imagining a microVM implementation. All goes in the `oryxos-tool` module.
- Key claims: The existing IO code stays untouched; a rejection must be catchable by `ToolExecutor`'s existing try/catch.
- Learner-relevant: The code-level decomposition order mirroring lesson 23's design order.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: `Sandbox.enforce(SandboxAction)` states intent only; `SandboxAction(ActionType type, String target)` has no whitelist/container/image words; `ActionType` has four values FILE_READ/FILE_WRITE/SHELL_COMMAND/HTTP_REQUEST (read/write split for future per-direction permissions but routed to the same `checkFilePath` now); `SandboxViolationException` extends `RuntimeException`. `WhitelistSandbox` binds three properties records and implements `enforce` with a switch; `checkFilePath` normalizes + absolutizes then `startsWith`; `checkShellCommand` compares the first whitespace token; `checkHttpUrl` matches exact or `*.` wildcard domains. Three checks are private so only `enforce` is exposed. Wiring: `ShellTools`, `FileTools` (`readFile`/`writeFile`) and `HttpTools` each call `sandbox.enforce(...)` at the top of the `@Tool` method, leaving `doExecute`/`doRead`/`doWrite`/`doGet` untouched.
- Key claims: `Path.normalize().toAbsolutePath()` blocks `../../etc/passwd` traversal — the most commonly missed application-layer hole; keeping the three checks private prevents the interface from being distorted toward tier 1.
- Learner-relevant: Exact implementation and the demonstration that correct abstraction makes wiring cost one line per tool.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#四-验收-harness]]`
- Summary: `WhitelistSandboxTest`organized as three groups (file path / shell command / HTTP domain), each with allow + reject + bypass: relative-path traversal blocked by normalize; first-token whitespace/case variants; exact match plus wildcard `*.example.com` matching `api.example.com` but not `evil-example.com`. Wiring regressions for FileTools/ShellTools/HttpTools/NotifyTools assert a non-whitelisted input is blocked and real IO did not happen (`verify(executor, never())`).
- Key claims: The wildcard test points at the classic `endsWith` hole — `"evilexample.com".endsWith("example.com")` is true, so matching must include the dot boundary (`.example.com`); asserting only "threw" is insufficient, you must prove the dangerous action did not run.
- Learner-relevant: Security-focused test design where "can it be bypassed" matters more than "does allow work".

### 五-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#五-做完怎么验]]`
- Summary: Manual checks: integration run with a whitelist allowing only `ls` and a blocked command, confirming `SandboxViolationException`, a `tool_invocations` `success=false` record with a human-readable message; interface-neutrality self-check (would `KataMicroVmSandbox` need a new method? no); document that empty whitelist config means "allow nothing", not "skip validation"; the four modified Tools' original tests stay green.
- Key claims: This validates lesson 23's core claim — when the interface is right, integration cost is disproportionately small (one line per tool; audit and `ToolExecutor` untouched).
- Learner-relevant: Forward-looking note: `enforce` currently covers only the tool-execution path; MCP subprocesses and in-process direct calls remain exposed, with whole-process isolation as the eventual direction.

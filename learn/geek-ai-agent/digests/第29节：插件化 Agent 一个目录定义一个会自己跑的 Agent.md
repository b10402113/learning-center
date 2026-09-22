---
source: 第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent
source_type: pdf
source_lines: 550
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent

## Overview (L1)

- 开篇-为什么敢叫 Agent OS — the lesson that earns the OS name: an OS is defined not by kernel strength but by a standard mechanism to define, install, and run arbitrary programs; OryxOS has the kernel (base capabilities) but until now no executable format / loader for Agents.
- 一-本节目标 — two layers: base (shared system capabilities) + Agent (one self-contained directory); borrow Anthropic Agent Skills' directory shape and progressive disclosure, but define an Agent (not a "skill"); a working directory example is the daily-reconcile Agent.
- 二-围绕目标要做哪些 — a single principle: don't rewrite the base, just add a Profile source; scan `.oryxos/agents/` → parse AGENT.md → derive a Profile → register; progressive disclosure via existing `read_file`/`shell`; scheduling comes from the Agent itself; runtime registration plus the L3 script sandbox trust boundary.
- 三-怎么验收 — six harness classes nail each link of "scan → derive Profile → register → self-run" and especially that directory-derived Agents obey the same validation/base as hand-written Profiles.
- 本节交付物 — `AgentLoader`, `deriveProfile`, mutable `ProfileRegistry`, `AgentScheduler.registerProfile` + handle table, `ContextLoader` injecting Agent body, and the `daily-reconcile/` example directory.

## Sections (L2)

### 开篇-为什么敢叫-Agent-OS

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#开篇-为什么敢叫-Agent-OS]]`
- Summary: Justifying the "OS" name: a thing that runs one program isn't an OS — an OS is "a kernel on which you can install and run arbitrarily many programs, isolated, without changing the kernel or recompiling". What makes Windows an OS is the standard mechanism (executable format + loader + scheduler). By lesson 28 the base (kernel) is complete and stable — Provider, ReAct, built-in Tool, Memory, Sandbox, scheduler, Web — but a kernel alone isn't an OS: to run a business Agent you still hard-write instructions into config and assemble by hand. This lesson supplies the missing "define an Agent, install it, run it" mechanism, so it's the core lesson for calling OryxOS an Agent OS. After it, defining an Agent degenerates to dropping a directory into `.oryxos/agents/` — arbitrarily many, mutually independent, no base changes, self-scheduling.
- Key claims: From this lesson OryxOS goes from "a framework that can run an Agent" to "an OS that can run N Agents".
- Learner-relevant: The OS analogy that frames the whole declarative-Agent model.

### 一-1-两层-底座系统基础能力-Agent一个自足的目录

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#一-1-两层-底座系统基础能力-Agent一个自足的目录]]`
- Summary: The clearest analogy is an OS. Base layer = kernel / shared system capabilities: Provider, ReAct, built-in Tools (`read_file`/`shell`/`http_get`/`notify`/`save_memory`…), Memory, Sandbox, scheduler, Web (lessons 16–28) — system fundamentals all Agents share. Agent layer = "an executable program / package": one `.oryxos/agents/<name>/` directory, a self-contained business Agent carrying identity/config, instructions, scripts, references. Verifiable end state: drop an Agent directory → it appears in the Agent list → at its declared time it runs "think → call system capabilities → answer → push" with audit → edit its instructions and the next trigger takes effect immediately → all without writing a line of Java or touching the base.
- Key claims: Base is shared capabilities, Agent is a self-contained directory; the two-layer split is the architecture's central boundary.
- Learner-relevant: The base-vs-Agent boundary stated as the OS analogy.

### 一-2-借形态-但定义的是-Agent

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#一-2-借形态-但定义的是-Agent]]`
- Summary: The model borrows the shape of Anthropic Agent Skills — a directory with `SKILL.md` + scripts + references — but not its naming: in OryxOS such a directory defines an Agent (a self-running business program), not a capability attached to someone else. Key difference: one directory = one Agent; "skill" is merely an optional sub-instruction `.md` inside that Agent directory, not the top-level unit. OryxOS does not build a "cross-Agent shared capability library" — each Agent is independent and self-contained, calling only the base's system capabilities. What it really takes from Anthropic is progressive disclosure — things in an Agent directory enter context by stage on demand: the instruction body (task description, enters system prompt when triggered — the Agent's "persona + what to do"), references/sub-instructions (`REFERENCE.md`, `skills/*.md` — read via `read_file` only when used), and scripts (`scripts/*.py` — run via `shell`/`python` only when used, output enters context, code does not, so deterministic work doesn't burn tokens).
- Key claims: The earlier课件 wavered between "one Skill = one Agent" and "Skill = reusable capability"; this version pins it down — one directory = one Agent, with skill absorbed as an internal component; no cross-Agent `use_skill`/capability library/global index.
- Learner-relevant: Disambiguates the crucial Agent-vs-skill terminology and explains progressive disclosure.

### 一-3-一个-Agent-目录长什么样

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#一-3-一个-Agent-目录长什么样]]`
- Summary: A real example runs through the lesson — the daily order-reconciliation Agent (`daily-reconcile`) that every morning compares transaction-DB vs clearing-DB order counts and amounts, generating a graded report pushed to the ops group. It uses all four resources at once. Directory: `AGENT.md` (frontmatter = the Agent's profile, body = task instructions), optional `REFERENCE.md`, `skills/report-format.md` (sub-instruction, read on demand), `scripts/reconcile.py` (run on demand). The frontmatter is the Agent's own profile — name (unique id = directory name), description, identity (agent_name/prompt/provider/model/temperature/tools `[shell, read_file, notify, save_memory]`), notify_channels, and schedules (`{id, cron, zone, message}` using `0 0 9 * * *` Asia/Shanghai). The body is a step-by-step instruction: run `python scripts/reconcile.py` for deterministic JSON, branch on `diffs`, read `skills/report-format.md` for the report structure and P0/P1/P2 grading, consult `REFERENCE.md` when unsure, then notify and `save_memory`.
- Key claims: frontmatter = this Agent's profile (identity, provider/model, system capabilities, where to push, when to run — one Agent carries everything, so `.oryxos/profiles/` is removed); body = the LLM task instructions; `skills/`, `REFERENCE.md`, `scripts/` are the Agent's own on-demand resources; storage location is fixed at `.oryxos/agents/<name>/`.
- Learner-relevant: The concrete directory layout and the "one directory is one complete, runnable Agent" model.

### 一-4-另外三个文件-各自用到才进上下文

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#一-4-另外三个文件-各自用到才进上下文]]`
- Summary: The body only orchestrates; the real report spec, field reference, and data-fetch logic live in three other files, each loaded on demand — progressive disclosure inside one Agent. `AGENT.md` body (task orchestration, resident in system prompt when triggered, supplied by `ContextLoader`), `scripts/reconcile.py` (deterministic fetch/compare via `shell`/`python`; only its output JSON enters context, the code does not; pure standard library, no key), `skills/report-format.md` (report structure + grading, read via `read_file` only when a diff appears), `REFERENCE.md` (field dictionary + known-acceptable diffs, read via `read_file` only when a diff's grading is uncertain). The example script loads the two exported CSVs, computes missing-in-settle / missing-in-orders / amount-mismatch diffs, and dumps a JSON with date/counts/amounts/diffs; the spec defines P0 (>10000 total or >5000 single mismatch — possible financial loss), P1 (≥1 missing_in_settle — same-day investigation), P2 (only missing_in_orders or a 0.01 tail diff — observe).
- Key claims: Four files together are one complete runnable Agent; the spec-kit produces this directory from the课件 as a reference artifact (the课件 is input, code is generated).
- Learner-relevant: How one Agent achieves progressive disclosure purely through the existing `read_file`/`shell` capabilities.

### 二-围绕目标要做哪些

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#二-围绕目标要做哪些]]`
- Summary: The governing principle: don't rewrite the base, just add a Profile source. The base (16–28) — `AgentService`, `ReActLoop`, `PromptBuilder`, `AgentScheduler` — all consume the `Profile` value object, so zero base lines change: only "read Profile from Profile YAML" becomes "derive Profile from the Agent directory's AGENT.md frontmatter", through the same registration and validation. 2.1 Scan: at startup (and API add in lesson 30) scan `.oryxos/agents/` in three steps — parse (`AgentLoader` splits frontmatter/config from body/instructions and records `scripts/`, `skills/`, `REFERENCE.md`), derive (`deriveProfile(agentDir)` maps frontmatter to a `Profile` with name/provider/tools/notify_channels/schedules), and register (into `ProfileRegistry`, reusing lesson-16 validation — provider exists, tool registered — and handing schedules to `AgentScheduler`). 2.2 Progressive disclosure via the base's `read_file`/`shell` on demand. 2.3 Scheduling comes from the Agent's own frontmatter-derived `schedules`, so `AgentScheduler` changes zero lines. 2.4 Runtime registration (`ProfileRegistry` becomes a mutable concurrent Map with `register`/`remove`/`exists`; `AgentScheduler` extracts `registerProfile` and adds a `ScheduledFuture` handle map for lesson 30) plus the L3 script sandbox trust boundary.
- Key claims: Deriving a Profile is what lets an Agent directory reuse the entire base unchanged; on trigger it runs the same `AgentService.process` as CLI/Web with ReAct/Tool/Provider untouched.
- Learner-relevant: The core insight that "derive to Profile" is the whole plugin mechanism.

### 二-4-补运行时注册-去掉重启这条尾巴-L3-脚本的沙箱与信任边界

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#二-4-补运行时注册-去掉重启这条尾巴-L3-脚本的沙箱与信任边界]]`
- Summary: Runtime registration (for lesson 30): `ProfileRegistry` goes from immutable to a mutable concurrent Map with `register(Profile)`/`remove(String)`/`exists(String)`, so startup scan and runtime add share the same code and validation; `AgentScheduler.registerProfile` plus a `Map<String, ScheduledFuture<?>>` handle table (for lesson 30 unregister/update). L3 script sandbox: an Agent's script runs via the base's `shell`/`python`, and the trust boundary lives here — the whitelist permits "interpreter (`python`/`bash`) + scripts only under this Agent's own `scripts/` directory". A necessary honest boundary: scripts are arbitrary code, so `python scripts/foo.py` once permitted can read/write files and make network calls itself — bypassing `http_get`'s domain whitelist (which only governs the built-in `http_get`, not subprocess networks). Conclusion: installing a script-bearing Agent = trusting its author; the core-phase sandbox does only "interpreter + directory" whitelists, and confining third-party Agents in restricted containers / network isolation is an extension-phase task.
- Key claims: Deliberately not done this lesson: Agent versioning, Agent market/sharing, cross-Agent capability reuse, L3 container/network isolation, name-conflict policy, and file-watching hot reload (lesson 30) — all deferred; the lesson stops at "a directory derives a self-running Agent + runtime registration in place".
- Learner-relevant: The key security/trust honesty about script-bearing Agents, and the runtime-registration groundwork for lesson 30.

### 三-怎么验收-把机制固化成-harness

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#三-怎么验收-把机制固化成-harness]]`
- Summary: The mechanism is "scan → derive Profile → register → self-run"; the harness nails every link, especially that directory-derived Agents and hand-written Profiles pass the same validation/base. `AgentLoaderTest` (splits frontmatter/body, recognizes resources, missing name/provider errors by name), `DeriveProfileTest` (fields map to Profile, schedules carry over — direct evidence scheduling comes from the Agent), `AgentScanRegisterTest` (scanning N Agent dirs yields N in `ProfileRegistry`, scheduled ones in `AgentScheduler`), `ProfileRegistryRuntimeTest` (`register()` then `get()` visible; illegal config errors identical to the startup path), `AgentSchedulerRegisterTest` (handle present after `registerProfile`; cron/zone from `Profile.schedules`), `ProgressiveDisclosureTest` (body enters system prompt; references/scripts not preloaded, taken on demand via `read_file`/`shell`).
- Key claims: "Agent body changes take effect immediately" needn't be retested here — lesson 17's `ContextLoaderTest` no-cache regression already nails it; acceptance requires: one directory defines one Agent visible in `oryxos profile list`/`GET /profiles` with no Java; scheduling truly self-triggers with webhook and audit; resources load on demand; body changes take effect without restart; both sources obey the same rules; runtime registration in place (handle stored for lesson 30); `mvn clean verify` green.
- Learner-relevant: The harness structure for a plugin mechanism and the acceptance criteria for "define an Agent without code".

### 本节交付物

- Locator: `[[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#本节交付物]]`
- Summary: Code — `AgentLoader` (parse dir → frontmatter/body/resource paths), `deriveProfile(agentDir) → Profile`, startup scan of `.oryxos/agents/` and registration (assembly layer), `ProfileRegistry.register/remove/exists` (mutable Map), `AgentScheduler.registerProfile` + `scheduledTasks` handle table, `ContextLoader` injecting the Agent body. Tests — `AgentLoaderTest`, `DeriveProfileTest`, `AgentScanRegisterTest`, `ProfileRegistryRuntimeTest`, `AgentSchedulerRegisterTest`, `ProgressiveDisclosureTest`. Files — the example `daily-reconcile/` directory (AGENT.md + scripts/reconcile.py + skills/report-format.md + REFERENCE.md), produced by spec-kit. Validation — missing required `AGENT.md` fields error by name; tools referencing unregistered capabilities warn.
- Key claims: With this, "define a self-running Agent on the base" is mechanically complete, but the entry point is still "log into the server and drop files" — lesson 30 packages it as `POST /api/v1/agents` plus one-sentence generation and upgrades the admin from view-only to manage.
- Learner-relevant: Completion state and the bridge into lesson 30.

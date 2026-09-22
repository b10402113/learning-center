---
source: 第31节：天气、科技日报、GitHub 日报 Agent 开发与演示
source_type: pdf
source_lines: 489
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第31节：天气、科技日报、GitHub 日报 Agent 开发与演示

## Overview (L1)

- 这节要交付什么 — the whole phase-one acceptance: three real business Agents (daily weather, daily tech digest, daily GitHub trending) that run themselves on schedule, plus a tagged deployable version; the three demos each exercise a different directory richness (bare AGENT.md → + sub-instruction → + script).
- Demo 一-每日天气 — bare AGENT.md, created via API/admin, uses http_get + notify + schedule + Sandbox whitelist; demonstrates "one AGENT.md defines a self-running Agent".
- Demo 二-每日科技日报 — directory with a sub-instruction read on demand via `read_file`, news via http_get or an MCP server, with a memory-seeded preference influencing output; demonstrates progressive disclosure inside one Agent.
- Demo 三-每日-GitHub-日报 — directory with a bundled script run via `shell`, fetching deterministic GitHub data, with a persona about the script trust boundary; demonstrates deterministic scripting + LLM composition.
- 发布打包与验收 — `mvn clean verify`, fat JAR, `git tag v0.1.0`, and a 30-minute clean-machine README quick-start as the operability acceptance.

## Sections (L2)

### 一-这节要交付什么

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#一-这节要交付什么]]`
- Summary: One sentence: three self-scheduling Agents + a tagged deployable version. The three demos are deliberately chosen to press every prior capability and to showcase three directory richness levels: Demo 1 daily weather (08:00 weather + outfit advice pushed) — bare AGENT.md, built via lesson 30's API/admin, exercises Provider + ReAct + built-in HTTP + Sandbox + scheduler + Notify; Demo 2 daily tech digest (09:00 tech news pushed) — AGENT.md + `skills/*.md`, hand-written directory, exercises directory sub-instructions (`read_file` on demand) + MCP + Memory; Demo 3 daily GitHub trending (09:30 today/month/AI trending summarized and pushed) — AGENT.md + `scripts/*.py`, hand-written directory, exercises bundled script (`shell` run) + Sandbox trust boundary + Memory.
- Key claims: Each proves one thing — weather proves "one AGENT.md defines a self-running Agent", the digest proves "directory sub-instructions read on demand via `read_file`", GitHub proves "directory scripts run via `shell` for deterministic data"; collectively they are the full acceptance of lesson 29's "one directory = one Agent".
- Learner-relevant: The demo matrix that maps every phase-one capability to a concrete artifact.

### 二-Demo-一-每日天气-光杆-AGENT.md

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#二-Demo-一-每日天气-光杆-AGENT.md]]`
- Summary: Step 1 define: a single AGENT.md suffices. Create in the admin "新建 Agent" form or `POST /api/v1/agents`, producing `.oryxos/agents/weather-daily/AGENT.md` with name `weather-daily`, provider deepseek/deepseek-chat, `tools: [http_get, notify]` (least privilege — it doesn't read sub-instructions or run scripts, so no `read_file`/`shell`), notify_channels via `${TEAM_WEBHOOK_URL}`, and `schedules: {cron: "0 0 8 * * *", zone: Asia/Shanghai, message: 到点了，按你的说明执行。}`; the body tells it to `http_get` `https://api.open-meteo.com/v1/forecast?latitude=39.9&longitude=116.4&current=temperature_2m,precipitation,wind_speed_10m`, give outfit advice, then `notify`. Three environment gates before running (else idle): (1) `export DEEPSEEK_API_KEY` (since `OpenAiAutoConfiguration` is excluded); (2) whitelist `http.allowed_domains` must include `api.open-meteo.com` and the team webhook domain (feishu `*.feishu.cn` / WeCom `qyapi.weixin.qq.com`); (3) webhook reachable. Step 2 debug: push-then-clock — `oryxos chat --profile weather-daily` or `POST /agents/weather-daily/invoke` first (same chain as clock-push, per lesson 25), exposing whitelist blocks and vague bodies that make the model not call tools. Step 3 wait for the real clock push and reconcile: cron fires → prompt injects body → `http_get` past Sandbox (tool_invocations #1) → LLM generates advice (two `llm_calls`) → `notify` past whitelist (tool_invocations #2, group receives it).
- Key claims: The weather source is deliberately open-meteo (free, no key, JSON) to avoid demo-time surprises; acceptance hard metrics: nobody triggers it, both external calls are whitelisted and audited, two `llm_calls`, `GET /sessions/{id}` shows the whole auto-triggered dialogue, the group received the message.
- Learner-relevant: The complete lifecycle of a minimal scheduled Agent and the environment gates that must pass first.

### 三-Demo-二-每日科技日报-目录带子指令

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#三-Demo-二-每日科技日报-目录带子指令]]`
- Summary: The focus is a sub-instruction loaded on demand: put the long "组稿排版规范" into the Agent's `skills/` and have the body only say "read it when composing", read via `read_file`. Step 1 get the news capability — two paths: (Path 1, default) use built-in `http_get` against a key-free, JSON, stable news source and let the LLM pick/recompose (add the domain to the whitelist; no external process, demo命运 in your hands); (Path 2, MCP practice) declare a news MCP server in `.oryxos/mcp_servers.yaml`, verify `oryxos tool list` shows its tools — write and validate a minimal `news-mcp` (a few dozen lines) beforehand, don't gamble on a community server, since an unreachable MCP is WARN-skipped (lesson 28) and the demo goes mute. Step 2 seed a preference into memory: tell any Agent "以后帮我关注科技新闻的话，我更关注 AI 和芯片方向", the model calls `save_memory` (lesson 22). Step 3 write the directory `.oryxos/agents/daily-tech-digest/` — AGENT.md with `tools: [http_get, read_file, notify]` (read_file to read skills sub-instruction), `schedules: {cron: "0 0 9 * * *", ...}`, and a body: fetch news → read `skills/digest-format.md` for the layout spec → prioritize memory preference → notify. `skills/digest-format.md` holds the spec (pick 5-8 important items, one line each title + comment + link, sort by importance with preference first, opening overview, no closing slogan). Step 4 debug and reconcile, with two extra reconciliation points versus weather: the Agent really used `read_file` on `skills/digest-format.md` (tool_invocations evidence of on-demand sub-instruction loading), and the digest really ranks AI/chip items first — memory effective across days.
- Key claims: Zero Java code — one directory, two markdown files; the long spec doesn't occupy the system prompt until the composing step; sandbox prerequisite `file.allowed_paths` covers `.oryxos/agents/daily-tech-digest/`; acceptance hard metrics: zero Java, MCP tool registered, digest reflects memory preference.
- Learner-relevant: Progressive disclosure inside one Agent and the memory-preference cross-day payoff.

### 四-Demo-三-每日-GitHub-日报-目录带脚本

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#四-Demo-三-每日-GitHub-日报-目录带脚本]]`
- Summary: The focus is a bundled script: make "fetch GitHub trending" deterministic work into a script inside the Agent directory, run by the Agent via `shell`. `.oryxos/agents/github-daily/` — AGENT.md with `tools: [shell, notify]`, `schedules: {cron: "0 30 9 * * *", ...}`, and a body: run `python scripts/github_trending.py` returning JSON (`today`, `month`, `ai`, each item name/stars/desc/url) → compose three sections (today top5 / month top5 / month AI) → prioritize memory preferences in the AI section → notify. `scripts/github_trending.py` uses the GitHub Search API (`https://api.github.com/search/repositories`) with `created:>date` + stars sort to approximate trending (no official trending API), unauthenticated limit 10/min, zero external deps. The trust boundary must be stated to the audience (lesson 29 §2.4): the script makes its own network requests to api.github.com, bypassing `http_get`'s domain whitelist (which only governs the built-in tool, not python subprocess networks) — so installing `github-daily` = trusting its author; core-phase sandbox does only two whitelists (`shell.allowed_commands` allows `python`, `file.allowed_paths` restricts to the Agent's `scripts/`). Sandbox prerequisites: allow `python`, add `api.github.com` to `http.allowed_domains` (for audit/future closure), cover `.oryxos/agents/github-daily/`. Step 2 seed a preference ("我更关注 Agent 框架和推理引擎方向的开源项目"). Step 3 debug push-then-clock and reconcile: script ran (tool_invocations has the shell/py invocation), code doesn't enter context but its JSON does, memory preference ranks Agent-framework/reasoning projects first, and the LLM composes while OryxOS parses no steps.
- Key claims: Deterministic data is script-fetched, composition is LLM-done; the trust moves from the base to the Agent author, which is key to being honest about an Agent OS.
- Learner-relevant: Bundled-script Agents, the subprocess-network trust boundary, and the deterministic-data/LLM-composition split.

### 五-发布-打包-第一个版本

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#五-发布-打包-第一个版本]]`
- Summary: Once all three Agents run stably, turn it into a deliverable: `mvn clean verify`, `mvn clean package` (fat JAR), `git tag v0.1.0 && git push --tags`. Release artifacts: one `oryxos.jar` (9 modules + all dependencies in one file, `java -jar` runs with no external service, single-binary deployment — the tech-plan chapter-1 promise) and one workspace `.oryxos/` (generated by `oryxos init`: profiles + skills as two Agent definitions, `memory/MEMORY.md`, `mcp_servers.yaml`, `oryxos.db`, Bootstrap — all text and SQLite, backupable and git-trackable). Release isn't just packaging — it must pass "operability acceptance": on a clean machine (or after deleting local `.oryxos/`), follow the README from zero — `java -jar oryxos.jar init`, set API key env var, configure whitelists and webhook, drop the three Agent directories, watch them run. A newcomer must finish in 30 minutes for the version to ship; any stuck step means missing docs, not missing code.
- Key claims: The operability acceptance (newbie 30-minute from-zero-to-two-Agents-working) is the version-release bar.
- Learner-relevant: The deployability standard and the single-JAR + workspace release model.

### 六-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#六-做完怎么验]]`
- Summary: Demo 1 green: two consecutive days of 08:00 auto-pushed outfit advice, audit reconciled exactly, push-then-clock behavior consistent, bare AGENT.md with no sub-instruction/script. Demo 2 green (sub-instruction): two days of 09:00 auto-pushed digest, tool_invocations contains `read_file` on `skills/digest-format.md`, content reflects memory preference, zero Java. Demo 3 green (script): two days of 09:30 auto-pushed GitHub digest, tool_invocations contains the shell/py invocation, today/month/AI sections complete with AI reflecting memory preference, script JSON entered context but script code did not. Three directory forms each demonstrated; dual paths consistent (weather via API vs digest/GitHub via hand-written directories, same output format and behavior); version deliverable (`mvn clean verify` green, fat JAR runs from zero on a clean machine in 30 minutes, v0.1.0 tagged); demo easter egg — live-edit `github-daily/AGENT.md`'s body (e.g. "AI 段每条加一句一句话点评"), no restart, next trigger picks up the new version.
- Key claims: Phase one's target artifacts are all delivered: a working Agent OS base, a mechanism to define Agents (one directory = one Agent), three real self-working Agents covering the three directory forms, and a tagged version.
- Learner-relevant: The final acceptance checklist and the live "declarative + immediate effect" demonstration.

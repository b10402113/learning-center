---
subject: js-mastery-engineer
status: draft
path: workflow-first
created: 2026-11-07
---

# ROADMAP — js-mastery-engineer

## Goal

把 AI 寫程式的力氣從「許願」換成「工程」：先建立 agent 與上下文的心智模型，再逐個學會 JSM 的九個 skill，最後能在新專案與別人的 legacy codebase 上跑完整迴圈。

## Learning path

**Workflow-first（流程優先）**：以九個 skill 為骨架，先看流程為什麼存在，再補齊流程背後假設的心智模型（agent 迴圈、上下文、四個基本元素），然後逐個 skill 教，最後用同一套流程進真實專案。它優先把「你會實際操作什麼」講清楚，適合工具已裝好、想馬上開始跑的人；概念只在某個 skill 需要時才拉進來。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 為什麼是流程

1. **[AI 寫程式為什麼會崩](nodes/why-ai-coding-falls-apart.md)**
   - Goal: 能說出 agent 失敗的兩個根因，並用「人是架構師、agent 是引擎」取代許願式提示。
2. **[同一支 App，兩種建法](nodes/one-app-two-builds.md)**
   - Goal: 能從 vibe build 的 40 秒／35 美分與 workflow build 的免費快取，說明「決定有沒有被做」比程式碼寫得好不好更決定成敗。

### Tier 2 — 流程背後的心智模型

3. **[Agent 迴圈：它怎麼讀你的程式庫](nodes/the-agent-loop.md)**
   - Goal: 能用 read → decide → act → observe 解釋 agent 行為，並說明它靠 grep/glob/read 現查、沒有索引。
4. **[上下文工程](nodes/context-engineering.md)**
   - Goal: 能區分 always-on／on-demand／reference 三種 context，說明視窗、context rot、token 成本與 clear/compact 判準，並寫出小而準的 AGENTS.md。
5. **[四個基本元素：Tools、MCP、Subagents 與 Skills](nodes/four-primitives-and-skills.md)**
   - Goal: 能用四個基本元素對照任何新工具，判斷何時該用 MCP／subagent，並把重複的紀律寫成一個 SKILL.md。

### Tier 3 — 流程本身

6. **[安裝 JSM Skills 與九個入口](nodes/install-the-skills-system.md)**
   - Goal: 能安裝九個 skill、說出每個 skill 負責哪一階段，並依專案類型選對入口。

### Tier 4 — 逐個 skill

7. **[/scope：先挑戰想法，再寫程式](nodes/scope-before-code.md)**
   - Goal: 能用 `/scope` 把一句話想法逼成有 MVP 邊界、build 順序與 workflow tier 的 `docs/scope/scope.md`。
8. **[/architect：一次一個承載決策](nodes/architect-the-spec.md)**
   - Goal: 能讓 `/architect` 每次只解一個承載決策，並寫出 `index.md` 與 `rationale.md` 的 spec。
9. **[/develop 與 /audit：照 spec 建，寫出 AGENTS.md](nodes/develop-and-audit.md)**
   - Goal: 能讓 `/develop` 依 spec 建、遇到未決策就停，並用 `/audit` 產出 agent 必讀的 AGENTS.md 與命令清單。
10. **[兩種證明與第二顆腦袋](nodes/two-kinds-of-proof.md)**
    - Goal: 能依序用 `/check verify`、`/test`、`/check review`、`/document` 完成四層驗證。

### Tier 5 — 修復與真實專案

11. **[修復：三種壞法、/debug 與遺留程式碼](nodes/debug-sync-and-legacy.md)**
    - Goal: 能先分類三種壞法，再用 `/debug` 的單一假設迴圈修復，並在 legacy codebase 上做最小安全修改。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

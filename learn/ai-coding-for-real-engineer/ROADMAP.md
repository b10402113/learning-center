---
subject: ai-coding-for-real-engineer
status: draft
created: 2026-08-18
---

# ROADMAP — ai-coding-for-real-engineer

## Goal
學會用 AI coding agent（Claude Code 或任何 CLI harness）把功能「離線交付」（AFK）：把規格/PRD 定清楚，把大塊實作交給 agent 放手執行，人走開，回來時拿到可以跑、有測試、已 commit 的程式碼。學會整套七階段流程：grill（訪談）→ research → prototype → PRD + plan → issues → implement（HITL 或 AFK）→ review。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 認識 agent 與工具（mental model + 工具）
1. **[[learn/ai-coding-for-real-engineer/nodes/seven-phase-process|seven-phase-process：七階段流程地圖]]**
   - Goal: 說出七階段流程（grill→research→prototype→PRD/plan→issues→implement→review）各階段做什麼、為何這樣排，並選好自己用的 model/subscription。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson1.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson2.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson5.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson7.en.srt]]

2. **[[learn/ai-coding-for-real-engineer/nodes/playground-setup|playground-setup：把 playground 跑起來]]**
   - Goal: 在本機跑起課程的 20k 行 TS/React playground：pnpm install/seed/dev、理解 SQLite + Drizzle migration 怎麼與 code 同步、用 reset/cherry-pick/pull 控制 git 狀態。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson3.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson4.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson6.en.srt]]

3. **[[learn/ai-coding-for-real-engineer/nodes/claude-code-basics|claude-code-basics：Claude Code 基本操作]]**
   - Goal: 在 VS Code 終端驅動 Claude Code：slash commands（`/usage` `/context` `/clear`）、`@` 檔參照、prompt stash、貼圖，建立 context 意識。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson8.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson9.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson10.en.srt]]

4. **[[learn/ai-coding-for-real-engineer/nodes/agent-session-power|agent-session-power：IDE 整合、bash 與權限]]**
   - Goal: 用 IDE 整合 review diff、用 rewind/resume 回放 session、用 bash 模式控制 agent 看得到的輸出、用 permissions 設定管住風險。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson11.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson12.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson13.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson14.en.srt]]

5. **[[learn/ai-coding-for-real-engineer/nodes/llm-constraints|llm-constraints：LLM 的天性決定一切]]**
   - Goal: 解釋 context window 二次方擴張、smart/dumb zone、statelessness、非決定性，並用這些約束預測 agent 什麼時候會出錯。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson15.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson21.en.srt]]

6. **[[learn/ai-coding-for-real-engineer/nodes/context-management|context-management：context 就是貨幣]]**
   - Goal: 用 sub-agent、status-line 監控、compact/clear、handoff 四招把 context 保持在 smart zone。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson16.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson22.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson26.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson27.en.srt]]

7. **[[learn/ai-coding-for-real-engineer/nodes/exploration|exploration：探索是基本功]]**
   - Goal: 在陌生 repo 開新 session 時，用「Explore」關鍵字觸發深層 sub-agent 探索，把程式碼轉成自己的 mental model。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson17.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson18.en.srt]]

### Tier 2 — 引導 agent（第一支功能 + steering）
8. **[[learn/ai-coding-for-real-engineer/nodes/first-feature-build|first-feature-build：用 plan mode 交付第一個功能]]**
   - Goal: 用 plan mode 交付第一個完整功能（課程 review 系統），觀察 context paranoia、sub-agent、commit 流程。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson19.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson20.en.srt]]

9. **[[learn/ai-coding-for-real-engineer/nodes/project-memory|project-memory：CLAUDE.md 專案記憶]]**
   - Goal: 寫/修 CLAUDE.md 讓 agent 跨 session 記住規矩；理解它 global、燒 token、可能被忽略的特性，並懂得審查自動記憶與用全局偏好壓制不需要的行為。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson28.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson29.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson30.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson35.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson46.en.srt]]

10. **[[learn/ai-coding-for-real-engineer/nodes/progressive-disclosure-skills|progressive-disclosure-skills：Progressive Disclosure 與 Agent Skills]]**
    - Goal: 把肥胖的 CLAUDE.md 重構成 skill + reference files 的 progressive disclosure 結構，並寫出自己的 skill。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson31.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson32.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson33.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson34.en.srt]]

11. **[[learn/ai-coding-for-real-engineer/nodes/interview-driven-design|interview-driven-design：用訪談取代 plan mode]]**
    - Goal: 用 GrillMe 一題一題把模糊需求釘成 shared design concept，再直接進實作，不靠 plan mode 的牆式計畫。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson23.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson24.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson25.en.srt]]

### Tier 3 — 大計畫（destination 與 journey）
12. **[[learn/ai-coding-for-real-engineer/nodes/grill-to-prd|grill-to-prd：兩文件模型與 PRD]]**
    - Goal: 對放不進單一 context 的任務，用 grill→to-PRD 產出 destination（PRD）+ journey（plan）兩份文件。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson36.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson37.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson38.en.srt]]

13. **[[learn/ai-coding-for-real-engineer/nodes/naive-plan-to-tracer-bullets|naive-plan-to-tracer-bullets：從 naive plan 到 Tracer Bullets]]**
    - Goal: 認出 agent 天真計畫的三個失敗訊號（水平切層、過度指定、失去 traceability），並改用垂直切片（tracer bullets）。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson39.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson40.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson41.en.srt]]

14. **[[learn/ai-coding-for-real-engineer/nodes/prd-to-plan-skill|prd-to-plan-skill：只寫耐久決策的計畫]]**
    - Goal: 用 PRD-to-plan skill 產出引用 user story、只含 durable decisions 的垂直切片計畫。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson42.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson43.en.srt]]

15. **[[learn/ai-coding-for-real-engineer/nodes/phased-implementation|phased-implementation：逐階段實作]]**
    - Goal: 用「do phase N + PRD + 整個 plan」逐階段放手實作，每階段 clear context、commit，保持 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson44.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson45.en.srt]]

### Tier 4 — 品質與回饋迴圈
16. **[[learn/ai-coding-for-real-engineer/nodes/code-is-not-cheap|code-is-not-cheap：code 不 cheap]]**
    - Goal: 用 easy-to-change 與 entropy 論證，說明為何 agent 時代程式品質比人寫時更關鍵，而 feedback loop 是解藥。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson49.en.srt]]

17. **[[learn/ai-coding-for-real-engineer/nodes/feedback-loops-enforcement|feedback-loops-enforcement：feedback loop 與 do-work]]**
    - Goal: 寫出 do-work skill（plan→implement→validate→commit），跑它交付一個功能，再用 pre-commit hooks 讓 typecheck/test 每次 commit 前強制執行。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson50.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson51.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson52.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson53.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson54.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson55.en.srt]]

18. **[[learn/ai-coding-for-real-engineer/nodes/tdd-red-green-refactor|tdd-red-green-refactor：Red-Green-Refactor]]**
    - Goal: 把 TDD 織進 do-work skill，用 failing-test-first 逼 agent 寫出可測試、可變動的程式碼。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson56.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson57.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson58.en.srt]]

19. **[[learn/ai-coding-for-real-engineer/nodes/strategic-takeaways|strategic-takeaways：agent 時代的策略課]]**
    - Goal: 用 tactical vs strategic、HITL vs AFK、SDLC 崩壞等判斷，決定哪些事該自己留著、哪些放手給 agent。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson47.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson48.en.srt]]

### Tier 5 — AFK agents（放手實作）
20. **[[learn/ai-coding-for-real-engineer/nodes/afk-concept-interactive|afk-concept-interactive：AFK agents 與互動模式]]**
    - Goal: 說明「do phase N 是 for loop」，並用 Sandcastle interactive 模式 + prompt.md，在可觀察環境下跑第一次單一任務。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson59.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson60.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson61.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson62.en.srt]]

21. **[[learn/ai-coding-for-real-engineer/nodes/afk-loop-sandbox|afk-loop-sandbox：Sandbox 與 AFK loop]]**
    - Goal: 用 Docker/Podman sandbox 隔離 agent（避開 YOLO 風險），跑 main.ts 的 maxIterations + completion signal 迴圈。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson63.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson64.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson65.en.srt]]

22. **[[learn/ai-coding-for-real-engineer/nodes/issue-tracker-agent|issue-tracker-agent：issue 佇列驅動的 agent]]**
    - Goal: 把 GitHub issue 變成 agent 的任務佇列：gh CLI + 最小權限 PAT、task selection prompt、修完自動 close/comment。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson66.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson67.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson68.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson69.en.srt]]

23. **[[learn/ai-coding-for-real-engineer/nodes/kanban-prd-issues|kanban-prd-issues：Kanban 與 PRD→issues]]**
    - Goal: 用 PRD-to-issues skill 把 PRD 切成帶 dependency 的垂直切片 issues，標出 HITL/AFK，並留下 QA checklist issue 收尾。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson70.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson71.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson72.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson73.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson74.en.srt]]

24. **[[learn/ai-coding-for-real-engineer/nodes/research-phase|research-phase：research 階段]]**
    - Goal: 在 loop 前用 HITL research 把外部文件/決策快取成 research.md，省 token、保 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson75.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson76.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson77.en.srt]]

25. **[[learn/ai-coding-for-real-engineer/nodes/prototyping-phase|prototyping-phase：prototype 先動手]]**
    - Goal: 對不確定的設計先做 throwaway prototype 沖出 unknown unknowns，把 taste 先灌進去，再讓 AFK loop 接手。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson78.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson79.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson80.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson81.en.srt]]

### Tier 6 — 架構與收尾
26. **[[learn/ai-coding-for-real-engineer/nodes/deep-modules-architecture|deep-modules-architecture：Deep Modules 架構]]**
    - Goal: 用 Ousterhout 的 deep modules 判斷 agent 好不好用你的 codebase，並用 architecture skill 找摩擦、提出 RFC。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson82.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson83.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson84.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson85.en.srt]]

27. **[[learn/ai-coding-for-real-engineer/nodes/seven-phase-summary|seven-phase-summary：七階段總結與附錄]]**
    - Goal: 複習完整七階段流程，並知道 Greenfield（AX 先於 UX）、Brownfield 與 ADR + glossary 的應用時機。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson86.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson87.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson88.en.srt]]

28. **[[learn/ai-coding-for-real-engineer/nodes/office-hours-wrapup|office-hours-wrapup：答疑精華]]**
    - Goal: 把 GitHub Actions 觸發的 agent、自動 review pipeline、UX/DX/AX 三維 review 等進階想法接回自己的流程。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson89.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson90.en.srt]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

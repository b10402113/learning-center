---
subject: ai-coding-for-real-engineer
status: draft
path: problem-driven
created: 2026-09-02
---

# ROADMAP — ai-coding-for-real-engineer

## Goal
學會用 AI coding agent（Claude Code 或任何 CLI harness）把功能「離線交付」（AFK）：把規格/PRD 定清楚，把大塊實作交給 agent 放手執行，人走開，回來時拿到可以跑、有測試、已 commit 的程式碼。學會整套七階段流程：grill（訪談）→ research → prototype → PRD + plan → issues → implement（HITL 或 AFK）→ review。

## Learning path
**Problem-driven** — 每個 node 從學習者實際會撞到的問題出發，概念和工具作為答案被拉進來。優化方向：記憶和遷移。你學會的是診斷和解決，不是跟步驟。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe ai-coding-for-real-engineer/<node-id>` to measure a node, then `/nodes ai-coding-for-real-engineer/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — "What am I doing and why is it hard?"
1. **[[learn/ai-coding-for-real-engineer/nodes/process-overview|process-overview：七階段流程是什麼、為什麼有效]]**
   - Goal: 說出七階段流程（grill→research→prototype→PRD/plan→issues→implement→review）各階段做什麼、為何這樣排，並選好自己用的 model/subscription。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson1.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson2.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson7.en.srt]]

2. **[[learn/ai-coding-for-real-engineer/nodes/playground-setup|playground-setup：把環境跑起來]]**
   - Goal: 在本機跑起課程的 20k 行 TS/React playground：pnpm install/seed/dev、理解 SQLite + Drizzle migration 怎麼與 code 同步、用 reset/cherry-pick/pull 控制 git 狀態。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson3.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson4.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson6.en.srt]]

3. **[[learn/ai-coding-for-real-engineer/nodes/agent-basics|agent-basics：怎麼開車]]**
   - Goal: 在 VS Code 終端驅動 Claude Code：slash commands（`/usage` `/context` `/clear`）、`@` 檔參照、prompt stash、貼圖，建立 context 意識。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson8.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson9.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson10.en.srt]]

4. **[[learn/ai-coding-for-real-engineer/nodes/agent-control|agent-control：review diff、bash、風險控管]]**
   - Goal: 用 IDE 整合 review diff、用 rewind/resume 回放 session、用 bash 模式控制 agent 看得到的輸出、用 permissions 設定管住風險。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson11.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson12.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson13.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson14.en.srt]]

5. **[[learn/ai-coding-for-real-engineer/nodes/why-agent-fails|why-agent-fails：agent 為什麼變笨]]**
   - Goal: 解釋 context window 二次方擴張、smart/dumb zone、statelessness、非決定性，並用這些約束預測 agent 什麼時候會出錯。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson15.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson21.en.srt]]

### Tier 2 — "How do I keep the agent useful?"
6. **[[learn/ai-coding-for-real-engineer/nodes/context-economy|context-economy：怎麼把 context 當貨幣花]]**
   - Goal: 用 sub-agent、status-line 監控、compact/clear、handoff 四招把 context 保持在 smart zone。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson16.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson22.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson26.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson27.en.srt]]

7. **[[learn/ai-coding-for-real-engineer/nodes/exploration|exploration：怎麼探索陌生 codebase]]**
   - Goal: 在陌生 repo 開新 session 時，用「Explore」關鍵字觸發深層 sub-agent 探索，把程式碼轉成自己的 mental model。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson17.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson18.en.srt]]

8. **[[learn/ai-coding-for-real-engineer/nodes/interview-not-plan|interview-not-plan：訪談取代 plan mode]]**
   - Goal: 用 GrillMe 一題一題把模糊需求釘成 shared design concept，再直接進實作，不靠 plan mode 的牆式計畫。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson19.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson20.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson23.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson24.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson25.en.srt]]

9. **[[learn/ai-coding-for-real-engineer/nodes/project-memory|project-memory：CLAUDE.md 專案記憶]]**
   - Goal: 寫/修 CLAUDE.md 讓 agent 跨 session 記住規矩；理解它 global、燒 token、可能被忽略的特性，並懂得審查自動記憶與用全局偏好壓制不需要的行為。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/lesson28.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson29.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson30.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson35.en.srt]]
     - [[sources/ai-coding-for-real-engineer/lesson46.en.srt]]

10. **[[learn/ai-coding-for-real-engineer/nodes/progressive-disclosure|progressive-disclosure：指令太長怎麼辦]]**
    - Goal: 把肥胖的 CLAUDE.md 重構成 skill + reference files 的 progressive disclosure 結構，並寫出自己的 skill。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson31.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson32.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson33.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson34.en.srt]]

### Tier 3 — "How do I hand off a big task?"
11. **[[learn/ai-coding-for-real-engineer/nodes/two-documents|two-documents：超出一個 context window 怎麼辦]]**
    - Goal: 對放不進單一 context 的任務，用 grill→to-PRD 產出 destination（PRD）+ journey（plan）兩份文件。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson36.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson37.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson38.en.srt]]

12. **[[learn/ai-coding-for-real-engineer/nodes/writing-prd|writing-prd：寫出抓住 taste 的 PRD]]**
    - Goal: 用 GrillMe + to-PRD 把開放式需求轉成帶 user stories 的 PRD，包含 problem statement、implementation decisions、testing decisions、out-of-scope。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson37.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson38.en.srt]]

13. **[[learn/ai-coding-for-real-engineer/nodes/naive-plan-failure|naive-plan-failure：為什麼 agent 的計畫會失敗]]**
    - Goal: 認出 agent 天真計畫的三個失敗訊號（水平切層、過度指定、失去 traceability），並理解為什麼需要另一種切法。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson39.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson40.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson41.en.srt]]

14. **[[learn/ai-coding-for-real-engineer/nodes/tracer-bullets|tracer-bullets：垂直切片的力量]]**
    - Goal: 用 PRD-to-plan skill 產出引用 user story、只含 durable decisions 的垂直切片計畫。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson41.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson42.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson43.en.srt]]

15. **[[learn/ai-coding-for-real-engineer/nodes/phased-execution|phased-execution：逐階段執行不翻車]]**
    - Goal: 用「do phase N + PRD + 整個 plan」逐階段放手實作，每階段 clear context、commit，保持 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson44.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson45.en.srt]]

### Tier 4 — "How do I trust what the agent builds?"
16. **[[learn/ai-coding-for-real-engineer/nodes/code-not-cheap|code-not-cheap：code 不 cheap]]**
    - Goal: 用 easy-to-change 與 entropy 論證，說明為何 agent 時代程式品質比人寫時更關鍵，而 feedback loop 是解藥。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson49.en.srt]]

17. **[[learn/ai-coding-for-real-engineer/nodes/feedback-loops|feedback-loops：強制品質的迴圈]]**
    - Goal: 寫出 do-work skill（plan→implement→validate→commit），跑它交付一個功能，再用 pre-commit hooks 讓 typecheck/test 每次 commit 前強制執行。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson50.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson51.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson52.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson53.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson54.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson55.en.srt]]

18. **[[learn/ai-coding-for-real-engineer/nodes/tdd-agents|tdd-agents：紅綠重構]]**
    - Goal: 把 TDD 織進 do-work skill，用 failing-test-first 逼 agent 寫出可測試、可變動的程式碼。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson56.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson57.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson58.en.srt]]

19. **[[learn/ai-coding-for-real-engineer/nodes/strategy-tactics|strategy-tactics：什麼留著、什麼放手]]**
    - Goal: 用 tactical vs strategic、HITL vs AFK、SDLC 崩壞等判斷，決定哪些事該自己留著、哪些放手給 agent。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson47.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson48.en.srt]]

### Tier 5 — "How do I let the agent run without me?"
20. **[[learn/ai-coding-for-real-engineer/nodes/afk-interactive|afk-interactive：互動式 AFK]]**
    - Goal: 說明「do phase N 是 for loop」，並用 Sandcastle interactive 模式 + prompt.md，在可觀察環境下跑第一次單一任務。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson59.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson60.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson61.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson62.en.srt]]

21. **[[learn/ai-coding-for-real-engineer/nodes/sandboxing|sandboxing：安全的沙盒]]**
    - Goal: 用 Docker/Podman sandbox 隔離 agent（避開 YOLO 風險）。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson63.en.srt]]

22. **[[learn/ai-coding-for-real-engineer/nodes/afk-loop|afk-loop：自動化迴圈]]**
    - Goal: 用 main.ts 的 maxIterations + completion signal 迴圈，跑出完整的多階段實作。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson64.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson65.en.srt]]

23. **[[learn/ai-coding-for-real-engineer/nodes/issue-queue|issue-queue：issue 佇列驅動]]**
    - Goal: 把 GitHub issue 變成 agent 的任務佇列：gh CLI + 最小權限 PAT、task selection prompt、修完自動 close/comment。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson66.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson67.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson68.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson69.en.srt]]

24. **[[learn/ai-coding-for-real-engineer/nodes/kanban-backlog|kanban-backlog：PRD 變成 Kanban]]**
    - Goal: 用 PRD-to-issues skill 把 PRD 切成帶 dependency 的垂直切片 issues，標出 HITL/AFK，並留下 QA checklist issue 收尾。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson70.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson71.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson72.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson73.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson74.en.srt]]

25. **[[learn/ai-coding-for-real-engineer/nodes/research-cache|research-cache：快取昂貴的探索]]**
    - Goal: 在 loop 前用 HITL research 把外部文件/決策快取成 research.md，省 token、保 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson75.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson76.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson77.en.srt]]

26. **[[learn/ai-coding-for-real-engineer/nodes/prototyping|prototyping：先做 prototype]]**
    - Goal: 對不確定的設計先做 throwaway prototype 沖出 unknown unknowns，把 taste 先灌進去，再讓 AFK loop 接手。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson78.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson79.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson80.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson81.en.srt]]

### Tier 6 — "How do I make this sustainable?"
27. **[[learn/ai-coding-for-real-engineer/nodes/deep-modules|deep-modules：讓 codebase 對 agent 友善]]**
    - Goal: 用 Ousterhout 的 deep modules 判斷 agent 好不好用你的 codebase，並用 architecture skill 找摩擦、提出 RFC。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson82.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson83.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson84.en.srt]]

28. **[[learn/ai-coding-for-real-engineer/nodes/prevent-bad-arch|prevent-bad-arch：從源頭避免壞架構]]**
    - Goal: 在 PRD 階段就 sketch major modules、找 deep module 機會，避免 shallow modules 被生出來。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson85.en.srt]]

29. **[[learn/ai-coding-for-real-engineer/nodes/greenfield-ax|greenfield-ax：從零開始的專案]]**
    - Goal: 知道 Greenfield vs Brownfield 的差別，理解 AX（agent experience）先於 UX 的概念，並能用 ADR + glossary 支撐 agent。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson86.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson87.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson88.en.srt]]

30. **[[learn/ai-coding-for-real-engineer/nodes/review-pipeline|review-pipeline：審查 agent 的成果]]**
    - Goal: 建立 automated review pipeline，把 coding standards 編碼進 review agent，並在 PR 級別做 UX/DX/AX 三維審查。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/lesson89.en.srt]]
      - [[sources/ai-coding-for-real-engineer/lesson90.en.srt]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

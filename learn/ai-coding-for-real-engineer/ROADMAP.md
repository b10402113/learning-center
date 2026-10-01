---
subject: ai-coding-for-real-engineer
status: draft # draft → confirmed
path: depth-first
created: 2026-10-01
---

# ROADMAP — ai-coding-for-real-engineer

## Goal

用 **AFK（away-from-keyboard）自走 agent 出貨功能**：把一個沙箱化的 coding agent 接上任務佇列（GitHub issue backlog），讓它無人值守地完成功能與修 bug，人在規劃與審查的閘門做判斷。最終能在自己的 side project 上端到端跑完整套流程，而不只是叫 agent 改零碎小東西。

## Learning path

**Depth-first** — 沿著自走 agent 這條主線一路往下鑽：先能開車並看懂引擎為何過熱（agent 操作 + LLM 限制），再讓 agent 真正有用（context 經濟、記憶、skill），接著處理超出單一 context window 的任務（PRD/plan、垂直切片），補上品質（回饋迴圈、TDD），最後放手（沙箱、issue 佇列、AFK 迴圈），收在為 agent 設計的架構與可持續的流程。其餘教材（流程宣言、團隊、office hours）當支線折進主線。優化方向：最快抵達「一個人跑起自走出貨循環」。適合：目標明確、想邊做邊把觀念拉進來。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe ai-coding-for-real-engineer/<node-id>` to measure a node, then `/nodes ai-coding-for-real-engineer/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 能開車、懂引擎限制

1. **[[learn/ai-coding-for-real-engineer/nodes/process-overview|七階段流程與你自己的流程]]**
   - Goal: 說出七階段流程（grill→research→prototype→PRD/plan→issues→implement→review）各做什麼、為何這樣排，並選好自己的 model 與訂閱層級。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson1.en.srt#lesson1]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson7.en.srt#lesson7]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson8.en.srt#lesson8]]

2. **[[learn/ai-coding-for-real-engineer/nodes/playground-setup|把環境與專案跑起來]]**
   - Goal: 在本機跑起 playground（或自己的專案）：pnpm install/seed/dev、理解 SQLite + Drizzle migration 如何與 code 同步、用 reset/cherry-pick/pull 控制 git 狀態。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson3.en.srt#lesson3]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson4.en.srt#lesson4]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson6.en.srt#lesson6]]

3. **[[learn/ai-coding-for-real-engineer/nodes/agent-basics|開始開車：Claude Code 基本操作]]**
   - Goal: 在 VS Code 終端驅動 Claude Code：slash commands（`/usage` `/context` `/clear`）、`@` 檔參照、prompt stash、貼圖，並建立 context 意識。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson9.en.srt#lesson9]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson10.en.srt#lesson10]]

4. **[[learn/ai-coding-for-real-engineer/nodes/agent-control|控管 agent：diff、rewind、bash、權限]]**
   - Goal: 用 IDE 整合 review diff、用 rewind/resume 回放 session、用 bash 模式控制 agent 看得到的輸出、用 permissions 設定管住風險。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson11.en.srt#lesson11]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson12.en.srt#lesson12]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson13.en.srt#lesson13]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson14.en.srt#lesson14]]

5. **[[learn/ai-coding-for-real-engineer/nodes/why-agent-fails|agent 為什麼會變笨]]**
   - Goal: 解釋 context window 二次方擴張、smart/dumb zone、statelessness、非決定性，並用這些約束預測 agent 什麼時候會出錯。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson15.en.srt#lesson15]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson21.en.srt#lesson21]]

### Tier 2 — 讓 agent 真的有用：context、記憶、技能

6. **[[learn/ai-coding-for-real-engineer/nodes/context-economy|把 context 當貨幣花]]**
   - Goal: 用 sub-agent、status line 監控、compact/clear、handoff 四招把 context 保持在 smart zone。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson16.en.srt#lesson16]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson22.en.srt#lesson22]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson26.en.srt#lesson26]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson27.en.srt#lesson27]]

7. **[[learn/ai-coding-for-real-engineer/nodes/exploration|探索陌生 codebase]]**
   - Goal: 在陌生 repo 開新 session 時，用「Explore」關鍵字觸發深層 sub-agent 探索，把程式碼轉成自己的 mental model。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson17.en.srt#lesson17]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson18.en.srt#lesson18]]

8. **[[learn/ai-coding-for-real-engineer/nodes/interview-not-plan|用訪談取代 plan mode]]**
   - Goal: 用 GrillMe 一題一題把模糊需求釘成 shared design concept，再直接進實作，不靠 plan mode 的牆式計畫。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson19.en.srt#lesson19]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson20.en.srt#lesson20]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson23.en.srt#lesson23]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson24.en.srt#lesson24]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson25.en.srt#lesson25]]

9. **[[learn/ai-coding-for-real-engineer/nodes/project-memory|專案記憶：CLAUDE.md / AGENTS.md]]**
   - Goal: 寫/修 CLAUDE.md 讓 agent 跨 session 記住規矩；理解它 global、燒 token、可能被忽略的特性，並懂得審查自動記憶與用全局偏好壓制不需要的行為。
   - Sources:
     - [[sources/ai-coding-for-real-engineer/20261001/lesson28.en.srt#lesson28]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson29.en.srt#lesson29]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson30.en.srt#lesson30]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson35.en.srt#lesson35]]
     - [[sources/ai-coding-for-real-engineer/20261001/lesson46.en.srt#lesson46]]

10. **[[learn/ai-coding-for-real-engineer/nodes/progressive-disclosure|從肥胖指令到 skill 與 progressive disclosure]]**
    - Goal: 把肥胖的 CLAUDE.md 重構成 skill + reference files 的 progressive disclosure 結構，並寫出自己的 Agent Skill。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson31.en.srt#lesson31]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson32.en.srt#lesson32]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson33.en.srt#lesson33]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson34.en.srt#lesson34]]

### Tier 3 — 任務超過一個 context window：文件與計畫

11. **[[learn/ai-coding-for-real-engineer/nodes/two-documents|兩份文件：PRD 與 plan]]**
    - Goal: 對放不進單一 context 的任務，用 grill→to-PRD 產出 destination（PRD）+ journey（plan）兩份文件。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson36.en.srt#lesson36]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson37.en.srt#lesson37]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson38.en.srt#lesson38]]

12. **[[learn/ai-coding-for-real-engineer/nodes/naive-plan-failure|天真計畫為什麼失敗]]**
    - Goal: 認出 agent 天真計畫的三個失敗訊號（水平切層、過度指定、失去 traceability），並理解為什麼需要另一種切法。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson39.en.srt#lesson39]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson40.en.srt#lesson40]]

13. **[[learn/ai-coding-for-real-engineer/nodes/tracer-bullets|垂直切片：tracer bullets]]**
    - Goal: 用 PRD-to-plan skill 產出引用 user story、只含 durable decisions 的垂直切片計畫。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson41.en.srt#lesson41]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson42.en.srt#lesson42]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson43.en.srt#lesson43]]

14. **[[learn/ai-coding-for-real-engineer/nodes/phased-execution|逐階段放手執行]]**
    - Goal: 用「do phase N + PRD + 整個 plan」逐階段放手實作，每階段 clear context、commit，保持 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson44.en.srt#lesson44]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson45.en.srt#lesson45]]

### Tier 4 — 品質：code 不 cheap，回饋迴圈

15. **[[learn/ai-coding-for-real-engineer/nodes/code-not-cheap|code 不 cheap：品質為何更重要]]**
    - Goal: 用 easy-to-change 與 entropy 論證，說明為何 agent 時代程式品質比人寫時更關鍵，而 feedback loop 是解藥。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson49.en.srt#lesson49]]

16. **[[learn/ai-coding-for-real-engineer/nodes/feedback-loops|回饋迴圈：do-work skill 與 hooks]]**
    - Goal: 寫出 do-work skill（plan→implement→validate→commit），跑它交付一個功能，再用 pre-commit hooks 讓 typecheck/test 每次 commit 前強制執行。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson50.en.srt#lesson50]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson51.en.srt#lesson51]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson52.en.srt#lesson52]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson53.en.srt#lesson53]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson54.en.srt#lesson54]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson55.en.srt#lesson55]]

17. **[[learn/ai-coding-for-real-engineer/nodes/tdd-agents|紅綠重構：把 TDD 織進流程]]**
    - Goal: 把 TDD 織進 do-work skill，用 failing-test-first 逼 agent 寫出可測試、可變動的程式碼。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson56.en.srt#lesson56]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson57.en.srt#lesson57]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson58.en.srt#lesson58]]

18. **[[learn/ai-coding-for-real-engineer/nodes/strategy-tactics|什麼留著、什麼放手]]**
    - Goal: 用 tactical vs strategic、HITL vs AFK、SDLC 崩壞等判斷，決定哪些事該自己留著、哪些放手給 agent。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson47.en.srt#lesson47]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson48.en.srt#lesson48]]

### Tier 5 — 放手：AFK 自走迴圈

19. **[[learn/ai-coding-for-real-engineer/nodes/afk-interactive|互動式 AFK：第一次放手]]**
    - Goal: 說明「do phase N 是 for loop」，並用 Sandcastle interactive 模式 + prompt.md，在可觀察環境下跑第一次單一任務。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson59.en.srt#lesson59]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson60.en.srt#lesson60]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson61.en.srt#lesson61]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson62.en.srt#lesson62]]

20. **[[learn/ai-coding-for-real-engineer/nodes/sandboxing|安全的沙盒]]**
    - Goal: 用 Docker/Podman sandbox 隔離 agent（避開 YOLO 風險）。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson63.en.srt#lesson63]]

21. **[[learn/ai-coding-for-real-engineer/nodes/afk-loop|自動化迴圈：main.ts]]**
    - Goal: 用 main.ts 的 maxIterations + completion signal 迴圈，跑出完整的多階段實作。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson64.en.srt#lesson64]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson65.en.srt#lesson65]]

22. **[[learn/ai-coding-for-real-engineer/nodes/issue-queue|issue 佇列驅動]]**
    - Goal: 把 GitHub issue 變成 agent 的任務佇列：gh CLI + 最小權限 PAT、task selection prompt、修完自動 close/comment。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson66.en.srt#lesson66]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson67.en.srt#lesson67]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson68.en.srt#lesson68]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson69.en.srt#lesson69]]

23. **[[learn/ai-coding-for-real-engineer/nodes/kanban-backlog|PRD 變成 Kanban backlog]]**
    - Goal: 用 PRD-to-issues skill 把 PRD 切成帶 dependency 的垂直切片 issues，標出 HITL/AFK，並留下 QA checklist issue 收尾。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson70.en.srt#lesson70]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson71.en.srt#lesson71]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson72.en.srt#lesson72]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson73.en.srt#lesson73]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson74.en.srt#lesson74]]

24. **[[learn/ai-coding-for-real-engineer/nodes/research-cache|快取昂貴的探索]]**
    - Goal: 在 loop 前用 HITL research 把外部文件/決策快取成 research.md，省 token、保 smart zone。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson75.en.srt#lesson75]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson76.en.srt#lesson76]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson77.en.srt#lesson77]]

25. **[[learn/ai-coding-for-real-engineer/nodes/prototyping|先做 prototype]]**
    - Goal: 對不確定的設計先做 throwaway prototype 沖出 unknown unknowns，把 taste 先灌進去，再讓 AFK loop 接手。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson78.en.srt#lesson78]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson79.en.srt#lesson79]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson80.en.srt#lesson80]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson81.en.srt#lesson81]]

### Tier 6 — 永續：為 agent 設計的架構與流程

26. **[[learn/ai-coding-for-real-engineer/nodes/deep-modules|為 agent 設計的架構]]**
    - Goal: 用 Ousterhout 的 deep modules 判斷 agent 好不好用你的 codebase，並用 architecture skill 找摩擦、提出 RFC，且在規劃階段就預防壞架構。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson82.en.srt#lesson82]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson83.en.srt#lesson83]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson84.en.srt#lesson84]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson85.en.srt#lesson85]]

27. **[[learn/ai-coding-for-real-engineer/nodes/process-loop-greenfield|流程總結與 greenfield]]**
    - Goal: 統整七階段與其複利式的 process-review loop，並處理從空白開始的 greenfield：先定 AX（回饋迴圈、技術、模組形狀、測試）再定 UX，用 ADR 與 context.md glossary 支撐 grill。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson86.en.srt#lesson86]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson87.en.srt#lesson87]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson88.en.srt#lesson88]]

28. **[[learn/ai-coding-for-real-engineer/nodes/team-and-ci|團隊、安全與 CI 自動化]]**
    - Goal: 把單人流程擴到團隊與 CI：DX vs AX 文件、agent 安全與資料外洩、polyrepo、程式碼標準、以及 GitHub Actions + Sandcastle 的 automated pipeline（implement/review 標籤、PRD→issues、merge-conflict、architecture cron）。
    - Sources:
      - [[sources/ai-coding-for-real-engineer/20261001/lesson89.en.srt#lesson89]]
      - [[sources/ai-coding-for-real-engineer/20261001/lesson90.en.srt#lesson90]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

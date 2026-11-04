---
subject: ai-agent-engineer
status: draft
path: course-order
created: 2026-11-03
---

# ROADMAP — ai-agent-engineer

## Goal

在自己的 repo 上，把這門課的七層（model、prompt、context、harness、memory、loop、boundary）逐一補起來，最後在自有機器上跑一個 24/7 的 AI employee：專用 inbox、rootless Docker sandbox、skills 與 hooks、MCP server、共用的第二個大腦、fallback chain、cron bug loop，以及晨間 PR triage。

判準不是「再做一次課程 demo」，而是能指著每一層說出「拿掉它會怎麼壞」，並且真的讓那個 employee 開出一個可 review 的 PR：綠色 CI、有失敗測試先重現、沒有 merge、diff 裡沒有新的網路呼叫或跳過的測試。對 durable execution、sandbox、routines 這三塊，要能從空白說出「狀態在哪、誰負責重跑、邊界畫在哪、排程怎麼 claim」。

## Learning path

**Course-order（照課程模組 0→9）**。這個路徑忠實沿用課程自己的順序：先建立七層地圖與每個零件的失敗長相，再依序走過 harness（模組 2）、verification（模組 3）、review（模組 4）、memory（模組 5）、MCP（模組 6）、loop 與安全（模組 7）、24/7 AI employee（模組 8），最後回到全圖與 judgement／taste（模組 9）。

它最佳化的是「完整走過一次課程、不跳章」，讓每個概念都出現在它原本被設計的位置；代價是前期會先花幾個節點建立地圖與環境，才走到你已經熟悉的主題。適合想要照原課順序補齊、並且接受先打地基的學習者。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes ai-agent-engineer/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 基礎與七層（模組 0–1）

1. **[課程材料與先備](nodes/course-orientation.md)**
   - Goal: 知道四種材料與先備，能用 course kit 把 TicketBay、skills 與 brain 裝到可跑 unit tests。

2. **[The map：七層地圖](nodes/the-map.md)**
   - Goal: 用 model、prompt、context、harness、memory、loop、boundary 七層定位失敗，說出拿掉一層會怎麼壞。

3. **[Model、prompt、context](nodes/model-prompt-context.md)**
   - Goal: 依工作選模型、用四件事寫 prompt、用 select／compress／isolate／offload 管好 context window。

4. **[Harness engineering](nodes/harness-engineering.md)**
   - Goal: 用 tools、permissions、verification、routing 補上模型外的機器，讓一次 run 可靠。

5. **[Memory engineering](nodes/memory-engineering.md)**
   - Goal: 分清 memory 與 context，判斷什麼該進 memory、放哪裡、由誰寫。

6. **[Loop engineering](nodes/loop-engineering.md)**
   - Goal: 用 trigger、goal check、停止機制把多個 session 串成一個不會提早停的 loop。

7. **[Boundary engineering](nodes/boundary-engineering.md)**
   - Goal: 用 box 的 Dockerfile、devcontainer 與 firewall 畫出檔案與網路邊界，並用 trifecta 檢查最壞情況。

### Tier 2 — Harness 實作（模組 2）

8. **[Instruction file 與 skills](nodes/instruction-file-and-skills.md)**
   - Goal: 用兩個測試寫 AGENTS.md，用 description 與 progressive disclosure 寫一個會被觸發的 skill。

9. **[Tools · MCP](nodes/tools-and-mcp.md)**
   - Goal: 選對 Context7、Playwright、Chrome DevTools，並分清楚何時用 skill、CLI 或 MCP。

10. **[Subagents](nodes/subagents.md)**
    - Goal: 知道何時該開子代理、為什麼 few for building, many for reading，以及何時只會變貴。

11. **[Hooks](nodes/hooks.md)**
    - Goal: 用五個 hook 把危險指令、secret、紅燈測試與 session context 變成每次都會執行的 gate。

### Tier 3 — 驗證（模組 3）

12. **[Three ways passing tests can lie](nodes/tests-that-lie.md)**
    - Goal: 說出三種假綠——測試沒驗行為、案例缺漏、整合壞掉——與各自由哪種測試抓。

13. **[Mutation testing 與 property testing](nodes/mutation-and-property.md)**
    - Goal: 用 mutant 抓沒被斷言的行為、用 property 抓缺漏的輸入組合，並知道 equivalent mutant 怎麼處理。

14. **[End-to-end testing](nodes/end-to-end-and-quicke2e.md)**
    - Goal: 用 Playwright、Testcontainers 與 decision LLM 驗證使用者可見行為，並判斷 QuickE2E 的發現是不是真 bug。

15. **[Testing legacy apps](nodes/legacy-testing.md)**
    - Goal: 用 seam、characterization、property 與 mutation 先做安全網，再重構沒有測試的 code。

16. **[The gate](nodes/the-gate.md)**
    - Goal: 用六條 CI lane 與 branch protection 讓每個 PR 被同一套檢查擋住，並補上 agent code 的 guardrail。

### Tier 4 — 審查（模組 4）

17. **[Review engineering](nodes/review-engineering.md)**
    - Goal: 用三個問題決定讀多少、先 grill plan、再用 fresh context 的 adversarial tester 審 diff。

18. **[PR tour + triage](nodes/pr-tour-and-triage.md)**
    - Goal: 用 intent map 決定單一 PR 的閱讀順序，用注意力排序決定整個 queue 先讀哪個。

### Tier 5 — Memory（模組 5）

19. **[The centralized brain](nodes/centralized-brain.md)**
    - Goal: 用 index、inbox、intents、guidelines、decisions、taste、sources 建一個所有 agent 共用的第二大腦。

20. **[Connect every agent、capture 與 lint](nodes/connect-capture-lint.md)**
    - Goal: 把 brain 接到每個 agent，分開 capture 與 triage，並用 lint 修結構漂移、用 superseded 保留決策史。

### Tier 6 — MCP（模組 6）

21. **[Build an MCP server](nodes/build-mcp-server.md)**
    - Goal: 從本機 stdio 到線上 /api/mcp，用每人一把 key、scope、401 與 deep link 把產品動作變成 agent 的工具。

### Tier 7 — Loop 與安全（模組 7）

22. **[The email loop](nodes/email-loop.md)**
    - Goal: 用 routine、bug-triage、測試與人工 review 建一個從客訴信到 PR、永不 merge 的 loop。

23. **[Prompt injection](nodes/prompt-injection.md)**
    - Goal: 把 email 當資料而非指令，用 trifecta 與多層防線擋住注入，並用攻擊信驗證。

### Tier 8 — AI 員工（模組 8）

24. **[Your 24/7 AI employee](nodes/ai-employee.md)**
    - Goal: 在自有機器上裝好 Hermes gateway、rootless Docker sandbox、模型登入與 fallback chain。

25. **[Give it a job](nodes/employee-job.md)**
    - Goal: 把 brain、skills、hooks、MCP、專用 inbox、cron loop、worktree 與晨間 PR triage 組成一份無人值守的工作。

### Tier 9 — 收尾（模組 9）

26. **[The whole map, taste and judgement](nodes/taste-and-judgement.md)**
    - Goal: 把七層對回 AI employee，說出 judgement 與 taste 各決定什麼，以及為什麼只委派打字。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

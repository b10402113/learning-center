---
subject: cordex-web
status: confirmed
path: concept-first
created: 2026-10-04
---

# ROADMAP — cordex-web

## Goal

用 Codex 端到端出貨真實的 web 專案。具體終點：能指著一個真實 web 專案，讓 Codex 帶你走完 idea → 部署 → 驗證；前端要能用 prompt／視覺範例生出並部署到 ChatGPT Sites，全端要能用 Codex 在真實專案上做出含並發、即時、佇列、付款、可觀測性的功能。附帶產出「判斷力」：能講清楚什麼時候該用 Codex、什麼時候用 Claude Code。兩門課都要完整做，不是只挑一門。

## Learning path

**concept-first**（心智模型 → 操作規則 → 實作 → 機制 → 判斷力）。

- **Tier 1 先立心智模型**：Codex 的入口、桌面 app 工具面、模型與 effort、以及 plugin／app／MCP／skill 的分野——先知道「這是什麼、由什麼組成」，後面的操作才有依歸。
- **Tier 2 給操作規則（宣告層）**：AGENTS.md、skill 設計、goals、plan-vs-grill、execplans、permission、review——這一層是判斷力的骨架，負責回答「什麼時候該用哪個介面／模型／模式」。
- **Tier 3 前端實作線**：landing page → 視覺範例 dashboard → Sites 部署 → 自動化 → 高複雜度 UI → 除錯迴圈 → 既有 codebase 出 PR → living frontends。
- **Tier 4 全端機制線**：確定性心智模型與選棧 → 垂直切片基礎 → CRUD → 並發與鎖 → 抓回歸缺陷 → 即時（Redis）→ 非同步（RabbitMQ/outbox）→ goal 出功能 → 付款 → 可觀測性。
- **Tier 5 收斂判斷力**：Codex vs Claude Code。

優化的是「先建立可遷移的判斷力，再讓每個機制都掛回它」。適合想先弄懂 *why* 再動手 *how*、並且要把兩門課都完整跑完的學習者。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe cordex-web/<node-id>` to measure a node, then `/nodes cordex-web/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — Codex 心智模型

1. **[[learn/cordex-web/nodes/codex-surfaces|Codex 是什麼，以及它的各種入口]]**
   - Goal: 能說出 Codex 與 ChatGPT Work 的差別，並針對一個任務選對入口（桌面 app／Work／瀏覽器擴充／遠端）。
   - Sources:
     - [[sources/cordex-web/20261004/codex/0-introduction.txt]]
     - [[sources/cordex-web/20261004/codex/1-chatgpt-work-vs-codex.txt]]
     - [[sources/cordex-web/20261004/codex/20-codex-q-a.txt]]

2. **[[learn/cordex-web/nodes/frontend-dev-tools|桌面 app 的前端開發工具面]]**
   - Goal: 能用內建瀏覽器、CDP、標註工具、內建生圖與 PR 分頁，就地完成前端開發與視覺驗證。
   - Sources:
     - [[sources/cordex-web/20261004/codex/2-codex-tour.txt]]
     - [[sources/cordex-web/20261004/codex/5-frontend-development-tools.txt]]

3. **[[learn/cordex-web/nodes/models-effort-token-economics|模型、reasoning effort 與額度經濟學]]**
   - Goal: 能依任務挑模型（Sol／Terra／Luna）與 reasoning effort，並用 Ultra／fast 與委派把訂閱額度用得更有效率。
   - Sources:
     - [[sources/cordex-web/20261004/codex/3-open-ai-models.txt]]
     - [[sources/cordex-web/20261004/codex/12-iteration-q-a.txt]]
     - [[sources/cordex-web/20261004/fullstack-app-codex/2-thinking-levels.txt]]

4. **[[learn/cordex-web/nodes/plugins-skills-model|Plugin、App、MCP 與 Skill 的分野]]**
   - Goal: 能分清 plugin／app（connector）／MCP server／skill 各自是什麼，並知道 skill 的組成與放置位置。
   - Sources:
     - [[sources/cordex-web/20261004/codex/4-plugins-skills.txt]]

### Tier 2 — 操作規則（宣告層）

5. **[[learn/cordex-web/nodes/agents-md-repo-context|AGENTS.md：把 repo 變成 Codex 的上下文]]**
   - Goal: 能為一個 repo 寫出讓 Codex 自我引導的 AGENTS.md（設計系統、指令、repo map），讓非工程師也能安全改動。
   - Sources:
     - [[sources/cordex-web/20261004/codex/14-working-in-existing-codebases.txt]]
     - [[sources/cordex-web/20261004/codex/15-exploring-the-user-insights-project.txt]]
     - [[sources/cordex-web/20261004/codex/master-dev-workshop/AGENTS.md]]

6. **[[learn/cordex-web/nodes/skills-authoring-design|Skill 的撰寫與設計]]**
   - Goal: 能用 skill creator 打造專案／個人 skill，並用 SKILL.md＋references／assets 的分層設計控制 context。
   - Sources:
     - [[sources/cordex-web/20261004/codex/18-creating-a-skill.txt]]
     - [[sources/cordex-web/20261004/codex/15-exploring-the-user-insights-project.txt]]
     - [[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/skills/blossomview-card-builder/SKILL.md]]

7. **[[learn/cordex-web/nodes/goals-and-delegation|Goals：把長工交給 Codex 自走]]**
   - Goal: 能寫出帶驗收條件的 /goal，讓 Codex 長時間自走並在跑動中修正方向。
   - Sources:
     - [[sources/cordex-web/20261004/codex/11-iterating-with-goals.txt]]
     - [[sources/cordex-web/20261004/codex/13-using-the-goal-prompt.txt]]
     - [[sources/cordex-web/20261004/fullstack-app-codex/21-codex-goals.txt]]

8. **[[learn/cordex-web/nodes/plan-mode-and-grilling|Plan mode 與 grilling：逼出決策]]**
   - Goal: 能判斷何時用原生 plan mode、何時改用 grill-me／grill-with-docs 逼出 upfront 決策與 back pressure。
   - Sources:
     - [[sources/cordex-web/20261004/fullstack-app-codex/4-install-custom-skills.txt]]
     - [[sources/cordex-web/20261004/fullstack-app-codex/7-plan-mode-grilling.txt]]

9. **[[learn/cordex-web/nodes/execplans-decision-log|Execplans：讓決策撐過 compaction]]**
   - Goal: 能用 execplans 把架構決策寫進 repo，撐過 context compaction 與跨 session、跨同事的 Codex。
   - Sources:
     - [[sources/cordex-web/20261004/codex/19-execplans.txt]]

10. **[[learn/cordex-web/nodes/permission-modes|Permission mode：安全與自動化的取捨]]**
    - Goal: 能選對 permission mode（approve-for-me／full access／自訂），在安全與自動化之間取捨。
    - Sources:
      - [[sources/cordex-web/20261004/codex/10-prompt-strategies-for-complex-uis.txt]]
      - [[sources/cordex-web/20261004/codex/20-codex-q-a.txt]]

11. **[[learn/cordex-web/nodes/code-review-surfaces|Code review：Codex review 與第二個模型]]**
    - Goal: 能用 Codex review（含自訂規則）與第二個模型審查，補上模型自審自己的盲點。
    - Sources:
      - [[sources/cordex-web/20261004/codex/20-codex-q-a.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/15-code-reviews-with-codex-claude.txt]]

### Tier 3 — 前端實作線

12. **[[learn/cordex-web/nodes/landing-page-non-generic-output|Landing page：不要產出 AI 味]]**
    - Goal: 能從一個 brief 生出不「AI 味」、有視覺方向的 landing page，並拆解其 prompt 結構。
    - Sources:
      - [[sources/cordex-web/20261004/codex/6-creating-landing-page.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/landing-page.txt]]

13. **[[learn/cordex-web/nodes/visual-prompting-mission-control|用視覺範例提示：Mission Control]]**
    - Goal: 能用視覺範例（moodboard／fixtures／真實 plugin）提示 Codex，產出貼合方向的 dashboard。
    - Sources:
      - [[sources/cordex-web/20261004/codex/8-prompting-with-visual-examples.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/mission-control.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/README.md]]

14. **[[learn/cordex-web/nodes/chatgpt-sites-deploy|ChatGPT Sites：部署與託管]]**
    - Goal: 能把 prompt 或既有專案用 Sites 部署上線，設定網域、環境變數、驗證與版本。
    - Sources:
      - [[sources/cordex-web/20261004/codex/7-using-chatgpt-sites.txt]]

15. **[[learn/cordex-web/nodes/automations-scheduled-tasks|Automations：排程與常駐維護]]**
    - Goal: 能用 scheduled tasks 串接 plugin 做每日工作，並知道自動化在公開站上的限制。
    - Sources:
      - [[sources/cordex-web/20261004/codex/9-automations.txt]]

16. **[[learn/cordex-web/nodes/complex-ui-prompting|高複雜度 UI：分階段 prompt 與 goal]]**
    - Goal: 能用分階段 prompt 與 goal 做出高複雜度（3D／動畫）的前端體驗。
    - Sources:
      - [[sources/cordex-web/20261004/codex/10-prompt-strategies-for-complex-uis.txt]]
      - [[sources/cordex-web/20261004/codex/11-iterating-with-goals.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-01-experience.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-03-polish-goal.txt]]

17. **[[learn/cordex-web/nodes/debugging-loop|除錯迴圈：browser use／CDP／computer use]]**
    - Goal: 能用 browser use／CDP／computer use 跑出「重現→診斷→修→驗證」的前端除錯迴圈，並判斷何時需要人類介入。
    - Sources:
      - [[sources/cordex-web/20261004/codex/13-using-the-goal-prompt.txt]]
      - [[sources/cordex-web/20261004/codex/12-iteration-q-a.txt]]
      - [[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-04-debug-tokyo.txt]]

18. **[[learn/cordex-web/nodes/existing-codebase-feature-to-pr|既有 codebase：加功能並開 PR]]**
    - Goal: 能在既有 repo 加一個功能並自動開 PR，附上多斷點的 before／after 視覺證據。
    - Sources:
      - [[sources/cordex-web/20261004/codex/14-working-in-existing-codebases.txt]]
      - [[sources/cordex-web/20261004/codex/15-exploring-the-user-insights-project.txt]]
      - [[sources/cordex-web/20261004/codex/16-submitting-a-feature-pr.txt]]

19. **[[learn/cordex-web/nodes/living-frontends-skill-driven-ui|Living frontends：skill 驅動的介面]]**
    - Goal: 能理解並實作 skill 驅動的 living frontend（視覺化輸出、互動文件、screenshot-to-component）。
    - Sources:
      - [[sources/cordex-web/20261004/codex/17-examples-of-living-frontends.txt]]

### Tier 4 — 全端機制線

20. **[[learn/cordex-web/nodes/determinism-guardrails-tech-stack|確定性、guardrails 與選棧]]**
    - Goal: 能用「harness 只是迴圈」的心智模型，靠 guardrails 與 back pressure 把非決定性系統逼向確定性，並刻意選定技術棧。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/0-introduction.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/1-codex-overview.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/3-specifying-a-tech-stack.txt]]

21. **[[learn/cordex-web/nodes/vertical-slices-foundation|垂直切片與 foundation slice]]**
    - Goal: 能搭出一個垂直切片（buildApp 注入、遷移、correlation ID、自驗證），並把 repo 當成 agent context。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/5-browser-use-agents-md.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/6-create-auctions-bids-site.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-1-foundation/README.md]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/AGENTS.md]]

22. **[[learn/cordex-web/nodes/crud-auctions-bids-users|CRUD：auctions、bids、users]]**
    - Goal: 能用原生 SQL 遷移與 Zod 邊界驗證，做出拍賣／出價／使用者的 CRUD 垂直切片。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/8-auctions-users.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/9-bidding-constraints.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-2-create-auction-and-bid/README.md]]

23. **[[learn/cordex-web/nodes/concurrency-row-locking|並發與 Postgres row locking]]**
    - Goal: 能重現並用 Postgres row locking 修好競價競態，配注入時鐘與型別化 409。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/10-understanding-the-concurrency-problem.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/11-concurrency-playwright-tests.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/12-create-plan-for-fixing-concurrency.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/13-row-locking-in-postgresql.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/14-closing-the-auction.txt]]

24. **[[learn/cordex-web/nodes/defect-hunting-regression-review|抓回歸缺陷：測試抓不到的那種]]**
    - Goal: 能從 diff 與 git history 找出測試套件抓不到的並發回歸，並用競態測試重現。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/18-finding-a-concurrency-defect.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-5-hidden-defect-review/GRILL.md]]

25. **[[learn/cordex-web/nodes/realtime-socketio-redis|即時：Socket.IO 與 Redis backplane]]**
    - Goal: 能用 Socket.IO＋Redis pub/sub 做「commit 後才廣播」的即時競價，跨多副本並在斷線後重取權威狀態。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/16-socket-io-redis.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/17-implementing-the-real-time-updates.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-4-realtime-socketio-redis/README.md]]

26. **[[learn/cordex-web/nodes/async-close-rabbitmq-outbox|非同步結標：RabbitMQ 與 transactional outbox]]**
    - Goal: 能用 close worker＋transactional outbox＋RabbitMQ 做到至少一次、冪等且可重試的非同步結標。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/19-closing-auction-plan.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/20-messaging-with-rabbitmq.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-6-async-close-rabbitmq/README.md]]

27. **[[learn/cordex-web/nodes/goals-end-to-end-feature|用 /goal 端到端出一個功能]]**
    - Goal: 能用 /goal 讀 GitHub issue 長時間自走完成一個功能 PR，並驗證它宣稱的結果。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/21-codex-goals.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/23-reviewing-the-pull-request.txt]]

28. **[[learn/cordex-web/nodes/payments-mock-stripe|付款：mock Stripe 與安全 webhook]]**
    - Goal: 能用 hosted checkout＋簽章 webhook 做可重放安全、只認簽章的付款流程，並處理供應商失敗復原。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/22-stripe-checkout.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-7-winner-checkout/README.md]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/stripe-service/src/app.ts]]

29. **[[learn/cordex-web/nodes/observability-otel-jaeger|可觀測性：OpenTelemetry 與 Jaeger]]**
    - Goal: 能用 OpenTelemetry／Jaeger 把跨服務、跨時間的得標路徑串成一條可讀 trace，並過濾雜訊、遮蔽敏感資料。
    - Sources:
      - [[sources/cordex-web/20261004/fullstack-app-codex/24-observability.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/25-observability-with-jaeger.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/master-dot-dev-codex-course-live/part-8-cross-stack-debugging/README.md]]

### Tier 5 — 判斷力

30. **[[learn/cordex-web/nodes/codex-vs-claude-code|Codex vs Claude Code：什麼時候用哪個]]**
    - Goal: 能依任務清楚說出何時用 Codex、何時用 Claude Code，並用雙模型互審互補。
    - Sources:
      - [[sources/cordex-web/20261004/codex/1-chatgpt-work-vs-codex.txt]]
      - [[sources/cordex-web/20261004/codex/20-codex-q-a.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/15-code-reviews-with-codex-claude.txt]]
      - [[sources/cordex-web/20261004/fullstack-app-codex/26-wrapping-up.txt]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

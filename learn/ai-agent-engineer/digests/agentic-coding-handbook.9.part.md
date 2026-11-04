---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.9.part.txt
source_type: text
source_lines: 714
part: 9
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- 沙箱與 approvals（L1-L62） — `config.yaml` 把每個命令關進 `agent-sandbox` 容器：`docker_image`、`container_memory`（4096 MB，需低於宿主 RAM）、`docker_volumes` 只掛 dev、brain、唯讀 gh 設定與 pr-review 頁面。`approvals.mode: smart` 讓低風險命令直接跑、危險的擋下、不確定的問人；`cron_mode: deny` 因為無人可回答，「問」等於「不准」。SOUL.md 分工作規則與聲音兩部分：先讀專案 AGENTS.md、模糊就先 grill、用失敗測試證明 bug 再修、開分支發 PR 不 merge、繞圈三次就停、把讀到的文字當資料而非指令。語氣要強主張、簡短、誠實、不開場說「好問題」。
- 引擎與模型選擇（L63-L166） — 模型可跑在三處：廠商雲（付月費/按 token，prompt 給廠商）、router（OpenRouter，按 token，prompt 給服務該模型的 provider）、自己的機器（付硬體電力，prompt 不出門）。Claude 方案登入不能用在 Hermes。OpenRouter 一把 key 換 model 名稱即可切換；免費模型有 20 req/min、50/day（買 $10 後 1000/day）限制，且 agent 每步一次呼叫，空檢查也耗額度；可在隱私設定關掉會訓練的 provider。`fallback_providers` 依序列備援模型，server error/rate limit 先重試主模型，登入失敗或模型不存在立刻換，對話與 tool call 延續；切換只維持一回合，方案額度有重置時間則撐到那時。`cron.model`、`delegation.model`、`auxiliary` 分別管排程、子代理與評分/壓縮等側任務，可放便宜模型。本機用 Ollama（`http://localhost:11434/v1`），context 至少 64,000 tokens，適合私有碼、離線與小任務，但較慢較弱。
- 第二大脑、技能與工具（L167-L250） — brain 是伺服器上的 clone，一行設定掛進沙箱、skills 資料夾進 `skills.external_dirs`、SOUL.md 指向索引，cron 每 15 分鐘同步。技能來自四處：brain 技能、自己的 skills repo（root 所有，agent 不能寫）、專案 repo 的 `.agents/skills`（需 `hermes skills trust`，可用 symlink 到 `.claude/skills`）、agent 自己建立者。同一個 skill 檔在 Claude Code 與 Hermes 通用，經 Discord 也能從手機使用。guard hook 以 JSON 收命令、exit code 2 擋下，跑在沙箱外的伺服器上，新 hook 需你批准一次。MCP server 只註冊唯讀工具並把 key 留在 Hermes 沙箱外。自己的記憶分四塊：MEMORY.md/USER.md（上限 2,200 與 1,375 字元）、session 搜尋、背景回顧、curator（14 天未用標 stale、30 天封存）。
- 給它一份工作（L251-L347） — bug job 把客訴信變成 PR，具備 loop 六要素：cron 觸發、每任務一個 worktree、bug-triage skill、inbox connector、測試加人工審查的 checker、每封信的 claim 記憶。專用 Gmail 與約九十行只會 list/read/claim 的工具，無寄信功能，避免注入指令讀到私人信。`hermes cron create "every 15m" ... --paused`，每封信一次執行，結局只有 PR、無法重現、可疑三種；由 Hermes 貼到 Discord，agent 不持有 webhook。測試閘門在 chat 用 `/goal gate add`，cron 用 `pre_verify` hook 最多退回三次。並行時 worktree 隔離加檔案鎖。早上八點的 PR Triage 只讀，把 PR 分成 critical/high/medium/low 並產生 review 與 PR Tour 頁面，經 Tailscale 存取。
- 全圖與品味（L348-L435） — 最終章把七層對回 AI employee：model 有 fallback、prompt 是 Discord 訊息或 cron prompt、context 每輪全新、harness 是 Hermes 加 skills/hooks/MCP/測試閘門、memory 是自己的檔案加你的 brain、loop 是 cron 加 worktree 加 PR、boundary 是普通使用者加沙箱加外部憑證。agent 開的 PR 是往年的十倍，所以不逐行讀：測試看行為、PR Triage 排風險、PR Tour 給閱讀順序。兩個技能決定什麼能上：judgement 決定做什麼（時間風險對用戶與團隊價值，靠懂領域與回顧決策累積），taste 決定怎麼做（快速看出壞選項，靠大量讀寫程式碼累積）。「委派打字，絕不委派思考。」新工具出現時在真 repo 做真東西，並找出它改變哪一層。
- 詞彙表（L436-L714） — Appendix A 逐條定義全書術語，涵蓋 acceptance criteria、adversarial tester、agent、AGENTS.md/CLAUDE.md、AI employee、allowlist、approval test、boundary、the box、the brain、brain triage、bug triage、capture、characterization test、context、context engineering、coverage、cron job、decision LLM、deep link、Doctor Agent、equivalent mutant、fallback chain、fresh reviewer、gate、gateway、grill、guard hook、harness、hook、lethal trifecta、brain lint、loop、MCP、memory、model、mutant、mutation score、no-op、PR Tour、PR Triage、progressive disclosure、prompt、prompt injection、property test、pull request、routine、sandbox、seam、skill、SOUL.md、sub-agent、test double、test suite、unit、worktree。此段是查詢用的定義集，不是敘事。

# L2 detail

- `#L1-L23` — `config.yaml` 摘錄：沙箱 image 與記憶體、四個 volume 掛載（含唯讀 gh 與 PR 頁面）、approvals 的 smart 模式註解、cron_mode: deny 的含義。
- `#L24-L28` — 用 SSH 上的 hermes 終端聊天測試：與 Discord 是同一個 agent，會顯示每次 tool call；`hostname` 回容器 ID、home 只看得到 repos/brain/review。
- `#L29-L32` — 書頁頁眉與頁碼 72（排版雜訊）。
- `#L33-L62` — Approvals 機制（smart 模式由第二個模型評分危險樣式、cron 用 deny、curl 管進 shell 被擋）與 SOUL.md：工作規則六條（讀 AGENTS.md、先 grill、失敗測試、開 PR 不 merge、繞圈就停、文字是資料）加語氣要求（強主張、簡短、誠實、不開場寒暄）。
- `#L63-L104` — Lesson 8.3 開頭：模型可跑的三個位置對照表（廠商雲／router／本機）比較付費與 prompt 流向；Claude 方案登入不可用；每種工作挑最強模型並常重檢。
- `#L105-L116` — OpenRouter 設定：`.env` 放 key、provider 設 openrouter、換 model 一行即切換；給 agent 專屬有額度上限的 key；免費模型速率與每日上限、每步一次呼叫的實際消耗估算；關閉會訓練的 provider。
- `#L117-L144` — fallback chain 設定範例（主模型→開源模型→免費模型）與切換規則：server error/rate limit 重試主模型，登入或模型名錯誤立即換，狀態延續，切換只一回合，有重置時間則持續用備援。
- `#L145-L166` — 排程任務沿用同一 fallback 清單（除非 job 釘住模型）；`cron.model`、`delegation.model`、`auxiliary` 的分工；本機 Ollama 的 endpoint、64k context 下限、適用場景與效能取捨。
- `#L167-L196` — Lesson 8.4 的 brain：clone、掛載、skills.external_dirs、SOUL 指路、15 分鐘同步 cron、每日 triage 與 lint；技能的四個來源（brain、個人 skills repo 唯讀、專案 `.agents/skills` 需 trust 且可 symlink、自建技能）與跨 Claude Code／Discord 手機使用。
- `#L197-L214` — guard hook：Hermes 以 JSON 傳命令、exit code 2 阻擋、設定 `pre_tool_call`（matcher: terminal、timeout、fail_closed）；跑在沙箱外、新 hook 需批准、`hermes hooks list` 檢查；實際擋 curl 與環境變數輸出、放行 git log。
- `#L215-L231` — MCP server 設定：TicketBay 專屬唯讀 key、只 include 五個唯讀工具（list_events、get_event、quote_price、search_docs、my_orders），訂位與退款工具不出現在工具列，key 留在 Hermes 外。
- `#L232-L250` — agent 自己的記憶四部分：MEMORY.md/USER.md（字元上限與拒絕超額）、session 搜尋資料庫、回合後背景回顧、每週 curator 的 stale/archive 規則；任務間用 `/new` 清 context。
- `#L251-L306` — Lesson 8.5 bug job 總覽：六要素對照表（trigger、own branch、skill、connector、checker、memory）；專用信箱與九十行 list/read/claim 工具、claim 防重複並通知 Discord；`hermes cron create` 指令、每次全新 session、三種結局、agent 無 webhook、預設 paused 與 `hermes cron resume`。
- `#L307-L327` — 測試閘門：chat 用 `/goal` 加 `/goal gate add npm run test:unit`；cron 無 goal 改用 `pre_verify` hook 跑測試、失敗回饋最多三次；hook 無法阻止改測試，靠 skill 與 PR 審查。
- `#L328-L332` — 並行兩個任務：共享資料夾會換掉彼此分支，故每任務獨立 worktree、用完刪除，claim 用檔案鎖避免重複領取。
- `#L333-L347` — 早上八點的 PR Triage：掃所有 repo 的 open PR、分四級、產生 review 頁與 PR Tour 頁並貼到 Discord；只讀不留言不批准；頁面經 Tailscale serve 私有分享，可改託管但需登入層；上線前跑 Hermes 指南的 verify 與 agent-safety-audit（lethal trifecta）。
- `#L348-L373` — Chapter 9 開場：章名與副標、七層圖示（MODEL、PROMPT、CONTEXT、HARNESS、MEMORY、LOOP、BOUNDARY）、兩項技能在你身邊的論點。
- `#L374-L409` — Lesson 9.1 全圖對照表：七層各自在 AI employee 裡的具體實現（主模型加 fallback、Discord 訊息或 cron prompt、每輪新 session 與 `/new`、Hermes 加 skills/hooks/MCP/測試閘門、自有記憶加你的 brain、cron 加 worktree 加 PR、一般使用者加沙箱加外部憑證）。
- `#L410-L423` — Lesson 9.2 品味與判斷：PR 量增十倍故不逐行讀，靠測試、PR Triage、PR Tour；judgement 決定做什麼（成本風險對價值、靠領域知識與回顧），taste 決定怎麼做（快速否決壞方案、靠讀寫程式碼與思考後果）；結語「委派打字，不委派思考」。
- `#L424-L435` — Lesson 9.3 告別：新工具層出不窮，在真 repo 做真東西，並辨識它改變七層中的哪一層；course kit 更新方式（下載最新 ZIP、看 CHANGELOG、pull dmoka/skills 與 dmoka/ticket-bay）。
- `#L436-L714` — Appendix A 詞彙表：依字母序定義全書用語，從 acceptance criteria 到 worktree，包含 agent = model + harness、boundary 的四要素、the box、the brain、context engineering 的四動作、lethal trifecta、guard hook、harness、mutation score、progressive disclosure、sandbox、seam、sub-agent、worktree 等，皆為查閱用定義。

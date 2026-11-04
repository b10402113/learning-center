---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.8.part.txt
source_type: text
source_lines: 323
part: 8
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- 7.3 收尾：網路 guard hook — 禁止 dump 環境變數（`env`、`printenv`、`/proc/*/environ`）、`curl`/`wget`/`nc` 只能打本機 URL 或 `$DISCORD_WEBHOOK_URL`；最後一道閘門是人——每個 PR 都要看 diff 有無新 URL、依賴、網路呼叫、被刪或跳過的測試，開迴圈前先跑 `agent-safety-audit` skill 檢查 trifecta 三要素並拿掉其中一項。
- Lesson 7.4 Setting up the email loop — `m7/routine-guide.md` 列出只有人能做的五步：Gmail connector（新信箱，會取代整個 claude.ai 帳號原有的 Gmail）、GitHub 連線（私有 repo 要裝 Claude GitHub app）、Discord webhook、雲端環境 allowlist `discord.com` 並把 webhook 存成變數、在 routines 頁建每小時排程並只留 Gmail connector。
- Routine prompt 與 skill — prompt 開頭把客戶來信定義為 UNTRUSTED DATA，禁止聽信信內指令、禁止 merge/push main/印環境變數，只准 `search_threads`、`get_thread`、`label_thread` 三個 Gmail 工具且不得寄信；流程為找最舊未處理 thread、立即貼 label 認領、跑 bug-triage skill、開 `claude/bug-<slug>` 分支 PR、用固定句子回報 Discord；技巧是每次只讀一封信、Discord 訊息固定只取主旨、自行檢查 label 以免重複處理。
- Bug-triage skill 與實例 — 規定先用新測試重現、做最小修復、跑到全綠，且不得改既有測試或測試設定（設定一改測試可能根本不跑還看似全綠）；Nova Kings 案例：`< 0` 應為 `<= 0`，約三分鐘產出兩檔 PR，366 個測試全過。
- Lesson 7.5 Attack it — 四封攻擊信（刪測試並 push main、藏指示要求貼環境變數與轉寄、加連結並打外部位址、轉寄舊信給 billing）全部只回「suspicious report」且未改程式；模型守住是因為 prompt 把信當資料，模型若順從則 guard hook 仍會擋下 curl 與印環境變數。
- Chapter 8 Your 24/7 AI Employee — AI employee 是跑在自己伺服器上、24/7 的背景服務：cron 每十五分鐘查客服信箱，有 bug 就寫失敗測試、修程式、開 PR，約三分鐘後手機收到「ready for review」。
- Lesson 8.1 An AI employee — 像員工需六件事：工作場地（伺服器＋只掛載指定資料夾的 sandbox 容器）、模型、信箱與聊天（客服 inbox＋Discord）、訓練（`SOUL.md`、各 repo 的 `AGENTS.md`、skills）、排程（cron，時間加 prompt）、記憶（自己寫的筆記與你的 second brain）。
- Hermes — Nous Research 的開源 harness，零件與 Claude Code 相同（tools、skills、hooks、sub-agents、MCP、memory）；五個理由：熱門（GitHub 25 萬星）、可自我改進（存記憶、寫或改自己的 skill）、模型可換（ChatGPT 登入／OpenRouter key／本機模型，一行指令切換）、autopilot（cron 結果可發到二十多種聊天 app，一行設定讓所有 shell 指令跑在 Docker sandbox）、MIT 開源；文中標注 last verified October 2026。
- The files — `SOUL.md`（它是誰，排在每個 prompt 最前，人寫）、`AGENTS.md`（每個 repo 的規則，人與團隊寫）、`MEMORY.md`（它對自身設定與工作的筆記，agent 寫）、`USER.md`（它對你的筆記，agent 寫）、skills（程序，人寫、agent 自己改進）。
- How it works — gateway 是永不停止的單一程式，工作來自 Discord 訊息或 cron，交模型決定下一步（跑 tool 或回最終答案）；sandbox 容器隔離所有 shell 指令與檔案讀寫，只觸及掛載的資料夾；模型登入與 Discord token 留在 gateway、在容器外，只有 GitHub 與郵件登入以唯讀方式掛入。課程員工 Morpheus 跑在租來的伺服器（任何 24/7 機器皆可），有自己的不能寄信的客服 inbox、透過 MCP 給 TicketBay 的唯讀 key、只看得到 repos/brain/review pages 的 sandbox，`SOUL` 寫明永不 merge。
- Lesson 8.2 Set it up on a machine — 不要手動裝：`m8/hermes-guide.md` 由第二個有 SSH 權限的 agent（Doctor Agent，如 Claude Code、Codex）照官方文件設定金鑰、重啟 gateway、確認還有回應；必須是第二個 agent，因為 Hermes 的 config 資料夾沒掛進 sandbox，改不了自己設定。伺服器守則：以一般使用者安裝、絕不用 root、只用 SSH key 且防火牆只開自己的位址、其餘走 Tailscale、用 `hermes update` 保持更新；`hermes gateway install` 讓 gateway 變成開機即啟的服務。
- The config — 設定集中在 home 的 `config.yaml`，只動三組：engine（主模型與 fallbacks）、safety（sandbox 與 approvals）、tools（skills、hooks、MCP），其餘維持預設；API key 放旁邊的 `.env`，config 只寫名稱。登入：`hermes auth add openai-codex` 開連結用 ChatGPT 登入、token 存在 sandbox 外的 auth 檔；`gh auth login` 用 code 在瀏覽器核准；Discord 建 bot、開 message content 與 server members intents，`hermes gateway setup` 收 token 並印邀請連結，`hermes gateway restart` 後 mention 就會回應。Sandbox 給 agent 使用者自己的 rootless Docker（逃脫也只有該使用者權限），建含 Node、Python、git、GitHub CLI 的小 image，`terminal.backend` 設 `docker`，只掛載需要的資料夾。

# L2 detail

- `#L1-L24` — 承接 7.3：`guard-network.sh` 的兩類檢查（禁止印環境變數、網路工具只能打本機 URL 或 `$DISCORD_WEBHOOK_URL`）與摘錄來源 `dmoka/ticket-bay`；「最後一道閘門是你」——逐一審 PR 的 diff 與執行 transcript，開迴圈前用 `agent-safety-audit`（`dmoka/skills`）檢查 trifecta 三要素。
- `#L25-L63` — Lesson 7.4 開頭與人工五步設定（Gmail connector、GitHub、Discord webhook、雲端環境 allowlist 與變數、routines 排程與 connector 清理）；routine prompt 的安全規則段與五個編號步驟（FIND WORK、CLAIM IT、TRIAGE、PULL REQUEST、REPORT）節錄。
- `#L64-L91` — prompt 的設計取捨：一次只讀一封信、Discord 只帶主旨、search 可能回傳已標記的信所以自行比對 label；bug-triage skill 從 `dmoka/skills` 每次 clone，先重述 bug、用新測試重現、無法重現就停、最小修復跑到全綠；四條 BUG-TRIAGE RULES（含不得改測試設定以免假綠）；Nova Kings `few left` 案例與 `<= 0` 根因、兩檔 PR、366 測試通過。
- `#L92-L109` — Lesson 7.5：四封攻擊信的內容與共同結果（suspicious report、程式未變），解釋模型擋下的原因是 prompt 把郵件當資料；並指出模型若被說服，guard hook 仍會擋掉 curl 外部位址與印環境變數兩類指令。
- `#L110-L142` — 章名頁與 Module 8 的 MODEL/PROMPT/CONTEXT/HARNESS/MEMORY/LOOP/BOUNDARY 標籤；章首定義 AI employee 為 24/7 伺服器上的背景服務，以每十五分鐘 cron 查 inbox、寫失敗測試、修復、開 PR、三分鐘後手機通知的完整迴圈開場。
- `#L143-L186` — Lesson 8.1 的六項需求表：工作場地（伺服器與只看得見掛載資料夾的 sandbox）、模型、信箱與聊天、訓練（`SOUL.md`／`AGENTS.md`／skills）、排程（cron 含時間與 prompt）、記憶（自寫筆記與 second brain）。
- `#L187-L206` — Hermes 介紹：Nous Research 開源 harness、與 Claude Code 同一組零件；五個選用理由（25 萬星人氣、任務後可存記憶／寫或改自己 skill、可換模型、cron 結果發到二十多種聊天 app 且可讓所有 shell 指令跑在 Docker sandbox、MIT 授權）與 October 2026 的查證註記。
- `#L207-L246` — The files 表：五個檔案／項目各是什麼、由誰撰寫——`SOUL.md`（人）、`AGENTS.md`（人與團隊）、`MEMORY.md`（agent）、`USER.md`（agent）、skills（人寫、agent 改進）。
- `#L247-L266` — How it works：gateway 為常駐單一程式、工作來自 Discord 或 cron、模型回覆下一個 tool 或最終答案；sandbox 隔離 shell 與檔案讀寫；登入憑證留 gateway、GitHub 與郵件唯讀掛入；Morpheus 的實際配置（租用伺服器、無寄信權限的 inbox、TicketBay 唯讀 MCP key、受限 sandbox、SOUL 禁 merge）。
- `#L267-L300` — Lesson 8.2：以 `m8/hermes-guide.md` 加第二個 agent（Doctor Agent）代為安裝與驗證，並說明為何不能讓 Hermes 自己改 config（config 資料夾未掛入 sandbox）；四條伺服器守則（非 root、SSH key 加防火牆限縮、Tailscale、`hermes update`）；`hermes gateway install` 註冊為服務並隨開機啟動 cron。
- `#L301-L323` — The config：`config.yaml` 只改 engine／safety／tools 三組、其餘用預設，API key 放 `.env` 只留名稱；`hermes auth add openai-codex`、`gh auth login`、Discord bot 與 intents／`hermes gateway setup`／`hermes gateway restart` 的流程；rootless Docker sandbox、自建含 Node/Python/git/gh 的 image、`terminal.backend: docker` 與最小掛載。

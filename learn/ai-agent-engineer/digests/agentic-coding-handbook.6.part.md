---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.6.part.txt
source_type: text
source_lines: 284
part: 6
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- Brain triage 收尾 — 每次跑完 inbox 清空；新素材若改動既有筆記就更新而非新增；單一專案的規則放該專案 `AGENTS.md`，不進 brain；只由人用自己的話新增 guideline；存疑就不建筆記，因為垃圾筆記會被每個搜尋 brain 的 agent 讀進 context。
- File answers back — `ask-brain` skill 用整個 brain 回答並附每個來源檔連結；對好答案說「save this answer」就送進 inbox，triage 可手動或由排程每日執行。
- Lesson 5.4 Linting the brain — 筆記會過時（事實改變後 agent 仍當真執行）；`lint` skill 在每次 triage 後與「lint the brain」時跑 `python3 skills/lint/scripts/lint.py`；自動修死鏈、漏索引、空索引行，只報告衝突與失效 guideline 並在雙方加警告，不改內容。
- Superseded, not deleted — 決策變更時不刪舊檔，改寫新檔並互連：舊檔標 `status: superseded`、`superseded_by`，新檔加 `supersedes`，lint 驗證被指向的檔案存在。
- Chapter 6 MCP Engineering — 沒有 MCP server，agent 只能像人一樣點網頁，慢且頁面一改就壞；有了它，agent 用工具呼叫與 web app 同一份程式碼。
- Lesson 6.1 Why build MCP — 把產品動作包成具名、有描述與型別輸入的 tool；一個 server 供 Claude Code、Cursor、Codex 共用，還能跨 server 串成任務（錯誤追蹤 → GitHub PR → Slack）；規劃時列出所有使用者動作並標記唯讀或會改變，唯讀者優先成 tool。
- Lesson 6.2 local MCP server — 單檔跑在本機、以 stdio 通訊、免託管免登入；TicketBay 有三個公開 tool `list_events`、`get_event`、`quote_price`，用 `claude mcp add ticketbay-local -- npx tsx "$PWD/mcp/server.ts"` 註冊。
- Tool 描述即觸發器 — agent 只看 name、description、typed inputs；描述寫「Get events」就不知道何時呼叫，寫清用途、篩選與排除條件才會被選中；範例用 `server.registerTool` 加 zod `inputSchema`。
- Fewer, sharper tools — Claude Code 開場只載入 tool 名稱與 server instructions，需要時才搜尋並載入完整定義；instructions 要寫工具用途與呼叫順序，且私密 tool 說明只在 `includePrivate` 時出現；工具越少越精準。
- Lesson 6.3 online MCP server — 同一批 tool 由 app 在 `/api/mcp` 以 HTTP 提供；私密 tool `book_tickets`、`my_orders`、`refund_order` 每次呼叫都要回答「誰在呼叫、被允許做什麼、代表誰」。
- One key per user — 每位使用者發獨立 API key，放 `Authorization` header；key 分唯讀或讀寫；用 Better Auth 的 API key plugin 驗證；無 header 只跑公開 tool，key 錯誤或撤銷回 401，絕不降級為匿名；私密 tool 依 `SCOPE` 表檢查 `tickets:read` / `tickets:write`。
- Lesson 6.4 Best practices — server 要能做到 dashboard 的全部功能；tool 回傳 deep link，危險動作（`cancel_event`）只回影響與確認連結、由人在 dashboard 確認；加一個 `search_docs` tool 逐字回傳文件段落與來源頁；課程附 `add-mcp-server` skill（`m6/add-mcp-server`）先提 tool 清單等你同意再建置測試。

# L2 detail

- `#L1-L15` — 收尾 brain triage 的紀律：inbox 每次清空、改動既有筆記而非重複新增、專案專屬規則進 `AGENTS.md`、不得把來源文字變成 guideline、存疑不建；並介紹 `ask-brain` 回答附連結與「save this answer」擷取流程。
- `#L16-L34` — Lesson 5.4：筆記過時的成因與後果、`lint` skill 的觸發時機、自動修復項目（死鏈、漏索引、空索引）、需人判斷的項目（互相矛盾的筆記、失效 guideline）與加警告的做法，以及 `python3 skills/lint/scripts/lint.py` 指令。
- `#L35-L47` — 決策「取代而非刪除」：新檔記錄新決策並連回舊檔，舊檔標 `status: superseded` 與 `superseded_by`，新檔用 `supersedes` 指回，lint 檢查被指向檔案存在。
- `#L48-L73` — 章名頁與 Module 6 的 MODEL/PROMPT/CONTEXT/HARNESS/MEMORY/LOOP/BOUNDARY 標籤；章首論點：agent 直接點網頁慢且脆弱，MCP server 讓 agent 透過呼叫與 web app 同源程式碼的 tool 操作產品。
- `#L74-L92` — Lesson 6.1：tool 由 name、description、typed inputs 組成並與 web app 共用邏輯（同價格同規則）；一個 server 供多種 agent 共用；跨 server 串接（錯誤追蹤讀 stack trace → GitHub 開 PR → Slack 通知）；規劃步驟是列出使用者動作並分類唯讀/變更。
- `#L93-L111` — Lesson 6.2：本機 server 單檔、stdio、免託管登入；三個公開 tool 的職責（`list_events` 篩選活動、`get_event` 剩餘座位與價格、`quote_price` 含折扣碼總價）；`search_docs` 留待 6.4；`claude mcp add` 註冊指令。
- `#L112-L140` — 「What the agent reads」：agent 看不到程式碼，只靠名稱、描述、型別輸入選 tool；壞描述（`Get events`）與好描述（列出剩餘座位、票價、排除過去/取消活動）的對比；`registerTool` 與 zod `inputSchema`、`.describe()` 的完整範例。
- `#L141-L164` — 「Fewer, sharper tools」：開場只載入 tool 名稱與 server instructions、按需搜尋載入定義；instructions 寫產品範圍與呼叫順序（`list_events → get_event → quote_price`）；`includePrivate` 控制是否揭露 `book_tickets` 的收費與確認規則；結論是工具越少越精準。
- `#L165-L175` — Lesson 6.3：把同一批 tool 由 app 在 `/api/mcp` 以 HTTP 提供給他人 agent（Claude Code、Cursor、VS Code）；公開讀取 vs 三個私密 tool；私密呼叫必答三問：誰在呼叫、被允許做什麼、代表誰。
- `#L176-L191` — 「One key per user」：每人一把 API key、放 `Authorization` header、server 以 key 所屬使用者身分行動；key 分唯讀與讀寫；公開 tool 免 key、私密 tool 需使用者 key；用 Better Auth 的 API key plugin 產生、儲存、驗證，不自己寫金鑰處理。
- `#L192-L227` — `fromApiKey` 驗證流程與錯誤訊息（引導至 Settings → Developers 重新產生）；無 header 只跑公開 tool、錯誤或撤銷的 key 回 401 且不降級為匿名；`SCOPE` 表把 `book_tickets`/`my_orders`/`refund_order`/`cancel_event` 對到 `tickets:write` 或 `tickets:read`。
- `#L228-L235` — 私密 tool 以 key 使用者身分執行、只看得到自己的訂單；使用者流程是在 Settings → Developers 建 key，再用 `claude mcp add --transport http` 加 `--header "Authorization: Bearer tb_…"` 連線。
- `#L236-L268` — Lesson 6.4：server 要涵蓋 dashboard 全部能力（含僅 admin 可用的 `cancel_event`）；deep link 的兩種用法——危險動作回傳影響摘要與 `confirm_url` 交由人在 dashboard 確認，其餘動作直接開到正確頁面；`cancel_event` 回應 JSON 範例（`action_required`、退款張數與金額）。
- `#L269-L284` — `search_docs` tool：先查文件再行動，逐字回傳相符段落與來源頁（以早鳥票退款為例說明其價值與 2% 手續費規則）；課程附 `add-mcp-server` skill（`m6/add-mcp-server`）先提 tool 清單、等同意、再逐步建置與測試；末頁頁碼。

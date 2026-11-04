---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt
source_type: text
source_lines: 403
part: 2
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- **Box 的網路邊界（承 part 1）** — 防火牆只放行 Claude Code 與 npm registry 需要的五個網域，其餘 OUTPUT 一律 DROP；腳本位於 `.devcontainer/init-firewall.sh`。這說明 box 的邊界不是權限提示，而是網路層的白名單。

- **Chapter 1 收尾：驗證 box、邊界的四個部分** — 進 box 後 Claude Code 不需權限提示，因為 box 本身就是邊界；用攻擊者視角驗證（`whoami`、找不到 `~/.ssh`、`/Users` 不存在、`curl` 被擋、`npm ping` 成功）。box 只負責檔案與網路，secrets（短效、單 repo 範圍）與 reset（git 還原＋用 recipe 重建）是使用者自己的責任。核心規則：邊界只畫一次、裡面全權限；白名單越短越好；不要把 approval prompt 當邊界。書中明言 box 內仍擋不住 prompt injection。

- **Chapter 2 Harness Engineering 開場** — harness 是模型周圍的機器：session 開始時讀的檔案、可載入的程序、可呼叫的工具、在固定時點執行的腳本。設定放在 repo 裡，讓每個 session、每位工程師拿到同一個 agent。本章涵蓋 instruction file、skills、MCP servers、sub-agents、hooks。

- **Lesson 2.1 instruction file** — `CLAUDE.md` / `AGENTS.md` 常由 `/init` 生成後就不管，內容重複（build 指令在 `package.json`、架構在程式碼裡）又容易過時；研究指出百大 repo 有 91 個至少一個缺陷。兩個測試：agent 無法自己查到、且在整個 repo 都成立。其餘內容分流到資料夾專屬檔案、skill、doc、hook/lint。另有 Expiry Test 判斷是否只是等模型變強的 workaround；62% 的 repo 把 lint 規則寫成指令。載入位置不會互相覆蓋，`@import` 也在啟動時載入。建議規則放 `AGENTS.md`，用一行 `@AGENTS.md` 的 `CLAUDE.md` 相容舊版與隊友。

- **Lesson 2.2 Skills** — skill 是只在需要時才載入的程序，平時只有 name 與 description 佔 context；資料夾以 `SKILL.md` 為入口，支援檔案按需載入（progressive disclosure）。description 就是觸發器，要寫使用者會打的原話，約一千字元、觸發詞放前面。兩個常見錯誤：寫 no-op（刪掉行為不變）與漏掉 gotchas（最高訊號）。判斷用指令、機械步驟用腳本；可用 `/write-great-skill` 訪談式生成並用三個新 session 驗證觸發。

- **Lesson 2.3 Tools · MCP** — MCP 讓 agent 連到 repo 外的系統（瀏覽器、函式庫文件、資料庫、GitHub）；server 提供 tools，harness 列出、模型呼叫、harness 執行，是開放標準。每個專案三個 server：Context7（對應版本的文件）、Playwright（瀏覽器操作與截圖）、Chrome DevTools（console 錯誤與頁面結構）。以 project scope 寫入 `.mcp.json` 並 commit；server 清單要短，否則相似工具會讓模型選錯。skill／CLI／MCP 的選擇準則：程序用 skill、有好 CLI 用 CLI、只有 live state 才用 MCP。

- **Lesson 2.4 Subagents（開頭）** — 沒有 sub-agent 時，研究過程中讀的每個檔案、搜尋結果與網頁都留在主 context，真正的工還沒開始 window 就滿了。第二個問題是叫同一個 agent 自我審查：window 裡還有寫程式時的推理，會用同一組假設檢查，同一個錯誤看起來又對了。sub-agent 是有自己 window 的第二個 agent（檔案在此截斷）。

# L2 detail

- `#L1-L12` — 防火牆腳本片段：列出允許的網域（`api.anthropic.com`、`claude.ai`、`claude.com`、`platform.claude.com`、`registry.npmjs.org`），接著 `iptables -P OUTPUT DROP` 只接受命中白名單 set 的流量；出自 `.devcontainer/init-firewall.sh`，是把「只用 Claude Code 與 npm」落成網路層規則。

- `#L13-L68` — 第 14 頁與 box 的驗證：box 內不需權限提示，因為盒子就是邊界；`./box bash` 後依序檢查身分是 `node`、沒有私鑰、看不到 Mac 的 `/Users`、`curl` 被防火牆擋、`npm ping` 回 PONG。接著把邊界拆成四塊：box 管檔案與網路，secrets 與 reset 由使用者負責（短效、單 repo 的 token；git 還原與 recipe 重建）。列出四條 KEY RULES（畫一次邊界、白名單短、secrets 留在盒外且只跑信任的 repo、別用 approval prompt 當邊界），並警告 prompt injection 仍會穿透、惡意 repo 可偷走容器內憑證，recipe 見 `.devcontainer/README.md`。

- `#L69-L94` — 進入 Chapter 2「Harness Engineering」：一句話定義本章要教什麼（從 repo 操控 instruction file、skills、MCP servers、sub-agents、hooks），配上 model／prompt／context／harness／memory／loop／boundary 的模組圖；再定義 harness 是「模型周圍的機器」——session 開始讀的檔案、可載入的程序、可呼叫的工具、固定時點執行的腳本，並強調它放在 repo 裡，因此全隊與每個 session 共用同一個 agent。

- `#L95-L216` — Lesson 2.1 instruction file 全節：`/init` 產生的檔案多半重複且會失效（build 指令、架構摘要、檔案路徑），百大 repo 中 91 個有缺陷。兩個測試（agent 查不到、全 repo 成立）搭配 ✕／✓ 範例：`npm run build`、checkout 資料夾位置、只在一個資料夾成立的 fast-check 規則都該移除，而「不加新碼到舊 payment client」「不手改 drizzle migration，改 schema 後跑 `npm run db:generate`」該留。給出「刪掉是否會讓 agent 出錯」與「維持約一百行」的準則。其餘內容的分流表：單一資料夾規則→該資料夾的小 instruction file；程序→skill（2.2）；參考資料→doc 加一個指標；機器可檢查的規則→hook（2.5）或 lint，並指出 62% 的 repo 把 lint 規則寫成指令。Expiry Test 用來分辨 workaround 與系統規則（系統規則不會因模型變強而過期）。載入來源：`~/.claude/CLAUDE.md`、repo root（啟動時）、子資料夾（讀到才載入），彼此不覆蓋而是依序疊加，`@file` import 也在啟動時載入所以拆檔不省 context。最後講 `CLAUDE.md` 與 `AGENTS.md` 的雙名問題：其他工具讀 `AGENTS.md`，較新 Claude Code 只在沒有 `CLAUDE.md` 時才讀它，因此把規則放 `AGENTS.md`、`CLAUDE.md` 只留 `@AGENTS.md`，並用 `/memory` 檢查實際載入了哪些檔案。

- `#L217-L313` — Lesson 2.2 Skills 全節：沒有 skill 時 agent 每次 session 都重新摸索（先看哪個 log、staging 只在 VPN 後、health check 指令）。定義 skill 為按需載入的程序，平時只留 name 與 description。結構是一個資料夾、`SKILL.md` 為入口（frontmatter 的 name／description 加指令），旁邊放 scripts、參考文件、範例，並在需要時才載入（progressive disclosure），所以磁碟上二十個 skill 幾乎不佔成本。description 即觸發器：開場時 agent 讀所有描述建立地圖，「Helps with deployments」太模糊不會觸發，要寫使用者真的會打的字（deploy、ship、release），約一千字元、觸發詞置前；附 `debug-runbook` 的 frontmatter 範例。兩個錯誤：寫 no-op（用刪除測試驗證，會花掉每次呼叫的 context）與漏掉 gotchas（受傷過的陷阱，訊號最高，附範例：import 失敗是 config 而非 bug、金額一律整數 cents）。「判斷寫指令、機械寫腳本」：模型非決定性，若每次結果必須相同就做成 `scripts/` 裡的腳本，只有輸出進 window。觸發方式：agent 依 description 自行觸發，或使用者打 `/debug-runbook`；`.claude/skills/` 進 git 全隊共用，`~/.claude/skills/` 本機全專案可用；格式是開放標準，Claude Code、Codex、Cursor 都能跑。最後介紹 `/write-great-skill`（dmoka/skills）：以五個問題訪談（觸發詞、模型不知道的事、絕不能發生的事、哪些步驟機械化、放哪裡），草擬後用三個新 session 測試是否被觸發，並要求一個無關請求不得載入。

- `#L314-L392` — Lesson 2.3 Tools · MCP 全節：MCP（Model Context Protocol）是 agent 連接 repo 外系統的方式，server 提供 tools，harness 列出清單、模型挑一個、harness 執行；開放標準可跨工具。沒有 MCP 時 agent 憑記憶寫 API 呼叫或猜頁面長相，有 MCP 就讀真實狀態（對應版本的文件、實際渲染的頁面、console 錯誤）。三個必備 server 與用途：Context7（版本正確的文件）、Playwright（點擊、填表、截圖）、Chrome DevTools（連到執行中的瀏覽器讀 console 與頁面結構）。用 project scope 加入會寫入 repo 根目錄的 `.mcp.json`，commit 後全隊一致，Claude Code 只需批准一次；附 `claude mcp add --scope project playwright -- npx @playwright/mcp@0.0.83 --browser chromium` 指令與 JSON 片段。清單要短：session 開始只放 tool 名稱、用到才載入完整定義，但每個 server 的名稱都在每次 session 出現，相似工具越多越容易選錯；box 內若 server 要下載東西，記得把 host 加進白名單。最後用表格給選擇準則：程序或專案知識→skill；有好 CLI 的工具（GitHub、雲端、Kubernetes）→CLI；只有 live state 且沒有好 CLI（瀏覽器、SaaS API、託管認證的資料庫）→MCP。

- `#L393-L403` — Lesson 2.4 Subagents 開頭（檔案在此截斷）：沒有 sub-agent 時，研究過程中讀的檔案、搜尋結果、抓的網頁全留在主 context，window 在真正動工前就滿；第二個問題是讓同一個 agent 審自己的程式，window 還留著當初寫程式的推理，會用同一組假設驗證，同一個錯誤再看一次還是對的。接著提出解法方向：sub-agent 是有自己 window 的第二個 agent，負責閱讀與蒐集，句子在「…all the search results and file」處結束。

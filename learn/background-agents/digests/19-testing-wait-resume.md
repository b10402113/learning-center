---
source: sources/background-agents/20261027/19-testing-wait-resume.md
source_type: text
source_lines: 81
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 等待後能否自行接回 — 用「帶延遲恢復的故障」驗證同一個 run ID 會先等待、收到 `health.recovered`、重新觀察、checkout，最後 complete，並確認多筆 alert 掛在同一個 incident。
- 實測揭露了求救行為 — 10 秒 timeout 讓 agent 主動 `requestHelp`，因為上游 payment gateway 不健康且本地無法修，故障恢復後它又自行撤回求救。
- 等待與續跑的機制 — `continue` 回到的是外層 `for` 迴圈，重新取得 run 並檢查狀態；`waitForEvent` 與 resume 的組合讓流程能從暫停處接回。
- 這一課與 LLM 無關 — 整段改動都在 harness，LLM 部分的程式碼從第一課起就沒動過，強調 harness 才是 agent 的主體。

# L2 detail

- `#L1-L9` — 說明測試目標：fault with delayed recovery 應讓同 run ID 等待、收到 `health.recovered`、再 checkout 並 complete；`-3` 多筆 alert 應共用一個 incident。
- `#L10-L16` — 啟動順序：先跑 app 與 ingest，再以 fault dependency、30 秒後恢復啟動服務，並提醒 port 順序容易出錯。
- `#L17-L23` — 觀察 run 停在原地，10 秒 timeout 觸發求救；故障恢復後新事件進來，agent 自行表示不需要幫忙。
- `#L24-L30` — 逐筆看事件：`Incident opened`、`agents started`，alert 描述 payment gateway timeout，state 顯示 42 個錯誤、upstream healthy 為 false。
- `#L31-L37` — agent 判斷 checkout 效能下降源自上游、本地無法修，於是要求協助，並提出調查與恢復 payment gateway 的具體問題。
- `#L38-L42` — 說明這個問題可丟到 Slack 給人回答；因 help 尚未實作，run 停在「help is not ready yet」並打算等 10 秒。
- `#L43-L49` — 等待的 `health.recovered` 到達；假 server 的點號命名與 ingest 的斜線命名其實對應同一件事。
- `#L50-L56` — resume 後執行 `continue` 回到外層 `for`，重新取得 run，看到 upstream healthy 為 true，於是 run completed。
- `#L57-L63` — 判斷正確但路徑與預期不同；若 help 未實作會無限等待，示範把等待設成 0 毫秒會讓程式卡死，不建議實跑。
- `#L64-L72` — harness 只允許可接受的行為；沒有 runbook 時求救是合理的，若有 runbook 則等待時間是被寫死的。
- `#L73-L75` — 新 alert 進來後 agent 立刻取消求救，行為像真人。
- `#L76-L81` — 全程未動 LLM，LLM 只有四行程式碼，其餘都是包在外面的 harness，這是本課重點。

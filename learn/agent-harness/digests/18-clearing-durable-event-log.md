---
source: sources/agent-harness/20260915/18-clearing-durable-event-log.txt
source_type: text
source_lines: 198
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 為了反覆觀察 compaction，需要一個能清空 event log 的操作；做法是在 db.ts 加上 truncate event log 的函式。
- 清空能力要透過 HTTP 暴露：在 server 加上 CORS 中介層，讓瀏覽器從不同 origin 也能呼叫。
- 新增 `POST /api/clear` 路由，直接呼叫 clear event log；UI 的 clear 按鈕已經接好這個端點。
- 實際跑一次任務就能看到 compaction 在 runtime 每次迴圈開頭、呼叫 LLM 之前檢查 token 用量。
- 事件紀錄會顯示 `memory.compacted`、被摘要的 turn 數、壓縮後的 context token 數與 summary。
- 壓縮後 token 數會落在 maxContextTokens 附近（反覆略高於門檻後被拉回），可藉此驗證門檻邏輯。
- LLM summary 的長度不會被 compaction 設定自動限制，若要控制得在 summarize 的 generateText 另設 max output tokens。
- 教學用的 500／200 門檻極度激進，實務上不該這樣設定，但能讓壓縮行為清楚可見。

# L2 detail

- `#L1-L17` — 在 db.ts 新增 clear event log，對 event log table 執行 truncate，作為觀察與重設實驗狀態的最小工具。
- `#L18-L59` — 在 server index 匯入清空函式，並補上 CORS 中介層與 `Access-Control-Allow-Origin` 標頭，解釋瀏覽器 preflight 與跨 origin 存取的關係。
- `#L60-L78` — 建立 `POST /api/clear` 路由呼叫 clear event log，對應 UI 既有的 clear 按鈕，並確認 dev server 啟動正常。
- `#L79-L116` — 清空紀錄後貼入範例任務實際執行，觀察 agent 是否會因五個 item、30 回合與低 token 門檻而觸發壓縮。
- `#L117-L161` — 檢視事件輸出，確認 `memory.compacted` 出現的時機、被摘要的 turn 數與 context token 數，並回扣 runtime 在每輪開頭先估算 token 的實作。
- `#L162-L198` — 釐清 max context tokens 500 與 keep context tokens 200 的差別，說明 summary 長度需靠 max output tokens 控制，並總結壓縮雖有效但門檻過於激進。

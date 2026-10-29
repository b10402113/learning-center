---
source: sources/agent-harness2/20261029/18-clearing-durable-event-log.txt
source_type: text
source_lines: 198
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 新增 `clearEventLog` 清空 durable event log，方便重複觀察 compaction 行為。
- `db.ts` 以 truncate 清掉 `event_log` 表；server 新增 `POST /api/clear` 路由。
- 因為 UI 從不同 origin 呼叫，需加上 CORS 與 preflight 處理。
- 實際執行後 event log 出現 `MemoryCompacted`，證明 runtime 在每輪 LLM 前檢查 token。
- 壓縮頻率取決於 `MAX_CONTEXT_TOKENS` 500 與 `KEEP_CONTEXT_TOKENS` 200，示範刻意設得極低。
- 摘要長度沒有自動上限，若需要應在 `summarize` 設定 `maxOutputTokens`。

# L2 detail

- `#L1-L17` — 為了看清 compaction，需要先清空 event log；在 `db.ts` 新增 `clearEventLog`，直接 truncate／drop `event_log` 表，實作極簡。
- `#L18-L59` — 在 server index 匯入 `clearEventLog` 與既有的 `ensureSchema`；因新增對外路由，加入 CORS middleware，設定 `Access-Control-Allow-Origin`，讓瀏覽器的 preflight OPTIONS 請求可通過。
- `#L60-L78` — 新增 `POST /api/clear` 路由，收到請求就清空 event log；UI 的 clear 按鈕已接好此端點，啟動 dev server 確認沒有壞掉，並實測 clear 成功。
- `#L79-L117` — 貼上範例任務準備觸發 compaction；任務有 5 個 item、30 turns，模型逐一處理並撰寫回覆，講者觀察 event 輸出是否出現壓縮。
- `#L118-L162` — event log 出現 `MemoryCompacted`：summarized turns 3、context tokens 619，且接近 600 就反覆壓縮；原因是 runtime 在每個迴圈頂端、呼叫 LLM 前就先估算 token，超過門檻便 shift turns 並摘要。
- `#L163-L198` — 討論摘要本身的大小：目前沒有限制 summary 長度，若要控制需在 `summarize` 傳 `maxOutputTokens`；確認設定其實是 `MAX_CONTEXT_TOKENS` 500、`KEEP_CONTEXT_TOKENS` 200，示範過於激進但在真實系統不會這樣做，整體壓縮流程運作正常。

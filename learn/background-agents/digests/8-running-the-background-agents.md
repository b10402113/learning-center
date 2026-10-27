---
source: sources/background-agents/20261027/8-running-the-background-agents.md
source_type: text
source_lines: 55
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 實跑觀察 — 重啟 checkout service 後在 events 看到 health alert（payment confirmation error rate 42.1%），activity feed 出現新的 investigation。
- observe — 第一個動作是取得 agent state：health 為 degraded、error rate 42、目前 release、服務名稱與已啟用的 feature。
- 第一輪 — LLM 選擇 inspect the logs，因不是特殊動作所以直接執行，日誌是伺服器模擬的。
- 讀取型動作 — 看 log 不會改變狀態，因此下一輪 state 幾乎不變，符合預期。
- 第二輪 — 依 log 決定關掉 checkout Express feature；由於 terminal 動作尚未實作，會一路跑到 8 次上限，但決策相當一致。

# L2 detail

- `#L1-L7` — 重啟 checkout service，在 events 看到 health alert「checkout Express feature raised an error during payment confirmation, error rate 42.1」，activity feed 出現新調查與其 goal。
- `#L8-L14` — 從 `opened` 事件與 goal 開始，agent 第一個動作是觀察（observe），看到服務送進來的原始錯誤事件。
- `#L15-L24` — observe 對應程式碼中的 agent state：health.degraded、error rate 42、release、服務名稱、feature 已啟用，開發者需自行決定 state 形狀。
- `#L25-L29` — 第一輪：LLM 決定 inspect the logs，理由是需先確認故障來源才能改動服務狀態。
- `#L30-L34` — 看 log 不是 harness 的特殊動作，因此直接執行；日誌為模擬內容但動作成功。
- `#L35-L39` — 讀取型（非 mutative）動作不預期改變 state，記錄動作後再迴圈一次。
- `#L40-L46` — 第二輪：依 log 內容決定關掉 checkout Express feature，並說明日誌品質讓判斷更容易。
- `#L47-L51` — 因 terminal 動作（求助、完成）尚未實作，agent 會重複到 8 次上限。
- `#L52-L55` — 觀察重點是 agent 的思考一致性：始終主張關掉該 feature，運作相當穩定。

---
source: sources/agent-harness/20260915/12-durable-execution-recap.txt
source_type: text
source_lines: 214
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 這一課的核心訊息：runtime 的 while loop 完全沒變，變的只是把「不該重跑的事」包進 durable step。
- 三個需要 durable 的動作：`emit`（避免重複事件）、tool call（避免重複副作用與花費）、`streamText`（避免重複燒 token）。
- 為了自己掌控 tool 執行，必須拿掉 AI SDK 的 `execute`，改寫一個以 switch 分派的 tool runner。
- `modelTurn` 與 `toolStep` 各自封裝成一個 step，並以回傳物件的方式把結果交回 workflow。
- 把同一個 step 內的多個動作綁在一起是刻意的：它們必須全部發生或全部不發生，否則 UI 與狀態會不一致。
- 重新連線時的流程：replay 歷史事件 → client 送訊息 → 啟動或續接 workflow。
- LLM 之所以會「自己接下去」，是因為它只判斷訊息陣列的最後一則角色：user 或 tool 就生成，assistant 就不再回覆。
- 整段改動本質上是 refactor，沒有新增業務邏輯。

# L2 detail

- `#L1-L18` — 回顧：原本的 while loop（執行工具直到沒有工具請求，再生成回覆）仍然存在，唯一差別是把結果寫進資料庫、避免重跑。
- `#L19-L47` — 點出三個要包成 step 的動作：`emit`、tool call、`streamText`；若重跑會造成重複事件、重複花錢與重複 token。
- `#L48-L60` — 拿掉工具上的 `execute` 以退出 AI SDK 的自動執行，改由自製 tool runner 以 switch 判斷要呼叫哪個函式。
- `#L61-L96` — `modelTurn` 的內容其實沒變（streamText、監聽 text delta、emit），差別是封裝成函式後需要用回傳物件把結果帶出去；`toolStep` 同理。
- `#L97-L136` — 解釋為何把多個動作合併成單一 step：它們具有連動性，不能只發生一半；並重申這只是把邏輯搬進 step 的 refactor。
- `#L137-L169` — 回答斷線問題：`on connection` 先 replay 所有事件，接著 client 送出的訊息會啟動 workflow，可能是續接舊的，也可能是全新的任務。
- `#L170-L214` — 深入 LLM 的續跑機制：最後一則是 user 或 tool 訊息就會生成，是最後一則 assistant 就不再回覆；示範當時剛好停在 tool 結果尚未回覆的狀態，所以重啟後自動接上。

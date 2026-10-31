---
source: sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt
source_type: text
source_lines: 330
supplements:
  - harness-engineering.2.part.md#L1-L423
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- LLM 伺服器端不保留對話記憶，每一輪都必須把完整 messages 陣列重新送上，否則模型看不到自己上一輪的回應。
- 串流處理完後要 await 完成，再把 `result.messages` 展開併回 messages 陣列，且只併入完整結果。
- 目前沒有持久化層：WebSocket 事件若沒被消費就會遺失，需要 storage／memory 才能重播與續跑。
- 沒有 tool call 時直接取 `result.text`，emit `model completed` 與 `workflow completed`；跳出迴圈則代表超過 maxSteps，emit `workflow failed`。
- 設定 `.dev.vars` 的 API key 後實測，demo 顯示 agent 重複送信、未經批准就送出，暴露 naive harness 的缺陷。
- 刻意不用 AI SDK 內建的 loop／hooks，只把它當 LLM 呼叫層，保留 harness 控制權與可移植性。

# L2 detail

- `#L1-L38` — 必須把 LLM 回應 append 回 messages，否則下一輪模型看不到自己說過什麼；解釋伺服器不保存對話是為了把記憶體留給 inference，也導致越聊越慢越貴。
- `#L39-L81` — 以 `await result.messages` 等串流結束後，用 spread 把完整訊息逐筆 push 進 messages；不併入串流中的半成品。
- `#L82-L108` — 聽眾提問：WebSocket 事件沒被 client 消費怎麼辦？回答目前確實會直接遺失，下一步需要 storage／memory 層來持久化與 replay。
- `#L109-L121` — 取得 `toolCalls`（同樣要 await 串流結束），準備判斷有哪些工具需要實際執行。
- `#L122-L152` — 若沒有 tool call，代表模型準備回覆：取 `result.text`，emit `model completed` 與 `workflow completed`，帶最終輸出。
- `#L153-L178` — 若流程走到迴圈外，代表超過 maxSteps 或其他異常；把最後一個 emit 改成 `workflow failed`，訊息寫 max steps。
- `#L179-L207` — 從 `.dev.vars.example` 複製出 `.dev.vars` 並填入 OpenAI API key；其他 provider 需依其文件設定對應的環境變數名稱。
- `#L208-L223` — 重新 `npm run dev`，確認沒有壞掉、WebSocket 連上，送一則 hello 驗證 workflow started 與思考流程正常。
- `#L224-L256` — 問答：AI SDK 的 `maxRetries`／內建 loop 與自製 maxSteps 迴圈的差異；選擇自己寫迴圈是為了控制 emit 與 WebSocket，避免綁死在特定 SDK 的 hooks。
- `#L257-L282` — 貼上範例 prompt 實測；目前是 dry run，tool call 事件有發出但工具未執行，agent 可能卡在迴圈裡重試直到放棄。
- `#L283-L311` — Demo 暴露問題：send reply 重複送了三次、完全沒有先取得批准，draft 給人看卻已直接送出；這種會亂衝的 agent 無法賣給客戶，是 harness 要修的地方。
- `#L312-L330` — 用 inspector 檢視每次 emit 的事件：逐 token 的 text delta、模型與 workflow 完成、tool request 等，可回推 agent 看到什麼、為何走到這一步。

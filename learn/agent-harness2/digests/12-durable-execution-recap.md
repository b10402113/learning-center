---
source: sources/agent-harness2/20261029/12-durable-execution-recap.txt
source_type: text
source_lines: 214
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 架構其實沒變：仍是「呼叫 LLM → 有 tool call 就執行 → 直到沒有為止」的 while loop。
- 唯一差別是把三件事包進 step：emit（寫 DB）、tool call、`streamText`，讓結果持久化且不重跑。
- 不包 step 的後果：重打 LLM 浪費 token、重複 emit 讓 UI 出現重複事件、工具副作用重複發生。
- 為了自己執行工具，必須移除 AI SDK 的 `execute`，改寫成單一 `runTool` switch。
- `toolStep` 刻意把多個 emit 與工具執行綁在同一個 step，避免只發生一半造成 UI 與事實不一致。
- 斷線後能續跑，是因為重連會 replay 事件，且 LLM 會依 messages 最後一則的角色決定是否要生成。

# L2 detail

- `#L1-L19` — 回顧：runtime 仍是同一個 while loop，只是把兩類工作包成 step，將結果寫入資料庫以避免在同一 workflow 內重跑。
- `#L20-L47` — 三件要 durable 的事：emit（DB 寫入）、tool call、`streamText`；動機是 token 成本、重複事件與重複副作用。
- `#L48-L60` — AI SDK 原本會自動執行工具，因此刪掉 `execute` 以退出該行為，並自建 `runTool` 的 switch。
- `#L61-L82` — while loop 沒有改變；`modelTurn` 只是把原有邏輯抽出，並回傳一個 Turn 物件帶出結果。
- `#L83-L119` — `toolStep` 把相關 emit 與工具執行集中在一個 step：要嘛全發生、要嘛全不發生；拆成多個 step 會產生部分完成的狀態。
- `#L120-L136` — `modelTurn` 也自成一 step，涵蓋串流與等待；整體只是重構，沒有新增邏輯，最後由 DBOS 把函式轉成 workflow。
- `#L137-L169` — 回答斷線疑問：client 重連時 `on connection` 會 replay 全部事件；收到訊息後啟動 workflow，會續跑或建立新的。
- `#L170-L214` — LLM 依 messages 最後一則角色決定是否生成：最後是 user 或 tool 就會回覆，是 assistant 則不會，因此中斷後能自動接續。

---
source: sources/background-agents/20261027/10-durable-execution.md
source_type: text
source_lines: 41
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **為什麼要拆 step** — 單一 step 內的失敗會導致整段重做；拆成多個 step 才能從中斷點 resume。
- **兩條核心規則** — workflow 程式碼必須 deterministic，step 本身必須 idempotent，否則重播會出錯或重複產生副作用。
- **失敗與重試策略** — Inngest 允許在 workflow 層級或單一 step 層級設定 retry policy。
- **resume 的真相** — 不是重播 JavaScript stack，而是把每個 step 的結果 memoize 後依序重播。

# L2 detail

- `#L1-L6` — 目前只有一個 step；step 是 durable 與 memoized 的單位，但整包塞在一起會導致恢復時全段重跑。
- `#L7-L14` — 現有 agent loop 的 inspect logs、呼叫 model、關閉 feature 都在同一段；拆成獨立 step 後可從上次完成處接續且不丟資訊。
- `#L15-L24` — workflow 必須 deterministic（不能依時間或隨機分支）；step 必須 idempotent，並以 Stripe 的 idempotency key 為例。
- `#L25-L30` — 回答提問：Inngest 可在 workflow 或單一 step 層級自訂失敗重試行為。
- `#L31-L41` — resume 只是讀取 memoized 的 step 結果，不是重播 JS 執行堆疊；deterministic workflow 保證 step 順序固定。

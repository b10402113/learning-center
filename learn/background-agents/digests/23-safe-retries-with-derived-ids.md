---
source: sources/background-agents/20261027/23-safe-retries-with-derived-ids.md
source_type: text
source_lines: 43
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 重試安全的核心是 idempotency — 用穩定的 action ID 當 idempotency key，讓結果不確定的 tool call 可以重試而不重複產生效果。
- 先把破壞性操作拆成獨立 step — 同一 step 內多個 async 動作失敗重跑時會全部重做，拆開才能免費獲得各自的重試。
- 程式本身也要 idempotent — 只拆 step 不夠，若商業邏輯跑到一半失敗會重複建資源；要能辨識「已做過」並跳過，做法同 Stripe 的 idempotency key。
- 用 deterministic ID 與 `cancelOn` 收緊一致性 — 從隨機 UUID 改成由 run ID、cycle、decision 推導，並用 `cancelOn` 擋掉相同 run ID 的重複 workflow。

# L2 detail

- `#L1-L2` — 定義問題：以穩定 action ID 作 idempotency key，讓不確定的 tool call 能安全重試，即冪等。
- `#L3-L7` — 推薦 AWS 的 idempotent API 文章與 Inngest guide，說明核心就是讓 step 與 action 能承受重試。
- `#L8-L12` — 不要把多個非同步、有破壞性的操作塞進同一 step，否則重跑會全部重做；拆開即可分別重試。
- `#L13-L21` — 拆 step 後程式仍需 idempotent；以建立 user 跑到一半失敗為例，說明重跑會撞唯一鍵，並對照 Stripe 以 idempotency key 避免重複交易。
- `#L22-L26` — 移除隨機 UUID，改用 Inngest 內建的 idempotency 機制。
- `#L27-L33` — 在啟動參數加 `cancelOn`，比對 `agent/run.canceled` 的 `data.runId`；以兩人同時編輯 Google Doc 比喻同 run ID 的 race condition。
- `#L34-L38` — 把 ID 組成改為 cycle 加 action，使 action ID 可由 run ID、cycle、decision 確定性推導。
- `#L39-L43` — 判斷不需再測試，但強調前面範例都沒做這件事，若真開另一個 service 會立刻出問題，現在至少能取消重複 run。

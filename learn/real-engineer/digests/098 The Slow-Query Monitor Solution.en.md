---
source: sources/real-engineer/20261116/course/098 The Slow-Query Monitor Solution.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 終點很清楚：runner 找出慢查詢的修法並開 PR，順便在 ticket 上解釋修法（是否要開票取決於 tracker 與 git host 的整合程度）。
- 天真做法是 alert 一到就 spawn runner，等於「加速失控」——來 100 個 alert 就 100 台 runner。
- 根本問題是 push 模式：orchestrator 被動接收 alert，完全無法控制節奏。
- 解法是把 alert 放進 queue，由 orchestrator 每天（或依條件）主動去拉；這就是 push 改成 pull，控制權回到工廠手上。
- 拉進來後，很多 alert 其實是同一個底層問題，所以先派一台 runner 分組，每組開一張票，並先撈出既有的 slow query 票以避免重複開票。
- 第二台 runner 只處理「還沒有 PR 的票」，改為更新既有 ticket 而不是另開新票。
- 更進一步：如果第三方服務（如 PlanetScale）有 API，可以直接每日拉取，連 queue 都不需要。
- 兩道煞車：在分組 runner 裡做 severity check（severe／mild），orchestrator 只實作 severe；以及靠 label 在 tracker 裡過濾與追蹤狀態。

# L2 detail

- `#L1-L8` — 終點與天真做法：目標是 runner 找出慢查詢修法並開 PR（也可能在票上說明修法，取決於 tracker 與 git host 的耦合度）；最直覺的做法是 alert 一來就 spawn runner，但那是失控加速——100 個 alert 就是 100 台 runner，不可行。
- `#L9-L20` — 問題診斷與 queue 解法：真正的問題是 orchestrator 被 push、無法控制節奏；因此把 alert 放進 queue，由 orchestrator 每天主動拉取；拉進來後先派一台 runner 把重複的 alert 分組，每組開一張票，並先撈出既有 slow query 票以避免重複建立。
- `#L21-L44` — 第二段、節奏調節與 pull 勝於 push：分組 runner 回報後，只對「還沒有 PR 的票」啟動實作 runner，並改成更新既有票而非另開新票；透過 queue 的拉取週期（一天兩次、三次）或門檻（超過 40 個 alert）調速。queue 可以是資料庫，也可以直接是第三方服務本身（例如呼 PlanetScale API 問最近有哪些慢查詢），此時連 alert 與 queue 都不需要；核心洞見是 push 系統把控制權交給來源，pull 系統則讓工廠自己決定節奏。
- `#L45-L56` — 防止 ticket tracker 被灌爆：在分組 runner 內加入 severity check，像 explore 步驟一樣對每組給 verdict（severe／mild）；隨著資料量增加，票可能由 mild 升級為 severe，而 orchestrator 只實作 severe，形成另一道過濾。
- `#L57-L71` — 整體 loop 與推廣：pull → 分組與評級 → 只修 severe，ticket tracker 因此承載大量狀態並逐步消化，label 在此非常重要；這個模式可套用到任何追蹤應用健康度的外部資料（效能監控、log、error），讓工廠持續讀取指標並找出改善。

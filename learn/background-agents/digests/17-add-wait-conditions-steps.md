---
source: sources/background-agents/20261027/17-add-wait-conditions-steps.md
source_type: text
source_lines: 93
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **三種暫停情境** — 純 `wait`、`request help`、以及 `complete` 但未通過 goal condition。
- **wait 其實有多種語意** — complete 是「完成了」、request help 是「要送訊息求助」、純 wait 才是真正的中間等待。
- **complete 被 goal 擋下** — `reject completion` step 記錄 human phase 的 activity，形成僵局讓真人介入。
- **help 先 defer** — 尚無求助流程，但先記錄問題與 detail，之後可從 log 還原 agent 想問什麼。
- **`step.waitForEvent` 的機制** — 等待事件或 timeout，可加 filter；之後的程式在條件成立前完全不執行，且 workflow 必須 deterministic。

# L2 detail

- `#L1-L14` — 回到 wait 分支，整理三種要暫停的情況：wait、request help、complete 加 goal condition。
- `#L15-L23` — 區分三種「等」的內容，先定義語意再決定暫停後要做什麼。
- `#L24-L37` — complete 未達 goal 時執行 `reject completion` step，記錄 `completion blocked by configured goal condition`，可改為 continue 或交真人。
- `#L38-L45` — request help 執行 `defer help` step，記錄 `help is not ready`，payload 保留 question 與 decision detail。
- `#L46-L59` — 剩下的必然是 wait：以 `wait status` step 把 run 設為 waiting，並用巢狀三元決定狀態訊息。
- `#L60-L73` — `step.waitForEvent` 的用法：事件名稱、filter、timeout（如三天），以及事件未到時的分支處理。
- `#L74-L81` — 等待期間程式被凍結，控制流必須 deterministic：不能有新的 mutation 或依隨機數產生的新路徑。
- `#L82-L93` — 並非真的掛住 server，而是 Inngest 存下條件；事件或 cron 再次呼叫函式即喚醒 workflow。

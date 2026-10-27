---
source: sources/background-agents/20261027/12-multi-step-loop.md
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **把 loop 搬進 workflow** — 固定次數的 `for` 迴圈本身是 deterministic，可放在 workflow 層，around 24 個 cycle。
- **每圈先驗證 run 有效性** — 比對 `instanceId` 並檢查 completed、failed、canceled、escalated、superseded 等終止狀態。
- **哪些東西該進 step** — 非同步操作（observe-state、write-report、complete-run）幾乎都該包成 step；同步且需即時性的檢查（goal、getRun）留在 workflow。
- **單一職責原則** — 一個 step 只做一件非同步事，除非能接受失敗時全部重跑的後果。
- **概念可移植** — Temporal 的 activities、Vercel 的 decorator、Cloudflare 的方案都對應同一組 workflow/step 概念。

# L2 detail

- `#L1-L6` — 先保留舊 loop、在其上重寫，再回頭刪除舊程式碼。
- `#L7-L21` — `getRun(runId)` 後比對 `run.instanceId` 與 `event.data.instanceId`，並檢查是否已進入終止狀態，符合即 `return`。
- `#L22-L31` — 把 loop 放進 workflow：固定次數（筆記用 24）的 `for` 迴圈 deterministic，不可依 `Math.random` 等不確定條件。
- `#L32-L43` — 每圈開頭重新 `getRun`（刻意不進 step、不快取），再次檢查終止狀態。
- `#L44-L53` — 第一個 step 為 `observe-state`（帶 cycle 編號），包住 `agentState`，確保 state 被 memoize。
- `#L54-L67` — goal 檢查留在 workflow；非同步操作放 step，且單一 step 只做一件事，例外需能接受重跑後果。
- `#L68-L77` — goal 達成時以 `write-report`、`complete-run` 兩個 step 產報告並標記完成，再 `return`。
- `#L78-L87` — 同樣邏輯可套用到 Temporal（activities）、Vercel（decorator）、Cloudflare；差別只在語法。

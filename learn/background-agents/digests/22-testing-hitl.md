---
source: sources/background-agents/20261027/22-testing-hitl.md
source_type: text
source_lines: 52
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 實測 approval 流程 — 跑 `fault release` 後 approve rollback，驗證 stale 分支會繞回迴圈、inbox 直接讀資料庫的 proposed action。
- approval request 就是資料庫紀錄 — 通知沒有送到別處，只是把 proposed action 寫進資料庫，inbox 撈那張表並等待 resolved。
- 批准後的 resume 與狀態驗證 — `agent/approval.decided` 觸發重跑但前面步驟已 cache，於是幾乎直接 resume；讀取 state 變成 version 2，執行 rollback 後收到 service recovered。
- 等待機制取決於 runtime — 是否要自己寫 while 等待，取決於 durable execution 與部署環境，serverless 可讓 function 直接關閉；視覺化則推薦直接用 Inngest。

# L2 detail

- `#L1-L6` — 預告要測 HITL 的 stale 分支；實際跑一次 release fault，先啟動 dev agent，中途重開後直接下 `fault release`。
- `#L7-L11` — 回到 app 已見 inbox 有新項目；新分支的程式有 sleep 所以較慢，agent 判定需要 rollback，卻被 harness 以需要 approval 擋下。
- `#L12-L15` — approval request 就是寫進資料庫的 proposed action；inbox 只是讀那張表，run 會一直等直到該筆 resolved。
- `#L16-L20` — 畫面沒有參數，因為假工具不吃 arguments；唯一傳入的是 state 版本，對人沒有意義，真實工具應顯示 rollback 版本等資訊。
- `#L21-L29` — approve 後可在 audit log 看到 rollback release、approved，resume 時 state 更新為 version 2，執行 rollback 後收到 service recovered，最後全部健康完成。
- `#L30-L31` — 強調 run 會無限期等待人的回覆。
- `#L32-L36` — 回答等待是框架或自寫：取決於 durable execution 與 runtime，Temporal 需 worker、Inngest 不用，serverless 可直接關閉 function 達到零 compute。
- `#L37-L46` — approve 後以 `agent/approval.decided` 觸發重跑但前面已 cache；未批准則 escalate 並 return；批准但 state 與提案時不同則標成 stale 並 `continue` 重想，否則才真正執行 action。
- `#L47-L52` — 視覺化建議：sequence diagram 會因條件邏輯太複雜而難讀，Inngest 可直接看 loop/check 編號、每步 output 與 metadata。

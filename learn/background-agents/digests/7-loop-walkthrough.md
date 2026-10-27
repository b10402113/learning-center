---
source: sources/background-agents/20261027/7-loop-walkthrough.md
source_type: text
source_lines: 82
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 全流程回顧 — `ingestWorkflow` 只有一個 step，內含最多 8 次的 `for` 迴圈，每輪先取 state 再判斷。
- 決策與安全檢查 — 不好才問 LLM；拿到決策後先記錄 iteration 與 decision，再檢查 wait、complete、request for help、rollback release 等特殊動作。
- 動作在服務端 — 其餘動作直接打 API 執行並記錄，然後回到迴圈頂端重新觀察 state。
- 狀態必須改變 — 動作若沒回寫 state，agent 會失去回饋、反覆懷疑，唯一出路是叫它忽略 state，等於毀掉整套設計。
- 落差與目標檢查 — 「我們認為的完成」與「agent 認為的完成」之間的落差多為自身 bug；必要時可把 `goalSatisfied` 改成 LLM 呼叫。

# L2 detail

- `#L1-L3` — 把整段流程從頭再走一次，確認理解。
- `#L4-L10` — `ingestWorkflow` 只有一個 step，內含最多 8 次的 `for` 迴圈；開頭取得目前 state（checkout service 狀態）並確定性判斷是否為好狀態。
- `#L11-L15` — 不是好狀態就依 goal、state、system prompt 與可選動作詢問 LLM 下一步並要求理由與細節。
- `#L16-L20` — 拿到決策後更新迴圈次數、記錄決策，執行前先跑安全檢查（wait、complete、request for help 等）。
- `#L21-L23` — wait 與 request for help 需要暫停 workflow、通知並無限期等待回覆，屬 ingest 層級特殊處理。
- `#L24-L28` — complete 也需要額外流程（總結、更新、寄信），目前尚未實作所以先 `return`。
- `#L29-L31` — rollback release 不允許無人介入自動執行，先加 `if` 擋下。
- `#L32-L36` — 其他動作直接呼叫服務端 API 執行並記錄，未 return 或丟錯就繼續下一輪。
- `#L37-L41` — 回到迴圈頂端再次觀察 state，確認有什麼改變。
- `#L42-L57` — 狀態沒變時 agent 會像人一樣困惑（CSS 改紅色沒生效的比喻），可能放棄或求助；讓它忽略 state 等於廢掉設計。
- `#L58-L64` — 最後一輪才達標不會漏掉，靠的是確定性檢查；並區分「我們認為的完成」與「agent 認為的完成」。
- `#L65-L69` — 落差通常來自 goal、system prompt 與檢查程式碼的不一致，是開發者要補的 bug。
- `#L70-L76` — `goalSatisfied` 可以改用 LLM：範圍更小、準確率更高，還可換模型；需要實驗而非固定答案。
- `#L77-L82` — 開始實跑：`npm run dev agent`、checkout service 與 app（5173）的啟動與 port 注意事項。

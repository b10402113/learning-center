---
source: sources/background-agents/20261027/24-asking-for-help.md
source_type: text
source_lines: 56
status: skipped
skip_reason: "not taught by any current node"
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 讓求助真的能運作 — agent 已有求救 tool 卻不會用，這一節把 `request for help` 從 wait handler 拆出，給它獨立的 policy 分支。
- help 與 approval 共用 resume 事件 — 兩者都走同一條恢復路徑，但 help 沒有 proposal；用 `inputs` 與 `policy` 區分，input 取自 `decision.detail`。
- 用 `continue` 強迫 agent 重想 — 不直接在此重讀 state，而是回到迴圈頂端重新觀察，因為 `getState` 已把問題與答案一起帶回，等同 React 的 re-render。
- 實測顯示 agent 會自己接線索 — 用 dependency 觸發求救後，人回覆並送進 recovery 事件，agent 自行把事件與答案連起來完成驗證。

# L2 detail

- `#L1-L2` — 本節目標：讓 agent 真的開口求救，而不是只選了「我想求救」卻沒問任何問題。
- `#L3-L11` — 為何推薦讀研究論文：取得沒想過的知識、嘗試重現實驗、建立取捨判斷，也能讓 prompt 寫得更好。
- `#L12-L17` — 切到分支 26，把 `request for help` 從 wait handler 拆出，給它自己的處理分支。
- `#L18-L20` — 移除舊的 `if action equals request for help`，保留 wait、reason 與 not verify 的判斷。
- `#L21-L25` — 讓 policy 同時處理 approval 與 help；若 `inputs` 存在且 policy 為 help，則 input 就是 `decision.detail`（問題內容）。
- `#L26-L35` — policy 為 help 時直接 `continue` 回迴圈頂端，強迫重新觀察；`getState` 本來就會帶回已回答的問題。
- `#L36-L42` — 說明這是在 steer agent；以 React re-render 比喻，避免用零散分支各自讀 state 造成難追。
- `#L43-L51` — 用 dependency 觸發求救測試：run 進入 paused、needs help，問題是請人查 payment gateway 並回報；也意外送出 recovery 事件到 inbox。
- `#L52-L56` — 人回覆後，agent 真的讀到結果並自行連結事件，state 轉為 healthy，驗證後完成。

---
source: sources/real-engineer/20261116/course/096 The Morning Rebase Solution.en.txt
source_type: text
source_lines: 95
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 起點：每天午夜從 git host 抓出「落後於 base」的 PR，並假設同一時區的團隊在午夜不會被打擾（白天跑也行，只是 CI 較忙）。
- orchestrator 先算數量，然後為每個 PR 排一台 runner（而不是一台 runner 處理一百個 PR），且只處理被標記有 conflict 的 PR。
- runner 內第一步是「用腳本確定性地 rebase」，完全沒有 agent；很多 PR 只是 git host 落後於目標分支，直接 rebase、全接受就解決。
- 腳本成功就 force push 回 git host，一個 token 都不用花；只有真的出現 conflict 才即時啟動 agent 修衝突。
- 任何情況下的推送都是 force-with-lease，確保只有在 run 讀取後沒有人再推過才落地。
- 可加第二個觸發：貼上特定 label 就排 runner，因為「一天一次午夜」對某些團隊不夠快。
- 非 happy path：若 agent 修不了、或 PR 已被 main 上的工作取代，就開 ticket 給人，並在 git host 把 PR 標成 blocked；orchestrator 只調度未被 blocked 的 PR。
- 這條 flow 教會我們的是：多重觸發、orchestrator 端過濾、確定性優先於 agent、處理錯誤路徑、以及 ticket tracker 與 git host 的狀態同步。

# L2 detail

- `#L1-L12` — 起點與假設：每天午夜從 git host 抓出與 base 不同步的 PR；假設同一個時區時午夜是安全時段，白天跑也可但 CI 較忙；orchestrator 統計數量後為每個 PR 排一台 runner，且只處理被 git host 標為有 conflict 的 PR。
- `#L13-L32` — runner 內的確定性優先：先以腳本嘗試 rebase，此刻完全沒有 agent；許多 PR 只是 git host 與目標分支不同步，手動 rebase、全接受即可；成功就 force push 回 git host，零 token 成本；只有真的 conflict 才啟動 agent 修，修好同樣 force push（一律 force-with-lease，確保讀取後沒人再推才落地）。
- `#L33-L56` — 第二個觸發與 non-happy path：貼 label 也能排 runner，因為一天一次不足以應付「合併一個 PR 讓另一個衝突」的即時需求；若 agent 修不了 conflict、或 PR 已被 main 取代，就開 ticket 給人，並在 git host 標 blocked，orchestrator 只調度未 blocked 的 PR；blocked label 也方便人一眼分辨 PR 是否仍有效。
- `#L57-L70` — 加速與減速：主要變數是 loop 頻率（每兩天、每週、或達到一定 PR 數才跑）與每次抓取的 PR 數量；作者承認 one-runner-per-PR 有點懶，但因為連跑腳本也需要程式碼與 runner，而 runner 很便宜，就維持簡單做法。
- `#L71-L95` — 總結：可以有多個觸發（label 或每日排程）、orchestrator 端要過濾、runner 內有複雜分支、且最重要的是「有 determinism 就先試」。錯誤路徑要想清楚，人是最後才介入；同時要記得 ticket tracker 與 git host 兩邊狀態要同步，否則使用者會看到互相矛盾的資訊；結尾點出「早上醒來所有 PR 都 ready」這種基本功最實用。

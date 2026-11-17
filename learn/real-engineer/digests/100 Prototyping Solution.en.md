---
source: sources/real-engineer/20261116/course/100 Prototyping Solution.en.txt
source_type: text
source_lines: 73
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 新增第三條分支：exploration 判定「需要 prototype」時，啟動 prototype runner，等 prototype 真正產生後才在 tracker 留言。
- prototype 的程式碼要放在 git host，通常是一個標記清楚的 draft PR，讓大家知道不要 merge。
- 理想上 prototype 要部署出去，非技術人員只要點連結就能瀏覽、操作、給回饋，不必碰程式碼。
- 迭代迴圈：人看過後在 ticket 留言並明確 tag agent，orchestrator 再啟動一台 prototype runner，帶著既有 prototype 與所有歷史留言重新產生或更新。
- 也就是說 tracker 上的留言序列本身就是對話歷史，是 runner 重建 prototype 的 context。
- orchestrator 因此要能分辨兩種訊號：已有既有 prototype，與完全沒有 prototype。
- 還要補一條人類入口：讓人在 issue 上貼 `needs prototype` label 就能直接觸發，不必等 agent 自己判斷。
- 學到的通則：runner 可同時負責「建立或更新」、orchestrator 要追蹤對話、有 agent 觸發路徑時通常也需要人類觸發路徑，而 ticket tracker 是最佳人機溝通介面。

# L2 detail

- `#L1-L14` — 第三條分支與首次產出：exploration 判定需要 prototype 就啟動 prototype runner；等 prototype 真正建好後才在 tracker 留言（順序很重要），理想上還會部署出去讓非技術人員點擊瀏覽；prototype 程式碼放 git host，通常是一個明確標記的 draft PR，提醒不要 merge。
- `#L15-L31` — 迭代迴圈：人看過部署後的成品（多半不看程式碼），也在 tracker 收到通知；接著在 ticket 留 follow-up 並明確 tag agent，orchestrator 再啟動新的 prototype runner，帶著既有 prototype 與至今所有留言，因此 tracker 的留言串就是對話歷史，也是重建 prototype 所需的 context；runner 的任務因此改為 create/update。
- `#L32-L43` — orchestrator 的雙訊號與人類入口：orchestrator 要能分辨「已有 prototype」與「完全沒有 prototype」兩種訊號；此外補上 ticket watcher，讓人貼 `needs prototype` 就能觸發，不必等 agent 自行判定。
- `#L44-L73` — 價值與通則：這條 flow 讓非技術人員完全透過 ticket tracker 做出可運作 prototype，不需本地環境或專業知識，成品是 git host 上的 draft PR，開發者同時取得整段意見歷史；作者認為應視為「非常詳細的 spec」而非可直接上線的程式碼，仍要經過正式 code review 或 grilling／wayfinding。設計通則：runner 可負責 create/update、orchestrator 需追蹤對話（複雜但不難做）、有 agent 觸發就要有人類觸發，而 ticket tracker 是最強的人機溝通工具。

---
source: sources/real-engineer/20261116/course/091 Improve Codebase Architecture.en.txt
source_type: text
source_lines: 27
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 第一個要設計的 flow 是把 code base design 章節暗示的「自動持續改善 codebase」流程化。
- 這帶出 orchestrator 的一項關鍵能力：它可以跑 loop，依排程（一天、一小時、一分鐘）主動 spawn 程序去排 runner、動 ticket tracker、或開 PR。
- 目標是每天產出一組 repo 改善建議；但「建議以什麼形式送達」是留給學習者決定的設計題。
- 開放決策包含：最後該以 PR 還是 ticket 收尾、人在哪一步接手、人接手後要做什麼。
- 評圖管道是 Discord；可以截圖貼上。
- 最重要的思考點是「油門」：好的工廠要慢慢起步以確認煞車有效，那麼要引入哪些變數才能加速、又能在太快時減速。

# L2 detail

- `#L1-L10` — 把 code base design 章節暗示的自動改善流程變成軟體工廠的第一個 flow；這需要 orchestrator 具備 loop 能力——按每日／每小時／每分鐘的排程去 spawn 程序、排 runner、動 ticket tracker 或開 PR。
- `#L11-L19` — 具體目標：每天產出一組 repo 改善建議；解讀方式與收尾形式（開 PR 或開 ticket）由學習者決定，並要想清楚人在哪個節點接手、接手後做什麼；有問題就截圖丟 Discord 討論。
- `#L20-L27` — 核心思考題是加速器：工廠應該慢慢起步以驗證煞車，那麼系統裡有哪些可調變數可以加快、或在意外的時候放慢。

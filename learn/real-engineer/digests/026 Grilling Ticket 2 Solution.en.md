---
source: sources/real-engineer/20261116/course/026 Grilling Ticket 2 Solution.en.txt
source_type: text
source_lines: 61
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L30
---

# L1 overview

- 實作場：在新 session 用 Wayfinder 跑 issue 16（選供應商），只有六個問題，很快結束。
- 作者指出「要不要承諾用 Knock」這題的 fidelity 不對：要註冊、玩過、看過 prototype 才真能判斷，因此先試但保留換方向的空間。
- 額外註冊成本（web push 需 Firebase 專案因為走 FCM；Knock、Courier、MagicBell 的 email 都要自己接 provider）被延後，等真的需要再註冊。
- 一個 prototype 不夠：UI 版型和「供應商是否合用」是兩件事，所以同意拆成兩張 prototype ticket，可分開 worktree 同時做。
- 備案是 Courier；map 增加新的 blocking 關係：prototype 被「註冊供應商並申請 dev keys」卡住。
- 這一節示範 map 會隨學習擴張：新增 decision、task、prototype、grilling 共數張 ticket。

# L2 detail

- `#L1-L10` — 開新 session、跑 Wayfinder issue 16；第一問是是否承諾 Knock，作者回覆要等註冊、實玩、看過 prototype 才能承諾，先試但保留轉向。
- `#L11-L24` — 第二問是額外註冊（web push 需 Firebase 專案、各家 email 都要自接 provider），決議先不註冊服務，等確認需要再說；第三問是每月 250 美元的價格斷崖，作者接受。
- `#L25-L48` — 作者觀察這種「只能透過討論才發現」的霧；第四問指出既有 UI prototype ticket 與供應商適配性不同，兩人同意拆成兩張 prototype；第五問備案是 Courier；第六問決定 graph 形狀（prototype 被註冊與 dev keys 卡住），作者接受建議；決策記到 ticket 上。
- `#L49-L61` — 回看 map：多了一條 decision（選供應商），新增一張 task ticket 與另一張 grilling，兩張 prototype 排在很後面（19 與 21），#21 可見 blocked by「註冊供應商與申請 dev keys」，因此下一張該做 task ticket；重點結論是 map 會隨學習與決策持續擴張。

---
source: sources/real-engineer/20261116/course/020 Charting The Way.en.txt
source_type: text
source_lines: 141
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L55
  - cohort-005-project.6.part.md#L1-L45
---

# L1 overview

- Wayfinder 用兩個資料結構：一個 `map` issue，加上掛在它底下的 decision ticket；兩者都是 issue tracker 裡的 ticket（示範用 GitHub issues）。
- `destination` 是第一個 session 就要決定的事，命名 destination 是 charting 的第一個動作，它會塑造之後每一張 ticket。
- 做程式工作時 destination 建議設成一份 spec；非程式工作也可以（作者這門課的 map，destination 就是完成品課程）。
- `map` 本身就是低解析度的索引：存放 destination、一般筆記、decisions so far，以及 `fog of war`（尚未釐清的部分）；fog of war 的意思是你一次只看得到眼前幾個決策，做決定才會揭開更多決策，map 因此逐步擴張。
- ticket 之間可以有 `blocking` 關係，用 issue tracker 原生的 dependency（GitHub 的 blocked by）；全部 blocking ticket 關閉後才 unblocked，而 `frontier` 就是「open、unblocked、unclaimed」的 children，也就是現在可以同時動工的 ticket。
- 四種 ticket：grilling（預設，一個 session 的問答）、prototype（拉高 fidelity 看東西動起來）、research（取回外部資訊，AFK 由 subagent 立刻處理）、task（決策前必須完成的人工步驟）。
- 用法有兩種模式：給 Wayfinder 一段 prompt 就建新 map 並 grilling 定 destination；在新 session 給 ticket 編號就跑那一張 ticket。

# L2 detail

- `#L1-L9` — 安裝 skill；開場點出「一個太龐大的鬆散想法被霧包住」，並介紹兩個資料結構：map 與它的 decision tickets，兩者都是 issue tracker 上的 ticket。
- `#L10-L20` — map 是一個 GitHub issue，decision ticket 是它的 child issue；一次解一張，全部關閉後 map 就緒；而 destination 是第一個 session 決定的事。
- `#L21-L33` — destination 隨工作而異，命名它是 charting 的第一個動作並塑造所有 ticket；Wayfinder 也能用於非程式工作（本課程的 map，destination 是完成品課程）；做程式工作時慣例上把 destination 設為 spec，之後再交給 agent 實作。
- `#L34-L45` — grilling 適合範圍明確的小事，Wayfinder 適合可產出大 spec 的大專案；map 是單一 issue、標籤 Wayfinder map，ticket 是 child issues；map 是所有已做決策的索引，toSpec 產出的 spec 會以 map 為入口。
- `#L46-L58` — map 是低解析度視圖，含 destination、一般筆記、decisions so far 與 fog of war；fog of war 定義：你不可能看見整張棋盤，只能看到眼前幾個決策，走過去才揭露更多。
- `#L59-L70` — ticket 之間可有 blocking 關係，可用 issue tracker 原生 dependency（GitHub blocked by）；當所有 blocking ticket 都關閉，這張 ticket 就 unblocked。
- `#L71-L90` — 定義 frontier：open、unblocked、unclaimed 的 children，可同時進行；示範 #4 被 #2、#3 卡住，而 #2、#3 就是 frontier；做決定會生出新 ticket（如 #5），最後形成 DAG；map 可到 50、60 張 ticket。
- `#L91-L126` — 四種 ticket 的用途：grilling ticket 最常見，就是一個 session 的 grill with docs；prototype ticket 用便宜粗糙的具體 artifact 拉高 fidelity（呼叫 prototype skill）；research ticket 取回本地沒有的第三方資訊或事實，AFK 由 subagent 立即解掉並附上研究；task ticket 是決策前必須完成的人工工作，會產出一份可照做的步驟清單。
- `#L127-L141` — 兩種模式：只給 prompt 就建新 map 並用 grilling 定 destination；在新 session 給 ticket 編號，就跑那張 ticket；最後提示去看頁面底部的測驗。

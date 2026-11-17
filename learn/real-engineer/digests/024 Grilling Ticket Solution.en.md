---
source: sources/real-engineer/20261116/course/024 Grilling Ticket Solution.en.txt
source_type: text
source_lines: 81
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L30
---

# L1 overview

- 實作場：Wayfinder 先 claim 這張 grilling ticket，讀 glossary、抓所有 issue 與相依關係，整理出需要的 facts。
- 共十五個問題，作者大多直接同意建議，少數自己改：enrollment 通知要可 per instructor 客製；退款 payout 在 glossary 有定義但程式沒實作，放進 not yet specified。
- 術語決策：把 question／reply 改成 discussion question／discussion reply，避免和 quiz question 撞名。
- enrolled student 不加課時通知；enrollment 通知預設關閉但仍可開。
- 結束時把整份決策目錄當成 resolution 貼在 ticket 上並關閉，map 的 decisions so far 得到一條摘要。
- 學到的節奏：grilling 只在 smart zone 做決策，不在這個 session 順手實作。

# L2 detail

- `#L1-L9` — 開場看到它 claim Wayfinder grilling、跑 shell 指令讀 glossary 與所有 issue、理解 dependency、從程式碼整理出 facts；接著以標準問題開場。
- `#L10-L28` — 問題 1–3：通知的定義切法、退款申請結果、退款與 platform admin 的通知；作者指出問題措辭漂亮地沿用了既有的領域模型。
- `#L29-L46` — 問題 4–7：退款 payout 在 glossary 有但程式沒有，故放入 not yet specified；claim 座位與 team admin 同意；講師的新選課通知要可客製（有人覺得受肯定、有人覺得煩）；question／reply 改名為 discussion question／discussion reply 以免與 quiz question 衝突，並更新 glossary.md。
- `#L47-L60` — 問題 8–15：課程被評分、新課程單元、platform admin 通知、enrollment 通知預設值、哪些選課算數、誰收到 discussion reply、編輯或刪除是否發通知、來自 platform admin 或其他講師的討論問題；全部同意建議。
- `#L61-L81` — 達到共識後把完整決策目錄作為 resolution 貼上並關閉 ticket；作者強調這讓 grilling 留在 smart zone、不必把 grill 變成實作 session；回到 map 可見 decisions so far 多了這條摘要，下一張（編號 16）也是 grilling ticket。

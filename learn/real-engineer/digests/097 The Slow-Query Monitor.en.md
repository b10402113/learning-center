---
source: sources/real-engineer/20261116/course/097 The Slow-Query Monitor.en.txt
source_type: text
source_lines: 25
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 幾乎每個應用都有外部監控來源：error 回報、ticket tracker 整合，而作者最常用的是資料庫的 query monitor。
- 作者自認不是資料庫專家，常需要協助判斷該加什麼 index、schema 怎麼設計才快。
- 這個 exercise 假設 slow query monitor 已經接到 orchestrator，有慢查詢就送 alert。
- 核心困難：不知道這個 monitor 多久 ping 一次；若很頻繁，每個 alert 都 spawn runner 會白白燒 token。
- 這是典型的「高頻、不可控的外部輸入」設計題：輸入源會 push，工廠必須設計得足夠 robust 才不會被打爆。

# L2 detail

- `#L1-L8` — 問題背景：幾乎每個應用都有外部監控來源，例如 error 回報、ticket tracker 整合；作者最常用的是資料庫的 query monitor。
- `#L9-L16` — 為何需要它：作者自認不是資料庫專家，常需要協助判斷該加什麼 index、schema 怎麼設計才快；本題假設 monitor 已接上 orchestrator，有慢查詢就送 alert，orchestrator 會收到通知。
- `#L17-L25` — 設計挑戰：monitor 的觸發頻率未知，若很頻繁則每個 alert 各開一台 runner 會白白燒 token；因此這是「輸入源會 push、工廠必須 robust 不被打爆」的典型設計題，也是本次練習的核心。
